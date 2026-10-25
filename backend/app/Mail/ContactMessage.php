<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessage extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public array $data) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Anfrage: '.$this->data['topic'].' – '.$this->data['name'],
            replyTo: filter_var($this->data['email'] ?? '', FILTER_VALIDATE_EMAIL) ? [new Address($this->data['email'], $this->data['name'])] : [],
        );
    }

    public function content(): Content
    {
        return new Content(markdown: 'mail.contact', with: ['d' => $this->data]);
    }
}
