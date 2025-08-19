export interface InvoiceData {
  id: string;
  gymName: string;
  gymAddress: string;
  gymEmail: string;
  gymPhone: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  membershipPlan: {
    planName: string;
    unitPrice: number;
  };
  subtotal: number;
}
