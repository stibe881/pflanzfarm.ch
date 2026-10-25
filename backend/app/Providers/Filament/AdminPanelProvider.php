<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->passwordReset()
            ->profile()
            ->brandName('Pflanzfarm Verwaltung')
            ->brandLogo(asset('assets/pflanzfarm-logo.webp'))
            ->brandLogoHeight('2.6rem')
            ->favicon(asset('favicon.png'))
            ->colors([
                'primary' => [
                    50 => '#edf2eb', 100 => '#dce5d8', 200 => '#b9cbb3', 300 => '#8fac87', 400 => '#5f8a5a',
                    500 => '#3b6b4c', 600 => '#24493a', 700 => '#153c31', 800 => '#0f2f25', 900 => '#0d2a22', 950 => '#071e16',
                ],
                'danger' => Color::Red,
                'warning' => Color::Amber,
                'success' => Color::Green,
            ])
            ->navigationGroups(['Shop', 'Inhalte', 'Newsletter', 'Verwaltung'])
            ->sidebarCollapsibleOnDesktop()
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                Pages\Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                \App\Http\Middleware\AdminAuthenticate::class,
            ])
            ->renderHook(
                \Filament\View\PanelsRenderHook::AUTH_LOGIN_FORM_BEFORE,
                fn () => session('admin_notice')
                    ? new \Illuminate\Support\HtmlString('<div style="padding:10px 14px;border-radius:8px;background:#fef3c7;color:#78350f;font-size:14px">'.e(session('admin_notice')).'</div>')
                    : '',
            );
    }
}
