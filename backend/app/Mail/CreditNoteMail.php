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

class CreditNoteMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Gutschrift zu Ihrer Bestellung '.$this->order->number);
    }

    public function content(): Content
    {
        return new Content(markdown: 'mail.credit-note', with: ['order' => $this->order]);
    }

    public function attachments(): array
    {
        return [Attachment::fromData(fn () => app(InvoicePdf::class)->creditNote($this->order), 'Gutschrift-'.$this->order->number.'.pdf')->withMime('application/pdf')];
    }
}
