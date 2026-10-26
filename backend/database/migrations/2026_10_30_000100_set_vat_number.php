<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    // UID / MWST-Nummer der Pflanzfarm übernehmen, falls im Admin noch keine eingetragen ist
    public function up(): void
    {
        if (! Setting::get('vat_number')) {
            Setting::put('vat_number', 'CHE-214.008.517');
        }
    }

    public function down(): void {}
};
