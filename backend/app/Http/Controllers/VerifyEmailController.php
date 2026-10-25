<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /** Bestätigt die E-Mail-Adresse auch dann, wenn der Link auf einem anderen Gerät geöffnet wird. */
    public function __invoke(string $id, string $hash): RedirectResponse
    {
        $user = User::query()->findOrFail($id);
        abort_unless(hash_equals(sha1($user->getEmailForVerification()), $hash), 403);

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            event(new Verified($user));
        }

        return redirect($user->isTeam() ? '/admin' : '/konto/?verifiziert=1');
    }
}
