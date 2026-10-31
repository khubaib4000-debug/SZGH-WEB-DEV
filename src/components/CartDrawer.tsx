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
  invoiceType: 'Official Tax Invoice (18% GST)' | 'Standard Commercial Receipt';
  paymentMethod: 'Cash on Pick Up (Lahore Facility)' | 'Online Bank Transfer (UBL)';
  selectedBankAccount?: BankAccountDetails;
  transactionRef: string;
  itemsSummary: string;
  items: CartEntry[];
  subtotalPKR: number;
  salesTaxRate: 0 | 18;
  salesTaxPKR: number;
  totalPKR: number;
  orderStatus: 'New Order' | 'Confirmed' | 'Ready for Pick Up' | 'Completed' | 'Cancelled';
  autoDispatchStatus: 'sent' | 'recorded';
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

  // Complete Customer Details (Including Mandatory NTN No.)
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ntnNumber, setNtnNumber] = useState('');
  const [strnNumber, setStrnNumber] = useState('');
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Official Invoice Option (+18% Sales Tax) vs Standard Receipt
  const [invoiceOption, setInvoiceOption] = useState<'OFFICIAL_TAX' | 'STANDARD'>(
    'OFFICIAL_TAX'
  );

  // Payment Method: ONLY "Cash on Pick Up" or "Online Bank Transfer (UBL)" — NO Cash on Delivery
  const [paymentMethod, setPaymentMethod] = useState<'PICKUP' | 'BANK'>('PICKUP');
  const [selectedBankId, setSelectedBankId] = useState<string>(
    ONLINE_PAYMENT_ACCOUNTS[0].id
  );
  const [transactionRef, setTransactionRef] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [receipt, setReceipt] = useState<SubmittedCustomerOrder | null>(null);

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

  // 18% Sales Tax when Official Invoice option is selected
  const isOfficialInvoice = invoiceOption === 'OFFICIAL_TAX';
  const salesTaxRate: 0 | 18 = isOfficialInvoice ? 18 : 0;
  const salesTaxPKR = isOfficialInvoice ? Math.round(subtotalPKR * 0.18) : 0;
  const grandTotalPKR = subtotalPKR + salesTaxPKR;
  const totalUSD = Math.round(grandTotalPKR / 278);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (
      !companyName.trim() ||
      !contactName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !ntnNumber.trim() ||
      !address.trim()
    ) {
      setFormError(
        'Please complete all required customer details, including Company Name, Full Name, Email, Phone, NTN No., and Complete Address.'
      );
      return;
    }

    if (!email.includes('@') || email.trim().length < 5) {
      setFormError('Please enter a valid customer email address for invoice dispatch.');
      return;
    }

    if (phone.replace(/\D/g, '').length < 10) {
      setFormError('Please enter a valid 10 or 11-digit Pakistan phone/mobile number.');
      return;
    }

    if (ntnNumber.trim().length < 5) {
      setFormError(
        'Please enter your valid NTN No. (National Tax Number, e.g., 1234567-8).'
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

    const invoiceTypeLabel:
      | 'Official Tax Invoice (18% GST)'
      | 'Standard Commercial Receipt' = isOfficialInvoice
      ? 'Official Tax Invoice (18% GST)'
      : 'Standard Commercial Receipt';

    const paymentMethodLabel:
      | 'Cash on Pick Up (Lahore Facility)'
      | 'Online Bank Transfer (UBL)' =
      paymentMethod === 'PICKUP'
        ? 'Cash on Pick Up (Lahore Facility)'
        : 'Online Bank Transfer (UBL)';

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

    // 2. Save directly to Cloud Firestore (/orders/{orderId} & /order_index/active_orders) if signed in
    if (effectiveUser) {
      try {
        await setDoc(doc(db, 'orders', orderId), {
          orderId,
          customerUid: effectiveUser.uid,
          companyName: companyName.trim().slice(0, 200),
          contactName: contactName.trim().slice(0, 150),
          email: email.trim().slice(0, 160),
          phone: phone.trim().slice(0, 40),
          ntnNumber: ntnNumber.trim().slice(0, 60),
          strnNumber: strnNumber.trim().slice(0, 60),
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
          updatedBy: effectiveUser.uid,
          updatedAt: serverTimestamp(),
        });
      } catch {
        // Non-blocking if user was not authenticated in Firestore
      }
    }

    // 3. Automatically dispatch detailed order notification to SZGH Pakistan admin emails in background
    let emailDispatched = false;
    try {
      const response = await fetch(
        'https://formsubmit.co/ajax/khubaib4000@gmail.com',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            _subject: `NEW SZGH PAKISTAN ORDER #${orderId} — ${companyName.trim()} (NTN: ${ntnNumber.trim()})`,
            _cc: 'grnoman786@gmail.com',
            _template: 'table',
            Order_ID: orderId,
            Order_Date: readableTimestamp,
            Invoice_Type: invoiceTypeLabel,
            Payment_Method: paymentMethodLabel,
            Transaction_Reference:
              paymentMethod === 'BANK' && transactionRef.trim()
                ? transactionRef.trim()
                : 'N/A',
            Company_Name: companyName.trim(),
            Customer_Name: contactName.trim(),
            NTN_Number: ntnNumber.trim(),
            STRN_Or_CNIC: strnNumber.trim() || 'Not Provided',
            Customer_Email: email.trim(),
            Customer_Phone: phone.trim(),
            City: city,
            Complete_Address: address.trim(),
            Order_Notes: orderNotes.trim() || 'None',
            Ordered_Items: formattedItemsList,
            Equipment_Subtotal_PKR: `PKR ${subtotalPKR.toLocaleString()}`,
            Sales_Tax_18_Percent_PKR: isOfficialInvoice
              ? `PKR ${salesTaxPKR.toLocaleString()} (18% GST)`
              : 'PKR 0 (Standard Commercial Receipt)',
            Grand_Total_Payable_PKR: `PKR ${grandTotalPKR.toLocaleString()}`,
          }),
        }
      );
      if (response.ok) {
        emailDispatched = true;
      }
    } catch {
      // Background dispatch fallback handled via local & Firestore order registry
    }

    const newOrderRecord: SubmittedCustomerOrder = {
      orderId,
      customerUid,
      timestamp: readableTimestamp,
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      ntnNumber: ntnNumber.trim(),
      strnNumber: strnNumber.trim(),
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
      itemsSummary: formattedItemsList,
      items: [...items],
      subtotalPKR,
      salesTaxRate,
      salesTaxPKR,
      totalPKR: grandTotalPKR,
      orderStatus: 'New Order',
      autoDispatchStatus: emailDispatched ? 'sent' : 'recorded',
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
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#1E2985] dark:text-emerald-400" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {step === 'cart' && 'Industrial Order Cart'}
              {step === 'checkout' && 'B2B Checkout & Official Tax Invoice'}
              {step === 'confirmed' && 'Official Order Confirmation & Invoice'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close cart drawer"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6">
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
                    className="px-5 py-2.5 rounded-md bg-[#1E2985] dark:bg-emerald-600 text-white text-xs font-semibold hover:opacity-95 transition-opacity cursor-pointer"
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
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#1E2985] hover:bg-[#161f69] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold shrink-0 cursor-pointer"
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

              {/* STEP 1: INVOICE TYPE SELECTION (OFFICIAL TAX INVOICE +18% SALES TAX) */}
              <div className="space-y-2.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  1. Select Invoice Option (18% Sales Tax on Official Invoice) *
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition-colors ${
                      invoiceOption === 'OFFICIAL_TAX'
                        ? 'border-[#1E2985] dark:border-emerald-400 bg-[#1E2985]/[0.04] dark:bg-emerald-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="invoiceOption"
                      checked={invoiceOption === 'OFFICIAL_TAX'}
                      onChange={() => setInvoiceOption('OFFICIAL_TAX')}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Receipt className="w-4 h-4 text-[#1E2985] dark:text-emerald-400" />
                          <span>Official Tax Invoice (+18% Sales Tax / GST)</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[11px] font-mono-tabular font-extrabold">
                          +18% GST (PKR {Math.round(subtotalPKR * 0.18).toLocaleString()})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        Adds 18% FBR Sales Tax to the total amount. Official GST/NTN Tax Invoice issued by KH Enterprises (Pvt) Ltd.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      invoiceOption === 'STANDARD'
                        ? 'border-[#1E2985] dark:border-emerald-400 bg-slate-50 dark:bg-slate-950'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="invoiceOption"
                      checked={invoiceOption === 'STANDARD'}
                      onChange={() => setInvoiceOption('STANDARD')}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Standard Commercial Receipt (Non-Tax)
                        </span>
                        <span className="text-[11px] font-mono-tabular font-semibold text-slate-500">
                          0% Tax
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Standard equipment commercial packing &amp; warranty slip without GST annexure.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* STEP 2: COMPLETE CUSTOMER & TAX DETAILS (MANDATORY NTN NO.) */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    2. Complete Customer &amp; Tax Details *
                  </label>
                  <span className="text-[11px] font-bold text-[#0D5C2B] dark:text-emerald-400">
                    NTN No. Mandatory
                  </span>
                </div>

                {/* Highlighted NTN No. & STRN Row */}
                <div className="p-3.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border-2 border-amber-400/60 dark:border-amber-500/40 grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Factory / Company Name *
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
                      Customer / Authorized Person Name *
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
                      Phone / Mobile Number *
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
                      Official Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="procurement@company.com"
                      className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1E2985] dark:focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      City / Industrial Hub *
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
                    Complete Billing &amp; Factory Address *
                  </label>
                  <input
                    type="text"
                    required
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

              {/* STEP 3: PAYMENT METHOD (ONLY CASH ON PICK UP OR ONLINE BANK TRANSFER — NO COD) */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  3. Payment Method (No Cash on Delivery) *
                </label>

                <div className="p-2.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-center gap-2 text-[11px] font-semibold text-amber-900 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Please note: We <strong>only offer Cash on Pick Up</strong> at our warehouse/office or <strong>Online Bank Transfer</strong>. We do <strong>NOT</strong> offer Cash on Delivery.
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      id: 'PICKUP',
                      title: 'Cash on Pick Up (Warehouse / Office Pick Up Only)',
                      desc: 'Pay in person when picking up your hardware at our Lahore facility (Cash on Delivery is NOT offered)',
                    },
                    {
                      id: 'BANK',
                      title: 'Online Bank Transfer / Raast / IBFT (United Bank Ltd - UBL)',
                      desc: 'Direct online payment to our official UBL account prior to pick-up or dispatch',
                    },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3 p-3 rounded-md border-2 cursor-pointer transition-colors ${
                        paymentMethod === opt.id
                          ? 'border-[#1E2985] dark:border-emerald-400 bg-slate-50 dark:bg-slate-950'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === opt.id}
                        onChange={() => setPaymentMethod(opt.id as 'PICKUP' | 'BANK')}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {opt.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {opt.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Online Bank Account Details Panel (UBL + Future Accounts) */}
                {paymentMethod === 'BANK' && (
                  <div className="mt-3 rounded-lg border-2 border-[#00529B]/40 dark:border-sky-500/40 bg-gradient-to-b from-[#00529B]/[0.05] to-white dark:from-sky-950/30 dark:to-slate-950 p-4 space-y-3.5 shadow-sm">
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
                      <div className="grid grid-cols-3 gap-2">
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
              </div>
            </form>
          )}

          {step === 'confirmed' && receipt && (
            <div className="space-y-5">
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#0D5C2B] dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Order #{receipt.orderId} Submitted Automatically!
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Your complete order details (including NTN No.{' '}
                    <strong className="font-mono-tabular">{receipt.ntnNumber}</strong>) have been{' '}
                    <strong>automatically sent to SZGH Pakistan (KH Enterprises Pvt Ltd)</strong>. Our team will contact{' '}
                    <strong>{receipt.phone}</strong> and <strong>{receipt.email}</strong> shortly.
                  </p>
                </div>
              </div>

              {/* Show UBL Bank Account Card on Receipt if Bank Transfer selected */}
              {receipt.selectedBankAccount && (
                <div className="p-4 rounded-lg border-2 border-[#00529B]/40 dark:border-sky-500/40 bg-[#00529B]/[0.04] dark:bg-sky-950/20 space-y-2.5 text-xs">
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
                    <span>{receipt.invoiceType.toUpperCase()}</span>
                  </span>
                  <span className="font-mono-tabular font-semibold text-slate-500">
                    {receipt.orderId}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-slate-500 block">Factory / Company:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {receipt.companyName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">NTN No.:</span>
                    <span className="font-mono-tabular font-extrabold text-[#1E2985] dark:text-emerald-400">
                      {receipt.ntnNumber}
                      {receipt.strnNumber ? ` | STRN: ${receipt.strnNumber}` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Customer Contact:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {receipt.contactName} ({receipt.phone})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Email:</span>
                    <span className="font-semibold text-slate-900 dark:text-white break-all">
                      {receipt.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Payment Mode:</span>
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
                  <div className="col-span-2">
                    <span className="text-slate-500 block">Billing / Factory Address:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {receipt.address}
                    </span>
                  </div>
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
                    <div className="flex justify-between text-slate-700 dark:text-slate-300 font-semibold">
                      <span>
                        Sales Tax ({receipt.salesTaxRate}% GST —{' '}
                        {receipt.salesTaxRate === 18 ? 'Official Invoice' : 'Standard'})
                      </span>
                      <span>PKR {receipt.salesTaxPKR.toLocaleString()}</span>
                    </div>
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
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Equipment Subtotal</span>
                <span className="font-mono-tabular font-semibold text-slate-900 dark:text-white">
                  PKR {subtotalPKR.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>
                  {isOfficialInvoice
                    ? 'Sales Tax (18% GST — Official Invoice)'
                    : 'Sales Tax (Standard Receipt — 0%)'}
                </span>
                <span
                  className={`font-mono-tabular font-bold ${
                    isOfficialInvoice
                      ? 'text-amber-700 dark:text-amber-400'
                      : 'text-slate-500'
                  }`}
                >
                  {isOfficialInvoice
                    ? `+ PKR ${salesTaxPKR.toLocaleString()}`
                    : 'PKR 0'}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Handover Mode</span>
                <span className="font-semibold text-[#0D5C2B] dark:text-emerald-400">
                  {paymentMethod === 'PICKUP'
                    ? 'Cash on Pick Up (No COD)'
                    : 'Online Bank Transfer (UBL)'}
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
                  <div className="text-[11px] font-mono-tabular text-slate-500">
                    ≈ USD ${totalUSD.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-[#1E2985] hover:bg-[#161f69] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-sm font-bold transition-colors cursor-pointer"
              >
                <span>Proceed to Checkout &amp; Official Invoice</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 rounded-md border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  form="b2b-checkout-form"
                  disabled={submittingOrder}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-[#0D5C2B] hover:bg-[#094720] disabled:opacity-60 text-white text-sm font-bold transition-colors cursor-pointer"
                >
                  <span>
                    {submittingOrder
                      ? 'Sending Order Details...'
                      : 'Complete Order & Send Automatically'}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'confirmed' && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Invoice</span>
            </button>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="flex-1 py-3 px-4 rounded-md bg-[#1E2985] dark:bg-emerald-600 text-white text-xs sm:text-sm font-bold hover:opacity-95 transition-opacity cursor-pointer"
            >
              Return to SZGH Pakistan Storefront
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
