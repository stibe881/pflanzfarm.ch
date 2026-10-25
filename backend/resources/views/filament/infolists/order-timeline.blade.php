@php($items = $getRecord()->timeline())
@php($dot = ['system' => '#64748b', 'pay' => '#16a34a', 'status' => '#24493a', 'mail' => '#0284c7', 'cancel' => '#dc2626', 'edit' => '#a16207', 'note' => '#c98164'])
<ol style="list-style:none;margin:0;padding:0;display:grid;gap:12px">
    @foreach($items as $e)
        <li style="display:grid;grid-template-columns:12px 1fr;gap:10px">
            <span style="margin-top:5px;width:10px;height:10px;border-radius:50%;background:{{ $dot[$e['type']] ?? '#64748b' }}"></span>
            <div>
                <div style="font-size:.875rem"><strong>{{ $e['title'] }}</strong>
                    <span style="opacity:.6;font-size:.78rem"> · {{ $e['at']->format('d.m.Y H:i') }}@if($e['by']) · {{ $e['by'] }}@endif</span></div>
                @if($e['text'])
                    <div style="margin-top:4px;padding:8px 10px;border-radius:8px;background:rgba(201,129,100,.12);font-size:.85rem;white-space:pre-line">{{ $e['text'] }}</div>
                @endif
            </div>
        </li>
    @endforeach
</ol>
