import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import pino from 'pino';
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  WASocket,
} from '@whiskeysockets/baileys';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTH_DIR = path.resolve(__dirname, 'whatsapp_auth_info');
const BOOKINGS_MEDIA_DIR = path.resolve(AUTH_DIR, 'bookings_media');
const CONFIG_FILE = path.resolve(AUTH_DIR, 'wa_config.json');

fs.mkdirSync(AUTH_DIR, { recursive: true });
fs.mkdirSync(BOOKINGS_MEDIA_DIR, { recursive: true });

export type WhatsAppDeliveryMode =
  | 'collage_and_separate'
  | 'collage_only'
  | 'separate_only';

interface WhatsAppServerConfig {
  targetPhone: string;
  deliveryMode: WhatsAppDeliveryMode;
  ultramsgInstanceId?: string;
  ultramsgToken?: string;
}

function loadConfig(): WhatsAppServerConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      return {
        targetPhone: raw.targetPhone || '923214800265',
        deliveryMode: raw.deliveryMode || 'collage_and_separate',
        ultramsgInstanceId: raw.ultramsgInstanceId || '',
        ultramsgToken: raw.ultramsgToken || '',
      };
    }
  } catch {
    // Ignore parse error
  }
  return {
    targetPhone: '923214800265',
    deliveryMode: 'collage_and_separate',
  };
}

function saveConfig(cfg: WhatsAppServerConfig) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), 'utf8');
  } catch {
    // Ignore write error
  }
}

let waConfig: WhatsAppServerConfig = loadConfig();
let waSocket: WASocket | null = null;
let waStatus: 'disconnected' | 'connecting' | 'qr_ready' | 'connected' =
  'disconnected';
let currentQrDataUrl: string | null = null;
let currentPairingCode: string | null = null;
let connectedUserJid: string | null = null;
let isInitializingSocket = false;

const logger = pino({ level: 'silent' });

async function initWhatsAppSocket(forceNew = false): Promise<void> {
  if (isInitializingSocket && !forceNew) return;
  isInitializingSocket = true;

  try {
    if (waSocket) {
      try {
        waSocket.ev.removeAllListeners('connection.update');
        waSocket.ev.removeAllListeners('creds.update');
        waSocket.end(undefined);
      } catch {
        // Ignore cleanup errors
      }
      waSocket = null;
    }

    waStatus = 'connecting';
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

    let version: [number, number, number] = [2, 3000, 1015901307];
    try {
      const latest = await fetchLatestBaileysVersion();
      if (latest?.version) {
        version = latest.version;
      }
    } catch {
      // Fallback to default version if offline
    }

    const sock = makeWASocket({
      version,
      auth: state,
      logger,
      printQRInTerminal: false,
      browser: ['SZGH Pakistan Web', 'Chrome', '122.0.0'],
      syncFullHistory: false,
      markOnlineOnConnect: false,
    });

    waSocket = sock;

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        waStatus = 'qr_ready';
        try {
          currentQrDataUrl = await QRCode.toDataURL(qr, {
            margin: 2,
            width: 300,
          });
        } catch {
          currentQrDataUrl = null;
        }
      }

      if (connection === 'open') {
        waStatus = 'connected';
        currentQrDataUrl = null;
        currentPairingCode = null;
        connectedUserJid = sock.user?.id || 'Connected';
      }

      if (connection === 'close') {
        const statusCode = (
          lastDisconnect?.error as { output?: { statusCode?: number } }
        )?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        if (!shouldReconnect) {
          waStatus = 'disconnected';
          currentQrDataUrl = null;
          currentPairingCode = null;
          connectedUserJid = null;
          try {
            const files = fs.readdirSync(AUTH_DIR);
            for (const f of files) {
              if (f !== 'bookings_media' && f !== 'wa_config.json') {
                fs.rmSync(path.join(AUTH_DIR, f), {
                  recursive: true,
                  force: true,
                });
              }
            }
          } catch {
            // Ignore cleanup errors
          }
        } else {
          waStatus = 'connecting';
          setTimeout(() => {
            initWhatsAppSocket(true).catch(() => {});
          }, 4000);
        }
      }
    });
  } catch {
    waStatus = 'disconnected';
  } finally {
    isInitializingSocket = false;
  }
}

