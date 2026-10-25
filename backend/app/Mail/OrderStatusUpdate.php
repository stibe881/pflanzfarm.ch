<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderStatusUpdate extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order, public ?string $message = null) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Bestellung '.$this->order->number.': '.$this->order->statusLabel());
    }

    public function content(): Content
    {
        return new Content(markdown: 'mail.order-status', with: ['order' => $this->order, 'note' => $this->message]);
    }
}
