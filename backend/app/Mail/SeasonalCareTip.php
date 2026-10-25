<?php

namespace App\Mail;

use App\Models\GuideArticle;
use App\Models\MailOptOut;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;

class SeasonalCareTip extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public GuideArticle $article, public string $email) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Pflegetipp: '.$this->article->title);
    }

    public function headers(): Headers
    {
        return new Headers(text: ['List-Unsubscribe' => '<'.MailOptOut::url($this->email).'>']);
    }

    public function content(): Content
    {
        return new Content(markdown: 'mail.seasonal-tip', with: [
            'article' => $this->article,
            'url' => url('/ratgeber/'.$this->article->slug.'/'),
            'optOutUrl' => MailOptOut::url($this->email),
        ]);
    }
}
