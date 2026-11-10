import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  X,
  CheckCircle2,
  Wrench,
  Cpu,
  AlertCircle,
  Image as ImageIcon,
  Share2,
  Download,
  ExternalLink,
  Loader2,
  QrCode,
  Smartphone,
  RefreshCw,
  Settings,
  Check,
} from 'lucide-react';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db, ADMIN_EMAILS } from '../lib/firebase';

interface PhotoSlot {
  slotIndex: number;
  title: string;
  subtitle: string;
  required: boolean;
  fileName?: string;
  previewUrl?: string;
  jpegFile?: File;
}

type DeliveryFormat = 'collage_and_separate' | 'collage_only' | 'separate_only';

interface WhatsAppServerStatus {
  status: 'disconnected' | 'connecting' | 'qr_ready' | 'connected';
  qrDataUrl: string | null;
  pairingCode: string | null;
  connectedUserJid: string | null;
  targetPhone: string;
  deliveryMode: DeliveryFormat;
  hasUltraMsg?: boolean;
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

/**
 * Compresses an uploaded image file and stamps its component label bar at the bottom
 * so every separate photo and collage cell is clearly identified.
 */
async function processUploadedInspectionPhoto(
  file: File,
  slotNumber: number,
  slotTitle: string
): Promise<{ dataUrl: string; jpegFile: File }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file format.'));
      img.onload = () => {
        const maxWidth = 1000;
        const maxHeight = 750;
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable.'));
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Component title badge at bottom of photo
        const barH = Math.max(34, Math.round(height * 0.068));
        ctx.fillStyle = 'rgba(15, 23, 42, 0.86)';
        ctx.fillRect(0, height - barH, width, barH);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${Math.max(13, Math.round(barH * 0.48))}px sans-serif`;
        ctx.fillText(slotTitle, 14, height - Math.round(barH * 0.3));

        let quality = 0.8;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        while (dataUrl.length > 135000 && quality > 0.35) {
          quality -= 0.08;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const safeLabel = slotTitle
          .replace(/[^a-zA-Z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        const cleanFileName = `SZGH-Photo-${slotNumber}-${safeLabel}.jpg`;

        canvas.toBlob(
          (jpegBlob) => {
            const jpegFile = jpegBlob
              ? new File([jpegBlob], cleanFileName, { type: 'image/jpeg' })
              : file;
            resolve({ dataUrl, jpegFile });
          },
          'image/jpeg',
          quality
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Generates a high-resolution Labeled Collage JPEG combining all uploaded machine photos
 * plus a header banner with Customer Name, Contact, Factory Address, and Booking Reference.
 */
async function buildBookingCollageJpeg(params: {
  bookingRef: string;
  serviceType: 'Retrofitting' | 'Maintenance';
  customerName: string;
  contactNumber: string;
  address: string;
  description: string;
  photos: { title: string; dataUrl: string }[];
}): Promise<{ collageDataUrl: string; collageFile: File } | null> {
  const {
    bookingRef,
    serviceType,
    customerName,
    contactNumber,
    address,
    description,
    photos,
  } = params;

  if (photos.length === 0) return null;

  const loadedImages = await Promise.all(
    photos.map(
      (p) =>
        new Promise<{ title: string; img: HTMLImageElement }>(
          (resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ title: p.title, img });
            img.onerror = reject;
            img.src = p.dataUrl;
          }
        )
    )
  );

  const cols = loadedImages.length === 1 ? 1 : loadedImages.length <= 4 ? 2 : 3;
  const rows = Math.ceil(loadedImages.length / cols);
  const cellW = loadedImages.length === 1 ? 960 : 520;
  const cellH = loadedImages.length === 1 ? 720 : 390;
  const pad = 20;
  const headerH = 185;

  const canvasW = Math.max(960, cols * cellW + (cols + 1) * pad);
  const canvasH = headerH + rows * cellH + (rows + 1) * pad;

  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Dark industrial background
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // Top Header Bar
  ctx.fillStyle = '#1E2985';
  ctx.fillRect(0, 0, canvasW, 62);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(
    `SZGH PAKISTAN — ${serviceType.toUpperCase()} REQUEST (${bookingRef})`,
    pad,
    39
  );

  // Customer Details Strip
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(pad, 76, canvasW - pad * 2, 95);

  ctx.fillStyle = '#34D399';
  ctx.font = 'bold 17px sans-serif';
  ctx.fillText(
    `Customer: ${customerName || 'N/A'}   |   Contact: ${contactNumber || 'N/A'}`,
    pad + 16,
    104
  );

  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(
    `Factory Address: ${(address || 'N/A').slice(0, 85)}`,
    pad + 16,
    130
  );

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '14px sans-serif';
  ctx.fillText(
    `Issue / Spec: ${(description || 'See attached inspection photos below').slice(0, 100)}`,
    pad + 16,
    155
  );

  // Draw Photo Grid
  const totalGridW = cols * cellW + (cols - 1) * pad;
  const startX = Math.round((canvasW - totalGridW) / 2);

  loadedImages.forEach((item, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = startX + col * (cellW + pad);
    const y = headerH + pad + row * (cellH + pad);

    ctx.fillStyle = '#020617';
    ctx.fillRect(x, y, cellW, cellH);

    const scale = Math.min(cellW / item.img.width, cellH / item.img.height);
    const drawW = Math.round(item.img.width * scale);
    const drawH = Math.round(item.img.height * scale);
    const drawX = x + Math.round((cellW - drawW) / 2);
    const drawY = y + Math.round((cellH - drawH) / 2);

    ctx.drawImage(item.img, drawX, drawY, drawW, drawH);
  });

  const collageDataUrl = canvas.toDataURL('image/jpeg', 0.86);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve(null);
          return;
        }
        const collageFile = new File(
          [blob],
          `${bookingRef}-Collage-Photos.jpg`,
          { type: 'image/jpeg' }
        );
        resolve({ collageDataUrl, collageFile });
      },
      'image/jpeg',
      0.86
    );
  });
}

export const RetrofitBookingSection: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [serviceType, setServiceType] = useState<'Retrofitting' | 'Maintenance'>(
    'Retrofitting'
  );
  const [description, setDescription] = useState('');
  const [photoSlots, setPhotoSlots] = useState<PhotoSlot[]>(INITIAL_PHOTO_SLOTS);
  const [deliveryFormat, setDeliveryFormat] = useState<DeliveryFormat>(
    'collage_and_separate'
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBookingId, setSubmittedBookingId] = useState<string | null>(
    null
  );
  const [sentDirectlyByServer, setSentDirectlyByServer] = useState(false);
  const [generatedCollage, setGeneratedCollage] = useState<{
    collageDataUrl: string;
    collageFile: File;
  } | null>(null);

  // Admin WhatsApp Direct Auto-Sender Pairing Panel state (visible ONLY to Admin, never to customers)
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [showWhatsAppSetup, setShowWhatsAppSetup] = useState(false);
  const [waServerStatus, setWaServerStatus] =
    useState<WhatsAppServerStatus | null>(null);
  const [loadingWaStatus, setLoadingWaStatus] = useState(false);
  const [pairingPhoneInput, setPairingPhoneInput] = useState('923214800265');
  const [requestingPairCode, setRequestingPairCode] = useState(false);
  const [waSetupError, setWaSetupError] = useState<string | null>(null);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const bulkInputRef = useRef<HTMLInputElement | null>(null);

  const uploadedSlots = photoSlots.filter((s) => Boolean(s.previewUrl));
  const uploadedCount = uploadedSlots.length;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const authorized = Boolean(
        user &&
          user.emailVerified &&
          user.email &&
          ADMIN_EMAILS.some(
            (e) => e.toLowerCase() === user.email?.toLowerCase()
          )
      );
      setIsAdminUser(authorized);
      if (!authorized) {
        setShowWhatsAppSetup(false);
      }
    });
    return () => unsub();
  }, []);

  // Poll WhatsApp status when the setup drawer is open
  const fetchWaServerStatus = async () => {
    try {
      const res = await fetch('/api/whatsapp/status');
      if (res.ok) {
        const data = (await res.json()) as WhatsAppServerStatus;
        setWaServerStatus(data);
      }
    } catch {
      // Ignore if offline
    }
  };

  useEffect(() => {
    if (isAdminUser) {
      fetchWaServerStatus();
    }
  }, [isAdminUser]);

  useEffect(() => {
    if (!showWhatsAppSetup) return;
    fetchWaServerStatus();
    const timer = setInterval(fetchWaServerStatus, 3000);
    return () => clearInterval(timer);
  }, [showWhatsAppSetup]);

  const handleStartQrConnect = async () => {
    setLoadingWaStatus(true);
    setWaSetupError(null);
    try {
      const res = await fetch('/api/whatsapp/connect', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setWaServerStatus((prev) => ({
          ...(prev || {
            targetPhone: '923214800265',
            deliveryMode: 'collage_and_separate',
          }),
          ...data,
        }));
      }
    } catch {
      setWaSetupError('Could not reach server WhatsApp service.');
    } finally {
      setLoadingWaStatus(false);
    }
  };

  const handleRequestPhonePairingCode = async () => {
    setRequestingPairCode(true);
    setWaSetupError(null);
    try {
      const res = await fetch('/api/whatsapp/pair-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: pairingPhoneInput }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setWaSetupError(
          data.error || 'Could not generate pairing code. Try scanning the QR code.'
        );
      } else {
        setWaServerStatus((prev) =>
          prev ? { ...prev, pairingCode: data.pairingCode } : prev
        );
      }
    } catch {
      setWaSetupError('Failed to request pairing code.');
    } finally {
      setRequestingPairCode(false);
    }
  };

  const handleDisconnectWhatsApp = async () => {
    setLoadingWaStatus(true);
    try {
      await fetch('/api/whatsapp/disconnect', { method: 'POST' });
      await fetchWaServerStatus();
    } finally {
      setLoadingWaStatus(false);
    }
  };

  const handleSingleSlotFileChange = async (
    slotIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload valid image files (JPG, PNG, WEBP).');
      return;
    }

    const targetSlot = photoSlots[slotIndex];
    try {
      const { dataUrl, jpegFile } = await processUploadedInspectionPhoto(
        file,
        slotIndex + 1,
        targetSlot.title
      );
      setPhotoSlots((prev) =>
        prev.map((slot) =>
          slot.slotIndex === slotIndex
            ? {
                ...slot,
                fileName: file.name,
                previewUrl: dataUrl,
                jpegFile,
              }
            : slot
        )
      );
      setErrorMessage('');
    } catch {
      setErrorMessage(
        'Could not process the selected photo. Please try another image.'
      );
    }
  };

  const handleBulkFilesChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith('image/')
    );
    if (files.length === 0) return;

    try {
      const processedList = await Promise.all(
        files.slice(0, 6).map((file, idx) => {
          const slotLabel =
            INITIAL_PHOTO_SLOTS[idx]?.title || `Photo ${idx + 1}`;
          return processUploadedInspectionPhoto(file, idx + 1, slotLabel).then(
            (res) => ({
              originalName: file.name,
              ...res,
            })
          );
        })
      );

      setPhotoSlots((prev) => {
        const next = [...prev];
        processedList.forEach((item, idx) => {
          const emptyIdx = next.findIndex((s) => !s.previewUrl);
          const targetIdx = emptyIdx !== -1 ? emptyIdx : idx % 6;
          next[targetIdx] = {
            ...next[targetIdx],
            fileName: item.originalName,
            previewUrl: item.dataUrl,
            jpegFile: item.jpegFile,
          };
        });
        return next;
      });
      setErrorMessage('');
    } catch {
      setErrorMessage('Failed to process one or more selected images.');
    }
  };

  const handleRemovePhoto = (slotIndex: number) => {
    setPhotoSlots((prev) =>
      prev.map((slot) =>
        slot.slotIndex === slotIndex
          ? {
              ...slot,
              fileName: undefined,
              previewUrl: undefined,
              jpegFile: undefined,
            }
          : slot
      )
    );
    if (fileInputRefs.current[slotIndex]) {
      fileInputRefs.current[slotIndex]!.value = '';
    }
  };

  const buildWhatsAppPlainText = (bookingRef: string) => {
    const attachedPhotosList = uploadedSlots
      .map((s, idx) => `${idx + 1}. ${s.title}`)
      .join('\n');

    return (
      `*NEW ${serviceType.toUpperCase()} REQUEST — SZGH PAKISTAN*\n` +
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
      `*Machine Description:* ${description.trim() || 'See attached machine photos'}\n\n` +
      `*Attached Machine Photos (${uploadedCount}):*\n` +
      `${attachedPhotosList}`
    );
  };

  /**
   * Shares the Collage Image and/or Separate Photos directly via Mobile OS Share Sheet
   * (zero Ctrl+V needed).
   */
  const handleMobileDirectPhotoShare = async (
    bookingRef: string,
    collageFileObj?: File | null
  ): Promise<boolean> => {
    const separateFiles = uploadedSlots
      .map((s) => s.jpegFile)
      .filter((f): f is File => Boolean(f));

    let filesToShare: File[] = [];
    if (deliveryFormat === 'collage_only' && collageFileObj) {
      filesToShare = [collageFileObj];
    } else if (deliveryFormat === 'separate_only') {
      filesToShare = separateFiles;
    } else {
      filesToShare = collageFileObj
        ? [collageFileObj, ...separateFiles]
        : separateFiles;
    }

    if (
      filesToShare.length > 0 &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: filesToShare })
    ) {
      try {
        await navigator.share({
          files: filesToShare,
          title: `SZGH ${serviceType} Request (${bookingRef})`,
          text: buildWhatsAppPlainText(bookingRef),
        });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !contactNumber.trim() || !address.trim()) {
      setErrorMessage(
        'Please fill in your Name, Contact Number, and Factory/Workshop Address.'
      );
      return;
    }
    if (contactNumber.replace(/\D/g, '').length < 10) {
      setErrorMessage(
        'Please enter a valid 10 or 11-digit phone/WhatsApp number.'
      );
      return;
    }
    if (uploadedCount === 0) {
      setErrorMessage(
        'Please upload at least 1 machine inspection photo so our engineers can see your equipment.'
      );
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    const bookingRef = `SZGH-BK-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      // 1. Build the high-resolution Labeled Collage Image combining all uploaded photos + customer header
      const collageResult = await buildBookingCollageJpeg({
        bookingRef,
        serviceType,
        customerName: customerName.trim(),
        contactNumber: contactNumber.trim(),
        address: address.trim(),
        description: description.trim(),
        photos: uploadedSlots.map((s) => ({
          title: s.title,
          dataUrl: s.previewUrl!,
        })),
      });
      setGeneratedCollage(collageResult);

      // 2. Send Collage + All Separate Photos directly to SZGH WhatsApp (+92 321 4800265) via our backend server
      let serverSentOk = false;
      try {
        const apiRes = await fetch('/api/whatsapp/send-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingRef,
            serviceType,
            customerName: customerName.trim(),
            contactNumber: contactNumber.trim(),
            address: address.trim(),
            description: description.trim(),
            collageDataUrl: collageResult?.collageDataUrl || '',
            photos: uploadedSlots.map((s) => ({
              title: s.title,
              dataUrl: s.previewUrl!,
            })),
            requestedMode: deliveryFormat,
          }),
        });
        if (apiRes.ok) {
          const apiData = await apiRes.json();
          serverSentOk = Boolean(apiData.sentDirectlyByServer);
        }
      } catch {
        // Fallback if server endpoint unreachable
      }

      setSentDirectlyByServer(serverSentOk);
      setSubmittedBookingId(bookingRef);

      // 3. If the server WhatsApp auto-sender wasn't linked yet, automatically trigger mobile file share or open WhatsApp
      if (!serverSentOk) {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const sharedOnMobile = isMobile
          ? await handleMobileDirectPhotoShare(
              bookingRef,
              collageResult?.collageFile
            )
          : false;

        if (!sharedOnMobile) {
          const textWithPreview = encodeURIComponent(
            `${window.location.origin}/?booking=${bookingRef}\n\n${buildWhatsAppPlainText(bookingRef)}`
          );
          window.open(
            `https://wa.me/923214800265?text=${textWithPreview}`,
            '_blank',
            'noopener,noreferrer'
          );
        }
      }

      // 4. Also save the booking & photos in Firebase Firestore for permanent Admin records
      try {
        const photoTitles = uploadedSlots.map((s) => s.title.slice(0, 120));
        const photosDataUrls = uploadedSlots.map((s) =>
          s.previewUrl!.slice(0, 245000)
        );

        await setDoc(doc(db, 'service_bookings', bookingRef), {
          bookingId: bookingRef,
          serviceType,
          customerName: customerName.trim().slice(0, 200),
          contactNumber: contactNumber.trim().slice(0, 40),
          address: address.trim().slice(0, 500),
          description: description.trim().slice(0, 2000),
          photoTitles,
          photos: photosDataUrls,
          status: 'New Request',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        const manifestRef = doc(db, 'booking_index', 'active_manifest');
        const existingSnap = await getDoc(manifestRef);
        const existingIds: string[] = existingSnap.exists()
          ? (existingSnap.data().bookingIds as string[]) || []
          : [];
        const updatedIds = Array.from(
          new Set([...existingIds, bookingRef])
        ).slice(-950);
        await setDoc(manifestRef, {
          manifestId: 'active_manifest',
          bookingIds: updatedIds,
          updatedAt: serverTimestamp(),
        });
      } catch {
        // Non-blocking Firestore backup
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetBooking = () => {
    setSubmittedBookingId(null);
    setSentDirectlyByServer(false);
    setGeneratedCollage(null);
    setCustomerName('');
    setContactNumber('');
    setAddress('');
    setDescription('');
    setPhotoSlots(INITIAL_PHOTO_SLOTS);
  };

  return (
    <section
      id="application"
      className="py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-[#0D5C2B] dark:text-emerald-400 mb-1">
              On-Site Engineering Assessment · SZGH Pakistan (KH Enterprises Pvt Ltd)
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              CNC Retrofit &amp; Machine Maintenance Booking
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Book our field engineering team for a complete CNC retrofit overhaul or emergency machine maintenance. Upload up to 6 photos of your existing machine components—your pictures and details are sent directly to our WhatsApp in a high-resolution collage and separate photos.
            </p>
          </div>

          {/* Admin-Only WhatsApp Direct Auto-Sender Connection Button (Hidden from Customers) */}
          {isAdminUser && (
            <button
              type="button"
              onClick={() => setShowWhatsAppSetup((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md border text-xs font-bold transition-colors cursor-pointer ${
                waServerStatus?.status === 'connected'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-[#0D5C2B] dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Admin Only: Configure automatic server-to-WhatsApp direct image delivery"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>
                {waServerStatus?.status === 'connected'
                  ? 'Admin: WhatsApp Direct Sender Active'
                  : 'Admin: Setup Direct WhatsApp Sender'}
              </span>
            </button>
          )}
        </div>

        {/* Admin-Only Collapsible Panel to Link WhatsApp Direct Auto-Sender Once */}
        {isAdminUser && showWhatsAppSetup && (
          <div className="mb-8 p-6 rounded-xl bg-white dark:bg-slate-900 border-2 border-[#1E2985] dark:border-emerald-500 shadow-lg space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="text-xs font-mono-tabular uppercase font-bold text-[#0D5C2B] dark:text-emerald-400">
                  SERVER-SIDE DIRECT WHATSAPP PHOTO ENGINE (+92 321 4800265)
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Automatic Direct Picture Delivery (Collage + All 6 Separate Photos)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
                  Link your WhatsApp once below (just like WhatsApp Web). Once connected, whenever any customer submits the Maintenance or Retrofitting form on your website, the server automatically sends the <strong>Labeled Photo Collage</strong> and <strong>All 6 Separate Photos</strong> directly into your <strong>+92 321 4800265</strong> WhatsApp chat—customers don&apos;t have to press Ctrl+V or do anything!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowWhatsAppSetup(false)}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {waSetupError && (
              <div className="p-3 rounded-md bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-xs font-semibold text-red-700 dark:text-red-300">
                {waSetupError}
              </div>
            )}

            {waServerStatus?.status === 'connected' ? (
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-7 h-7 text-[#0D5C2B] dark:text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Connected &amp; Ready — Direct Pictures Land Automatically in +92 321 4800265
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      Linked Account: <span className="font-mono-tabular font-bold">{waServerStatus.connectedUserJid}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDisconnectWhatsApp}
                  disabled={loadingWaStatus}
                  className="px-3.5 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Disconnect WhatsApp
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Option 1: Scan QR Code */}
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white">
                      <QrCode className="w-4 h-4 text-[#1E2985] dark:text-emerald-400" />
                      <span>Option 1: Scan WhatsApp QR Code</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleStartQrConnect}
                      disabled={loadingWaStatus}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1E2985] hover:bg-[#151d63] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${loadingWaStatus ? 'animate-spin' : ''}`}
                      />
                      <span>Generate QR Code</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Open WhatsApp on your phone → <strong>Linked Devices</strong> → <strong>Link a Device</strong> and scan this QR code:
                  </p>
                  {waServerStatus?.qrDataUrl ? (
                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-slate-200">
                      <img
                        src={waServerStatus.qrDataUrl}
                        alt="WhatsApp Link QR Code"
                        className="w-52 h-52 object-contain"
                      />
                      <span className="text-[11px] font-bold text-[#0D5C2B] mt-2">
                        Scan with WhatsApp to enable automatic direct photo delivery
                      </span>
                    </div>
                  ) : (
                    <div className="h-44 flex items-center justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500">
                      {loadingWaStatus
                        ? 'Generating WhatsApp QR Code...'
                        : 'Click "Generate QR Code" above to display the QR code'}
                    </div>
                  )}
                </div>

                {/* Option 2: Link with 8-Digit Phone Pairing Code */}
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white">
                    <Smartphone className="w-4 h-4 text-[#0D5C2B] dark:text-emerald-400" />
                    <span>Option 2: Link via 8-Digit Phone Pairing Code</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Or enter your WhatsApp number (with country code, e.g. <strong>923214800265</strong>) and tap <strong>Get Pairing Code</strong> to link on your phone without scanning a QR:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pairingPhoneInput}
                      onChange={(e) => setPairingPhoneInput(e.target.value)}
                      placeholder="923214800265"
                      className="flex-1 px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono-tabular text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleRequestPhonePairingCode}
                      disabled={requestingPairCode}
                      className="px-3.5 py-2 rounded bg-[#0D5C2B] hover:bg-[#094720] text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      {requestingPairCode ? 'Requesting...' : 'Get Pairing Code'}
                    </button>
                  </div>
                  {waServerStatus?.pairingCode && (
                    <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-center space-y-1">
                      <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        Enter this 8-character code in WhatsApp → Linked Devices → Link with phone number instead:
                      </div>
                      <div className="text-2xl font-mono-tabular font-black tracking-widest text-[#0D5C2B] dark:text-emerald-400">
                        {waServerStatus.pairingCode}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {submittedBookingId ? (
          /* Clean, Zero-Headache Customer Confirmation State */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-[#0D5C2B] dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs font-mono-tabular font-bold text-[#0D5C2B] dark:text-emerald-400">
                  BOOKING REFERENCE #{submittedBookingId}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {sentDirectlyByServer
                    ? 'Your Request & Machine Photos Have Been Sent Directly to Our WhatsApp!'
                    : `${serviceType} Request & Photo Collage Prepared for WhatsApp`}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Thank you, <strong>{customerName}</strong>. Our engineering team at <strong>SZGH Pakistan (+92 321 4800265)</strong> has received your machine details along with your {uploadedCount} inspection photo(s) and will contact you at <strong className="font-mono-tabular">{contactNumber}</strong> shortly.
                </p>
              </div>
            </div>

            {/* Preview of the Generated Collage Picture & Separate Photos */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              {generatedCollage && (
                <div className="md:col-span-7 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      Generated Machine Inspection Photo Collage ({uploadedCount} Photos):
                    </span>
                    <a
                      href={generatedCollage.collageDataUrl}
                      download={`${submittedBookingId}-Collage.jpg`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0D5C2B] dark:text-emerald-400 hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Collage</span>
                    </a>
                  </div>
                  <div className="rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-950">
                    <img
                      src={generatedCollage.collageDataUrl}
                      alt="Machine Inspection Collage"
                      className="w-full max-h-80 object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="md:col-span-5 space-y-2">
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                  Individual Attached Photos ({uploadedCount} / 6):
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {uploadedSlots.map((slot) => (
                    <div
                      key={slot.slotIndex}
                      className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900"
                    >
                      <img
                        src={slot.previewUrl}
                        alt={slot.title}
                        className="w-full h-20 object-cover bg-slate-950"
                      />
                      <div className="p-1.5 text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">
                        {slot.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Clean Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={async () => {
                  const shared = await handleMobileDirectPhotoShare(
                    submittedBookingId,
                    generatedCollage?.collageFile
                  );
                  if (!shared) {
                    const textWithPreview = encodeURIComponent(
                      `${window.location.origin}/?booking=${submittedBookingId}\n\n${buildWhatsAppPlainText(submittedBookingId)}`
                    );
                    window.open(
                      `https://wa.me/923214800265?text=${textWithPreview}`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[5px] bg-[#0D5C2B] hover:bg-[#094720] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Send Collage &amp; Photos via WhatsApp App</span>
              </button>

              <a
                href={`https://wa.me/923214800265?text=${encodeURIComponent(
                  `${window.location.origin}/?booking=${submittedBookingId}\n\n${buildWhatsAppPlainText(submittedBookingId)}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-[5px] bg-[#E77817] hover:bg-[#d1680f] text-white text-xs sm:text-sm font-bold transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Direct Chat (+92 321 4800265)</span>
              </a>

              <button
                type="button"
                onClick={handleResetBooking}
                className="px-4 py-3 rounded-[5px] bg-[#0068AD] hover:bg-[#00558F] text-xs font-semibold text-white transition-colors cursor-pointer ml-auto"
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

            {/* Right 7 Cols: 6-Photo Machine Inspection Uploading Section with Collage / Separate Selector */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-7 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    2. Upload Machine Photos (6-Photo Capacity)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload up to 6 photos—sent directly to our WhatsApp in a labeled collage &amp; separate photos
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

              {/* WhatsApp Photo Delivery Mode Selector: Collage + Separate / Collage Only / Separate Only */}
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  WhatsApp Direct Picture Format:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    {
                      id: 'collage_and_separate' as DeliveryFormat,
                      label: 'Collage + Separate Photos',
                      desc: 'Sends 1 combined collage + all photos',
                    },
                    {
                      id: 'collage_only' as DeliveryFormat,
                      label: 'Single Collage Picture',
                      desc: 'All uploaded photos in 1 grid image',
                    },
                    {
                      id: 'separate_only' as DeliveryFormat,
                      label: 'All 6 Photos Separately',
                      desc: 'Sends each uploaded photo individually',
                    },
                  ].map((opt) => {
                    const active = deliveryFormat === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setDeliveryFormat(opt.id)}
                        className={`p-2.5 rounded-md border text-left transition-all cursor-pointer flex items-start gap-2 ${
                          active
                            ? 'border-[#0D5C2B] dark:border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/40'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center mt-0.5 shrink-0 ${
                            active
                              ? 'bg-[#0D5C2B] text-white'
                              : 'border border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {active && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <div>
                          <div className="text-[11px] font-extrabold text-slate-900 dark:text-white">
                            {opt.label}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {opt.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
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
                        onChange={(e) =>
                          handleSingleSlotFileChange(slot.slotIndex, e)
                        }
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
                          onClick={() =>
                            fileInputRefs.current[slot.slotIndex]?.click()
                          }
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
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-[5px] bg-[#E77817] hover:bg-[#d1680f] disabled:opacity-60 text-white text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Collage &amp; Photos Directly to WhatsApp...</span>
                  </>
                ) : (
                  <span>Submit Request</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
