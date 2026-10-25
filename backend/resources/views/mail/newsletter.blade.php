<x-mail::message>
@if($campaign->preheader)
<span style="display:none">{{ $campaign->preheader }}</span>
@endif
{!! Illuminate\Mail\Markdown::parse($campaign->body) !!}

@if($campaign->cta_label && $campaign->cta_url)
<x-mail::button :url="$campaign->cta_url">
{{ $campaign->cta_label }}
</x-mail::button>
@endif

<x-mail::subcopy>
Sie erhalten diese E-Mail, weil Sie den Newsletter der Pflanzfarm Steinmann abonniert haben. [Newsletter abbestellen]({{ $unsubscribeUrl }})
</x-mail::subcopy>
</x-mail::message>
