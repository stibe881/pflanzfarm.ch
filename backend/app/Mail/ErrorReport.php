<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class ErrorReport extends Mailable
{
    public function __construct(public string $title, public string $body) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Fehler auf der Website: '.$this->title);
    }

    public function content(): Content
    {
        return new Content(htmlString: '<pre style="font-family:monospace;font-size:12px;white-space:pre-wrap">'.e($this->body).'</pre>');
    }
}
