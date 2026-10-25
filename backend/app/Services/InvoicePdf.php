<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Setting;
use Barryvdh\DomPDF\Facade\Pdf;
use Sprain\SwissQrBill as QrBill;
use Throwable;

class InvoicePdf
{
    public function render(Order $order): string
    {
        $order->loadMissing('items');
        $dueDays = (int) Setting::get('invoice_due_days');

        return Pdf::loadView('pdf.invoice', [
            'order' => $order,
            'logo' => 'data:image/png;base64,'.base64_encode((string) file_get_contents(resource_path('pdf/logo.png'))),
            'qrBill' => $this->paymentPart($order),
            'iban' => Setting::get('iban'),
            'vat' => Setting::get('vat_number'),
            'dueDays' => $dueDays,
            'dueDate' => $order->created_at->copy()->addDays($dueDays),
        ])->setPaper('a4')->setOption(['isRemoteEnabled' => false, 'dpi' => 150, 'isFontSubsettingEnabled' => true])->output();
    }

    public function filename(Order $order): string
    {
        return 'Rechnung-'.$order->number.'.pdf';
    }

    /**
     * Daten für den Swiss-QR-Zahlteil (Empfangsschein + Zahlteil), nur für offene Rechnungen mit hinterlegter IBAN.
     * Das Layout steht in resources/views/pdf/invoice.blade.php (Masse gemäss SIX-Vorgabe).
     */
    private function paymentPart(Order $order): ?array
    {
        $iban = preg_replace('/\s+/', '', (string) Setting::get('iban'));
        if ($order->payment_method !== 'invoice' || $order->payment_status === 'bezahlt' || $iban === '') {
            return null;
        }

        try {
            $bill = QrBill\QrBill::create();
            $creditorAddress = QrBill\DataGroup\Element\StructuredAddress::createWithStreet('Pflanzfarm Steinmann', 'Untergretti', '2', '6245', 'Ebersecken', 'CH');
            $bill->setCreditor($creditorAddress);
            $creditor = QrBill\DataGroup\Element\CreditorInformation::create($iban);
            $bill->setCreditorInformation($creditor);
            // QR-IBAN verlangt eine QR-Referenz (aus der Bestellnummer), eine normale IBAN keine
            $reference = $creditor->containsQrIban()
                ? QrBill\DataGroup\Element\PaymentReference::create(
                    QrBill\DataGroup\Element\PaymentReference::TYPE_QR,
                    QrBill\Reference\QrPaymentReferenceGenerator::generate(null, preg_replace('/\D/', '', $order->number))
                )
                : QrBill\DataGroup\Element\PaymentReference::create(QrBill\DataGroup\Element\PaymentReference::TYPE_NON);
            $bill->setPaymentReference($reference);
            $bill->setPaymentAmountInformation(QrBill\DataGroup\Element\PaymentAmountInformation::create('CHF', $order->total / 100));
            $info = 'Rechnung '.$order->number;
            $bill->setAdditionalInformation(QrBill\DataGroup\Element\AdditionalInformation::create($info));
            $debtor = $this->debtor($order);
            if ($debtor) {
                $bill->setUltimateDebtor($debtor);
            }

            $qr = $bill->getQrCode()->getAsString(QrBill\QrCode\QrCode::FILE_FORMAT_SVG);

            return [
                'qr' => 'data:image/svg+xml;base64,'.base64_encode($qr),
                'account' => $creditor->getFormattedIban(),
                'creditor' => explode("\n", trim($creditorAddress->getFullAddress())),
                'reference' => $reference->getFormattedReference(),
                'info' => $info,
                'debtor' => $debtor ? explode("\n", trim($debtor->getFullAddress())) : null,
                'amount' => number_format($order->total / 100, 2, '.', ' '),
            ];
        } catch (Throwable $e) {
            report($e);

            return null;
        }
    }

    /** Zahlungspflichtige Person; «Gartenweg 12a» wird in Strasse und Hausnummer getrennt. */
    private function debtor(Order $order): ?QrBill\DataGroup\Element\StructuredAddress
    {
        if (! $order->street || ! $order->postal_code || ! $order->city) {
            return null;
        }
        $street = trim($order->street);
        $number = null;
        if (preg_match('/^(.*\D)\s+(\d+\s*[a-zA-Z]?)$/u', $street, $m)) {
            [$street, $number] = [trim($m[1]), str_replace(' ', '', $m[2])];
        }

        return QrBill\DataGroup\Element\StructuredAddress::createWithStreet(
            mb_substr($order->name, 0, 70), mb_substr($street, 0, 70), $number, $order->postal_code, mb_substr($order->city, 0, 35), 'CH'
        );
    }
}
