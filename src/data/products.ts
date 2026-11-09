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

import {
  SZGH_880MC_IMAGES,
  SZGH_880MC_IMAGE_LABELS,
  SZGH_880MC_DEFAULT_IMAGE_INDEX,
} from './szgh880mcImages';
import {
  SZGH_1080MC_IMAGES,
  SZGH_1080MC_IMAGE_LABELS,
  SZGH_1080MC_DEFAULT_IMAGE_INDEX,
} from './szgh1080mcImages';
import {
  SZGH_880TC_IMAGES,
  SZGH_880TC_IMAGE_LABELS,
  SZGH_880TC_DEFAULT_IMAGE_INDEX,
} from './szgh880tcImages';
import {
  SZGH_1080TC_IMAGES,
  SZGH_1080TC_IMAGE_LABELS,
  SZGH_1080TC_DEFAULT_IMAGE_INDEX,
} from './szgh1080tcImages';
import {
  SZGH_1080MIC_IMAGES,
  SZGH_1080MIC_IMAGE_LABELS,
  SZGH_1080MIC_DEFAULT_IMAGE_INDEX,
} from './szgh1080micImages';
import {
  SZGH_880TIC_IMAGES,
  SZGH_880TIC_IMAGE_LABELS,
  SZGH_880TIC_DEFAULT_IMAGE_INDEX,
} from './szgh880ticImages';
import {
  SZGH_1000MDB_IMAGES,
  SZGH_1000MDB_IMAGE_LABELS,
  SZGH_1000MDB_DEFAULT_IMAGE_INDEX,
} from './szgh1000mdbImages';
import {
  SZGH_990MDB_IMAGES,
  SZGH_990MDB_IMAGE_LABELS,
  SZGH_990MDB_DEFAULT_IMAGE_INDEX,
} from './szgh990mdbImages';
import {
  SZGH_990MDC_IMAGES,
  SZGH_990MDC_IMAGE_LABELS,
  SZGH_990MDC_DEFAULT_IMAGE_INDEX,
} from './szgh990mdcImages';
import {
  SZGH_990TDB_IMAGES,
  SZGH_990TDB_IMAGE_LABELS,
  SZGH_990TDB_DEFAULT_IMAGE_INDEX,
} from './szgh990tdbImages';
import {
  SZGH_990TDC_IMAGES,
  SZGH_990TDC_IMAGE_LABELS,
  SZGH_990TDC_DEFAULT_IMAGE_INDEX,
} from './szgh990tdcImages';
import {
  SZGH_1000MC_IMAGES,
  SZGH_1000MC_IMAGE_LABELS,
  SZGH_1000MC_DEFAULT_IMAGE_INDEX,
} from './szgh1000mcImages';
import {
  SZGH_1000MDC_IMAGES,
  SZGH_1000MDC_IMAGE_LABELS,
  SZGH_1000MDC_DEFAULT_IMAGE_INDEX,
} from './szgh1000mdcImages';
import {
  SZGH_1000MDCB_IMAGES,
  SZGH_1000MDCB_IMAGE_LABELS,
  SZGH_1000MDCB_DEFAULT_IMAGE_INDEX,
} from './szgh1000mdcbImages';
import {
  SZGH_1000TDB_IMAGES,
  SZGH_1000TDB_IMAGE_LABELS,
  SZGH_1000TDB_DEFAULT_IMAGE_INDEX,
} from './szgh1000tdbImages';
import {
  SZGH_CNC_IO12_IMAGES,
  SZGH_CNC_IO12_IMAGE_LABELS,
  SZGH_CNC_IO12_DEFAULT_IMAGE_INDEX,
} from './szghCncIo12Images';
import {
  SZGH_PANEL_A_IMAGE,
  SZGH_PANEL_B_IMAGE,
  SZGH_PANEL_C_IMAGE,
  SZGH_PANEL_E_IMAGE,
  SZGH_AB_PANEL_IMAGES,
  SZGH_AB_PANEL_IMAGE_LABELS,
  SZGH_CE_PANEL_IMAGES,
  SZGH_CE_PANEL_IMAGE_LABELS,
} from './szghPanelImages';

export {
  SZGH_880MC_IMAGES,
  SZGH_880MC_IMAGE_LABELS,
  SZGH_880MC_DEFAULT_IMAGE_INDEX,
  SZGH_1080MC_IMAGES,
  SZGH_1080MC_IMAGE_LABELS,
  SZGH_1080MC_DEFAULT_IMAGE_INDEX,
  SZGH_880TC_IMAGES,
  SZGH_880TC_IMAGE_LABELS,
  SZGH_880TC_DEFAULT_IMAGE_INDEX,
  SZGH_1080TC_IMAGES,
  SZGH_1080TC_IMAGE_LABELS,
  SZGH_1080TC_DEFAULT_IMAGE_INDEX,
  SZGH_1080MIC_IMAGES,
  SZGH_1080MIC_IMAGE_LABELS,
  SZGH_1080MIC_DEFAULT_IMAGE_INDEX,
  SZGH_880TIC_IMAGES,
  SZGH_880TIC_IMAGE_LABELS,
  SZGH_880TIC_DEFAULT_IMAGE_INDEX,
  SZGH_1000MDB_IMAGES,
  SZGH_1000MDB_IMAGE_LABELS,
  SZGH_1000MDB_DEFAULT_IMAGE_INDEX,
  SZGH_990MDB_IMAGES,
  SZGH_990MDB_IMAGE_LABELS,
  SZGH_990MDB_DEFAULT_IMAGE_INDEX,
  SZGH_990MDC_IMAGES,
  SZGH_990MDC_IMAGE_LABELS,
  SZGH_990MDC_DEFAULT_IMAGE_INDEX,
  SZGH_990TDB_IMAGES,
  SZGH_990TDB_IMAGE_LABELS,
  SZGH_990TDB_DEFAULT_IMAGE_INDEX,
  SZGH_990TDC_IMAGES,
  SZGH_990TDC_IMAGE_LABELS,
  SZGH_990TDC_DEFAULT_IMAGE_INDEX,
  SZGH_1000MC_IMAGES,
  SZGH_1000MC_IMAGE_LABELS,
  SZGH_1000MC_DEFAULT_IMAGE_INDEX,
  SZGH_1000MDC_IMAGES,
  SZGH_1000MDC_IMAGE_LABELS,
  SZGH_1000MDC_DEFAULT_IMAGE_INDEX,
  SZGH_1000MDCB_IMAGES,
  SZGH_1000MDCB_IMAGE_LABELS,
  SZGH_1000MDCB_DEFAULT_IMAGE_INDEX,
  SZGH_1000TDB_IMAGES,
  SZGH_1000TDB_IMAGE_LABELS,
  SZGH_1000TDB_DEFAULT_IMAGE_INDEX,
  SZGH_CNC_IO12_IMAGES,
  SZGH_CNC_IO12_IMAGE_LABELS,
  SZGH_CNC_IO12_DEFAULT_IMAGE_INDEX,
  SZGH_PANEL_A_IMAGE,
  SZGH_PANEL_B_IMAGE,
  SZGH_PANEL_C_IMAGE,
  SZGH_PANEL_E_IMAGE,
  SZGH_AB_PANEL_IMAGES,
  SZGH_AB_PANEL_IMAGE_LABELS,
  SZGH_CE_PANEL_IMAGES,
  SZGH_CE_PANEL_IMAGE_LABELS,
};
import {
  CONTROLLER_RATE_LIST_2026,
  SERVO_MOTOR_RATE_LIST_2026,
  SERVO_DRIVER_RATE_LIST_2026,
  OFFICIAL_IO_BOARD_PRICE_PKR,
  ServoMotorConfigOption,
  buildControllerFeatures,
  buildServoMotorConfigOptions,
  resolveOfficialRateListPricing,
} from './rateList2026';

export type { ServoMotorConfigOption };
export {
  CONTROLLER_RATE_LIST_2026,
  SERVO_MOTOR_RATE_LIST_2026,
  SERVO_DRIVER_RATE_LIST_2026,
  OFFICIAL_IO_BOARD_PRICE_PKR,
  buildControllerFeatures,
  buildServoMotorConfigOptions,
  resolveOfficialRateListPricing,
};

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
    label: 'With I/O (+PKR 22,000)',
    shortLabel: 'With I/O',
    priceDelta: OFFICIAL_IO_BOARD_PRICE_PKR,
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
  images?: string[];
  imageLabels?: string[];
  defaultImageIndex?: number;
}

export interface ProductItem {
  id: string;
  title: string;
  modelNumber: string;
  baseModelNumber?: string;
  axisVariants?: AxisVariantOption[];
  servoConfigOptions?: ServoMotorConfigOption[];
  category: ProductCategory;
  subcategory: string;
  description: string;
  features: string[];
  price: number; // Base price in PKR
  usdEstimate: number;
  inStock: boolean;
  stockCount: number;
  stockStatus?: 'In Stock' | 'Low Stock' | 'Pre-Order';
  defaultImageIndex?: number; // 0..5 index of the highlighted default image
  warranty: string; // Standard 1 Year Warranty Note
  hasIOBoardOption?: boolean; // True ONLY for Controllers
  images: string[];
  imageLabels: string[];
  specs: ProductSpec[];
  compatibility: string[];
}

