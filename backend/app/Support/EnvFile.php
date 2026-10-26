<?php

namespace App\Support;

/** Schreibt einzelne Werte in backend/.env (bestehende Zeilen ersetzen, neue anhängen). */
class EnvFile
{
    public function __construct(private ?string $path = null)
    {
        $this->path ??= base_path('.env');
    }

    public function get(string $key): ?string
    {
        if (! is_file($this->path) || ! preg_match('/^'.preg_quote($key, '/').'=(.*)$/m', (string) file_get_contents($this->path), $m)) {
            return null;
        }

        return trim($m[1], " \t\"'");
    }

    /** @param array<string, string|null> $values */
    public function set(array $values): void
    {
        $content = is_file($this->path) ? (string) file_get_contents($this->path) : '';
        foreach ($values as $key => $value) {
            $line = $key.'='.self::quote((string) $value);
            $pattern = '/^'.preg_quote($key, '/').'=.*$/m';
            $content = preg_match($pattern, $content)
                ? preg_replace_callback($pattern, fn () => $line, $content, 1)
                : rtrim($content, "\n")."\n".$line."\n";
        }
        file_put_contents($this->path, $content);
    }

    private static function quote(string $value): string
    {
        return preg_match('/[\s#"\'$\\\\]/', $value) ? '"'.str_replace(['\\', '"'], ['\\\\', '\\"'], $value).'"' : $value;
    }
}
