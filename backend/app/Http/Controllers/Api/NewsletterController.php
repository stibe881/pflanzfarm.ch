<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewsletterConfirmation;
use App\Models\NewsletterSend;
use App\Models\NewsletterSubscriber;
use App\Support\SafeMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NewsletterController extends Controller
{
    public function subscribe(Request $request): JsonResponse
    {
        $data = $request->validate(['email' => ['required', 'email:rfc', 'max:160'], 'source' => ['nullable', 'string', 'max:40']]);
        $email = Str::lower(trim($data['email']));

        $subscriber = NewsletterSubscriber::query()->firstOrNew(['email' => $email]);
        if ($subscriber->exists && $subscriber->status === 'bestaetigt') {
            return response()->json(['ok' => true, 'status' => 'bestaetigt']);
        }
        $subscriber->fill(['status' => 'ausstehend', 'source' => $data['source'] ?? 'website', 'token' => Str::random(48)])->save();
        SafeMail::send($email, new NewsletterConfirmation($subscriber));

        return response()->json(['ok' => true, 'status' => 'ausstehend']);
    }

    public function confirm(string $token): RedirectResponse
    {
        $subscriber = NewsletterSubscriber::query()->where('token', $token)->first();
        if (! $subscriber) {
            return redirect('/?newsletter=ungueltig');
        }
        $subscriber->update(['status' => 'bestaetigt', 'confirmed_at' => $subscriber->confirmed_at ?? now(), 'unsubscribed_at' => null]);

        return redirect('/?newsletter=bestaetigt');
    }

    public function unsubscribe(Request $request, string $token): RedirectResponse|JsonResponse
    {
        $subscriber = NewsletterSubscriber::query()->where('token', $token)->first();
        $subscriber?->update(['status' => 'abgemeldet', 'unsubscribed_at' => now()]);
        if ($subscriber && $request->integer('s')) {
            NewsletterSend::query()->whereKey($request->integer('s'))->where('email', $subscriber->email)
                ->whereNull('unsubscribed_at')->update(['unsubscribed_at' => now()]);
        }

        // One-Click-Abmeldung (RFC 8058) kommt per POST vom Mailprogramm
        if ($request->isMethod('post')) {
            return response()->json(['ok' => true]);
        }

        return redirect('/?newsletter=abgemeldet');
    }
}
