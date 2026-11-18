import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Printer,
  Download,
  Plus,
  Trash2,
  RefreshCw,
  PackageCheck,
  Building2,
  CreditCard,
  Search,
  ArrowRight,
  ClipboardCheck,
  Layers,
} from 'lucide-react';
import { ProductItem } from '../data/products';
import { SubmittedCustomerOrder } from './CartDrawer';
import {
  CustomerMasterRecord,
  INITIAL_CUSTOMER_MASTER,
  MASTER_PAYMENT_ACCOUNTS,
  SALES_AGENT_OPTIONS,
  InvoiceLineItem,
  SubmittedInvoiceSummaryRecord,
  SubmittedInvoiceLineSummary,
  createEmptyInvoiceRows,
  formatPKR,
} from '../data/invoiceLedgerData';

export interface InvoiceDraftState {
  invoiceNo: string;
  invoiceDate: string;
  customerId: string;
  customerName: string;
  companyName: string;
  deliveryAddress: string;
  contactAndCity: string;
  salesAgent: string;
  paymentBankAccount: string;
  accountNo: string;
  rows: InvoiceLineItem[];
  includeGst18: boolean;
  discountPKR: number;
  amountReceivedPKR: number;
  linkedWebsiteOrderId?: string;
}

interface InvoiceAndSummaryWorkspaceProps {
  mode: 'invoice' | 'summary';
  products: ProductItem[];
  orders: SubmittedCustomerOrder[];
  invoiceDraft: InvoiceDraftState;
  setInvoiceDraft: React.Dispatch<React.SetStateAction<InvoiceDraftState>>;
  submittedSummaries: SubmittedInvoiceSummaryRecord[];
  unitsSoldByModel: Record<string, number>;
  onSubmitInvoiceAndDeductStock: () => Promise<void>;
  onLoadWebsiteOrderIntoInvoice: (order: SubmittedCustomerOrder) => void;
  onReloadSummaryIntoInvoice: (summary: SubmittedInvoiceSummaryRecord) => void;
  onUpdateSummaryAmountReceived: (summaryId: string, newAmountReceived: number) => void;
  onDeleteSummaryRecord: (summaryId: string) => void;
  onDownloadMasterExcel: () => void;
  onSwitchMode: (targetMode: 'invoice' | 'summary' | 'manage') => void;
  submittingInvoice: boolean;
}

/**
 * Matches an invoice row's model string to a catalog ProductItem.
 */
export function findProductForInvoiceModel(
  modelStr: string,
  products: ProductItem[]
): ProductItem | undefined {
  const cleaned = modelStr.trim().toLowerCase();
  if (!cleaned) return undefined;
  return (
    products.find((p) => p.modelNumber.trim().toLowerCase() === cleaned) ||
    products.find(
      (p) =>
        (p.baseModelNumber || '').trim().toLowerCase() === cleaned ||
        p.modelNumber.trim().toLowerCase().startsWith(cleaned)
    )
  );
}

/**
 * Appends the integrated "Invoice & Bill", "Summary" (Order Summary), "Stock List",
 * and "Customer Master" sheets into the Master Excel Workbook (.xlsx) with live formulas.
 */
