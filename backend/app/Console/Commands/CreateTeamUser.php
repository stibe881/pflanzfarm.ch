<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class CreateTeamUser extends Command
{
    protected $signature = 'pflanzfarm:team-user {email} {name} {--role=admin : admin oder staff}';

    protected $description = 'Legt ein Konto für den Adminbereich an (Passwort wird abgefragt)';

    public function handle(): int
    {
        $password = $this->secret('Passwort (mind. 12 Zeichen)');
        $validator = Validator::make(
            ['email' => $this->argument('email'), 'password' => $password, 'role' => $this->option('role')],
            ['email' => ['required', 'email', 'unique:users,email'], 'password' => ['required', Password::min(12)->mixedCase()->numbers()], 'role' => ['in:admin,staff']]
        );
        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $e) {
                $this->error($e);
            }

            return self::FAILURE;
        }

        $user = User::query()->create([
            'email' => strtolower($this->argument('email')),
            'name' => $this->argument('name'),
            'password' => $password,
            'role' => $this->option('role'),
        ]);
        $user->forceFill(['email_verified_at' => now()])->save();
        $this->info("Konto {$user->email} ({$user->role}) angelegt. Login unter /admin.");

        return self::SUCCESS;
    }
}
