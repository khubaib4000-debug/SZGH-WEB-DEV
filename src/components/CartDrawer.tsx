import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  ShieldCheck,
  LogIn,
  Printer,
  AlertTriangle,
  Receipt,
  Send,
  Mail,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { User, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { ProductItem, IOBoardOption } from '../data/products';

export interface BankAccountDetails {
  id: string;
  bankName: string;
  shortName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  swift: string;
  branchCode: string;
  location: string;
  brandColor: string;
}

/**
 * Extensible Online Payment Accounts Registry
 * Add additional bank accounts or payment gateway providers here in the future.
 */
export const ONLINE_PAYMENT_ACCOUNTS: BankAccountDetails[] = [
  {
    id: 'ubl-urdu-bazar',
    bankName: 'United Bank Ltd (UBL)',
    shortName: 'UBL',
    accountTitle: 'Zahid Ali',
    accountNumber: '409068085',
    iban: 'PK29UNIL0109000409068085',
    swift: 'UNILPKKA',
    branchCode: '0424',
    location: 'Urdu Bazar Lahore',
    brandColor: '#00529B',
  },
];

const UBLLogo: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg
    viewBox="0 0 120 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="United Bank Limited (UBL) Logo"
  >
    <rect width="120" height="72" rx="10" fill="#00529B" />
    <path
      d="M0 54H120V62C120 67.5228 115.523 72 110 72H10C4.47715 72 0 67.5228 0 62V54Z"
      fill="#00386B"
    />
    {/* U */}
    <path
      d="M18 14H27V33C27 37.2 29.4 39.8 33.5 39.8C37.6 39.8 40 37.2 40 33V14H49V33.5C49 42.6 43 48 33.5 48C24 48 18 42.6 18 33.5V14Z"
      fill="#FFFFFF"
    />
    {/* B */}
    <path
      d="M54 14H70.5C76.8 14 81 17.2 81 22.3C81 25.9 78.9 28.5 75.6 29.6C79.6 30.7 82.2 33.6 82.2 38C82.2 43.8 77.5 47.5 70.2 47.5H54V14ZM62.8 27.2H68.8C71.5 27.2 73 25.8 73 23.6C73 21.4 71.5 20.1 68.8 20.1H62.8V27.2ZM62.8 41.2H69.5C72.5 41.2 74.2 39.7 74.2 37.3C74.2 34.9 72.5 33.4 69.5 33.4H62.8V41.2Z"
      fill="#FFFFFF"
    />
    {/* L */}
    <path d="M87 14H96V40.2H109V47.5H87V14Z" fill="#FFFFFF" />
    {/* Accent Red/Gold bar */}
    <rect x="18" y="51" width="84" height="2.5" rx="1.25" fill="#E5A93C" />
    <text
      x="60"
      y="65"
      textAnchor="middle"
      fill="#E2E8F0"
      fontSize="7.5"
      fontWeight="700"
      fontFamily="Inter, system-ui, sans-serif"
      letterSpacing="1.2"
    >
      UNITED BANK LTD
    </text>
  </svg>
);

export interface CartEntry {
  cartKey: string;
  product: ProductItem;
  quantity: number;
  selectedIOBoard?: IOBoardOption;
}

export interface SubmittedCustomerOrder {
  orderId: string;
  customerUid: string;
  timestamp: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  ntnNumber: string;
  strnNumber: string;
  city: string;
  address: string;
  orderNotes: string;
  invoiceType: string;
  paymentMethod:
    | '1- Cash (Cash on Pick Up)'
    | '2- Online (UBL Bank Transfer)'
    | '3- Sales Tax Invoice (18% GST)'
    | 'Cash on Pick Up (Lahore Facility)'
    | 'Online Bank Transfer (UBL)'
    | 'Sales Tax Invoice (18% GST)';
  selectedBankAccount?: BankAccountDetails;
  transactionRef: string;
  whatsappRedirectUrl?: string;
  mailtoUrl?: string;
  gmailComposeUrl?: string;
  emailStatusMessage?: string;
  itemsSummary: string;
  items: CartEntry[];
  subtotalPKR: number;
  salesTaxRate: 0 | 18;
  salesTaxPKR: number;
  totalPKR: number;
  orderStatus: 'New Order' | 'Confirmed' | 'Ready for Pick Up' | 'Completed' | 'Cancelled';
  autoDispatchStatus: 'sent' | 'activation_required' | 'recorded';
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartEntry[];
  onUpdateQuantity: (cartKey: string, newQuantity: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onClearCart: () => void;
  currentUser: User | null;
  onSignIn: () => void;
  onOrderSubmitted?: (order: SubmittedCustomerOrder) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentUser,
  onSignIn,
  onOrderSubmitted,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');

  // Complete Customer Details (NTN No. asked ONLY when 3- Sales Tax Invoice is chosen)
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ntnNumber, setNtnNumber] = useState('');
  const [strnNumber, setStrnNumber] = useState('');
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Strictly 3 Payment Methods — Customer can choose ONLY a single one (Default: 1- Cash)
  // 1- PICKUP -> "1- Cash" (Cash on Pick Up - Default)
  // 2- BANK -> "2- Online" (Online Bank Transfer - UBL)
  // 3- SALES_TAX_INVOICE -> "3- Sales Tax Invoice" (+18% Sales Tax & Redirect to WhatsApp on Check Out)
  const [paymentMethod, setPaymentMethod] = useState<
    'PICKUP' | 'BANK' | 'SALES_TAX_INVOICE'
  >('PICKUP');
  const [selectedBankId, setSelectedBankId] = useState<string>(
    ONLINE_PAYMENT_ACCOUNTS[0].id
  );
  const [transactionRef, setTransactionRef] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [receipt, setReceipt] = useState<SubmittedCustomerOrder | null>(null);
  const [retryingEmail, setRetryingEmail] = useState(false);

  // Pre-fill signed-in user's name and email when available
  useEffect(() => {
    if (currentUser) {
      if (currentUser.displayName && !contactName) {
        setContactName(currentUser.displayName);
      }
      if (currentUser.email && !email) {
        setEmail(currentUser.email);
      }
    }
  }, [currentUser, contactName, email]);

