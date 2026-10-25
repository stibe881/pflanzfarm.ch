<?php

namespace App\Mail;

use App\Models\Order;
use App\Services\InvoicePdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Attachment;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Ihre Bestellung '.$this->order->number.' bei der Pflanzfarm');
    }

    public function content(): Content
    {
        return new Content(markdown: 'mail.order-confirmation', with: ['order' => $this->order->loadMissing('items')]);
    }

    public function attachments(): array
    {
        $pdf = app(InvoicePdf::class);

        return [Attachment::fromData(fn () => $pdf->render($this->order), $pdf->filename($this->order))->withMime('application/pdf')];
    }
}