export function prependIntegratedInvoiceAndSummarySheets(
  wb: XLSX.WorkBook,
  products: ProductItem[],
  submittedSummaries: SubmittedInvoiceSummaryRecord[],
  unitsSoldByModel: Record<string, number>,
  invoiceDraft: InvoiceDraftState
): void {
  const maxStockRow = Math.max(500, products.length + 10);

  // ===========================================================================
  // 1. "Invoice & Bill" Sheet (Printable Invoice in B2:G31 + Live Stock Ref & Submit Panel in J6:L31)
  // ===========================================================================
  const invAoA: (string | number)[][] = Array.from({ length: 34 }, () =>
    Array(13).fill('')
  );

  // Header Block (Rows 2-4 -> 0-indexed rows 1-3)
  invAoA[1][1] = 'KH ENTERPRISES (PVT.) LIMITED';
  invAoA[1][4] = 'COMMERCIAL INVOICE & BILL';
  invAoA[2][1] =
    'Universal Industrial Automation, CNC Controllers, Servo Systems & Robotics';
  invAoA[2][4] = 'Invoice / Bill No:';
  invAoA[2][5] = invoiceDraft.invoiceNo || 'INV-SZGH-2026-001';
  invAoA[3][1] =
    'Brandreth Road / Industrial Hub, Lahore, Pakistan | +92 321 4800265';
  invAoA[3][4] = 'Invoice Date:';
  invAoA[3][5] = invoiceDraft.invoiceDate;

  // Bill To & Bank Details + Right-Hand Non-Print Live Warehouse Stock Panel Header (Row 6 -> idx 5)
  invAoA[5][1] = 'BILL TO ';
  invAoA[5][4] = 'BANK DETAILS :';
  invAoA[5][9] = 'LIVE WAREHOUSE STOCK PANEL (REF)';

  invAoA[6][1] = 'Customer Name:';
  invAoA[6][2] = invoiceDraft.customerName || '';
  invAoA[6][4] = 'Assigned Sales Agent:';
  invAoA[6][6] = invoiceDraft.salesAgent || 'Direct By KH Enterprises';
  invAoA[6][9] = 'Real-Time Stock Check Linked to Stock List Sheet';

  invAoA[7][1] = 'Company :';
  invAoA[7][2] = invoiceDraft.companyName || '';
  invAoA[7][4] = 'Payment Bank / Account:';
  invAoA[7][6] =
    invoiceDraft.paymentBankAccount || 'UBL KH Enterprises Pvt Ltd';

  invAoA[8][1] = 'Delivery Address:';
  invAoA[8][2] = invoiceDraft.deliveryAddress || '';
  invAoA[8][4] = 'Account No.';
  invAoA[8][6] = invoiceDraft.accountNo || 'PK45UNIL0109000349986649';

  invAoA[9][1] = 'Contact & City:';
  invAoA[9][2] = invoiceDraft.contactAndCity || '';
  invAoA[9][4] = 'Customer ID Reference:';
  invAoA[9][6] = invoiceDraft.customerId || 'CUST-001';

  // Table Headers (Row 12 -> idx 11)
  invAoA[11][1] = 'S.No';
  invAoA[11][2] = 'Product Model';
  invAoA[11][3] = 'Product Description';
  invAoA[11][4] = 'Bill Qty';
  invAoA[11][5] = 'Unit Price (PKR)';
  invAoA[11][6] = 'Line Total (PKR)';

  // Live Warehouse Stock Panel Headers (Cols J, K, L -> indices 9, 10, 11)
  invAoA[11][9] = 'Product Model';
  invAoA[11][10] = 'Available Stock';
  invAoA[11][11] = 'Stock Status';

  // 12 Line Item Rows (Rows 13-24 -> idx 12-23)
  for (let i = 0; i < 12; i++) {
    const rIdx = 12 + i;
    const item = invoiceDraft.rows[i] || {
      sNo: i + 1,
      modelNumber: '',
      description: '',
      billQty: 0,
      unitPricePKR: 0,
    };
    const matchedProd = findProductForInvoiceModel(item.modelNumber, products);
    const availStock = matchedProd ? matchedProd.stockCount : 0;

    invAoA[rIdx][1] = i + 1;
    invAoA[rIdx][2] = item.modelNumber || '';
    invAoA[rIdx][3] = item.description || '';
    invAoA[rIdx][4] = item.billQty > 0 ? item.billQty : '';
    invAoA[rIdx][5] = item.unitPricePKR > 0 ? item.unitPricePKR : '';
    invAoA[rIdx][6] =
      item.modelNumber && item.billQty > 0
        ? Math.round(item.billQty * item.unitPricePKR)
        : 0;

    // Side panel values
    invAoA[rIdx][9] = item.modelNumber || '-';
    invAoA[rIdx][10] = item.modelNumber ? availStock : '';
    invAoA[rIdx][11] = item.modelNumber
      ? availStock <= 0
        ? 'No stock'
        : 'IN STOCK ✓'
      : '';
  }

  // Footer & Totals (Rows 26-31 -> idx 25-30)
  const subtotalVal = invoiceDraft.rows.reduce(
    (sum, r) =>
      sum + (r.modelNumber && r.billQty > 0 ? r.billQty * r.unitPricePKR : 0),
    0
  );
  const gstVal = invoiceDraft.includeGst18 ? Math.round(subtotalVal * 0.18) : 0;
  const discountVal = Math.round(invoiceDraft.discountPKR || 0);
  const netTotalVal = Math.max(0, subtotalVal + gstVal - discountVal);
  const receivedVal = Math.round(invoiceDraft.amountReceivedPKR || 0);
  const balanceVal = netTotalVal - receivedVal;

  invAoA[25][1] = 'TERMS & CONDITIONS:';
  invAoA[25][4] = 'Subtotal (Excl. GST PKR):';
  invAoA[25][6] = subtotalVal;

  invAoA[26][1] =
    '• Standard 12-Month Manufacturer Warranty on SZGH Controllers & Drives.';
  invAoA[26][4] = '(18% GST PKR):';
  invAoA[26][6] = gstVal;

  invAoA[27][1] = '• Goods once sold are only exchangeable under warranty terms.';
  invAoA[27][4] = 'Discount (PKR):';
  invAoA[27][6] = discountVal;

  invAoA[28][1] = '• Computer generated invoice & bill.';
  invAoA[28][4] = '(INCL.18% TAX PKR):';
  invAoA[28][6] = netTotalVal;

  invAoA[29][4] = 'Amount Received (PKR):';
  invAoA[29][6] = receivedVal;

  invAoA[30][1] = 'Authorized Signature: ___________________________';
  invAoA[30][4] = 'BALANCE (PKR):';
  invAoA[30][6] = balanceVal;

  // Non-Print Action Panel in J26:L31 (Outside Printable Invoice Format B2:G31)
  invAoA[25][9] = 'INVOICE SUBMISSION & STOCK DEDUCTION PANEL (NON-PRINT)';
  invAoA[26][9] = '[ SUBMIT INVOICE & REDUCE STOCK ]';
  invAoA[26][10] = 'Action Status:';
  invAoA[26][11] =
    submittedSummaries.length > 0
      ? `Synced (${submittedSummaries.length} Submitted)`
      : 'Ready to Submit';
  invAoA[27][9] = 'Stock Sheet Link:';
  invAoA[27][10] = 'Stock List (Live)';
  invAoA[27][11] = 'Auto-Deducts Qty';
  invAoA[28][9] = 'Summary Sheet Link:';
  invAoA[28][10] = 'Summary (Order Log)';
  invAoA[28][11] = 'Auto-Appends Order';

  const wsInvoice = XLSX.utils.aoa_to_sheet(invAoA);

  // Attach live Excel formulas to "Invoice & Bill" so editing in Excel dynamically links to "Stock List" & "Customer Master"
  for (let i = 0; i < 12; i++) {
    const excelRow = 13 + i;
    const item = invoiceDraft.rows[i];
    if (!item?.description) {
      wsInvoice[`D${excelRow}`] = {
        t: 's',
        v: item?.description || '',
        f: `IF(C${excelRow}="","",IFERROR(INDEX('Stock List'!$D$6:$D$${maxStockRow},MATCH(C${excelRow},'Stock List'!$B$6:$B$${maxStockRow},0)),""))`,
      };
    }
    if (!item?.unitPricePKR) {
      wsInvoice[`F${excelRow}`] = {
        t: 'n',
        v: item?.unitPricePKR || 0,
        f: `IF(C${excelRow}="","",IFERROR(INDEX('Stock List'!$I$6:$I$${maxStockRow},MATCH(C${excelRow},'Stock List'!$B$6:$B$${maxStockRow},0)),0))`,
      };
    }
    wsInvoice[`G${excelRow}`] = {
      t: 'n',
      v:
        item?.modelNumber && item?.billQty > 0
          ? Math.round(item.billQty * item.unitPricePKR)
          : 0,
      f: `IF(OR(C${excelRow}="",E${excelRow}=""),0,ROUND(E${excelRow}*F${excelRow},0))`,
    };
    wsInvoice[`J${excelRow}`] = {
      t: 's',
      v: item?.modelNumber || '-',
      f: `IF(C${excelRow}="","-",C${excelRow})`,
    };
    const matchedProd = findProductForInvoiceModel(
      item?.modelNumber || '',
      products
    );
    wsInvoice[`K${excelRow}`] = {
      t: 'n',
      v: matchedProd ? matchedProd.stockCount : 0,
      f: `IF(C${excelRow}="","",IFERROR(INDEX('Stock List'!$G$6:$G$${maxStockRow},MATCH(C${excelRow},'Stock List'!$B$6:$B$${maxStockRow},0)),0))`,
    };
    wsInvoice[`L${excelRow}`] = {
      t: 's',
      v: item?.modelNumber
        ? (matchedProd?.stockCount ?? 0) <= 0
          ? 'No stock'
          : 'IN STOCK ✓'
        : '',
      f: `IF(C${excelRow}="","",IF(K${excelRow}<=0,"No stock","IN STOCK ✓"))`,
    };
  }

  wsInvoice['G26'] = { t: 'n', v: subtotalVal, f: 'SUM(G13:G24)' };
  wsInvoice['G29'] = { t: 'n', v: netTotalVal, f: 'G26+G27-G28' };
  wsInvoice['G31'] = { t: 'n', v: balanceVal, f: 'G29-G30' };

  wsInvoice['!cols'] = [
    { wch: 4 },
    { wch: 20 },
    { wch: 26 },
    { wch: 42 },
    { wch: 16 },
    { wch: 18 },
    { wch: 20 },
    { wch: 4 },
    { wch: 4 },
    { wch: 24 },
    { wch: 18 },
    { wch: 18 },
  ];

  // Configure Excel Print Area strictly to B2:G31 so the Submit Button & Stock Ref panel in J:L never print on the invoice
  if (!wb.Workbook) wb.Workbook = { Names: [] };
  if (!wb.Workbook.Names) wb.Workbook.Names = [];
  wb.Workbook.Names.push({
    Name: '_xlnm.Print_Area',
    Sheet: 0,
    Ref: "'Invoice & Bill'!$B$2:$G$31",
  });

  XLSX.utils.book_append_sheet(wb, wsInvoice, 'Invoice & Bill');

  // ===========================================================================
  // 2. "Summary" Sheet (New Order Summary Sheet of Submitted Invoices & Orders)
  // ===========================================================================
  const totalSummaryUnits = submittedSummaries.reduce(
    (acc, s) => acc + s.totalUnitsBilled,
    0
  );
  const totalSummarySubtotal = submittedSummaries.reduce(
    (acc, s) => acc + s.subtotalExclGstPKR,
    0
  );
  const totalSummaryGst = submittedSummaries.reduce(
    (acc, s) => acc + s.gst18PKR,
    0
  );
  const totalSummaryDiscount = submittedSummaries.reduce(
    (acc, s) => acc + s.discountPKR,
    0
  );
  const totalSummaryNet = submittedSummaries.reduce(
    (acc, s) => acc + s.totalInclTaxPKR,
    0
  );
  const totalSummaryReceived = submittedSummaries.reduce(
    (acc, s) => acc + s.amountReceivedPKR,
    0
  );
  const totalSummaryBalance = submittedSummaries.reduce(
    (acc, s) => acc + s.balanceDuePKR,
    0
  );

  const summaryRows: (string | number)[][] = [
    [],
    [
      '',
      'SZGH PAKISTAN — ORDER & INVOICE SUMMARY SHEET',
      '',
      '',
      'TOTAL INVOICES',
      'TOTAL UNITS SOLD',
      'SUBTOTAL (PKR)',
      '18% GST (PKR)',
      'DISCOUNT (PKR)',
      'NET TOTAL (PKR)',
      'RECEIVED (PKR)',
      'BALANCE DUE (PKR)',
    ],
    [
      '',
      'Automated Order Summary Log Created Upon Invoice Submission & Stock Deduction',
      '',
      '',
      submittedSummaries.length,
      totalSummaryUnits,
      totalSummarySubtotal,
      totalSummaryGst,
      totalSummaryDiscount,
      totalSummaryNet,
      totalSummaryReceived,
      totalSummaryBalance,
    ],
    [],
    [
      'S.No',
      'Summary ID',
      'Invoice / Bill No',
      'Invoice Date',
      'Submitted At',
      'Customer ID',
      'Customer Name',
      'Company Name',
      'Contact & City',
      'Delivery Address',
      'Assigned Sales Agent',
      'Payment Bank / Account',
      'Account No.',
      'Order Line Items (Model × Qty @ Price & Stock Impact)',
      'Total Units Billed',
      'Subtotal (Excl. GST PKR)',
      '18% GST (PKR)',
      'Discount (PKR)',
      'Net Invoice Total (PKR)',
      'Amount Received (PKR)',
      'Balance Due (PKR)',
      'Payment Status',
      'Stock Deduction Status',
    ],
  ];

  submittedSummaries.forEach((rec, idx) => {
    summaryRows.push([
      idx + 1,
      rec.summaryId,
      rec.invoiceNo,
      rec.invoiceDate,
      rec.submittedAt,
      rec.customerId,
      rec.customerName,
      rec.companyName,
      rec.contactAndCity,
      rec.deliveryAddress,
      rec.salesAgent,
      rec.paymentBankAccount,
      rec.accountNo,
      rec.itemsSummaryText,
      rec.totalUnitsBilled,
      rec.subtotalExclGstPKR,
      rec.gst18PKR,
      rec.discountPKR,
      rec.totalInclTaxPKR,
      rec.amountReceivedPKR,
      rec.balanceDuePKR,
      rec.paymentStatus,
      rec.stockDeducted ? 'STOCK DEDUCTED ✓' : 'PENDING',
    ]);
  });

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  const maxSummaryRow = Math.max(10, submittedSummaries.length + 6);
  wsSummary['F3'] = {
    t: 'n',
    v: totalSummaryUnits,
    f: `SUBTOTAL(9,O6:O${maxSummaryRow})`,
  };
  wsSummary['G3'] = {
    t: 'n',
    v: totalSummarySubtotal,
    f: `SUBTOTAL(9,P6:P${maxSummaryRow})`,
  };
  wsSummary['H3'] = {
    t: 'n',
    v: totalSummaryGst,
    f: `SUBTOTAL(9,Q6:Q${maxSummaryRow})`,
  };
  wsSummary['I3'] = {
    t: 'n',
    v: totalSummaryDiscount,
    f: `SUBTOTAL(9,R6:R${maxSummaryRow})`,
  };
  wsSummary['J3'] = {
    t: 'n',
    v: totalSummaryNet,
    f: `SUBTOTAL(9,S6:S${maxSummaryRow})`,
  };
  wsSummary['K3'] = {
    t: 'n',
    v: totalSummaryReceived,
    f: `SUBTOTAL(9,T6:T${maxSummaryRow})`,
  };
  wsSummary['L3'] = {
    t: 'n',
    v: totalSummaryBalance,
    f: `SUBTOTAL(9,U6:U${maxSummaryRow})`,
  };

  wsSummary['!cols'] = [
    { wch: 6 },
    { wch: 16 },
    { wch: 22 },
    { wch: 14 },
    { wch: 20 },
    { wch: 14 },
    { wch: 22 },
    { wch: 26 },
    { wch: 22 },
    { wch: 28 },
    { wch: 24 },
    { wch: 24 },
    { wch: 26 },
    { wch: 58 },
    { wch: 16 },
    { wch: 20 },
    { wch: 16 },
    { wch: 16 },
    { wch: 22 },
    { wch: 20 },
    { wch: 18 },
    { wch: 16 },
    { wch: 20 },
  ];

  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // ===========================================================================
  // 3. "Stock List" Sheet (Live Warehouse Stock Linked to Invoice & Bill + Summary)
  // ===========================================================================
  let totalWarehouseUnits = 0;
  let totalSoldUnitsAll = 0;
  let totalAvailableUnits = 0;
  let totalInventoryValuePKR = 0;

  const stockRows: (string | number)[][] = [
    [],
    [
      '',
      'MASTER INVENTORY & STOCK LEDGER',
      '',
      '',
      'TOTAL WAREHOUSE STOCK',
      'TOTAL UNITS SOLD',
      'AVAILABLE STOCK QTY',
      '',
      '',
      'AVAILABLE STOCK VALUE (PKR)',
    ],
    [
      '',
      'Consolidated Warehouse Stock, Automated Invoice Deductions & Real-Time Stock Availability',
      '',
      '',
      0,
      0,
      0,
      '',
      '',
      0,
    ],
    [],
    [
      '',
      'Product Model',
      'Product Category',
      'Product Description',
      'Total Stock (Warehouse)',
      'Total Units Sold',
      'Available Stock Qty',
      'Stock Status',
      'Unit Price (PKR)',
      'Inventory Value (PKR)',
    ],
  ];

  products.forEach((prod) => {
    const modelKey = prod.modelNumber.trim().toUpperCase();
    const soldQty = unitsSoldByModel[modelKey] || 0;
    const availQty = Math.max(0, prod.stockCount ?? 0);
    const warehouseTotal = availQty + soldQty;
    const unitPrice = prod.price > 0 ? prod.price : 0;
    const invVal = availQty * unitPrice;

    totalWarehouseUnits += warehouseTotal;
    totalSoldUnitsAll += soldQty;
    totalAvailableUnits += availQty;
    totalInventoryValuePKR += invVal;

    stockRows.push([
      '',
      prod.modelNumber,
      prod.category,
      prod.description || prod.title || '',
      warehouseTotal,
      soldQty,
      availQty,
      availQty <= 0 ? 'No stock' : `IN STOCK (${availQty})`,
      unitPrice,
      invVal,
    ]);
  });

  // Update Row 3 totals
  stockRows[2][4] = totalWarehouseUnits;
  stockRows[2][5] = totalSoldUnitsAll;
  stockRows[2][6] = totalAvailableUnits;
  stockRows[2][9] = totalInventoryValuePKR;

  const wsStockList = XLSX.utils.aoa_to_sheet(stockRows);
  const lastStockRow = products.length + 5;

  wsStockList['E3'] = {
    t: 'n',
    v: totalWarehouseUnits,
    f: `SUBTOTAL(9,E6:E${lastStockRow})`,
  };
  wsStockList['F3'] = {
    t: 'n',
    v: totalSoldUnitsAll,
    f: `SUBTOTAL(9,F6:F${lastStockRow})`,
  };
  wsStockList['G3'] = {
    t: 'n',
    v: totalAvailableUnits,
    f: `SUBTOTAL(9,G6:G${lastStockRow})`,
  };
  wsStockList['J3'] = {
    t: 'n',
    v: totalInventoryValuePKR,
    f: `SUBTOTAL(9,J6:J${lastStockRow})`,
  };

  for (let i = 0; i < products.length; i++) {
    const r = 6 + i;
    const prod = products[i];
    const availQty = Math.max(0, prod.stockCount ?? 0);
    const unitPrice = prod.price > 0 ? prod.price : 0;

    wsStockList[`G${r}`] = {
      t: 'n',
      v: availQty,
      f: `E${r}-F${r}`,
    };
    wsStockList[`H${r}`] = {
      t: 's',
      v: availQty <= 0 ? 'No stock' : `IN STOCK (${availQty})`,
      f: `IF(G${r}<=0,"No stock","IN STOCK ("&G${r}&")")`,
    };
    wsStockList[`J${r}`] = {
      t: 'n',
      v: availQty * unitPrice,
      f: `MAX(0,G${r})*I${r}`,
    };
  }

  wsStockList['!cols'] = [
    { wch: 4 },
    { wch: 24 },
    { wch: 18 },
    { wch: 48 },
    { wch: 24 },
    { wch: 18 },
    { wch: 20 },
    { wch: 18 },
    { wch: 18 },
    { wch: 22 },
  ];

  XLSX.utils.book_append_sheet(wb, wsStockList, 'Stock List');

  // ===========================================================================
  // 4. "Customer Master" Sheet (Linked to Invoice & Bill + Summary)
  // ===========================================================================
  const customerRows: (string | number)[][] = [
    [],
    ['', 'CUSTOMER MASTER DIRECTORY & RECEIVABLES LEDGER'],
    [
      '',
      'Centralized Client Database Linked to Commercial Invoice & Bill and Order Summary Sheet',
    ],
    [],
    [
      '',
      'Customer ID',
      'Customer Contact Person',
      'Company / Business Name',
      'City / Hub',
      'Complete Factory / Workshop Address',
      'Contact Phone / Mobile',
      'Email Address',
      'Assigned Sales Agent',
      'Total Billed (PKR)',
      'Total Paid (PKR)',
      'Current Balance Receivable (PKR)',
      'Account Status',
    ],
  ];

  INITIAL_CUSTOMER_MASTER.forEach((cust) => {
    const custSummaries = submittedSummaries.filter(
      (s) =>
        s.customerId === cust.customerId ||
        s.customerName.toLowerCase() === cust.contactPerson.toLowerCase()
    );
    const billed = custSummaries.reduce((a, b) => a + b.totalInclTaxPKR, 0);
    const paid = custSummaries.reduce((a, b) => a + b.amountReceivedPKR, 0);
    const bal = billed - paid;
    customerRows.push([
      '',
      cust.customerId,
      cust.contactPerson,
      cust.companyName,
      cust.city,
      cust.address,
      cust.phone,
      cust.email,
      cust.salesAgent,
      billed,
      paid,
      bal,
      bal > 0 ? 'PAYMENT DUE' : 'SETTLED ✓',
    ]);
  });

  const wsCustomer = XLSX.utils.aoa_to_sheet(customerRows);
  wsCustomer['!cols'] = [
    { wch: 4 },
    { wch: 14 },
    { wch: 26 },
    { wch: 28 },
    { wch: 16 },
    { wch: 34 },
    { wch: 18 },
    { wch: 24 },
    { wch: 24 },
    { wch: 18 },
    { wch: 18 },
    { wch: 26 },
    { wch: 16 },
  ];
  XLSX.utils.book_append_sheet(wb, wsCustomer, 'Customer Master');
}

