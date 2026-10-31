/**
 * ============================================================================
 * SZGH PAKISTAN (BY KH ENTERPRISES PVT LTD) — PRODUCT & CONTENT DATABASE
 * ============================================================================
 *
 * Supports the 4 core Hero Picture Categories:
 * 1. 'Controllers' — CNC Lathe, Milling & Multi-Axis Controllers (Includes I/O Board Selector)
 * 2. 'Motors'      — AC Servo Motors, Digital Servo Drives & Spindle Servo Motors
 * 3. 'Machines'    — Complete CNC Turning Centers & Vertical Machining Centers (VMCs)
 * 4. 'Robots'      — 6-Axis Industrial Welding, Handling, Grinding & Spraying Robots
 */

export type ProductCategory = 'Controllers' | 'Motors' | 'Machines' | 'Robots';

export interface IOBoardOption {
  id: string;
  label: string;
  shortLabel: string;
  priceDelta: number; // Additional PKR price when selected
}

export const CONTROLLER_IO_BOARD_OPTIONS: IOBoardOption[] = [
  {
    id: 'without-io',
    label: 'Without I/O',
    shortLabel: 'Without I/O',
    priceDelta: 0,
  },
  {
    id: 'with-io',
    label: 'With I/O (+PKR 20,000)',
    shortLabel: 'With I/O',
    priceDelta: 20000,
  },
];

export interface ProductSpec {
  label: string;
  value: string;
}

export interface AxisVariantOption {
  id: string;
  axisLabel: string; // e.g., '2-Axis', '3-Axis', '4-Axis', '5-Axis'
  axisCount: number; // e.g., 2, 3, 4, 5
  modelNumber: string; // Specific model number for this axis option
  title: string;
  description: string;
  price: number;
  stockCount: number;
  stockStatus?: 'In Stock' | 'Low Stock' | 'Pre-Order';
  images?: [string, string, string, string];
  defaultImageIndex?: number;
}

export interface ProductItem {
  id: string;
  title: string;
  modelNumber: string;
  baseModelNumber?: string;
  axisVariants?: AxisVariantOption[];
  category: ProductCategory;
  subcategory: string;
  description: string;
  features: string[];
  price: number; // Base price in PKR
  usdEstimate: number;
  inStock: boolean;
  stockCount: number;
  stockStatus?: 'In Stock' | 'Low Stock' | 'Pre-Order';
  defaultImageIndex?: number; // 0..3 index of the highlighted default image
  warranty: string; // Standard 1 Year Warranty Note
  hasIOBoardOption?: boolean; // True ONLY for Controllers
  images: [string, string, string, string];
  imageLabels: [string, string, string, string];
  specs: ProductSpec[];
  compatibility: string[];
}

export const HERO_SHOWCASE_PHOTOS = {
  controllers: '/assets/aistudio/Screenshot_2026-10-27_031942_212a47cf.png',
  motors: '/assets/aistudio/Screenshot_2026-10-27_031831_c857e8e6.png',
  machines: '/assets/aistudio/Screenshot_2026-10-27_032001_2db549f8.png',
  robots: '/assets/aistudio/Screenshot_2026-10-27_031846_9193b16f.png',
};

export interface CategoryMeta {
  id: ProductCategory;
  number: string;
  title: string;
  shortSubtitle: string;
  bannerDescription: string;
  image: string;
}

export const HERO_CATEGORIES: CategoryMeta[] = [
  {
    id: 'Controllers',
    number: '01',
    title: 'CNC Controllers',
    shortSubtitle: 'Lathe, Milling & 5-Axis Systems',
    bannerDescription:
      'Industrial 2-to-5 axis CNC turning and milling controllers with optional PLC I/O expansion boards and MPG handwheels.',
    image: HERO_SHOWCASE_PHOTOS.controllers,
  },
  {
    id: 'Motors',
    number: '02',
    title: 'Servo Motors & Drives',
    shortSubtitle: 'AC Servo Kits & Spindle Drives',
    bannerDescription:
      'High-torque AC servo motors paired with digital servo amplifiers and closed-loop CNC spindle motors.',
    image: HERO_SHOWCASE_PHOTOS.motors,
  },
  {
    id: 'Machines',
    number: '03',
    title: 'CNC Machine Tools',
    shortSubtitle: 'Turning Centers & VMC Mills',
    bannerDescription:
      'Turnkey slant-bed CNC turning machines, vertical machining centers (VMCs), and complete retrofitted machine tools.',
    image: HERO_SHOWCASE_PHOTOS.machines,
  },
  {
    id: 'Robots',
    number: '04',
    title: 'Industrial Robots',
    shortSubtitle: '6-Axis Welding & Handling',
    bannerDescription:
      'Articulated 6-DOF industrial robots for MIG/TIG welding, CNC machine tending, pick-and-place, and spray coating.',
    image: HERO_SHOWCASE_PHOTOS.robots,
  },
];

