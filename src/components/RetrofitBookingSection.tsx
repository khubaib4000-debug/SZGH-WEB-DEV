import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  X,
  CheckCircle2,
  Wrench,
  Cpu,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';

interface PhotoSlot {
  slotIndex: number;
  title: string;
  subtitle: string;
  required: boolean;
  fileName?: string;
  previewUrl?: string;
}

const INITIAL_PHOTO_SLOTS: PhotoSlot[] = [
  {
    slotIndex: 0,
    title: '1. Machine Existing Controller',
    subtitle: 'Front operator panel & controller screen',
    required: true,
  },
  {
    slotIndex: 1,
    title: '2. Existing Motor Drives',
    subtitle: 'Electrical cabinet servo & spindle drives',
    required: true,
  },
  {
    slotIndex: 2,
    title: '3. Turret / Tool Post / Tool Changer',
    subtitle: 'Lathe turret, tool post, or VMC ATC magazine',
    required: true,
  },
  {
    slotIndex: 3,
    title: '4. Feed Axis Servo Motors',
    subtitle: 'X / Y / Z axis motor flange & coupling view',
    required: false,
  },
  {
    slotIndex: 4,
    title: '5. Machine Full View / Nameplate',
    subtitle: 'Overall machine bed & manufacturer plate',
    required: false,
  },
  {
    slotIndex: 5,
    title: '6. Additional Cabinet / Wiring View',
    subtitle: 'PLC relays, transformer, or alarm screen',
    required: false,
  },
];