  if (!isOpen) return null;

  const activeBankAccount =
    ONLINE_PAYMENT_ACCOUNTS.find((acc) => acc.id === selectedBankId) ||
    ONLINE_PAYMENT_ACCOUNTS[0];

  const handleCopyValue = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    setTimeout(() => {
      setCopiedField((prev) => (prev === label ? null : prev));
    }, 2000);
  };

  const getEntryUnitPrice = (entry: CartEntry) =>
    entry.product.price + (entry.selectedIOBoard?.priceDelta || 0);

  const subtotalPKR = items.reduce(
    (sum, entry) => sum + getEntryUnitPrice(entry) * entry.quantity,
    0
  );

  // 18% Sales Tax ONLY when 3- Sales Tax Invoice option is selected
  const isOfficialInvoice = paymentMethod === 'SALES_TAX_INVOICE';
  const salesTaxRate: 0 | 18 = isOfficialInvoice ? 18 : 0;
  const salesTaxPKR = isOfficialInvoice ? Math.round(subtotalPKR * 0.18) : 0;
  const grandTotalPKR = subtotalPKR + salesTaxPKR;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (
      !companyName.trim() ||
      !contactName.trim() ||
      !phone.trim()
    ) {
      setFormError(
        'Please complete all required customer details (Customer Name, Customer Address, and Mobile Number).'
      );
      return;
    }

    if (email.trim() && (!email.includes('@') || email.trim().length < 5)) {
      setFormError('Please enter a valid customer email address or leave it blank.');
      return;
    }

    if (phone.replace(/\D/g, '').length < 10) {
      setFormError('Please enter a valid 10 or 11-digit Pakistan phone/mobile number.');
      return;
    }

    if (isOfficialInvoice && ntnNumber.trim().length < 5) {
      setFormError(
        'Please enter your valid Customer NTN No. (National Tax Number, e.g., 4192837-6) for the Sales Tax Invoice.'
      );
      return;
    }

    setSubmittingOrder(true);

    const orderId = `SZGH-ORD-${Date.now().toString().slice(-6)}-${Math.floor(
      100 + Math.random() * 900
    )}`;
    const readableTimestamp = new Date().toLocaleString('en-PK', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const formattedItemsList = items
      .map(
        (entry, idx) =>
          `${idx + 1}. ${entry.product.modelNumber} — ${entry.product.title}${
            entry.selectedIOBoard ? ` [${entry.selectedIOBoard.shortLabel}]` : ''
          } | Qty: ${entry.quantity} × PKR ${getEntryUnitPrice(
            entry
          ).toLocaleString()} = PKR ${(
            getEntryUnitPrice(entry) * entry.quantity
          ).toLocaleString()}`
      )
      .join('\n');

    const paymentMethodLabel:
      | '1- Cash (Cash on Pick Up)'
      | '2- Online (UBL Bank Transfer)'
      | '3- Sales Tax Invoice (18% GST)' =
      paymentMethod === 'PICKUP'
        ? '1- Cash (Cash on Pick Up)'
        : paymentMethod === 'BANK'
          ? '2- Online (UBL Bank Transfer)'
          : '3- Sales Tax Invoice (18% GST)';

    const invoiceTypeLabel = paymentMethodLabel;

    const effectiveNtn = isOfficialInvoice ? ntnNumber.trim() : '';
    const effectiveStrn = isOfficialInvoice ? strnNumber.trim() : '';

    // Build WhatsApp notification URL (+92 321 4800265) for ALL 3 payment methods (1- Cash, 2- Online, 3- Sales Tax Invoice)
    const waHeaderTitle = isOfficialInvoice
      ? '*SZGH PAKISTAN — SALES TAX INVOICE ORDER*'
      : paymentMethod === 'BANK'
        ? '*SZGH PAKISTAN — ONLINE BANK TRANSFER ORDER*'
        : '*SZGH PAKISTAN — CASH ON PICK UP ORDER*';

    const waMessage = [
      waHeaderTitle,
      `Order ID: *${orderId}*`,
      `Date: ${readableTimestamp}`,
      `Payment Method: *${paymentMethodLabel}*`,
      paymentMethod === 'BANK' && transactionRef.trim()
        ? `Transaction Ref: *${transactionRef.trim()}*`
        : null,
      paymentMethod === 'BANK'
        ? `Note: Sending Payment Proof to WhatsApp (+92 321 4800265) to Proceed Order`
        : null,
      `-----------------------------------------`,
      `*CUSTOMER DETAILS:*`,
      `Customer Name: ${companyName.trim()}`,
      `Customer Address: ${contactName.trim()}`,
      `Mobile Number: ${phone.trim()}`,
      email.trim() ? `Email Address: ${email.trim()}` : null,
      effectiveNtn ? `NTN No.: *${effectiveNtn}*` : null,
      effectiveStrn ? `STRN / CNIC: ${effectiveStrn}` : null,
      `City: ${city}`,
      address.trim() ? `Address: ${address.trim()}` : null,
      orderNotes.trim() ? `Notes: ${orderNotes.trim()}` : null,
      `-----------------------------------------`,
      `*ORDERED ITEMS:*`,
      formattedItemsList,
      `-----------------------------------------`,
      `Subtotal (Excl. Tax): PKR ${subtotalPKR.toLocaleString()}`,
      isOfficialInvoice
        ? `Sales Tax (18% GST): + PKR ${salesTaxPKR.toLocaleString()}`
        : null,
      `*Total Payable${isOfficialInvoice ? ' (Incl. 18% GST)' : ''}: PKR ${grandTotalPKR.toLocaleString()}*`,
    ]
      .filter(Boolean)
      .join('\n');

    const whatsappRedirectUrl = `https://wa.me/923214800265?text=${encodeURIComponent(
      waMessage
    )}`;

    // Build Email subject & body for direct fallback / Gmail / Mailto links
    const emailSubject = `NEW SZGH PAKISTAN ORDER #${orderId} — ${companyName.trim()} (${paymentMethodLabel})`;
    const emailPlainTextBody = [
      `SZGH PAKISTAN (KH ENTERPRISES PVT LTD) — OFFICIAL ORDER NOTIFICATION`,
      `====================================================================`,
      `Order ID: ${orderId}`,
      `Order Date: ${readableTimestamp}`,
      `Payment Method: ${paymentMethodLabel}`,
      paymentMethod === 'BANK' && transactionRef.trim()
        ? `Bank Transfer Reference: ${transactionRef.trim()}`
        : null,
      ``,
      `CUSTOMER & BILLING DETAILS:`,
      `---------------------------`,
      `Customer Name: ${companyName.trim()}`,
      `Customer Address: ${contactName.trim()}`,
      `Mobile Number: ${phone.trim()}`,
      `Email Address: ${email.trim() || 'Not Provided'}`,
      effectiveNtn ? `Customer NTN No.: ${effectiveNtn}` : null,
      effectiveStrn ? `STRN / CNIC No.: ${effectiveStrn}` : null,
      `City: ${city}`,
      address.trim() ? `Address: ${address.trim()}` : null,
      `Special Instructions: ${orderNotes.trim() || 'None'}`,
      ``,
      `ORDERED EQUIPMENT ITEMS:`,
      `------------------------`,
      formattedItemsList,
      ``,
      `FINANCIAL SUMMARY:`,
      `------------------`,
      `Equipment Subtotal: PKR ${subtotalPKR.toLocaleString()}`,
      isOfficialInvoice
        ? `Sales Tax (18% GST): PKR ${salesTaxPKR.toLocaleString()}`
        : `Sales Tax: PKR 0 (Non-Tax)`,
      `TOTAL PAYABLE: PKR ${grandTotalPKR.toLocaleString()}`,
    ]
      .filter((line) => line !== null)
      .join('\n');

    const ccEmails = email.trim()
      ? `grnoman786@gmail.com,${email.trim()}`
      : 'grnoman786@gmail.com';

    const mailtoUrl = `mailto:khubaib4000@gmail.com?cc=${encodeURIComponent(
      ccEmails
    )}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
      emailPlainTextBody
    )}`;

    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      'khubaib4000@gmail.com'
    )}&cc=${encodeURIComponent(
      ccEmails
    )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
      emailPlainTextBody
    )}`;

    // Trigger WhatsApp notification synchronously during the user click event (before any await)
    // so the browser's user-gesture activation is preserved and popup blockers do not block it.
    try {
      const waLink = document.createElement('a');
      waLink.href = whatsappRedirectUrl;
      waLink.target = '_blank';
      waLink.rel = 'noopener noreferrer';
      document.body.appendChild(waLink);
      waLink.click();
      document.body.removeChild(waLink);
    } catch {
      // Fallback button is always available on the Order Confirmation screen
    }

    // Also submit a hidden standard HTML form POST to FormSubmit inside a hidden iframe.
    // Standard form POST triggers immediate delivery / domain activation even when AJAX is blocked on new domains.
    try {
      const iframeName = 'szgh_hidden_order_email_iframe';
      let hiddenIframe = document.getElementById(
        iframeName
      ) as HTMLIFrameElement | null;
      if (!hiddenIframe) {
        hiddenIframe = document.createElement('iframe');
        hiddenIframe.id = iframeName;
        hiddenIframe.name = iframeName;
        hiddenIframe.style.display = 'none';
        document.body.appendChild(hiddenIframe);
      }

      const hiddenForm = document.createElement('form');
      hiddenForm.method = 'POST';
      hiddenForm.action = 'https://formsubmit.co/khubaib4000@gmail.com';
      hiddenForm.target = iframeName;
      hiddenForm.style.display = 'none';

      const formPayload: Record<string, string> = {
        _subject: emailSubject,
        _cc: ccEmails,
        _replyto: email.trim() || 'khubaib4000@gmail.com',
        _template: 'table',
        _captcha: 'false',
        Order_ID: orderId,
        Order_Date: readableTimestamp,
        Payment_Method: paymentMethodLabel,
        Transaction_Reference:
          paymentMethod === 'BANK' && transactionRef.trim()
            ? transactionRef.trim()
            : 'N/A',
        Customer_Name: companyName.trim(),
        Customer_Address: contactName.trim(),
        NTN_Number: effectiveNtn || 'Not Applicable',
        STRN_Or_CNIC: effectiveStrn || 'Not Provided',
        Customer_Email: email.trim() || 'Not Provided',
        Customer_Phone: phone.trim(),
        City: city,
        Address: address.trim() || 'Not Provided',
        Order_Notes: orderNotes.trim() || 'None',
        Ordered_Items: formattedItemsList,
        Equipment_Subtotal_PKR: `PKR ${subtotalPKR.toLocaleString()}`,
        Sales_Tax_18_Percent_PKR: isOfficialInvoice
          ? `PKR ${salesTaxPKR.toLocaleString()} (18% GST)`
          : 'PKR 0',
        Grand_Total_Payable_PKR: `PKR ${grandTotalPKR.toLocaleString()}`,
      };

      Object.entries(formPayload).forEach(([key, val]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = val;
        hiddenForm.appendChild(input);
      });

      document.body.appendChild(hiddenForm);
      hiddenForm.submit();
      setTimeout(() => {
        if (hiddenForm.parentNode) {
          hiddenForm.parentNode.removeChild(hiddenForm);
        }
      }, 2500);
    } catch {
      // Ignore hidden form error; AJAX dispatch runs next
    }

    // 1. Try to ensure a Firebase Auth session (current user or anonymous fallback) to persist to Cloud Firestore
    let effectiveUser = auth.currentUser;
    if (!effectiveUser) {
      try {
        const anonCred = await signInAnonymously(auth);
        effectiveUser = anonCred.user;
      } catch {
        // Anonymous auth may not be enabled; proceed with automatic email + local storage
      }
    }

    const customerUid = effectiveUser?.uid || `guest_${Date.now()}`;

    // 2. Save directly to Cloud Firestore (/orders/{orderId} & /order_index/active_orders) for both signed-in and public link visitors
    try {
      await setDoc(doc(db, 'orders', orderId), {
        orderId,
        customerUid,
        companyName: companyName.trim().slice(0, 200),
        contactName: contactName.trim().slice(0, 150),
        email: email.trim().slice(0, 160),
        phone: phone.trim().slice(0, 40),
        ntnNumber: effectiveNtn.slice(0, 60),
        strnNumber: effectiveStrn.slice(0, 60),
        city: city.trim().slice(0, 80),
        address: address.trim().slice(0, 500),
        orderNotes: orderNotes.trim().slice(0, 600),
        invoiceType: invoiceTypeLabel,
        paymentMethod: paymentMethodLabel,
        transactionRef:
          paymentMethod === 'BANK' ? transactionRef.trim().slice(0, 120) : '',
        itemsSummary: formattedItemsList.slice(0, 4000),
        subtotalPKR: Math.round(subtotalPKR),
        salesTaxRate,
        salesTaxPKR: Math.round(salesTaxPKR),
        totalPKR: Math.round(grandTotalPKR),
        orderStatus: 'New Order',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const manifestRef = doc(db, 'order_index', 'active_orders');
      let existingOrderIds: string[] = [];
      try {
        const snap = await getDoc(manifestRef);
        if (snap.exists() && Array.isArray(snap.data().orderIds)) {
          existingOrderIds = snap
            .data()
            .orderIds.filter((id: unknown): id is string => typeof id === 'string');
        }
      } catch {
        // Manifest may not exist yet
      }

      const updatedOrderIds = Array.from(
        new Set([...existingOrderIds, orderId])
      ).slice(-500);

      await setDoc(manifestRef, {
        manifestId: 'active_orders',
        orderIds: updatedOrderIds,
        updatedBy: customerUid,
        updatedAt: serverTimestamp(),
      });
    } catch {
      // Non-blocking fallback
    }

    // 3. Automatically dispatch detailed order notification via FormSubmit AJAX to both admin emails
    let emailDispatched = false;
    let needsActivation = false;
    let emailStatusMessage = '';

    const ajaxPayload = {
      _subject: emailSubject,
      _cc: ccEmails,
      _replyto: email.trim() || 'khubaib4000@gmail.com',
      _template: 'table',
      _captcha: 'false',
      Order_ID: orderId,
      Order_Date: readableTimestamp,
      Payment_Method: paymentMethodLabel,
      Transaction_Reference:
        paymentMethod === 'BANK' && transactionRef.trim()
          ? transactionRef.trim()
          : 'N/A',
      Customer_Name: companyName.trim(),
      Customer_Address: contactName.trim(),
      NTN_Number: effectiveNtn || 'Not Applicable',
      STRN_Or_CNIC: effectiveStrn || 'Not Provided',
      Customer_Email: email.trim() || 'Not Provided',
      Customer_Phone: phone.trim(),
      City: city,
      Address: address.trim() || 'Not Provided',
      Order_Notes: orderNotes.trim() || 'None',
      Ordered_Items: formattedItemsList,
      Equipment_Subtotal_PKR: `PKR ${subtotalPKR.toLocaleString()}`,
      Sales_Tax_18_Percent_PKR: isOfficialInvoice
        ? `PKR ${salesTaxPKR.toLocaleString()} (18% GST)`
        : 'PKR 0',
      Grand_Total_Payable_PKR: `PKR ${grandTotalPKR.toLocaleString()}`,
    };

    try {
      const [primaryRes, secondaryRes] = await Promise.allSettled([
        fetch('https://formsubmit.co/ajax/khubaib4000@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(ajaxPayload),
        }),
        fetch('https://formsubmit.co/ajax/grnoman786@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            ...ajaxPayload,
            _cc: email.trim()
              ? `khubaib4000@gmail.com,${email.trim()}`
              : 'khubaib4000@gmail.com',
          }),
        }),
      ]);

      for (const settled of [primaryRes, secondaryRes]) {
        if (settled.status === 'fulfilled' && settled.value.ok) {
          try {
            const data = await settled.value.json();
            if (data && (data.success === 'true' || data.success === true)) {
              emailDispatched = true;
            } else if (data && typeof data.message === 'string') {
              emailStatusMessage = data.message;
              if (data.message.toLowerCase().includes('activation')) {
                needsActivation = true;
              }
            }
          } catch {
            emailDispatched = true;
          }
        }
      }
    } catch {
      // Fallback handled via hidden form POST and confirmation action buttons
    }

    const newOrderRecord: SubmittedCustomerOrder = {
      orderId,
      customerUid,
      timestamp: readableTimestamp,
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      ntnNumber: effectiveNtn,
      strnNumber: effectiveStrn,
      city,
      address: address.trim(),
      orderNotes: orderNotes.trim(),
      invoiceType: invoiceTypeLabel,
      paymentMethod: paymentMethodLabel,
      selectedBankAccount: paymentMethod === 'BANK' ? activeBankAccount : undefined,
      transactionRef:
        paymentMethod === 'BANK' && transactionRef.trim()
          ? transactionRef.trim()
          : '',
      whatsappRedirectUrl,
      mailtoUrl,
      gmailComposeUrl,
      emailStatusMessage,
      itemsSummary: formattedItemsList,
      items: [...items],
      subtotalPKR,
      salesTaxRate,
      salesTaxPKR,
      totalPKR: grandTotalPKR,
      orderStatus: 'New Order',
      autoDispatchStatus: emailDispatched
        ? 'sent'
        : needsActivation
          ? 'activation_required'
          : 'recorded',
    };

    if (onOrderSubmitted) {
      onOrderSubmitted(newOrderRecord);
    }

    setReceipt(newOrderRecord);
    setSubmittingOrder(false);
    onClearCart();
    setStep('confirmed');
  };

  const handleResetAndClose = () => {
    setStep('cart');
    setPaymentMethod('PICKUP');
    setReceipt(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart and B2B Checkout"
      onClick={handleResetAndClose}
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 h-full flex flex-col border-l border-slate-200 dark:border-slate-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 pr-2">
            <ShoppingBag className="w-5 h-5 text-[#1E2985] dark:text-emerald-400 shrink-0" />
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
              {step === 'cart' && 'Industrial Order Cart'}
              {step === 'checkout' && 'Checkout — Payment & Customer Details'}
              {step === 'confirmed' && 'Order Confirmation'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close cart drawer"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {step === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    Your requisition cart is empty
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-6">
                    Add CNC controllers, servo motor kits, CNC machines, or 6-axis industrial robots to generate an official order.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="px-5 py-2.5 rounded-[5px] bg-[#0068AD] hover:bg-[#00558F] text-white text-xs sm:text-sm font-normal transition-colors cursor-pointer"
                  >
                    Browse Equipment Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span>{items.length} Line Item(s) in Cart</span>
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="text-red-600 dark:text-red-400 hover:underline font-medium cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  {items.map((entry) => {
                    const { cartKey, product, quantity, selectedIOBoard } = entry;
                    const unitPrice = getEntryUnitPrice(entry);
                    return (
                      <div
                        key={cartKey}
                        className="flex gap-4 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                      >
                        <img
                          src={
                            product.images[product.defaultImageIndex ?? 0] ||
                            product.images[0]
                          }
                          alt={product.title}
                          referrerPolicy="no-referrer"
                          className="w-20 h-16 rounded object-contain bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shrink-0 p-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-mono-tabular text-[11px] font-bold text-[#1E2985] dark:text-emerald-400 truncate">
                              {product.modelNumber}
                            </span>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(cartKey)}
                              aria-label={`Remove ${product.title}`}
                              className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                            {product.title}
                          </h4>

                          {selectedIOBoard && (
                            <div className="text-[11px] font-semibold text-[#0D5C2B] dark:text-emerald-400 mt-0.5">
                              I/O Option: {selectedIOBoard.shortLabel}
                            </div>
                          )}

                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            1 Year Official Warranty · PKR {unitPrice.toLocaleString()} × {quantity}
                          </div>

                          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200/70 dark:border-slate-800">
                            <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(cartKey, quantity - 1)}
                                aria-label="Decrease quantity"
                                className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2.5 text-xs font-mono-tabular font-bold text-slate-900 dark:text-white">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(cartKey, quantity + 1)}
                                aria-label="Increase quantity"
                                className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="font-mono-tabular text-xs font-extrabold text-slate-900 dark:text-white">
                              PKR {(unitPrice * quantity).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form
              id="b2b-checkout-form"
              onSubmit={handleCheckoutSubmit}
              className="space-y-5"
            >
              {/* Sign-In Quick Bar for Customers */}
              {!currentUser ? (
                <div className="p-3.5 rounded-lg bg-[#1E2985]/[0.06] dark:bg-emerald-950/30 border border-[#1E2985]/25 dark:border-emerald-500/30 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Quick Customer Sign-In Available
                    </span>
                    Sign in with Google to auto-fill your details and sync your order to your account.
                  </div>
                  <button
                    type="button"
                    onClick={onSignIn}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[5px] bg-[#0068AD] hover:bg-[#00558F] text-white text-xs font-normal shrink-0 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                </div>
              ) : (
                <div className="px-3.5 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 flex items-center justify-between text-xs">
                  <span className="text-emerald-800 dark:text-emerald-300 font-medium">
                    Signed in as <strong>{currentUser.email}</strong>
                  </span>
                  <span className="text-[11px] font-bold text-[#0D5C2B] dark:text-emerald-400">
                    ✓ Cloud Sync Active
                  </span>
                </div>
              )}

              {formError && (
                <div className="p-3.5 rounded-md bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-xs font-semibold text-red-700 dark:text-red-300">
                  {formError}
                </div>
              )}

              {/* STEP 1: ONLY 3 PAYMENT METHODS (CHOOSE ANY SINGLE ONE — NO MULTIPLE SELECTION, NO STANDARD INVOICE) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    1. Select Payment Method (Choose Any Single One) *
                  </label>
                  <span className="text-[11px] font-bold text-[#1E2985] dark:text-emerald-400">
                    Default: 1- Cash
                  </span>
                </div>

                <div className="space-y-2.5" role="radiogroup" aria-label="Payment Method">
                  {/* 1- CASH (DEFAULT) */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-md border-2 cursor-pointer transition-colors ${
                      paymentMethod === 'PICKUP'
                        ? 'border-[#1E2985] dark:border-emerald-400 bg-slate-50 dark:bg-slate-950'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="PICKUP"
                      checked={paymentMethod === 'PICKUP'}
                      onChange={() => setPaymentMethod('PICKUP')}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                          1- Cash (Cash on Pick Up)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono-tabular font-extrabold uppercase">
                          Default
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Pay in person when picking up your hardware at our Lahore warehouse/office (No Cash on Delivery)
                      </div>
                    </div>
                  </label>

                  {/* 2- ONLINE */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-md border-2 cursor-pointer transition-colors ${
                      paymentMethod === 'BANK'
                        ? 'border-[#1E2985] dark:border-emerald-400 bg-slate-50 dark:bg-slate-950'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK"
                      checked={paymentMethod === 'BANK'}
                      onChange={() => setPaymentMethod('BANK')}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                        2- Online (United Bank Ltd - UBL / Raast / IBFT)
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Direct online transfer to our official UBL bank account prior to pick-up or dispatch
                      </div>
                    </div>
                  </label>

                  {/* Online Bank Account Details Panel (When 2- Online is selected) */}
                  {paymentMethod === 'BANK' && (
                    <div className="rounded-lg border-2 border-[#00529B]/40 dark:border-sky-500/40 bg-gradient-to-b from-[#00529B]/[0.05] to-white dark:from-sky-950/30 dark:to-slate-950 p-4 space-y-3.5 shadow-sm">
                      {/* Prominent Payment Proof Note — WhatsApp No. written ONLY 1 time */}
                      <div className="p-3 rounded-md bg-emerald-600 dark:bg-emerald-700 text-white shadow-xs flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
                          <div>
                            <div className="text-xs sm:text-sm font-extrabold tracking-wide">
                              Send Payment Proof To Whatsapp to Proceed Order
                            </div>
                            <div className="text-[11px] text-emerald-100 font-medium">
                              Official WhatsApp: <strong className="font-mono-tabular text-white">+92 321 4800265</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      {ONLINE_PAYMENT_ACCOUNTS.length > 1 && (
                        <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-200 dark:border-slate-800">
                          {ONLINE_PAYMENT_ACCOUNTS.map((acc) => (
                            <button
                              key={acc.id}
                              type="button"
                              onClick={() => setSelectedBankId(acc.id)}
                              className={`px-3 py-1.5 rounded text-xs font-bold border transition-colors cursor-pointer ${
                                activeBankAccount.id === acc.id
                                  ? 'bg-[#00529B] text-white border-[#00386B]'
                                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                              }`}
                            >
                              {acc.shortName}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Bank Header with UBL Logo */}
                      <div className="flex items-center gap-3.5 pb-3 border-b border-slate-200/80 dark:border-slate-800">
                        <UBLLogo className="w-16 h-10 shrink-0 rounded-md shadow-xs" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-extrabold text-[#00529B] dark:text-sky-400 uppercase tracking-wider">
                              Official Online Payment Account
                            </span>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          </div>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                            {activeBankAccount.bankName}
                          </h4>
                          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            Branch {activeBankAccount.branchCode} · {activeBankAccount.location}
                          </p>
                        </div>
                      </div>

                      {/* Account Fields Grid */}
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        {/* Account Title */}
                        <div className="flex items-center justify-between px-3 py-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                              Account Title
                            </span>
                            <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                              {activeBankAccount.accountTitle}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyValue('title', activeBankAccount.accountTitle)
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                          >
                            {copiedField === 'title' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-emerald-700 dark:text-emerald-400">
                                  Copied
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Account Number */}
                        <div className="flex items-center justify-between px-3 py-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                              Account Number
                            </span>
                            <span className="font-mono-tabular font-extrabold text-slate-900 dark:text-white text-sm tracking-wide">
                              {activeBankAccount.accountNumber}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyValue(
                                'accountNumber',
                                activeBankAccount.accountNumber
                              )
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                          >
                            {copiedField === 'accountNumber' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-emerald-700 dark:text-emerald-400">
                                  Copied
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* IBAN */}
                        <div className="flex items-center justify-between px-3 py-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <div className="min-w-0 pr-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                              IBAN (24-Digit Raast / IBFT)
                            </span>
                            <span className="font-mono-tabular font-extrabold text-[#00529B] dark:text-sky-400 text-xs sm:text-sm tracking-tight break-all">
                              {activeBankAccount.iban}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyValue('iban', activeBankAccount.iban)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold bg-[#00529B] hover:bg-[#00386B] text-white transition-colors shrink-0 cursor-pointer"
                          >
                            {copiedField === 'iban' ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy IBAN</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* SWIFT, Branch Code & Location Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="px-2.5 py-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                                SWIFT Code
                              </span>
                              <span className="font-mono-tabular font-bold text-slate-900 dark:text-white text-xs">
                                {activeBankAccount.swift}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyValue('swift', activeBankAccount.swift)
                              }
                              title="Copy SWIFT Code"
                              className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            >
                              {copiedField === 'swift' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          <div className="px-2.5 py-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                              Branch Code
                            </span>
                            <span className="font-mono-tabular font-bold text-slate-900 dark:text-white text-xs">
                              {activeBankAccount.branchCode}
                            </span>
                          </div>

                          <div className="px-2.5 py-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                              Location
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white text-[11px] leading-tight block">
                              {activeBankAccount.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Optional Transaction Reference Input */}
                      <div className="pt-1">
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Transaction ID / Raast Reference (Optional)
                        </label>
                        <input
                          type="text"
                          value={transactionRef}
                          onChange={(e) => setTransactionRef(e.target.value)}
                          placeholder="e.g., UBL / Raast TID #8492014 (if already transferred)"
                          className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-mono-tabular focus:outline-none focus:border-[#00529B] dark:focus:border-sky-400"
                        />
                      </div>
                    </div>
                  )}

                  {/* 3- SALES TAX INVOICE (REDIRECT TO WHATSAPP ON CHECK OUT) */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-md border-2 cursor-pointer transition-colors ${
                      paymentMethod === 'SALES_TAX_INVOICE'
                        ? 'border-[#1E2985] dark:border-emerald-400 bg-[#1E2985]/[0.04] dark:bg-emerald-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="SALES_TAX_INVOICE"
                      checked={paymentMethod === 'SALES_TAX_INVOICE'}
                      onChange={() => setPaymentMethod('SALES_TAX_INVOICE')}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Receipt className="w-4 h-4 text-[#1E2985] dark:text-emerald-400" />
                          <span>3- Sales Tax Invoice (Redirect to WhatsApp on Check Out)</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[11px] font-mono-tabular font-extrabold shrink-0">
                          +18% GST (PKR {Math.round(subtotalPKR * 0.18).toLocaleString()})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        Adds 18% Sales Tax to total amount and redirects to WhatsApp on check out with your complete order &amp; NTN No. details.
                      </p>
                    </div>
                  </label>

                  {/* ASK NTN NO. ONLY WHEN CUSTOMER CHOOSES 3- SALES TAX INVOICE OPTION */}
                  {paymentMethod === 'SALES_TAX_INVOICE' && (
                    <div className="p-3.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border-2 border-amber-400/70 dark:border-amber-500/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                          Customer NTN No. (Required for Sales Tax Invoice)
                        </span>
                        <span className="text-[11px] font-bold text-[#0D5C2B] dark:text-emerald-400">
                          +18% Sales Tax Applied
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-extrabold text-slate-900 dark:text-white mb-1">
                            Customer NTN No. (National Tax Number) *
                          </label>
                          <input
                            type="text"
                            required
                            value={ntnNumber}
                            onChange={(e) => setNtnNumber(e.target.value)}
                            placeholder="e.g., 4192837-6"
                            className="w-full px-3 py-2 rounded-md border border-amber-400 dark:border-amber-600 bg-white dark:bg-slate-950 text-xs sm:text-sm font-mono-tabular font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1E2985] dark:focus:border-emerald-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            STRN / CNIC No. (Optional)
                          </label>
                          <input
                            type="text"
                            value={strnNumber}
                            onChange={(e) => setStrnNumber(e.target.value)}
                            placeholder="Sales Tax Reg. or CNIC #"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs sm:text-sm font-mono-tabular text-slate-900 dark:text-white focus:outline-none focus:border-[#1E2985] dark:focus:border-emerald-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* STEP 2: COMPLETE CUSTOMER DETAILS (NTN NO. NOT ASKED UNLESS SALES TAX INVOICE IS CHOSEN) */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    2. Complete Customer Details *
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Ravi Precision Engineering (Pvt) Ltd"
                    className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1E2985] dark:focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Customer Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1E2985] dark:focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white font-mono-tabular focus:outline-none focus:border-[#1E2985] dark:focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="procurement@company.com"
                      className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1E2985] dark:focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      City *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1E2985] dark:focus:border-emerald-400"
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Gujranwala">Gujranwala</option>
                      <option value="Sialkot">Sialkot</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Rawalpindi / Islamabad">Rawalpindi / Islamabad</option>
                      <option value="Sheikhupura">Sheikhupura</option>
                      <option value="Multan">Multan</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Other">Other City</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Plot #, Industrial Estate / Road, Sector, City"
                    className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1E2985] dark:focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pick-Up Schedule / Special Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g., Authorised representative visiting Lahore warehouse on Tuesday"
                    className="w-full px-3.5 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E2985] dark:focus:border-emerald-400"
                  />
                </div>
              </div>
            </form>
          )}

          {step === 'confirmed' && receipt && (
            <div className="space-y-5">
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#0D5C2B] dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Order #{receipt.orderId} Submitted!
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Your order details{receipt.ntnNumber ? ` (NTN No. ${receipt.ntnNumber})` : ''} have been{' '}
                    <strong>sent to SZGH Pakistan (KH Enterprises Pvt Ltd)</strong>. Our team will contact{' '}
                    <strong>{receipt.phone}</strong>
                    {receipt.email ? (
                      <>
                        {' '}
                        and <strong>{receipt.email}</strong>
                      </>
                    ) : null}{' '}
                    shortly.
                  </p>
                </div>
              </div>

              {/* WhatsApp & Email Notification Action Hub (Available for ALL 3 Payment Methods) */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border-2 border-[#0D5C2B]/40 dark:border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#0D5C2B] dark:text-emerald-400">
                    Instant Order Notifications (WhatsApp & Email)
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[#0D5C2B] dark:text-emerald-300">
                    {receipt.autoDispatchStatus === 'sent'
                      ? 'Auto-Email Dispatched'
                      : receipt.autoDispatchStatus === 'activation_required'
                        ? 'Check Inbox/Spam to Activate FormSubmit'
                        : 'Order Recorded'}
                  </span>
                </div>

                {receipt.autoDispatchStatus === 'activation_required' && (
                  <div className="p-2.5 rounded bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/70 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                    <strong>One-Time Email Activation Notice:</strong> FormSubmit sent an activation email to{' '}
                    <strong>khubaib4000@gmail.com</strong> and <strong>grnoman786@gmail.com</strong> (please check Inbox &amp; Spam folder and click <strong>&ldquo;Activate Form&rdquo;</strong> once so all future orders arrive automatically). You can also send this order immediately via WhatsApp or Gmail below:
                  </div>
                )}

                {receipt.whatsappRedirectUrl && (
                  <a
                    href={receipt.whatsappRedirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-[#0D5C2B] hover:bg-[#094720] text-white text-xs sm:text-sm font-extrabold transition-colors shadow-xs"
                  >
                    <Send className="w-4 h-4 shrink-0" />
                    <span>Send / Open Order Notification on WhatsApp (+92 321 4800265)</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  </a>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {receipt.gmailComposeUrl && (
                    <a
                      href={receipt.gmailComposeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-md bg-[#1E2985] hover:bg-[#161f69] text-white text-xs font-bold transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span>Send Order via Gmail</span>
                      <ExternalLink className="w-3 h-3 shrink-0 opacity-80" />
                    </a>
                  )}
                  {receipt.mailtoUrl && (
                    <a
                      href={receipt.mailtoUrl}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 shrink-0 text-[#1E2985] dark:text-emerald-400" />
                      <span>Send via Default Email App</span>
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  disabled={retryingEmail}
                  onClick={async () => {
                    setRetryingEmail(true);
                    try {
                      const res = await fetch(
                        'https://formsubmit.co/ajax/khubaib4000@gmail.com',
                        {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                          },
                          body: JSON.stringify({
                            _subject: `RESEND SZGH PAKISTAN ORDER #${receipt.orderId} — ${receipt.companyName} (${receipt.paymentMethod})`,
                            _cc: `grnoman786@gmail.com,${receipt.email}`,
                            _replyto: receipt.email,
                            _template: 'table',
                            _captcha: 'false',
                            Order_ID: receipt.orderId,
                            Order_Date: receipt.timestamp,
                            Payment_Method: receipt.paymentMethod,
                            Company_Name: receipt.companyName,
                            Customer_Name: receipt.contactName,
                            Customer_Phone: receipt.phone,
                            Customer_Email: receipt.email,
                            NTN_Number: receipt.ntnNumber || 'Not Applicable',
                            City: receipt.city,
                            Complete_Address: receipt.address,
                            Ordered_Items: receipt.itemsSummary,
                            Grand_Total_Payable_PKR: `PKR ${receipt.totalPKR.toLocaleString()}`,
                          }),
                        }
                      );
                      const data = await res.json().catch(() => ({}));
                      if (data && (data.success === 'true' || data.success === true)) {
                        setReceipt((prev) =>
                          prev ? { ...prev, autoDispatchStatus: 'sent' } : prev
                        );
                      } else if (
                        data &&
                        typeof data.message === 'string' &&
                        data.message.toLowerCase().includes('activation')
                      ) {
                        setReceipt((prev) =>
                          prev
                            ? {
                                ...prev,
                                autoDispatchStatus: 'activation_required',
                                emailStatusMessage: data.message,
                              }
                            : prev
                        );
                      }
                    } catch {
                      // Ignore error
                    } finally {
                      setRetryingEmail(false);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${retryingEmail ? 'animate-spin' : ''}`} />
                  <span>
                    {retryingEmail
                      ? 'Re-sending Automatic Email Notification...'
                      : 'Re-trigger Automatic Email Notification (khubaib4000@gmail.com)'}
                  </span>
                </button>
              </div>

              {/* Show UBL Bank Account Card on Receipt if Bank Transfer selected */}
              {receipt.selectedBankAccount && (
                <div className="p-4 rounded-lg border-2 border-[#00529B]/40 dark:border-sky-500/40 bg-[#00529B]/[0.04] dark:bg-sky-950/20 space-y-2.5 text-xs">
                  <div className="p-2.5 rounded bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>Send Payment Proof To Whatsapp to Proceed Order (+92 321 4800265)</span>
                  </div>
                  <div className="flex items-center gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <UBLLogo className="w-14 h-9 shrink-0 rounded" />
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#00529B] dark:text-sky-400">
                        Online Transfer Details
                      </div>
                      <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                        {receipt.selectedBankAccount.bankName} —{' '}
                        {receipt.selectedBankAccount.location}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono-tabular text-xs">
                    <div>
                      <span className="text-slate-500 block font-sans text-[11px]">
                        Account Title:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white font-sans">
                        {receipt.selectedBankAccount.accountTitle}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-sans text-[11px]">
                        Account Number:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {receipt.selectedBankAccount.accountNumber}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block font-sans text-[11px]">
                        IBAN:
                      </span>
                      <span className="font-bold text-[#00529B] dark:text-sky-400">
                        {receipt.selectedBankAccount.iban}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-sans text-[11px]">
                        SWIFT:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {receipt.selectedBankAccount.swift}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-sans text-[11px]">
                        Branch Code:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {receipt.selectedBankAccount.branchCode} (
                        {receipt.selectedBankAccount.location})
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#1E2985] dark:text-emerald-400" />
                    <span>{receipt.paymentMethod.toUpperCase()}</span>
                  </span>
                  <span className="font-mono-tabular font-semibold text-slate-500">
                    {receipt.orderId}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-slate-500 block">Customer Name:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {receipt.companyName}
                    </span>
                  </div>
                  {receipt.ntnNumber && (
                    <div>
                      <span className="text-slate-500 block">NTN No.:</span>
                      <span className="font-mono-tabular font-extrabold text-[#1E2985] dark:text-emerald-400">
                        {receipt.ntnNumber}
                        {receipt.strnNumber ? ` | STRN: ${receipt.strnNumber}` : ''}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500 block">Customer Address &amp; Phone:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {receipt.contactName} ({receipt.phone})
                    </span>
                  </div>
                  {receipt.email && (
                    <div>
                      <span className="text-slate-500 block">Email Address:</span>
                      <span className="font-semibold text-slate-900 dark:text-white break-all">
                        {receipt.email}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500 block">Payment Method:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {receipt.paymentMethod}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">City:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {receipt.city}
                    </span>
                  </div>
                  {receipt.address && (
                    <div className="col-span-2">
                      <span className="text-slate-500 block">Address:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {receipt.address}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                  {receipt.items.map((entry) => {
                    const unit = getEntryUnitPrice(entry);
                    return (
                      <div
                        key={entry.cartKey}
                        className="flex justify-between font-mono-tabular"
                      >
                        <span className="text-slate-700 dark:text-slate-300 truncate pr-2">
                          {entry.quantity}× {entry.product.modelNumber}
                          {entry.selectedIOBoard && entry.selectedIOBoard.priceDelta > 0
                            ? ` (${entry.selectedIOBoard.shortLabel})`
                            : ''}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white shrink-0">
                          PKR {(unit * entry.quantity).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1 font-mono-tabular">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Subtotal (Excl. Tax)</span>
                      <span>PKR {receipt.subtotalPKR.toLocaleString()}</span>
                    </div>
                    {receipt.salesTaxRate === 18 && (
                      <div className="flex justify-between text-slate-700 dark:text-slate-300 font-semibold">
                        <span>Sales Tax (18% GST — Sales Tax Invoice)</span>
                        <span>PKR {receipt.salesTaxPKR.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-1.5 border-t border-slate-200 dark:border-slate-800 text-sm font-extrabold text-slate-900 dark:text-white">
                      <span>Total Payable</span>
                      <span>PKR {receipt.totalPKR.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3.5 sm:space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Equipment Subtotal</span>
                <span className="font-mono-tabular font-semibold text-slate-900 dark:text-white">
                  PKR {subtotalPKR.toLocaleString()}
                </span>
              </div>

              {isOfficialInvoice && (
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Sales Tax (18% GST — Sales Tax Invoice)</span>
                  <span className="font-mono-tabular font-bold text-amber-700 dark:text-amber-400">
                    + PKR {salesTaxPKR.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Selected Payment Method</span>
                <span className="font-semibold text-[#0D5C2B] dark:text-emerald-400">
                  {paymentMethod === 'PICKUP'
                    ? '1- Cash (Cash on Pick Up)'
                    : paymentMethod === 'BANK'
                      ? '2- Online (UBL Bank Transfer)'
                      : '3- Sales Tax Invoice (+18% GST)'}
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Total Amount {isOfficialInvoice ? '(Incl. 18% GST)' : ''}
                </span>
                <div className="text-right">
                  <div className="text-lg font-extrabold font-mono-tabular text-slate-900 dark:text-white">
                    PKR {grandTotalPKR.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-[5px] bg-[#E77817] hover:bg-[#d1680f] text-white text-sm font-normal transition-colors cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 rounded-[5px] bg-[#0068AD] hover:bg-[#00558F] text-xs sm:text-sm font-normal text-white transition-colors cursor-pointer shrink-0"
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  form="b2b-checkout-form"
                  disabled={submittingOrder}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[5px] bg-[#E77817] hover:bg-[#d1680f] disabled:opacity-60 text-white text-xs sm:text-sm font-normal transition-colors cursor-pointer"
                >
                  <span>
                    {submittingOrder
                      ? 'Processing Order...'
                      : isOfficialInvoice
                        ? 'Check Out & Redirect to WhatsApp'
                        : 'Complete Check Out'}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'confirmed' && (
          <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-[5px] bg-[#0068AD] hover:bg-[#00558F] text-white text-xs sm:text-sm font-normal transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Invoice</span>
            </button>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="flex-1 py-3 px-4 rounded-[5px] bg-[#E77817] hover:bg-[#d1680f] text-white text-xs sm:text-sm font-normal transition-colors cursor-pointer"
            >
              Return to SZGH Pakistan Storefront
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
