<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class ResetTestAccounts extends Command
{
    protected $signature = 'pflanzfarm:testkonten';

    protected $description = 'Legt die drei Testkonten (Admin, Team, Kunde) an bzw. setzt ihre Passwörter zurück – nur in der Testumgebung';

    public const ACCOUNTS = [
        ['admin@pflanzfarm.test', 'Thomas Steinmann (Test)', 'admin', 'Pflanzfarm-Test-2026'],
        ['team@pflanzfarm.test', 'Susan Steinmann (Test)', 'staff', 'Pflanzfarm-Test-2026'],
        ['kunde@pflanzfarm.test', 'Erika Muster', 'customer', 'Kunde-Test-2026'],
    ];

    public function handle(): int
    {
        if (! config('pflanzfarm.test_mode')) {
            $this->error('Nur in der Testumgebung möglich (PFLANZFARM_TEST_MODE=true).');

            return self::FAILURE;
        }

        $rows = [];
        foreach (self::ACCOUNTS as [$email, $name, $role, $password]) {
            $user = User::query()->firstOrNew(['email' => $email]);
            $new = ! $user->exists;
            if ($new) {
                $user->fill(['name' => $name]);
                if ($role === 'customer') {
                    $user->fill(['phone' => '079 111 22 33', 'street' => 'Gartenweg 1', 'postal_code' => '6210', 'city' => 'Sursee']);
                }
            }
            $user->forceFill(['role' => $role, 'password' => $password, 'email_verified_at' => $user->email_verified_at ?? now()])->save();
            $rows[] = [$email, $password, $role, $new ? 'neu angelegt' : 'Passwort zurückgesetzt'];
        }
        $this->table(['E-Mail', 'Passwort', 'Rolle', 'Status'], $rows);

        return self::SUCCESS;
    }
}
