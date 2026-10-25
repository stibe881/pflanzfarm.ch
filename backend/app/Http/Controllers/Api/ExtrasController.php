<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\MailOptOut;
use App\Models\ProductVariant;
use App\Services\StockAlerts;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ExtrasController extends Controller
{
    /** Gutschein- oder Rabattcode prüfen; den Abzug rechnet die Kasse gleich wie der Server. */
    public function coupon(Request $request): JsonResponse
    {
        $data = $request->validate(['code' => ['required', 'string', 'max:40'], 'subtotal' => ['required', 'numeric', 'min:0']]);
        $coupon = Coupon::findByCode($data['code']);
        if (! $coupon) {
            return response()->json(['message' => 'Diesen Code kennen wir nicht. Bitte prüfen Sie die Schreibweise.', 'errors' => ['coupon_code' => ['Diesen Code kennen wir nicht.']]], 422);
        }
        if ($problem = $coupon->problem((int) round($data['subtotal'] * 100))) {
            return response()->json(['message' => $problem, 'errors' => ['coupon_code' => [$problem]]], 422);
        }

        return response()->json(['coupon' => [
            'code' => $coupon->code,
            'type' => $coupon->type,
            'value' => $coupon->type === 'prozent' ? $coupon->value : $coupon->value / 100,
            'balance' => $coupon->type === 'gutschein' ? $coupon->balance / 100 : null,
            'label' => $coupon->label(),
        ]]);
    }

    public function stockAlert(Request $request, StockAlerts $alerts): JsonResponse
    {
        $data = $request->validate(['variant_id' => ['required', 'integer'], 'email' => ['required', 'email:rfc', 'max:160']]);
        $variant = ProductVariant::query()->where('active', true)->findOrFail($data['variant_id']);
        $alerts->subscribe($variant, $data['email']);

        return response()->json(['ok' => true]);
    }

    public function careOptOut(Request $request): RedirectResponse
    {
        $email = strtolower((string) $request->query('e'));
        if ($email && hash_equals(MailOptOut::token($email), (string) $request->query('s'))) {
            MailOptOut::query()->firstOrCreate(['email' => $email]);
        }

        return redirect('/?pflegetipps=abgemeldet');
    }
}
