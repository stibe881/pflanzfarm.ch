<?php

namespace App\Mail;

use App\Models\MailOptOut;
use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class CareTips extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order, public Collection $articles, public ?string $reviewUrl = null) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Wie geht es Ihren neuen Pflanzen?');
    }

    public function headers(): Headers
    {
        return new Headers(text: ['List-Unsubscribe' => '<'.MailOptOut::url($this->order->email).'>']);
    }

    public function content(): Content
    {
        return new Content(markdown: 'mail.care-tips', with: [
            'order' => $this->order,
            'articles' => $this->articles,
            'reviewUrl' => $this->reviewUrl,
            'optOutUrl' => MailOptOut::url($this->order->email),
        ]);
    }
}
