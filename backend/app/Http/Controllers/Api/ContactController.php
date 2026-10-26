<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactMessage;
use App\Models\Setting;
use App\Support\SafeMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ContactController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        // Honeypot gegen Spam-Bots
        if ($request->filled('website')) {
            return response()->json(['ok' => true]);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'contact' => ['required', 'string', 'max:160'],
            'email' => ['nullable', 'email', 'max:160'],
            'topic' => ['required', 'string', 'max:120'],
            'place' => ['nullable', 'string', 'max:120'],
            'message' => ['required', 'string', 'max:5000'],
        ]);
        if (empty($data['email']) && filter_var($data['contact'], FILTER_VALIDATE_EMAIL)) {
            $data['email'] = $data['contact'];
        }

        // Die Anfrage existiert nur als E-Mail – schlägt der Versand fehl, muss die Kundschaft es erfahren
        if (! SafeMail::send(Setting::get('notify_email'), new ContactMessage($data))) {
            throw ValidationException::withMessages(['message' => 'Ihre Nachricht konnte gerade nicht gesendet werden. Bitte rufen Sie uns an (079 336 14 95) oder schreiben Sie an info@pflanzfarm.ch.']);
        }

        return response()->json(['ok' => true]);
    }
}