// Automatically resume WhatsApp session on startup if credentials already exist
if (fs.existsSync(path.join(AUTH_DIR, 'creds.json'))) {
  initWhatsAppSocket().catch(() => {});
}

function dataUrlToBuffer(dataUrl: string): Buffer | null {
  if (!dataUrl) return null;
  const match = dataUrl.match(/^data:image\/[a-zA-Z0-9+.-]+;base64,(.+)$/);
  const base64Str = match ? match[1] : dataUrl;
  try {
    return Buffer.from(base64Str, 'base64');
  } catch {
    return null;
  }
}

async function sendDirectViaUltraMsg(params: {
  targetPhone: string;
  caption: string;
  collageDataUrl?: string;
  photos: { title: string; dataUrl: string }[];
  deliveryMode: WhatsAppDeliveryMode;
}): Promise<boolean> {
  const instanceId =
    process.env.ULTRAMSG_INSTANCE_ID || waConfig.ultramsgInstanceId;
  const token = process.env.ULTRAMSG_TOKEN || waConfig.ultramsgToken;
  if (!instanceId || !token) return false;

  const cleanInstance = instanceId.replace(/^instance/i, '');
  const endpoint = `https://api.ultramsg.com/instance${cleanInstance}/messages/image`;
  const to = `+${params.targetPhone.replace(/\D/g, '')}`;

  try {
    let anySent = false;

    if (
      (params.deliveryMode === 'collage_only' ||
        params.deliveryMode === 'collage_and_separate') &&
      params.collageDataUrl
    ) {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          to,
          image: params.collageDataUrl,
          caption: params.caption,
        }),
      });
      if (res.ok) anySent = true;
    }

    if (
      params.deliveryMode === 'separate_only' ||
      params.deliveryMode === 'collage_and_separate'
    ) {
      for (let i = 0; i < params.photos.length; i++) {
        const photo = params.photos[i];
        const photoCaption =
          params.deliveryMode === 'separate_only' && i === 0
            ? `${params.caption}\n\n📸 *${photo.title}*`
            : `📸 *${photo.title}*`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            to,
            image: photo.dataUrl,
            caption: photoCaption,
          }),
        });
        if (res.ok) anySent = true;
      }
    }

    return anySent;
  } catch {
    return false;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  // 1. Serve saved booking Collage & Separate Photos as direct JPEG binaries (also powers WhatsApp og:image preview)
  app.get('/api/booking-collage/:file', (req, res) => {
    const rawId = req.params.file.replace(/\.jpg$/i, '');
    if (!/^[a-zA-Z0-9_-]+$/.test(rawId)) {
      res.status(400).end();
      return;
    }
    const filePath = path.join(BOOKINGS_MEDIA_DIR, `${rawId}-collage.jpg`);
    if (!fs.existsSync(filePath)) {
      res.status(404).end();
      return;
    }
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    fs.createReadStream(filePath).pipe(res);
  });

  app.get('/api/booking-photo/:bookingId/:index', (req, res) => {
    const rawId = req.params.bookingId.replace(/[^a-zA-Z0-9_-]/g, '');
    const rawIdx = req.params.index.replace(/\.jpg$/i, '');
    const idxNum = Number(rawIdx);
    if (!rawId || isNaN(idxNum) || idxNum < 1 || idxNum > 6) {
      res.status(400).end();
      return;
    }
    const filePath = path.join(
      BOOKINGS_MEDIA_DIR,
      `${rawId}-photo-${idxNum}.jpg`
    );
    if (!fs.existsSync(filePath)) {
      res.status(404).end();
      return;
    }
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    fs.createReadStream(filePath).pipe(res);
  });

  // 2. WhatsApp Direct Auto-Sender Status & Pairing Endpoints (for Stock Admin)
  app.get('/api/whatsapp/status', (_req, res) => {
    res.json({
      status: waStatus,
      qrDataUrl: currentQrDataUrl,
      pairingCode: currentPairingCode,
      connectedUserJid,
      targetPhone: waConfig.targetPhone,
      deliveryMode: waConfig.deliveryMode,
      hasUltraMsg: Boolean(
        (process.env.ULTRAMSG_INSTANCE_ID || waConfig.ultramsgInstanceId) &&
          (process.env.ULTRAMSG_TOKEN || waConfig.ultramsgToken)
      ),
    });
  });

  app.post('/api/whatsapp/connect', async (_req, res) => {
    await initWhatsAppSocket(true);
    // Wait briefly up to 2.5s for QR to be generated
    for (let i = 0; i < 10; i++) {
      if (currentQrDataUrl || waStatus === 'connected') break;
      await new Promise((r) => setTimeout(r, 250));
    }
    res.json({
      status: waStatus,
      qrDataUrl: currentQrDataUrl,
      pairingCode: currentPairingCode,
      connectedUserJid,
    });
  });

  app.post('/api/whatsapp/pair-code', async (req, res) => {
    const rawPhone = String(req.body?.phoneNumber || waConfig.targetPhone).replace(
      /\D/g,
      ''
    );
    if (!rawPhone || rawPhone.length < 10) {
      res.status(400).json({ error: 'Valid country-code phone number required (e.g. 923214800265).' });
      return;
    }

    try {
      if (!waSocket || waStatus === 'disconnected') {
        await initWhatsAppSocket(true);
        await new Promise((r) => setTimeout(r, 1500));
      }
      if (!waSocket) {
        res.status(500).json({ error: 'Could not initialize WhatsApp socket.' });
        return;
      }
      const code = await waSocket.requestPairingCode(rawPhone);
      currentPairingCode = code;
      res.json({
        ok: true,
        pairingCode: code,
        status: waStatus,
      });
    } catch (err) {
      res.status(500).json({
        error:
          err instanceof Error
            ? err.message
            : 'Failed to request pairing code. Try scanning the QR code instead.',
      });
    }
  });

  app.post('/api/whatsapp/config', (req, res) => {
    const {
      targetPhone,
      deliveryMode,
      ultramsgInstanceId,
      ultramsgToken,
    } = req.body || {};

    if (targetPhone && typeof targetPhone === 'string') {
      waConfig.targetPhone = targetPhone.replace(/\D/g, '') || '923214800265';
    }
    if (
      deliveryMode === 'collage_and_separate' ||
      deliveryMode === 'collage_only' ||
      deliveryMode === 'separate_only'
    ) {
      waConfig.deliveryMode = deliveryMode;
    }
    if (typeof ultramsgInstanceId === 'string') {
      waConfig.ultramsgInstanceId = ultramsgInstanceId.trim();
    }
    if (typeof ultramsgToken === 'string') {
      waConfig.ultramsgToken = ultramsgToken.trim();
    }
    saveConfig(waConfig);
    res.json({ ok: true, config: waConfig });
  });

  app.post('/api/whatsapp/disconnect', async (_req, res) => {
    try {
      if (waSocket) {
        await waSocket.logout().catch(() => {});
        waSocket.end(undefined);
        waSocket = null;
      }
      const files = fs.readdirSync(AUTH_DIR);
      for (const f of files) {
        if (f !== 'bookings_media' && f !== 'wa_config.json') {
          fs.rmSync(path.join(AUTH_DIR, f), { recursive: true, force: true });
        }
      }
    } catch {
      // Ignore errors
    }
    waStatus = 'disconnected';
    currentQrDataUrl = null;
    currentPairingCode = null;
    connectedUserJid = null;
    res.json({ ok: true, status: waStatus });
  });

  // 3. Direct Booking Pictures + Details Sender Endpoint
  app.post('/api/whatsapp/send-booking', async (req, res) => {
    const {
      bookingRef,
      serviceType,
      customerName,
      contactNumber,
      address,
      description,
      collageDataUrl,
      photos = [],
      requestedMode,
    } = req.body || {};

    const safeBookingRef = String(bookingRef || `SZGH-BK-${Date.now()}`).replace(
      /[^a-zA-Z0-9_-]/g,
      ''
    );

    const validPhotos: { title: string; dataUrl: string }[] = Array.isArray(photos)
      ? photos.filter((p) => p && typeof p.dataUrl === 'string')
      : [];

    // Save collage & individual photos to disk so they can be served as real JPEGs
    const collageBuffer =
      typeof collageDataUrl === 'string' ? dataUrlToBuffer(collageDataUrl) : null;
    if (collageBuffer) {
      try {
        fs.writeFileSync(
          path.join(BOOKINGS_MEDIA_DIR, `${safeBookingRef}-collage.jpg`),
          collageBuffer
        );
      } catch {
        // Ignore write error
      }
    }

    validPhotos.forEach((p, idx) => {
      const buf = dataUrlToBuffer(p.dataUrl);
      if (buf) {
        try {
          fs.writeFileSync(
            path.join(
              BOOKINGS_MEDIA_DIR,
              `${safeBookingRef}-photo-${idx + 1}.jpg`
            ),
            buf
          );
        } catch {
          // Ignore write error
        }
      }
    });

    // Save metadata JSON for OpenGraph tags
    try {
      fs.writeFileSync(
        path.join(BOOKINGS_MEDIA_DIR, `${safeBookingRef}-meta.json`),
        JSON.stringify({
          bookingRef: safeBookingRef,
          serviceType: serviceType || 'Retrofitting',
          customerName: customerName || '',
          contactNumber: contactNumber || '',
          address: address || '',
          description: description || '',
          photoCount: validPhotos.length,
        }),
        'utf8'
      );
    } catch {
      // Ignore write error
    }

    const photoListBullets = validPhotos
      .map((p, i) => `${i + 1}. ${p.title || `Photo ${i + 1}`}`)
      .join('\n');

    const caption =
      `*NEW ${String(serviceType || 'RETROFITTING').toUpperCase()} REQUEST — SZGH PAKISTAN*\n` +
      `----------------------------------\n` +
      `*Booking Ref:* ${safeBookingRef}\n` +
      `*Service Type:* ${
        serviceType === 'Maintenance'
          ? 'Machine Maintenance & Repair'
          : 'CNC Machine Retrofitting'
      }\n` +
      `*Customer Name:* ${customerName || 'N/A'}\n` +
      `*Contact No:* ${contactNumber || 'N/A'}\n` +
      `*Factory Address:* ${address || 'N/A'}\n` +
      `*Machine Description:* ${description || 'See attached machine photos'}\n\n` +
      `*Attached Machine Photos (${validPhotos.length}):*\n${photoListBullets}`;

    const modeToUse: WhatsAppDeliveryMode =
      requestedMode === 'collage_only' ||
      requestedMode === 'separate_only' ||
      requestedMode === 'collage_and_separate'
        ? requestedMode
        : waConfig.deliveryMode;

    const targetDigits = (waConfig.targetPhone || '923214800265').replace(
      /\D/g,
      ''
    );
    const targetJid = `${targetDigits}@s.whatsapp.net`;

    let sentDirectlyByServer = false;

    // A. Try sending directly via connected Baileys WhatsApp socket
    if (waSocket && waStatus === 'connected') {
      try {
        // Send Collage Image with full booking details caption
        if (
          (modeToUse === 'collage_only' ||
            modeToUse === 'collage_and_separate') &&
          collageBuffer
        ) {
          await waSocket.sendMessage(targetJid, {
            image: collageBuffer,
            caption,
          });
          sentDirectlyByServer = true;
        }

        // Send all photos separately
        if (
          modeToUse === 'separate_only' ||
          modeToUse === 'collage_and_separate'
        ) {
          for (let i = 0; i < validPhotos.length; i++) {
            const p = validPhotos[i];
            const buf = dataUrlToBuffer(p.dataUrl);
            if (!buf) continue;

            const itemCaption =
              modeToUse === 'separate_only' && i === 0
                ? `${caption}\n\n📸 *${p.title}* (${i + 1}/${validPhotos.length})`
                : `📸 *${p.title}* (${i + 1}/${validPhotos.length}) — Ref: ${safeBookingRef}`;

            await waSocket.sendMessage(targetJid, {
              image: buf,
              caption: itemCaption,
            });
            sentDirectlyByServer = true;
          }
        }
      } catch (err) {
        console.error('Baileys direct send error:', err);
      }
    }

    // B. If not sent via Baileys, try UltraMsg gateway if configured
    if (!sentDirectlyByServer) {
      sentDirectlyByServer = await sendDirectViaUltraMsg({
        targetPhone: targetDigits,
        caption,
        collageDataUrl,
        photos: validPhotos,
        deliveryMode: modeToUse,
      });
    }

    res.json({
      ok: true,
      bookingRef: safeBookingRef,
      sentDirectlyByServer,
      collageUrl: `/api/booking-collage/${safeBookingRef}.jpg`,
      photoUrls: validPhotos.map(
        (_, idx) => `/api/booking-photo/${safeBookingRef}/${idx + 1}.jpg`
      ),
    });
  });

  // Helper to inject OpenGraph image tags when a booking URL is previewed by WhatsApp
  const injectBookingOgTags = (html: string, req: express.Request): string => {
    const bkId = String(req.query.booking || '').replace(/[^a-zA-Z0-9_-]/g, '');
    if (!bkId) return html;

    const metaPath = path.join(BOOKINGS_MEDIA_DIR, `${bkId}-meta.json`);
    if (!fs.existsSync(metaPath)) return html;

    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      const proto =
        (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
      const host = req.headers['x-forwarded-host'] || req.headers.host || '';
      const origin = `${proto}://${host}`;
      const collageFullUrl = `${origin}/api/booking-collage/${bkId}.jpg`;

      const ogTags = `
    <meta property="og:title" content="SZGH ${meta.serviceType} Request (${meta.bookingRef}) — ${meta.customerName}" />
    <meta property="og:description" content="Phone: ${meta.contactNumber} | Address: ${meta.address} | ${meta.photoCount} Machine Photos Attached" />
    <meta property="og:image" content="${collageFullUrl}" />
    <meta property="og:image:secure_url" content="${collageFullUrl}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="900" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${collageFullUrl}" />`;

      return html.replace('</head>', `${ogTags}\n  </head>`);
    } catch {
      return html;
    }
  };

  const isProd =
    process.env.NODE_ENV === 'production' ||
    (!process.env.VITE_DEV_SERVER &&
      fs.existsSync(path.resolve(__dirname, 'dist', 'index.html')) &&
      process.env.USE_PROD_DIST === 'true');

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(
          path.resolve(__dirname, 'index.html'),
          'utf-8'
        );
        template = await vite.transformIndexHtml(url, template);
        template = injectBookingOgTags(template, req);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(
      '/assets',
      express.static(path.join(distPath, 'assets'), {
        maxAge: '30d',
        immutable: true,
      })
    );
    app.use(express.static(distPath, { index: false }));

    app.get('*', (req, res) => {
      const indexFile = path.join(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        let html = fs.readFileSync(indexFile, 'utf8');
        html = injectBookingOgTags(html, req);
        res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
      } else {
        res.status(404).send('Not found');
      }
    });
  }

  const PORT = Number(process.env.PORT || 3000);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SZGH Pakistan server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
