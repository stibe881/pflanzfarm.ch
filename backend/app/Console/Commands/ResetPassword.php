<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class ResetPassword extends Command
{
    protected $signature = 'pflanzfarm:passwort {email : E-Mail-Adresse des Kontos}';

    protected $description = 'Setzt das Passwort eines Kontos neu (Passwort wird abgefragt)';

    public function handle(): int
    {
        $user = User::query()->where('email', strtolower($this->argument('email')))->first();
        if (! $user) {
            $this->error('Kein Konto mit dieser E-Mail-Adresse gefunden.');
            $team = User::query()->whereIn('role', ['admin', 'staff'])->orderBy('email')->get(['email', 'role']);
            if ($team->isEmpty()) {
                $this->line('Es gibt noch kein Konto für den Adminbereich. Anlegen mit: pflanzfarm:team-user name@pflanzfarm.ch "Vorname Name" --role=admin');
            } else {
                $this->line('Vorhandene Konten für den Adminbereich:');
                $this->table(['E-Mail', 'Rolle'], $team->map(fn (User $u) => [$u->email, $u->role])->all());
            }

            return self::FAILURE;
        }

        $password = $this->secret('Neues Passwort (mind. 12 Zeichen, Gross-/Kleinbuchstaben und Zahl)');
        $validator = Validator::make(['password' => $password], ['password' => ['required', Password::min(12)->mixedCase()->numbers()]]);
        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $e) {
                $this->error($e);
            }

            return self::FAILURE;
        }

        $user->forceFill(['password' => $password, 'email_verified_at' => $user->email_verified_at ?? now()])->save();
        $this->info("Passwort für {$user->email} ({$user->role}) neu gesetzt.");

        return self::SUCCESS;
    }
}
