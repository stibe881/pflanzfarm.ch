<?php

namespace App\Services;

use App\Mail\CareTips;
use App\Mail\SeasonalCareTip;
use App\Models\CareReminder;
use App\Models\GuideArticle;
use App\Models\MailOptOut;
use App\Models\Order;
use App\Models\Setting;
use Illuminate\Support\Facades\Mail;

/**
 * Pflege-Mails an bisherige Kundschaft (abbestellbar):
 * einige Tage nach der Lieferung Pflegetipps und Bitte um eine Google-Bewertung,
 * dazu saisonale Erinnerungen aus dem Ratgeber (z. B. im Juni «Jetzt Photinia schneiden»).
 */
class CareMails
{
    public function sendAfterDelivery(): int
    {
        if (! Setting::get('care_mails_enabled')) {
            return 0;
        }
        $days = max(1, (int) Setting::get('care_mail_days'));
        $orders = Order::query()->with('items.variant.product')->where('status', 'geliefert')->whereNull('care_mail_sent_at')
            ->whereNotNull('email')->where('delivered_at', '<=', now()->subDays($days))
            // ältere Bestellungen nicht nachträglich anschreiben
            ->where('delivered_at', '>=', now()->subDays($days + 30))->get();

        $sent = 0;
        foreach ($orders as $order) {
            $order->update(['care_mail_sent_at' => now()]);
            if (MailOptOut::has($order->email)) {
                continue;
            }
            $productIds = $order->items->pluck('variant.product_id')->filter()->unique();
            $articles = GuideArticle::query()->where('published', true)->whereIn('product_id', $productIds)->orderBy('sort')->limit(3)->get();
            if ($articles->isEmpty()) {
                $articles = GuideArticle::query()->where('published', true)->where('slug', 'richtig-giessen')->get();
            }
            $review = (string) Setting::get('google_review_url');
            Mail::to($order->email)->queue(new CareTips($order, $articles, $review ?: null));
            if ($review) {
                $order->update(['review_requested_at' => now()]);
            }
            $sent++;
        }

        return $sent;
    }

    public function sendSeasonal(): int
    {
        if (! Setting::get('seasonal_reminders_enabled')) {
            return 0;
        }
        $month = (int) now()->month;
        $year = (int) now()->year;
        $sent = 0;
        $articles = GuideArticle::query()->where('published', true)->whereNotNull('product_id')->get()
            ->filter(fn (GuideArticle $a) => in_array($month, array_map('intval', (array) $a->remind_months), true));

        foreach ($articles as $article) {
            $emails = Order::query()->where('status', 'geliefert')->whereNotNull('email')->where('delivered_at', '>=', now()->subYears(3))
                ->whereHas('items.variant', fn ($q) => $q->where('product_id', $article->product_id))
                ->pluck('email')->map(fn ($e) => strtolower($e))->unique();
            foreach ($emails as $email) {
                if (MailOptOut::has($email)) {
                    continue;
                }
                $reminder = CareReminder::query()->firstOrCreate(['email' => $email, 'guide_article_id' => $article->id, 'year' => $year]);
                if ($reminder->wasRecentlyCreated) {
                    Mail::to($email)->queue(new SeasonalCareTip($article, $email));
                    $sent++;
                }
            }
        }

        return $sent;
    }
}
