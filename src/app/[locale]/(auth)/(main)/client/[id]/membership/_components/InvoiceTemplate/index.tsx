// import { Button } from '@paalan/react-ui';
// import { CalendarIcon, PrinterIcon } from 'lucide-react';

import Image from 'next/image';

export const InvoiceTemplate = () => {
  const invoiceData = {
    id: '1',
    invoiceNumber: 'INV-2023-001',
    issueDate: '2023-06-15',
    dueDate: '2023-07-15',
    gymName: 'FitLife Gym',
    gymAddress: '123 Fitness Street, Healthyville, HV 12345',
    gymEmail: 'billing@fitlifegym.com',
    gymPhone: '(555) 123-4567',
    clientName: 'John Doe',
    clientAddress: '456 Workout Avenue, Strengthtown, ST 67890',
    clientEmail: 'john.doe@example.com',
    items: [
      {
        id: '1',
        description: 'Monthly Membership - Gold Plan',
        quantity: 1,
        unitPrice: 99.99,
        total: 99.99,
      },
      { description: 'Personal Training Sessions', quantity: 4, unitPrice: 50.0, total: 200.0 },
      { description: 'Protein Shake Pack', quantity: 1, unitPrice: 29.99, total: 29.99 },
    ],
    subtotal: 329.98,
    tax: 26.4,
    total: 356.38,
  };
  return (
    <div className="relative mx-auto max-w-4xl overflow-hidden rounded-lg bg-white p-8 shadow-lg">
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
            <th className="py-2 text-left text-sm font-semibold text-gray-600">Description</th>
            <th className="py-2 text-center text-sm font-semibold text-gray-600">Quantity</th>
            <th className="py-2 text-right text-sm font-semibold text-gray-600">Unit Price</th>
            <th className="py-2 text-right text-sm font-semibold text-gray-600">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map(item => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="py-2 text-sm text-gray-600">{item.description}</td>
              <td className="py-2 text-center text-sm text-gray-600">{item.quantity}</td>
              <td className="py-2 text-right text-sm text-gray-600">
                ${item.unitPrice.toFixed(2)}
              </td>
              <td className="py-2 text-right text-sm text-gray-600">${item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="relative z-10 mb-8 flex justify-end">
        <div className="w-1/2">
          <div className="mb-2 flex justify-between">
            <span className="text-sm text-gray-600">Subtotal:</span>
            <span className="text-sm font-semibold text-gray-800">
              ${invoiceData.subtotal.toFixed(2)}
            </span>
          </div>
          <div className="mb-2 flex justify-between">
            <span className="text-sm text-gray-600">Tax (8%):</span>
            <span className="text-sm font-semibold text-gray-800">
              ${invoiceData.tax.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2">
            <span className="text-base font-semibold text-gray-800">Total:</span>
            <span className="text-base font-bold text-gray-800">
              ${invoiceData.total.toFixed(2)}
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

      {/* Action Buttons */}
      {/* <div className="relative z-10 mt-8 flex justify-end space-x-4">
        <Button variant="outline" className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Add to Calendar
        </Button>
        <Button className="flex items-center">
          <PrinterIcon className="mr-2 h-4 w-4" />
          Print Invoice
        </Button>
      </div> */}
    </div>
  );
};
