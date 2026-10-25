<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LowStockAlert extends Mailable
{
    use Queueable, SerializesModels;

    /** @param  array<int, \App\Models\ProductVariant>  $variants */
    public function __construct(public array $variants) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Lager knapp: '.collect($this->variants)->map(fn ($v) => $v->product->name.' '.$v->label)->join(', '));
    }

    public function content(): Content
    {
        return new Content(markdown: 'mail.low-stock', with: ['variants' => $this->variants]);
    }
}
