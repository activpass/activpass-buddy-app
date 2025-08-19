'use client';

import { dateIntl } from '@paalan/react-shared/lib';
import { Center, Loading, toast } from '@paalan/react-ui';
import html2canvas from 'html2canvas-pro';
import JsPDF from 'jspdf';
import Image from 'next/image';
import { type FC, useRef } from 'react';
import { FiDownload } from 'react-icons/fi';
import { ImPrinter } from 'react-icons/im';

// import { useReactToPrint } from 'react-to-print';
import { api } from '@/trpc/client';
import { currencyIntl } from '@/utils/currency-intl';

import type { InvoiceData } from './types';

type InvoiceTemplateProps = {
  incomeId: string;
};

export const InvoiceTemplate: FC<InvoiceTemplateProps> = ({ incomeId }) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const {
    data: incomeItem,
    isLoading,
    error: apiError,
  } = api.incomes.getPopulatedById.useQuery({ id: incomeId });

  // const printFn = useReactToPrint({
  //   contentRef,
  // });

  if (isLoading) {
    return (
      <Center className="h-3/4 p-8">
        <Loading className="size-8" content="Loading invoice data..." />
      </Center>
    );
  }

  if (apiError) return <p>Error loading invoice data.</p>;
  if (!incomeItem) return <p>No invoice data found.</p>;

  const { organization, client, membershipPlan } = incomeItem;

  const downloadPDF = async () => {
    const input = contentRef.current;

    if (!input) return;
    try {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/png');

      const pdf = new JsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`membership-invoice-${incomeItem.invoiceId}.pdf`);
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  const printInvoice = async () => {
    const input = contentRef.current;

    if (!input) return;

    try {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/png');

      const printWindow = window.open('', '_blank');

      if (printWindow) {
        printWindow.document.write(`
        <html>
          <head>
            <title>Print Invoice</title>
            <style>
              body { margin: 0; padding: 0; }
              img { width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${imgData}" />
          </body>
        </html>
      `);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    } catch (error) {
      toast.error('Failed to print PDF');
    }
  };

  const invoiceData: InvoiceData = {
    id: '1',
    invoiceNumber: incomeItem.invoiceId || 'Unknown Invoice',
    issueDate: dateIntl.format(incomeItem.date),
    dueDate: dateIntl.format(incomeItem.dueDate),
    gymName: organization?.name || 'Unknown Gym',
    gymAddress: '123 Fitness Street, Healthyville, HV 12345',
    gymEmail: 'billing@fitlifegym.com',
    gymPhone: '(555) 123-4567',
    clientName: client?.fullName || 'Unknown Client',
    clientAddress: client?.address || 'N/A',
    clientEmail: client?.email || 'N/A',
    membershipPlan: {
      planName: membershipPlan?.name ?? 'Unknown Plan',
      unitPrice: membershipPlan?.amount ?? 0,
    },
    subtotal: membershipPlan?.amount ?? 0,
  };

  const taxRate = 0.18;
  const tax = invoiceData.subtotal * taxRate;
  const total = invoiceData.subtotal + tax;

  return (
    <div className="">
      <div className="flex justify-end gap-3">
        <div className="border">
          <ImPrinter onClick={printInvoice} className="cursor-pointer p-2 text-4xl text-blue-500" />
        </div>
        <div className="border">
          {/* <PDFDownloadLink
            document={<InvoicePDF invoiceData={invoiceData} tax={tax} total={total} />}
            fileName={`Membership-Invoice-${invoiceData.invoiceNumber}.pdf`}
          >
            <FiDownload className="cursor-pointer p-2 text-4xl text-blue-500" />
          </PDFDownloadLink> */}
          <FiDownload onClick={downloadPDF} className="cursor-pointer p-2 text-4xl text-blue-500" />
        </div>
      </div>

      <div className="p-5" ref={contentRef}>
        {/* Watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5">
          <span className="-rotate-45 whitespace-nowrap text-8xl font-bold">
            {invoiceData.gymName}
          </span>
        </div>
        {/* Header */}
        <div className="relative z-10 mb-8 flex items-start justify-between">
          <div>
            <div className="mb-4 size-24 rounded-lg bg-gray-200">
              <Image
                src="/placeholder.svg?height=96&width=96"
                width={96}
                height={96}
                alt="FitLife Gym Logo"
                className="size-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{invoiceData.gymName}</h1>
            <p className="text-sm text-gray-600">{invoiceData.gymAddress}</p>
            <p className="text-sm text-gray-600">{invoiceData.gymEmail}</p>
            <p className="text-sm text-gray-600">{invoiceData.gymPhone}</p>
          </div>
          <div className="text-right">
            <h2 className="mb-2 text-3xl font-bold text-gray-800">INVOICE</h2>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Invoice Number:</span> {invoiceData.invoiceNumber}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Issue Date:</span> {invoiceData.issueDate}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Due Date:</span> {invoiceData.dueDate}
            </p>
          </div>
        </div>
        {/* Client Information */}
        <div className="relative z-10 mb-8">
          <h3 className="mb-2 text-lg font-semibold text-gray-800">Bill To:</h3>
          <p className="text-sm text-gray-600">{invoiceData.clientName}</p>
          <p className="text-sm text-gray-600">{invoiceData.clientAddress}</p>
          <p className="text-sm text-gray-600">{invoiceData.clientEmail}</p>
        </div>
        {/* Invoice Items */}
        <table className="relative z-10 mb-8 w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 text-left text-sm font-semibold text-gray-600">Plan Name</th>
              <th className="py-2 text-right text-sm font-semibold text-gray-600">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-sm text-gray-600">{invoiceData.membershipPlan.planName}</td>
              <td className="py-2 text-right text-sm text-gray-600">
                {currencyIntl.format(invoiceData.membershipPlan?.unitPrice)}
              </td>
            </tr>
          </tbody>
        </table>
        {/* Totals */}
        <div className="relative z-10 mb-8 flex justify-end">
          <div className="w-1/2">
            <div className="mb-2 flex justify-between">
              <span className="text-sm text-gray-600">Subtotal:</span>
              <span className="text-sm font-semibold text-gray-800">
                {currencyIntl.format(invoiceData.subtotal)}
              </span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="text-sm text-gray-600">Tax (18%):</span>
              <span className="text-sm font-semibold text-gray-800">
                {currencyIntl.format(tax)}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="text-base font-semibold text-gray-800">Total:</span>
              <span className="text-base font-bold text-gray-800">
                {currencyIntl.format(total)}
              </span>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="relative z-10 border-t border-gray-200 pt-4">
          <p className="mb-2 text-sm text-gray-600">Thank you for your business!</p>
          <p className="text-sm text-gray-600">
            Please make payment by the due date to{' '}
            <span className="font-semibold">{invoiceData.gymName}</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
