<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Throwable;

/**
 * Erzeugt aus hochgeladenen Bildern WebP-Fassungen in mehreren Breiten (z. B. produkte/x-800.webp),
 * dreht Handyfotos richtig herum und begrenzt die Grösse. Das Original bleibt unverändert liegen.
 */
class ImageOptimizer
{
    public const WIDTHS = [400, 800, 1600];

    public function optimize(?string $path): bool
    {
        if (! $path || str_starts_with($path, '/assets/') || ! function_exists('imagewebp')) {
            return false;
        }
        $disk = Storage::disk('public');
        if (! $disk->exists($path) || $this->isDone($path)) {
            return false;
        }

        // Handyfotos (z. B. 4000 × 3000) brauchen unkomprimiert rund 50 MB
        $limit = ini_get('memory_limit');
        if ($limit !== '-1' && $this->bytes((string) $limit) < 512 * 1024 * 1024) {
            @ini_set('memory_limit', '512M');
        }

        try {
            $img = @imagecreatefromstring($disk->get($path));
            if (! $img) {
                return false;
            }
            $img = $this->orient($img, $disk->path($path));
            imagepalettetotruecolor($img);
            // zuerst auf die grösste Breite verkleinern, die kleineren davon ableiten
            $max = max(self::WIDTHS);
            if (imagesx($img) > $max) {
                $small = imagescale($img, $max, -1, IMG_BICUBIC);
                imagedestroy($img);
                $img = $small;
            }
            imagealphablending($img, true);
            imagesavealpha($img, true);
            $w = imagesx($img);

            foreach (self::WIDTHS as $target) {
                $scaled = $w > $target ? imagescale($img, $target, -1, IMG_BICUBIC) : $img;
                ob_start();
                imagewebp($scaled, null, 80);
                $disk->put(self::variant($path, $target), (string) ob_get_clean());
                if ($scaled !== $img) {
                    imagedestroy($scaled);
                }
            }
            imagedestroy($img);

            return true;
        } catch (Throwable $e) {
            report($e);

            return false;
        } finally {
            @ini_set('memory_limit', (string) $limit);
        }
    }

    private function bytes(string $v): int
    {
        $n = (int) $v;

        return match (strtolower(substr(trim($v), -1))) {
            'g' => $n * 1024 ** 3,
            'm' => $n * 1024 ** 2,
            'k' => $n * 1024,
            default => $n,
        };
    }

    public function isDone(string $path): bool
    {
        return Storage::disk('public')->exists(self::variant($path, self::WIDTHS[0]));
    }

    public static function variant(string $path, int $width): string
    {
        return preg_replace('/\.[a-z0-9]+$/i', '', $path).'-'.$width.'.webp';
    }

    /** srcset für ein hochgeladenes Bild, falls optimierte Fassungen vorhanden sind. */
    public static function srcset(string $path): ?string
    {
        $disk = Storage::disk('public');
        if (! $disk->exists(self::variant($path, self::WIDTHS[0]))) {
            return null;
        }

        return collect(self::WIDTHS)->map(fn ($w) => '/storage/'.self::variant($path, $w).' '.$w.'w')->join(', ');
    }

    private function orient(\GdImage $img, string $file): \GdImage
    {
        if (! function_exists('exif_read_data')) {
            return $img;
        }
        $o = (int) (@exif_read_data($file)['Orientation'] ?? 1);
        $rotated = match ($o) {
            3 => imagerotate($img, 180, 0),
            6 => imagerotate($img, -90, 0),
            8 => imagerotate($img, 90, 0),
            default => $img,
        };

        return $rotated ?: $img;
    }
}