function createIndustrialProductGallery(
  model: string,
  category: ProductCategory,
  accentHex: string,
  dims: string,
  powerSpec: string
): [string, string, string, string] {
  const encodeSvg = (svg: string) =>
    `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;

  const view1 = encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <rect width="800" height="600" fill="#0f172a"/>
      <text x="40" y="48" fill="#94a3b8" font-family="monospace" font-size="14">SZGH PAKISTAN // ${category.toUpperCase()}</text>
      <text x="760" y="48" fill="${accentHex}" font-family="monospace" font-size="14" text-anchor="end" font-weight="bold">${model}</text>
    </svg>
  `);

  // View 2: CAD Dimensional Blueprint & Mounting Cutout
  const view2 = encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <rect width="800" height="600" fill="#07192f"/>
      <g stroke="#0e3a66" stroke-width="1">
        <line x1="0" y1="60" x2="800" y2="60"/><line x1="0" y1="120" x2="800" y2="120"/>
        <line x1="0" y1="180" x2="800" y2="180"/><line x1="0" y1="240" x2="800" y2="240"/>
        <line x1="0" y1="300" x2="800" y2="300"/><line x1="0" y1="360" x2="800" y2="360"/>
        <line x1="0" y1="420" x2="800" y2="420"/><line x1="0" y1="480" x2="800" y2="480"/>
        <line x1="0" y1="540" x2="800" y2="540"/>
        <line x1="80" y1="0" x2="80" y2="600"/><line x1="160" y1="0" x2="160" y2="600"/>
        <line x1="240" y1="0" x2="240" y2="600"/><line x1="320" y1="0" x2="320" y2="600"/>
        <line x1="400" y1="0" x2="400" y2="600"/><line x1="480" y1="0" x2="480" y2="600"/>
        <line x1="560" y1="0" x2="560" y2="600"/><line x1="640" y1="0" x2="640" y2="600"/>
        <line x1="720" y1="0" x2="720" y2="600"/>
      </g>
      <rect x="30" y="30" width="740" height="540" fill="none" stroke="#38bdf8" stroke-width="2"/>
      <text x="55" y="65" fill="#38bdf8" font-family="monospace" font-size="15" font-weight="bold">CAD DIMENSIONAL DRAWING // ${model}</text>
      <text x="745" y="65" fill="#7dd3fc" font-family="monospace" font-size="13" text-anchor="end">SCALE: 1:2 (MM) // TOLERANCE ±0.05MM</text>
      <rect x="130" y="150" width="320" height="260" fill="none" stroke="#e0f2fe" stroke-width="2"/>
      <rect x="148" y="168" width="284" height="224" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="6,4"/>
      <line x1="130" y1="120" x2="450" y2="120" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="290" y="112" fill="#38bdf8" font-family="monospace" font-size="14" text-anchor="middle">${dims}</text>
      <rect x="520" y="150" width="130" height="260" fill="none" stroke="#e0f2fe" stroke-width="2"/>
      <text x="585" y="112" fill="#38bdf8" font-family="monospace" font-size="14" text-anchor="middle">DEPTH PROFILE</text>
      <text x="290" y="285" fill="#bae6fd" font-family="monospace" font-size="14" text-anchor="middle">PANEL CUTOUT &amp; FLANGE</text>
      <rect x="460" y="465" width="295" height="90" fill="#041020" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="475" y="492" fill="#38bdf8" font-family="monospace" font-size="12">DRAWN BY: KH ENTERPRISES ENG.</text>
      <text x="475" y="516" fill="#e0f2fe" font-family="monospace" font-size="13" font-weight="bold">PART: ${model}</text>
      <text x="475" y="540" fill="#7dd3fc" font-family="monospace" font-size="12">WARRANTY: 1 YEAR OFFICIAL</text>
    </svg>
  `);

  // View 3: Rear I/O Interface & Servo Wiring Architecture
  const view3 = encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <rect width="800" height="600" fill="#090d16"/>
      <text x="45" y="52" fill="#22c55e" font-family="monospace" font-size="15" font-weight="bold">REAR I/O BUS &amp; SERVO INTERCONNECT TOPOLOGY // ${model}</text>
      <rect x="80" y="90" width="640" height="420" rx="8" fill="#111827" stroke="#374151" stroke-width="2"/>
      <g transform="translate(120, 130)">
        <rect x="0" y="0" width="160" height="70" rx="4" fill="#1f2937" stroke="#22c55e" stroke-width="2"/>
        <text x="80" y="30" fill="#f8fafc" font-family="monospace" font-size="13" text-anchor="middle" font-weight="bold">CN1: X/Y/Z/A AXIS</text>
        <text x="80" y="52" fill="#86efac" font-family="monospace" font-size="11" text-anchor="middle">DIFFERENTIAL PULSE / DIR</text>
        <rect x="200" y="0" width="160" height="70" rx="4" fill="#1f2937" stroke="#38bdf8" stroke-width="2"/>
        <text x="280" y="30" fill="#f8fafc" font-family="monospace" font-size="13" text-anchor="middle" font-weight="bold">CN2: ENCODER FB</text>
        <text x="280" y="52" fill="#7dd3fc" font-family="monospace" font-size="11" text-anchor="middle">23-BIT ABSOLUTE / INC</text>
        <rect x="400" y="0" width="160" height="70" rx="4" fill="#1f2937" stroke="#f59e0b" stroke-width="2"/>
        <text x="480" y="30" fill="#f8fafc" font-family="monospace" font-size="13" text-anchor="middle" font-weight="bold">CN3: SPINDLE VFD</text>
        <text x="480" y="52" fill="#fde68a" font-family="monospace" font-size="11" text-anchor="middle">0-10V ANALOG + M-CODES</text>
      </g>
      <rect x="120" y="240" width="560" height="150" rx="4" fill="#030712" stroke="#4b5563" stroke-width="1.5"/>
      <text x="145" y="272" fill="#9ca3af" font-family="monospace" font-size="13">OPTICALLY ISOLATED 24VDC PLC I/O MATRIX (32 IN / 32 OUT)</text>
      <text x="145" y="362" fill="#38bdf8" font-family="monospace" font-size="12">ETHERCAT / MODBUS-RTU / RS485 / USB DNC HIGH-SPEED INTERFACE</text>
      <rect x="120" y="415" width="560" height="60" rx="4" fill="#1e293b" stroke="#64748b"/>
      <text x="145" y="450" fill="#f8fafc" font-family="monospace" font-size="14" font-weight="bold">POWER REQUIREMENT: ${powerSpec}   |   PE SHIELD GROUNDED</text>
    </svg>
  `);

  // View 4: Factory Cabinet & Retrofitting Installation Spec
  const view4 = encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <rect width="800" height="600" fill="#0f172a"/>
      <text x="45" y="52" fill="#f59e0b" font-family="monospace" font-size="15" font-weight="bold">COMPLETE ARCHITECTURE // SHOP FLOOR INTEGRATION</text>
      <rect x="50" y="140" width="200" height="310" rx="8" fill="#1e293b" stroke="${accentHex}" stroke-width="2.5"/>
      <text x="150" y="185" fill="#f8fafc" font-family="monospace" font-size="15" text-anchor="middle" font-weight="bold">PRIMARY UNIT</text>
      <text x="150" y="212" fill="#38bdf8" font-family="monospace" font-size="12" text-anchor="middle">${model}</text>
      <rect x="325" y="140" width="190" height="310" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
      <text x="420" y="185" fill="#f8fafc" font-family="monospace" font-size="15" text-anchor="middle" font-weight="bold">SERVO DRIVES</text>
      <text x="420" y="212" fill="#7dd3fc" font-family="monospace" font-size="12" text-anchor="middle">SZGH DIGITAL BUS</text>
      <rect x="580" y="140" width="170" height="310" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2.5"/>
      <text x="665" y="185" fill="#f8fafc" font-family="monospace" font-size="15" text-anchor="middle" font-weight="bold">MACHINE TOOL</text>
      <text x="665" y="212" fill="#86efac" font-family="monospace" font-size="12" text-anchor="middle">±0.002 MM PRECISION</text>
      <rect x="50" y="495" width="700" height="50" rx="4" fill="#020617" stroke="#334155"/>
      <text x="400" y="525" fill="#e2e8f0" font-family="monospace" font-size="13" text-anchor="middle">1 YEAR OFFICIAL WARRANTY BY SZGH PAKISTAN — KH ENTERPRISES (PVT) LTD</text>
    </svg>
  `);

  return [view1, view2, view3, view4];
}

export const PRODUCTS_DATABASE: ProductItem[] = [
  // ==========================================================================
  // CATEGORY 1: CNC CONTROLLERS (Supports I/O Board Selection)
  // ==========================================================================
  {
    id: 'prod-cnc-1000mdb',
    title: 'Universal CNC Milling & Machining Center Controller',
    modelNumber: 'SZGH-CNC1000MDb-5',
    category: 'Controllers',
    subcategory: 'CNC Milling Controller',
    description:
      'Industrial simultaneous interpolation CNC milling controller for VMCs, gantry mills, and precision mold making. Features 8.4" LCD, full ATC PLC support, and USB DNC.',
    features: [
      'Simultaneous linear, circular, and helical interpolation with RTCP look-ahead smoothing',
      'Built-in open PLC ladder supporting Umbrella, Linear, and Arm-Type Automatic Tool Changers (up to 32 tools)',
      'Supports pitch error compensation, backlash compensation, and cutter radius/length offset (G41/G42/G43)',
      'Compatible with optional SZGH-IO-2424 and SZGH-IO-3232 optically isolated relay terminal boards',
      'Front panel USB flash drive interface + RS232 DNC high-speed drip feeding for large mold CAD/CAM files',
    ],
    price: 265000,
    usdEstimate: 950,
    inStock: true,
    stockCount: 14,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [
      HERO_SHOWCASE_PHOTOS.controllers,
      ...createIndustrialProductGallery(
        'SZGH-CNC1000MDb-5',
        'Controllers',
        '#16a34a',
        '420 × 260 × 115 mm',
        '24VDC Isolated / Simultaneous Control'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Front Operator Panel',
      'CAD Panel Cutout',
      'Rear DB25 & PLC I/O',
      'VMC Retrofit Topology',
    ],
    specs: [
      { label: 'Controlled Axes', value: 'Multi-Axis Simultaneous + 2 Analog Spindles' },
      { label: 'Minimum Command Unit', value: '0.001 mm (1 Micron)' },
      { label: 'Rapid Traverse Limit', value: '60,000 mm/min' },
      { label: 'ATC Tool Magazine Support', value: 'Linear, Umbrella & Arm-Type (up to 32 Tools)' },
      { label: 'Communication Interface', value: 'USB Flash, RS232 DNC, EtherCAT / Pulse Option' },
      { label: 'Built-in PLC I/O', value: '32 Opto-Isolated Inputs / 32 Relay-Drive Outputs' },
    ],
    compatibility: ['Vertical Machining Centers (VMC)', 'Bed Mills', 'Engraving & Mold Centres'],
  },
  {
    id: 'prod-cnc-1000tdb',
    title: 'High-Precision CNC Lathe & Turning Center Controller',
    modelNumber: 'SZGH-CNC1000TDb-3',
    category: 'Controllers',
    subcategory: 'CNC Turning Controller',
    description:
      'Flagship CNC turning controller designed for slant-bed CNC lathes and live-tooling turning centers. Supports 4-to-12 station turrets, constant surface speed (G96), and rigid tapping.',
    features: [
      'Dedicated live-tooling control for complex turning and milling operations',
      'Supports multi-start metric/inch/taper threading, rigid tapping, and constant surface speed (G96)',
      'Pre-programmed PLC logic for 4 to 12 station electric and hydraulic turrets plus hydraulic chuck/tailstock',
      'Compatible with optional plug-and-play SZGH I/O Relay Expansion Boards and external MPG handwheels',
      'High-contrast 8.4" color TFT display with real-time 2D toolpath simulation and alarm diagnostics',
    ],
    price: 228000,
    usdEstimate: 820,
    inStock: true,
    stockCount: 19,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [
      HERO_SHOWCASE_PHOTOS.controllers,
      ...createIndustrialProductGallery(
        'SZGH-CNC1000TDb-3',
        'Controllers',
        '#2563eb',
        '400 × 245 × 110 mm',
        '24VDC / Live-Tooling Turning'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Front Turning Console',
      'Mounting Blueprint',
      'Turret & Spindle I/O',
      'Slant-Bed Lathe Wiring',
    ],
    specs: [
      { label: 'Controlled Axes', value: 'Turning & Live-Tooling + Dual Spindle Control' },
      { label: 'Thread Cutting Capability', value: 'Metric, Inch, Modular, Taper & Multi-Start' },
      { label: 'Turret Compatibility', value: '4–12 Station Electric / Hydraulic + Gang Tool' },
      { label: 'Feedback Mode', value: 'Differential Pulse + 23-Bit Absolute Encoder' },
      { label: 'Display Screen', value: '8.4" Industrial Color TFT LCD (800×600)' },
      { label: 'Memory Capacity', value: '128MB Internal Non-Volatile Flash + USB' },
    ],
    compatibility: ['Slant-Bed CNC Lathes', 'Turn-Mill Centers', 'Conventional Lathe Retrofits'],
  },
  {
    id: 'prod-cnc-990tdb',
    title: 'Economical CNC Lathe Controller for Standard Turning',
    modelNumber: 'SZGH-CNC990TDb-2',
    category: 'Controllers',
    subcategory: 'CNC Turning Controller',
    description:
      'Cost-effective CNC lathe controller ideal for upgrading conventional lathes and flat-bed production turning machines. Features 8" color LCD and USB program transfer.',
    features: [
      'High-speed interpolation with 0.001mm command resolution',
      'Direct support for 4-station to 8-station electric tool posts and gang tooling',
      'Built-in canned cycles for outer/inner turning, grooving, peck drilling, and single/multi-pass threading',
      'Optional external I/O terminal board for rapid cabinet wiring and relay protection',
    ],
    price: 165000,
    usdEstimate: 590,
    inStock: true,
    stockCount: 24,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [
      HERO_SHOWCASE_PHOTOS.controllers,
      ...createIndustrialProductGallery(
        'SZGH-CNC990TDb-2',
        'Controllers',
        '#0284c7',
        '380 × 240 × 110 mm',
        '24VDC / Standard Turning'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Front Operator Panel',
      'CAD Panel Cutout',
      'Rear DB25 & PLC I/O',
      'Lathe Retrofit Topology',
    ],
    specs: [
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Rapid Traverse Limit', value: '60,000 mm/min' },
      { label: 'Display Screen', value: '8.0" Color LCD (800×600)' },
      { label: 'I/O Interface', value: '24 Inputs / 24 Outputs Opto-Isolated' },
    ],
    compatibility: ['Flat-Bed CNC Lathes', 'Conventional Lathe Conversions', 'Auto-Feeder Turning Machines'],
  },
  {
    id: 'prod-cnc-880tc-2',
    title: 'Industrial CNC Lathe & Turning Controller (880TC Series)',
    modelNumber: 'SZGH-880TC-2',
    category: 'Controllers',
    subcategory: 'CNC Turning Controller',
    description:
      'High-stability SZGH-880TC CNC lathe controller with 8.4" color LCD, macro programming, electric/hydraulic turret control, and USB DNC interface.',
    features: [
      'Unified SZGH-880TC hardware platform with selectable axes configurations',
      'Built-in PLC logic for 4–12 station turrets, hydraulic chucks, and tailstocks',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 175000,
    usdEstimate: 630,
    inStock: true,
    stockCount: 16,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [
      HERO_SHOWCASE_PHOTOS.controllers,
      ...createIndustrialProductGallery(
        'SZGH-880TC',
        'Controllers',
        '#0284c7',
        '400 × 245 × 110 mm',
        '24VDC / Industrial Turning'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Front Operator Panel',
      'CAD Panel Cutout',
      'Rear DB25 & PLC I/O',
      'Lathe Retrofit Topology',
    ],
    specs: [
      { label: 'Model Series', value: 'SZGH-880TC' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Display Screen', value: '8.4" Color TFT LCD' },
    ],
    compatibility: ['CNC Turning Centers', 'Slant-Bed & Flat-Bed Lathes'],
  },
  {
    id: 'prod-cnc-880tc-3',
    title: 'Industrial CNC Lathe & Milling-Turn Controller (880TC Series)',
    modelNumber: 'SZGH-880TC-3',
    category: 'Controllers',
    subcategory: 'CNC Turning Controller',
    description:
      'SZGH-880TC CNC turning & live-tooling controller supporting spindle indexing, rigid tapping, and multi-station ATC turrets.',
    features: [
      'Simultaneous interpolation for turn-mill machining',
      'Built-in PLC logic for 4–12 station turrets, hydraulic chucks, and tailstocks',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 198000,
    usdEstimate: 712,
    inStock: true,
    stockCount: 12,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [
      HERO_SHOWCASE_PHOTOS.controllers,
      ...createIndustrialProductGallery(
        'SZGH-880TC-3',
        'Controllers',
        '#0284c7',
        '400 × 245 × 110 mm',
        '24VDC / Turn-Mill Control'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Front Operator Panel',
      'CAD Panel Cutout',
      'Rear DB25 & PLC I/O',
      'Lathe Retrofit Topology',
    ],
    specs: [
      { label: 'Minimum Command Unit', value: '0.001 mm' },
    ],
    compatibility: ['Turn-Mill Lathes', 'Turning Centers'],
  },
  {
    id: 'prod-cnc-880tc-4',
    title: 'Industrial CNC Turning & Dual-Slide Controller (880TC Series)',
    modelNumber: 'SZGH-880TC-4',
    category: 'Controllers',
    subcategory: 'CNC Turning Controller',
    description:
      'SZGH-880TC CNC turning controller for complex turn-mill centers, off-center drilling/milling, and dual-spindle lathes.',
    features: [
      'Full simultaneous control with dual analog spindle outputs',
      'Built-in PLC logic for live-tooling turrets and sub-spindle synchronization',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 225000,
    usdEstimate: 810,
    inStock: true,
    stockCount: 9,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [
      HERO_SHOWCASE_PHOTOS.controllers,
      ...createIndustrialProductGallery(
        'SZGH-880TC-4',
        'Controllers',
        '#0284c7',
        '400 × 245 × 110 mm',
        '24VDC / Turn-Mill Control'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Front Operator Panel',
      'CAD Panel Cutout',
      'Rear DB25 & PLC I/O',
      'Lathe Retrofit Topology',
    ],
    specs: [
      { label: 'Minimum Command Unit', value: '0.001 mm' },
    ],
    compatibility: ['Turn-Mill Centers', 'Production Lathes'],
  },
  {
    id: 'prod-cnc-1000mdb-3',
    title: 'Universal CNC Milling & VMC Controller',
    modelNumber: 'SZGH-CNC1000MDb-3',
    category: 'Controllers',
    subcategory: 'CNC Milling Controller',
    description:
      'Industrial simultaneous CNC milling controller for Vertical Machining Centers (VMCs), bed mills, and precision engraving machines.',
    features: [
      'High-speed interpolation with look-ahead smoothing',
      'Built-in open PLC ladder for Umbrella and Arm-Type Automatic Tool Changers',
    ],
    price: 215000,
    usdEstimate: 775,
    inStock: true,
    stockCount: 18,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [
      HERO_SHOWCASE_PHOTOS.controllers,
      ...createIndustrialProductGallery(
        'SZGH-CNC1000MDb-3',
        'Controllers',
        '#16a34a',
        '420 × 260 × 115 mm',
        '24VDC Isolated / VMC Control'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Front Operator Panel',
      'CAD Panel Cutout',
      'Rear DB25 & PLC I/O',
      'VMC Retrofit Topology',
    ],
    specs: [{ label: 'Minimum Command Unit', value: '0.001 mm' }],
    compatibility: ['Vertical Machining Centers (VMC)', 'CNC Bed Mills'],
  },
  {
    id: 'prod-cnc-1000mdb-4',
    title: 'Universal CNC Milling & Rotary Indexing Controller',
    modelNumber: 'SZGH-CNC1000MDb-4',
    category: 'Controllers',
    subcategory: 'CNC Milling Controller',
    description:
      'Industrial simultaneous CNC milling controller for VMCs with rotary indexing tables and cylindrical engraving.',
    features: [
      'Simultaneous interpolation for rotary table machining',
      'Built-in open PLC ladder for Umbrella and Arm-Type Automatic Tool Changers',
    ],
    price: 240000,
    usdEstimate: 865,
    inStock: true,
    stockCount: 11,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [
      HERO_SHOWCASE_PHOTOS.controllers,
      ...createIndustrialProductGallery(
        'SZGH-CNC1000MDb-4',
        'Controllers',
        '#16a34a',
        '420 × 260 × 115 mm',
        '24VDC Isolated / VMC Control'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Front Operator Panel',
      'CAD Panel Cutout',
      'Rear DB25 & PLC I/O',
      'VMC Retrofit Topology',
    ],
    specs: [{ label: 'Minimum Command Unit', value: '0.001 mm' }],
    compatibility: ['VMCs', 'Rotary Table Milling Machines'],
  },
  {
    id: 'prod-cnc-1000tdb-2',
    title: 'High-Precision CNC Lathe & Turning Center Controller',
    modelNumber: 'SZGH-CNC1000TDb-2',
    category: 'Controllers',
    subcategory: 'CNC Turning Controller',
    description:
      'SZGH-CNC1000TDb turning controller for slant-bed CNC lathes with 8.4" LCD, constant surface speed (G96), and 4–12 station turret control.',
    features: [
      'Precision turning with 0.001mm resolution and G96 constant surface speed',
      'Pre-programmed PLC logic for electric and hydraulic turrets',
    ],
    price: 205000,
    usdEstimate: 737,
    inStock: true,
    stockCount: 22,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [
      HERO_SHOWCASE_PHOTOS.controllers,
      ...createIndustrialProductGallery(
        'SZGH-CNC1000TDb-2',
        'Controllers',
        '#2563eb',
        '400 × 245 × 110 mm',
        '24VDC / Slant-Bed Turning'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Front Turning Console',
      'Mounting Blueprint',
      'Turret & Spindle I/O',
      'Slant-Bed Lathe Wiring',
    ],
    specs: [{ label: 'Minimum Command Unit', value: '0.001 mm' }],
    compatibility: ['Slant-Bed CNC Lathes', 'Production Turning Centers'],
  },
  {
    id: 'prod-cnc-1000tdb-4',
    title: 'High-Precision CNC Turn-Mill Lathe Controller',
    modelNumber: 'SZGH-CNC1000TDb-4',
    category: 'Controllers',
    subcategory: 'CNC Turning Controller',
    description:
      'SZGH-CNC1000TDb turning controller for multi-tasking turn-mill centers with off-center milling and live tooling.',
    features: [
      'Simultaneous control for complex turn-mill centers',
      'Dual analog spindle outputs + full turret & live-tool PLC integration',
    ],
    price: 252000,
    usdEstimate: 906,
    inStock: true,
    stockCount: 8,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [
      HERO_SHOWCASE_PHOTOS.controllers,
      ...createIndustrialProductGallery(
        'SZGH-CNC1000TDb-4',
        'Controllers',
        '#2563eb',
        '400 × 245 × 110 mm',
        '24VDC / Turn-Mill Control'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Front Turning Console',
      'Mounting Blueprint',
      'Turret & Spindle I/O',
      'Slant-Bed Lathe Wiring',
    ],
    specs: [{ label: 'Minimum Command Unit', value: '0.001 mm' }],
    compatibility: ['Turn-Mill Centers', 'Multi-Tasking CNC Lathes'],
  },
  {
    id: 'prod-cnc-990tdb-3',
    title: 'Economical CNC Lathe & Turning Controller',
    modelNumber: 'SZGH-CNC990TDb-3',
    category: 'Controllers',
    subcategory: 'CNC Turning Controller',
    description:
      'Cost-effective CNC lathe controller for turning machines with spindle indexing and side/axial live milling.',
    features: [
      'High-speed interpolation with 0.001mm resolution',
      'Direct support for 4-to-8 station electric tool posts and live spindles',
    ],
    price: 185000,
    usdEstimate: 665,
    inStock: true,
    stockCount: 15,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [
      HERO_SHOWCASE_PHOTOS.controllers,
      ...createIndustrialProductGallery(
        'SZGH-CNC990TDb-3',
        'Controllers',
        '#0284c7',
        '380 × 240 × 110 mm',
        '24VDC / Live-Milling Lathe'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Front Operator Panel',
      'CAD Panel Cutout',
      'Rear DB25 & PLC I/O',
      'Lathe Retrofit Topology',
    ],
    specs: [{ label: 'Minimum Command Unit', value: '0.001 mm' }],
    compatibility: ['CNC Lathes', 'Conventional Lathe Conversions'],
  },
  {
    id: 'prod-cnc-990tdb-4',
    title: 'Economical CNC Lathe & Milling Controller',
    modelNumber: 'SZGH-CNC990TDb-4',
    category: 'Controllers',
    subcategory: 'CNC Turning Controller',
    description:
      'Economical CNC lathe controller for turning, drilling, and milling retrofits.',
    features: [
      'Precision control in a compact 8.0" LCD operator console',
      'Supports electric turrets, gang tooling, and external I/O relay boards',
    ],
    price: 205000,
    usdEstimate: 737,
    inStock: true,
    stockCount: 10,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [
      HERO_SHOWCASE_PHOTOS.controllers,
      ...createIndustrialProductGallery(
        'SZGH-CNC990TDb-4',
        'Controllers',
        '#0284c7',
        '380 × 240 × 110 mm',
        '24VDC / Turn-Mill Retrofit'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Front Operator Panel',
      'CAD Panel Cutout',
      'Rear DB25 & PLC I/O',
      'Lathe Retrofit Topology',
    ],
    specs: [{ label: 'Minimum Command Unit', value: '0.001 mm' }],
    compatibility: ['CNC Lathes', 'Multi-Tool Turning Machines'],
  },

  // ==========================================================================
  // CATEGORY 2: SERVO MOTORS & DRIVES
  // ==========================================================================
  {
    id: 'prod-servo-13200cc',
    title: '2.0kW High-Torque AC Servo Motor & Matched Digital Drive Kit',
    modelNumber: 'SZGH-13200CC + SD2026',
    category: 'Motors',
    subcategory: 'AC Servo Motor & Drive Set',
    description:
      'Complete 130mm flange 2.0kW industrial AC servo motor paired with the SZGH-SD2026 digital servo amplifier and 5m shielded power & encoder cables.',
    features: [
      '9.55 N·m continuous rated torque with 300% (28.6 N·m) peak overload capacity for heavy cutting feeds',
      'High-resolution 2500-PPR incremental or 23-bit absolute optical encoder feedback',
      'IP65 sealed motor housing with high-coercivity NdFeB permanent magnet rotor',
      'Supplied as a complete plug-and-play kit: Motor + SD2026 Drive + 5m Power Cable + 5m Encoder Cable',
    ],
    price: 135000,
    usdEstimate: 485,
    inStock: true,
    stockCount: 32,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: false,
    images: [
      HERO_SHOWCASE_PHOTOS.motors,
      ...createIndustrialProductGallery(
        'SZGH-13200CC + SD2026',
        'Motors',
        '#0284c7',
        '130 × 130 mm Flange / 22mm Shaft',
        '2.0 kW / 9.55 N·m Rated / 2000 RPM'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Servo Motor & Drive Kit',
      '130mm NEMA Flange CAD',
      'CN1/CN2 Drive Pinout',
      'Ballscrew Direct-Coupling',
    ],
    specs: [
      { label: 'Rated Output Power', value: '2.0 kW (2000W Continuous)' },
      { label: 'Rated / Peak Torque', value: '9.55 N·m Continuous / 28.6 N·m Peak (300%)' },
      { label: 'Rated / Max Speed', value: '2000 RPM / 3000 RPM' },
      { label: 'Flange Frame Size', value: '130 × 130 mm (Shaft Dia: 22mm with Keyway)' },
      { label: 'Supply Voltage', value: '3-Phase / Single-Phase 220VAC 50/60Hz' },
      { label: 'Included Accessories', value: 'SD2026 Drive + 5m Power Cable + 5m Encoder Cable' },
    ],
    compatibility: ['Ballscrew Feed Axes', 'Heavy Duty Gantry Routers', 'Automated Indexing Tables'],
  },
  {
    id: 'prod-spindle-55kw',
    title: '5.5kW / 7.5kW Asynchronous Servo Spindle Motor & Vector Drive',
    modelNumber: 'SZGH-08-2-5.5/7.5KW',
    category: 'Motors',
    subcategory: 'CNC Spindle Servo System',
    description:
      'High-rigidity CNC spindle servo motor and closed-loop vector drive delivering constant high torque at low RPM and vibration-free 8,000 RPM finishing with spindle orientation.',
    features: [
      'Constant torque from 0 to 1,500 RPM for heavy steel roughing and constant power up to 8,000 RPM',
      'Precision ±0.01° spindle orientation for VMC Automatic Tool Changers (ATC) and live-tooling lathes',
      'Supports rigid tapping without floating tap holders when paired with SZGH CNC controllers',
      'Includes matched 3-phase 380VAC closed-loop vector drive and external dynamic braking resistor',
    ],
    price: 345000,
    usdEstimate: 1240,
    inStock: true,
    stockCount: 8,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: false,
    images: [
      HERO_SHOWCASE_PHOTOS.motors,
      ...createIndustrialProductGallery(
        'SZGH-08-2-5.5/7.5KW',
        'Motors',
        '#d97706',
        'Foot + Flange Dual Mount (B35)',
        '5.5kW Cont. / 7.5kW S2 / 8000 RPM'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Spindle Motor & Vector Drive',
      'B35 Mounting Footprint',
      'Braking Resistor & Encoder',
      'VMC Headstock Assembly',
    ],
    specs: [
      { label: 'Continuous / S2 Rating', value: '5.5 kW Continuous / 7.5 kW (30-Min Heavy Duty)' },
      { label: 'Rated Torque', value: '35.0 N·m Base Torque (1500–8000 RPM Range)' },
      { label: 'Orientation Precision', value: '±0.01° Spindle Positioning & Rigid Tapping' },
      { label: 'Power Input', value: '3-Phase 380VAC ±15% (Pakistan Industrial Grid Ready)' },
      { label: 'Cooling System', value: 'Forced Axial Blower Fan (220VAC Independent)' },
      { label: 'Protection Rating', value: 'IP55 Cast-Iron Ribbed Enclosure' },
    ],
    compatibility: ['BT40 / BT50 VMC Spindles', 'CNC Lathe Chuck Spindles', 'Deep-Hole Tapping Machines'],
  },

  // ==========================================================================
  // CATEGORY 3: CNC MACHINE TOOLS
  // ==========================================================================
  {
    id: 'prod-machine-szgh650',
    title: 'SZGH-650 High-Rigidity Vertical Machining Center (VMC)',
    modelNumber: 'SZGH-VMC650-PRO',
    category: 'Machines',
    subcategory: 'Vertical Machining Center',
    description:
      'Turnkey Vertical Machining Center equipped with SZGH-CNC1000MDb controller, BT40 8000-RPM spindle, 16-station disc ATC, and Taiwan HIWIN linear roller guides.',
    features: [
      'Meehanite HT300 resin-sand cast iron bed and column stress-relieved for zero thermal deformation',
      'Equipped with SZGH-CNC1000MDb controller and absolute AC servo motors',
      '650 × 400 × 500 mm travel envelope ideal for surgical dies, automotive molds, and precision brackets',
      '16-tool Taiwan Okada arm-type Automatic Tool Changer (ATC) with 1.8-second tool-to-tool index time',
      'Full flood coolant system, automatic central lubrication, and chip conveyor interface included',
    ],
    price: 7850000,
    usdEstimate: 28200,
    inStock: true,
    stockCount: 2,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: false,
    images: [
      HERO_SHOWCASE_PHOTOS.machines,
      ...createIndustrialProductGallery(
        'SZGH-VMC650-PRO',
        'Machines',
        '#16a34a',
        'Travel: 650 × 400 × 500 mm',
        'BT40 7.5kW Spindle / 16T ATC'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'SZGH CNC Machine Lineup',
      'Machine Footprint CAD',
      'Cabinet & Servo Drive Bay',
      'Shop-Floor Installation',
    ],
    specs: [
      { label: 'Table Travel', value: '650 × 400 × 500 mm' },
      { label: 'Worktable Size', value: '800 × 420 mm (Max Load: 500 kg)' },
      { label: 'Spindle Taper & Speed', value: 'BT40 / 8,000 RPM (7.5 kW Servo Spindle)' },
      { label: 'Tool Magazine', value: '16-Station Arm-Type ATC' },
      { label: 'Positioning Accuracy', value: '±0.005 mm / Repeatability ±0.003 mm' },
      { label: 'Total Machine Weight', value: '3,800 kg' },
    ],
    compatibility: ['Surgical Forging Dies', 'Automotive Mold Cavities', 'Aerospace & Defense Parts'],
  },
  {
    id: 'prod-machine-szgh46y',
    title: 'SZGH-46Y Slant-Bed CNC Turn-Mill Center with Live Tooling',
    modelNumber: 'SZGH-46Y-TURNMILL',
    category: 'Machines',
    subcategory: 'CNC Turning & Milling Machine',
    description:
      '45° heavy-duty slant-bed CNC turning center featuring a live-tooling BMT turret, hydraulic collet chuck, and SZGH-CNC1000TDb control.',
    features: [
      'Complete turning, off-center milling, cross-drilling, and rigid tapping in a single setup',
      '46mm bar-feeder spindle capacity with 8-inch hydraulic 3-jaw chuck option',
      '12-station BMT45 servo power turret with ±40mm vertical travel',
      'Delivered commissioned at your factory floor anywhere in Pakistan by KH Enterprises engineers',
    ],
    price: 6950000,
    usdEstimate: 24950,
    inStock: true,
    stockCount: 2,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: false,
    images: [
      HERO_SHOWCASE_PHOTOS.machines,
      ...createIndustrialProductGallery(
        'SZGH-46Y-TURNMILL',
        'Machines',
        '#2563eb',
        '46mm Bar Capacity / 45° Slant Bed',
        'Live Tool Turret'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'SZGH-46Y Turn-Mill Center',
      'Turning Envelope CAD',
      'BMT Live Turret Interface',
      'Bar-Feeder Integration',
    ],
    specs: [
      { label: 'Max Turning Diameter', value: '360 mm (Max Turning Length: 420 mm)' },
      { label: 'Spindle Bore / Bar Cap.', value: '56 mm Bore / 46 mm Through-Bar Capacity' },
      { label: 'Turret Configuration', value: '12-Station Servo Turret (6 Live Driven Stations)' },
      { label: 'Rapid Traverse', value: '24,000 / 30,000 mm/min' },
      { label: 'Machine Weight', value: '3,200 kg' },
    ],
    compatibility: ['Hydraulic Fittings & Valves', 'Automotive Shafts & Flanges', 'Medical Implant Turning'],
  },

  // ==========================================================================
  // CATEGORY 4: INDUSTRIAL ROBOTS
  // ==========================================================================
  {
    id: 'prod-robot-h1400',
    title: 'Industrial MIG/MAG & TIG Arc Welding Robot System',
    modelNumber: 'SZGH-H1400-B-6',
    category: 'Robots',
    subcategory: 'Robotic Welding Cell',
    description:
      'Turnkey articulated industrial welding robot with 1400mm reach and ±0.05mm repeatability. Includes teach pendant, control cabinet, anti-collision torch, and 350A pulse welder.',
    features: [
      '1400mm spherical reach with hollow-wrist torch routing for zero cable snagging inside fixtures',
      'Built-in linear, circular, and pendulum weave welding macros with arc voltage tracking',
      'Includes 350A digital synergic pulse MIG/MAG welding power source, wire feeder, and torch cleaner',
      'Ergonomic 8-inch color touch teach pendant with multi-program storage and safety deadman switch',
    ],
    price: 2450000,
    usdEstimate: 8800,
    inStock: true,
    stockCount: 4,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: false,
    images: [
      HERO_SHOWCASE_PHOTOS.robots,
      ...createIndustrialProductGallery(
        'SZGH-H1400-B-6',
        'Robots',
        '#16a34a',
        '1400 mm Reach / 6 kg Wrist Payload',
        '380VAC 3-Phase / ±0.05 mm Repeatability'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Industrial Robot & Teach Pendant',
      '1400mm Work Envelope CAD',
      'Welding Power Source Interface',
      'Dual-Station Welding Cell',
    ],
    specs: [
      { label: 'Maximum Working Reach', value: '1400 mm Spherical Envelope' },
      { label: 'Position Repeatability', value: '±0.05 mm' },
      { label: 'Wrist Payload', value: '6 kg (Supports Water-Cooled Torch & Wire Feeder)' },
      { label: 'Welding Functions', value: 'Linear/Circular Weave, Arc Tracking, Touch Sensing' },
      { label: 'Cabinet Power Input', value: '3-Phase 380VAC, 4.5 kVA Average Consumption' },
    ],
    compatibility: ['Automotive Chassis & Exhausts', 'Agricultural Tractor Implements', 'Steel Furniture & Transformers'],
  },
  {
    id: 'prod-robot-p1850',
    title: 'Heavy-Duty CNC Machine Tending & Material Handling Robot',
    modelNumber: 'SZGH-P1850-B-6 (20KG)',
    category: 'Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    description:
      'Long-reach 1850mm industrial handling robot with 20kg payload capacity, purpose-built for loading/unloading CNC lathes, VMCs, stamping presses, and palletizing.',
    features: [
      '20kg high-inertia wrist payload supports dual pneumatic grippers for simultaneous raw/finished part swap',
      'IP67 sealed wrist and forearm resistant to high-pressure CNC cutting coolant and metal swarf',
      'Direct PLC handshake integration with SZGH CNC Lathe & Milling controllers for unmanned lights-out production',
      'Floor, inverted wall, or linear track mounting options for tending up to 4 CNC machines',
    ],
    price: 2980000,
    usdEstimate: 10700,
    inStock: true,
    stockCount: 3,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: false,
    images: [
      HERO_SHOWCASE_PHOTOS.robots,
      ...createIndustrialProductGallery(
        'SZGH-P1850-B-6',
        'Robots',
        '#2563eb',
        '1850 mm Reach / 20 kg Payload',
        'IP67 Coolant-Proof Wrist / ±0.06 mm'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      '1850mm Handling Robot Lineup',
      'Reach & Payload Envelope',
      'Pneumatic Gripper & CNC Handshake',
      'Multi-Machine Tending Cell',
    ],
    specs: [
      { label: 'Rated Wrist Payload', value: '20 kg High-Inertia Capacity' },
      { label: 'Maximum Horizontal Reach', value: '1850 mm' },
      { label: 'Position Repeatability', value: '±0.06 mm' },
      { label: 'Wrist Ingress Protection', value: 'IP67 (Coolant & Cutting Emulsion Resistant)' },
      { label: 'Pneumatic & I/O Routing', value: 'Internal Double Solenoid Valve + 16 I/O Signals' },
      { label: 'Mounting Options', value: 'Floor, Inverted Ceiling, or Linear Rail' },
    ],
    compatibility: ['Automated CNC Lathe Loading', 'Forging & Stamping Press Lines', 'End-of-Line Palletizing'],
  },
];

export interface VideoPresentation {
  id: string;
  title: string;
  category: string;
  duration: string;
  machineModel: string;
  location: string;
  summary: string;
  keyTakeaways: string[];
  youtubeId?: string;
  videoUrl?: string;
  telemetryPreview: {
    cycleTimeReduction: string;
    positioningAccuracy: string;
    spindleLoad: string;
  };
}

export const VIDEOS_DATABASE: VideoPresentation[] = [
  {
    id: 'vid-01',
    title: 'Shenzhen Guanhong Technology SZGH 1080TC Product Introduction',
    category: 'CNC Controllers',
    duration: 'Official Video',
    machineModel: '1080 Series (SZGH-1080TC)',
    location: 'SZGH Factory',
    summary: 'SZGH 1080TC Product Introduction.',
    keyTakeaways: [
      'High-speed rigid accuracy',
      'ATC support',
    ],
    youtubeId: 'B2JRpCFk4IU',
    videoUrl: 'https://www.youtube.com/watch?v=B2JRpCFk4IU',
    telemetryPreview: {
      cycleTimeReduction: 'High-Speed Rigid',
      positioningAccuracy: '1080 Series',
      spindleLoad: 'Full ATC Support',
    },
  },
  {
    id: 'vid-02',
    title: 'Pre-Shipment Accuracy Inspection | SZGH-36J, SZGH-46Y & SZGH-T6 CNC Machine Testing',
    category: 'CNC Controllers',
    duration: 'Official Video',
    machineModel: 'SZGH-36J, SZGH-46Y, and SZGH-T6 CNC machine models',
    location: 'SZGH Factory',
    summary:
      'Before delivery, every SZGH CNC machine undergoes a professional pre-shipment accuracy inspection to ensure reliable performance, machining precision, and consistent quality.',
    keyTakeaways: [
      'Professional machine accuracy testing',
      'Pre-shipment quality inspection',
      'Key component and function checks',
      'Machining performance verification',
      'Every machine checked before delivery',
    ],
    youtubeId: 'SI_84ETzX5Q',
    videoUrl: 'https://www.youtube.com/watch?v=SI_84ETzX5Q',
    telemetryPreview: {
      cycleTimeReduction: '100% QC Inspected',
      positioningAccuracy: 'SZGH-36J / 46Y / T6',
      spindleLoad: 'Pre-Shipment Verified',
    },
  },
  {
    id: 'vid-03',
    title: 'Simultaneous Impeller & Surgical Die Milling on SZGH-CNC1000MDb',
    category: 'CNC Milling Demo',
    duration: '11:08',
    machineModel: 'SZGH-CNC1000MDb + 7.5kW Spindle',
    location: 'Sialkot Surgical & Precision Cluster',
    summary:
      'High-speed RTCP look-ahead contouring of 316L medical-grade stainless steel forging dies using a 24-tool arm-type ATC and high-speed sub-micron interpolation.',
    keyTakeaways: [
      'High-speed look-ahead buffer eliminates corner hesitation marks',
      'Rigid tapping at 3,000 RPM with ±0.01° spindle encoder synchronization',
      'Mirror-finish surface quality reducing manual die polishing time by 60%',
    ],
    telemetryPreview: {
      cycleTimeReduction: '-41% Polishing Time',
      positioningAccuracy: '0.001 mm Resolution',
      spindleLoad: '7,200 RPM Continuous',
    },
  },
];

export interface IndustrialApplication {
  id: string;
  industry: string;
  cityHub: string;
  headline: string;
  deployedHardware: string[];
  outcomeMetric: string;
  metricContext: string;
  description: string;
  clientQuote: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
}

export const APPLICATIONS_DATABASE: IndustrialApplication[] = [
  {
    id: 'app-automotive',
    industry: 'Automotive & Tractor OEM Components',
    cityHub: 'Lahore & Sheikhupura',
    headline: 'High-Volume Transmission Gear & Axle Shaft Turning Lines',
    deployedHardware: ['SZGH-CNC1000TDb', 'SZGH-13200CC Servo Kit', 'SZGH-P1850-B-6 Robot'],
    outcomeMetric: '+42% Shift Output',
    metricContext: 'Across 14 retrofitted slant-bed CNC lathes over 6 months',
    description:
      'Automotive tier-1 suppliers in Lahore rely on SZGH Pakistan to upgrade mechanically sound Japanese and Taiwanese lathes with modern controllers and automated robotic loading cells, eliminating imported spare-part delays.',
    clientQuote: {
      quote:
        'Before retrofitting with KH Enterprises, two of our Mori Seiki lathes sat idle for four months waiting on legacy amplifier boards. The SZGH-1000TDb upgrade returned both machines to production in four days with tighter repeatability than original spec.',
      author: 'Engr. Tariq Mahmood',
      role: 'Director of Production',
      company: 'Ravi Precision Auto Engineering (Lahore)',
    },
  },
  {
    id: 'app-surgical',
    industry: 'Surgical Instruments & Forging Dies',
    cityHub: 'Sialkot Export Zone',
    headline: 'CNC Milling for Medical Stainless Forging Dies',
    deployedHardware: ['SZGH-CNC1000MDb', 'SZGH-08-2-5.5/7.5KW Spindle'],
    outcomeMetric: '±0.002 mm Tolerance',
    metricContext: 'Verified on 316L stainless steel box-joint surgical cavities',
    description:
      'Sialkot surgical exporters require ultra-smooth high-speed milling trajectories to machine intricate forceps and orthopedic implant dies without tool chatter.',
    clientQuote: {
      quote:
        'The high-speed look-ahead contour control on the SZGH-CNC1000MDb cut our EDM and hand-polishing hours in half. Having local replacement stock and PLC engineers in Pakistan gives us total confidence.',
      author: 'Haji Usman Ghani',
      role: 'Managing Partner',
      company: 'Al-haramain MedTech Instruments (Sialkot)',
    },
  },
  {
    id: 'app-fabrication',
    industry: 'Heavy Steel Fabrication & Sanitary Valves',
    cityHub: 'Gujranwala & Karachi',
    headline: 'Automated Robotic Welding & Brass Valve Machining',
    deployedHardware: ['SZGH-H1400-B-6 Welding Robot', 'SZGH-CNC1000TDb'],
    outcomeMetric: '99.4% Weld Pass Rate',
    metricContext: 'Ultrasonic & pressure-tested transformer tanks and valve bodies',
    description:
      'Replacing inconsistent manual arc welding and cam-operated lathes with SZGH welding robots and turning controllers across Gujranwala and Korangi Industrial Area.',
    clientQuote: {
      quote:
        'Our single SZGH-H1400 welding cell now produces the same daily weld footage as three manual booths while cutting wire and shielding gas waste by 22%.',
      author: 'Kamran Siddiqui',
      role: 'Plant General Manager',
      company: 'Indus Metal & Power Fabricators (Karachi)',
    },
  },
];

export interface EngineeringService {
  id: string;
  indexNumber: string;
  title: string;
  subtitle: string;
  turnaroundTime: string;
  startingPricePKR: number;
  summary: string;
  deliverables: string[];
  supportedBrands: string[];
}

export const SERVICES_DATABASE: EngineeringService[] = [
  {
    id: 'srv-retrofit',
    indexNumber: '01',
    title: 'Complete CNC Machine Retrofitting & Control Modernization',
    subtitle: 'Turnkey Mechanical & Electrical Overhaul for Legacy Lathes, VMCs, and Boring Mills',
    turnaroundTime: '3 to 5 Working Days On-Site',
    startingPricePKR: 485000,
    summary:
      'Do not scrap mechanically rigid Japanese, European, or Taiwanese machine tools due to obsolete CRT screens, burnt servo amplifiers, or lost CMOS parameters. Our field engineering team strips outdated electronics and installs a brand-new SZGH CNC controller, matched AC servo motors, custom PLC ladder logic, and new DIN-standard wiring cabinet.',
    deliverables: [
      'Complete removal of obsolete CNC control, legacy drives, and brittle wiring harnesses',
      'Precision mechanical adapter plates & direct-drive couplings for new SZGH AC Servo Motors',
      'Custom PLC Ladder programming for hydraulic chucks, 4–24 station ATCs, tailstocks, and lubrication',
      'Laser/Dial-indicator ballscrew backlash & pitch-error compensation calibration',
      'Comprehensive operator & maintenance training with complete electrical schematics',
    ],
    supportedBrands: [
      'Fanuc Legacy (0M / 0T / 6M / 10T / 15M)',
      'Siemens Sinumerik (810D / 840C / 802D)',
      'Mitsubishi Meldas (M50 / M64 / E60)',
      'Heidenhain, Fagor, Mazak & Yasnac Controls',
    ],
  },
  {
    id: 'srv-maintenance',
    indexNumber: '02',
    title: 'Annual CNC Section Maintenance & Equipment Replacement Plan',
    subtitle: 'Full-Factory Annual Maintenance Contract (AMC) — Zero Technician Headache, Zero Downtime & Smooth Production',
    turnaroundTime: '365-Day Priority On-Site Coverage',
    startingPricePKR: 180000,
    summary:
      'We onboard and take complete responsibility for your company’s entire CNC machining section on an annual basis. Our engineering team performs all scheduled and emergency maintenance along with complete replacement of faulty equipment—eliminating the headache of finding technicians on time, removing machine downtime, and keeping your production running smoothly year-round.',
    deliverables: [
      'Removes the headache of searching for reliable CNC, servo, and PLC technicians during urgent production deadlines',
      'Includes complete replacement of faulty equipment (controllers, servo drives, motors, encoders, contactors, and wiring)',
      'Eliminates costly unplanned downtime with priority on-site engineer dispatch and immediate standby replacement units',
      'Smoothens daily factory production through monthly preventive calibration, turret/ATC alignment, and thermal cabinet audits',
      'Covers your entire shop floor of CNC Lathes, Vertical Machining Centers (VMCs), and Industrial Robots under one predictable annual plan',
    ],
    supportedBrands: [
      'Complete Factory CNC Sections (Lathes, VMCs, Turning Centers & Robots)',
      'SZGH, Fanuc, Siemens, Mitsubishi, Yaskawa & Delta Equipped Machines',
      'Full Electrical Cabinet, Servo Drive, Spindle & Mechanical Turret Coverage',
    ],
  },
];

/**
 * Removes axis-count mentions (e.g. "2-Axis", "3 Axis", "4-Axes", "3-to-5 axis",
 * "6-DOF", "(X, Z)", "(X, Y, Z)", etc.) from product descriptions and titles so
 * descriptions remain clean and universal across all Axis Selection Tabs.
 */
export function stripAxisCountFromText(text?: string): string {
  if (!text || !text.trim()) return '';
  let cleaned = text
    // Remove range axis expressions like "2-to-5 axis", "3/4-Axis", "3-axis / 4-axis ready"
    .replace(
      /\b[1-9]\s*(?:to|-|\/|\s+or\s+)\s*[1-9]\s*[-–]?\s*(?:ax(?:is|es)|dof)(?:\s+ready)?\b/gi,
      ''
    )
    // Remove explicit axis counts like "2-Axis", "3 Axis", "4 Axes", "6-DOF", "5-axis"
    .replace(
      /\(\s*(?:[1-9]|1[0-2])\s*[-–]?\s*(?:ax(?:is|es)|dof)[^)]*\)/gi,
      ''
    )
    .replace(
      /\b(?:[1-9]|1[0-2])\s*[-–]?\s*(?:ax(?:is|es)|dof)(?:\s+ready)?\b/gi,
      ''
    )
    // Remove coordinate axis lists like "(X, Z)", "(X, Y, Z)", "(X, Z, C/Y)", "(X, Z, Y, C)", "(X, Y, Z, A)"
    .replace(
      /\(\s*[XYZABC]\s*(?:,\s*[XYZABC](?:\/[XYZABC])?\s*)+\)/gi,
      ''
    )
    // Clean up any leftover double spaces or stray punctuation
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s,\-–:/]+/, '')
    .replace(/[\s,\-–:/]+$/, '')
    .trim();

  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Identifies the standalone I/O board product ("I/O board is recommended for controllers",
 * priced at PKR 20,000, model CNC880-I012 / CNC-IO12) so that:
 * 1. Its model number is normalized from "CNC880-I012" to "CNC-IO12".
 * 2. The I/O Board selection tabs ("Without I/O" / "With I/O") are NOT shown on this product,
 *    because this product itself is the I/O board.
 */
export function isStandaloneIOBoardProduct(item: {
  modelNumber?: string;
  baseModelNumber?: string;
  title?: string;
  description?: string;
  price?: number;
}): boolean {
  const model = `${item.modelNumber || ''} ${item.baseModelNumber || ''}`
    .trim()
    .toUpperCase();
  const text = `${item.title || ''} ${item.description || ''}`
    .trim()
    .toLowerCase();

  if (/CNC(?:880)?[-\s]*I[O0]12/i.test(model)) {
    return true;
  }
  if (
    text.includes('i/o board is recommended for controllers') ||
    text.includes('io board is recommended for controllers')
  ) {
    return true;
  }
  return false;
}

export function normalizeIOBoardModelNumber(
  modelNumber?: string,
  description?: string,
  title?: string
): string {
  const raw = (modelNumber || '').trim();
  if (
    isStandaloneIOBoardProduct({
      modelNumber: raw,
      description,
      title,
    })
  ) {
    return 'CNC-IO12';
  }
  return raw;
}

/**
 * Extracts the canonical base model name (e.g. "SZGH-880TC", "SZGH-CNC1000MDb")
 * and the axis count (e.g. 2, 3, 4, 5, 6) from a product's modelNumber, title,
 * subcategory, and description so same-model items with different numbers of axes
 * merge into 1 unified product listing with Axis Selection Tabs ("2-Axis", "3-Axis", etc.).
 */
export function extractBaseModelAndAxis(product: ProductItem): {
  baseModelDisplay: string;
  baseModelKey: string;
  axisCount: number | null;
  axisLabel: string | null;
} {
  const rawModel = normalizeIOBoardModelNumber(
    product.modelNumber,
    product.description,
    product.title
  );

  // Standalone I/O board ("CNC-IO12") should never have axis variants extracted
  if (isStandaloneIOBoardProduct({ ...product, modelNumber: rawModel })) {
    return {
      baseModelDisplay: 'CNC-IO12',
      baseModelKey: `${product.category}::CNC-IO12`,
      axisCount: null,
      axisLabel: null,
    };
  }

  const combinedText = `${rawModel} ${product.title || ''} ${product.subcategory || ''} ${
    product.description || ''
  }`;

  let axisCount: number | null = null;
  let baseModelDisplay = rawModel;

  // 1. Check if rawModel ends with an explicit "(2-Axis)" / "3 Axis" suffix
  const modelAxisWordMatch = rawModel.match(
    /^(.+?)\s*[\(\[\-–/]?\s*\b([1-9]|1[0-2])\s*[-–]?\s*(?:ax(?:is|es)|dof)\b[\)\]]?$/i
  );
  if (modelAxisWordMatch) {
    baseModelDisplay = modelAxisWordMatch[1].trim().replace(/[-–/\s]+$/, '');
    axisCount = parseInt(modelAxisWordMatch[2], 10);
  }

  // 2. Check if rawModel ends with a trailing axis digit suffix after letters (e.g., SZGH-880TC-2, 880TC-2, SZGH-CNC1000MDb-5, GH-1000MC-3)
  if (axisCount === null) {
    const trailingDigitMatch = rawModel.match(
      /^([A-Za-z0-9_\-]+?[A-Za-z])\s*[-/_]\s*([1-8])([A-Za-z])?$/
    );
    if (
      trailingDigitMatch &&
      (product.category === 'Controllers' ||
        /tc|mc|tdb|mdb|tdc|mdc|tdi|mdi|cnc/i.test(trailingDigitMatch[1]) ||
        /\bax(?:is|es)\b/i.test(combinedText))
    ) {
      baseModelDisplay = trailingDigitMatch[1].trim();
      axisCount = parseInt(trailingDigitMatch[2], 10);
    }
  }

  // 3. Check if axis number is embedded right before TC/MC/TD/MD (e.g., SZGH-880-2TC, SZGH-880-3TC)
  if (axisCount === null) {
    const midDigitMatch = rawModel.match(
      /^([A-Za-z0-9_\-]+?)[-_]?([1-8])(TC|MC|TDb|MDb|TDc|MDc|TDi|MDi)$/i
    );
    if (midDigitMatch) {
      baseModelDisplay = `${midDigitMatch[1]}-${midDigitMatch[3]}`;
      axisCount = parseInt(midDigitMatch[2], 10);
    }
  }

  // 4. Otherwise scan title, subcategory, and description for "2-Axis", "3 Axis", "4 Axes", etc.
  if (axisCount === null) {
    const textAxisMatch = combinedText.match(
      /\b([1-9]|1[0-2])\s*[-–]?\s*(?:ax(?:is|es)|dof)\b/i
    );
    if (textAxisMatch) {
      axisCount = parseInt(textAxisMatch[1], 10);
    }
  }

  // Create a canonical grouping key (unifying "880TC", "SZGH-880TC", and "SZGH-CNC880TC")
  const normalizedBaseKey = baseModelDisplay
    .toUpperCase()
    .replace(/^SZGH[-\s]*CNC[-\s]*/i, '')
    .replace(/^SZGH[-\s]*/i, '')
    .replace(/^CNC[-\s]*/i, '')
    .replace(/[\s_]+/g, '-');

  return {
    baseModelDisplay: baseModelDisplay || rawModel,
    baseModelKey: `${product.category}::${normalizedBaseKey}`,
    axisCount,
    axisLabel: axisCount !== null ? `${axisCount}-Axis` : null,
  };
}

/**
 * Merges products that share the same base model (e.g., SZGH-880TC / 880TC in 2-Axis, 3-Axis, 4-Axis)
 * into a single unified ProductItem with clean `2-Axis`, `3-Axis`, `4-Axis` selection tabs
 * and axis-free descriptions across all listings.
 */
export function mergeProductsByModelAndAxes(
  items: ProductItem[]
): ProductItem[] {
  const groups = new Map<
    string,
    {
      baseModelDisplay: string;
      entries: {
        product: ProductItem;
        axisCount: number | null;
        axisLabel: string | null;
      }[];
    }
  >();

  for (const rawProduct of items) {
    const isIOBoardItem = isStandaloneIOBoardProduct(rawProduct);
    const normalizedModel = normalizeIOBoardModelNumber(
      rawProduct.modelNumber,
      rawProduct.description,
      rawProduct.title
    );

    const { baseModelDisplay, baseModelKey, axisCount, axisLabel } =
      extractBaseModelAndAxis({
        ...rawProduct,
        modelNumber: normalizedModel,
      });

    // Strip number of axes from description & title for display
    const cleanedProduct: ProductItem = {
      ...rawProduct,
      modelNumber: normalizedModel,
      hasIOBoardOption: isIOBoardItem ? false : rawProduct.hasIOBoardOption,
      title: stripAxisCountFromText(rawProduct.title),
      description: stripAxisCountFromText(rawProduct.description),
    };

    const existingGroup = groups.get(baseModelKey);
    if (existingGroup) {
      // Prefer a baseModelDisplay that starts with "SZGH-" if available
      if (
        !existingGroup.baseModelDisplay.toUpperCase().startsWith('SZGH') &&
        baseModelDisplay.toUpperCase().startsWith('SZGH')
      ) {
        existingGroup.baseModelDisplay = baseModelDisplay;
      }
      existingGroup.entries.push({
        product: cleanedProduct,
        axisCount,
        axisLabel,
      });
    } else {
      groups.set(baseModelKey, {
        baseModelDisplay,
        entries: [{ product: cleanedProduct, axisCount, axisLabel }],
      });
    }
  }

  const mergedResult: ProductItem[] = [];

  for (const [, group] of groups.entries()) {
    const { baseModelDisplay, entries } = group;

    // Sort entries by axisCount ascending (e.g., 2-Axis, 3-Axis, 4-Axis, 5-Axis)
    const sortedEntries = [...entries].sort((a, b) => {
      const aAxis = a.axisCount ?? 99;
      const bAxis = b.axisCount ?? 99;
      if (aAxis !== bAxis) return aAxis - bAxis;
      // If both have the same axisCount, prefer custom/uploaded items over built-in defaults
      const aIsCustom = !a.product.id.startsWith('prod-') ? 0 : 1;
      const bIsCustom = !b.product.id.startsWith('prod-') ? 0 : 1;
      if (aIsCustom !== bIsCustom) return aIsCustom - bIsCustom;
      return a.product.price - b.product.price;
    });

    if (sortedEntries.length === 1) {
      const single = sortedEntries[0];
      if (single.axisCount !== null && single.axisLabel) {
        mergedResult.push({
          ...single.product,
          baseModelNumber: baseModelDisplay,
          axisVariants: [
            {
              id: single.product.id,
              axisLabel: `${single.axisCount}-Axis`,
              axisCount: single.axisCount,
              modelNumber: single.product.modelNumber,
              title: single.product.title,
              description: single.product.description,
              price: single.product.price,
              stockCount: single.product.stockCount,
              stockStatus: single.product.stockStatus,
              images: single.product.images,
              defaultImageIndex: single.product.defaultImageIndex,
            },
          ],
        });
      } else {
        mergedResult.push(single.product);
      }
      continue;
    }

    // Multiple items share the same base model -> merge into 1 listing with clean Axis Selection Tabs ("2-Axis", "3-Axis", etc.)
    // Deduplicate by axisLabel so e.g. "880TC-2" and "SZGH-880TC-2" merge into a single "2-Axis" tab without "(880TC-2)"
    const variantsByLabel = new Map<string, AxisVariantOption>();

    sortedEntries.forEach((entry, idx) => {
      let resolvedAxisCount = entry.axisCount;
      if (resolvedAxisCount === null) {
        const fallbackDigit = entry.product.modelNumber.match(/([1-8])(?!.*[1-8])/);
        resolvedAxisCount = fallbackDigit
          ? parseInt(fallbackDigit[1], 10)
          : idx + 2;
      }
      const cleanLabel = `${resolvedAxisCount}-Axis`;

      const existingVariant = variantsByLabel.get(cleanLabel);
      if (!existingVariant) {
        variantsByLabel.set(cleanLabel, {
          id: entry.product.id,
          axisLabel: cleanLabel,
          axisCount: resolvedAxisCount,
          modelNumber: entry.product.modelNumber,
          title: entry.product.title,
          description: entry.product.description,
          price: entry.product.price,
          stockCount: entry.product.stockCount,
          stockStatus: entry.product.stockStatus,
          images: entry.product.images,
          defaultImageIndex: entry.product.defaultImageIndex,
        });
      } else {
        // Merge any missing fields (e.g., if custom item had empty description or 0 price, fallback to built-in)
        const entryHasCustomImg = entry.product.images?.some(
          (img) =>
            img &&
            img.trim().length > 0 &&
            !img.startsWith('data:image/svg+xml')
        );
        const existingHasCustomImg = existingVariant.images?.some(
          (img) =>
            img &&
            img.trim().length > 0 &&
            !img.startsWith('data:image/svg+xml')
        );

        variantsByLabel.set(cleanLabel, {
          ...existingVariant,
          title: existingVariant.title || entry.product.title,
          description: existingVariant.description || entry.product.description,
          price:
            existingVariant.price > 0
              ? existingVariant.price
              : entry.product.price,
          images:
            !existingHasCustomImg && entryHasCustomImg
              ? entry.product.images
              : existingVariant.images,
          defaultImageIndex:
            !existingHasCustomImg && entryHasCustomImg
              ? entry.product.defaultImageIndex
              : existingVariant.defaultImageIndex,
        });
      }
    });

    const axisVariants = Array.from(variantsByLabel.values()).sort(
      (a, b) => a.axisCount - b.axisCount
    );

    // Pick primary representative item (prefer one that has custom uploaded images, else first sorted axis)
    const itemWithCustomPhoto =
      sortedEntries.find((e) =>
        e.product.images.some(
          (img) =>
            img &&
            img.trim().length > 0 &&
            !img.startsWith('data:image/svg+xml')
        )
      )?.product || sortedEntries[0].product;

    const itemWithRichText =
      sortedEntries.find(
        (e) =>
          e.product.description.trim().length > 0 ||
          e.product.title.trim().length > 0
      )?.product || sortedEntries[0].product;

    const primary = sortedEntries[0].product;
    const totalStock = axisVariants.reduce(
      (sum, v) => sum + (v.stockCount || 0),
      0
    );

    mergedResult.push({
      ...primary,
      modelNumber: baseModelDisplay,
      baseModelNumber: baseModelDisplay,
      title: primary.title || itemWithRichText.title,
      description: primary.description || itemWithRichText.description,
      images: itemWithCustomPhoto.images,
      defaultImageIndex:
        itemWithCustomPhoto.defaultImageIndex ?? primary.defaultImageIndex ?? 0,
      stockCount: axisVariants[0]?.stockCount ?? primary.stockCount,
      price: axisVariants[0]?.price ?? primary.price,
      inStock: totalStock > 0,
      axisVariants,
    });
  }

  return mergedResult;
}

