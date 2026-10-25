<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\DB;
use SimpleXMLElement;

/**
 * Liest Bankgutschriften aus camt.054 (oder camt.053) und verbucht Rechnungen:
 * Abgleich über die QR-Referenz, sonst über die Bestellnummer im Mitteilungstext.
 */
class PaymentImporter
{
    /** @return array<int, array{amount:int, reference:?string, text:string, date:?string, debtor:?string}> */
    public function parse(string $xml): array
    {
        $previous = libxml_use_internal_errors(true);
        $doc = simplexml_load_string($xml, SimpleXMLElement::class, LIBXML_NONET | LIBXML_NOCDATA);
        libxml_use_internal_errors($previous);
        if (! $doc) {
            throw new \InvalidArgumentException('Die Datei ist keine gültige camt-Datei (XML).');
        }

        $entries = [];
        foreach ($doc->xpath('//*[local-name()="Ntry"]') ?: [] as $ntry) {
            if ($this->text($ntry, '*[local-name()="CdtDbtInd"]') !== 'CRDT') {
                continue; // nur Gutschriften
            }
            // Vorgemerkte Buchungen (PDNG) überspringen; camt 2019 hat <Sts><Cd>BOOK</Cd></Sts>
            $status = $this->text($ntry, '*[local-name()="Sts"]/*[local-name()="Cd"]') ?: $this->text($ntry, '*[local-name()="Sts"]');
            if ($status === 'PDNG') {
                continue;
            }
            $date = $this->text($ntry, '*[local-name()="BookgDt"]/*') ?: $this->text($ntry, '*[local-name()="ValDt"]/*');
            $txs = $ntry->xpath('.//*[local-name()="TxDtls"]') ?: [];
            if (! $txs) {
                $entries[] = ['amount' => $this->amount($ntry, '*[local-name()="Amt"]'), 'reference' => null, 'text' => $this->text($ntry, '*[local-name()="AddtlNtryInf"]'), 'date' => $date ? substr($date, 0, 10) : null, 'debtor' => null];
            }
            foreach ($txs as $tx) {
                $amount = $this->amount($tx, './/*[local-name()="AmtDtls"]/*[local-name()="TxAmt"]/*[local-name()="Amt"]')
                    ?: $this->amount($tx, '*[local-name()="Amt"]')
                    ?: (count($txs) === 1 ? $this->amount($ntry, '*[local-name()="Amt"]') : 0);
                $entries[] = [
                    'amount' => $amount,
                    'reference' => preg_replace('/\s+/', '', $this->text($tx, './/*[local-name()="CdtrRefInf"]/*[local-name()="Ref"]')) ?: null,
                    'text' => trim($this->text($tx, './/*[local-name()="Ustrd"]').' '.$this->text($tx, './/*[local-name()="AddtlRmtInf"]').' '.$this->text($ntry, '*[local-name()="AddtlNtryInf"]')),
                    'date' => $date ? substr($date, 0, 10) : null,
                    'debtor' => $this->text($tx, './/*[local-name()="Dbtr"]//*[local-name()="Nm"]') ?: null,
                ];
            }
        }

        return $entries;
    }

    /**
     * Verbucht die Einträge. Bei unvollständiger Zahlung wird nichts markiert, nur gemeldet.
     *
     * @return array<int, array<string, mixed>>
     */
    public function apply(array $entries): array
    {
        $open = Order::query()->where('payment_method', 'invoice')->where('status', '!=', 'storniert')->where('number', 'like', 'PF-%')->get();
        $byRef = $open->keyBy(fn (Order $o) => InvoicePdf::qrReference($o));
        $byNumber = $open->keyBy('number');

        return collect($entries)->map(function (array $e) use ($byRef, $byNumber) {
            $order = ($e['reference'] ? $byRef->get($e['reference']) : null)
                ?? (preg_match('/PF-?\s?(\d{4})-?\s?(\d{3,6})/i', $e['text'].' '.$e['reference'], $m) ? $byNumber->get('PF-'.$m[1].'-'.$m[2]) : null);
            $row = $e + ['order' => $order?->number, 'status' => 'nicht zugeordnet'];
            if (! $order) {
                return $row;
            }
            if ($order->payment_status === 'bezahlt') {
                return ['status' => 'bereits bezahlt'] + $row;
            }
            if ($e['amount'] < $order->total) {
                return ['status' => 'Betrag zu tief (erwartet CHF '.number_format($order->total / 100, 2, '.', "'").')'] + $row;
            }
            DB::transaction(fn () => $order->update([
                'payment_status' => 'bezahlt',
                'paid_at' => $e['date'] ? \Illuminate\Support\Carbon::parse($e['date']) : now(),
                'paid_reference' => $e['reference'] ?: 'camt',
            ]));

            return ['status' => $e['amount'] > $order->total ? 'bezahlt (Überzahlung)' : 'bezahlt'] + $row;
        })->all();
    }

    private function text(SimpleXMLElement $node, string $xpath): string
    {
        $r = $node->xpath($xpath);

        return $r ? trim((string) $r[0]) : '';
    }

    private function amount(SimpleXMLElement $node, string $xpath): int
    {
        $v = $this->text($node, $xpath);

        return $v === '' ? 0 : (int) round(((float) $v) * 100);
    }
}