export const RetrofitBookingSection: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [serviceType, setServiceType] = useState<'Retrofitting' | 'Maintenance'>(
    'Retrofitting'
  );
  const [description, setDescription] = useState('');
  const [photoSlots, setPhotoSlots] = useState<PhotoSlot[]>(INITIAL_PHOTO_SLOTS);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedBookingId, setSubmittedBookingId] = useState<string | null>(null);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const bulkInputRef = useRef<HTMLInputElement | null>(null);

  const uploadedCount = photoSlots.filter((s) => Boolean(s.previewUrl)).length;

  const handleSingleSlotFileChange = (
    slotIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload valid image files (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoSlots((prev) =>
        prev.map((slot) =>
          slot.slotIndex === slotIndex
            ? {
                ...slot,
                fileName: file.name,
                previewUrl: reader.result as string,
              }
            : slot
        )
      );
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  };

  const handleBulkFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith('image/')
    );
    if (files.length === 0) return;

    // Fill empty slots first, up to 6 total capacity
    files.slice(0, 6).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoSlots((prev) => {
          const next = [...prev];
          // Find first empty slot or fallback to index
          const emptyIdx = next.findIndex((s) => !s.previewUrl);
          const targetIdx = emptyIdx !== -1 ? emptyIdx : idx % 6;
          next[targetIdx] = {
            ...next[targetIdx],
            fileName: file.name,
            previewUrl: reader.result as string,
          };
          return next;
        });
      };
      reader.readAsDataURL(file);
    });
    setErrorMessage('');
  };

  const handleRemovePhoto = (slotIndex: number) => {
    setPhotoSlots((prev) =>
      prev.map((slot) =>
        slot.slotIndex === slotIndex
          ? { ...slot, fileName: undefined, previewUrl: undefined }
          : slot
      )
    );
    if (fileInputRefs.current[slotIndex]) {
      fileInputRefs.current[slotIndex]!.value = '';
    }
  };

  const buildWhatsAppNotificationUrl = (bookingRef: string) => {
    const attachedPhotosList = photoSlots
      .filter((s) => Boolean(s.previewUrl))
      .map((s) => `• ${s.title} (${s.fileName || 'Attached'})`)
      .join('\n');

    const text = encodeURIComponent(
      `*NEW ${serviceType.toUpperCase()} BOOKING — SZGH PAKISTAN*\n` +
        `----------------------------------\n` +
        `*Booking Ref:* ${bookingRef}\n` +
        `*Service Type:* ${
          serviceType === 'Retrofitting'
            ? 'CNC Machine Retrofitting'
            : 'Machine Maintenance & Repair'
        }\n` +
        `*Customer Name:* ${customerName.trim()}\n` +
        `*Contact No:* ${contactNumber.trim()}\n` +
        `*Factory Address:* ${address.trim()}\n` +
        `*Machine Description:* ${description.trim() || 'Provided in photos'}\n\n` +
        `*Uploaded Machine Photos (${uploadedCount}/6):*\n${attachedPhotosList}\n\n` +
        `*(Note: I am attaching the ${uploadedCount} machine inspection photo(s) in this chat below)*`
    );
    return `https://wa.me/923214800265?text=${text}`;
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !contactNumber.trim() || !address.trim()) {
      setErrorMessage(
        'Please fill in your Name, Contact Number, and Factory/Workshop Address.'
      );
      return;
    }
    if (contactNumber.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10 or 11-digit phone/WhatsApp number.');
      return;
    }
    if (uploadedCount === 0) {
      setErrorMessage(
        'Please upload at least the required machine photos (Existing Controller, Motor Drives, and Turret/Tool Changer).'
      );
      return;
    }

    setErrorMessage('');
    const bookingRef = `SZGH-BK-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedBookingId(bookingRef);

    // Immediately redirect/open WhatsApp notification to +923214800265 with full booking details
    window.location.href = buildWhatsAppNotificationUrl(bookingRef);
  };

  const handleResetBooking = () => {
    setSubmittedBookingId(null);
    setCustomerName('');
    setContactNumber('');
    setAddress('');
    setDescription('');
    setPhotoSlots(INITIAL_PHOTO_SLOTS);
  };

  const whatsappBookingSummaryHref = () => {
    return buildWhatsAppNotificationUrl(submittedBookingId || 'SZGH-BK');
  };

  return (
    <section
      id="application"
      className="py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10">
          <div className="text-xs font-semibold text-[#0D5C2B] dark:text-emerald-400 mb-1">
            On-Site Engineering Assessment · SZGH Pakistan (KH Enterprises Pvt Ltd)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            CNC Retrofit &amp; Machine Maintenance Booking
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Book our field engineering team for a complete CNC retrofit overhaul or emergency machine maintenance. Upload up to 6 photos of your existing machine components so our engineers arrive with the exact matching controller, drives, and adapter plates.
          </p>
        </div>

        {submittedBookingId ? (
          /* Booking Confirmation State */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-10 max-w-3xl mx-auto space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-[#0D5C2B] dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs font-mono-tabular font-bold text-[#0D5C2B] dark:text-emerald-400">
                  BOOKING REFERENCE #{submittedBookingId}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {serviceType === 'Retrofitting'
                    ? 'CNC Machine Retrofitting Booking Received'
                    : 'Machine Maintenance Booking Received'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Thank you, <strong>{customerName}</strong>. Our senior CNC retrofit engineer will review your {uploadedCount} uploaded machine photo(s) and contact you at <strong className="font-mono-tabular">{contactNumber}</strong> shortly.
                </p>
              </div>
            </div>

            {/* Uploaded Photos Preview in Receipt */}
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Attached Machine Inspection Photos ({uploadedCount} / 6):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {photoSlots
                  .filter((s) => Boolean(s.previewUrl))
                  .map((slot) => (
                    <div
                      key={slot.slotIndex}
                      className="rounded border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900"
                    >
                      <img
                        src={slot.previewUrl}
                        alt={slot.title}
                        className="w-full h-20 object-cover"
                      />
                      <div className="p-1.5 text-[10px] font-medium text-slate-600 dark:text-slate-400 truncate">
                        {slot.title}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <a
                href={whatsappBookingSummaryHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-[5px] bg-[#E77817] hover:bg-[#d1680f] text-white text-xs sm:text-sm font-normal transition-colors"
              >
                Send Booking Summary on WhatsApp (+92 321 4800265)
              </a>
              <button
                type="button"
                onClick={handleResetBooking}
                className="px-4 py-2.5 rounded-[5px] bg-[#0068AD] hover:bg-[#00558F] text-xs font-normal text-white transition-colors cursor-pointer"
              >
                Submit Another Machine Booking
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form
            onSubmit={handleSubmitBooking}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left 5 Cols: Customer Details, Service Selection & Description */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-7 space-y-5">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
                1. Customer &amp; Service Details
              </h3>

              {errorMessage && (
                <div className="p-3 rounded-md bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 flex items-start gap-2 text-xs font-medium text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Service Option Choice: Retrofitting vs Maintenance */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Required Service *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setServiceType('Retrofitting')}
                    className={`flex flex-col items-start p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                      serviceType === 'Retrofitting'
                        ? 'border-[#1E2985] dark:border-emerald-400 bg-slate-50 dark:bg-slate-950 ring-2 ring-[#1E2985]/20 dark:ring-emerald-400/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/50'
                    }`}
                  >
                    <Cpu className="w-5 h-5 text-[#1E2985] dark:text-emerald-400 mb-1.5" />
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      CNC Retrofitting
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      New controller, servos &amp; cabinet upgrade
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType('Maintenance')}
                    className={`flex flex-col items-start p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                      serviceType === 'Maintenance'
                        ? 'border-[#1E2985] dark:border-emerald-400 bg-slate-50 dark:bg-slate-950 ring-2 ring-[#1E2985]/20 dark:ring-emerald-400/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/50'
                    }`}
                  >
                    <Wrench className="w-5 h-5 text-[#0D5C2B] dark:text-emerald-400 mb-1.5" />
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      Machine Maintenance
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Fault diagnostics, drive &amp; turret repair
                    </span>
                  </button>
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Customer / Engineer Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1E2985] dark:focus:border-emerald-400"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Number (Phone / WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="e.g., 0321-4800265"
                  className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-mono-tabular text-slate-900 dark:text-white focus:outline-none focus:border-[#1E2985] dark:focus:border-emerald-400"
                />
              </div>

              {/* Factory / Workshop Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Factory / Workshop Address &amp; City *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot #, Industrial Estate, City (e.g., Lahore, Sialkot, Gujranwala)"
                  className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1E2985] dark:focus:border-emerald-400"
                />
              </div>

              {/* Description Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Machine Description &amp; Issue / Requirement
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your machine model, number of axes, existing controller brand, turret/tool changer type, or current fault..."
                  className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1E2985] dark:focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Right 7 Cols: 6-Photo Machine Inspection Uploading Section with Instructions */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-7 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    2. Upload Machine Photos (6-Photo Capacity)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Click any slot below or use bulk upload to attach up to 6 clear photos
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono-tabular text-xs font-bold text-[#1E2985] dark:text-emerald-400">
                    {uploadedCount} / 6 Uploaded
                  </span>
                  <input
                    ref={bulkInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleBulkFilesChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => bulkInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[5px] bg-[#0068AD] hover:bg-[#00558F] text-xs font-normal text-white transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-white" />
                    <span>Select Multiple Photos</span>
                  </button>
                </div>
              </div>

              {/* Mandatory Photo Instructions Box */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white">
                  <Camera className="w-4 h-4 text-[#0D5C2B] dark:text-emerald-400" />
                  <span>Photo Must Include:</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold pt-1">
                  <li className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    1- Machine existing Controller
                  </li>
                  <li className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    2- Existing motor drives
                  </li>
                  <li className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    3- Turret / Tool post / Tool Changer
                  </li>
                </ul>
              </div>

              {/* 6-Slot Photo Upload Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {photoSlots.map((slot) => {
                  const hasPhoto = Boolean(slot.previewUrl);
                  return (
                    <div
                      key={slot.slotIndex}
                      className={`relative flex flex-col justify-between rounded-lg border overflow-hidden transition-colors ${
                        hasPhoto
                          ? 'border-[#0D5C2B] dark:border-emerald-500 bg-slate-50 dark:bg-slate-950'
                          : slot.required
                          ? 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/60 hover:border-[#1E2985] dark:hover:border-emerald-400'
                          : 'border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 hover:border-slate-400'
                      }`}
                    >
                      <input
                        ref={(el) => {
                          fileInputRefs.current[slot.slotIndex] = el;
                        }}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSingleSlotFileChange(slot.slotIndex, e)}
                        className="hidden"
                      />

                      {hasPhoto ? (
                        <div className="relative aspect-4/3 w-full bg-slate-950">
                          <img
                            src={slot.previewUrl}
                            alt={slot.title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(slot.slotIndex)}
                            aria-label={`Remove ${slot.title}`}
                            className="absolute top-2 right-2 p-1 rounded-full bg-slate-950/80 hover:bg-red-600 text-white transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[slot.slotIndex]?.click()}
                          className="aspect-4/3 w-full flex flex-col items-center justify-center p-4 text-center cursor-pointer"
                        >
                          <ImageIcon className="w-7 h-7 text-slate-400 mb-2" />
                          <span className="text-xs font-bold text-[#1E2985] dark:text-emerald-400">
                            + Upload Photo
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            {slot.subtitle}
                          </span>
                        </button>
                      )}

                      <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-1">
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                          {slot.title}
                        </span>
                        {slot.required && !hasPhoto && (
                          <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                            Required
                          </span>
                        )}
                        {hasPhoto && (
                          <span className="text-[10px] font-semibold text-[#0D5C2B] dark:text-emerald-400 shrink-0">
                            Ready
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-[5px] bg-[#E77817] hover:bg-[#d1680f] text-white text-sm font-normal transition-colors cursor-pointer"
              >
                Submit Form
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
