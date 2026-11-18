export interface CustomerMasterRecord {
  customerId: string;
  contactPerson: string;
  companyName: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  salesAgent: string;
}

export interface PaymentBankAccountOption {
  bankLabel: string;
  accountNo: string;
}

export interface InvoiceLineItem {
  sNo: number;
  modelNumber: string;
  description: string;
  billQty: number;
  unitPricePKR: number;
  productId?: string;
}

export interface SubmittedInvoiceLineSummary {
  modelNumber: string;
  description: string;
  qty: number;
  unitPricePKR: number;
  lineTotalPKR: number;
  stockBefore: number;
  stockAfter: number;
}

export interface SubmittedInvoiceSummaryRecord {
  summaryId: string;
  invoiceNo: string;
  invoiceDate: string;
  submittedAt: string;
  customerId: string;
  customerName: string;
  companyName: string;
  deliveryAddress: string;
  contactAndCity: string;
  salesAgent: string;
  paymentBankAccount: string;
  accountNo: string;
  lineItems: SubmittedInvoiceLineSummary[];
  itemsSummaryText: string;
  totalUnitsBilled: number;
  subtotalExclGstPKR: number;
  gst18PKR: number;
  discountPKR: number;
  totalInclTaxPKR: number;
  amountReceivedPKR: number;
  balanceDuePKR: number;
  paymentStatus: 'PAID IN FULL' | 'PARTIAL' | 'UNPAID';
  stockDeducted: boolean;
  linkedWebsiteOrderId?: string;
}

export const INITIAL_CUSTOMER_MASTER: CustomerMasterRecord[] = [
  {
    customerId: 'CUST-001',
    contactPerson: 'Haji Murtza',
    companyName: 'Haji Murtza Engineering',
    city: 'Lahore',
    address: 'Lahore Industrial Area',
    phone: '0301-4130439',
    email: '',
    salesAgent: 'ZAIN & FAIZAN',
  },
  {
    customerId: 'CUST-002',
    contactPerson: 'Maaz Ali',
    companyName: 'Maaz Ali Works',
    city: 'Lahore',
    address: 'Lahore',
    phone: '0312-8810009',
    email: '',
    salesAgent: 'ZAIN & FAIZAN',
  },
  {
    customerId: 'CUST-003',
    contactPerson: 'Ali Mustfa',
    companyName: 'Pak Machineery Ali Mustfa',
    city: 'Lahore',
    address: 'Brandreth Road / Machinery Market, Lahore',
    phone: '0308-8752456',
    email: '',
    salesAgent: 'ZAIN & FAIZAN',
  },
  {
    customerId: 'CUST-004',
    contactPerson: 'Attiq',
    companyName: 'AA Tooling',
    city: 'Lahore',
    address: 'Lahore',
    phone: '0305-2879662',
    email: '',
    salesAgent: 'ZAIN & FAIZAN',
  },
  {
    customerId: 'CUST-005',
    contactPerson: 'Moeen Akhtar',
    companyName: 'Moeen Akhtar CNC',
    city: 'Lahore',
    address: 'Lahore',
    phone: '0321-4250295',
    email: '',
    salesAgent: 'ZAIN & FAIZAN',
  },
  {
    customerId: 'CUST-006',
    contactPerson: 'Ahmad Mustafa',
    companyName: 'Ahmad Mustafa Drogay Wala',
    city: 'Lahore',
    address: 'Daroghawala Industrial Area, Lahore',
    phone: '0343-0437715',
    email: '',
    salesAgent: 'ZAIN & FAIZAN',
  },
  {
    customerId: 'CUST-007',
    contactPerson: 'Gull Ahmad',
    companyName: 'Gull Ahmad Engineering',
    city: 'Lahore',
    address: 'Lahore',
    phone: '0301-4358290',
    email: '',
    salesAgent: 'ZAIN & FAIZAN',
  },
  {
    customerId: 'CUST-008',
    contactPerson: 'GR Engineering',
    companyName: 'GR Engineering',
    city: 'Lahore',
    address: 'Lahore',
    phone: '0321-8422705',
    email: '',
    salesAgent: 'Direct By KH Enterprises',
  },
  {
    customerId: 'CUST-009',
    contactPerson: 'Lal Din Ind',
    companyName: 'Lal Din Industries',
    city: 'Lahore',
    address: 'Lahore',
    phone: '042-37306819',
    email: '',
    salesAgent: 'ZAIN & FAIZAN',
  },
  {
    customerId: 'CUST-010',
    contactPerson: 'Transced Eng',
    companyName: 'Transced Engineering',
    city: 'Lahore',
    address: 'Lahore',
    phone: '0300-4513118',
    email: '',
    salesAgent: 'Direct By KH Enterprises',
  },
  {
    customerId: 'CUST-011',
    contactPerson: 'Mughal Metal',
    companyName: 'Mughal Metal Works',
    city: 'Lahore',
    address: 'Lahore',
    phone: '',
    email: '',
    salesAgent: 'Direct By KH Enterprises',
  },
  {
    customerId: 'CUST-012',
    contactPerson: 'Iftikhar Ahmed Jamal',
    companyName: 'Jamal Engineering',
    city: 'Lahore',
    address: 'Lahore',
    phone: '0300-8112020',
    email: '',
    salesAgent: 'Direct By KH Enterprises',
  },
];

