'use client';

import { dateIntl } from '@paalan/react-shared/lib';
import { Center, Loading, toast } from '@paalan/react-ui';
import { PDFViewer, usePDF } from '@react-pdf/renderer';
import Image from 'next/image';
import { type FC, useEffect, useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import { ImPrinter } from 'react-icons/im';

import { api } from '@/trpc/client';
import { convertImageToBase64 } from '@/utils/client';
import { currencyIntl } from '@/utils/currency-intl';
import { getBaseUrl } from '@/utils/helpers';

import { InvoicePDF } from './InvoicePDF';
import type { InvoiceData } from './types';

type PDFInvoiceProps = {
  invoiceData: InvoiceData;
  tax: number;
  total: number;
  logoUrl: string;
};
const PDFInvoice: FC<PDFInvoiceProps> = props => {
  const [instance] = usePDF({
    document: <InvoicePDF {...props} />,
  });

  if (instance.loading) {
    return (
      <Center className="h-3/4 p-8">
        <Loading className="size-8" content="Generating Invoice..." />
      </Center>
    );
  }

  if (instance.error) {
    return <p>Error generating PDF.</p>;
  }

  return (
    <>
      <div className="flex justify-end gap-3">
        <div className="border">
          <a href={instance.url || undefined} target="_blank">
            <ImPrinter className="cursor-pointer p-2 text-4xl text-blue-500" />
            <span className="sr-only">Print</span>
          </a>
        </div>
        <div className="border">
          <a
            href={instance.url || undefined}
            download={`membership-invoice-${props.invoiceData.invoiceNumber}.pdf`}
          >
            <FiDownload className="cursor-pointer p-2 text-4xl text-blue-500" />
            <span className="sr-only">Download</span>
          </a>
        </div>
      </div>
      <PDFViewer className="h-128 w-full" showToolbar={false}>
        <InvoicePDF {...props} />
      </PDFViewer>
    </>
  );
};
type InvoiceTemplateProps = {
  incomeId: string;
};

export const InvoiceTemplate: FC<InvoiceTemplateProps> = ({ incomeId }) => {
  const {
    data: incomeItem,
    isLoading,
    error: apiError,
  } = api.incomes.getPopulatedById.useQuery({ id: incomeId });

  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    convertImageToBase64(`${getBaseUrl()}/logos/png/activpass-buddy-logo-black-blue.png`)
      .then(url => setLogoUrl(url))
      .catch(err => {
        toast.error(err.message);
      });
  }, []);

  if (isLoading || !logoUrl) {
    return (
      <Center className="h-3/4 p-8">
        <Loading className="size-8" content="Loading invoice data..." />
      </Center>
    );
  }

  if (apiError) return <p>Error loading invoice data.</p>;
  if (!incomeItem) return <p>No invoice data found.</p>;

  const { organization, client, membershipPlan } = incomeItem;

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
      <PDFInvoice invoiceData={invoiceData} tax={tax} total={total} logoUrl={logoUrl} />
      <div className="hidden p-5">
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
