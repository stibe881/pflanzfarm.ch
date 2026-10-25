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
        return Pdf::loadView('pdf.invoice', [
            'order' => $order->loadMissing('items'),
            'qr' => $this->qrSvg($order),
            'iban' => Setting::get('iban'),
            'vat' => Setting::get('vat_number'),
            'dueDays' => (int) Setting::get('invoice_due_days'),
        ])->setPaper('a4')->output();
    }

    public function filename(Order $order): string
    {
        return 'Rechnung-'.$order->number.'.pdf';
    }

    /** Swiss QR-Code als SVG-Data-URI, nur bei Rechnung mit hinterlegter IBAN. */
    private function qrSvg(Order $order): ?string
    {
        $iban = preg_replace('/\s+/', '', (string) Setting::get('iban'));
        if ($order->payment_method !== 'invoice' || $order->payment_status === 'bezahlt' || $iban === '') {
            return null;
        }

        try {
            $bill = QrBill\QrBill::create();
            $bill->setCreditor(QrBill\DataGroup\Element\StructuredAddress::createWithStreet('Pflanzfarm Steinmann', 'Untergretti', '2', '6245', 'Ebersecken', 'CH'));
            $bill->setCreditorInformation(QrBill\DataGroup\Element\CreditorInformation::create($iban));
            $bill->setPaymentAmountInformation(QrBill\DataGroup\Element\PaymentAmountInformation::create('CHF', $order->total / 100));
            $bill->setPaymentReference(QrBill\DataGroup\Element\PaymentReference::create(QrBill\DataGroup\Element\PaymentReference::TYPE_NON));
            $bill->setAdditionalInformation(QrBill\DataGroup\Element\AdditionalInformation::create('Bestellung '.$order->number));
            $svg = $bill->getQrCode()->getAsString(QrBill\QrCode\QrCode::FILE_FORMAT_SVG);

            return 'data:image/svg+xml;base64,'.base64_encode($svg);
        } catch (Throwable $e) {
            report($e);

            return null;
        }
    }
}