export const MASTER_PAYMENT_ACCOUNTS: PaymentBankAccountOption[] = [
  {
    bankLabel: 'UBL KH Enterprises Pvt Ltd',
    accountNo: 'PK45UNIL0109000349986649',
  },
  {
    bankLabel: 'UBL Zahid',
    accountNo: 'PK29UNIL0109000409068085',
  },
  {
    bankLabel: 'UBL Usman',
    accountNo: 'PK98UNIL0109000303014609',
  },
  {
    bankLabel: 'UBL Khubaib',
    accountNo: 'UBL-KHUBAIB-ACCT',
  },
  {
    bankLabel: 'Meezan KH Ent',
    accountNo: 'MEEZAN-KH-ENT',
  },
  {
    bankLabel: 'Al Habib Mohsin',
    accountNo: 'ALHABIB-MOHSIN',
  },
  {
    bankLabel: 'ABL Urooj',
    accountNo: 'ABL-UROOJ',
  },
  {
    bankLabel: 'Meezan Waqas',
    accountNo: 'MEEZAN-WAQAS',
  },
  {
    bankLabel: 'Meezan Zahoor',
    accountNo: 'MEEZAN-ZAHOOR',
  },
  {
    bankLabel: 'Meezan Urooj',
    accountNo: 'MEEZAN-UROOJ',
  },
  {
    bankLabel: 'Meezan GRIT',
    accountNo: 'MEEZAN-GRIT',
  },
  {
    bankLabel: 'Bank Alfalah Khubaib CC',
    accountNo: 'ALFALAH-KHUBAIB-CC',
  },
  {
    bankLabel: 'Bank Alfalah Khubaib',
    accountNo: 'ALFALAH-KHUBAIB',
  },
  {
    bankLabel: 'Jazz Cash Khubaib',
    accountNo: '0321-4800265',
  },
  {
    bankLabel: 'Cash in Hand (Office Counter)',
    accountNo: 'CASH-COUNTER-LHR',
  },
];

export const SALES_AGENT_OPTIONS: string[] = [
  'Direct By KH Enterprises',
  'ZAIN & FAIZAN',
  'MOHSIN',
  'WAQAS',
  'ZAHOOR',
  'UROOJ',
];

export const INVOICE_SUMMARIES_STORAGE_KEY =
  'szgh_kh_invoice_summaries_v1';
export const STOCK_SOLD_UNITS_STORAGE_KEY =
  'szgh_kh_stock_units_sold_v1';
export const LOCAL_STOCK_OVERRIDES_STORAGE_KEY =
  'szgh_kh_local_stock_overrides_v1';

export function createEmptyInvoiceRows(count = 12): InvoiceLineItem[] {
  return Array.from({ length: count }, (_, idx) => ({
    sNo: idx + 1,
    modelNumber: '',
    description: '',
    billQty: 0,
    unitPricePKR: 0,
  }));
}

export function formatPKR(val: number): string {
  return Math.round(val || 0).toLocaleString('en-PK');
}
