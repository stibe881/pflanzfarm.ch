<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewOrderNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Neue Bestellung '.$this->order->number.' ('.number_format($this->order->total / 100, 2, '.', "'").' CHF)', replyTo: [$this->order->email]);
    }

    public function content(): Content
    {
        return new Content(markdown: 'mail.order-new-admin', with: ['order' => $this->order->loadMissing('items')]);
    }
}