export const HERO_SHOWCASE_PHOTOS = {
  controllers: '/assets/hero/hero-controllers-hd.jpg',
  motors: '/assets/hero/hero-motors-hd.jpg',
  machines: '/assets/hero/hero-machines-hd.jpg',
  robots: '/assets/hero/hero-robots-hd.jpg',
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

export interface SubcategoryGroup {
  id: string;
  groupTitle: string;
  category: ProductCategory;
  subcategories: string[];
}

/**
 * Official SZGH Product Category & Subcategory Hierarchy
 * Distributed directly from the official SZGH subcategory structure:
 * 1. CNC System (Controllers)
 * 2. Servo Motors and Drives (Motors)
 * 3. Spindle Servo Motors and Drivers (Motors)
 * 4. Stepper Motors and Drivers (Motors)
 * 5. CNC Machine (Machines)
 * 6. Industrial Robots (Robots)
 */
export const OFFICIAL_SUBCATEGORY_GROUPS: SubcategoryGroup[] = [
  {
    id: 'cnc-system',
    groupTitle: 'CNC System',
    category: 'Controllers',
    subcategories: [
      'Drilling and milling machine CNC controller',
      'Lathe controller',
      'Engraving CNC controller',
      'Grinder controller',
    ],
  },
  {
    id: 'servo-motors-and-drives',
    groupTitle: 'Servo Motors and Drives',
    category: 'Motors',
    subcategories: [
      'Servo Driver',
      'Servo motor',
    ],
  },
  {
    id: 'spindle-servo-motors-and-drivers',
    groupTitle: 'Spindle Servo Motors and Drivers',
    category: 'Motors',
    subcategories: [
      'Spindle servo motor',
      'Spindle servo driver',
    ],
  },
  {
    id: 'stepper-motors-and-drivers',
    groupTitle: 'Stepper Motors and Drivers',
    category: 'Motors',
    subcategories: [
      'Closed Loop Stepper Motors and Drivers',
      'Two-phase stepper motor and driver',
      'Three-phase stepper motors and drivers',
    ],
  },
  {
    id: 'cnc-machine',
    groupTitle: 'CNC Machine',
    category: 'Machines',
    subcategories: [
      'CNC lathe machine',
      'CNC milling machine',
      'Milling machine center',
    ],
  },
  {
    id: 'industrial-robots',
    groupTitle: 'Industrial Robots',
    category: 'Robots',
    subcategories: [
      'Robotic Welding Cell',
      'Pick-and-Place & Machine Tending',
      'Spraying & Grinding Robot',
    ],
  },
];

export const ALL_OFFICIAL_SUBCATEGORIES: string[] = OFFICIAL_SUBCATEGORY_GROUPS.flatMap(
  (g) => g.subcategories
);

/**
 * Automatically distributes any product (built-in, Firestore cloud override, or Excel import)
 * into its exact official subcategory based on its existing subcategory, model number, title, and description.
 */
export function resolveOfficialSubcategory(item: {
  category?: ProductCategory | '';
  subcategory?: string;
  modelNumber?: string;
  title?: string;
  description?: string;
}): string {
  // Prefer authoritative subcategory from Controller Rate List-1 when matched
  const rateMatched = resolveOfficialRateListPricing({
    modelNumber: item.modelNumber,
    title: item.title,
    description: item.description,
  });
  if (rateMatched.subcategory) {
    return rateMatched.subcategory;
  }

  const rawSub = (item.subcategory || '').trim();
  // If already an exact official subcategory (case-insensitive), return canonical casing
  const exactMatch = ALL_OFFICIAL_SUBCATEGORIES.find(
    (s) => s.toLowerCase() === rawSub.toLowerCase()
  );
  if (exactMatch) {
    return exactMatch;
  }

  const model = (item.modelNumber || '').toUpperCase();
  const combined = `${rawSub} ${item.modelNumber || ''} ${item.title || ''} ${
    item.description || ''
  }`.toLowerCase();
  const cat = item.category || 'Controllers';

  if (cat === 'Controllers') {
    if (combined.includes('grind') || /SZGH[-\s]*G|CNC[-\s]*G/i.test(model)) {
      return 'Grinder controller';
    }
    if (
      combined.includes('milling') ||
      combined.includes('drilling') ||
      combined.includes('vmc') ||
      combined.includes('machining center') ||
      /MD|MC|1000M|880M|990M|1080M|1500M/i.test(model)
    ) {
      return 'Drilling and milling machine CNC controller';
    }
    if (combined.includes('engrav') || combined.includes('router')) {
      return 'Engraving CNC controller';
    }
    if (
      combined.includes('lathe') ||
      combined.includes('turning') ||
      combined.includes('turn-mill') ||
      combined.includes('turret') ||
      /TD|TC|990T|1000T|880T|1080T|1500T/i.test(model)
    ) {
      return 'Lathe controller';
    }
    return 'Drilling and milling machine CNC controller';
  }

  if (cat === 'Motors') {
    // 1. Stepper Motors and Drivers
    if (combined.includes('stepper') || combined.includes('stepping') || /86HS|57HS|110HS|130BYG|3DM|2DM|CL86/i.test(model)) {
      if (combined.includes('three-phase') || combined.includes('3-phase') || combined.includes('three phase') || /3DM|110|130BYG/i.test(model)) {
        return 'Three-phase stepper motors and drivers';
      }
      if (combined.includes('two-phase') || combined.includes('2-phase') || combined.includes('two phase') || /2DM/i.test(model)) {
        return 'Two-phase stepper motor and driver';
      }
      return 'Closed Loop Stepper Motors and Drivers';
    }

    // 2. Spindle Servo Motors and Drivers
    if (combined.includes('spindle') || /SZGH-08-|SZGH-10-|SZGH-12-|S4T2P|SPINDLE/i.test(model)) {
      if (
        (combined.includes('driver') || combined.includes('drive') || combined.includes('inverter') || /S4T2P|SD500|SPD/i.test(model)) &&
        !combined.includes('motor &') &&
        !combined.includes('motor and') &&
        !combined.includes('asynchronous servo spindle motor')
      ) {
        return 'Spindle servo driver';
      }
      return 'Spindle servo motor';
    }

    // 3. Servo Motors and Drives
    if (
      (combined.includes('servo driver') ||
        combined.includes('servo drive') ||
        combined.includes('amplifier') ||
        /^SZGH[-\s]*(?:SD|E7[DIA]|ED75)|^SD[0-9]|^E7[DIA]|[-+\s]SD[0-9]/i.test(model)) &&
      !combined.includes('servo motor')
    ) {
      return 'Servo Driver';
    }
    return 'Servo motor';
  }

  if (cat === 'Machines') {
    if (
      combined.includes('lathe') ||
      combined.includes('turning') ||
      combined.includes('turn-mill') ||
      /SZGH-36|SZGH-46|SZGH-25|SZGH-T/i.test(model)
    ) {
      return 'CNC lathe machine';
    }
    if (
      combined.includes('center') ||
      combined.includes('vmc') ||
      /VMC|SZGH-650|SZGH-850|SZGH-1060/i.test(model)
    ) {
      return 'Milling machine center';
    }
    return 'CNC milling machine';
  }

  if (cat === 'Robots') {
    if (combined.includes('weld')) {
      return 'Robotic Welding Cell';
    }
    if (combined.includes('spray') || combined.includes('grind') || combined.includes('paint')) {
      return 'Spraying & Grinding Robot';
    }
    return 'Pick-and-Place & Machine Tending';
  }

  return rawSub || 'Drilling and milling machine CNC controller';
}

const RAW_PRODUCTS_DATABASE: ProductItem[] = [
  // ==========================================================================
  // CATEGORY 1: CNC SYSTEM (Controllers — Supports I/O Board Selection)
  // Subcategories:
  //   - Drilling and milling machine CNC controller
  //   - Lathe controller
  //   - Engraving CNC controller
  //   - Grinder controller
  // ==========================================================================
  {
    id: 'prod-cnc-1000mdb',
    title: 'Universal CNC Milling & Drilling Machine Controller (A+B Panel)',
    modelNumber: 'SZGH-CNC1000MDb-5 (A+B Panel)',
    category: 'Controllers',
    subcategory: 'Drilling and milling machine CNC controller',
    description:
      'Industrial simultaneous interpolation CNC drilling and milling controller (A+B Panel) for VMCs, gantry mills, and precision mold making. Features 8.4" LCD, full ATC PLC support, and USB DNC.',
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
    defaultImageIndex: SZGH_1000MDB_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [...SZGH_1000MDB_IMAGES, ...SZGH_AB_PANEL_IMAGES],
    imageLabels: [...SZGH_1000MDB_IMAGE_LABELS, ...SZGH_AB_PANEL_IMAGE_LABELS],
    specs: [
      { label: 'Controlled Axes', value: 'Multi-Axis Simultaneous + 2 Analog Spindles' },
      { label: 'Minimum Command Unit', value: '0.001 mm (1 Micron)' },
      { label: 'Rapid Traverse Limit', value: '60,000 mm/min' },
      { label: 'ATC Tool Magazine Support', value: 'Linear, Umbrella & Arm-Type (up to 32 Tools)' },
      { label: 'Communication Interface', value: 'USB Flash, RS232 DNC, EtherCAT / Pulse Option' },
      { label: 'Built-in PLC I/O', value: '32 Opto-Isolated Inputs / 32 Relay-Drive Outputs' },
    ],
    compatibility: ['Vertical Machining Centers (VMC)', 'Drilling & Milling Machines', 'Mold Centres'],
  },
  {
    id: 'prod-cnc-1000mdb-3',
    title: 'Universal CNC Drilling & Milling Machine Controller (A+B Panel)',
    modelNumber: 'SZGH-CNC1000MDb-3 (A+B Panel)',
    category: 'Controllers',
    subcategory: 'Drilling and milling machine CNC controller',
    description:
      'Industrial simultaneous CNC drilling and milling controller (A+B Panel) for Vertical Machining Centers (VMCs), bed mills, and precision drilling-milling machines.',
    features: [
      'High-speed interpolation with look-ahead smoothing',
      'Built-in open PLC ladder for Umbrella and Arm-Type Automatic Tool Changers',
    ],
    price: 215000,
    usdEstimate: 775,
    inStock: true,
    stockCount: 18,
    defaultImageIndex: SZGH_1000MDB_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [...SZGH_1000MDB_IMAGES, ...SZGH_AB_PANEL_IMAGES],
    imageLabels: [...SZGH_1000MDB_IMAGE_LABELS, ...SZGH_AB_PANEL_IMAGE_LABELS],
    specs: [{ label: 'Minimum Command Unit', value: '0.001 mm' }],
    compatibility: ['Vertical Machining Centers (VMC)', 'CNC Drilling & Milling Machines'],
  },
  {
    id: 'prod-cnc-1000mdb-4',
    title: 'Universal CNC Drilling, Milling & Rotary Indexing Controller (A+B Panel)',
    modelNumber: 'SZGH-CNC1000MDb-4 (A+B Panel)',
    category: 'Controllers',
    subcategory: 'Drilling and milling machine CNC controller',
    description:
      'Industrial simultaneous CNC drilling and milling controller (A+B Panel) for VMCs with rotary indexing tables and cylindrical milling.',
    features: [
      'Simultaneous interpolation for rotary table machining',
      'Built-in open PLC ladder for Umbrella and Arm-Type Automatic Tool Changers',
    ],
    price: 240000,
    usdEstimate: 865,
    inStock: true,
    stockCount: 11,
    defaultImageIndex: SZGH_1000MDB_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [...SZGH_1000MDB_IMAGES, ...SZGH_AB_PANEL_IMAGES],
    imageLabels: [...SZGH_1000MDB_IMAGE_LABELS, ...SZGH_AB_PANEL_IMAGE_LABELS],
    specs: [{ label: 'Minimum Command Unit', value: '0.001 mm' }],
    compatibility: ['VMCs', 'Rotary Table Drilling & Milling Machines'],
  },
  {
    id: 'prod-cnc-1000mc-3',
    title: 'Industrial Dual-Panel CNC Milling & Machining Center Controller (1000MC Series)',
    modelNumber: 'SZGH-1000MC-3',
    category: 'Controllers',
    subcategory: 'Drilling and milling machine CNC controller',
    description:
      'Industrial SZGH-1000MC (GH-1000MC) dual-panel CNC milling and drilling machine controller featuring 8.4" color TFT LCD, full alphanumeric MDI programming console, dedicated lower machine operator panel with feed/spindle override dials, ATC PLC ladder support, and USB DNC interface.',
    features: [
      'Dual-panel industrial milling console with upper LCD/MDI programmer unit and lower operator control station',
      'Simultaneous linear, circular, and helical interpolation with high-speed look-ahead contour smoothing',
      'Built-in open PLC ladder supporting Umbrella, Linear, and Arm-Type Automatic Tool Changers (ATC)',
      'Dedicated rear DB connectors for X/Y/Z/4th/5th axes, Encoder, MPG handwheel, Spindle, and Input/Output (CN1–CN62)',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 230000,
    usdEstimate: 827,
    inStock: true,
    stockCount: 15,
    defaultImageIndex: SZGH_1000MC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_1000MC_IMAGES,
    imageLabels: SZGH_1000MC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-1000MC (GH-1000MC)' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Operator Architecture', value: 'Dual-Panel Display & Tactile Milling Operator Console' },
      { label: 'Rear Interfaces', value: 'X/Y/Z/4th/5th Axis, Encoder, MPG, Spindle, COM, Input & Output (CN1–CN62)' },
    ],
    compatibility: ['Vertical Machining Centers (VMC)', 'CNC Milling & Drilling Machines', 'Gantry Mills'],
  },
  {
    id: 'prod-cnc-1000mc-4',
    title: 'Industrial Dual-Panel CNC Milling & Rotary Indexing Controller (1000MC Series)',
    modelNumber: 'SZGH-1000MC-4',
    category: 'Controllers',
    subcategory: 'Drilling and milling machine CNC controller',
    description:
      'Industrial SZGH-1000MC (GH-1000MC) dual-panel CNC milling, drilling, and rotary axis controller featuring 8.4" color TFT LCD, dedicated lower machine operator panel, ATC PLC ladder support, and optically isolated I/O expansion.',
    features: [
      'Simultaneous interpolation for VMC and rotary indexing table machining operations',
      'Dual-panel industrial milling console with upper LCD/MDI programmer unit and lower operator control station',
      'Dedicated rear DB connectors for X/Y/Z/4th/5th axes, Encoder, MPG handwheel, Spindle, and Input/Output (CN1–CN62)',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 255000,
    usdEstimate: 917,
    inStock: true,
    stockCount: 11,
    defaultImageIndex: SZGH_1000MC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_1000MC_IMAGES,
    imageLabels: SZGH_1000MC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-1000MC (GH-1000MC)' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Operator Architecture', value: 'Dual-Panel Display & Tactile Milling Operator Console' },
      { label: 'Rear Interfaces', value: 'X/Y/Z/4th/5th Axis, Encoder, MPG, Spindle, COM, Input & Output (CN1–CN62)' },
    ],
    compatibility: ['Vertical Machining Centers (VMC)', 'Rotary Table Milling & Drilling Machines'],
  },
  {
    id: 'prod-cnc-1000mc-5',
    title: 'Industrial Dual-Panel Multi-Axis CNC Milling & Machining Center Controller (1000MC Series)',
    modelNumber: 'SZGH-1000MC-5',
    category: 'Controllers',
    subcategory: 'Drilling and milling machine CNC controller',
    description:
      'Flagship SZGH-1000MC (GH-1000MC-5) dual-panel multi-axis CNC milling and machining center controller featuring 8.4" color TFT LCD, dedicated lower machine operator panel, full X/Y/Z/4th/5th axis rear interface ports, ATC PLC support, and USB DNC.',
    features: [
      'Simultaneous multi-axis interpolation with high-speed look-ahead contour smoothing',
      'Dual-panel industrial milling console with upper LCD/MDI programmer unit and lower operator control station',
      'Dedicated rear DB connectors for X/Y/Z/4th/5th axes, Encoder, MPG handwheel, Spindle, and Input/Output (CN1–CN62)',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 280000,
    usdEstimate: 1007,
    inStock: true,
    stockCount: 8,
    defaultImageIndex: SZGH_1000MC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_1000MC_IMAGES,
    imageLabels: SZGH_1000MC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-1000MC (GH-1000MC)' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Operator Architecture', value: 'Dual-Panel Display & Tactile Milling Operator Console' },
      { label: 'Rear Interfaces', value: 'X/Y/Z/4th/5th Axis, Encoder, MPG, Spindle, COM, Input & Output (CN1–CN62)' },
    ],
    compatibility: ['Multi-Axis Machining Centers', 'CNC Milling & Mold Centers'],
  },
  {
    id: 'prod-cnc-1000tdb',
    title: 'High-Precision CNC Lathe & Turning Center Controller (A+B Panel)',
    modelNumber: 'SZGH-CNC1000TDb-3 (A+B Panel)',
    category: 'Controllers',
    subcategory: 'Lathe controller',
    description:
      'Flagship CNC lathe controller (A+B Panel) designed for slant-bed CNC lathes and live-tooling turning centers. Supports 4-to-12 station turrets, constant surface speed (G96), and rigid tapping.',
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
    defaultImageIndex: SZGH_1000TDB_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [...SZGH_1000TDB_IMAGES, ...SZGH_AB_PANEL_IMAGES],
    imageLabels: [...SZGH_1000TDB_IMAGE_LABELS, ...SZGH_AB_PANEL_IMAGE_LABELS],
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
    id: 'prod-cnc-1000tdb-2',
    title: 'High-Precision CNC Lathe & Turning Center Controller (A+B Panel)',
    modelNumber: 'SZGH-CNC1000TDb-2 (A+B Panel)',
    category: 'Controllers',
    subcategory: 'Lathe controller',
    description:
      'SZGH-CNC1000TDb lathe controller (A+B Panel) for slant-bed CNC lathes with 8.4" LCD, constant surface speed (G96), and 4–12 station turret control.',
    features: [
      'Precision turning with 0.001mm resolution and G96 constant surface speed',
      'Pre-programmed PLC logic for electric and hydraulic turrets',
    ],
    price: 205000,
    usdEstimate: 737,
    inStock: true,
    stockCount: 22,
    defaultImageIndex: SZGH_1000TDB_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [...SZGH_1000TDB_IMAGES, ...SZGH_AB_PANEL_IMAGES],
    imageLabels: [...SZGH_1000TDB_IMAGE_LABELS, ...SZGH_AB_PANEL_IMAGE_LABELS],
    specs: [{ label: 'Minimum Command Unit', value: '0.001 mm' }],
    compatibility: ['Slant-Bed CNC Lathes', 'Production Turning Centers'],
  },
  {
    id: 'prod-cnc-1000tdb-4',
    title: 'High-Precision CNC Turn-Mill Lathe Controller (A+B Panel)',
    modelNumber: 'SZGH-CNC1000TDb-4 (A+B Panel)',
    category: 'Controllers',
    subcategory: 'Lathe controller',
    description:
      'SZGH-CNC1000TDb lathe controller (A+B Panel) for multi-tasking turn-mill centers with off-center milling and live tooling.',
    features: [
      'Simultaneous control for complex turn-mill centers',
      'Dual analog spindle outputs + full turret & live-tool PLC integration',
    ],
    price: 252000,
    usdEstimate: 906,
    inStock: true,
    stockCount: 8,
    defaultImageIndex: SZGH_1000TDB_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [...SZGH_1000TDB_IMAGES, ...SZGH_AB_PANEL_IMAGES],
    imageLabels: [...SZGH_1000TDB_IMAGE_LABELS, ...SZGH_AB_PANEL_IMAGE_LABELS],
    specs: [{ label: 'Minimum Command Unit', value: '0.001 mm' }],
    compatibility: ['Turn-Mill Centers', 'Multi-Tasking CNC Lathes'],
  },
  {
    id: 'prod-cnc-990tdb',
    title: 'Economical CNC Lathe Controller for Standard Turning',
    modelNumber: 'SZGH-CNC990TDb-2',
    category: 'Controllers',
    subcategory: 'Lathe controller',
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
    defaultImageIndex: SZGH_990TDB_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_990TDB_IMAGES as [string, string, string, string],
    imageLabels: SZGH_990TDB_IMAGE_LABELS as [string, string, string, string],
    specs: [
      { label: 'Model Series', value: 'SZGH-990TDb' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Rapid Traverse Limit', value: '60,000 mm/min' },
      { label: 'Display Screen', value: '8.0" Color LCD (800×600)' },
      { label: 'I/O Interface', value: '24 Inputs / 24 Outputs Opto-Isolated' },
    ],
    compatibility: ['Flat-Bed CNC Lathes', 'Conventional Lathe Conversions', 'Auto-Feeder Turning Machines'],
  },
  {
    id: 'prod-cnc-990tdb-3',
    title: 'Economical CNC Lathe & Turning Controller',
    modelNumber: 'SZGH-CNC990TDb-3',
    category: 'Controllers',
    subcategory: 'Lathe controller',
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
    defaultImageIndex: SZGH_990TDB_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_990TDB_IMAGES as [string, string, string, string],
    imageLabels: SZGH_990TDB_IMAGE_LABELS as [string, string, string, string],
    specs: [
      { label: 'Model Series', value: 'SZGH-990TDb' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
    ],
    compatibility: ['CNC Lathes', 'Conventional Lathe Conversions'],
  },
  {
    id: 'prod-cnc-990tdb-4',
    title: 'Economical CNC Lathe & Milling Controller',
    modelNumber: 'SZGH-CNC990TDb-4',
    category: 'Controllers',
    subcategory: 'Lathe controller',
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
    defaultImageIndex: SZGH_990TDB_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_990TDB_IMAGES as [string, string, string, string],
    imageLabels: SZGH_990TDB_IMAGE_LABELS as [string, string, string, string],
    specs: [
      { label: 'Model Series', value: 'SZGH-990TDb' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
    ],
    compatibility: ['CNC Lathes', 'Multi-Tool Turning Machines'],
  },
  {
    id: 'prod-cnc-990tdc-2',
    title: 'Industrial CNC Lathe & Turning Center Controller (990TDc Series)',
    modelNumber: 'SZGH-CNC990TDc-2',
    category: 'Controllers',
    subcategory: 'Lathe controller',
    description:
      'High-performance SZGH-990TDc CNC lathe and turning center controller featuring 8.0" color LCD, real-time toolpath tracking display, user-centered tactile function control buttons, macro programming, and USB DNC interface.',
    features: [
      'High-speed interpolation with 0.001mm command resolution and real-time toolpath tracking display',
      'User-centered operator console with dedicated function control buttons for spindle, chuck, coolant, and rapid override',
      'Complete system compatibility with servo kit, spindle kit, rotary encoder, optically isolated I/O board, and MPG handwheel',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 170000,
    usdEstimate: 612,
    inStock: true,
    stockCount: 18,
    defaultImageIndex: SZGH_990TDC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_990TDC_IMAGES,
    imageLabels: SZGH_990TDC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-990TDc' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Rapid Traverse Limit', value: '60,000 mm/min' },
      { label: 'Display Screen', value: '8.0" Industrial Color TFT LCD (800×600)' },
      { label: 'I/O Interface', value: 'Opto-Isolated PLC I/O + External I/O Board Support' },
    ],
    compatibility: ['Flat-Bed & Slant-Bed CNC Lathes', 'Conventional Lathe Retrofits', 'Production Turning Machines'],
  },
  {
    id: 'prod-cnc-990tdc-3',
    title: 'Industrial CNC Lathe & Live-Tooling Turning Controller (990TDc Series)',
    modelNumber: 'SZGH-CNC990TDc-3',
    category: 'Controllers',
    subcategory: 'Lathe controller',
    description:
      'Industrial SZGH-990TDc CNC lathe controller for turning machines with spindle indexing, live-tool milling, real-time toolpath tracking display, and USB DNC.',
    features: [
      'Simultaneous turning and live-tool interpolation with 0.001mm resolution',
      'Direct support for 4-to-12 station electric/hydraulic tool posts, chuck, and tailstock control',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 190000,
    usdEstimate: 683,
    inStock: true,
    stockCount: 14,
    defaultImageIndex: SZGH_990TDC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_990TDC_IMAGES,
    imageLabels: SZGH_990TDC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-990TDc' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Display Screen', value: '8.0" Industrial Color TFT LCD (800×600)' },
    ],
    compatibility: ['Turn-Mill CNC Lathes', 'Slant-Bed Turning Centers'],
  },
  {
    id: 'prod-cnc-990tdc-4',
    title: 'Industrial Multi-Axis CNC Lathe & Milling-Turn Controller (990TDc Series)',
    modelNumber: 'SZGH-CNC990TDc-4',
    category: 'Controllers',
    subcategory: 'Lathe controller',
    description:
      'Multi-axis SZGH-990TDc CNC lathe and turn-mill controller with simultaneous X/Z/C/A interpolation, real-time toolpath tracking display, and complete servo/spindle/encoder/I/O/MPG integration.',
    features: [
      'Full simultaneous X/Z/C/A control in an ergonomic 8.0" LCD operator console',
      'Supports electric/hydraulic turrets, gang tooling, dual spindles, and external I/O relay boards',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 210000,
    usdEstimate: 755,
    inStock: true,
    stockCount: 10,
    defaultImageIndex: SZGH_990TDC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_990TDC_IMAGES,
    imageLabels: SZGH_990TDC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-990TDc' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Display Screen', value: '8.0" Industrial Color TFT LCD (800×600)' },
    ],
    compatibility: ['Multi-Tasking CNC Lathes', 'Multi-Tool Turning & Milling Machines'],
  },
  {
    id: 'prod-cnc-880tc-2',
    title: 'Industrial CNC Lathe & Turning Controller (880TC Series)',
    modelNumber: 'SZGH-880TC-2',
    category: 'Controllers',
    subcategory: 'Lathe controller',
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
    defaultImageIndex: SZGH_880TC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_880TC_IMAGES,
    imageLabels: SZGH_880TC_IMAGE_LABELS,
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
    subcategory: 'Lathe controller',
    description:
      'SZGH-880TC CNC turning & live-tooling lathe controller supporting spindle indexing, rigid tapping, and multi-station ATC turrets.',
    features: [
      'Simultaneous interpolation for turn-mill machining',
      'Built-in PLC logic for 4–12 station turrets, hydraulic chucks, and tailstocks',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 198000,
    usdEstimate: 712,
    inStock: true,
    stockCount: 12,
    defaultImageIndex: SZGH_880TC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_880TC_IMAGES,
    imageLabels: SZGH_880TC_IMAGE_LABELS,
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
    subcategory: 'Lathe controller',
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
    defaultImageIndex: SZGH_880TC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_880TC_IMAGES,
    imageLabels: SZGH_880TC_IMAGE_LABELS,
    specs: [
      { label: 'Minimum Command Unit', value: '0.001 mm' },
    ],
    compatibility: ['Turn-Mill Centers', 'Production Lathes'],
  },
  {
    id: 'prod-cnc-880tic-2',
    title: 'Industrial Bus-Type Dual-Panel CNC Lathe & Turning Center Controller (880TIC Series)',
    modelNumber: 'SZGH-880TIC-2',
    category: 'Controllers',
    subcategory: 'Lathe controller',
    description:
      'High-stability SZGH-880TIC bus-type dual-panel CNC lathe and turning center controller featuring high-resolution color LCD, full alphanumeric MDI console, dedicated lower machine operator station, turret & spindle PLC logic, MODBUS/Ethernet/Subpanel bus interfaces, MPG handwheel port, and optically isolated I/O expansion support.',
    features: [
      'Dual-panel industrial turning console with upper LCD/MDI programmer unit and lower tactile machine operator panel',
      'High-speed CNC bus architecture with MODBUS, Ethernet, Subpanel, Servo Spindle, Encoder, and Output/Input interfaces',
      'Built-in PLC logic for 4–12 station electric/hydraulic turrets, hydraulic chucks, and tailstocks',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 190000,
    usdEstimate: 683,
    inStock: true,
    stockCount: 14,
    defaultImageIndex: SZGH_880TIC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_880TIC_IMAGES,
    imageLabels: SZGH_880TIC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-880TIC' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Operator Architecture', value: 'Dual-Panel Display & Tactile Lathe Operator Console' },
      { label: 'Rear Interfaces', value: 'Output 1/2, Enter 1/2, Servo Spindle, Encoder, Subpanel, MODBUS, Ethernet & Analog' },
    ],
    compatibility: ['Slant-Bed CNC Lathes', 'CNC Turning Centers', 'Flat-Bed Production Lathes'],
  },
  {
    id: 'prod-cnc-880tic-3',
    title: 'Industrial Bus-Type Dual-Panel CNC Lathe & Milling-Turn Controller (880TIC Series)',
    modelNumber: 'SZGH-880TIC-3',
    category: 'Controllers',
    subcategory: 'Lathe controller',
    description:
      'High-stability SZGH-880TIC bus-type dual-panel CNC turning & live-tooling lathe controller supporting C-axis spindle indexing, rigid tapping, multi-station ATC turrets, MODBUS/Ethernet/Subpanel bus interfaces, and optically isolated I/O expansion support.',
    features: [
      'Simultaneous interpolation for turning and live-tool milling operations',
      'Dual-panel industrial turning console with upper LCD/MDI programmer unit and lower tactile machine operator panel',
      'High-speed CNC bus architecture with MODBUS, Ethernet, Subpanel, Servo Spindle, Encoder, and Output/Input interfaces',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 215000,
    usdEstimate: 773,
    inStock: true,
    stockCount: 11,
    defaultImageIndex: SZGH_880TIC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_880TIC_IMAGES,
    imageLabels: SZGH_880TIC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-880TIC' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Operator Architecture', value: 'Dual-Panel Display & Tactile Lathe Operator Console' },
      { label: 'Rear Interfaces', value: 'Output 1/2, Enter 1/2, Servo Spindle, Encoder, Subpanel, MODBUS, Ethernet & Analog' },
    ],
    compatibility: ['Turn-Mill Lathes', 'Slant-Bed CNC Turning Centers'],
  },
  {
    id: 'prod-cnc-880tic-4',
    title: 'Industrial Bus-Type Dual-Panel CNC Turn-Mill & Y-Axis Lathe Controller (880TIC Series)',
    modelNumber: 'SZGH-880TIC-4',
    category: 'Controllers',
    subcategory: 'Lathe controller',
    description:
      'High-stability SZGH-880TIC bus-type dual-panel CNC turning controller for complex turn-mill centers, off-center Y-axis drilling/milling, dual-spindle synchronization, MODBUS/Ethernet/Subpanel bus interfaces, and optically isolated I/O expansion support.',
    features: [
      'Full simultaneous turn-mill control with dual analog spindle outputs and C/Y-axis interpolation',
      'Dual-panel industrial turning console with upper LCD/MDI programmer unit and lower tactile machine operator panel',
      'High-speed CNC bus architecture with MODBUS, Ethernet, Subpanel, Servo Spindle, Encoder, and Output/Input interfaces',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 240000,
    usdEstimate: 863,
    inStock: true,
    stockCount: 8,
    defaultImageIndex: SZGH_880TIC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_880TIC_IMAGES,
    imageLabels: SZGH_880TIC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-880TIC' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Operator Architecture', value: 'Dual-Panel Display & Tactile Lathe Operator Console' },
      { label: 'Rear Interfaces', value: 'Output 1/2, Enter 1/2, Servo Spindle, Encoder, Subpanel, MODBUS, Ethernet & Analog' },
    ],
    compatibility: ['Multi-Tasking Turn-Mill Centers', 'Production CNC Lathes'],
  },
  {
    id: 'prod-cnc-1080tc-2',
    title: 'Industrial Dual-Panel CNC Lathe & Turning Center Controller (1080TC Series)',
    modelNumber: 'SZGH-1080TC-2',
    category: 'Controllers',
    subcategory: 'Lathe controller',
    description:
      'Flagship SZGH-1080TC Plus dual-panel CNC lathe and turning center controller featuring high-resolution color LCD, full alphanumeric MDI console, dedicated lower machine operator station, turret & spindle PLC logic, RS485 interface, and optically isolated I/O expansion support.',
    features: [
      'Dual-panel industrial turning console with upper LCD/MDI programmer unit and lower tactile machine operator panel',
      'Built-in PLC logic for 4–12 station electric/hydraulic turrets, hydraulic chucks, and tailstocks',
      'Dedicated rear stainless steel DB25 connectors for X/Z/Y/A axes, Spindle, Tool Post, Handheld MPG, RS485, and I/O',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 235000,
    usdEstimate: 845,
    inStock: true,
    stockCount: 14,
    defaultImageIndex: SZGH_1080TC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_1080TC_IMAGES,
    imageLabels: SZGH_1080TC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-1080TC' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Operator Architecture', value: 'Dual-Panel Display & Tactile Lathe Operator Console' },
      { label: 'Rear Interfaces', value: 'CN1–CN4 Axes, CN9 Encoder, CN10 Spindle, CN11/12 I/O, CN13 Tool, CN15 RS485, CN16 MPG' },
    ],
    compatibility: ['Slant-Bed CNC Lathes', 'CNC Turning Centers', 'Heavy-Duty Flat-Bed Lathes'],
  },
  {
    id: 'prod-cnc-1080tc-3',
    title: 'Industrial Dual-Panel CNC Lathe & Milling-Turn Controller (1080TC Series)',
    modelNumber: 'SZGH-1080TC-3',
    category: 'Controllers',
    subcategory: 'Lathe controller',
    description:
      'Flagship SZGH-1080TC Plus dual-panel CNC turning & live-tooling lathe controller supporting C-axis spindle indexing, rigid tapping, multi-station ATC turrets, RS485 interface, and optically isolated I/O expansion support.',
    features: [
      'Simultaneous interpolation for turning and live-tool milling operations',
      'Dual-panel industrial turning console with upper LCD/MDI programmer unit and lower tactile machine operator panel',
      'Built-in PLC logic for 4–12 station turrets, live spindles, hydraulic chucks, and tailstocks',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 260000,
    usdEstimate: 935,
    inStock: true,
    stockCount: 11,
    defaultImageIndex: SZGH_1080TC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_1080TC_IMAGES,
    imageLabels: SZGH_1080TC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-1080TC' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Operator Architecture', value: 'Dual-Panel Display & Tactile Lathe Operator Console' },
      { label: 'Rear Interfaces', value: 'CN1–CN4 Axes, CN9 Encoder, CN10 Spindle, CN11/12 I/O, CN13 Tool, CN15 RS485, CN16 MPG' },
    ],
    compatibility: ['Turn-Mill Lathes', 'Slant-Bed CNC Turning Centers'],
  },
  {
    id: 'prod-cnc-1080tc-4',
    title: 'Industrial Dual-Panel CNC Turn-Mill & Y-Axis Lathe Controller (1080TC Series)',
    modelNumber: 'SZGH-1080TC-4',
    category: 'Controllers',
    subcategory: 'Lathe controller',
    description:
      'Flagship SZGH-1080TC Plus dual-panel CNC turning controller for complex turn-mill centers, off-center Y-axis drilling/milling, dual-spindle synchronization, and optically isolated I/O expansion support.',
    features: [
      'Full simultaneous turn-mill control with dual analog spindle outputs and C/Y-axis interpolation',
      'Dual-panel industrial turning console with upper LCD/MDI programmer unit and lower tactile machine operator panel',
      'Built-in PLC logic for live-tooling turrets and sub-spindle synchronization',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 285000,
    usdEstimate: 1025,
    inStock: true,
    stockCount: 8,
    defaultImageIndex: SZGH_1080TC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_1080TC_IMAGES,
    imageLabels: SZGH_1080TC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-1080TC' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Operator Architecture', value: 'Dual-Panel Display & Tactile Lathe Operator Console' },
      { label: 'Rear Interfaces', value: 'CN1–CN4 Axes, CN9 Encoder, CN10 Spindle, CN11/12 I/O, CN13 Tool, CN15 RS485, CN16 MPG' },
    ],
    compatibility: ['Multi-Tasking Turn-Mill Centers', 'Production CNC Lathes'],
  },
  {
    id: 'prod-cnc-880mc-3',
    title: 'Industrial CNC Milling & Drilling Machine Controller (880MC Series)',
    modelNumber: 'SZGH-880MC-3',
    category: 'Controllers',
    subcategory: 'Drilling and milling machine CNC controller',
    description:
      'High-reliability SZGH-880MC CNC milling and drilling controller featuring 8.4" color LCD, ATC PLC support, RS485 interface, MPG handwheel port, and optically isolated I/O expansion support.',
    features: [
      'Simultaneous linear, circular, and helical interpolation with high-speed look-ahead control',
      'Built-in open PLC ladder for Umbrella, Linear, and Arm-Type Automatic Tool Changers (ATC)',
      'Dedicated rear DB25 connectors for X/Y/Z/A axes, Spindle, Tool Magazine, Handheld MPG, and Input/Output',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 185000,
    usdEstimate: 665,
    inStock: true,
    stockCount: 15,
    defaultImageIndex: SZGH_880MC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_880MC_IMAGES,
    imageLabels: SZGH_880MC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-880MC' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Display Screen', value: '8.4" Industrial Color TFT LCD' },
      { label: 'Rear Interfaces', value: 'CN1–CN4 Axes, CN9 Encoder, CN10 Spindle, CN11/12 I/O, CN13 Tool, CN15 RS485, CN16 MPG' },
    ],
    compatibility: ['Vertical Machining Centers (VMC)', 'CNC Milling & Drilling Machines'],
  },
  {
    id: 'prod-cnc-880mc-4',
    title: 'Industrial CNC Milling, Drilling & Rotary Axis Controller (880MC Series)',
    modelNumber: 'SZGH-880MC-4',
    category: 'Controllers',
    subcategory: 'Drilling and milling machine CNC controller',
    description:
      'High-reliability SZGH-880MC CNC milling and drilling controller with rotary indexing table control, 8.4" color LCD, ATC PLC support, RS485 interface, and optically isolated I/O expansion support.',
    features: [
      'Simultaneous interpolation for VMC and rotary table milling operations',
      'Built-in open PLC ladder for Umbrella, Linear, and Arm-Type Automatic Tool Changers (ATC)',
      'Dedicated rear DB25 connectors for X/Y/Z/A axes, Spindle, Tool Magazine, Handheld MPG, and Input/Output',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 210000,
    usdEstimate: 755,
    inStock: true,
    stockCount: 12,
    defaultImageIndex: SZGH_880MC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_880MC_IMAGES,
    imageLabels: SZGH_880MC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-880MC' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Display Screen', value: '8.4" Industrial Color TFT LCD' },
      { label: 'Rear Interfaces', value: 'CN1–CN4 Axes, CN9 Encoder, CN10 Spindle, CN11/12 I/O, CN13 Tool, CN15 RS485, CN16 MPG' },
    ],
    compatibility: ['Vertical Machining Centers (VMC)', 'Rotary Table Milling & Drilling Machines'],
  },
  {
    id: 'prod-cnc-880mc-5',
    title: 'Industrial Multi-Axis CNC Milling & Drilling Controller (880MC Series)',
    modelNumber: 'SZGH-880MC-5',
    category: 'Controllers',
    subcategory: 'Drilling and milling machine CNC controller',
    description:
      'High-reliability SZGH-880MC multi-axis CNC milling and drilling controller featuring 8.4" color LCD, ATC PLC support, RS485 interface, MPG handwheel port, and optically isolated I/O expansion support.',
    features: [
      'Simultaneous multi-axis interpolation with look-ahead contour smoothing',
      'Built-in open PLC ladder for Umbrella, Linear, and Arm-Type Automatic Tool Changers (ATC)',
      'Dedicated rear DB25 connectors for axes, Spindle, Tool Magazine, Handheld MPG, and Input/Output',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 235000,
    usdEstimate: 845,
    inStock: true,
    stockCount: 8,
    defaultImageIndex: SZGH_880MC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_880MC_IMAGES,
    imageLabels: SZGH_880MC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-880MC' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Display Screen', value: '8.4" Industrial Color TFT LCD' },
      { label: 'Rear Interfaces', value: 'CN1–CN4 Axes, CN9 Encoder, CN10 Spindle, CN11/12 I/O, CN13 Tool, CN15 RS485, CN16 MPG' },
    ],
    compatibility: ['Multi-Axis Machining Centers', 'CNC Milling & Drilling Machines'],
  },
  {
    id: 'prod-cnc-1080mc-3',
    title: 'Industrial Dual-Panel CNC Milling & Machining Center Controller (1080MC Series)',
    modelNumber: 'SZGH-1080MC-3',
    category: 'Controllers',
    subcategory: 'Drilling and milling machine CNC controller',
    description:
      'Flagship SZGH-1080MC Plus dual-panel CNC milling and machining center controller featuring high-resolution color LCD, full alphanumeric MDI console, dedicated machine control panel, ATC PLC ladder support, RS485 interface, MPG handwheel port, and optically isolated I/O expansion support.',
    features: [
      'Dual-panel industrial console with upper display/MDI programmer unit and lower tactile machine operator station',
      'Simultaneous linear, circular, and helical interpolation with high-speed look-ahead smoothing',
      'Built-in open PLC ladder for Umbrella, Linear, and Arm-Type Automatic Tool Changers (ATC)',
      'Dedicated rear stainless steel DB25 connectors for X/Y/Z/A/B axes, Spindle, Tool Magazine, Handheld MPG, RS485, and I/O',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 245000,
    usdEstimate: 880,
    inStock: true,
    stockCount: 12,
    defaultImageIndex: SZGH_1080MC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_1080MC_IMAGES,
    imageLabels: SZGH_1080MC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-1080MC' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Operator Architecture', value: 'Dual-Panel Display & Tactile Machine Control Console' },
      { label: 'Rear Interfaces', value: 'CN1–CN4 Axes, CN9 Encoder, CN10 Spindle, CN11/12 I/O, CN13 Tool, CN15 RS485, CN16 MPG' },
    ],
    compatibility: ['Vertical Machining Centers (VMC)', 'CNC Milling & Drilling Machines', 'Gantry Mills'],
  },
  {
    id: 'prod-cnc-1080mc-4',
    title: 'Industrial Dual-Panel CNC Milling & Rotary Axis Controller (1080MC Series)',
    modelNumber: 'SZGH-1080MC-4',
    category: 'Controllers',
    subcategory: 'Drilling and milling machine CNC controller',
    description:
      'Flagship SZGH-1080MC Plus dual-panel CNC milling and rotary indexing controller featuring high-resolution color LCD, dedicated machine control panel, ATC PLC ladder support, RS485 interface, MPG handwheel port, and optically isolated I/O expansion support.',
    features: [
      'Simultaneous interpolation for VMC and rotary indexing table machining operations',
      'Dual-panel industrial console with upper display/MDI programmer unit and lower tactile machine operator station',
      'Built-in open PLC ladder for Umbrella, Linear, and Arm-Type Automatic Tool Changers (ATC)',
      'Dedicated rear stainless steel DB25 connectors for axes, Spindle, Tool Magazine, Handheld MPG, RS485, and I/O',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 270000,
    usdEstimate: 970,
    inStock: true,
    stockCount: 10,
    defaultImageIndex: SZGH_1080MC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_1080MC_IMAGES,
    imageLabels: SZGH_1080MC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-1080MC' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Operator Architecture', value: 'Dual-Panel Display & Tactile Machine Control Console' },
      { label: 'Rear Interfaces', value: 'CN1–CN4 Axes, CN9 Encoder, CN10 Spindle, CN11/12 I/O, CN13 Tool, CN15 RS485, CN16 MPG' },
    ],
    compatibility: ['Vertical Machining Centers (VMC)', 'Rotary Table Milling & Drilling Machines'],
  },
  {
    id: 'prod-cnc-1080mc-5',
    title: 'Industrial Dual-Panel Multi-Axis CNC Milling & Machining Center Controller (1080MC Series)',
    modelNumber: 'SZGH-1080MC-5',
    category: 'Controllers',
    subcategory: 'Drilling and milling machine CNC controller',
    description:
      'Flagship SZGH-1080MC Plus dual-panel multi-axis CNC milling and machining center controller featuring high-resolution color LCD, dedicated machine control panel, ATC PLC ladder support, RS485 interface, MPG handwheel port, and optically isolated I/O expansion support.',
    features: [
      'Simultaneous multi-axis interpolation with high-speed RTCP look-ahead contour smoothing',
      'Dual-panel industrial console with upper display/MDI programmer unit and lower tactile machine operator station',
      'Built-in open PLC ladder for Umbrella, Linear, and Arm-Type Automatic Tool Changers (ATC)',
      'Dedicated rear stainless steel DB25 connectors for axes, Spindle, Tool Magazine, Handheld MPG, RS485, and I/O',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 295000,
    usdEstimate: 1060,
    inStock: true,
    stockCount: 7,
    defaultImageIndex: SZGH_1080MC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_1080MC_IMAGES,
    imageLabels: SZGH_1080MC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-1080MC' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Operator Architecture', value: 'Dual-Panel Display & Tactile Machine Control Console' },
      { label: 'Rear Interfaces', value: 'CN1–CN4 Axes, CN9 Encoder, CN10 Spindle, CN11/12 I/O, CN13 Tool, CN15 RS485, CN16 MPG' },
    ],
    compatibility: ['Multi-Axis Machining Centers', 'CNC Milling & Mold Centers'],
  },
  {
    id: 'prod-cnc-1080mic-3',
    title: 'Industrial Bus-Type Dual-Panel CNC Milling & Machining Center Controller (1080MIC Series)',
    modelNumber: 'SZGH-1080MIC-3',
    category: 'Controllers',
    subcategory: 'Drilling and milling machine CNC controller',
    description:
      'Flagship SZGH-1080MiC Plus bus-type dual-panel CNC milling and machining center controller featuring high-resolution color LCD, full alphanumeric MDI console, dedicated lower machine operator station, ATC PLC ladder support, MODBUS/Ethernet/Subpanel bus interfaces, MPG handwheel port, and optically isolated I/O expansion support.',
    features: [
      'Dual-panel industrial console with upper display/MDI programmer unit and lower tactile machine operator station',
      'High-speed CNC bus architecture with MODBUS, Ethernet, Subpanel, Analog Spindle, Encoder, and I/O interfaces',
      'Built-in open PLC ladder for Umbrella, Linear, and Arm-Type Automatic Tool Changers (ATC)',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 255000,
    usdEstimate: 917,
    inStock: true,
    stockCount: 12,
    defaultImageIndex: SZGH_1080MIC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_1080MIC_IMAGES,
    imageLabels: SZGH_1080MIC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-1080MIC' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Operator Architecture', value: 'Dual-Panel Display & Tactile Machine Control Console' },
      { label: 'Rear Interfaces', value: 'MPG, Encoder, Subpanel, MODBUS, Ethernet, Analog, Axis, Output & Input' },
    ],
    compatibility: ['Vertical Machining Centers (VMC)', 'CNC Milling & Drilling Machines', 'Gantry Mills'],
  },
  {
    id: 'prod-cnc-1080mic-4',
    title: 'Industrial Bus-Type Dual-Panel CNC Milling & Rotary Axis Controller (1080MIC Series)',
    modelNumber: 'SZGH-1080MIC-4',
    category: 'Controllers',
    subcategory: 'Drilling and milling machine CNC controller',
    description:
      'Flagship SZGH-1080MiC Plus bus-type dual-panel CNC milling and rotary indexing controller featuring high-resolution color LCD, dedicated lower machine operator station, ATC PLC ladder support, MODBUS/Ethernet/Subpanel bus interfaces, MPG handwheel port, and optically isolated I/O expansion support.',
    features: [
      'Simultaneous interpolation for VMC and rotary indexing table machining operations',
      'Dual-panel industrial console with upper display/MDI programmer unit and lower tactile machine operator station',
      'High-speed CNC bus architecture with MODBUS, Ethernet, Subpanel, Analog Spindle, Encoder, and I/O interfaces',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 280000,
    usdEstimate: 1007,
    inStock: true,
    stockCount: 9,
    defaultImageIndex: SZGH_1080MIC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_1080MIC_IMAGES,
    imageLabels: SZGH_1080MIC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-1080MIC' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Operator Architecture', value: 'Dual-Panel Display & Tactile Machine Control Console' },
      { label: 'Rear Interfaces', value: 'MPG, Encoder, Subpanel, MODBUS, Ethernet, Analog, Axis, Output & Input' },
    ],
    compatibility: ['Vertical Machining Centers (VMC)', 'Rotary Table Milling & Drilling Machines'],
  },
  {
    id: 'prod-cnc-1080mic-5',
    title: 'Industrial Bus-Type Dual-Panel Multi-Axis CNC Milling Controller (1080MIC Series)',
    modelNumber: 'SZGH-1080MIC-5',
    category: 'Controllers',
    subcategory: 'Drilling and milling machine CNC controller',
    description:
      'Flagship SZGH-1080MiC Plus bus-type dual-panel multi-axis CNC milling and machining center controller featuring high-resolution color LCD, dedicated lower machine operator station, ATC PLC ladder support, MODBUS/Ethernet/Subpanel bus interfaces, MPG handwheel port, and optically isolated I/O expansion support.',
    features: [
      'Simultaneous multi-axis interpolation with high-speed RTCP look-ahead contour smoothing',
      'Dual-panel industrial console with upper display/MDI programmer unit and lower tactile machine operator station',
      'High-speed CNC bus architecture with MODBUS, Ethernet, Subpanel, Analog Spindle, Encoder, and I/O interfaces',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 305000,
    usdEstimate: 1097,
    inStock: true,
    stockCount: 6,
    defaultImageIndex: SZGH_1080MIC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_1080MIC_IMAGES,
    imageLabels: SZGH_1080MIC_IMAGE_LABELS,
    specs: [
      { label: 'Model Series', value: 'SZGH-1080MIC' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Operator Architecture', value: 'Dual-Panel Display & Tactile Machine Control Console' },
      { label: 'Rear Interfaces', value: 'MPG, Encoder, Subpanel, MODBUS, Ethernet, Analog, Axis, Output & Input' },
    ],
    compatibility: ['Multi-Axis Machining Centers', 'CNC Milling & Mold Centers'],
  },
  {
    id: 'prod-cnc-990mdb-3',
    title: 'High-Speed CNC Milling, Drilling & Engraving Controller (990MDb Series)',
    modelNumber: 'SZGH-CNC990MDb-3',
    category: 'Controllers',
    subcategory: 'Engraving CNC controller',
    description:
      'Dedicated high-speed CNC milling, drilling, and engraving controller for die/mold engraving, precision routing, and high-RPM spindle machining centers with USB DNC drip-feeding.',
    features: [
      'High-speed small-segment look-ahead interpolation for smooth 3D engraving and mold cavities',
      'Supports high-frequency engraving & milling spindles via 0-10V analog and RS485 Modbus',
      'Automatic Z-axis tool length setter macro and power-failure resume engraving function',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 172000,
    usdEstimate: 618,
    inStock: true,
    stockCount: 14,
    defaultImageIndex: SZGH_990MDB_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_990MDB_IMAGES as [string, string, string, string],
    imageLabels: SZGH_990MDB_IMAGE_LABELS as [string, string, string, string],
    specs: [
      { label: 'Model Series', value: 'SZGH-990MDb' },
      { label: 'Application Focus', value: 'High-Speed 3D Engraving, Mold & Milling Control' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Display Screen', value: '8.0" Industrial Color TFT LCD' },
    ],
    compatibility: ['CNC Engraving Machines', 'Die & Brass Mold Engravers', 'Gantry CNC Routers'],
  },
  {
    id: 'prod-cnc-990mdb-4',
    title: 'High-Speed CNC Milling, Drilling & Rotary Engraving Controller (990MDb Series)',
    modelNumber: 'SZGH-CNC990MDb-4',
    category: 'Controllers',
    subcategory: 'Engraving CNC controller',
    description:
      'Industrial SZGH-990MDb CNC milling, drilling, and rotary engraving controller with simultaneous interpolation, real-time toolpath tracking display, and USB DNC.',
    features: [
      'Simultaneous rotary indexing and 3D contour milling interpolation',
      'User-centered operator panel with tactile function buttons and MPG handwheel support',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 192000,
    usdEstimate: 690,
    inStock: true,
    stockCount: 10,
    defaultImageIndex: SZGH_990MDB_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_990MDB_IMAGES as [string, string, string, string],
    imageLabels: SZGH_990MDB_IMAGE_LABELS as [string, string, string, string],
    specs: [
      { label: 'Model Series', value: 'SZGH-990MDb' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Display Screen', value: '8.0" Industrial Color TFT LCD' },
    ],
    compatibility: ['Rotary CNC Engravers', 'Drilling & Milling Machines', 'Mold Routers'],
  },
  {
    id: 'prod-cnc-990mdc-3',
    title: 'Industrial CNC Milling, Drilling & Engraving Controller (990MDc Series)',
    modelNumber: 'SZGH-CNC990MDc-3',
    category: 'Controllers',
    subcategory: 'Engraving CNC controller',
    description:
      'High-performance SZGH-990MDc CNC milling, drilling, and engraving controller featuring 8.0" color LCD, real-time toolpath tracking display, macro programming, and USB DNC drip-feeding.',
    features: [
      'High-speed small-segment look-ahead interpolation for smooth 3D mold, router, and milling operations',
      'User-centered operator panel with dedicated function control buttons and emergency stop',
      'Complete system compatibility with MPG handwheel, optically isolated I/O board, spindle, and servo drives',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 178000,
    usdEstimate: 640,
    inStock: true,
    stockCount: 15,
    defaultImageIndex: SZGH_990MDC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_990MDC_IMAGES as [string, string, string, string],
    imageLabels: SZGH_990MDC_IMAGE_LABELS as [string, string, string, string],
    specs: [
      { label: 'Model Series', value: 'SZGH-990MDc' },
      { label: 'Application Focus', value: 'High-Speed Milling, Drilling & 3D Engraving Control' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Display Screen', value: '8.0" Industrial Color TFT LCD' },
    ],
    compatibility: ['CNC Milling & Drilling Machines', 'CNC Engraving Machines', 'Gantry CNC Routers'],
  },
  {
    id: 'prod-cnc-990mdc-4',
    title: 'Industrial CNC Milling, Drilling & Rotary Engraving Controller (990MDc Series)',
    modelNumber: 'SZGH-CNC990MDc-4',
    category: 'Controllers',
    subcategory: 'Engraving CNC controller',
    description:
      'Industrial SZGH-990MDc CNC milling, drilling, and rotary engraving controller with simultaneous interpolation, real-time toolpath tracking display, and USB DNC.',
    features: [
      'Simultaneous rotary indexing and 3D contour milling interpolation',
      'User-centered operator panel with tactile function buttons and MPG handwheel support',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 198000,
    usdEstimate: 712,
    inStock: true,
    stockCount: 11,
    defaultImageIndex: SZGH_990MDC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: SZGH_990MDC_IMAGES as [string, string, string, string],
    imageLabels: SZGH_990MDC_IMAGE_LABELS as [string, string, string, string],
    specs: [
      { label: 'Model Series', value: 'SZGH-990MDc' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Display Screen', value: '8.0" Industrial Color TFT LCD' },
    ],
    compatibility: ['Rotary CNC Engravers', 'Drilling & Milling Machines', 'Mold Routers'],
  },
  {
    id: 'prod-cnc-1000mdc-3',
    title: 'Industrial CNC Milling, Drilling & Engraving Controller (1000MDc Series) (A+B Panel)',
    modelNumber: 'SZGH-CNC1000MDc-3 (A+B Panel)',
    category: 'Controllers',
    subcategory: 'Engraving CNC controller',
    description:
      'High-performance SZGH-1000MDc (CNC Series 1000MDc) CNC milling, drilling, and engraving controller (A+B Panel) featuring 8.4" color TFT LCD, real-time 3D toolpath tracking display, user-centered function control buttons, ATC PLC ladder support, and USB DNC drip-feeding.',
    features: [
      'High-speed small-segment look-ahead interpolation with real-time 3D toolpath tracking display',
      'User-centered operator console with dedicated tactile function control buttons and optional lower machine operator panel',
      'Complete system compatibility with MPG handwheel, optically isolated I/O board, spindle motor/driver, and servo motor/driver kits',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 222000,
    usdEstimate: 799,
    inStock: true,
    stockCount: 16,
    defaultImageIndex: SZGH_1000MDC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [...SZGH_1000MDC_IMAGES, ...SZGH_AB_PANEL_IMAGES],
    imageLabels: [...SZGH_1000MDC_IMAGE_LABELS, ...SZGH_AB_PANEL_IMAGE_LABELS],
    specs: [
      { label: 'Model Series', value: 'SZGH-1000MDc (CNC 1000MDc)' },
      { label: 'Application Focus', value: 'High-Speed Milling, Drilling, VMC & 3D Engraving Control' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Display Screen', value: '8.4" Industrial Color TFT LCD (800×600)' },
    ],
    compatibility: ['Vertical Machining Centers (VMC)', 'CNC Milling & Drilling Machines', 'Mold & Engraving Centers'],
  },
  {
    id: 'prod-cnc-1000mdc-4',
    title: 'Industrial CNC Milling, Drilling & Rotary Engraving Controller (1000MDc Series) (A+B Panel)',
    modelNumber: 'SZGH-CNC1000MDc-4 (A+B Panel)',
    category: 'Controllers',
    subcategory: 'Engraving CNC controller',
    description:
      'Industrial SZGH-1000MDc (CNC Series 1000MDc) CNC milling, drilling, and rotary indexing controller (A+B Panel) featuring real-time toolpath tracking display, tactile function control buttons, ATC PLC support, and USB DNC.',
    features: [
      'Simultaneous rotary indexing and 3D contour milling interpolation',
      'User-centered operator console with dedicated tactile function control buttons and MPG handwheel support',
      'Complete system compatibility with MPG handwheel, optically isolated I/O board, spindle motor/driver, and servo motor/driver kits',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 246000,
    usdEstimate: 885,
    inStock: true,
    stockCount: 12,
    defaultImageIndex: SZGH_1000MDC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [...SZGH_1000MDC_IMAGES, ...SZGH_AB_PANEL_IMAGES],
    imageLabels: [...SZGH_1000MDC_IMAGE_LABELS, ...SZGH_AB_PANEL_IMAGE_LABELS],
    specs: [
      { label: 'Model Series', value: 'SZGH-1000MDc (CNC 1000MDc)' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Display Screen', value: '8.4" Industrial Color TFT LCD (800×600)' },
    ],
    compatibility: ['Rotary Table VMCs', 'Drilling & Milling Machines', 'Multi-Axis Mold Routers'],
  },
  {
    id: 'prod-cnc-1000mdc-5',
    title: 'Industrial Multi-Axis CNC Milling, Drilling & Mold Controller (1000MDc Series) (A+B Panel)',
    modelNumber: 'SZGH-CNC1000MDc-5 (A+B Panel)',
    category: 'Controllers',
    subcategory: 'Engraving CNC controller',
    description:
      'Flagship multi-axis SZGH-1000MDc (CNC Series 1000MDc) CNC milling, drilling, and mold engraving controller (A+B Panel) with simultaneous interpolation, real-time toolpath tracking display, PLC ATC support, and optically isolated I/O expansion.',
    features: [
      'Simultaneous multi-axis interpolation for complex mold, VMC, and rotary machining',
      'Complete system compatibility with MPG handwheel, optically isolated I/O board, spindle motor/driver, and servo motor/driver kits',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 272000,
    usdEstimate: 978,
    inStock: true,
    stockCount: 9,
    defaultImageIndex: SZGH_1000MDC_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [...SZGH_1000MDC_IMAGES, ...SZGH_AB_PANEL_IMAGES],
    imageLabels: [...SZGH_1000MDC_IMAGE_LABELS, ...SZGH_AB_PANEL_IMAGE_LABELS],
    specs: [
      { label: 'Model Series', value: 'SZGH-1000MDc (CNC 1000MDc)' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Display Screen', value: '8.4" Industrial Color TFT LCD (800×600)' },
    ],
    compatibility: ['Multi-Axis Machining Centers', 'Drilling & Milling Centers', 'High-Speed Mold Engraving Machines'],
  },
  {
    id: 'prod-cnc-1000mdcb-3',
    title: 'Industrial CNC Milling, Drilling & Engraving Controller (1000MDcb Series) (C+E Panel)',
    modelNumber: 'SZGH-CNC1000MDcb-3 (C+E Panel)',
    category: 'Controllers',
    subcategory: 'Engraving CNC controller',
    description:
      'High-performance SZGH-1000MDcb (CNC Series 1000MDcb) CNC milling, drilling, and engraving controller (C+E Panel) featuring 8.4" color TFT LCD, real-time 3D toolpath tracking display, user-centered function control buttons, lower operator panel with feed/spindle rate dials, ATC PLC ladder support, and USB DNC.',
    features: [
      'High-speed small-segment look-ahead interpolation with real-time 3D toolpath tracking display',
      'User-centered operator console with dedicated tactile function control buttons and lower operator station with Feed Rate & SP-Rate dials',
      'Complete system compatibility with MPG handwheel, optically isolated I/O board, spindle motor/driver, and servo motor/driver kits',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 226000,
    usdEstimate: 813,
    inStock: true,
    stockCount: 14,
    defaultImageIndex: SZGH_1000MDCB_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [...SZGH_1000MDCB_IMAGES, ...SZGH_CE_PANEL_IMAGES],
    imageLabels: [...SZGH_1000MDCB_IMAGE_LABELS, ...SZGH_CE_PANEL_IMAGE_LABELS],
    specs: [
      { label: 'Model Series', value: 'SZGH-1000MDcb (CNC 1000MDcb)' },
      { label: 'Application Focus', value: 'High-Speed Milling, Drilling, VMC & 3D Engraving Control' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Display Screen', value: '8.4" Industrial Color TFT LCD (800×600)' },
    ],
    compatibility: ['Vertical Machining Centers (VMC)', 'CNC Milling & Drilling Machines', 'Mold & Engraving Centers'],
  },
  {
    id: 'prod-cnc-1000mdcb-4',
    title: 'Industrial CNC Milling, Drilling & Rotary Engraving Controller (1000MDcb Series) (C+E Panel)',
    modelNumber: 'SZGH-CNC1000MDcb-4 (C+E Panel)',
    category: 'Controllers',
    subcategory: 'Engraving CNC controller',
    description:
      'Industrial SZGH-1000MDcb (CNC Series 1000MDcb) CNC milling, drilling, and rotary indexing controller (C+E Panel) featuring real-time toolpath tracking display, tactile function control buttons, lower operator panel with rotary feed/spindle override dials, ATC PLC support, and USB DNC.',
    features: [
      'Simultaneous rotary indexing and 3D contour milling interpolation',
      'User-centered operator console with dedicated tactile function control buttons and lower operator station with Feed Rate & SP-Rate dials',
      'Complete system compatibility with MPG handwheel, optically isolated I/O board, spindle motor/driver, and servo motor/driver kits',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 250000,
    usdEstimate: 899,
    inStock: true,
    stockCount: 10,
    defaultImageIndex: SZGH_1000MDCB_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [...SZGH_1000MDCB_IMAGES, ...SZGH_CE_PANEL_IMAGES],
    imageLabels: [...SZGH_1000MDCB_IMAGE_LABELS, ...SZGH_CE_PANEL_IMAGE_LABELS],
    specs: [
      { label: 'Model Series', value: 'SZGH-1000MDcb (CNC 1000MDcb)' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Display Screen', value: '8.4" Industrial Color TFT LCD (800×600)' },
    ],
    compatibility: ['Rotary Table VMCs', 'Drilling & Milling Machines', 'Multi-Axis Mold Routers'],
  },
  {
    id: 'prod-cnc-1000mdcb-5',
    title: 'Industrial Multi-Axis CNC Milling, Drilling & Mold Controller (1000MDcb Series) (C+E Panel)',
    modelNumber: 'SZGH-CNC1000MDcb-5 (C+E Panel)',
    category: 'Controllers',
    subcategory: 'Engraving CNC controller',
    description:
      'Flagship multi-axis SZGH-1000MDcb (CNC Series 1000MDcb) CNC milling, drilling, and mold engraving controller (C+E Panel) with simultaneous interpolation, real-time toolpath tracking display, lower operator panel with rotary feed/spindle override dials, PLC ATC support, and optically isolated I/O expansion.',
    features: [
      'Simultaneous multi-axis interpolation for complex mold, VMC, and rotary machining',
      'Complete system compatibility with MPG handwheel, optically isolated I/O board, spindle motor/driver, and servo motor/driver kits',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 276000,
    usdEstimate: 993,
    inStock: true,
    stockCount: 8,
    defaultImageIndex: SZGH_1000MDCB_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [...SZGH_1000MDCB_IMAGES, ...SZGH_CE_PANEL_IMAGES],
    imageLabels: [...SZGH_1000MDCB_IMAGE_LABELS, ...SZGH_CE_PANEL_IMAGE_LABELS],
    specs: [
      { label: 'Model Series', value: 'SZGH-1000MDcb (CNC 1000MDcb)' },
      { label: 'Minimum Command Unit', value: '0.001 mm' },
      { label: 'Display Screen', value: '8.4" Industrial Color TFT LCD (800×600)' },
    ],
    compatibility: ['Multi-Axis Machining Centers', 'Drilling & Milling Centers', 'High-Speed Mold Engraving Machines'],
  },
  {
    id: 'prod-cnc-1000g-2',
    title: 'Precision Cylindrical & Surface CNC Grinder Controller',
    modelNumber: 'SZGH-CNC1000G-2',
    category: 'Controllers',
    subcategory: 'Grinder controller',
    description:
      'Specialized CNC grinder controller for cylindrical grinders, surface grinding machines, and centerless grinding systems with automatic wheel dressing compensation.',
    features: [
      'Dedicated grinding canned cycles: plunge grinding, traverse grinding, oscillation, and spark-out dwell',
      'Automatic diamond wheel dressing cycle with real-time wheel diameter wear compensation',
      'Sub-micron 0.0005mm interpolation resolution for mirror-finish cylindrical and surface grinding',
      'Compatible with Without I/O and With I/O (+PKR 20,000) expansion board configurations',
    ],
    price: 235000,
    usdEstimate: 845,
    inStock: true,
    stockCount: 7,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: true,
    images: [
      HERO_SHOWCASE_PHOTOS.controllers,
      ...createIndustrialProductGallery(
        'SZGH-CNC1000G-2',
        'Controllers',
        '#0d9488',
        '400 × 245 × 110 mm',
        '24VDC / Precision Grinding Control'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Grinder Operator Console',
      'CAD Panel Cutout',
      'Wheel Dresser & Gauge I/O',
      'Grinding Machine Topology',
    ],
    specs: [
      { label: 'Grinding Cycles', value: 'Plunge, Traverse, Shoulder & Automatic Wheel Dressing' },
      { label: 'Minimum Command Unit', value: '0.001 mm / 0.0005 mm Fine Mode' },
      { label: 'Display Screen', value: '8.4" Industrial Color TFT LCD' },
    ],
    compatibility: ['Cylindrical Grinders', 'Reciprocating Surface Grinders', 'Internal Bore Grinders'],
  },
  {
    id: 'prod-cnc-io12',
    title: 'Optical Isolated I/O Expansion Board for CNC Controllers',
    modelNumber: 'CNC-IO12',
    category: 'Controllers',
    subcategory: 'Drilling and milling machine CNC controller',
    description:
      'I/O board is recommended for controllers. Provides optically isolated 24VDC input/output terminal conditioning and relay outputs for SZGH CNC lathe, milling, engraving, and grinder controllers.',
    features: [
      'Optically isolated inputs and relay outputs protecting the main CNC controller CPU from shop-floor voltage spikes',
      'Direct DB25 / ribbon cable plug-and-play connection with SZGH 880, 990, and 1000 series controllers',
      'DIN-rail mountable industrial PCB with LED status indicators on every channel',
    ],
    price: 20000,
    usdEstimate: 72,
    inStock: true,
    stockCount: 45,
    defaultImageIndex: SZGH_CNC_IO12_DEFAULT_IMAGE_INDEX,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: false,
    images: SZGH_CNC_IO12_IMAGES,
    imageLabels: SZGH_CNC_IO12_IMAGE_LABELS,
    specs: [
      { label: 'Model Number', value: 'CNC-IO12' },
      { label: 'Protection', value: '24VDC Opto-Isolated Inputs & Relay Outputs' },
      { label: 'Mounting', value: 'Standard 35mm Electrical Cabinet DIN Rail' },
    ],
    compatibility: ['All SZGH CNC Lathe, Milling, Engraving & Grinder Controllers'],
  },

  // ==========================================================================
  // CATEGORY 2: MOTORS & DRIVERS
  //   Group A: Servo Motors and Drives -> 'Servo motor', 'Servo Driver'
  //   Group B: Spindle Servo Motors and Drivers -> 'Spindle servo motor', 'Spindle servo driver'
  //   Group C: Stepper Motors and Drivers -> 'Closed Loop Stepper Motors and Drivers',
  //            'Two-phase stepper motor and driver', 'Three-phase stepper motors and drivers'
  // ==========================================================================
  {
    id: 'prod-servo-13200cc',
    title: '2.0kW High-Torque AC Servo Motor & Matched Digital Drive Kit',
    modelNumber: 'SZGH-13200CC + SD2026',
    category: 'Motors',
    subcategory: 'Servo motor',
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
    id: 'prod-servo-driver-sd2026',
    title: 'SZGH-SD2026 Digital AC Servo Driver (Position / Speed / Torque)',
    modelNumber: 'SZGH-SD2026',
    category: 'Motors',
    subcategory: 'Servo Driver',
    description:
      'High-response digital AC servo driver supporting pulse/direction, analog voltage, and RS485 Modbus communication for 1.0kW to 2.6kW AC servo motors.',
    features: [
      'Triple-loop DSP vector control (Position, Speed, and Current/Torque modes) with online auto-tuning',
      'Supports 2500-PPR incremental and 17-bit/23-bit absolute optical encoders',
      'Built-in regenerative braking circuit, over-current, over-voltage, and encoder fault protection',
      'Direct plug-and-play CN1/CN2 interface with all SZGH CNC controllers',
    ],
    price: 62000,
    usdEstimate: 223,
    inStock: true,
    stockCount: 28,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: false,
    images: [
      HERO_SHOWCASE_PHOTOS.motors,
      ...createIndustrialProductGallery(
        'SZGH-SD2026',
        'Motors',
        '#2563eb',
        '185 × 85 × 170 mm',
        '220VAC / 2.6kW Digital Servo Driver'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'SZGH-SD2026 Servo Driver',
      'Cabinet Mounting Footprint',
      'CN1 & CN2 Terminal Wiring',
      'Multi-Axis Drive Bank',
    ],
    specs: [
      { label: 'Matched Motor Power', value: '1.0 kW – 2.6 kW AC Servo Motors' },
      { label: 'Control Modes', value: 'Position (Pulse/Dir), Speed, Torque & Modbus' },
      { label: 'Power Supply', value: 'Single/Three-Phase 220VAC 50/60Hz' },
    ],
    compatibility: ['SZGH 110mm & 130mm AC Servo Motors', 'CNC Lathe & VMC Feed Axes'],
  },
  {
    id: 'prod-spindle-55kw',
    title: '5.5kW / 7.5kW Asynchronous Servo Spindle Motor',
    modelNumber: 'SZGH-08-2-5.5/7.5KW',
    category: 'Motors',
    subcategory: 'Spindle servo motor',
    description:
      'High-rigidity CNC spindle servo motor delivering constant high torque at low RPM and vibration-free 8,000 RPM finishing with ±0.01° spindle orientation.',
    features: [
      'Constant torque from 0 to 1,500 RPM for heavy steel roughing and constant power up to 8,000 RPM',
      'Precision ±0.01° spindle orientation for VMC Automatic Tool Changers (ATC) and live-tooling lathes',
      'Supports rigid tapping without floating tap holders when paired with SZGH CNC controllers',
      'Forced independent axial cooling fan and IP55 cast-iron ribbed frame',
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
      'Spindle Servo Motor',
      'B35 Mounting Footprint',
      'Encoder & Fan Interface',
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
  {
    id: 'prod-spindle-driver-s4t2p',
    title: '380V Closed-Loop Vector Spindle Servo Driver (5.5kW / 7.5kW)',
    modelNumber: 'SZGH-S4T2P-5.5/7.5KW',
    category: 'Motors',
    subcategory: 'Spindle servo driver',
    description:
      'Industrial 3-phase 380VAC closed-loop spindle servo driver with built-in PG encoder feedback card for C-axis positioning, quasi-stop orientation, and rigid tapping.',
    features: [
      'Closed-loop flux vector control with 150% starting torque at 0 Hz for heavy lathe and VMC cuts',
      'Supports 1-point and multi-point spindle orientation (M19) for umbrella and arm-type ATCs',
      'Seamless pulse synchronization for high-speed rigid tapping and thread milling',
      'Includes heavy-duty external aluminum-housed dynamic braking resistor unit',
    ],
    price: 128000,
    usdEstimate: 460,
    inStock: true,
    stockCount: 11,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: false,
    images: [
      HERO_SHOWCASE_PHOTOS.motors,
      ...createIndustrialProductGallery(
        'SZGH-S4T2P-7.5KW',
        'Motors',
        '#ea580c',
        '320 × 195 × 205 mm',
        '3-Phase 380VAC / Closed-Loop Vector'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Spindle Servo Driver',
      'Panel Mounting Dimensions',
      'PG Encoder & Braking Wiring',
      'Spindle Cabinet Integration',
    ],
    specs: [
      { label: 'Input Supply', value: '3-Phase 380VAC 50/60Hz' },
      { label: 'Applicable Motor', value: '5.5 kW / 7.5 kW Asynchronous Spindle Servo Motor' },
      { label: 'Feedback Interface', value: 'Orthogonal ABZ Incremental / Resolver PG Card' },
    ],
    compatibility: ['SZGH Spindle Servo Motors', 'VMC ATC Spindle Orientation', 'CNC Lathe C-Axis'],
  },
  {
    id: 'prod-stepper-closed-loop-86',
    title: 'NEMA34 8.5N·m Closed-Loop Hybrid Stepper Motor & Driver Kit',
    modelNumber: 'SZGH-86HS85-EC + CL86',
    category: 'Motors',
    subcategory: 'Closed Loop Stepper Motors and Drivers',
    description:
      'Closed-loop hybrid servo stepper motor (86mm flange, 8.5 N·m) with integrated 1000-line optical encoder and digital closed-loop driver eliminating lost steps.',
    features: [
      '1000-PPR optical encoder continuously monitors rotor position to prevent stalling or lost steps under load',
      'High low-speed torque with automatic current regulation for 40% lower motor heating',
      'Plug-and-play compatibility with 200kHz differential pulse outputs from SZGH controllers',
    ],
    price: 42000,
    usdEstimate: 151,
    inStock: true,
    stockCount: 25,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: false,
    images: [
      HERO_SHOWCASE_PHOTOS.motors,
      ...createIndustrialProductGallery(
        'SZGH-86HS85-EC',
        'Motors',
        '#059669',
        '86 × 86 mm Flange (NEMA 34)',
        '8.5 N·m Closed-Loop Stepper Kit'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Closed-Loop Stepper & Driver',
      'NEMA34 Flange CAD',
      'Encoder & Pulse Pinout',
      'Router & Auxiliary Axis Setup',
    ],
    specs: [
      { label: 'Holding Torque', value: '8.5 N·m (Closed-Loop with 1000-Line Encoder)' },
      { label: 'Frame Size', value: '86 × 86 mm (NEMA 34)' },
      { label: 'Driver Supply', value: '24–80 VDC / 20–60 VAC' },
    ],
    compatibility: ['CNC Engraving Machines', 'Auxiliary Tool Magazines', 'Small Lathe Conversions'],
  },
  {
    id: 'prod-stepper-two-phase-86',
    title: 'Two-Phase NEMA34 6.0N·m Stepper Motor & Microstepping Driver Set',
    modelNumber: 'SZGH-86BYG250C + 2DM860',
    category: 'Motors',
    subcategory: 'Two-phase stepper motor and driver',
    description:
      'Industrial two-phase NEMA 34 stepper motor (6.0 N·m) paired with the 2DM860 digital DSP microstepping driver for economical CNC feed and auxiliary axes.',
    features: [
      '32-bit DSP anti-resonance algorithm ensures smooth motion across mid-range speeds',
      'DIP-switch selectable microstepping up to 40,000 steps/rev and automatic idle-current halving',
      'Optically isolated differential step/direction inputs up to 200 kHz',
    ],
    price: 29500,
    usdEstimate: 106,
    inStock: true,
    stockCount: 30,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: false,
    images: [
      HERO_SHOWCASE_PHOTOS.motors,
      ...createIndustrialProductGallery(
        'SZGH-86BYG250C + 2DM860',
        'Motors',
        '#0284c7',
        '86 × 86 mm Two-Phase NEMA 34',
        '6.0 N·m / 2DM860 Digital Driver'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Two-Phase Stepper & Driver',
      'NEMA34 Mounting CAD',
      'A+/A-/B+/B- Phase Wiring',
      'Economical CNC Feed Axis',
    ],
    specs: [
      { label: 'Holding Torque', value: '6.0 N·m (Two-Phase Hybrid)' },
      { label: 'Phase Current', value: '5.0 A / Phase' },
      { label: 'Matched Driver', value: 'SZGH-2DM860 Digital Microstepping Driver' },
    ],
    compatibility: ['CNC Routers & Plasma Tables', 'Economical Lathe Feeds', 'Packaging Automation'],
  },
  {
    id: 'prod-stepper-three-phase-110',
    title: 'Three-Phase 110mm 16N·m High-Torque Stepper Motor & 220V Driver',
    modelNumber: 'SZGH-110BYG350C + 3DM2283',
    category: 'Motors',
    subcategory: 'Three-phase stepper motors and drivers',
    description:
      'Heavy-duty 110mm flange three-phase stepper motor (16.0 N·m) with direct 220VAC 3DM2283 driver—no external DC power supply transformer required.',
    features: [
      'Direct 220VAC mains input to the 3DM2283 three-phase driver simplifies electrical cabinet layout',
      'Three-phase sinusoidal current control delivers servo-like smoothness and 16 N·m high holding torque',
      'Ideal for heavy Z-axis knees, turret indexing, and large gantry tables',
    ],
    price: 58000,
    usdEstimate: 208,
    inStock: true,
    stockCount: 18,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: false,
    images: [
      HERO_SHOWCASE_PHOTOS.motors,
      ...createIndustrialProductGallery(
        'SZGH-110BYG350C + 3DM2283',
        'Motors',
        '#4f46e5',
        '110 × 110 mm Flange / 19mm Shaft',
        '16.0 N·m / 220VAC Three-Phase Stepper'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'Three-Phase Stepper & 220V Driver',
      '110mm Flange Blueprint',
      'U/V/W Three-Phase Wiring',
      'Heavy Feed Axis Installation',
    ],
    specs: [
      { label: 'Holding Torque', value: '16.0 N·m (Three-Phase High Torque)' },
      { label: 'Flange Size', value: '110 × 110 mm' },
      { label: 'Driver Input Voltage', value: 'Direct Single-Phase 220VAC 50/60Hz' },
    ],
    compatibility: ['Heavy Turret & Knee Feeds', 'Large Gantry Milling Routers', 'Flat-Bed Lathe Conversions'],
  },

  // ==========================================================================
  // CATEGORY 3: CNC MACHINE
  // Subcategories:
  //   - CNC lathe machine
  //   - CNC milling machine
  //   - Milling machine center
  // ==========================================================================
  {
    id: 'prod-machine-szgh650',
    title: 'SZGH-650 High-Rigidity Vertical Milling Machine Center (VMC)',
    modelNumber: 'SZGH-VMC650-PRO',
    category: 'Machines',
    subcategory: 'Milling machine center',
    description:
      'Turnkey Vertical Milling Machine Center (VMC) equipped with SZGH-CNC1000MDb controller, BT40 8000-RPM spindle, 16-station disc ATC, and Taiwan HIWIN linear roller guides.',
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
    id: 'prod-machine-szgh540',
    title: 'SZGH-540 Precision CNC Milling & Drilling Machine',
    modelNumber: 'SZGH-M540-CNC',
    category: 'Machines',
    subcategory: 'CNC milling machine',
    description:
      'Compact high-speed CNC milling machine with 540 × 320 × 400 mm travel, BT30/BT40 rigid tapping spindle, and SZGH-CNC1000MDb control system for precision parts production.',
    features: [
      'Heavy-duty Meehanite cast iron frame with high-speed linear guideways on all axes',
      'Equipped with SZGH-CNC1000MDb milling controller and high-torque AC servo feed motors',
      'Ideal for Sialkot surgical instrument milling, brass/steel fixtures, and electrode machining',
    ],
    price: 5450000,
    usdEstimate: 19600,
    inStock: true,
    stockCount: 3,
    warranty: '1 Year Official Warranty',
    hasIOBoardOption: false,
    images: [
      HERO_SHOWCASE_PHOTOS.machines,
      ...createIndustrialProductGallery(
        'SZGH-M540-CNC',
        'Machines',
        '#059669',
        'Travel: 540 × 320 × 400 mm',
        '5.5kW Servo Spindle / CNC Milling'
      ).slice(1),
    ] as [string, string, string, string],
    imageLabels: [
      'SZGH-540 CNC Milling Machine',
      'Worktable & Travel CAD',
      'SZGH Control & Servo Cabinet',
      'Precision Milling Setup',
    ],
    specs: [
      { label: 'Table Travel', value: '540 × 320 × 400 mm' },
      { label: 'Spindle Speed', value: '8,000 / 12,000 RPM Servo Spindle' },
      { label: 'Positioning Accuracy', value: '±0.005 mm' },
    ],
    compatibility: ['Surgical Instrument Milling', 'Precision Mold Electrodes', 'Production Milling'],
  },
  {
    id: 'prod-machine-szgh46y',
    title: 'SZGH-46Y Slant-Bed CNC Lathe & Turn-Mill Machine',
    modelNumber: 'SZGH-46Y-TURNMILL',
    category: 'Machines',
    subcategory: 'CNC lathe machine',
    description:
      '45° heavy-duty slant-bed CNC lathe machine featuring a live-tooling BMT turret, hydraulic collet chuck, and SZGH-CNC1000TDb control.',
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
      'SZGH-46Y CNC Lathe Machine',
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

function buildRateListCatalogItems(existingItems: ProductItem[]): ProductItem[] {
  const updatedExisting: ProductItem[] = existingItems.map((item) => {
    const resolved = resolveOfficialRateListPricing(item);
    if (
      resolved.price !== undefined ||
      resolved.description !== undefined ||
      resolved.title !== undefined ||
      resolved.subcategory !== undefined
    ) {
      const nextPrice = resolved.price !== undefined ? resolved.price : item.price;
      return {
        ...item,
        price: nextPrice,
        usdEstimate: Math.max(1, Math.round(nextPrice / 278)),
        ...(resolved.title ? { title: resolved.title } : {}),
        ...(resolved.description ? { description: resolved.description } : {}),
        ...(resolved.subcategory ? { subcategory: resolved.subcategory } : {}),
        ...(resolved.features ? { features: resolved.features } : {}),
        ...(resolved.servoConfigOptions
          ? { servoConfigOptions: resolved.servoConfigOptions }
          : {}),
      };
    }
    return item;
  });

  const existingModelSet = new Set(
    updatedExisting.map((p) => p.modelNumber.trim().toUpperCase())
  );

  const additionalControllers: ProductItem[] = [];
  for (const row of CONTROLLER_RATE_LIST_2026) {
    const upperModel = row.modelNumber.trim().toUpperCase();
    if (existingModelSet.has(upperModel)) continue;
    existingModelSet.add(upperModel);

    const slug = row.modelNumber
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const hasAB = /\(A\+B Panel\)/i.test(row.modelNumber);
    const hasCE = /\(C\+E Panel\)/i.test(row.modelNumber);
    const hasCPanel = /\(C Panel\)/i.test(row.modelNumber);

    const baseImages: string[] = /880TC/i.test(row.modelNumber)
      ? SZGH_880TC_IMAGES
      : /1080TC/i.test(row.modelNumber)
      ? SZGH_1080TC_IMAGES
      : /1080TIC/i.test(row.modelNumber)
      ? SZGH_880TIC_IMAGES
      : /880MC/i.test(row.modelNumber)
      ? SZGH_880MC_IMAGES
      : /1080MC/i.test(row.modelNumber)
      ? SZGH_1080MC_IMAGES
      : /1080MIC/i.test(row.modelNumber)
      ? SZGH_1080MIC_IMAGES
      : /1000TDB|1500TDB/i.test(row.modelNumber)
      ? SZGH_1000TDB_IMAGES
      : /1000TDC|1500TDC/i.test(row.modelNumber)
      ? SZGH_990TDC_IMAGES
      : /1000MDB|1500MDB/i.test(row.modelNumber)
      ? SZGH_1000MDB_IMAGES
      : /1000MDCB|1500MDCB/i.test(row.modelNumber)
      ? SZGH_1000MDCB_IMAGES
      : /1000MDC|1500MDC/i.test(row.modelNumber)
      ? SZGH_1000MDC_IMAGES
      : [
          HERO_SHOWCASE_PHOTOS.controllers,
          ...createIndustrialProductGallery(
            row.modelNumber,
            'Controllers',
            '#0068AD',
            '400 × 245 × 115 mm',
            '24VDC Industrial CNC Control'
          ).slice(1),
        ];

    const baseLabels: string[] = [
      'Front Operator Console',
      'Angle & Cutout View',
      'Rear DB Interface Ports',
      'System Wiring Topology',
    ];

    const galleryImages = hasAB
      ? [...baseImages.slice(0, 4), ...SZGH_AB_PANEL_IMAGES]
      : hasCE
      ? [...baseImages.slice(0, 4), ...SZGH_CE_PANEL_IMAGES]
      : hasCPanel
      ? [...baseImages.slice(0, 4), SZGH_PANEL_C_IMAGE]
      : baseImages.slice(0, 4);

    const galleryLabels = hasAB
      ? [...baseLabels, ...SZGH_AB_PANEL_IMAGE_LABELS]
      : hasCE
      ? [...baseLabels, ...SZGH_CE_PANEL_IMAGE_LABELS]
      : hasCPanel
      ? [...baseLabels, 'C-Panel']
      : baseLabels;

    additionalControllers.push({
      id: `prod-cnc-${slug}`,
      title: row.spec,
      modelNumber: row.modelNumber,
      category: 'Controllers',
      subcategory: row.subcategory,
      description: row.description,
      features: buildControllerFeatures(row),
      price: row.pricePKR,
      usdEstimate: Math.max(1, Math.round(row.pricePKR / 278)),
      inStock: true,
      stockCount: 10,
      defaultImageIndex: 0,
      warranty: '1 Year Official Warranty',
      hasIOBoardOption: true,
      images: galleryImages,
      imageLabels: galleryLabels,
      specs: [
        { label: 'Model Number', value: row.modelNumber },
        { label: 'Configuration', value: row.spec },
        { label: 'Encoder Support', value: row.isAbsolute ? 'Absolute Supported' : 'Incremental' },
        { label: 'ATC Support', value: row.supportsATC ? 'ATC Supported' : 'Standard Control' },
        { label: 'Minimum Command Unit', value: '0.001 mm' },
        { label: 'Warranty', value: '1 Year Official SZGH Pakistan Warranty' },
      ],
      compatibility: [
        row.subcategory === 'Lathe controller'
          ? 'CNC Turning Centers & Slant-Bed Lathes'
          : 'Vertical Machining Centers (VMC) & CNC Milling Machines',
      ],
    });
  }

  const servoMotorItems: ProductItem[] = SERVO_MOTOR_RATE_LIST_2026.map((row) => {
    const slug = row.modelNumber.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const configOptions = buildServoMotorConfigOptions(row);
    return {
      id: `prod-motor-${slug}`,
      title: `SZGH AC Servo Motor (${row.spec})`,
      modelNumber: row.modelNumber,
      category: 'Motors',
      subcategory: 'Servo motor',
      description: `Industrial SZGH AC Servo Motor ${row.modelNumber} (${row.spec}). Available in Base Motor (PKR ${row.basePricePKR.toLocaleString()}), With Brake (PKR ${row.brakePricePKR.toLocaleString()}), and Absolute Encoder (PKR ${row.absolutePricePKR.toLocaleString()}) configurations.`,
      features: [
        `Specification: ${row.spec} high-torque industrial AC servo motor`,
        `Selectable configurations: Base Motor (PKR ${row.basePricePKR.toLocaleString()}), With 24VDC Holding Brake (PKR ${row.brakePricePKR.toLocaleString()}), or Multi-Turn Absolute Encoder (PKR ${row.absolutePricePKR.toLocaleString()})`,
        '300% peak overload torque capacity with IP65 sealed NdFeB permanent magnet rotor',
        'Direct plug-and-play compatibility with SZGH-E7 series digital servo drivers and CNC controllers',
      ],
      price: row.basePricePKR,
      servoConfigOptions: configOptions,
      usdEstimate: Math.max(1, Math.round(row.basePricePKR / 278)),
      inStock: true,
      stockCount: 20,
      warranty: '1 Year Official Warranty',
      hasIOBoardOption: false,
      images: [
        HERO_SHOWCASE_PHOTOS.motors,
        ...createIndustrialProductGallery(
          row.modelNumber,
          'Motors',
          '#0068AD',
          row.spec.includes('flange') ? row.spec.split(',')[0] : 'Standard Servo Flange',
          row.spec
        ).slice(1),
      ],
      imageLabels: [
        'AC Servo Motor View',
        'Flange & Shaft CAD',
        'Encoder & Brake Pinout',
        'CNC Axis Integration',
      ],
      specs: [
        { label: 'Model Number', value: row.modelNumber },
        { label: 'Motor Specification', value: row.spec },
        { label: 'Base Retail Price', value: `PKR ${row.basePricePKR.toLocaleString()}` },
        { label: 'With Brake Price', value: `PKR ${row.brakePricePKR.toLocaleString()}` },
        { label: 'Absolute Encoder Price', value: `PKR ${row.absolutePricePKR.toLocaleString()}` },
        { label: 'Protection Class', value: 'IP65 Industrial Sealed Housing' },
      ],
      compatibility: ['CNC Lathe & VMC Feed Axes', 'Industrial Robots', 'SZGH-E7 Digital Servo Drivers'],
    };
  });

  const servoDriverItems: ProductItem[] = SERVO_DRIVER_RATE_LIST_2026.map((row) => {
    const slug = row.modelNumber.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const isEtherCAT = /EtherCAT/i.test(row.spec);
    const isAbsolute = /Absolute/i.test(row.spec);
    return {
      id: `prod-driver-${slug}`,
      title: `SZGH Digital AC Servo Driver — ${row.spec}`,
      modelNumber: row.modelNumber,
      category: 'Motors',
      subcategory: 'Servo Driver',
      description: `Official ${row.modelNumber} digital AC ${row.spec}. Engineered for high-response position, speed, and torque control across SZGH AC servo motors.`,
      features: [
        `Driver Specification: ${row.spec}`,
        isEtherCAT
          ? 'High-speed 100Mbps EtherCAT industrial fieldbus communication with multi-turn absolute encoder support'
          : isAbsolute
          ? 'Dedicated multi-turn absolute encoder interface with battery-backup position memory'
          : 'Triple-loop DSP vector control supporting differential pulse/direction, analog voltage, and RS485 Modbus',
        'Built-in regenerative braking protection, over-current, over-voltage, and encoder fault diagnostics',
        'Direct plug-and-play CN1/CN2 interface with all SZGH CNC lathe, milling, and robot controllers',
      ],
      price: row.basePricePKR,
      usdEstimate: Math.max(1, Math.round(row.basePricePKR / 278)),
      inStock: true,
      stockCount: 18,
      warranty: '1 Year Official Warranty',
      hasIOBoardOption: false,
      images: [
        HERO_SHOWCASE_PHOTOS.motors,
        ...createIndustrialProductGallery(
          row.modelNumber,
          'Motors',
          '#2563eb',
          '185 × 85 × 170 mm',
          row.spec
        ).slice(1),
      ],
      imageLabels: [
        'Digital Servo Driver View',
        'Cabinet Mounting CAD',
        'CN1/CN2 Terminal Pinout',
        'Multi-Axis Drive Bank',
      ],
      specs: [
        { label: 'Model Number', value: row.modelNumber },
        { label: 'Driver Specification', value: row.spec },
        { label: 'Control Architecture', value: isEtherCAT ? 'EtherCAT Bus + Absolute' : isAbsolute ? 'Absolute Servo Driver' : 'Pulse/Dir + Analog + Modbus' },
        { label: 'Warranty', value: '1 Year Official SZGH Pakistan Warranty' },
      ],
      compatibility: ['SZGH AC Servo Motors', 'CNC Lathe & Milling Controllers', 'Industrial Automation Cabinets'],
    };
  });

  return [
    ...updatedExisting,
    ...additionalControllers,
    ...servoMotorItems,
    ...servoDriverItems,
  ];
}

export const PRODUCTS_DATABASE: ProductItem[] = buildRateListCatalogItems(
  RAW_PRODUCTS_DATABASE
);

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

  if (/(?:SZGH[-\s]*)?(?:CNC(?:880)?[-\s]*)?I[O0][-\s]*12/i.test(model)) {
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
 * Detects if a product's description, title, or modelNumber includes (A+B Panel)
 * (including variations such as "(A+B Panel)", "A+B Panel", "（A/B panel）", "(A/B panel)", "A/B panel").
 */
export function hasABPanelInProduct(item: {
  modelNumber?: string;
  baseModelNumber?: string;
  title?: string;
  description?: string;
}): boolean {
  const combined = `${item.description || ''} ${item.title || ''} ${item.modelNumber || ''} ${
    item.baseModelNumber || ''
  }`;
  return /(?:[\(\（]\s*)?\bA\s*[\+\/]\s*B\s*[-–]?\s*panel\b(?:\s*[\)\）])?/i.test(
    combined
  );
}

/**
 * Detects if a product's description, title, or modelNumber includes (C+E Panel)
 * (including variations such as "(C+E Panel)", "C+E Panel", "（C/E panel）", "(C/E panel)", "C/E panel").
 */
export function hasCEPanelInProduct(item: {
  modelNumber?: string;
  baseModelNumber?: string;
  title?: string;
  description?: string;
}): boolean {
  const combined = `${item.description || ''} ${item.title || ''} ${item.modelNumber || ''} ${
    item.baseModelNumber || ''
  }`;
  return /(?:[\(\（]\s*)?\bC\s*[\+\/]\s*E\s*[-–]?\s*panel\b(?:\s*[\)\）])?/i.test(
    combined
  );
}

/**
 * Normalizes panel notation in description, title, and modelNumber so that:
 * - Any A/B or A+B panel product explicitly displays "(A+B Panel)" in its description & modelNumber.
 * - Any C/E or C+E panel product explicitly displays "(C+E Panel)" in its description & modelNumber.
 */
export function normalizePanelStrings(item: {
  modelNumber?: string;
  title?: string;
  description?: string;
}): {
  modelNumber: string;
  title: string;
  description: string;
} {
  const isAB = hasABPanelInProduct(item);
  const isCE = hasCEPanelInProduct(item);

  let model = (item.modelNumber || '').trim();
  let title = (item.title || '').trim();
  let desc = (item.description || '').trim();

  if (isAB) {
    model = model
      .replace(/\s*[\(\（]\s*A\s*[\+\/]\s*B\s*[-–]?\s*panel\s*[\)\）]/gi, ' (A+B Panel)')
      .replace(/\s{2,}/g, ' ')
      .trim();
    title = title
      .replace(/[\(\（]\s*A\s*[\+\/]\s*B\s*[-–]?\s*panel\s*[\)\）]/gi, '(A+B Panel)')
      .replace(/\bwith\s+panel\b/gi, 'with (A+B Panel)');
    desc = desc
      .replace(/[\(\（]\s*A\s*[\+\/]\s*B\s*[-–]?\s*panel\s*[\)\）]/gi, '(A+B Panel)')
      .replace(/\bwith\s+panel\b/gi, 'with (A+B Panel)');
    if (desc && !/\(\s*A\s*\+\s*B\s*Panel\s*\)/i.test(desc)) {
      desc = `${desc} (A+B Panel)`;
    }
  } else if (isCE) {
    model = model
      .replace(/\s*[\(\（]\s*C\s*[\+\/]\s*E\s*[-–]?\s*panel\s*[\)\）]/gi, ' (C+E Panel)')
      .replace(/\s{2,}/g, ' ')
      .trim();
    title = title
      .replace(/[\(\（]\s*C\s*[\+\/]\s*E\s*[-–]?\s*panel\s*[\)\）]/gi, '(C+E Panel)')
      .replace(/\bwith\s+panel\b/gi, 'with (C+E Panel)');
    desc = desc
      .replace(/[\(\（]\s*C\s*[\+\/]\s*E\s*[-–]?\s*panel\s*[\)\）]/gi, '(C+E Panel)')
      .replace(/\bwith\s+panel\b/gi, 'with (C+E Panel)');
    if (desc && !/\(\s*C\s*\+\s*E\s*Panel\s*\)/i.test(desc)) {
      desc = `${desc} (C+E Panel)`;
    }
  }

  return { modelNumber: model, title, description: desc };
}

/**
 * Given a product's 4 base images & labels and its metadata, appends 2 new picture slots (slots 5 & 6)
 * with A-Panel & B-Panel (when description/model includes (A+B Panel)) or C-Panel & E-Panel
 * (when description/model includes (C+E Panel)).
 */
export function applyPanelPicturesToGallery(
  baseImages: string[],
  baseLabels: string[] | undefined,
  item: {
    modelNumber?: string;
    baseModelNumber?: string;
    title?: string;
    description?: string;
  }
): {
  images: string[];
  imageLabels: string[];
} {
  const fourImages = [
    baseImages[0] ?? '',
    baseImages[1] ?? '',
    baseImages[2] ?? '',
    baseImages[3] ?? '',
  ];
  const fourLabels = [
    baseLabels?.[0] || 'Picture #1 View',
    baseLabels?.[1] || 'Picture #2 View',
    baseLabels?.[2] || 'Picture #3 View',
    baseLabels?.[3] || 'Picture #4 View',
  ];

  if (hasABPanelInProduct(item)) {
    return {
      images: [
        ...fourImages,
        SZGH_AB_PANEL_IMAGES[0],
        SZGH_AB_PANEL_IMAGES[1],
      ],
      imageLabels: [
        ...fourLabels,
        SZGH_AB_PANEL_IMAGE_LABELS[0],
        SZGH_AB_PANEL_IMAGE_LABELS[1],
      ],
    };
  }

  if (hasCEPanelInProduct(item)) {
    return {
      images: [
        ...fourImages,
        SZGH_CE_PANEL_IMAGES[0],
        SZGH_CE_PANEL_IMAGES[1],
      ],
      imageLabels: [
        ...fourLabels,
        SZGH_CE_PANEL_IMAGE_LABELS[0],
        SZGH_CE_PANEL_IMAGE_LABELS[1],
      ],
    };
  }

  if (baseImages.length > 4) {
    return {
      images: baseImages.slice(0, 6),
      imageLabels: [
        ...fourLabels,
        baseLabels?.[4] || 'Picture #5 View',
        baseLabels?.[5] || 'Picture #6 View',
      ].slice(0, baseImages.slice(0, 6).length),
    };
  }

  return {
    images: fourImages,
    imageLabels: fourLabels,
  };
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
  const normalizedPanel = normalizePanelStrings(product);
  const rawModel = normalizeIOBoardModelNumber(
    normalizedPanel.modelNumber,
    normalizedPanel.description,
    normalizedPanel.title
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

  // Motors & Drivers should never have axis variants extracted
  if (product.category === 'Motors') {
    const motorKey = rawModel.toUpperCase().replace(/[\s_]+/g, '-');
    return {
      baseModelDisplay: rawModel,
      baseModelKey: `Motors::${motorKey}`,
      axisCount: null,
      axisLabel: null,
    };
  }

  // Detect and temporarily strip trailing panel suffix like "(A+B Panel)", "(C+E Panel)", "（C panel）"
  let panelSuffix = '';
  if (hasABPanelInProduct({ ...product, modelNumber: rawModel })) {
    panelSuffix = '(A+B Panel)';
  } else if (hasCEPanelInProduct({ ...product, modelNumber: rawModel })) {
    panelSuffix = '(C+E Panel)';
  } else if (/[\(\（]\s*C\s*[-–]?\s*panel\s*[\)\）]/i.test(rawModel)) {
    panelSuffix = '(C Panel)';
  }

  const modelWithoutPanel = rawModel
    .replace(
      /\s*[\(\（]\s*(?:A\s*[\+\/]\s*B|C\s*[\+\/]\s*E|C)\s*[-–]?\s*panel\s*[\)\）]\s*$/i,
      ''
    )
    .trim();

  const combinedText = `${modelWithoutPanel} ${product.title || ''} ${
    product.subcategory || ''
  } ${product.description || ''}`;

  let axisCount: number | null = null;
  let baseModelCore = modelWithoutPanel;

  // 1. Check if modelWithoutPanel ends with an explicit "(2-Axis)" / "3 Axis" suffix
  const modelAxisWordMatch = modelWithoutPanel.match(
    /^(.+?)\s*[\(\[\-–/]?\s*\b([1-9]|1[0-2])\s*[-–]?\s*(?:ax(?:is|es)|dof)\b[\)\]]?$/i
  );
  if (modelAxisWordMatch) {
    baseModelCore = modelAxisWordMatch[1].trim().replace(/[-–/\s]+$/, '');
    axisCount = parseInt(modelAxisWordMatch[2], 10);
  }

  // 2. Check if modelWithoutPanel ends with a trailing axis digit suffix after letters (e.g., SZGH-880TC-2, SZGH-CNC1000TDb-2, SZGH-CNC1000MDcb-3(H))
  if (axisCount === null) {
    const trailingDigitMatch = modelWithoutPanel.match(
      /^([A-Za-z0-9_\-]+?[A-Za-z])\s*[-/_]\s*([1-8])(\([A-Za-z]+\)|[A-Za-z])?$/
    );
    if (
      trailingDigitMatch &&
      (product.category === 'Controllers' ||
        /tc|mc|mic|tic|tdb|mdb|tdc|mdc|tdi|mdi|cnc/i.test(trailingDigitMatch[1]) ||
        /\bax(?:is|es)\b/i.test(combinedText))
    ) {
      const suffixTag = trailingDigitMatch[3] ? trailingDigitMatch[3].trim() : '';
      baseModelCore = `${trailingDigitMatch[1].trim()}${suffixTag}`;
      axisCount = parseInt(trailingDigitMatch[2], 10);
    }
  }

  // 3. Check if axis number is embedded right before TC/MC/MIC/TIC/TD/MD (e.g., SZGH-880-2TC, SZGH-1080-3MIC)
  if (axisCount === null) {
    const midDigitMatch = modelWithoutPanel.match(
      /^([A-Za-z0-9_\-]+?)[-_]?([1-8])(TC|MC|MIC|TIC|TDb|MDb|TDc|MDc|MDcb|TDcb|TDi|MDi)$/i
    );
    if (midDigitMatch) {
      baseModelCore = `${midDigitMatch[1]}-${midDigitMatch[3]}`;
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

  const baseModelDisplay = panelSuffix
    ? `${baseModelCore} ${panelSuffix}`.trim()
    : baseModelCore || rawModel;

  // Create a canonical grouping key (unifying "880TC", "SZGH-880TC", and "SZGH-CNC880TC", while keeping (A+B Panel) vs (C+E Panel) distinct)
  const normalizedBaseKey = baseModelDisplay
    .toUpperCase()
    .replace(/^SZGH[-\s]*CNC[-\s]*/i, '')
    .replace(/^SGZH[-\s]*CNC[-\s]*/i, '')
    .replace(/^SZGH[-\s]*/i, '')
    .replace(/^SGZH[-\s]*/i, '')
    .replace(/^GH[-\s]*/i, '')
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
 * Strictly identifies ONLY SZGH-880MC models (e.g. SZGH-880MC, 880MC, SZGH-880MC-3,
 * 880MC-4, SZGH-880MC-5, SZGH-880-3MC, CNC880MC) so the 4 official SZGH-880MC pictures
 * (with 1.jpg at index 0 as the default picture) are applied exclusively to SZGH-880MC models.
 */
export function isSZGH880MCModel(item: {
  modelNumber?: string;
  baseModelNumber?: string;
}): boolean {
  const checkStr = `${item.modelNumber || ''} ${item.baseModelNumber || ''}`.toUpperCase();
  return /(?:^|[^A-Z0-9])(?:SZGH[-\s]*)?(?:CNC[-\s]*)?880[-\s]*(?:[1-8][-\s]*)?MC[A-Z]?(?:$|[^A-Z0-9]|[-_/\s]*[1-8])/i.test(
    checkStr
  );
}

/**
 * Strictly identifies ONLY SZGH-1080MC models (e.g. SZGH-1080MC, 1080MC, SZGH-1080MC-3,
 * 1080MC-4, SZGH-1080MC-5, SZGH-1080-3MC, CNC1080MC) so the 4 official
 * SZGH-1080MC pictures (with 01.jpg at index 0 as the default picture) are applied
 * exclusively to SZGH-1080MC models.
 */
export function isSZGH1080MCModel(item: {
  modelNumber?: string;
  baseModelNumber?: string;
}): boolean {
  const checkStr = `${item.modelNumber || ''} ${item.baseModelNumber || ''}`.toUpperCase();
  return /(?:^|[^A-Z0-9])(?:SZGH[-\s]*)?(?:CNC[-\s]*)?1080[-\s]*(?:[1-8][-\s]*)?MC[A-Z]?(?:$|[^A-Z0-9]|[-_/\s]*[1-8])/i.test(
    checkStr
  );
}

/**
 * Strictly identifies ONLY SZGH-1080MIC models (e.g. SZGH-1080MIC, 1080MIC, SZGH-1080MIC-3,
 * 1080MIC-4, SZGH-1080MIC-5, SZGH-1080-3MIC, CNC1080MIC) so the 4 official
 * SZGH-1080MIC logo-watermarked pictures (with 01.jpg at index 0 as the default picture)
 * are applied exclusively to SZGH-1080MIC models.
 */
export function isSZGH1080MICModel(item: {
  modelNumber?: string;
  baseModelNumber?: string;
}): boolean {
  const checkStr = `${item.modelNumber || ''} ${item.baseModelNumber || ''}`.toUpperCase();
  return /(?:^|[^A-Z0-9])(?:SZGH[-\s]*)?(?:CNC[-\s]*)?1080[-\s]*(?:[1-8][-\s]*)?MIC[A-Z]?(?:$|[^A-Z0-9]|[-_/\s]*[1-8])/i.test(
    checkStr
  );
}

/**
 * Strictly identifies ONLY SZGH-880TC models (e.g. SZGH-880TC, 880TC, SZGH-880TC-2,
 * 880TC-3, SZGH-880TC-4, SZGH-880-2TC, CNC880TC) so the 4 official
 * SZGH-880TC logo-watermarked pictures (with 1.jpg at index 0 as the default picture)
 * are applied exclusively to SZGH-880TC models.
 */
export function isSZGH880TCModel(item: {
  modelNumber?: string;
  baseModelNumber?: string;
}): boolean {
  const checkStr = `${item.modelNumber || ''} ${item.baseModelNumber || ''}`.toUpperCase();
  return /(?:^|[^A-Z0-9])(?:SZGH[-\s]*)?(?:CNC[-\s]*)?880[-\s]*(?:[1-8][-\s]*)?TC[A-Z]?(?:$|[^A-Z0-9]|[-_/\s]*[1-8])/i.test(
    checkStr
  );
}

/**
 * Strictly identifies ONLY SZGH-880TIC models (e.g. SZGH-880TIC, 880TIC, SZGH-880TIC-2,
 * 880TIC-3, SZGH-880TIC-4, SZGH-880-2TIC, CNC880TIC) so the 4 official
 * SZGH-880TIC logo-watermarked pictures (with 01.jpg at index 0 as the default picture)
 * are applied exclusively to SZGH-880TIC models.
 */
export function isSZGH880TICModel(item: {
  modelNumber?: string;
  baseModelNumber?: string;
}): boolean {
  const checkStr = `${item.modelNumber || ''} ${item.baseModelNumber || ''}`.toUpperCase();
  return /(?:^|[^A-Z0-9])(?:SZGH[-\s]*)?(?:CNC[-\s]*)?880[-\s]*(?:[1-8][-\s]*)?TIC[A-Z]?(?:$|[^A-Z0-9]|[-_/\s]*[1-8])/i.test(
    checkStr
  );
}

/**
 * Strictly identifies ONLY SZGH-1080TC models (e.g. SZGH-1080TC, 1080TC, SZGH-1080TC-2,
 * 1080TC-3, SZGH-1080TC-4, SZGH-1080-2TC, SZGH-1080TIC, CNC1080TC) so the 4 official
 * SZGH-1080TC logo-watermarked pictures (with 1.jpg at index 0 as the default picture)
 * are applied exclusively to SZGH-1080TC models.
 */
export function isSZGH1080TCModel(item: {
  modelNumber?: string;
  baseModelNumber?: string;
}): boolean {
  const checkStr = `${item.modelNumber || ''} ${item.baseModelNumber || ''}`.toUpperCase();
  return /(?:^|[^A-Z0-9])(?:SZGH[-\s]*)?(?:CNC[-\s]*)?1080[-\s]*(?:[1-8][-\s]*)?T[I]?C[A-Z]?(?:$|[^A-Z0-9]|[-_/\s]*[1-8])/i.test(
    checkStr
  );
}

/**
 * Strictly identifies ONLY SZGH-1000MDB models (e.g. SZGH-1000MDB, SZGH-CNC1000MDb, 1000MDb,
 * SZGH-CNC1000MDb-3, SZGH-CNC1000MDb-4, SZGH-CNC1000MDb-5, SZGH-1000-3MDb, CNC1000MDb)
 * so the 4 official SZGH-1000MDB logo-watermarked pictures (with 1000MDb(1).jpg at index 0
 * as the default picture) are applied exclusively to SZGH-1000MDB models.
 */
export function isSZGH1000MDBModel(item: {
  modelNumber?: string;
  baseModelNumber?: string;
}): boolean {
  const checkStr = `${item.modelNumber || ''} ${item.baseModelNumber || ''}`.toUpperCase();
  return /(?:^|[^A-Z0-9])(?:SZGH[-\s]*)?(?:CNC[-\s]*)?1000[-\s]*(?:[1-8][-\s]*)?MDB[A-Z]?(?:$|[^A-Z0-9]|[-_/\s]*[1-8])/i.test(
    checkStr
  );
}

/**
 * Strictly identifies ONLY SZGH-990MDb models (e.g. SZGH-990MDb, SZGH-CNC990MDb, 990MDb,
 * SZGH-990MDb-3, SZGH-990MDb-4, SZGH-990MDb-5, SZGH-CNC990MDb-3, SZGH-990-3MDb, CNC990MDb)
 * so the 4 official SZGH-990MDb logo-watermarked pictures (with 990MDb（1）.jpg at index 0
 * as the default picture) are applied exclusively to SZGH-990MDb models.
 */
export function isSZGH990MDBModel(item: {
  modelNumber?: string;
  baseModelNumber?: string;
}): boolean {
  const checkStr = `${item.modelNumber || ''} ${item.baseModelNumber || ''}`.toUpperCase();
  return /(?:^|[^A-Z0-9])(?:SZGH[-\s]*)?(?:CNC[-\s]*)?990[-\s]*(?:[1-8][-\s]*)?MDB[A-Z]?(?:$|[^A-Z0-9]|[-_/\s]*[1-8])/i.test(
    checkStr
  );
}

/**
 * Strictly identifies ONLY SZGH-990MDc models (e.g. SZGH-990MDc, SZGH-CNC990MDc, 990MDc,
 * SZGH-990MDc-3, SZGH-990MDc-4, SZGH-990MDc-5, SZGH-CNC990MDc-3, SZGH-990-3MDc, CNC990MDc)
 * so the 4 official SZGH-990MDc logo-watermarked pictures (with 990MDc（1） .jpg at index 0
 * as the default picture) are applied exclusively to SZGH-990MDc models.
 */
export function isSZGH990MDCModel(item: {
  modelNumber?: string;
  baseModelNumber?: string;
}): boolean {
  const checkStr = `${item.modelNumber || ''} ${item.baseModelNumber || ''}`.toUpperCase();
  return /(?:^|[^A-Z0-9])(?:SZGH[-\s]*)?(?:CNC[-\s]*)?990[-\s]*(?:[1-8][-\s]*)?MDC[A-Z]?(?:$|[^A-Z0-9]|[-_/\s]*[1-8])/i.test(
    checkStr
  );
}

/**
 * Strictly identifies ONLY SZGH-990TDb models (e.g. SZGH-990TDb, SZGH-CNC990TDb, 990TDb,
 * SZGH-990TDb-2, SZGH-990TDb-3, SZGH-990TDb-4, SZGH-CNC990TDb-2, SZGH-990-2TDb, CNC990TDb)
 * so the 4 official SZGH-990TDb logo-watermarked pictures (with 1.jpg at index 0
 * as the default picture) are applied exclusively to SZGH-990TDb models.
 */
export function isSZGH990TDBModel(item: {
  modelNumber?: string;
  baseModelNumber?: string;
}): boolean {
  const checkStr = `${item.modelNumber || ''} ${item.baseModelNumber || ''}`.toUpperCase();
  return /(?:^|[^A-Z0-9])(?:SZGH[-\s]*)?(?:CNC[-\s]*)?990[-\s]*(?:[1-8][-\s]*)?TDB[A-Z]?(?:$|[^A-Z0-9]|[-_/\s]*[1-8])/i.test(
    checkStr
  );
}

/**
 * Strictly identifies ONLY SZGH-990TDc models (e.g. SZGH-990TDc, SZGH-CNC990TDc, 990TDc,
 * SZGH-990TDc-2, SZGH-990TDc-3, SZGH-990TDc-4, SZGH-CNC990TDc-2, SZGH-990-2TDc, CNC990TDc)
 * so the 4 official SZGH-990TDc logo-watermarked pictures (with 990TDc（1） .jpg at index 0
 * as the default picture) are applied exclusively to SZGH-990TDc models.
 */
export function isSZGH990TDCModel(item: {
  modelNumber?: string;
  baseModelNumber?: string;
}): boolean {
  const checkStr = `${item.modelNumber || ''} ${item.baseModelNumber || ''}`.toUpperCase();
  return /(?:^|[^A-Z0-9])(?:SZGH[-\s]*)?(?:CNC[-\s]*)?990[-\s]*(?:[1-8][-\s]*)?TDC[A-Z]?(?:$|[^A-Z0-9]|[-_/\s]*[1-8])/i.test(
    checkStr
  );
}

/**
 * Strictly identifies ONLY SZGH-1000MC models (e.g. SZGH-1000MC, GH-1000MC, SZGH-CNC1000MC,
 * 1000MC, SZGH-1000MC-3, SZGH-1000MC-4, SZGH-1000MC-5, GH-1000MC-5, SZGH-1000-3MC, CNC1000MC)
 * so the 4 official SZGH-1000MC logo-watermarked pictures (with 1000MC-1.jpg at index 0
 * as the default picture) are applied exclusively to SZGH-1000MC models.
 */
export function isSZGH1000MCModel(item: {
  modelNumber?: string;
  baseModelNumber?: string;
}): boolean {
  const checkStr = `${item.modelNumber || ''} ${item.baseModelNumber || ''}`.toUpperCase();
  return /(?:^|[^A-Z0-9])(?:(?:SZ)?GH[-\s]*)?(?:CNC[-\s]*)?1000[-\s]*(?:[1-8][-\s]*)?MC[A-Z]?(?:$|[^A-Z0-9]|[-_/\s]*[1-8])/i.test(
    checkStr
  );
}

/**
 * Strictly identifies ONLY SZGH-1000MDc models (e.g. SZGH-1000MDc, SZGH-CNC1000MDc, CNC 1000MDc,
 * 1000MDc, SZGH-1000MDc-3, SZGH-1000MDc-4, SZGH-1000MDc-5, SZGH-CNC1000MDc-3, SZGH-1000-3MDc, CNC1000MDc)
 * so the 4 official SZGH-1000MDc logo-watermarked pictures (with 1000MDc（1）.jpg at index 0
 * as the default picture) are applied exclusively to SZGH-1000MDc models (and NOT 1000MDcb).
 */
export function isSZGH1000MDCModel(item: {
  modelNumber?: string;
  baseModelNumber?: string;
}): boolean {
  const checkStr = `${item.modelNumber || ''} ${item.baseModelNumber || ''}`.toUpperCase();
  return /(?:^|[^A-Z0-9])(?:(?:SZ)?GH[-\s]*)?(?:CNC[-\s]*)?1000[-\s]*(?:[1-8][-\s]*)?MDC(?:$|[^A-Z0-9]|[-_/\s]*[1-8])/i.test(
    checkStr
  );
}

/**
 * Strictly identifies ONLY SZGH-1000MDcb models (e.g. SZGH-1000MDcb, SZGH-CNC1000MDcb, CNC 1000MDcb,
 * 1000MDcb, SZGH-1000MDcb-3, SZGH-1000MDcb-4, SZGH-1000MDcb-5, SZGH-CNC1000MDcb-3, SZGH-1000-3MDcb, CNC1000MDcb)
 * so the 4 official SZGH-1000MDcb logo-watermarked pictures (with 1000MDcb（1）.jpg at index 0
 * as the default picture) are applied exclusively to SZGH-1000MDcb models.
 */
export function isSZGH1000MDCBModel(item: {
  modelNumber?: string;
  baseModelNumber?: string;
}): boolean {
  const checkStr = `${item.modelNumber || ''} ${item.baseModelNumber || ''}`.toUpperCase();
  return /(?:^|[^A-Z0-9])(?:(?:SZ)?GH[-\s]*)?(?:CNC[-\s]*)?1000[-\s]*(?:[1-8][-\s]*)?MDCB[A-Z]?(?:$|[^A-Z0-9]|[-_/\s]*[1-8])/i.test(
    checkStr
  );
}

/**
 * Strictly identifies ONLY SZGH-1000TDb models (e.g. SZGH-1000TDb, SZGH-CNC1000TDb, CNC 1000TDb,
 * 1000TDb, SZGH-1000TDb-2, SZGH-1000TDb-3, SZGH-1000TDb-4, SZGH-CNC1000TDb-3, SZGH-1000-3TDb, CNC1000TDb)
 * so the 4 official SZGH-1000TDb logo-watermarked pictures (with 1000TDb(1).jpg at index 0
 * as the default picture) are applied exclusively to SZGH-1000TDb models.
 */
export function isSZGH1000TDBModel(item: {
  modelNumber?: string;
  baseModelNumber?: string;
}): boolean {
  const checkStr = `${item.modelNumber || ''} ${item.baseModelNumber || ''}`.toUpperCase();
  return /(?:^|[^A-Z0-9])(?:(?:SZ)?GH[-\s]*)?(?:CNC[-\s]*)?1000[-\s]*(?:[1-8][-\s]*)?TDB(?:$|[^A-Z0-9]|[-_/\s]*[1-8])/i.test(
    checkStr
  );
}

/**
 * Strictly identifies ONLY SZGH-CNC-IO12 / CNC-IO12 models (e.g. SZGH-CNC-IO12, SZGH-CNC-IO-12,
 * CNC-IO12, CNC-IO-12, CNC880-I012, CNC880-IO12) so the 2 official SZGH-CNC-IO12 logo-watermarked
 * pictures (with picture 1 at index 0 as the default picture) are applied exclusively to SZGH-CNC-IO12 models.
 */
export function isSZGHCNCIO12Model(item: {
  modelNumber?: string;
  baseModelNumber?: string;
  title?: string;
  description?: string;
}): boolean {
  if (isStandaloneIOBoardProduct(item)) return true;
  const checkStr = `${item.modelNumber || ''} ${item.baseModelNumber || ''}`.toUpperCase();
  return /(?:^|[^A-Z0-9])(?:(?:SZ)?GH[-\s]*)?(?:CNC(?:880)?[-\s]*)?I[O0][-\s]*12(?:$|[^A-Z0-9])/i.test(
    checkStr
  );
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
    const normalizedPanel = normalizePanelStrings(rawProduct);
    const isIOBoardItem = isStandaloneIOBoardProduct({
      ...rawProduct,
      ...normalizedPanel,
    });
    const normalizedModel = normalizeIOBoardModelNumber(
      normalizedPanel.modelNumber,
      normalizedPanel.description,
      normalizedPanel.title
    );

    const { baseModelDisplay, baseModelKey, axisCount, axisLabel } =
      extractBaseModelAndAxis({
        ...rawProduct,
        modelNumber: normalizedModel,
        title: normalizedPanel.title,
        description: normalizedPanel.description,
      });

    const is880MC = isSZGH880MCModel({
      modelNumber: normalizedModel,
      baseModelNumber: baseModelDisplay,
    });
    const is1080MC = isSZGH1080MCModel({
      modelNumber: normalizedModel,
      baseModelNumber: baseModelDisplay,
    });
    const is1080MIC = isSZGH1080MICModel({
      modelNumber: normalizedModel,
      baseModelNumber: baseModelDisplay,
    });
    const is880TC = isSZGH880TCModel({
      modelNumber: normalizedModel,
      baseModelNumber: baseModelDisplay,
    });
    const is880TIC = isSZGH880TICModel({
      modelNumber: normalizedModel,
      baseModelNumber: baseModelDisplay,
    });
    const is1080TC = isSZGH1080TCModel({
      modelNumber: normalizedModel,
      baseModelNumber: baseModelDisplay,
    });
    const is1000MDB = isSZGH1000MDBModel({
      modelNumber: normalizedModel,
      baseModelNumber: baseModelDisplay,
    });
    const is990MDB = isSZGH990MDBModel({
      modelNumber: normalizedModel,
      baseModelNumber: baseModelDisplay,
    });
    const is990MDC = isSZGH990MDCModel({
      modelNumber: normalizedModel,
      baseModelNumber: baseModelDisplay,
    });
    const is990TDB = isSZGH990TDBModel({
      modelNumber: normalizedModel,
      baseModelNumber: baseModelDisplay,
    });
    const is990TDC = isSZGH990TDCModel({
      modelNumber: normalizedModel,
      baseModelNumber: baseModelDisplay,
    });
    const is1000MC = isSZGH1000MCModel({
      modelNumber: normalizedModel,
      baseModelNumber: baseModelDisplay,
    });
    const is1000MDC = isSZGH1000MDCModel({
      modelNumber: normalizedModel,
      baseModelNumber: baseModelDisplay,
    });
    const is1000MDCB = isSZGH1000MDCBModel({
      modelNumber: normalizedModel,
      baseModelNumber: baseModelDisplay,
    });
    const is1000TDB = isSZGH1000TDBModel({
      modelNumber: normalizedModel,
      baseModelNumber: baseModelDisplay,
    });
    const isCNCIO12 = isSZGHCNCIO12Model({
      modelNumber: normalizedModel,
      baseModelNumber: baseModelDisplay,
      title: normalizedPanel.title,
      description: normalizedPanel.description,
    });

    const baseFourImages: string[] = is880MC
      ? SZGH_880MC_IMAGES
      : is1080MC
      ? SZGH_1080MC_IMAGES
      : is1080MIC
      ? SZGH_1080MIC_IMAGES
      : is880TC
      ? SZGH_880TC_IMAGES
      : is880TIC
      ? SZGH_880TIC_IMAGES
      : is1080TC
      ? SZGH_1080TC_IMAGES
      : is1000MDB
      ? SZGH_1000MDB_IMAGES
      : is990MDB
      ? SZGH_990MDB_IMAGES
      : is990MDC
      ? SZGH_990MDC_IMAGES
      : is990TDB
      ? SZGH_990TDB_IMAGES
      : is990TDC
      ? SZGH_990TDC_IMAGES
      : is1000MC
      ? SZGH_1000MC_IMAGES
      : is1000MDC
      ? SZGH_1000MDC_IMAGES
      : is1000MDCB
      ? SZGH_1000MDCB_IMAGES
      : is1000TDB
      ? SZGH_1000TDB_IMAGES
      : isCNCIO12
      ? SZGH_CNC_IO12_IMAGES
      : rawProduct.images;

    const baseFourLabels: string[] = is880MC
      ? SZGH_880MC_IMAGE_LABELS
      : is1080MC
      ? SZGH_1080MC_IMAGE_LABELS
      : is1080MIC
      ? SZGH_1080MIC_IMAGE_LABELS
      : is880TC
      ? SZGH_880TC_IMAGE_LABELS
      : is880TIC
      ? SZGH_880TIC_IMAGE_LABELS
      : is1080TC
      ? SZGH_1080TC_IMAGE_LABELS
      : is1000MDB
      ? SZGH_1000MDB_IMAGE_LABELS
      : is990MDB
      ? SZGH_990MDB_IMAGE_LABELS
      : is990MDC
      ? SZGH_990MDC_IMAGE_LABELS
      : is990TDB
      ? SZGH_990TDB_IMAGE_LABELS
      : is990TDC
      ? SZGH_990TDC_IMAGE_LABELS
      : is1000MC
      ? SZGH_1000MC_IMAGE_LABELS
      : is1000MDC
      ? SZGH_1000MDC_IMAGE_LABELS
      : is1000MDCB
      ? SZGH_1000MDCB_IMAGE_LABELS
      : is1000TDB
      ? SZGH_1000TDB_IMAGE_LABELS
      : isCNCIO12
      ? SZGH_CNC_IO12_IMAGE_LABELS
      : rawProduct.imageLabels;

    const { images: resolvedImages, imageLabels: resolvedLabels } =
      applyPanelPicturesToGallery(baseFourImages, baseFourLabels, {
        modelNumber: normalizedModel,
        baseModelNumber: baseModelDisplay,
        title: normalizedPanel.title,
        description: normalizedPanel.description,
      });

    // Strip number of axes from description & title for display and normalize subcategory
    const cleanedProduct: ProductItem = {
      ...rawProduct,
      modelNumber: normalizedModel,
      subcategory: resolveOfficialSubcategory({
        ...rawProduct,
        modelNumber: normalizedModel,
      }),
      hasIOBoardOption: isIOBoardItem ? false : rawProduct.hasIOBoardOption,
      title: stripAxisCountFromText(normalizedPanel.title),
      description: stripAxisCountFromText(normalizedPanel.description),
      images: resolvedImages,
      imageLabels: resolvedLabels,
      defaultImageIndex: is880MC
        ? SZGH_880MC_DEFAULT_IMAGE_INDEX
        : is1080MC
        ? SZGH_1080MC_DEFAULT_IMAGE_INDEX
        : is1080MIC
        ? SZGH_1080MIC_DEFAULT_IMAGE_INDEX
        : is880TC
        ? SZGH_880TC_DEFAULT_IMAGE_INDEX
        : is880TIC
        ? SZGH_880TIC_DEFAULT_IMAGE_INDEX
        : is1080TC
        ? SZGH_1080TC_DEFAULT_IMAGE_INDEX
        : is1000MDB
        ? SZGH_1000MDB_DEFAULT_IMAGE_INDEX
        : is990MDB
        ? SZGH_990MDB_DEFAULT_IMAGE_INDEX
        : is990MDC
        ? SZGH_990MDC_DEFAULT_IMAGE_INDEX
        : is990TDB
        ? SZGH_990TDB_DEFAULT_IMAGE_INDEX
        : is990TDC
        ? SZGH_990TDC_DEFAULT_IMAGE_INDEX
        : is1000MC
        ? SZGH_1000MC_DEFAULT_IMAGE_INDEX
        : is1000MDC
        ? SZGH_1000MDC_DEFAULT_IMAGE_INDEX
        : is1000MDCB
        ? SZGH_1000MDCB_DEFAULT_IMAGE_INDEX
        : is1000TDB
        ? SZGH_1000TDB_DEFAULT_IMAGE_INDEX
        : isCNCIO12
        ? SZGH_CNC_IO12_DEFAULT_IMAGE_INDEX
        : rawProduct.defaultImageIndex,
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
              imageLabels: single.product.imageLabels,
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
          imageLabels: entry.product.imageLabels,
          defaultImageIndex: entry.product.defaultImageIndex,
        });
      } else {
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
          imageLabels:
            !existingHasCustomImg && entryHasCustomImg
              ? entry.product.imageLabels
              : existingVariant.imageLabels,
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
      imageLabels: itemWithCustomPhoto.imageLabels,
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

