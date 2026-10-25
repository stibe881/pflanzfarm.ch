{{-- Live-Vorschau des Newsletters: Posteingang und die echte E-Mail --}}
<div>
    <div style="display:flex; gap:12px; align-items:flex-start; padding:12px 14px; border:1px solid #e5e7eb; border-radius:10px; background:#fff; margin-bottom:12px;">
        <div style="flex:none; width:36px; height:36px; border-radius:50%; background:#153c31; color:#fff; display:grid; place-items:center; font-weight:700; font-size:14px;">P</div>
        <div style="min-width:0; font-size:13px; line-height:1.4;">
            <div style="display:flex; justify-content:space-between; gap:8px;"><strong style="color:#111827;">{{ $from }}</strong><span style="color:#9ca3af; flex:none;">jetzt</span></div>
            <div style="color:#111827; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ $subject ?: 'Betreff' }}</div>
            <div style="color:#6b7280; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ $preheader ?: 'Vorschautext erscheint hier' }}</div>
        </div>
    </div>
    <div style="border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; background:#f3f0e8;">
        <iframe title="Newsletter-Vorschau" srcdoc="{{ $html }}" style="display:block; width:{{ $mobile ? '375px' : '100%' }}; max-width:100%; margin:0 auto; height:640px; border:0; background:#f3f0e8;"></iframe>
    </div>
    <p style="margin-top:8px; font-size:12px; color:#6b7280;">So sieht die E-Mail bei den Abonnenten aus. Der Abmeldelink wird beim Versand für jede Person eingesetzt.</p>
</div>
