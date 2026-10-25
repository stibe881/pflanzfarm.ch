<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\CustomerCancelledOrder;
use App\Mail\OrderStatusUpdate;
use App\Models\NewsletterSubscriber;
use App\Models\Order;
use App\Models\Setting;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;

class AccountController extends Controller
{
    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $request->user() ? self::user($request->user()) : null]);
    }

    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:160', 'unique:users,email'],
            'password' => ['required', 'confirmed', PasswordRule::min(10)],
            'phone' => ['nullable', 'string', 'max:40'],
        ]);

        $user = User::query()->create([...$data, 'email' => Str::lower($data['email']), 'role' => 'customer']);
        event(new Registered($user));
        Auth::login($user);
        $request->session()->regenerate();

        return response()->json(['user' => self::user($user)], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate(['email' => ['required', 'email'], 'password' => ['required', 'string']]);

        if (! Auth::guard('web')->attempt(['email' => Str::lower($data['email']), 'password' => $data['password']], $request->boolean('remember'))) {
            throw ValidationException::withMessages(['email' => 'E-Mail-Adresse oder Passwort ist falsch.']);
        }
        $request->session()->regenerate();

        // Team-Konten (Admin/Team) landen direkt im Adminbereich
        $user = Auth::guard('web')->user();

        return response()->json(array_filter([
            'user' => self::user($user),
            'redirect' => $user->isTeam() ? '/admin' : null,
        ]));
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['ok' => true]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:40'],
            'street' => ['nullable', 'string', 'max:160'],
            'postal_code' => ['nullable', 'string', 'max:12'],
            'city' => ['nullable', 'string', 'max:120'],
        ]);
        $user->update($data);

        if ($request->filled('password')) {
            $request->validate([
                'current_password' => ['required', 'current_password'],
                'password' => ['required', 'confirmed', PasswordRule::min(10)],
            ]);
            $user->update(['password' => $request->input('password')]);
        }

        return response()->json(['user' => self::user($user->fresh())]);
    }

    public function resendVerification(Request $request): JsonResponse
    {
        if (! $request->user()->hasVerifiedEmail()) {
            $request->user()->sendEmailVerificationNotification();
        }

        return response()->json(['ok' => true]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);
        Password::sendResetLink(['email' => Str::lower($request->input('email'))]);

        // Immer gleiche Antwort, damit nicht erkennbar ist, ob ein Konto existiert
        return response()->json(['ok' => true]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', PasswordRule::min(10)],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill(['password' => Hash::make($password), 'remember_token' => Str::random(60)])->save();
                $user->email_verified_at ??= now();
                $user->save();
                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages(['email' => 'Der Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen an.']);
        }

        return response()->json(['ok' => true]);
    }

    public function orders(Request $request): JsonResponse
    {
        return response()->json([
            'orders' => $request->user()->orders()->with('items')->latest()->get()->map(fn (Order $o) => OrderController::summary($o)),
        ]);
    }

    /** Storno durch die Kundschaft, solange die Bestellung noch nicht bestätigt ist. Bezahlte Beträge werden erstattet. */
    public function cancelOrder(Request $request, string $number, OrderService $orders): JsonResponse
    {
        $order = $request->user()->orders()->where('number', $number)->firstOrFail();
        if (! $order->isCancellableByCustomer()) {
            return response()->json(['message' => 'Diese Bestellung ist bereits bestätigt. Bitte rufen Sie uns an: +41 79 336 14 95.'], 422);
        }
        $orders->cancel($order, refund: true, by: 'kunde');
        $order->refresh();
        $order->mailCustomer(new OrderStatusUpdate($order));
        if ($notify = Setting::get('notify_email')) {
            Mail::to($notify)->send(new CustomerCancelledOrder($order));
        }

        return response()->json(['order' => OrderController::summary($order->load('items'))]);
    }

    /** Datenauskunft nach DSG: alle zur Person gespeicherten Daten als JSON. */
    public function export(Request $request): JsonResponse
    {
        return response()->json(self::exportData($request->user()))
            ->header('Content-Disposition', 'attachment; filename="pflanzfarm-meine-daten.json"');
    }

    public function destroy(Request $request): JsonResponse
    {
        $request->validate(['password' => ['required', 'current_password']]);
        $user = $request->user();
        Auth::guard('web')->logout();
        self::deleteUser($user);
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['ok' => true]);
    }

    public static function exportData(User $user): array
    {
        return [
            'exportiert_am' => now()->toIso8601String(),
            'konto' => $user->only(['name', 'email', 'phone', 'street', 'postal_code', 'city', 'created_at', 'email_verified_at']),
            'newsletter' => NewsletterSubscriber::query()->where('email', $user->email)->first()?->only(['email', 'status', 'confirmed_at', 'unsubscribed_at', 'created_at']),
            'bestellungen' => $user->orders()->with('items')->get()->map(fn (Order $o) => [
                ...$o->only(['number', 'created_at', 'status', 'payment_method', 'payment_status', 'delivery_method', 'name', 'email', 'phone', 'street', 'postal_code', 'city', 'note']),
                'total_chf' => $o->total / 100,
                'artikel' => $o->items->map(fn ($i) => [$i->product_name, $i->variant_label, $i->quantity, $i->line_total / 100]),
            ]),
        ];
    }

    /**
     * Löscht Konto und Newsletter-Eintrag. Bestellungen bleiben wegen der
     * gesetzlichen Aufbewahrungspflicht (10 Jahre) erhalten, aber ohne Kontoverknüpfung.
     */
    public static function deleteUser(User $user): void
    {
        NewsletterSubscriber::query()->where('email', $user->email)->delete();
        $user->orders()->update(['user_id' => null]);
        $user->delete();
    }

    public static function user(User $user): array
    {
        return [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'street' => $user->street,
            'postal_code' => $user->postal_code,
            'city' => $user->city,
            'verified' => $user->hasVerifiedEmail(),
        ];
    }
}
