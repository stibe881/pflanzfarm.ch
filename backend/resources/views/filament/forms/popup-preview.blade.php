{{-- Live-Vorschau des saisonalen Popups im Look der Website --}}
@php
    $serif = "Iowan Old Style, Baskerville, 'Palatino Linotype', Palatino, Georgia, serif";
@endphp
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
    <div style="display:flex; gap:8px; margin-bottom:10px; font-size:12px;">
        <span style="padding:3px 10px; border-radius:999px; background:{{ $live ? '#dcfce7' : '#f3f4f6' }}; color:{{ $live ? '#166534' : '#4b5563' }}; font-weight:600;">
            {{ $live ? 'Heute sichtbar' : 'Heute nicht sichtbar' }}
        </span>
        <span style="color:#6b7280;">{{ $pages }} · nach {{ $delay }} s · einmal pro Besuch</span>
    </div>

    <div style="background:#0a2a1f; background-image:linear-gradient(#071e16a8,#071e16a8), url('/assets/pflanzfarm-hero-mitarbeitende-poster-768.webp'); background-size:cover; background-position:center; border-radius:10px; padding:{{ $mobile ? '22px 14px' : '34px 26px' }};">
        <div style="display:grid; grid-template-columns:{{ $mobile ? '1fr' : '0.85fr 1.15fr' }}; max-width:{{ $mobile ? '300px' : '620px' }}; margin:0 auto; background:#fbf9f3; border-radius:9px; overflow:hidden; box-shadow:0 25px 75px #0000004d; position:relative; color:#153c31;">
            <span style="position:absolute; right:10px; top:10px; width:30px; height:30px; border-radius:50%; background:#fff; display:grid; place-items:center; font-size:16px; line-height:1; box-shadow:0 2px 6px #0002;">×</span>
            <div style="min-height:{{ $mobile ? '130px' : '260px' }}; background:#dce5d8;">
                @if($image)
                    <img src="{{ $image }}" alt="" style="width:100%; height:100%; object-fit:cover; display:block; min-height:{{ $mobile ? '130px' : '260px' }}; max-height:{{ $mobile ? '150px' : 'none' }};">
                @else
                    <div style="height:100%; min-height:{{ $mobile ? '130px' : '260px' }}; display:grid; place-items:center; color:#4b6a5d; font-size:12px;">Kein Bild</div>
                @endif
            </div>
            <div style="padding:{{ $mobile ? '18px 18px 14px' : '40px 30px 24px' }}; display:flex; flex-direction:column; justify-content:center;">
                <span style="font-size:11px; font-weight:700; letter-spacing:.02em;">Pflanzfarm aktuell</span>
                <h2 style="font-family:{{ $serif }}; font-size:{{ $mobile ? '22px' : '28px' }}; line-height:1.1; margin:8px 0 10px; font-weight:700; color:#153c31;">{{ $title ?: 'Titel des Popups' }}</h2>
                <p style="margin:0 0 18px; font-size:14px; line-height:1.55; color:#24493a;">{{ $text ?: 'Hier erscheint der Text des Popups.' }}</p>
                <span style="display:flex; justify-content:center; align-items:center; gap:8px; padding:12px 16px; border-radius:5px; background:#153c31; color:#fff; font-weight:700; font-size:14px;">{{ $cta ?: 'Knopf' }} →</span>
                <span style="margin-top:10px; text-align:center; font-size:12px; text-decoration:underline; color:#24493a;">Jetzt nicht, danke</span>
            </div>
        </div>
    </div>
    <p style="margin-top:8px; font-size:12px; color:#6b7280;">Der Knopf führt zu: <strong>{{ $target }}</strong></p>
</div>
