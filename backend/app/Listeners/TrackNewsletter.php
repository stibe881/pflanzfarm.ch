<?php

namespace App\Listeners;

use App\Models\NewsletterSend;
use Illuminate\Mail\Events\MessageSent;
use Resend\Laravel\Events\EmailBounced;
use Resend\Laravel\Events\EmailClicked;
use Resend\Laravel\Events\EmailComplained;
use Resend\Laravel\Events\EmailOpened;

/**
 * Newsletter-Statistik: Beim Versand merken wir uns die Resend-Mail-ID,
 * über den Resend-Webhook kommen danach Öffnungen, Klicks und Bounces.
 */
class TrackNewsletter
{
    public function sent(MessageSent $event): void
    {
        $headers = $event->message->getHeaders();
        if (! $headers->has('X-Pflanzfarm-Send')) {
            return;
        }
        $original = $event->sent->getSymfonySentMessage()->getOriginalMessage();
        $resendId = method_exists($original, 'getHeaders') && $original->getHeaders()->has('X-Resend-Email-ID')
            ? $original->getHeaders()->get('X-Resend-Email-ID')->getBodyAsString() : null;

        NewsletterSend::query()->whereKey((int) $headers->get('X-Pflanzfarm-Send')->getBodyAsString())
            ->update(array_filter(['sent_at' => now(), 'message_id' => $resendId]));
    }

    public function opened(EmailOpened $event): void
    {
        $this->mark($event->payload, 'opened_at');
    }

    public function clicked(EmailClicked $event): void
    {
        $this->mark($event->payload, 'clicked_at', alsoOpened: true);
    }

    public function bounced(EmailBounced|EmailComplained $event): void
    {
        $this->mark($event->payload, 'bounced_at');
    }

    private function mark(array $payload, string $column, bool $alsoOpened = false): void
    {
        $id = $payload['data']['email_id'] ?? null;
        $tags = $payload['data']['tags'] ?? [];
        // Resend liefert Tags je nach Version als Objekt oder als Liste von {name, value}
        $sendId = $tags['send_id'] ?? collect($tags)->firstWhere('name', 'send_id')['value'] ?? null;

        $send = $sendId ? NewsletterSend::query()->find((int) $sendId) : null;
        $send ??= $id ? NewsletterSend::query()->where('message_id', $id)->first() : null;
        if (! $send) {
            return;
        }
        $update = [$column => $send->{$column} ?? now()];
        if ($alsoOpened) {
            $update['opened_at'] = $send->opened_at ?? now();
        }
        $send->update($update);
    }
}
