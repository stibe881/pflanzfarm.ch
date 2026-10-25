<?php

namespace App\Mail;

use App\Models\ProductVariant;
use App\Models\StockAlert;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BackInStock extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ProductVariant $variant, public StockAlert $alert) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Wieder an Lager: '.$this->variant->product->name.' '.$this->variant->label);
    }

    public function content(): Content
    {
        return new Content(markdown: 'mail.back-in-stock', with: [
            'variant' => $this->variant,
            'url' => url('/produkt/'.$this->variant->product->slug.'/'),
        ]);
    }
}
