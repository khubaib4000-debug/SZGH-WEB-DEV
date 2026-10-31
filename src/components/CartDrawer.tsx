import React, { useState } from 'react';
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
  Building2,
  ShieldCheck,
} from 'lucide-react';
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

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartEntry[];
  onUpdateQuantity: (cartKey: string, newQuantity: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onClearCart: () => void;
}

interface ConfirmedOrderReceipt {
  orderNumber: string;
  timestamp: string;
  companyName: string;
  contactName: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: string;
  selectedBankAccount?: BankAccountDetails;
  transactionRef?: string;
  items: CartEntry[];
  subtotalPKR: number;
  freightPKR: number;
  totalPKR: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'BANK' | 'COD' | 'PO'>('BANK');
  const [selectedBankId, setSelectedBankId] = useState<string>(ONLINE_PAYMENT_ACCOUNTS[0].id);
  const [transactionRef, setTransactionRef] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [receipt, setReceipt] = useState<ConfirmedOrderReceipt | null>(null);

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
  const totalUSD = items.reduce(
    (sum, entry) => sum + entry.product.usdEstimate * entry.quantity,
    0
  );
  const freightPKR = subtotalPKR === 0 || subtotalPKR >= 500000 ? 0 : 4500;
  const grandTotalPKR = subtotalPKR + freightPKR;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim() || !phone.trim() || !address.trim()) {
      setFormError('Please complete all required factory and contact verification fields.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setFormError('Please enter a valid 10 or 11-digit Pakistan phone/WhatsApp number.');
      return;
    }

    const orderId = `SZGH-${Math.floor(100000 + Math.random() * 900000)}`;
    const newReceipt: ConfirmedOrderReceipt = {
      orderNumber: orderId,
      timestamp: new Date().toLocaleString('en-PK', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      phone: phone.trim(),
      city,
      address: address.trim(),
      paymentMethod:
        paymentMethod === 'BANK'
          ? `Online Bank Transfer — ${activeBankAccount.bankName}`
          : paymentMethod === 'COD'
          ? 'Cash / Pay-Order on Warehouse Dispatch'
          : 'Official B2B Purchase Order & Proforma Invoice',
      selectedBankAccount: paymentMethod === 'BANK' ? activeBankAccount : undefined,
      transactionRef:
        paymentMethod === 'BANK' && transactionRef.trim()
          ? transactionRef.trim()
          : undefined,
      items: [...items],
      subtotalPKR,
      freightPKR,
      totalPKR: grandTotalPKR,
    };

    setReceipt(newReceipt);
    setFormError('');
    onClearCart();
    setStep('confirmed');

    const itemLines = newReceipt.items.map(
      (entry, idx) =>
        `${idx + 1}. ${entry.product.modelNumber} (${entry.product.title})${
          entry.selectedIOBoard ? ` [${entry.selectedIOBoard.label}]` : ''
        } x ${entry.quantity} = PKR ${(
          (entry.product.price + (entry.selectedIOBoard?.priceDelta || 0)) *
          entry.quantity
        ).toLocaleString()}`
    );

    const bankDetailLines =
      paymentMethod === 'BANK'
        ? [
            `*Online Transfer Account:* ${activeBankAccount.bankName}`,
            `*Account Title:* ${activeBankAccount.accountTitle}`,
            `*Account No:* ${activeBankAccount.accountNumber}`,
            `*IBAN:* ${activeBankAccount.iban}`,
            `*Branch:* ${activeBankAccount.branchCode} (${activeBankAccount.location})`,
            ...(newReceipt.transactionRef
              ? [`*Transfer Ref / TID:* ${newReceipt.transactionRef}`]
              : []),
          ]
        : [];

    const waOrderLines = [
      `*SZGH PAKISTAN — NEW B2B ORDER / PROFORMA SUBMISSION*`,
      `*Order Ref:* ${newReceipt.orderNumber}`,
      `*Date:* ${newReceipt.timestamp}`,
      `-----------------------------------------`,
      `*Factory / Company:* ${newReceipt.companyName}`,
      `*Authorized Person:* ${newReceipt.contactName}`,
      `*Phone / WhatsApp:* ${newReceipt.phone}`,
      `*City:* ${newReceipt.city}`,
      `*Delivery Address:* ${newReceipt.address}`,
      `*Payment Method:* ${newReceipt.paymentMethod}`,
      ...bankDetailLines,
      `-----------------------------------------`,
      `*Ordered Equipment:*`,
      ...itemLines,
      `-----------------------------------------`,
      `*Total Payable:* PKR ${newReceipt.totalPKR.toLocaleString()}`,
    ];

    window.location.href = `https://wa.me/923214800265?text=${encodeURIComponent(
      waOrderLines.join('\n')
    )}`;
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
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 h-full flex flex-col border-l border-slate-200 dark:border-slate-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#1E2985] dark:text-emerald-400" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {step === 'cart' && 'Industrial Order Cart'}
              {step === 'checkout' && 'B2B Dispatch & Proforma Verification'}
              {step === 'confirmed' && 'Official Order Confirmation'}
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
                    Add CNC controllers, servo motor kits, CNC machines, or 6-axis industrial robots to generate an order or proforma invoice.
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
            <form id="b2b-checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                All equipment includes a <strong>1 Year Official Warranty</strong>. Orders above <strong className="font-mono-tabular">PKR 500,000</strong> qualify for complimentary insured freight across Pakistan.
              </div>

              {formError && (
                <div className="p-3 rounded-md bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-xs font-medium text-red-700 dark:text-red-300">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Factory / Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Ravi Precision Engineering Pvt Ltd"
                  className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1E2985] dark:focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Authorized Person / Engineer *
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
                    Phone / WhatsApp Number *
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Industrial Hub *
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
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Factory Plot / Delivery Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Plot #, Industrial Estate / Road"
                    className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1E2985] dark:focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Preferred B2B Payment &amp; Settlement Mode
                </label>
                <div className="space-y-2.5">
                  {[
                    {
                      id: 'BANK',
                      title: 'Online Bank Transfer / Raast / IBFT (United Bank Ltd - UBL)',
                      desc: 'Direct online transfer to official account · Immediate dispatch upon verification',
                    },
                    {
                      id: 'COD',
                      title: 'Cash / Pay-Order on Warehouse Pick-up or Delivery',
                      desc: 'Available for controller & servo kits up to PKR 1,000,000',
                    },
                    {
                      id: 'PO',
                      title: 'Official Tax Proforma Invoice (For Corporate PO)',
                      desc: 'Generates GST/NTN compliant Proforma Invoice from KH Enterprises Pvt Ltd',
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
                        onChange={() => setPaymentMethod(opt.id as 'COD' | 'BANK' | 'PO')}
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
                    {/* Multi-account selector if more accounts are added in the future */}
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
                              <span className="text-emerald-700 dark:text-emerald-400">Copied</span>
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
                            handleCopyValue('accountNumber', activeBankAccount.accountNumber)
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                        >
                          {copiedField === 'accountNumber' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span className="text-emerald-700 dark:text-emerald-400">Copied</span>
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
                            onClick={() => handleCopyValue('swift', activeBankAccount.swift)}
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
                        Transaction ID / Deposit Reference (Optional — or send screenshot on WhatsApp)
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
                    Order #{receipt.orderNumber} Confirmed — Preparing Dispatch
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Registered with <strong>KH Enterprises (Pvt) Ltd</strong> on {receipt.timestamp}. Our senior application engineer will call <strong>{receipt.phone}</strong> within 30 minutes.
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
                        {receipt.selectedBankAccount.bankName} — {receipt.selectedBankAccount.location}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono-tabular text-xs">
                    <div>
                      <span className="text-slate-500 block font-sans text-[11px]">Account Title:</span>
                      <span className="font-bold text-slate-900 dark:text-white font-sans">
                        {receipt.selectedBankAccount.accountTitle}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-sans text-[11px]">Account Number:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {receipt.selectedBankAccount.accountNumber}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block font-sans text-[11px]">IBAN:</span>
                      <span className="font-bold text-[#00529B] dark:text-sky-400">
                        {receipt.selectedBankAccount.iban}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-sans text-[11px]">SWIFT:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {receipt.selectedBankAccount.swift}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-sans text-[11px]">Branch Code:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {receipt.selectedBankAccount.branchCode} ({receipt.selectedBankAccount.location})
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#1E2985] dark:text-emerald-400" />
                    PROFORMA SUMMARY (1 YEAR WARRANTY)
                  </span>
                  <span className="font-mono-tabular font-semibold text-slate-500">
                    {receipt.orderNumber}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 block">Consignee Factory:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {receipt.companyName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Contact Engineer:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {receipt.contactName} ({receipt.phone})
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block">Delivery Destination:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {receipt.address}, {receipt.city}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                  {receipt.items.map((entry) => {
                    const unit = getEntryUnitPrice(entry);
                    return (
                      <div key={entry.cartKey} className="flex justify-between font-mono-tabular">
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
                  <div className="flex justify-between font-mono-tabular pt-2 border-t border-slate-200 dark:border-slate-800 text-sm font-extrabold text-slate-900 dark:text-white">
                    <span>Total Payable</span>
                    <span>PKR {receipt.totalPKR.toLocaleString()}</span>
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
                <span>Insured Industrial Freight</span>
                <span className="font-mono-tabular font-semibold text-emerald-700 dark:text-emerald-400">
                  {freightPKR === 0 ? 'FREE (Qualified)' : `PKR ${freightPKR.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Total Estimate
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
                <span>Proceed to B2B Checkout &amp; Proforma</span>
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
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-[#0D5C2B] hover:bg-[#094720] text-white text-sm font-bold transition-colors cursor-pointer"
                >
                  <span>Confirm Order &amp; Generate Proforma</span>
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'confirmed' && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-3 px-4 rounded-md bg-[#1E2985] dark:bg-emerald-600 text-white text-sm font-bold hover:opacity-95 transition-opacity cursor-pointer"
            >
              Return to SZGH Pakistan Storefront
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