export const InvoiceAndSummaryWorkspace: React.FC<
  InvoiceAndSummaryWorkspaceProps
> = ({
  mode,
  products,
  orders,
  invoiceDraft,
  setInvoiceDraft,
  submittedSummaries,
  unitsSoldByModel,
  onSubmitInvoiceAndDeductStock,
  onLoadWebsiteOrderIntoInvoice,
  onReloadSummaryIntoInvoice,
  onUpdateSummaryAmountReceived,
  onDeleteSummaryRecord,
  onDownloadMasterExcel,
  onSwitchMode,
  submittingInvoice,
}) => {
  const [summarySearch, setSummarySearch] = useState('');
  const [summaryStatusFilter, setSummaryStatusFilter] = useState<
    'ALL' | 'PAID IN FULL' | 'PARTIAL' | 'UNPAID'
  >('ALL');
  const [customCustomerModalOpen, setCustomCustomerModalOpen] = useState(false);
  const [customerList, setCustomerList] = useState<CustomerMasterRecord[]>(
    INITIAL_CUSTOMER_MASTER
  );
  const [newCustName, setNewCustName] = useState('');
  const [newCustCompany, setNewCustCompany] = useState('');
  const [newCustCity, setNewCustCity] = useState('Lahore');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAgent, setNewCustAgent] = useState('Direct By KH Enterprises');

  // Calculate live invoice totals
  const invoiceCalculations = useMemo(() => {
    let subtotalExclGst = 0;
    let totalUnits = 0;
    let hasStockWarning = false;

    const enrichedRows = invoiceDraft.rows.map((row) => {
      const matchedProduct = findProductForInvoiceModel(
        row.modelNumber,
        products
      );
      const availableStock = matchedProduct ? matchedProduct.stockCount : 0;
      const qty = Math.max(0, Number(row.billQty) || 0);
      const unitPrice = Math.max(0, Number(row.unitPricePKR) || 0);
      const lineTotal =
        row.modelNumber.trim() && qty > 0 ? Math.round(qty * unitPrice) : 0;

      if (row.modelNumber.trim() && qty > 0) {
        subtotalExclGst += lineTotal;
        totalUnits += qty;
        if (matchedProduct && qty > availableStock) {
          hasStockWarning = true;
        }
      }

      return {
        ...row,
        matchedProduct,
        availableStock,
        remainingStockAfterBill: matchedProduct
          ? Math.max(0, availableStock - qty)
          : 0,
        lineTotal,
        exceedsStock: Boolean(
          row.modelNumber.trim() && matchedProduct && qty > availableStock
        ),
      };
    });

    const gst18PKR = invoiceDraft.includeGst18
      ? Math.round(subtotalExclGst * 0.18)
      : 0;
    const discountPKR = Math.max(0, Math.round(invoiceDraft.discountPKR || 0));
    const totalInclTaxPKR = Math.max(
      0,
      subtotalExclGst + gst18PKR - discountPKR
    );
    const amountReceivedPKR = Math.max(
      0,
      Math.round(invoiceDraft.amountReceivedPKR || 0)
    );
    const balanceDuePKR = totalInclTaxPKR - amountReceivedPKR;

    return {
      enrichedRows,
      subtotalExclGst,
      totalUnits,
      gst18PKR,
      discountPKR,
      totalInclTaxPKR,
      amountReceivedPKR,
      balanceDuePKR,
      hasStockWarning,
    };
  }, [invoiceDraft, products]);

  // Handle selecting a customer from Customer Master dropdown
  const handleSelectCustomerMaster = (customerNameOrId: string) => {
    const found = customerList.find(
      (c) =>
        c.customerId === customerNameOrId ||
        c.contactPerson.toLowerCase() === customerNameOrId.toLowerCase()
    );
    if (found) {
      setInvoiceDraft((prev) => ({
        ...prev,
        customerId: found.customerId,
        customerName: found.contactPerson,
        companyName: found.companyName || found.contactPerson,
        deliveryAddress: found.address || found.city,
        contactAndCity: [found.phone, found.city].filter(Boolean).join(' — '),
        salesAgent: found.salesAgent || prev.salesAgent,
      }));
    } else {
      setInvoiceDraft((prev) => ({
        ...prev,
        customerName: customerNameOrId,
      }));
    }
  };

  // Handle selecting a payment bank account
  const handleSelectPaymentBank = (bankLabel: string) => {
    const found = MASTER_PAYMENT_ACCOUNTS.find(
      (b) => b.bankLabel === bankLabel
    );
    setInvoiceDraft((prev) => ({
      ...prev,
      paymentBankAccount: bankLabel,
      accountNo: found ? found.accountNo : prev.accountNo,
    }));
  };

  // Handle updating a single line item row
  const handleUpdateLineItem = (
    rowIndex: number,
    field: keyof InvoiceLineItem,
    value: string | number
  ) => {
    setInvoiceDraft((prev) => {
      const nextRows = [...prev.rows];
      const current = { ...nextRows[rowIndex] };

      if (field === 'modelNumber') {
        const modelStr = String(value);
        current.modelNumber = modelStr;
        const matched = findProductForInvoiceModel(modelStr, products);
        if (matched) {
          current.productId = matched.id;
          current.description = matched.description || matched.title || '';
          current.unitPricePKR = matched.price > 0 ? matched.price : 0;
          if (!current.billQty || current.billQty <= 0) {
            current.billQty = 1;
          }
        }
      } else if (field === 'description') {
        current.description = String(value);
      } else if (field === 'billQty') {
        current.billQty = Math.max(0, Math.round(Number(value) || 0));
      } else if (field === 'unitPricePKR') {
        current.unitPricePKR = Math.max(0, Math.round(Number(value) || 0));
      }

      nextRows[rowIndex] = current;
      return {
        ...prev,
        rows: nextRows,
      };
    });
  };

  const handleClearRow = (rowIndex: number) => {
    setInvoiceDraft((prev) => {
      const nextRows = [...prev.rows];
      nextRows[rowIndex] = {
        sNo: rowIndex + 1,
        modelNumber: '',
        description: '',
        billQty: 0,
        unitPricePKR: 0,
      };
      return { ...prev, rows: nextRows };
    });
  };

  const handleResetNewInvoice = () => {
    const nextNum = submittedSummaries.length + 1;
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(
      today.getMonth() + 1
    ).padStart(2, '0')}-${today.getFullYear()}`;
    setInvoiceDraft({
      invoiceNo: `INV-SZGH-2026-${String(nextNum).padStart(3, '0')}`,
      invoiceDate: formattedDate,
      customerId: 'CUST-001',
      customerName: '',
      companyName: '',
      deliveryAddress: '',
      contactAndCity: '',
      salesAgent: 'Direct By KH Enterprises',
      paymentBankAccount: 'UBL KH Enterprises Pvt Ltd',
      accountNo: 'PK45UNIL0109000349986649',
      rows: createEmptyInvoiceRows(12),
      includeGst18: false,
      discountPKR: 0,
      amountReceivedPKR: 0,
      linkedWebsiteOrderId: undefined,
    });
  };

  const handleAddQuickCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;
    const newId = `CUST-${String(customerList.length + 1).padStart(3, '0')}`;
    const created: CustomerMasterRecord = {
      customerId: newId,
      contactPerson: newCustName.trim(),
      companyName: newCustCompany.trim() || newCustName.trim(),
      city: newCustCity.trim() || 'Lahore',
      address: newCustAddress.trim() || newCustCity.trim() || 'Lahore',
      phone: newCustPhone.trim(),
      email: '',
      salesAgent: newCustAgent,
    };
    setCustomerList((prev) => [...prev, created]);
    setInvoiceDraft((prev) => ({
      ...prev,
      customerId: created.customerId,
      customerName: created.contactPerson,
      companyName: created.companyName,
      deliveryAddress: created.address,
      contactAndCity: [created.phone, created.city].filter(Boolean).join(' — '),
      salesAgent: created.salesAgent,
    }));
    setNewCustName('');
    setNewCustCompany('');
    setNewCustAddress('');
    setNewCustPhone('');
    setCustomCustomerModalOpen(false);
  };

  // Filtered Summary Sheet rows
  const filteredSummaries = useMemo(() => {
    return submittedSummaries.filter((s) => {
      if (
        summaryStatusFilter !== 'ALL' &&
        s.paymentStatus !== summaryStatusFilter
      ) {
        return false;
      }
      const q = summarySearch.trim().toLowerCase();
      if (!q) return true;
      return (
        s.invoiceNo.toLowerCase().includes(q) ||
        s.summaryId.toLowerCase().includes(q) ||
        s.customerName.toLowerCase().includes(q) ||
        s.companyName.toLowerCase().includes(q) ||
        s.itemsSummaryText.toLowerCase().includes(q) ||
        s.salesAgent.toLowerCase().includes(q)
      );
    });
  }, [submittedSummaries, summarySearch, summaryStatusFilter]);

  // Summary KPIs
  const summaryKpis = useMemo(() => {
    return submittedSummaries.reduce(
      (acc, item) => {
        acc.totalInvoices += 1;
        acc.totalUnitsSold += item.totalUnitsBilled;
        acc.subtotalPKR += item.subtotalExclGstPKR;
        acc.gstPKR += item.gst18PKR;
        acc.discountPKR += item.discountPKR;
        acc.netTotalPKR += item.totalInclTaxPKR;
        acc.receivedPKR += item.amountReceivedPKR;
        acc.balancePKR += item.balanceDuePKR;
        return acc;
      },
      {
        totalInvoices: 0,
        totalUnitsSold: 0,
        subtotalPKR: 0,
        gstPKR: 0,
        discountPKR: 0,
        netTotalPKR: 0,
        receivedPKR: 0,
        balancePKR: 0,
      }
    );
  }, [submittedSummaries]);

  if (mode === 'summary') {
    return (
      <div className="space-y-6">
        {/* Top Banner & Export Controls */}
        <div className="p-5 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                Order &amp; Invoice Summary Sheet — Master Sales &amp; Stock Deduction Ledger
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Every invoice submitted from the <strong>Invoice &amp; Bill</strong> sheet automatically deducts stock from the <strong>Stock List</strong> and records a permanent order summary below.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onSwitchMode('invoice')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Invoice &amp; Bill</span>
            </button>
            <button
              type="button"
              onClick={onDownloadMasterExcel}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Master Excel with Summary Sheet (.xlsx)</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Summary</span>
            </button>
          </div>
        </div>

        {/* Executive KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Submitted Invoices
            </div>
            <div className="text-xl font-extrabold font-mono-tabular text-slate-900 dark:text-white mt-1">
              {summaryKpis.totalInvoices}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              Stock Deducted ✓
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Units Sold
            </div>
            <div className="text-xl font-extrabold font-mono-tabular text-[#1E2985] dark:text-blue-400 mt-1">
              {summaryKpis.totalUnitsSold.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Deducted from Stock List
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Subtotal (Excl. Tax)
            </div>
            <div className="text-base font-extrabold font-mono-tabular text-slate-900 dark:text-white mt-1">
              PKR {formatPKR(summaryKpis.subtotalPKR)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              + GST: PKR {formatPKR(summaryKpis.gstPKR)}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Net Billed Total
            </div>
            <div className="text-base font-extrabold font-mono-tabular text-slate-900 dark:text-white mt-1">
              PKR {formatPKR(summaryKpis.netTotalPKR)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Disc: PKR {formatPKR(summaryKpis.discountPKR)}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Amount Received
            </div>
            <div className="text-base font-extrabold font-mono-tabular text-emerald-700 dark:text-emerald-300 mt-1">
              PKR {formatPKR(summaryKpis.receivedPKR)}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
              Collected in Bank/Cash
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Balance Receivable
            </div>
            <div className="text-base font-extrabold font-mono-tabular text-amber-800 dark:text-amber-300 mt-1">
              PKR {formatPKR(summaryKpis.balancePKR)}
            </div>
            <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
              Outstanding Ledger
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={summarySearch}
              onChange={(e) => setSummarySearch(e.target.value)}
              placeholder="Search Summary Sheet by Invoice No, Customer, Company, Model, or Sales Agent..."
              className="w-full pl-9 pr-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {(['ALL', 'PAID IN FULL', 'PARTIAL', 'UNPAID'] as const).map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSummaryStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                    summaryStatusFilter === st
                      ? 'bg-[#1E2985] text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              )
            )}
          </div>
        </div>

        {/* Summary Sheet Data Table */}
        {filteredSummaries.length === 0 ? (
          <div className="p-12 text-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <FileText className="w-10 h-10 text-slate-400 mx-auto" />
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
              No Submitted Invoices in Summary Sheet Yet
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Go to the <strong>Invoice &amp; Bill</strong> tab, select your customer and product models, and click <strong>&quot;Submit Invoice &amp; Deduct Stock&quot;</strong>. The stock will automatically reduce and the complete order summary will appear here.
            </p>
            <button
              type="button"
              onClick={() => onSwitchMode('invoice')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#0D5C2B] hover:bg-[#094720] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Open Invoice &amp; Bill Sheet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white border-b border-slate-800 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3 font-bold">Summary / Invoice No</th>
                  <th className="py-3 px-3 font-bold">Date</th>
                  <th className="py-3 px-3 font-bold">Customer &amp; Company</th>
                  <th className="py-3 px-3 font-bold">Agent &amp; Bank</th>
                  <th className="py-3 px-3 font-bold">
                    Billed Items &amp; Stock Deduction Audit
                  </th>
                  <th className="py-3 px-3 font-bold text-right">Qty</th>
                  <th className="py-3 px-3 font-bold text-right">
                    Net Total (PKR)
                  </th>
                  <th className="py-3 px-3 font-bold text-right">
                    Received (PKR)
                  </th>
                  <th className="py-3 px-3 font-bold text-right">
                    Balance (PKR)
                  </th>
                  <th className="py-3 px-3 font-bold text-center">Status</th>
                  <th className="py-3 px-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredSummaries.map((rec) => (
                  <tr
                    key={rec.summaryId}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors align-top"
                  >
                    <td className="py-3 px-3 font-mono-tabular">
                      <div className="font-extrabold text-[#1E2985] dark:text-blue-400">
                        {rec.invoiceNo}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {rec.summaryId}
                      </div>
                      <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                        Stock Reduced ✓
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono-tabular whitespace-nowrap">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {rec.invoiceDate}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {rec.submittedAt}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {rec.customerName}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">
                        {rec.companyName}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {rec.contactAndCity}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {rec.salesAgent}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">
                        {rec.paymentBankAccount}
                      </div>
                      <div className="text-[10px] font-mono-tabular text-slate-500">
                        {rec.accountNo}
                      </div>
                    </td>
                    <td className="py-3 px-3 max-w-md">
                      <div className="space-y-1">
                        {rec.lineItems.map((li, idx) => (
                          <div
                            key={idx}
                            className="p-1.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]"
                          >
                            <div>
                              <span className="font-mono-tabular font-extrabold text-slate-900 dark:text-white">
                                {li.modelNumber}
                              </span>{' '}
                              <span className="text-slate-500">
                                × {li.qty} @ PKR {formatPKR(li.unitPricePKR)}
                              </span>
                            </div>
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 font-mono-tabular text-[10px] font-bold">
                              Stock: {li.stockBefore} → {li.stockAfter}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono-tabular font-extrabold text-slate-900 dark:text-white">
                      {rec.totalUnitsBilled}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-tabular">
                      <div className="font-extrabold text-slate-900 dark:text-white">
                        {formatPKR(rec.totalInclTaxPKR)}
                      </div>
                      {rec.gst18PKR > 0 && (
                        <div className="text-[10px] text-amber-600">
                          Incl. GST: {formatPKR(rec.gst18PKR)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-tabular">
                      <input
                        type="number"
                        min="0"
                        value={rec.amountReceivedPKR}
                        onChange={(e) =>
                          onUpdateSummaryAmountReceived(
                            rec.summaryId,
                            Math.max(0, Math.round(Number(e.target.value) || 0))
                          )
                        }
                        title="Update Amount Received (PKR)"
                        className="w-28 px-2 py-1 text-right rounded bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 font-mono-tabular font-bold text-emerald-800 dark:text-emerald-300 text-xs"
                      />
                    </td>
                    <td className="py-3 px-3 text-right font-mono-tabular font-extrabold text-amber-700 dark:text-amber-400">
                      {formatPKR(rec.balanceDuePKR)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          rec.paymentStatus === 'PAID IN FULL'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            : rec.paymentStatus === 'PARTIAL'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                            : 'bg-red-500/15 text-red-600 dark:text-red-400'
                        }`}
                      >
                        {rec.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap space-x-1">
                      <button
                        type="button"
                        onClick={() => onReloadSummaryIntoInvoice(rec)}
                        className="px-2.5 py-1 rounded bg-[#1E2985] hover:bg-[#16206B] text-white text-[11px] font-bold transition-colors cursor-pointer"
                        title="View / Print this Invoice in the Invoice & Bill tab"
                      >
                        View Bill
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSummaryRecord(rec.summaryId)}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Delete Summary Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // ===========================================================================
  // MODE === 'invoice': COMMERCIAL INVOICE & BILL + SIDE STOCK & SUBMIT PANEL
  // ===========================================================================
  return (
    <div className="space-y-5">
      {/* Datalist of all 200+ Catalog Product Models for instant autocomplete in Invoice rows */}
      <datalist id="szgh-invoice-catalog-models">
        {products.map((p) => (
          <option
            key={p.id}
            value={p.modelNumber}
          >{`${p.modelNumber} — ${p.title || p.description.slice(0, 60)} (Stock: ${p.stockCount}, PKR ${formatPKR(p.price)})`}</option>
        ))}
      </datalist>

      {/* Top Quick Bar (Hidden when printing the invoice) */}
      <div className="print:hidden p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
              Commercial Invoice &amp; Bill Generator (Integrated with Stock List &amp; Summary Sheet)
            </h3>
          </div>
          <p className="text-xs text-slate-300">
            Select a customer or load a received website order, enter product models &amp; quantities, check live stock on the right panel, and hit <strong>Submit Invoice &amp; Deduct Stock</strong> (outside the invoice format).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {orders.length > 0 && (
            <select
              defaultValue=""
              onChange={(e) => {
                const foundOrder = orders.find(
                  (o) => o.orderId === e.target.value
                );
                if (foundOrder) {
                  onLoadWebsiteOrderIntoInvoice(foundOrder);
                }
              }}
              className="px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300 cursor-pointer"
            >
              <option value="" disabled>
                ⚡ Load Received Website Order ({orders.length})...
              </option>
              {orders.map((ord) => (
                <option key={ord.orderId} value={ord.orderId}>
                  {ord.orderId} — {ord.companyName || ord.contactName} (PKR{' '}
                  {formatPKR(ord.totalPKR)})
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={handleResetNewInvoice}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New / Clear Bill</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchMode('summary')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#1E2985] hover:bg-[#16206B] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>View Summary Sheet ({submittedSummaries.length})</span>
          </button>
        </div>
      </div>

      {/* Quick Add Customer Modal */}
      {customCustomerModalOpen && (
        <div className="print:hidden p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
              + Add New Client to Customer Master Directory
            </h4>
            <button
              type="button"
              onClick={() => setCustomCustomerModalOpen(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>
          <form
            onSubmit={handleAddQuickCustomer}
            className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2.5"
          >
            <input
              type="text"
              required
              placeholder="Customer Name *"
              value={newCustName}
              onChange={(e) => setNewCustName(e.target.value)}
              className="px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
            />
            <input
              type="text"
              placeholder="Company Name"
              value={newCustCompany}
              onChange={(e) => setNewCustCompany(e.target.value)}
              className="px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
            />
            <input
              type="text"
              placeholder="Phone / Mobile"
              value={newCustPhone}
              onChange={(e) => setNewCustPhone(e.target.value)}
              className="px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
            />
            <input
              type="text"
              placeholder="City (e.g. Lahore)"
              value={newCustCity}
              onChange={(e) => setNewCustCity(e.target.value)}
              className="px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
            />
            <input
              type="text"
              placeholder="Delivery Address"
              value={newCustAddress}
              onChange={(e) => setNewCustAddress(e.target.value)}
              className="px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded bg-[#0D5C2B] hover:bg-[#094720] text-white text-xs font-bold cursor-pointer"
            >
              Save &amp; Select Client
            </button>
          </form>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MAIN SPLIT WORKSPACE:                                                 */}
      {/* LEFT (Cols B:G): OFFICIAL PRINTABLE COMMERCIAL INVOICE & BILL FORMAT  */}
      {/* RIGHT (Cols J:L): NON-PRINT SUBMIT BUTTON & LIVE STOCK PANEL (REF)    */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT 8 COLUMNS: PRINTABLE INVOICE FORMAT (B2:G31) */}
        <div className="xl:col-span-8 bg-white text-slate-900 border-2 border-slate-800 rounded-lg shadow-sm p-5 sm:p-7 space-y-5 print:border-0 print:shadow-none print:p-0">
          {/* Row 2-4: Company Banner & Invoice No / Date */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-slate-900 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-[#0D5C2B] text-white text-[10px] font-extrabold tracking-widest uppercase">
                  SZGH PAKISTAN
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Official Distribution &amp; Engineering Ledger
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                KH ENTERPRISES (PVT.) LIMITED
              </h2>
              <p className="text-[11px] text-slate-600">
                CNC Controllers, Servo Motors &amp; Drives, Turnkey Machines &amp; Industrial Robots
              </p>
              <p className="text-[11px] text-slate-600 font-medium">
                Lahore, Pakistan | Tel / WhatsApp: +92 321 4800265 | khubaib4000@gmail.com
              </p>
            </div>

            <div className="sm:text-right space-y-2 shrink-0">
              <div className="inline-block px-3 py-1 rounded bg-slate-900 text-white text-xs font-black tracking-wider uppercase">
                COMMERCIAL INVOICE &amp; BILL
              </div>
              <div className="grid grid-cols-2 gap-2 items-center text-xs">
                <label className="font-bold text-slate-600 text-right">
                  Invoice / Bill No:
                </label>
                <input
                  type="text"
                  value={invoiceDraft.invoiceNo}
                  onChange={(e) =>
                    setInvoiceDraft((prev) => ({
                      ...prev,
                      invoiceNo: e.target.value,
                    }))
                  }
                  className="px-2 py-1 rounded border border-slate-300 font-mono-tabular font-extrabold text-slate-900 text-xs bg-slate-50 print:border-0 print:bg-transparent print:p-0"
                />
                <label className="font-bold text-slate-600 text-right">
                  Invoice Date:
                </label>
                <input
                  type="text"
                  value={invoiceDraft.invoiceDate}
                  onChange={(e) =>
                    setInvoiceDraft((prev) => ({
                      ...prev,
                      invoiceDate: e.target.value,
                    }))
                  }
                  className="px-2 py-1 rounded border border-slate-300 font-mono-tabular font-bold text-slate-900 text-xs bg-slate-50 print:border-0 print:bg-transparent print:p-0"
                />
              </div>
            </div>
          </div>

          {/* Rows 6-10: BILL TO (Left) & BANK DETAILS (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BILL TO BLOCK (B6:C10) */}
            <div className="border border-slate-300 rounded-md overflow-hidden">
              <div className="bg-slate-900 text-white px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>BILL TO</span>
                </span>
                <button
                  type="button"
                  onClick={() => setCustomCustomerModalOpen(true)}
                  className="print:hidden text-[10px] text-amber-300 hover:underline font-bold cursor-pointer"
                >
                  + New Client
                </button>
              </div>
              <div className="p-3 space-y-2 text-xs">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="font-bold text-slate-600">
                    Customer Name:
                  </span>
                  <div className="col-span-2 flex gap-1">
                    <input
                      type="text"
                      list="szgh-customer-master-list"
                      value={invoiceDraft.customerName}
                      onChange={(e) =>
                        handleSelectCustomerMaster(e.target.value)
                      }
                      placeholder="Select or type client name..."
                      className="w-full px-2 py-1 rounded border border-slate-300 font-bold text-slate-900 text-xs bg-amber-50/40 print:border-0 print:bg-transparent print:p-0"
                    />
                    <datalist id="szgh-customer-master-list">
                      {customerList.map((c) => (
                        <option key={c.customerId} value={c.contactPerson}>
                          {`${c.customerId} — ${c.companyName} (${c.city})`}
                        </option>
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="font-bold text-slate-600">Company :</span>
                  <input
                    type="text"
                    value={invoiceDraft.companyName}
                    onChange={(e) =>
                      setInvoiceDraft((prev) => ({
                        ...prev,
                        companyName: e.target.value,
                      }))
                    }
                    placeholder="Company / Workshop Name"
                    className="col-span-2 px-2 py-1 rounded border border-slate-300 text-slate-900 text-xs print:border-0 print:bg-transparent print:p-0"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="font-bold text-slate-600">
                    Delivery Address:
                  </span>
                  <input
                    type="text"
                    value={invoiceDraft.deliveryAddress}
                    onChange={(e) =>
                      setInvoiceDraft((prev) => ({
                        ...prev,
                        deliveryAddress: e.target.value,
                      }))
                    }
                    placeholder="Factory / Delivery Address"
                    className="col-span-2 px-2 py-1 rounded border border-slate-300 text-slate-900 text-xs print:border-0 print:bg-transparent print:p-0"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="font-bold text-slate-600">
                    Contact &amp; City:
                  </span>
                  <input
                    type="text"
                    value={invoiceDraft.contactAndCity}
                    onChange={(e) =>
                      setInvoiceDraft((prev) => ({
                        ...prev,
                        contactAndCity: e.target.value,
                      }))
                    }
                    placeholder="0300-XXXXXXX — Lahore"
                    className="col-span-2 px-2 py-1 rounded border border-slate-300 font-mono-tabular text-slate-900 text-xs print:border-0 print:bg-transparent print:p-0"
                  />
                </div>
              </div>
            </div>

            {/* BANK DETAILS BLOCK (E6:G10) */}
            <div className="border border-slate-300 rounded-md overflow-hidden">
              <div className="bg-slate-900 text-white px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>BANK DETAILS :</span>
              </div>
              <div className="p-3 space-y-2 text-xs">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="font-bold text-slate-600">
                    Assigned Agent:
                  </span>
                  <select
                    value={invoiceDraft.salesAgent}
                    onChange={(e) =>
                      setInvoiceDraft((prev) => ({
                        ...prev,
                        salesAgent: e.target.value,
                      }))
                    }
                    className="col-span-2 px-2 py-1 rounded border border-slate-300 font-bold text-slate-900 text-xs bg-white print:border-0 print:bg-transparent print:p-0"
                  >
                    {SALES_AGENT_OPTIONS.map((ag) => (
                      <option key={ag} value={ag}>
                        {ag}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="font-bold text-slate-600">
                    Bank / Account:
                  </span>
                  <select
                    value={invoiceDraft.paymentBankAccount}
                    onChange={(e) => handleSelectPaymentBank(e.target.value)}
                    className="col-span-2 px-2 py-1 rounded border border-slate-300 font-bold text-slate-900 text-xs bg-amber-50/40 print:border-0 print:bg-transparent print:p-0"
                  >
                    {MASTER_PAYMENT_ACCOUNTS.map((b) => (
                      <option key={b.bankLabel} value={b.bankLabel}>
                        {b.bankLabel}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="font-bold text-slate-600">Account No.</span>
                  <input
                    type="text"
                    value={invoiceDraft.accountNo}
                    onChange={(e) =>
                      setInvoiceDraft((prev) => ({
                        ...prev,
                        accountNo: e.target.value,
                      }))
                    }
                    className="col-span-2 px-2 py-1 rounded border border-slate-300 font-mono-tabular font-bold text-slate-900 text-xs print:border-0 print:bg-transparent print:p-0"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="font-bold text-slate-600">
                    Customer ID Ref:
                  </span>
                  <input
                    type="text"
                    value={invoiceDraft.customerId}
                    onChange={(e) =>
                      setInvoiceDraft((prev) => ({
                        ...prev,
                        customerId: e.target.value,
                      }))
                    }
                    className="col-span-2 px-2 py-1 rounded border border-slate-300 font-mono-tabular font-bold text-[#1E2985] text-xs print:border-0 print:bg-transparent print:p-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rows 12-24: 12-Row Line Items Table (B12:G24) */}
          <div className="overflow-x-auto border border-slate-300 rounded-md">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider">
                  <th className="py-2 px-2.5 text-center w-10">S.No</th>
                  <th className="py-2 px-2.5 w-44">Product Model</th>
                  <th className="py-2 px-2.5">Product Description</th>
                  <th className="py-2 px-2.5 text-right w-20">Bill Qty</th>
                  <th className="py-2 px-2.5 text-right w-32">
                    Unit Price (PKR)
                  </th>
                  <th className="py-2 px-2.5 text-right w-36">
                    Line Total (PKR)
                  </th>
                  <th className="py-2 px-1.5 text-center w-8 print:hidden">
                    ×
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoiceCalculations.enrichedRows.map((row, idx) => (
                  <tr
                    key={row.sNo}
                    className={`${
                      row.modelNumber
                        ? 'bg-white'
                        : 'bg-slate-50/50 print:bg-white'
                    }`}
                  >
                    <td className="py-1.5 px-2 text-center font-mono-tabular font-bold text-slate-500">
                      {row.sNo}
                    </td>
                    <td className="py-1.5 px-2">
                      <input
                        type="text"
                        list="szgh-invoice-catalog-models"
                        value={row.modelNumber}
                        onChange={(e) =>
                          handleUpdateLineItem(
                            idx,
                            'modelNumber',
                            e.target.value
                          )
                        }
                        placeholder="Select/type model..."
                        className="w-full px-2 py-1 rounded border border-slate-200 font-mono-tabular font-bold text-slate-900 text-xs focus:border-[#1E2985] print:border-0 print:p-0"
                      />
                    </td>
                    <td className="py-1.5 px-2">
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) =>
                          handleUpdateLineItem(
                            idx,
                            'description',
                            e.target.value
                          )
                        }
                        placeholder="Auto-filled from Stock List..."
                        className="w-full px-2 py-1 rounded border border-slate-200 text-slate-700 text-xs print:border-0 print:p-0"
                      />
                    </td>
                    <td className="py-1.5 px-2">
                      <input
                        type="number"
                        min="0"
                        value={row.billQty || ''}
                        onChange={(e) =>
                          handleUpdateLineItem(idx, 'billQty', e.target.value)
                        }
                        placeholder="0"
                        className={`w-full px-2 py-1 rounded border text-right font-mono-tabular font-bold text-xs print:border-0 print:p-0 ${
                          row.exceedsStock
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-slate-200 text-slate-900'
                        }`}
                      />
                    </td>
                    <td className="py-1.5 px-2">
                      <input
                        type="number"
                        min="0"
                        value={row.unitPricePKR || ''}
                        onChange={(e) =>
                          handleUpdateLineItem(
                            idx,
                            'unitPricePKR',
                            e.target.value
                          )
                        }
                        placeholder="0"
                        className="w-full px-2 py-1 rounded border border-slate-200 text-right font-mono-tabular font-bold text-slate-900 text-xs print:border-0 print:p-0"
                      />
                    </td>
                    <td className="py-1.5 px-2.5 text-right font-mono-tabular font-extrabold text-slate-900">
                      {row.lineTotal > 0 ? formatPKR(row.lineTotal) : '-'}
                    </td>
                    <td className="py-1.5 px-1.5 text-center print:hidden">
                      {row.modelNumber && (
                        <button
                          type="button"
                          onClick={() => handleClearRow(idx)}
                          className="text-slate-400 hover:text-red-600 cursor-pointer"
                          title="Clear Row"
                        >
                          ×
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rows 26-31: Terms & Conditions (Left) + Totals Box (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2 border-t-2 border-slate-900">
            <div className="md:col-span-6 space-y-2 text-[11px] text-slate-600">
              <div className="font-extrabold text-slate-900 uppercase tracking-wider">
                TERMS &amp; CONDITIONS:
              </div>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  Standard 12-Month Official Warranty on SZGH Controllers, Servo Drives &amp; Motors.
                </li>
                <li>
                  Payment to be made strictly in the designated KH Enterprises bank account above.
                </li>
                <li>
                  Goods once dispatched are exchangeable only under official warranty terms.
                </li>
              </ul>
              <div className="pt-6 text-xs font-bold text-slate-800">
                Authorized Signature: ___________________________
              </div>
            </div>

            <div className="md:col-span-6 border border-slate-300 rounded-md overflow-hidden text-xs">
              <div className="divide-y divide-slate-200">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50">
                  <span className="font-bold text-slate-700">
                    Subtotal (Excl. GST PKR):
                  </span>
                  <span className="font-mono-tabular font-extrabold text-slate-900">
                    PKR {formatPKR(invoiceCalculations.subtotalExclGst)}
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 py-2">
                  <label className="inline-flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invoiceDraft.includeGst18}
                      onChange={(e) =>
                        setInvoiceDraft((prev) => ({
                          ...prev,
                          includeGst18: e.target.checked,
                        }))
                      }
                      className="rounded border-slate-300 print:hidden"
                    />
                    <span>(18% GST PKR):</span>
                  </label>
                  <span className="font-mono-tabular font-bold text-slate-900">
                    PKR {formatPKR(invoiceCalculations.gst18PKR)}
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 py-2">
                  <span className="font-bold text-slate-700">
                    Discount (PKR):
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={invoiceDraft.discountPKR || ''}
                    onChange={(e) =>
                      setInvoiceDraft((prev) => ({
                        ...prev,
                        discountPKR: Math.max(
                          0,
                          Math.round(Number(e.target.value) || 0)
                        ),
                      }))
                    }
                    placeholder="0"
                    className="w-32 px-2 py-1 text-right rounded border border-slate-300 font-mono-tabular font-bold text-slate-900 text-xs print:border-0 print:p-0"
                  />
                </div>

                <div className="flex items-center justify-between px-3 py-2.5 bg-slate-900 text-white">
                  <span className="font-extrabold uppercase tracking-wider">
                    TOTAL (INCL. TAX PKR):
                  </span>
                  <span className="font-mono-tabular text-sm font-black text-amber-400">
                    PKR {formatPKR(invoiceCalculations.totalInclTaxPKR)}
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 py-2 bg-emerald-50/60">
                  <span className="font-bold text-emerald-900">
                    Amount Received (PKR):
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={invoiceDraft.amountReceivedPKR || ''}
                    onChange={(e) =>
                      setInvoiceDraft((prev) => ({
                        ...prev,
                        amountReceivedPKR: Math.max(
                          0,
                          Math.round(Number(e.target.value) || 0)
                        ),
                      }))
                    }
                    placeholder="0"
                    className="w-36 px-2 py-1 text-right rounded border border-emerald-400 bg-white font-mono-tabular font-extrabold text-emerald-800 text-xs print:border-0 print:bg-transparent print:p-0"
                  />
                </div>

                <div className="flex items-center justify-between px-3 py-2.5 bg-amber-50">
                  <span className="font-black text-slate-900 uppercase">
                    BALANCE (PKR):
                  </span>
                  <span className="font-mono-tabular text-sm font-black text-red-700">
                    PKR {formatPKR(invoiceCalculations.balanceDuePKR)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT 4 COLUMNS (OUTSIDE THE INVOICE FORMAT, HIDDEN ON PRINT):    */}
        {/* 1. SUBMIT INVOICE & DEDUCT STOCK BUTTON PANEL                     */}
        {/* 2. LIVE WAREHOUSE STOCK PANEL (REF) LINKED TO STOCK LIST          */}
        {/* ================================================================= */}
        <div className="xl:col-span-4 space-y-4 print:hidden">
          {/* ACTION CARD: SUBMIT BUTTON OUTSIDE THE INVOICE FORMAT */}
          <div className="p-5 rounded-xl bg-slate-900 text-white border-2 border-emerald-500/50 shadow-lg space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
                  Non-Print Control Panel (Outside Invoice Format)
                </span>
                <h4 className="text-base font-extrabold mt-1">
                  Submit Invoice &amp; Reduce Warehouse Stock
                </h4>
              </div>
              <PackageCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Clicking <strong>Submit Invoice &amp; Deduct Stock</strong> below will:
            </p>
            <ul className="text-xs text-slate-300 space-y-1 list-decimal list-inside">
              <li>
                Hit the <strong>Stock Sheet (Stock List)</strong> and deduct the billed quantities from each model&apos;s available stock.
              </li>
              <li>
                Create a permanent order record in the new <strong>Summary Sheet</strong> with full customer, payment, and item details.
              </li>
            </ul>

            {invoiceCalculations.hasStockWarning && (
              <div className="p-2.5 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  One or more rows exceed current available stock. Submitting will clamp remaining stock to 0 („No stock“).
                </span>
              </div>
            )}

            <button
              type="button"
              disabled={submittingInvoice || invoiceCalculations.totalUnits <= 0}
              onClick={onSubmitInvoiceAndDeductStock}
              className="w-full py-3 px-4 rounded-lg bg-[#0D5C2B] hover:bg-[#094720] disabled:opacity-50 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>
                {submittingInvoice
                  ? 'Deducting Stock & Saving Summary...'
                  : `Submit Invoice & Deduct Stock (${invoiceCalculations.totalUnits} Units)`}
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => window.print()}
                className="py-2 px-3 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice Only</span>
              </button>
              <button
                type="button"
                onClick={onDownloadMasterExcel}
                className="py-2 px-3 rounded-md bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .xlsx</span>
              </button>
            </div>
          </div>

          {/* LIVE WAREHOUSE STOCK PANEL (REF) — Mirrors Columns J:L of Invoice & Bill */}
          <div className="rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  LIVE WAREHOUSE STOCK PANEL (REF)
                </div>
                <div className="text-[11px] text-slate-400">
                  Real-Time Link with Stock Sheet (Columns J:L)
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSwitchMode('manage')}
                className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Open Stock Sheet</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider">
                    <th className="py-2 px-2.5 text-center w-8">#</th>
                    <th className="py-2 px-2.5">Product Model</th>
                    <th className="py-2 px-2.5 text-right">Avail Stock</th>
                    <th className="py-2 px-2.5 text-right">After Bill</th>
                    <th className="py-2 px-2.5 text-center">Stock Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {invoiceCalculations.enrichedRows.map((row) => {
                    const hasModel = Boolean(row.modelNumber.trim());
                    return (
                      <tr key={row.sNo} className="h-8">
                        <td className="py-1 px-2 text-center font-mono-tabular text-slate-400">
                          {row.sNo}
                        </td>
                        <td className="py-1 px-2.5 font-mono-tabular font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                          {hasModel ? row.modelNumber : '-'}
                        </td>
                        <td className="py-1 px-2.5 text-right font-mono-tabular font-extrabold text-slate-900 dark:text-white">
                          {hasModel
                            ? row.matchedProduct
                              ? row.availableStock
                              : 'N/A'
                            : ''}
                        </td>
                        <td className="py-1 px-2.5 text-right font-mono-tabular font-bold text-slate-600 dark:text-slate-400">
                          {hasModel && row.matchedProduct
                            ? row.remainingStockAfterBill
                            : ''}
                        </td>
                        <td className="py-1 px-2.5 text-center">
                          {!hasModel ? (
                            <span className="text-slate-300 dark:text-slate-700">
                              —
                            </span>
                          ) : !row.matchedProduct ? (
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                              Custom Item
                            </span>
                          ) : row.availableStock <= 0 ? (
                            <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-600 dark:text-red-400 text-[10px] font-extrabold">
                              No stock
                            </span>
                          ) : row.exceedsStock ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold">
                              MAX: {row.availableStock}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
                              IN STOCK ✓
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
