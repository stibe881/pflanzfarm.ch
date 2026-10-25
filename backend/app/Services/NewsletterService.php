<?php

namespace App\Services;

use App\Mail\NewsletterCampaignMail;
use App\Models\NewsletterCampaign;
use App\Models\NewsletterSend;
use App\Models\NewsletterSubscriber;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class NewsletterService
{
    /** Stellt den Newsletter für alle bestätigten Abonnenten in die Warteschlange (je Adresse nur einmal). */
    public function send(NewsletterCampaign $campaign): int
    {
        $claimed = DB::transaction(function () use ($campaign) {
            $fresh = NewsletterCampaign::query()->lockForUpdate()->find($campaign->id);
            if (! $fresh || $fresh->sent_at) {
                return false;
            }
            $fresh->update(['sent_at' => now(), 'scheduled_at' => null]);

            return true;
        });
        if (! $claimed) {
            return 0;
        }

        $count = 0;
        NewsletterSubscriber::query()->where('status', 'bestaetigt')->chunkById(200, function ($subs) use ($campaign, &$count) {
            foreach ($subs as $sub) {
                $send = NewsletterSend::query()->firstOrCreate(
                    ['newsletter_campaign_id' => $campaign->id, 'email' => $sub->email],
                    ['newsletter_subscriber_id' => $sub->id],
                );
                if ($send->wasRecentlyCreated) {
                    Mail::to($sub->email)->queue(new NewsletterCampaignMail($campaign, $sub, $send->id));
                    $count++;
                }
            }
        });
        $campaign->update(['recipients' => $count]);

        return $count;
    }

    /** Geplante Newsletter, deren Zeitpunkt erreicht ist. */
    public function sendScheduled(): int
    {
        return NewsletterCampaign::query()->whereNull('sent_at')->whereNotNull('scheduled_at')->where('scheduled_at', '<=', now())
            ->get()->sum(fn (NewsletterCampaign $c) => $this->send($c));
    }

    /** Kennzahlen für die Übersicht. */
    public static function stats(NewsletterCampaign $campaign): array
    {
        $row = $campaign->sends()->selectRaw('COUNT(*) as total, COUNT(sent_at) as sent, COUNT(opened_at) as opened, COUNT(clicked_at) as clicked, COUNT(bounced_at) as bounced, COUNT(unsubscribed_at) as unsubscribed')->first();
        $sent = max(1, (int) $row->sent);

        return [
            'total' => (int) $row->total,
            'sent' => (int) $row->sent,
            'opened' => (int) $row->opened,
            'clicked' => (int) $row->clicked,
            'bounced' => (int) $row->bounced,
            'unsubscribed' => (int) $row->unsubscribed,
            'open_rate' => (int) round($row->opened / $sent * 100),
            'click_rate' => (int) round($row->clicked / $sent * 100),
        ];
    }
}
