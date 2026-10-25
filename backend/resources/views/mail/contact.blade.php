<x-mail::message>
# {{ $d['topic'] }}

**{{ $d['name'] }}** · {{ $d['contact'] }}@if(!empty($d['place'])) · {{ $d['place'] }}@endif


{{ $d['message'] }}
</x-mail::message>
