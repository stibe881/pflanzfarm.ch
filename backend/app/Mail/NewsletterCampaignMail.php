<?php

namespace App\Mail;

use App\Models\NewsletterCampaign;
use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;

class NewsletterCampaignMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public NewsletterCampaign $campaign, public NewsletterSubscriber $subscriber, public ?int $sendId = null) {}

    private function unsubscribeUrl(): string
    {
        return route('newsletter.unsubscribe', array_filter(['token' => $this->subscriber->token, 's' => $this->sendId]));
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->campaign->subject, metadata: array_filter(['send_id' => $this->sendId ? (string) $this->sendId : null]));
    }

    public function headers(): Headers
    {
        $url = $this->unsubscribeUrl();

        return new Headers(text: array_filter([
            'List-Unsubscribe' => '<'.$url.'>',
            'List-Unsubscribe-Post' => 'List-Unsubscribe=One-Click',
            // für die Statistik (siehe TrackNewsletter)
            'X-Pflanzfarm-Send' => $this->sendId ? (string) $this->sendId : null,
        ]));
    }

    public function content(): Content
    {
        return new Content(markdown: 'mail.newsletter', with: [
            'campaign' => $this->campaign,
            'unsubscribeUrl' => $this->unsubscribeUrl(),
        ]);
    }
}
