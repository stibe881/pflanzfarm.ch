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

class PaymentReminder extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: ($this->order->reminder_count > 1 ? $this->order->reminder_count.'. ' : '').'Zahlungserinnerung zu Rechnung '.$this->order->number);
    }

    public function content(): Content
    {
        return new Content(markdown: 'mail.payment-reminder', with: ['order' => $this->order]);
    }

    public function attachments(): array
    {
        $pdf = app(InvoicePdf::class);

        return [Attachment::fromData(fn () => $pdf->render($this->order), $pdf->filename($this->order))->withMime('application/pdf')];
    }
}
