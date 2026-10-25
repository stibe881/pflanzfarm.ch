<?php

namespace App\Mail;

use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public NewsletterSubscriber $subscriber) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Bitte bestätigen Sie Ihre Newsletter-Anmeldung');
    }

    public function content(): Content
    {
        return new Content(markdown: 'mail.newsletter-confirm', with: [
            'url' => route('newsletter.confirm', $this->subscriber->token),
        ]);
    }
}
