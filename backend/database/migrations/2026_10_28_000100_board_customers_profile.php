<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Pflanzen-Steckbrief und Filter
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('evergreen')->default(false)->after('traits');
            $table->json('locations')->nullable()->after('evergreen'); // sonne, halbschatten, schatten
            $table->json('uses')->nullable()->after('locations'); // hecke, sichtschutz, naschgarten, kuebel, solitaer, bienen
            $table->unsignedSmallInteger('height_min_cm')->nullable();
            $table->unsignedSmallInteger('height_max_cm')->nullable();
            $table->unsignedSmallInteger('growth_cm')->nullable(); // Zuwachs pro Jahr
            $table->string('hardiness', 40)->nullable();
            $table->json('planting_months')->nullable();
        });

        Schema::table('references', function (Blueprint $table) {
            $table->string('before_image')->nullable()->after('image');
        });

        // Kundenkartei, auch für Telefon-Kundschaft ohne Konto
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('email')->nullable()->unique();
            $table->string('phone', 40)->nullable()->index();
            $table->string('street')->nullable();
            $table->string('postal_code', 12)->nullable();
            $table->string('city')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('customer_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
        });

        // Interne Notizen zu Bestellungen
        Schema::create('order_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->text('body');
            $table->timestamps();
        });

        // Persönliche Admin-Einstellungen, z. B. Liste oder Board
        Schema::table('users', function (Blueprint $table) {
            $table->json('admin_preferences')->nullable();
        });

        // Steckbrief für die mitgelieferten Produkte ergänzen
        $profiles = [
            'thuja-smaragd' => ['evergreen' => true, 'locations' => ['sonne', 'halbschatten'], 'uses' => ['hecke', 'sichtschutz'], 'height_min_cm' => 300, 'height_max_cm' => 500, 'growth_cm' => 25, 'hardiness' => 'bis −30 °C', 'planting_months' => [3, 4, 5, 9, 10, 11]],
            'photinia-fraseri-red-robin' => ['evergreen' => true, 'locations' => ['sonne', 'halbschatten'], 'uses' => ['hecke', 'sichtschutz', 'solitaer'], 'height_min_cm' => 200, 'height_max_cm' => 400, 'growth_cm' => 35, 'hardiness' => 'bis −15 °C', 'planting_months' => [3, 4, 5, 9, 10]],
            'diverse-beerenstraeucher' => ['evergreen' => false, 'locations' => ['sonne', 'halbschatten'], 'uses' => ['naschgarten', 'kuebel', 'bienen'], 'height_min_cm' => 100, 'height_max_cm' => 150, 'growth_cm' => 30, 'hardiness' => 'bis −25 °C', 'planting_months' => [3, 4, 10, 11]],
        ];
        foreach ($profiles as $slug => $p) {
            DB::table('products')->where('slug', $slug)->whereNull('locations')->update(array_map(fn ($v) => is_array($v) ? json_encode($v) : $v, $p));
        }

        // Bestehende Bestellungen der Kundenkartei zuordnen
        foreach (DB::table('orders')->orderBy('id')->get() as $o) {
            $email = $o->email ? strtolower($o->email) : null;
            $customer = $email ? DB::table('customers')->where('email', $email)->first()
                : ($o->phone ? DB::table('customers')->whereNull('email')->where('phone', $o->phone)->first() : null);
            $data = ['name' => $o->name, 'phone' => $o->phone, 'street' => $o->street, 'postal_code' => $o->postal_code, 'city' => $o->city, 'user_id' => $o->user_id, 'updated_at' => now()];
            if ($customer) {
                DB::table('customers')->where('id', $customer->id)->update(array_filter($data));
                $id = $customer->id;
            } else {
                $id = DB::table('customers')->insertGetId($data + ['email' => $email, 'created_at' => $o->created_at ?? now()]);
            }
            DB::table('orders')->where('id', $o->id)->update(['customer_id' => $id]);
        }
    }

    public function down(): void
    {
        Schema::table('users', fn (Blueprint $t) => $t->dropColumn('admin_preferences'));
        Schema::dropIfExists('order_notes');
        Schema::table('orders', fn (Blueprint $t) => $t->dropConstrainedForeignId('customer_id'));
        Schema::dropIfExists('customers');
        Schema::table('references', fn (Blueprint $t) => $t->dropColumn('before_image'));
        Schema::table('products', fn (Blueprint $t) => $t->dropColumn(['evergreen', 'locations', 'uses', 'height_min_cm', 'height_max_cm', 'growth_cm', 'hardiness', 'planting_months']));
    }
};
