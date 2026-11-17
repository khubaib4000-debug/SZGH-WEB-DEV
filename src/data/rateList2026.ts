export interface ServoMotorConfigOption {
  id: 'base' | 'brake' | 'absolute';
  label: string;
  shortLabel: string;
  price: number;
}

export interface ControllerRateRow {
  modelNumber: string;
  spec: string;
  description: string;
  pricePKR: number;
  isAbsolute: boolean;
  supportsATC: boolean;
  subcategory:
    | 'Drilling and milling machine CNC controller'
    | 'Lathe controller'
    | 'Engraving CNC controller';
}

export interface ServoMotorRateRow {
  modelNumber: string;
  spec: string;
  basePricePKR: number;
  baseDealerPricePKR: number;
  brakePricePKR: number;
  brakeDealerPricePKR: number;
  absolutePricePKR: number;
  absoluteDealerPricePKR: number;
}

export interface ServoDriverRateRow {
  modelNumber: string;
  spec: string;
  basePricePKR: number;
  baseDealerPricePKR: number;
}

export interface IndustrialRobotRateRow {
  modelNumber: string;
  buttonLabel: string;
  seriesKey: 'ROBOT_SERIES_T' | 'ROBOT_SERIES_P' | 'ROBOT_SERIES_B' | 'ROBOT_SERIES_S' | 'ROBOT_SERIES_H';
  seriesClubName: string;
  seriesTitle: string;
  robotTypeLabel: string;
  subcategory:
    | 'Pick-and-Place & Machine Tending'
    | 'Spraying & Grinding Robot'
    | 'Robotic Welding Cell';
  spec: string;
  description: string;
  exwRmb: number | null;
  packedWeightKg: number | null; // "Control Cabinet + Robot + Wooden Box (KG)" from 一体机机器人 sheet
  bodyWeightKg?: number | null;
  cabinetWeightKg?: number | null;
  woodenBoxDimensions?: string;
}

export const DEFAULT_RMB_TO_PKR_RATE = 43.5;
export const DEFAULT_FREIGHT_RATE_PER_KG = 800;
export const DEFAULT_RETAIL_MARKUP = 1.25;

export function calculateRobotRetailPriceBreakdown(
  exwRmb: number | null | undefined,
  packedWeightKg: number | null | undefined,
  rmbToPkrRate: number = DEFAULT_RMB_TO_PKR_RATE,
  freightRatePerKg: number = DEFAULT_FREIGHT_RATE_PER_KG,
  retailMarkup: number = DEFAULT_RETAIL_MARKUP
): {
  exwPkr: number;
  freightPkr: number;
  retailPricePkr: number;
  isComplete: boolean;
  missingStatus: string;
} {
  const hasExw = typeof exwRmb === 'number' && exwRmb > 0;
  const hasWeight = typeof packedWeightKg === 'number' && packedWeightKg > 0;
  const exwPkr = hasExw ? Math.round(exwRmb * rmbToPkrRate) : 0;
  const freightPkr = hasWeight ? Math.round(packedWeightKg * freightRatePerKg) : 0;
  const isComplete = hasExw && hasWeight;
  // Formula: (EXW (PKR) + Freight) * 1.25 = Retail Price
  const retailPricePkr = isComplete
    ? Math.round((exwPkr + freightPkr) * retailMarkup)
    : 0;

  let missingStatus = 'COMPLETE — CALCULATED (EXW PKR + FREIGHT PKR) × 1.25';
  if (!hasExw && !hasWeight) {
    missingStatus = 'MISSING EXW (RMB) & WEIGHT (KG) — PLEASE FILL IN EXCEL';
  } else if (!hasWeight) {
    missingStatus = 'MISSING WEIGHT (KG) IN SIZE & WEIGHTS — PLEASE FILL IN EXCEL';
  } else if (!hasExw) {
    missingStatus = 'MISSING EXW (RMB) IN DEALER PRICE LIST — PLEASE FILL IN EXCEL';
  }

  return {
    exwPkr,
    freightPkr,
    retailPricePkr,
    isComplete,
    missingStatus,
  };
}

export const OFFICIAL_IO_BOARD_PRICE_PKR = 22000;

/**
 * Official 2026 SZGH Pakistan Controller Rate List-1 (KH Retail Price Pakistan — Integer PKR)
 * - Updated descriptions and subcategories directly from "Controller Rate List-1.pdf"
 * - All 880 series and 1080 series explicitly state Absolute & ATC Supported qualities
 * - 990 / 1000 / 1500 series strictly distinguish ATC support vs non-ATC and Absolute vs Incremental per the official rate list
 */
export const CONTROLLER_RATE_LIST_2026: ControllerRateRow[] = [
  // 880TC Series (8 inch display Without I/O — Absolute & ATC Supported)
  {
    modelNumber: 'SZGH-880TC-2',
    spec: 'CNC 2-axis Absolute Lathe Controller, ATC Supported (8 inch display Without I/O)',
    description:
      'CNC 2 axis Absolute lathe controller, ATC Supported, 8 inch display Without I/O. High-stability SZGH-880TC CNC turning controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) & multi-station turret PLC logic, and USB DNC interface.',
    pricePKR: 110000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-880TC-3',
    spec: 'CNC 3-axis Absolute Lathe Controller, ATC Supported (8 inch display Without I/O)',
    description:
      'CNC 3 axis Absolute lathe controller, ATC Supported, 8 inch display Without I/O. High-stability SZGH-880TC CNC turning controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) & multi-station turret PLC logic, and USB DNC interface.',
    pricePKR: 136000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-880TC-4',
    spec: 'CNC 4-axis Absolute Lathe Controller, ATC Supported (8 inch display Without I/O)',
    description:
      'CNC 4 axis Absolute lathe controller, ATC Supported, 8 inch display Without I/O. High-stability SZGH-880TC CNC turning controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) & multi-station turret PLC logic, and USB DNC interface.',
    pricePKR: 162000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-880TC-5',
    spec: 'CNC 5-axis Absolute Lathe Controller, ATC Supported (8 inch display Without I/O)',
    description:
      'CNC 5 axis Absolute lathe controller, ATC Supported, 8 inch display Without I/O. High-stability SZGH-880TC CNC turning controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) & multi-station turret PLC logic, and USB DNC interface.',
    pricePKR: 188000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-880TC-6',
    spec: 'CNC 6-axis Absolute Lathe Controller, ATC Supported (8 inch display Without I/O)',
    description:
      'CNC 6 axis Absolute lathe controller, ATC Supported, 8 inch display Without I/O. High-stability SZGH-880TC CNC turning controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) & multi-station turret PLC logic, and USB DNC interface.',
    pricePKR: 213000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Lathe controller',
  },

  // 1080TC Series (10.4 inch display with I/O — Absolute & ATC Supported)
  {
    modelNumber: 'SZGH-1080TC-2',
    spec: 'CNC 2-axis Absolute Lathe Controller, ATC Supported (10.4 inch display with I/O)',
    description:
      'CNC 2 axis Absolute lathe controller, ATC Supported, 10.4 inch display with I/O. Flagship dual-panel SZGH-1080TC CNC turning center controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) & turret PLC logic, 10.4-inch color LCD, and I/O interface.',
    pricePKR: 195000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-1080TC-3',
    spec: 'CNC 3-axis Absolute Lathe Controller, ATC Supported (10.4 inch display with I/O)',
    description:
      'CNC 3 axis Absolute lathe controller, ATC Supported, 10.4 inch display with I/O. Flagship dual-panel SZGH-1080TC CNC turning center controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) & turret PLC logic, 10.4-inch color LCD, and I/O interface.',
    pricePKR: 226618,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-1080TC-4',
    spec: 'CNC 4-axis Absolute Lathe Controller, ATC Supported (10.4 inch display with I/O)',
    description:
      'CNC 4 axis Absolute lathe controller, ATC Supported, 10.4 inch display with I/O. Flagship dual-panel SZGH-1080TC CNC turning center controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) & turret PLC logic, 10.4-inch color LCD, and I/O interface.',
    pricePKR: 252618,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-1080TC-5',
    spec: 'CNC 5-axis Absolute Lathe Controller, ATC Supported (10.4 inch display with I/O)',
    description:
      'CNC 5 axis Absolute lathe controller, ATC Supported, 10.4 inch display with I/O. Flagship dual-panel SZGH-1080TC CNC turning center controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) & turret PLC logic, 10.4-inch color LCD, and I/O interface.',
    pricePKR: 278618,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-1080TC-6',
    spec: 'CNC 6-axis Absolute Lathe Controller, ATC Supported (10.4 inch display with I/O)',
    description:
      'CNC 6 axis Absolute lathe controller, ATC Supported, 10.4 inch display with I/O. Flagship dual-panel SZGH-1080TC CNC turning center controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) & turret PLC logic, 10.4-inch color LCD, and I/O interface.',
    pricePKR: 303618,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Lathe controller',
  },

  // 1080Tic Series (8 inch display Without I/O — Absolute & ATC Supported)
  {
    modelNumber: 'SZGH-1080Tic-2',
    spec: 'CNC 2-axis Absolute Lathe Controller, ATC Supported (8 inch display Without I/O)',
    description:
      'CNC 2 axis Absolute lathe controller, ATC Supported, 8 inch display Without I/O. High-speed bus-type dual-panel SZGH-1080Tic CNC lathe controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) & turret PLC logic, MODBUS/Ethernet bus interface, and 8-inch display Without I/O.',
    pricePKR: 235000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-1080Tic-3',
    spec: 'CNC 3-axis Absolute Lathe Controller, ATC Supported (8 inch display Without I/O)',
    description:
      'CNC 3 axis Absolute lathe controller, ATC Supported, 8 inch display Without I/O. High-speed bus-type dual-panel SZGH-1080Tic CNC lathe controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) & turret PLC logic, MODBUS/Ethernet bus interface, and 8-inch display Without I/O.',
    pricePKR: 261000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-1080Tic-4',
    spec: 'CNC 4-axis Absolute Lathe Controller, ATC Supported (8 inch display Without I/O)',
    description:
      'CNC 4 axis Absolute lathe controller, ATC Supported, 8 inch display Without I/O. High-speed bus-type dual-panel SZGH-1080Tic CNC lathe controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) & turret PLC logic, MODBUS/Ethernet bus interface, and 8-inch display Without I/O.',
    pricePKR: 287000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-1080Tic-5',
    spec: 'CNC 5-axis Absolute Lathe Controller, ATC Supported (8 inch display Without I/O)',
    description:
      'CNC 5 axis Absolute lathe controller, ATC Supported, 8 inch display Without I/O. High-speed bus-type dual-panel SZGH-1080Tic CNC lathe controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) & turret PLC logic, MODBUS/Ethernet bus interface, and 8-inch display Without I/O.',
    pricePKR: 313000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Lathe controller',
  },

  // 880MC Series (8-inch display with I/O — Absolute & ATC Supported)
  {
    modelNumber: 'SZGH-880MC-3',
    spec: '3-axis Absolute Milling Machine Controller, ATC Supported (8-inch display with I/O)',
    description:
      '3-axis Absolute milling machine controller, ATC Supported, 8-inch display with I/O. High-reliability SZGH-880MC CNC milling and drilling controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) PLC ladder support, 8-inch color LCD, and I/O interface.',
    pricePKR: 176000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-880MC-4',
    spec: '4-axis Absolute Milling Machine Controller, ATC Supported (8-inch display with I/O)',
    description:
      '4-axis Absolute milling machine controller, ATC Supported, 8-inch display with I/O. High-reliability SZGH-880MC CNC milling and drilling controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) PLC ladder support, 8-inch color LCD, and I/O interface.',
    pricePKR: 202000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-880MC-5',
    spec: '5-axis Absolute Milling Machine Controller, ATC Supported (8-inch display with I/O)',
    description:
      '5-axis Absolute milling machine controller, ATC Supported, 8-inch display with I/O. High-reliability SZGH-880MC CNC milling and drilling controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) PLC ladder support, 8-inch color LCD, and I/O interface.',
    pricePKR: 228000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-880MC-6',
    spec: '6-axis Absolute Milling Machine Controller, ATC Supported (8-inch display with I/O)',
    description:
      '6-axis Absolute milling machine controller, ATC Supported, 8-inch display with I/O. High-reliability SZGH-880MC CNC milling and drilling controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) PLC ladder support, 8-inch color LCD, and I/O interface.',
    pricePKR: 253000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },

  // 880VTC Series (Vertical Type CNC 2..6 Axis Lathe Controller, 8 inch display, without I/O Board)
  {
    modelNumber: 'SZGH-880VTC-2',
    spec: 'Vertical Type CNC 2-axis Lathe Controller (8 inch display, without I/O Board)',
    description:
      'vertical type CNC 2 axis lathe controller , 8 inch display, without I/O Board',
    pricePKR: 137574,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-880VTC-3',
    spec: 'Vertical Type CNC 3-axis Lathe Controller (8 inch display, without I/O Board)',
    description:
      'vertical type CNC 3 axis lathe controller , 8 inch display, without I/O Board',
    pricePKR: 159040,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-880VTC-4',
    spec: 'Vertical Type CNC 4-axis Lathe Controller (8 inch display, without I/O Board)',
    description:
      'vertical type CNC 4 axis lathe controller , 8 inch display, without I/O Board',
    pricePKR: 173761,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-880VTC-5',
    spec: 'Vertical Type CNC 5-axis Lathe Controller (8 inch display, without I/O Board)',
    description:
      'vertical type CNC 5 axis lathe controller , 8 inch display, without I/O Board',
    pricePKR: 188482,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-880VTC-6',
    spec: 'Vertical Type CNC 6-axis Lathe Controller (8 inch display, without I/O Board)',
    description:
      'vertical type CNC 6 axis lathe controller , 8 inch display, without I/O Board',
    pricePKR: 201130,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Lathe controller',
  },

  // 880VMC Series (Vertical Type CNC 2..6 Axis Milling Controller, 8 inch display, without I/O Board)
  {
    modelNumber: 'SZGH-880VMC-2',
    spec: 'Vertical Type CNC 2-axis Milling Controller (8 inch display, without I/O Board)',
    description:
      'vertical type CNC 2 axis milling controller , 8 inch display, without I/O Board',
    pricePKR: 150221,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-880VMC-3',
    spec: 'Vertical Type CNC 3-axis Milling Controller (8 inch display, without I/O Board)',
    description:
      'vertical type CNC 3 axis milling controller 8 inch display,without I/O Board',
    pricePKR: 164942,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-880VMC-4',
    spec: 'Vertical Type CNC 4-axis Milling Controller (8 inch display, without I/O Board)',
    description:
      'vertical type CNC 4 axis milling controller 8 inch display, without I/O Board',
    pricePKR: 180085,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-880VMC-5',
    spec: 'Vertical Type CNC 5-axis Milling Controller (8 inch display, without I/O Board)',
    description:
      'vertical type CNC 5 axis milling controller 8 inch display, without I/O Board',
    pricePKR: 194806,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-880VMC-6',
    spec: 'Vertical Type CNC 6-axis Milling Controller (8 inch display, without I/O Board)',
    description:
      'vertical type CNC 6 axis milling controller 8 inch display, without I/O Board',
    pricePKR: 207032,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },

  // 1080MC Series (10.4-inch display with I/O — Absolute & ATC Supported)
  {
    modelNumber: 'SZGH-1080MC-3',
    spec: '3-axis Absolute Milling Machine Controller, ATC Supported (10.4-inch display with I/O)',
    description:
      '3-axis Absolute milling machine controller, ATC Supported, 10.4-inch display with I/O. Flagship dual-panel SZGH-1080MC CNC milling and machining center controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) PLC ladder support, 10.4-inch color LCD, and I/O interface.',
    pricePKR: 246000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-1080MC-4',
    spec: '4-axis Absolute Milling Machine Controller, ATC Supported (10.4-inch display with I/O)',
    description:
      '4-axis Absolute milling machine controller, ATC Supported, 10.4-inch display with I/O. Flagship dual-panel SZGH-1080MC CNC milling and machining center controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) PLC ladder support, 10.4-inch color LCD, and I/O interface.',
    pricePKR: 272000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-1080MC-5',
    spec: '5-axis Absolute Milling Machine Controller, ATC Supported (10.4-inch display with I/O)',
    description:
      '5-axis Absolute milling machine controller, ATC Supported, 10.4-inch display with I/O. Flagship dual-panel SZGH-1080MC CNC milling and machining center controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) PLC ladder support, 10.4-inch color LCD, and I/O interface.',
    pricePKR: 298000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-1080MC-6',
    spec: '6-axis Absolute Milling Machine Controller, ATC Supported (10.4-inch display with I/O)',
    description:
      '6-axis Absolute milling machine controller, ATC Supported, 10.4-inch display with I/O. Flagship dual-panel SZGH-1080MC CNC milling and machining center controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) PLC ladder support, 10.4-inch color LCD, and I/O interface.',
    pricePKR: 323000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },

  // 1080Mic Series (8 inch display Without I/O — Absolute & ATC Supported)
  {
    modelNumber: 'SZGH-1080MIC-3',
    spec: 'CNC 3-axis Absolute Controller, ATC Supported (8 inch display Without I/O)',
    description:
      'CNC 3 axis Absolute controller, ATC Supported, 8 inch display Without I/O. High-speed bus-type dual-panel SZGH-1080Mic CNC controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) PLC support, MODBUS/Ethernet bus interface, and 8-inch display Without I/O.',
    pricePKR: 276000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-1080MIC-4',
    spec: 'CNC 4-axis Absolute Controller, ATC Supported (8 inch display Without I/O)',
    description:
      'CNC 4 axis Absolute controller, ATC Supported, 8 inch display Without I/O. High-speed bus-type dual-panel SZGH-1080Mic CNC controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) PLC support, MODBUS/Ethernet bus interface, and 8-inch display Without I/O.',
    pricePKR: 302000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-1080MIC-5',
    spec: 'CNC 5-axis Absolute Controller, ATC Supported (8 inch display Without I/O)',
    description:
      'CNC 5 axis Absolute controller, ATC Supported, 8 inch display Without I/O. High-speed bus-type dual-panel SZGH-1080Mic CNC controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) PLC support, MODBUS/Ethernet bus interface, and 8-inch display Without I/O.',
    pricePKR: 328000,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },

  // CNC990TDb Series (CNC 2..4 axis lathe controller 8 inch display Without I/O)
  {
    modelNumber: 'SZGH-CNC990TDb-2',
    spec: 'CNC 2-axis Lathe Controller (8 inch display Without I/O)',
    description:
      'CNC 2 axis lathe controller 8 inch display Without I/O. Economical SZGH-CNC990TDb CNC turning controller featuring 8-inch color LCD, 0.001mm interpolation accuracy, canned turning/threading cycles, and USB program transfer Without I/O.',
    pricePKR: 117000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC990TDb-3',
    spec: 'CNC 3-axis Lathe Controller (8 inch display Without I/O)',
    description:
      'CNC 3 axis lathe controller 8 inch display Without I/O. Economical SZGH-CNC990TDb CNC turning controller featuring 8-inch color LCD, 0.001mm interpolation accuracy, canned turning/threading cycles, and USB program transfer Without I/O.',
    pricePKR: 143000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC990TDb-4',
    spec: 'CNC 4-axis Lathe Controller (8 inch display Without I/O)',
    description:
      'CNC 4 axis lathe controller 8 inch display Without I/O. Economical SZGH-CNC990TDb CNC turning controller featuring 8-inch color LCD, 0.001mm interpolation accuracy, canned turning/threading cycles, and USB program transfer Without I/O.',
    pricePKR: 169000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },

  // CNC990TDc Series (CNC 2..4 axis Absolute lathe controller 8 inch display Without I/O)
  {
    modelNumber: 'SZGH-CNC990TDc-2',
    spec: 'CNC 2-axis Absolute Lathe Controller (8 inch display Without I/O)',
    description:
      'CNC 2 axis Absolute lathe controller 8 inch display Without I/O. Industrial SZGH-CNC990TDc Absolute CNC turning controller featuring multi-turn Absolute servo encoder support, 8-inch color LCD, real-time toolpath tracking display, and USB DNC interface Without I/O.',
    pricePKR: 145000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC990TDc-3',
    spec: 'CNC 3-axis Absolute Lathe Controller (8 inch display Without I/O)',
    description:
      'CNC 3 axis Absolute lathe controller 8 inch display Without I/O. Industrial SZGH-CNC990TDc Absolute CNC turning controller featuring multi-turn Absolute servo encoder support, 8-inch color LCD, real-time toolpath tracking display, and USB DNC interface Without I/O.',
    pricePKR: 171000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC990TDc-4',
    spec: 'CNC 4-axis Absolute Lathe Controller (8 inch display Without I/O)',
    description:
      'CNC 4 axis Absolute lathe controller 8 inch display Without I/O. Industrial SZGH-CNC990TDc Absolute CNC turning controller featuring multi-turn Absolute servo encoder support, 8-inch color LCD, real-time toolpath tracking display, and USB DNC interface Without I/O.',
    pricePKR: 197000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },

  // CNC1000TDb (A+B Panel) (2..5-axis lathe with panel without I/O)
  {
    modelNumber: 'SZGH-CNC1000TDb-2 (A+B Panel)',
    spec: '2-axis Lathe Controller with (A+B Panel) without I/O',
    description:
      '2-axis lathe with (A+B Panel) without I/O. High-precision SZGH-CNC1000TDb CNC lathe controller with (A+B Panel) without I/O, featuring 8.4-inch color TFT LCD, constant surface speed (G96), and multi-start metric/inch threading.',
    pricePKR: 145000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC1000TDb-3 (A+B Panel)',
    spec: '3-axis Lathe Controller with (A+B Panel) without I/O',
    description:
      '3-axis lathe with (A+B Panel) without I/O. High-precision SZGH-CNC1000TDb CNC lathe controller with (A+B Panel) without I/O, featuring 8.4-inch color TFT LCD, constant surface speed (G96), and multi-start metric/inch threading.',
    pricePKR: 171000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC1000TDb-4 (A+B Panel)',
    spec: '4-axis Lathe Controller with (A+B Panel) without I/O',
    description:
      '4-axis lathe with (A+B Panel) without I/O. High-precision SZGH-CNC1000TDb CNC lathe controller with (A+B Panel) without I/O, featuring 8.4-inch color TFT LCD, constant surface speed (G96), and multi-start metric/inch threading.',
    pricePKR: 197000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC1000TDb-5 (A+B Panel)',
    spec: '5-axis Lathe Controller with (A+B Panel) without I/O',
    description:
      '5-axis lathe with (A+B Panel) without I/O. High-precision SZGH-CNC1000TDb CNC lathe controller with (A+B Panel) without I/O, featuring 8.4-inch color TFT LCD, constant surface speed (G96), and multi-start metric/inch threading.',
    pricePKR: 262000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },

  // CNC1000TDb (C+E Panel) (2..5-axis lathe with panel without I/O)
  {
    modelNumber: 'SZGH-CNC1000TDb-2 (C+E Panel)',
    spec: '2-axis Lathe Controller with (C+E Panel) without I/O',
    description:
      '2-axis lathe with (C+E Panel) without I/O. High-precision SZGH-CNC1000TDb CNC lathe controller with (C+E Panel) without I/O, featuring 8.4-inch color TFT LCD, constant surface speed (G96), and tactile rotary feed/spindle override dials.',
    pricePKR: 162000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC1000TDb-3 (C+E Panel)',
    spec: '3-axis Lathe Controller with (C+E Panel) without I/O',
    description:
      '3-axis lathe with (C+E Panel) without I/O. High-precision SZGH-CNC1000TDb CNC lathe controller with (C+E Panel) without I/O, featuring 8.4-inch color TFT LCD, constant surface speed (G96), and tactile rotary feed/spindle override dials.',
    pricePKR: 187000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC1000TDb-4 (C+E Panel)',
    spec: '4-axis Lathe Controller with (C+E Panel) without I/O',
    description:
      '4-axis lathe with (C+E Panel) without I/O. High-precision SZGH-CNC1000TDb CNC lathe controller with (C+E Panel) without I/O, featuring 8.4-inch color TFT LCD, constant surface speed (G96), and tactile rotary feed/spindle override dials.',
    pricePKR: 213000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC1000TDb-5 (C+E Panel)',
    spec: '5-axis Lathe Controller with (C+E Panel) without I/O',
    description:
      '5-axis lathe with (C+E Panel) without I/O. High-precision SZGH-CNC1000TDb CNC lathe controller with (C+E Panel) without I/O, featuring 8.4-inch color TFT LCD, constant surface speed (G96), and tactile rotary feed/spindle override dials.',
    pricePKR: 278000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },

  // CNC1000TDc (A+B Panel) (2..5-axis Absolute Lathe with panel without I/O)
  {
    modelNumber: 'SZGH-CNC1000TDc-2 (A+B Panel)',
    spec: '2-axis Absolute Lathe Controller with (A+B Panel) without I/O',
    description:
      '2-axis Absolute Lathe with (A+B Panel) without I/O. High-precision SZGH-CNC1000TDc Absolute CNC lathe controller with (A+B Panel) without I/O, featuring multi-turn Absolute encoder support, 8.4-inch color TFT LCD, and constant surface speed (G96).',
    pricePKR: 167000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC1000TDc-3 (A+B Panel)',
    spec: '3-axis Absolute Lathe Controller with (A+B Panel) without I/O',
    description:
      '3-axis Absolute Lathe with (A+B Panel) without I/O. High-precision SZGH-CNC1000TDc Absolute CNC lathe controller with (A+B Panel) without I/O, featuring multi-turn Absolute encoder support, 8.4-inch color TFT LCD, and constant surface speed (G96).',
    pricePKR: 193000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC1000TDc-4 (A+B Panel)',
    spec: '4-axis Absolute Lathe Controller with (A+B Panel) without I/O',
    description:
      '4-axis Absolute Lathe with (A+B Panel) without I/O. High-precision SZGH-CNC1000TDc Absolute CNC lathe controller with (A+B Panel) without I/O, featuring multi-turn Absolute encoder support, 8.4-inch color TFT LCD, and constant surface speed (G96).',
    pricePKR: 219000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC1000TDc-5 (A+B Panel)',
    spec: '5-axis Absolute Lathe Controller with (A+B Panel) without I/O',
    description:
      '5-axis Absolute Lathe with (A+B Panel) without I/O. High-precision SZGH-CNC1000TDc Absolute CNC lathe controller with (A+B Panel) without I/O, featuring multi-turn Absolute encoder support, 8.4-inch color TFT LCD, and constant surface speed (G96).',
    pricePKR: 278000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },

  // CNC1000TDc (C+E Panel) (2..5-axis Absolute Lathe with panel without I/O)
  {
    modelNumber: 'SZGH-CNC1000TDc-2 (C+E Panel)',
    spec: '2-axis Absolute Lathe Controller with (C+E Panel) without I/O',
    description:
      '2-axis Absolute Lathe with (C+E Panel) without I/O. High-precision SZGH-CNC1000TDc Absolute CNC lathe controller with (C+E Panel) without I/O, featuring multi-turn Absolute encoder support, 8.4-inch color TFT LCD, and rotary feed/spindle override dials.',
    pricePKR: 191000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC1000TDc-3 (C+E Panel)',
    spec: '3-axis Absolute Lathe Controller with (C+E Panel) without I/O',
    description:
      '3-axis Absolute Lathe with (C+E Panel) without I/O. High-precision SZGH-CNC1000TDc Absolute CNC lathe controller with (C+E Panel) without I/O, featuring multi-turn Absolute encoder support, 8.4-inch color TFT LCD, and rotary feed/spindle override dials.',
    pricePKR: 217000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC1000TDc-4 (C+E Panel)',
    spec: '4-axis Absolute Lathe Controller with (C+E Panel) without I/O',
    description:
      '4-axis Absolute Lathe with (C+E Panel) without I/O. High-precision SZGH-CNC1000TDc Absolute CNC lathe controller with (C+E Panel) without I/O, featuring multi-turn Absolute encoder support, 8.4-inch color TFT LCD, and rotary feed/spindle override dials.',
    pricePKR: 243000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC1000TDc-5 (C+E Panel)',
    spec: '5-axis Absolute Lathe Controller with (C+E Panel) without I/O',
    description:
      '5-axis Absolute Lathe with (C+E Panel) without I/O. High-precision SZGH-CNC1000TDc Absolute CNC lathe controller with (C+E Panel) without I/O, featuring multi-turn Absolute encoder support, 8.4-inch color TFT LCD, and rotary feed/spindle override dials.',
    pricePKR: 293496,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },

  // CNC1500TDb (A+B Panel) (2..5-axis vertical Lathe with panel without I/O)
  {
    modelNumber: 'SZGH-CNC1500TDb-2 (A+B Panel)',
    spec: '2-axis Vertical Lathe Controller with (A+B Panel) without I/O',
    description:
      '2-axis vertical Lathe with (A+B Panel) without I/O. Industrial SZGH-CNC1500TDb vertical CNC lathe controller with (A+B Panel) without I/O, engineered for vertical turning lathes and heavy turning centers.',
    pricePKR: 170000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC1500TDb-3 (A+B Panel)',
    spec: '3-axis Vertical Lathe Controller with (A+B Panel) without I/O',
    description:
      '3-axis vertical Lathe with (A+B Panel) without I/O. Industrial SZGH-CNC1500TDb vertical CNC lathe controller with (A+B Panel) without I/O, engineered for vertical turning lathes and heavy turning centers.',
    pricePKR: 196000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC1500TDb-4 (A+B Panel)',
    spec: '4-axis Vertical Lathe Controller with (A+B Panel) without I/O',
    description:
      '4-axis vertical Lathe with (A+B Panel) without I/O. Industrial SZGH-CNC1500TDb vertical CNC lathe controller with (A+B Panel) without I/O, engineered for vertical turning lathes and heavy turning centers.',
    pricePKR: 222000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC1500TDb-5 (A+B Panel)',
    spec: '5-axis Vertical Lathe Controller with (A+B Panel) without I/O',
    description:
      '5-axis vertical Lathe with (A+B Panel) without I/O. Industrial SZGH-CNC1500TDb vertical CNC lathe controller with (A+B Panel) without I/O, engineered for vertical turning lathes and heavy turning centers.',
    pricePKR: 248000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },

  // CNC1500TDc (A+B Panel) (2..5-axis Absolute Lathe vertical with panel Without I/O)
  {
    modelNumber: 'SZGH-CNC1500TDc-2 (A+B Panel)',
    spec: '2-axis Absolute Lathe Vertical Controller with (A+B Panel) Without I/O',
    description:
      '2-axis Absolute Lathe vertical with (A+B Panel) Without I/O. High-precision SZGH-CNC1500TDc Absolute vertical CNC lathe controller with (A+B Panel) Without I/O, featuring multi-turn Absolute encoder support for vertical turning centers.',
    pricePKR: 191000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC1500TDc-3 (A+B Panel)',
    spec: '3-axis Absolute Lathe Vertical Controller with (A+B Panel) Without I/O',
    description:
      '3-axis Absolute Lathe vertical with (A+B Panel) Without I/O. High-precision SZGH-CNC1500TDc Absolute vertical CNC lathe controller with (A+B Panel) Without I/O, featuring multi-turn Absolute encoder support for vertical turning centers.',
    pricePKR: 217000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC1500TDc-4 (A+B Panel)',
    spec: '4-axis Absolute Lathe Vertical Controller with (A+B Panel) Without I/O',
    description:
      '4-axis Absolute Lathe vertical with (A+B Panel) Without I/O. High-precision SZGH-CNC1500TDc Absolute vertical CNC lathe controller with (A+B Panel) Without I/O, featuring multi-turn Absolute encoder support for vertical turning centers.',
    pricePKR: 243000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },
  {
    modelNumber: 'SZGH-CNC1500TDc-5 (A+B Panel)',
    spec: '5-axis Absolute Lathe Vertical Controller with (A+B Panel) Without I/O',
    description:
      '5-axis Absolute Lathe vertical with (A+B Panel) Without I/O. High-precision SZGH-CNC1500TDc Absolute vertical CNC lathe controller with (A+B Panel) Without I/O, featuring multi-turn Absolute encoder support for vertical turning centers.',
    pricePKR: 300000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Lathe controller',
  },

  // CNC990MDb Series (3..4-axis milling without panel Without I/O)
  {
    modelNumber: 'SZGH-CNC990MDb-3',
    spec: '3-axis Milling Controller without panel Without I/O',
    description:
      '3-axis milling without panel Without I/O. Compact SZGH-CNC990MDb CNC milling and drilling controller without panel and Without I/O, featuring 8-inch color LCD, high-speed look-ahead interpolation, and USB DNC drip-feeding.',
    pricePKR: 146000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC990MDb-4',
    spec: '4-axis Milling Controller without panel Without I/O',
    description:
      '4-axis milling without panel Without I/O. Compact SZGH-CNC990MDb CNC milling and drilling controller without panel and Without I/O, featuring 8-inch color LCD, high-speed look-ahead interpolation, and USB DNC drip-feeding.',
    pricePKR: 172000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },

  // CNC990MDc Series (3..4-axis Absolute milling without panel Without I/O)
  {
    modelNumber: 'SZGH-CNC990MDc-3',
    spec: '3-axis Absolute Milling Controller without panel Without I/O',
    description:
      '3-axis Absolute milling without panel Without I/O. High-performance SZGH-CNC990MDc Absolute CNC milling and drilling controller without panel and Without I/O, featuring multi-turn Absolute servo encoder support, 8-inch color LCD, real-time toolpath tracking, and USB DNC drip-feeding.',
    pricePKR: 171000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC990MDc-4',
    spec: '4-axis Absolute Milling Controller without panel Without I/O',
    description:
      '4-axis Absolute milling without panel Without I/O. High-performance SZGH-CNC990MDc Absolute CNC milling and drilling controller without panel and Without I/O, featuring multi-turn Absolute servo encoder support, 8-inch color LCD, real-time toolpath tracking, and USB DNC drip-feeding.',
    pricePKR: 197000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },

  // CNC1000MDb (A+B Panel) (3..5-axis Milling with panel Without I/O)
  {
    modelNumber: 'SZGH-CNC1000MDb-3 (A+B Panel)',
    spec: '3-axis Milling Controller with (A+B Panel) Without I/O',
    description:
      '3-axis Milling with (A+B Panel) Without I/O. Industrial SZGH-CNC1000MDb CNC milling and drilling controller with (A+B Panel) Without I/O, featuring 8.4-inch color TFT LCD, simultaneous linear/circular/helical interpolation, and USB DNC interface.',
    pricePKR: 171000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC1000MDb-4 (A+B Panel)',
    spec: '4-axis Milling Controller with (A+B Panel) Without I/O',
    description:
      '4-axis Milling with (A+B Panel) Without I/O. Industrial SZGH-CNC1000MDb CNC milling and drilling controller with (A+B Panel) Without I/O, featuring 8.4-inch color TFT LCD, simultaneous linear/circular/helical interpolation, and USB DNC interface.',
    pricePKR: 197000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC1000MDb-5 (A+B Panel)',
    spec: '5-axis Milling Controller with (A+B Panel) Without I/O',
    description:
      '5-axis Milling with (A+B Panel) Without I/O. Industrial SZGH-CNC1000MDb CNC milling and drilling controller with (A+B Panel) Without I/O, featuring 8.4-inch color TFT LCD, simultaneous linear/circular/helical interpolation, and USB DNC interface.',
    pricePKR: 263730,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },

  // CNC1000MDb (C+E Panel) (3..5-axis Milling with panel Without I/O)
  {
    modelNumber: 'SZGH-CNC1000MDb-3 (C+E Panel)',
    spec: '3-axis Milling Controller with (C+E Panel) Without I/O',
    description:
      '3-axis Milling with (C+E Panel) Without I/O. Industrial SZGH-CNC1000MDb CNC milling and drilling controller with (C+E Panel) Without I/O, featuring 8.4-inch color TFT LCD, rotary feed/spindle override dials, and USB DNC interface.',
    pricePKR: 187000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC1000MDb-4 (C+E Panel)',
    spec: '4-axis Milling Controller with (C+E Panel) Without I/O',
    description:
      '4-axis Milling with (C+E Panel) Without I/O. Industrial SZGH-CNC1000MDb CNC milling and drilling controller with (C+E Panel) Without I/O, featuring 8.4-inch color TFT LCD, rotary feed/spindle override dials, and USB DNC interface.',
    pricePKR: 212000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC1000MDb-5 (C+E Panel)',
    spec: '5-axis Milling Controller with (C+E Panel) Without I/O',
    description:
      '5-axis Milling with (C+E Panel) Without I/O. Industrial SZGH-CNC1000MDb CNC milling and drilling controller with (C+E Panel) Without I/O, featuring 8.4-inch color TFT LCD, rotary feed/spindle override dials, and USB DNC interface.',
    pricePKR: 278000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },

  // CNC1000MDc (A+B Panel) (3..5-axis Absolute milling without panel Without I/O)
  {
    modelNumber: 'SZGH-CNC1000MDc-3 (A+B Panel)',
    spec: '3-axis Absolute Milling Controller without panel Without I/O (A+B Panel)',
    description:
      '3-axis Absolute milling without panel Without I/O (A+B Panel). High-performance SZGH-CNC1000MDc Absolute CNC milling and drilling controller (A+B Panel) Without I/O, featuring multi-turn Absolute encoder support, 8.4-inch color TFT LCD, and real-time 3D toolpath tracking.',
    pricePKR: 192000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC1000MDc-4 (A+B Panel)',
    spec: '4-axis Absolute Milling Controller without panel Without I/O (A+B Panel)',
    description:
      '4-axis Absolute milling without panel Without I/O (A+B Panel). High-performance SZGH-CNC1000MDc Absolute CNC milling and drilling controller (A+B Panel) Without I/O, featuring multi-turn Absolute encoder support, 8.4-inch color TFT LCD, and real-time 3D toolpath tracking.',
    pricePKR: 218000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC1000MDc-5 (A+B Panel)',
    spec: '5-axis Absolute Milling Controller without panel Without I/O (A+B Panel)',
    description:
      '5-axis Absolute milling without panel Without I/O (A+B Panel). High-performance SZGH-CNC1000MDc Absolute CNC milling and drilling controller (A+B Panel) Without I/O, featuring multi-turn Absolute encoder support, 8.4-inch color TFT LCD, and real-time 3D toolpath tracking.',
    pricePKR: 284000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },

  // CNC1000MDc (C+E Panel) (3..5-axis Absolute milling without panel Without I/O)
  {
    modelNumber: 'SZGH-CNC1000MDc-3 (C+E Panel)',
    spec: '3-axis Absolute Milling Controller without panel Without I/O (C+E Panel)',
    description:
      '3-axis Absolute milling without panel Without I/O (C+E Panel). High-performance SZGH-CNC1000MDc Absolute CNC milling and drilling controller (C+E Panel) Without I/O, featuring multi-turn Absolute encoder support, 8.4-inch color TFT LCD, and real-time 3D toolpath tracking.',
    pricePKR: 217000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC1000MDc-4 (C+E Panel)',
    spec: '4-axis Absolute Milling Controller without panel Without I/O (C+E Panel)',
    description:
      '4-axis Absolute milling without panel Without I/O (C+E Panel). High-performance SZGH-CNC1000MDc Absolute CNC milling and drilling controller (C+E Panel) Without I/O, featuring multi-turn Absolute encoder support, 8.4-inch color TFT LCD, and real-time 3D toolpath tracking.',
    pricePKR: 242000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC1000MDc-5 (C+E Panel)',
    spec: '5-axis Absolute Milling Controller without panel Without I/O (C+E Panel)',
    description:
      '5-axis Absolute milling without panel Without I/O (C+E Panel). High-performance SZGH-CNC1000MDc Absolute CNC milling and drilling controller (C+E Panel) Without I/O, featuring multi-turn Absolute encoder support, 8.4-inch color TFT LCD, and real-time 3D toolpath tracking.',
    pricePKR: 350000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },

  // CNC1500MDb (A+B Panel) (3..5-axis milling without panel Without I/O)
  {
    modelNumber: 'SZGH-CNC1500MDb-3 (A+B Panel)',
    spec: '3-axis Milling Controller without panel Without I/O (A+B Panel)',
    description:
      '3-axis milling without panel Without I/O (A+B Panel). Industrial SZGH-CNC1500MDb CNC milling and drilling controller (A+B Panel) Without I/O, featuring high-speed interpolation, real-time toolpath tracking, and USB DNC interface.',
    pricePKR: 192000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC1500MDb-4 (A+B Panel)',
    spec: '4-axis Milling Controller without panel Without I/O (A+B Panel)',
    description:
      '4-axis milling without panel Without I/O (A+B Panel). Industrial SZGH-CNC1500MDb CNC milling and drilling controller (A+B Panel) Without I/O, featuring high-speed interpolation, real-time toolpath tracking, and USB DNC interface.',
    pricePKR: 218000,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC1500MDb-5 (A+B Panel)',
    spec: '5-axis Milling Controller without panel Without I/O (A+B Panel)',
    description:
      '5-axis milling without panel Without I/O (A+B Panel). Industrial SZGH-CNC1500MDb CNC milling and drilling controller (A+B Panel) Without I/O, featuring high-speed interpolation, real-time toolpath tracking, and USB DNC interface.',
    pricePKR: 283444,
    isAbsolute: false,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },

  // CNC1500MDc (A+B Panel) (3..5-axis Absolute milling Vertical without panel Without I/O)
  {
    modelNumber: 'SZGH-CNC1500MDc-3 (A+B Panel)',
    spec: '3-axis Absolute Milling Vertical Controller without panel Without I/O (A+B Panel)',
    description:
      '3-axis Absolute milling Vertical without panel Without I/O (A+B Panel). High-precision SZGH-CNC1500MDc Absolute vertical CNC milling controller (A+B Panel) Without I/O, featuring multi-turn Absolute servo encoder support for vertical milling machines.',
    pricePKR: 217000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC1500MDc-4 (A+B Panel)',
    spec: '4-axis Absolute Milling Vertical Controller without panel Without I/O (A+B Panel)',
    description:
      '4-axis Absolute milling Vertical without panel Without I/O (A+B Panel). High-precision SZGH-CNC1500MDc Absolute vertical CNC milling controller (A+B Panel) Without I/O, featuring multi-turn Absolute servo encoder support for vertical milling machines.',
    pricePKR: 242000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC1500MDc-5 (A+B Panel)',
    spec: '5-axis Absolute Milling Vertical Controller without panel Without I/O (A+B Panel)',
    description:
      '5-axis Absolute milling Vertical without panel Without I/O (A+B Panel). High-precision SZGH-CNC1500MDc Absolute vertical CNC milling controller (A+B Panel) Without I/O, featuring multi-turn Absolute servo encoder support for vertical milling machines.',
    pricePKR: 350000,
    isAbsolute: true,
    supportsATC: false,
    subcategory: 'Drilling and milling machine CNC controller',
  },

  // CNC1000MDcb (C+E Panel) (3..5-axis milling, ATC Support, without panel Without I/O)
  {
    modelNumber: 'SZGH-CNC1000MDcb-3 (C+E Panel)',
    spec: '3-axis Milling Controller, ATC Support, without panel Without I/O (C+E Panel)',
    description:
      '3-axis milling, ATC Support, without panel Without I/O (C+E Panel). Industrial SZGH-CNC1000MDcb CNC milling and machining center controller (C+E Panel) Without I/O, featuring full Automatic Tool Changer (ATC) PLC support, 8.4-inch color TFT LCD, and real-time 3D toolpath tracking.',
    pricePKR: 257000,
    isAbsolute: false,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC1000MDcb-4 (C+E Panel)',
    spec: '4-axis Milling Controller, ATC Support, without panel Without I/O (C+E Panel)',
    description:
      '4-axis milling, ATC Support, without panel Without I/O (C+E Panel). Industrial SZGH-CNC1000MDcb CNC milling and machining center controller (C+E Panel) Without I/O, featuring full Automatic Tool Changer (ATC) PLC support, 8.4-inch color TFT LCD, and real-time 3D toolpath tracking.',
    pricePKR: 263000,
    isAbsolute: false,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC1000MDcb-5 (C+E Panel)',
    spec: '5-axis Milling Controller, ATC Support, without panel Without I/O (C+E Panel)',
    description:
      '5-axis milling, ATC Support, without panel Without I/O (C+E Panel). Industrial SZGH-CNC1000MDcb CNC milling and machining center controller (C+E Panel) Without I/O, featuring full Automatic Tool Changer (ATC) PLC support, 8.4-inch color TFT LCD, and real-time 3D toolpath tracking.',
    pricePKR: 370000,
    isAbsolute: false,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },

  // CNC1000MDcb(H) (C+E Panel) (3..5-axis Absolute milling, ATC Support, without panel Without I/O)
  {
    modelNumber: 'SZGH-CNC1000MDcb-3(H) (C+E Panel)',
    spec: '3-axis Absolute Milling Controller, ATC Support, without panel Without I/O (C+E Panel)',
    description:
      '3-axis Absolute milling, ATC Support, without panel Without I/O (C+E Panel). High-performance SZGH-CNC1000MDcb(H) Absolute CNC milling and machining center controller (C+E Panel) Without I/O, featuring multi-turn Absolute encoder support and full Automatic Tool Changer (ATC) PLC support.',
    pricePKR: 262730,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC1000MDcb-4(H) (C+E Panel)',
    spec: '4-axis Absolute Milling Controller, ATC Support, without panel Without I/O (C+E Panel)',
    description:
      '4-axis Absolute milling, ATC Support, without panel Without I/O (C+E Panel). High-performance SZGH-CNC1000MDcb(H) Absolute CNC milling and machining center controller (C+E Panel) Without I/O, featuring multi-turn Absolute encoder support and full Automatic Tool Changer (ATC) PLC support.',
    pricePKR: 287730,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC1000MDcb-5(H) (C+E Panel)',
    spec: '5-axis Absolute Milling Controller, ATC Support, without panel Without I/O (C+E Panel)',
    description:
      '5-axis Absolute milling, ATC Support, without panel Without I/O (C+E Panel). High-performance SZGH-CNC1000MDcb(H) Absolute CNC milling and machining center controller (C+E Panel) Without I/O, featuring multi-turn Absolute encoder support and full Automatic Tool Changer (ATC) PLC support.',
    pricePKR: 347649,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },

  // CNC1500MDcb (C Panel) (3..5-axis Absolute milling Vertical, ATC support, without panel Without I/O)
  {
    modelNumber: 'SZGH-CNC1500MDcb-3 (C Panel)',
    spec: '3-axis Absolute Milling Vertical Controller, ATC Support, without panel Without I/O (C Panel)',
    description:
      '3-axis Absolute milling Vertical, ATC support, without panel Without I/O (C Panel). Flagship SZGH-CNC1500MDcb Absolute vertical CNC milling and machining center controller (C Panel) Without I/O, featuring multi-turn Absolute encoder support and full Automatic Tool Changer (ATC) PLC support.',
    pricePKR: 241298,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC1500MDcb-4 (C Panel)',
    spec: '4-axis Absolute Milling Vertical Controller, ATC Support, without panel Without I/O (C Panel)',
    description:
      '4-axis Absolute milling Vertical, ATC support, without panel Without I/O (C Panel). Flagship SZGH-CNC1500MDcb Absolute vertical CNC milling and machining center controller (C Panel) Without I/O, featuring multi-turn Absolute encoder support and full Automatic Tool Changer (ATC) PLC support.',
    pricePKR: 266298,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },
  {
    modelNumber: 'SZGH-CNC1500MDcb-5 (C Panel)',
    spec: '5-axis Absolute Milling Vertical Controller, ATC Support, without panel Without I/O (C Panel)',
    description:
      '5-axis Absolute milling Vertical, ATC support, without panel Without I/O (C Panel). Flagship SZGH-CNC1500MDcb Absolute vertical CNC milling and machining center controller (C Panel) Without I/O, featuring multi-turn Absolute encoder support and full Automatic Tool Changer (ATC) PLC support.',
    pricePKR: 347649,
    isAbsolute: true,
    supportsATC: true,
    subcategory: 'Drilling and milling machine CNC controller',
  },
];

export function buildControllerFeatures(row: ControllerRateRow): string[] {
  const features: string[] = [
    row.isAbsolute
      ? 'Multi-turn Absolute servo encoder support for zero-return-free power-on positioning'
      : '0.001 mm high-precision interpolation accuracy with high-speed look-ahead contour control',
  ];

  if (row.supportsATC) {
    features.push(
      row.subcategory === 'Lathe controller'
        ? 'ATC Supported — Built-in open PLC ladder for Automatic Tool Changers (ATC) and multi-station electric/hydraulic turrets'
        : 'ATC Supported — Built-in open PLC ladder for Umbrella, Linear, and Arm-Type Automatic Tool Changers (ATC)'
    );
  } else {
    features.push(
      row.subcategory === 'Lathe controller'
        ? 'Supports constant surface speed (G96), canned turning/threading cycles, and spindle encoder feedback'
        : 'Simultaneous linear, circular, and helical interpolation with real-time toolpath tracking display'
    );
  }

  features.push(
    'Front USB flash program transfer, RS232/RS485 DNC communication, and MPG handwheel interface',
    'Compatible with Without I/O and With I/O (+PKR 22,000) expansion board configurations'
  );

  return features;
}

/**
 * Official SZGH Pakistan "Servo Motor Drive Rate List" (48 Servo Motor Models & 27 Servo Drive Models)
 */
export const SERVO_MOTOR_RATE_LIST_2026: ServoMotorRateRow[] = [
  { modelNumber: 'SZGH-04005D', spec: '50W,0.16NM,3000RPM', basePricePKR: 33414.75, baseDealerPricePKR: 32964.75, brakePricePKR: 56538.75, brakeDealerPricePKR: 56088.75, absolutePricePKR: 70074.75, absoluteDealerPricePKR: 69624.75 },
  { modelNumber: 'SZGH-04010D', spec: '100W,0.32NM,3000RPM', basePricePKR: 37491.00, baseDealerPricePKR: 37076.00, brakePricePKR: 60615.00, brakeDealerPricePKR: 60200.00, absolutePricePKR: 74151.00, absoluteDealerPricePKR: 73736.00 },
  { modelNumber: 'SZGH-06020DC', spec: '200W,0.637NM,3000RPM', basePricePKR: 29575.26, baseDealerPricePKR: 28925.26, brakePricePKR: 52699.26, brakeDealerPricePKR: 52049.26, absolutePricePKR: 66235.26, absoluteDealerPricePKR: 65585.26 },
  { modelNumber: 'SZGH-06040DC', spec: '400,1.27NM,3000RPM', basePricePKR: 31393.35, baseDealerPricePKR: 30393.35, brakePricePKR: 54517.35, brakeDealerPricePKR: 53517.35, absolutePricePKR: 68053.35, absoluteDealerPricePKR: 67053.35 },
  { modelNumber: 'SZGH-06060DC', spec: '600W,1.91NM,3000RPM', basePricePKR: 39557.88, baseDealerPricePKR: 38307.88, brakePricePKR: 62681.88, brakeDealerPricePKR: 61431.88, absolutePricePKR: 76217.88, absoluteDealerPricePKR: 74967.88 },
  { modelNumber: 'SZGH-08040DC', spec: '80mm flange,400W,1.27NM,3000RPM', basePricePKR: 36493.80, baseDealerPricePKR: 34743.80, brakePricePKR: 59617.80, brakeDealerPricePKR: 57867.80, absolutePricePKR: 73153.80, absoluteDealerPricePKR: 71403.80 },
  { modelNumber: 'SZGH-08075BC', spec: '80 flange 750W,3.5NM,2000RPM', basePricePKR: 43815.15, baseDealerPricePKR: 41815.15, brakePricePKR: 66939.15, brakeDealerPricePKR: 64939.15, absolutePricePKR: 80475.15, absoluteDealerPricePKR: 78475.15 },
  { modelNumber: 'SZGH-08075DC', spec: '80 flange 750W,2.4NM,3000RPM', basePricePKR: 36339.48, baseDealerPricePKR: 34839.48, brakePricePKR: 59463.48, brakeDealerPricePKR: 57963.48, absolutePricePKR: 72999.48, absoluteDealerPricePKR: 71499.48 },
  { modelNumber: 'SZGH-08100CC', spec: '1000W,4NM,2500RPM', basePricePKR: 56895.60, baseDealerPricePKR: 52145.60, brakePricePKR: 80019.60, brakeDealerPricePKR: 75269.60, absolutePricePKR: 93555.60, absoluteDealerPricePKR: 88805.60 },
  { modelNumber: 'SZGH-09075BC', spec: '90 flange730W,3.5NM,2000RPM', basePricePKR: 43815.15, baseDealerPricePKR: 41815.15, brakePricePKR: 66939.15, brakeDealerPricePKR: 64939.15, absolutePricePKR: 80475.15, absoluteDealerPricePKR: 78475.15 },
  { modelNumber: 'SZGH-09075DC', spec: '90 flange 750W,2.4NM,3000RPM', basePricePKR: 39331.98, baseDealerPricePKR: 37081.98, brakePricePKR: 62455.98, brakeDealerPricePKR: 60205.98, absolutePricePKR: 75991.98, absoluteDealerPricePKR: 73741.98 },
  { modelNumber: 'SZGH-09100CC', spec: '1000W,4NM,2500RPM', basePricePKR: 47918.10, baseDealerPricePKR: 45418.10, brakePricePKR: 71042.10, brakeDealerPricePKR: 68542.10, absolutePricePKR: 84578.10, absoluteDealerPricePKR: 82078.10 },
  { modelNumber: 'SZGH-11060DC', spec: '110 mm flange 600W,2 NM,3000RPM', basePricePKR: 48185.37, baseDealerPricePKR: 45935.37, brakePricePKR: 71309.37, brakeDealerPricePKR: 69059.37, absolutePricePKR: 84845.37, absoluteDealerPricePKR: 82595.37 },
  { modelNumber: 'SZGH-11080DC', spec: '110mm flange 800W,4NM,2000RPM', basePricePKR: 50026.05, baseDealerPricePKR: 47526.05, brakePricePKR: 73150.05, brakeDealerPricePKR: 70650.05, absolutePricePKR: 86686.05, absoluteDealerPricePKR: 84186.05 },
  { modelNumber: 'SZGH-11120BC', spec: '1200W,6NM,2000RPM', basePricePKR: 53018.55, baseDealerPricePKR: 49768.55, brakePricePKR: 76142.55, brakeDealerPricePKR: 72892.55, absolutePricePKR: 89678.55, absoluteDealerPricePKR: 86428.55 },
  { modelNumber: 'SZGH-11120DC', spec: '1200W,4NM,3000RPM', basePricePKR: 53018.55, baseDealerPricePKR: 49768.55, brakePricePKR: 76142.55, brakeDealerPricePKR: 72892.55, absolutePricePKR: 89678.55, absoluteDealerPricePKR: 86428.55 },
  { modelNumber: 'SZGH-11150DC', spec: '1.5KW,5NM,', basePricePKR: 59959.68, baseDealerPricePKR: 55709.68, brakePricePKR: 83083.68, brakeDealerPricePKR: 78833.68, absolutePricePKR: 96619.68, absoluteDealerPricePKR: 92369.68 },
  { modelNumber: 'SZGH-11180DC', spec: '1800W,6NM,3000RPM', basePricePKR: 79292.40, baseDealerPricePKR: 71042.40, brakePricePKR: 102416.40, brakeDealerPricePKR: 94166.40, absolutePricePKR: 115952.40, absoluteDealerPricePKR: 107702.40 },
  { modelNumber: 'SZGH-13100AC', spec: '1.0kw,10NM,1000rpm', basePricePKR: 76751.70, baseDealerPricePKR: 71251.70, brakePricePKR: 99875.70, brakeDealerPricePKR: 94375.70, absolutePricePKR: 113411.70, absoluteDealerPricePKR: 107911.70 },
  { modelNumber: 'SZGH-13100CC', spec: '1kw,4NM, 2500rpm', basePricePKR: 62026.26, baseDealerPricePKR: 58526.26, brakePricePKR: 85150.26, brakeDealerPricePKR: 81650.26, absolutePricePKR: 98686.26, absoluteDealerPricePKR: 95186.26 },
  { modelNumber: 'SZGH-13130CC', spec: '1.3kw,5Nm,2500rpm', basePricePKR: 69614.88, baseDealerPricePKR: 66114.88, brakePricePKR: 92738.88, brakeDealerPricePKR: 89238.88, absolutePricePKR: 106274.88, absoluteDealerPricePKR: 102774.88 },
  { modelNumber: 'SZGH-13150AC', spec: '1.5kw,10NM, 1500rpm', basePricePKR: 76751.70, baseDealerPricePKR: 71251.70, brakePricePKR: 99875.70, brakeDealerPricePKR: 94375.70, absolutePricePKR: 113411.70, absoluteDealerPricePKR: 107911.70 },
  { modelNumber: 'SZGH-13150CC', spec: '1.5kw,6NM, 2500rpm', basePricePKR: 62962.18, baseDealerPricePKR: 54962.18, brakePricePKR: 86086.18, brakeDealerPricePKR: 78086.18, absolutePricePKR: 99622.18, absoluteDealerPricePKR: 91622.18 },
  { modelNumber: 'SZGH-13200BC', spec: '2KW,2000rpm,10NM', basePricePKR: 74766.70, baseDealerPricePKR: 66766.70, brakePricePKR: 97890.70, brakeDealerPricePKR: 89890.70, absolutePricePKR: 111426.70, absoluteDealerPricePKR: 103426.70 },
  { modelNumber: 'SZGH-13200CC', spec: '2kw,7.7NM, 2500rpm', basePricePKR: 68442.85, baseDealerPricePKR: 60442.85, brakePricePKR: 91566.85, brakeDealerPricePKR: 83566.85, absolutePricePKR: 105102.85, absoluteDealerPricePKR: 97102.85 },
  { modelNumber: 'SZGH-13230AC', spec: '2.3kw,15NM,1500rpm', basePricePKR: 93565.55, baseDealerPricePKR: 80565.55, brakePricePKR: 116689.55, brakeDealerPricePKR: 103689.55, absolutePricePKR: 130225.55, absoluteDealerPricePKR: 117225.55 },
  { modelNumber: 'SZGH-13260CC', spec: '2.6kw, 10NM, 2500rpm', basePricePKR: 81004.20, baseDealerPricePKR: 70504.20, brakePricePKR: 104128.20, brakeDealerPricePKR: 93628.20, absolutePricePKR: 117664.20, absoluteDealerPricePKR: 107164.20 },
  { modelNumber: 'SZGH-13300CC', spec: '3KW,15NM 2000rpm', basePricePKR: 92318.05, baseDealerPricePKR: 79818.05, brakePricePKR: 115442.05, brakeDealerPricePKR: 102942.05, absolutePricePKR: 128978.05, absoluteDealerPricePKR: 116478.05 },
  { modelNumber: 'SZGH-13380CC', spec: '3.8kw,15NM,2500rpm', basePricePKR: 92318.05, baseDealerPricePKR: 79818.05, brakePricePKR: 115442.05, brakeDealerPricePKR: 102942.05, absolutePricePKR: 128978.05, absoluteDealerPricePKR: 116478.05 },
  { modelNumber: 'SZGH-15300BC', spec: '150mm flange , 3KW,15nm,2000RPM', basePricePKR: 143880.03, baseDealerPricePKR: 122880.03, brakePricePKR: 167004.03, brakeDealerPricePKR: 146004.03, absolutePricePKR: 180540.03, absoluteDealerPricePKR: 159540.03 },
  { modelNumber: 'SZGH-15360BC', spec: '3.6KW,18NM,2000RPM', basePricePKR: 151150.68, baseDealerPricePKR: 133150.68, brakePricePKR: 174274.68, brakeDealerPricePKR: 156274.68, absolutePricePKR: 187810.68, absoluteDealerPricePKR: 169810.68 },
  { modelNumber: 'SZGH-15380CC', spec: '150mm flange 3.8KW15NM 2500RPM', basePricePKR: 141385.03, baseDealerPricePKR: 121385.03, brakePricePKR: 164509.03, brakeDealerPricePKR: 144509.03, absolutePricePKR: 178045.03, absoluteDealerPricePKR: 158045.03 },
  { modelNumber: 'SZGH-15470BC', spec: '150mm flange,4.7KW,2000rpm,23NM', basePricePKR: 174199.97, baseDealerPricePKR: 152199.97, brakePricePKR: 197323.97, brakeDealerPricePKR: 175323.97, absolutePricePKR: 210859.97, absoluteDealerPricePKR: 188859.97 },
  { modelNumber: 'SZGH-15550BC', spec: '150mm', basePricePKR: 209544.45, baseDealerPricePKR: 185544.45, brakePricePKR: 232668.45, brakeDealerPricePKR: 208668.45, absolutePricePKR: 246204.45, absoluteDealerPricePKR: 222204.45 },
  { modelNumber: 'SZGH-18270BC', spec: '2.7kw,17.2NM,1500rpm', basePricePKR: 154437.05, baseDealerPricePKR: 133937.05, brakePricePKR: 177561.05, brakeDealerPricePKR: 157061.05, absolutePricePKR: 191097.05, absoluteDealerPricePKR: 170597.05 },
  { modelNumber: 'SZGH-18290BC', spec: '2.9kw, 27NM, 1000rpm', basePricePKR: 213871.08, baseDealerPricePKR: 180871.08, brakePricePKR: 236995.08, brakeDealerPricePKR: 203995.08, absolutePricePKR: 250531.08, absoluteDealerPricePKR: 217531.08 },
  { modelNumber: 'SZGH-18300CC', spec: '3.0kw, 19NM, 1500rpm', basePricePKR: 166189.76, baseDealerPricePKR: 144189.76, brakePricePKR: 189313.76, brakeDealerPricePKR: 167313.76, absolutePricePKR: 202849.76, absoluteDealerPricePKR: 180849.76 },
  { modelNumber: 'SZGH-18370BC', spec: '3.7kw, 35NM, 1000rpm', basePricePKR: 257965.33, baseDealerPricePKR: 219965.33, brakePricePKR: 281089.33, brakeDealerPricePKR: 243089.33, absolutePricePKR: 294625.33, absoluteDealerPricePKR: 256625.33 },
  { modelNumber: 'SZGH-18430AC', spec: '4.3kw, 27NM, 1500rpm', basePricePKR: 211376.08, baseDealerPricePKR: 179376.08, brakePricePKR: 234500.08, brakeDealerPricePKR: 202500.08, absolutePricePKR: 248036.08, absoluteDealerPricePKR: 216036.08 },
  { modelNumber: 'SZGH-18450CC', spec: '4.5kw, 21.5NM,2000rpm', basePricePKR: 215014.96, baseDealerPricePKR: 178514.96, brakePricePKR: 238138.96, brakeDealerPricePKR: 201638.96, absolutePricePKR: 251674.96, absoluteDealerPricePKR: 215174.96 },
  { modelNumber: 'SZGH-18550CC', spec: '5.5KW, 35NM, 1000rpm', basePricePKR: 260460.33, baseDealerPricePKR: 221460.33, brakePricePKR: 283584.33, brakeDealerPricePKR: 244584.33, absolutePricePKR: 297120.33, absoluteDealerPricePKR: 258120.33 },
  { modelNumber: 'SZGH-18750CC', spec: '7.5kw, 48NM, 1500rpm', basePricePKR: 306876.88, baseDealerPricePKR: 256876.88, brakePricePKR: 330000.88, brakeDealerPricePKR: 280000.88, absolutePricePKR: 343536.88, absoluteDealerPricePKR: 293536.88 },
  { modelNumber: 'SZGH-190105BC', spec: '10.5KW 1500RPM,67NM, 380V', basePricePKR: 408590.80, baseDealerPricePKR: 349590.80, brakePricePKR: 431714.80, brakeDealerPricePKR: 372714.80, absolutePricePKR: 445250.80, absoluteDealerPricePKR: 386250.80 },
  { modelNumber: 'SZGH-190150BC', spec: '15KW 1500RPM,95.5NM, 380V', basePricePKR: 455705.26, baseDealerPricePKR: 393705.26, brakePricePKR: 478829.26, brakeDealerPricePKR: 416829.26, absolutePricePKR: 492365.26, absoluteDealerPricePKR: 430365.26 },
  { modelNumber: 'SZGH-20011BC', spec: '11KW,70NM,380V', basePricePKR: 417236.95, baseDealerPricePKR: 352236.95, brakePricePKR: 440360.95, brakeDealerPricePKR: 375360.95, absolutePricePKR: 453896.95, absoluteDealerPricePKR: 388896.95 },
  { modelNumber: 'SZGH-20015BC', spec: '15KW,96NM 380V', basePricePKR: 456023.23, baseDealerPricePKR: 391023.23, brakePricePKR: 479147.23, brakeDealerPricePKR: 414147.23, absolutePricePKR: 492683.23, absoluteDealerPricePKR: 427683.23 },
  { modelNumber: 'SZGH-20018CC', spec: '18.6KW,118NM,380V', basePricePKR: 494809.51, baseDealerPricePKR: 429809.51, brakePricePKR: 517933.51, brakeDealerPricePKR: 452933.51, absolutePricePKR: 531469.51, absoluteDealerPricePKR: 466469.51 },
  { modelNumber: 'SZGH-20022CC', spec: '22KW,140NM,380V', basePricePKR: 533174.20, baseDealerPricePKR: 468174.20, brakePricePKR: 556298.20, brakeDealerPricePKR: 491298.20, absolutePricePKR: 569834.20, absoluteDealerPricePKR: 504834.20 },
];

/**
 * Official SZGH Pakistan Servo Driver Rate List (27 Models — Base Retail & Base Dealer PKR)
 */
export const SERVO_DRIVER_RATE_LIST_2026: ServoDriverRateRow[] = [
  { modelNumber: 'SZGH-E7D20L', spec: 'servo driver 40-60 flange 3-PHASE 220V', basePricePKR: 50719.47, baseDealerPricePKR: 41719.47 },
  { modelNumber: 'SZGH-E7D30L', spec: 'servo driver 80.90.110.130 flange power below 2.6kw 3-PHASE 220V', basePricePKR: 53249.01, baseDealerPricePKR: 44249.01 },
  { modelNumber: 'SZGH-E7D50B', spec: 'servo driver150.180 flange power below 3.7kw,130 flange 3.8kw 3-PHASE 220V', basePricePKR: 75776.70, baseDealerPricePKR: 63776.70 },
  { modelNumber: 'SZGH-E7D35H', spec: 'servo driver 110.130 flange power below 3.8kw 3-PHASE 380V', basePricePKR: 102336.87, baseDealerPricePKR: 90336.87 },
  { modelNumber: 'SZGH-E7D50L', spec: 'servo driver 150.180 flange power below 5.5kw 3-PHASE 220V', basePricePKR: 126367.50, baseDealerPricePKR: 114367.50 },
  { modelNumber: 'SZGH-E7D75L', spec: 'servo driver 180 flange power below 7.5kw 3-PHASE 220V', basePricePKR: 138593.61, baseDealerPricePKR: 126593.61 },
  { modelNumber: 'SZGH-E7D50H', spec: 'servo driver 150.180 flange power below 5.5kw 3-PHASE 380V', basePricePKR: 130882.71, baseDealerPricePKR: 120882.71 },
  { modelNumber: 'SZGH-ED75H', spec: 'servo driver 150.180 flange power below 7.5kw 3-PHASE 380V', basePricePKR: 146603.82, baseDealerPricePKR: 134603.82 },
  { modelNumber: 'SZGH-E7D160H', spec: 'servo driver 190.200 flange power below 11kw 3-PHASE 380V', basePricePKR: 245677.47, baseDealerPricePKR: 233677.47 },
  { modelNumber: 'SZGH-E7D200H', spec: 'servo driver190.200 flange power below 15kw 3-PHASE 3800V', basePricePKR: 311867.10, baseDealerPricePKR: 299867.10 },
  { modelNumber: 'SZGH-E7i20L', spec: 'Absolute servo driver 40-60 flange 3-PHASE 220V', basePricePKR: 54935.37, baseDealerPricePKR: 45935.37 },
  { modelNumber: 'SZGH-E7i30L', spec: 'Absolute servo driver 80.90.110.130 flange power below 2.6kw 3-PHASE 220V', basePricePKR: 57464.91, baseDealerPricePKR: 48464.91 },
  { modelNumber: 'SZGH-E7i50B', spec: 'Absolute servo driver150.180 flange power below 3.7kw,130 flange 3.8kw 3-PHASE 220V', basePricePKR: 77340.78, baseDealerPricePKR: 67340.78 },
  { modelNumber: 'SZGH-E7i50L', spec: 'Absolute servo driver 150.180 flange power below 5.5kw 3-PHASE 220V', basePricePKR: 124980.45, baseDealerPricePKR: 114980.45 },
  { modelNumber: 'SZGH-E7i35H', spec: 'Absolute servo driver110.130 flange power below 3.8kw 3-PHASE 380V', basePricePKR: 100467.09, baseDealerPricePKR: 91467.09 },
  { modelNumber: 'SZGH-E7i50H', spec: 'Absolute servo driver 150.180 flange power below 5.5kw 3-PHASE 220V', basePricePKR: 137628.15, baseDealerPricePKR: 127628.15 },
  { modelNumber: 'SZGH-E7i75H', spec: 'Absolute servo driver 150.180 flange power below 7.5kw 3-PHASE 380V', basePricePKR: 148167.90, baseDealerPricePKR: 138167.90 },
  { modelNumber: 'SZGH-E7i160H', spec: 'Absolute servo driver 220 flange power below 11kw 3-PHASE 380V', basePricePKR: 260854.71, baseDealerPricePKR: 248854.71 },
  { modelNumber: 'SZGH-E7i200H', spec: 'Absolute servo driver 220 flange power below 15kw 3-PHASE 3800V', basePricePKR: 326622.75, baseDealerPricePKR: 314622.75 },
  { modelNumber: 'SZGH- E7A20LE', spec: 'servo driver absolute ETHER CAT power below 400W 3-PHASE 220V', basePricePKR: 54935.37, baseDealerPricePKR: 45935.37 },
  { modelNumber: 'SZGH-E7A30LE', spec: 'servo driver absolute ETHER CAT power below 1KW 3-PHASE 220V', basePricePKR: 58308.09, baseDealerPricePKR: 49308.09 },
  { modelNumber: 'SZGH-E7A50BE', spec: 'servo driver absolute ETHER CAT power below 2.3KW 3-PHASE 220V', basePricePKR: 70173.75, baseDealerPricePKR: 60173.75 },
  { modelNumber: 'SZGH-E7A50LE', spec: 'servo driver absolute ETHER CAT power below 3.6KW 3-PHASE 220V', basePricePKR: 146903.13, baseDealerPricePKR: 136903.13 },
  { modelNumber: 'SZGH-E7A35HE', spec: 'servo driver absolute ETHER CAT power below 2.3KW 3-PHASE 380V', basePricePKR: 99623.91, baseDealerPricePKR: 90623.91 },
  { modelNumber: 'SZGH-E7A50HE', spec: 'servo driver absolute ETHER CAT power below 4.3KW 3-PHASE 380V', basePricePKR: 106430.49, baseDealerPricePKR: 96430.49 },
  { modelNumber: 'SZGH-E7A75HE', spec: 'servo driver absolute ETHER CAT power below 5.5KW 3-PHASE 380V', basePricePKR: 155756.52, baseDealerPricePKR: 145756.52 },
  { modelNumber: 'SZGH-E7A160HE', spec: 'servo driver absolute ETHER CAT power below 7.5KW 3-PHASE 380V', basePricePKR: 180752.61, baseDealerPricePKR: 168752.61 },
];

export function buildServoMotorConfigOptions(
  row: ServoMotorRateRow
): ServoMotorConfigOption[] {
  return [
    {
      id: 'base',
      label: `Base Motor (PKR ${row.basePricePKR.toLocaleString()})`,
      shortLabel: 'Base Motor',
      price: row.basePricePKR,
    },
    {
      id: 'brake',
      label: `With Brake (PKR ${row.brakePricePKR.toLocaleString()})`,
      shortLabel: 'With Brake',
      price: row.brakePricePKR,
    },
    {
      id: 'absolute',
      label: `Absolute Encoder (PKR ${row.absolutePricePKR.toLocaleString()})`,
      shortLabel: 'Absolute',
      price: row.absolutePricePKR,
    },
  ];
}

export const PANEL_CE_PRICE_DELTA_PKR = 20000;

export interface PanelPricingMap {
  A: number;
  B: number;
  C: number;
  E: number;
  defaultDisplayPrice?: number;
}

export function buildPanelPricesFromBase(basePrice: number): PanelPricingMap {
  const p = Math.max(0, Math.round(basePrice || 0));
  return {
    A: p,
    B: p,
    C: p > 0 ? p + PANEL_CE_PRICE_DELTA_PKR : 0,
    E: p > 0 ? p + PANEL_CE_PRICE_DELTA_PKR : 0,
    defaultDisplayPrice: p,
  };
}

export function buildPanelPricesFromCE(cePrice: number): PanelPricingMap {
  const p = Math.max(0, Math.round(cePrice || 0));
  const ab = p > 0 ? Math.max(0, p - PANEL_CE_PRICE_DELTA_PKR) : 0;
  return {
    A: ab,
    B: ab,
    C: p,
    E: p,
    defaultDisplayPrice: ab,
  };
}

export function stripPanelInfoFromText(text?: string): string {
  if (!text) return '';
  return text
    .replace(
      /\s*\bwith\s*[\(\（]?\s*(?:A\s*[\+\/&,\s]\s*B|C\s*[\+\/&,\s]\s*E|A|B|C|E)\s*[-–]?\s*panel\s*[\)\）]?/gi,
      ''
    )
    .replace(
      /\s*[\(\（]\s*(?:panel\s*)?(?:A\s*[\+\/&,\s]\s*B|C\s*[\+\/&,\s]\s*E|A|B|C|E)\s*[-–]?\s*(?:panel)?\s*[\)\）]/gi,
      ''
    )
    .replace(
      /\b(?:A\s*[\+\/&]\s*B|C\s*[\+\/&]\s*E)\s*[-–]?\s*panel\b/gi,
      ''
    )
    .replace(
      /\bpanel\s*(?:A\s*[\+\/&]\s*B|C\s*[\+\/&]\s*E)\b/gi,
      ''
    )
    .replace(/\s*,?\s*\b(?:with|without)\s+panel\b/gi, '')
    .replace(/\s+,/g, ',')
    .replace(/\s+\./g, '.')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function canonicalRateKey(modelNumber: string): string {
  return (modelNumber || '')
    .toUpperCase()
    .replace(/\s*[\(\（]\s*A\s*[\+\/&,\s]\s*B\s*[-–]?\s*(?:PANEL)?\s*[\)\）]/gi, '__AB_PANEL')
    .replace(/\s*[\(\（]\s*C\s*[\+\/&,\s]\s*E\s*[-–]?\s*(?:PANEL)?\s*[\)\）]/gi, '__CE_PANEL')
    .replace(/\s*[\(\（]\s*C\s*[-–]?\s*PANEL\s*[\)\）]/gi, '__C_PANEL')
    .replace(/^SZGH[-\s]*CNC[-\s]*/i, '')
    .replace(/^SGZH[-\s]*CNC[-\s]*/i, '')
    .replace(/^SZGH[-\s]*/i, '')
    .replace(/^SGZH[-\s]*/i, '')
    .replace(/^GH[-\s]*/i, '')
    .replace(/^CNC[-\s]*/i, '')
    .replace(/[-\s_]+/g, '');
}

const CONTROLLER_ROW_BY_KEY = new Map<string, ControllerRateRow>();
const CONTROLLER_ROWS_BY_SERIES_KEY = new Map<string, ControllerRateRow[]>();
const PANEL_PRICES_BY_NO_PANEL_KEY = new Map<string, PanelPricingMap>();
const RAW_PANEL_PAIR_BY_KEY = new Map<
  string,
  { abPrice?: number; cePrice?: number; seriesKey?: string }
>();

for (const row of CONTROLLER_RATE_LIST_2026) {
  const fullKey = canonicalRateKey(row.modelNumber);
  CONTROLLER_ROW_BY_KEY.set(fullKey, row);

  const withoutPanel = stripPanelInfoFromText(row.modelNumber);
  const keyNoPanel = canonicalRateKey(withoutPanel);
  if (!CONTROLLER_ROW_BY_KEY.has(keyNoPanel)) {
    CONTROLLER_ROW_BY_KEY.set(keyNoPanel, row);
  }

  // Also index by series key without trailing axis digit (e.g. "1000TDB", "1000TDC", "1000MDB", "1000MDC", "1000MDCB")
  const seriesKey = keyNoPanel.replace(/[1-8](?:\([A-Z]+\))?$/i, '');
  if (seriesKey && seriesKey !== keyNoPanel) {
    const list = CONTROLLER_ROWS_BY_SERIES_KEY.get(seriesKey) || [];
    list.push(row);
    CONTROLLER_ROWS_BY_SERIES_KEY.set(seriesKey, list);
  }

  const isAB = /\(A\+B Panel\)/i.test(row.modelNumber);
  const isCE = /\(C\+E Panel\)/i.test(row.modelNumber);
  const isCPanel = /\(C Panel\)/i.test(row.modelNumber);
  const is1080SeriesPanelModel =
    /1080[-\s_]*(?:TC|TIC|TDB|TDC|MC|MIC|MDB|MDC)/i.test(row.modelNumber);

  if (isAB || isCE || isCPanel) {
    const pair = RAW_PANEL_PAIR_BY_KEY.get(keyNoPanel) || { seriesKey };
    if (isAB) {
      pair.abPrice = row.pricePKR;
    } else {
      pair.cePrice = row.pricePKR;
    }
    RAW_PANEL_PAIR_BY_KEY.set(keyNoPanel, pair);
  } else if (is1080SeriesPanelModel) {
    const pair = RAW_PANEL_PAIR_BY_KEY.get(keyNoPanel) || { seriesKey };
    if (pair.abPrice === undefined) {
      pair.abPrice = row.pricePKR;
    }
    RAW_PANEL_PAIR_BY_KEY.set(keyNoPanel, pair);
  }
}

for (const [keyNoPanel, pair] of RAW_PANEL_PAIR_BY_KEY.entries()) {
  let prices: PanelPricingMap;
  if (pair.abPrice !== undefined) {
    // Panel A = Panel B = abPrice; Panel C = Panel E = abPrice + 20,000
    prices = buildPanelPricesFromBase(pair.abPrice);
  } else if (pair.cePrice !== undefined) {
    // Only C+E (or C) Panel price given -> reduce by 20,000 when A or B is selected (C = E = A + 20,000)
    prices = buildPanelPricesFromCE(pair.cePrice);
  } else {
    continue;
  }

  PANEL_PRICES_BY_NO_PANEL_KEY.set(keyNoPanel, prices);
  if (pair.seriesKey && !PANEL_PRICES_BY_NO_PANEL_KEY.has(pair.seriesKey)) {
    PANEL_PRICES_BY_NO_PANEL_KEY.set(pair.seriesKey, prices);
  }
}

export function resolvePanelPricesForModel(
  modelNumber?: string,
  fallbackBasePrice?: number,
  rawPanelType?: 'AB' | 'CE' | 'NONE'
): PanelPricingMap | undefined {
  if (modelNumber) {
    const withoutPanel = stripPanelInfoFromText(modelNumber);
    const keyNoPanel = canonicalRateKey(withoutPanel);
    const fromMap = PANEL_PRICES_BY_NO_PANEL_KEY.get(keyNoPanel);
    if (fromMap) return fromMap;
  }
  if (fallbackBasePrice && fallbackBasePrice > 0) {
    return rawPanelType === 'CE'
      ? buildPanelPricesFromCE(fallbackBasePrice)
      : buildPanelPricesFromBase(fallbackBasePrice);
  }
  return undefined;
}

const SERVO_MOTOR_BY_KEY = new Map<string, ServoMotorRateRow>();
for (const row of SERVO_MOTOR_RATE_LIST_2026) {
  SERVO_MOTOR_BY_KEY.set(canonicalRateKey(row.modelNumber), row);
}

const SERVO_DRIVER_BY_KEY = new Map<string, ServoDriverRateRow>();
for (const row of SERVO_DRIVER_RATE_LIST_2026) {
  SERVO_DRIVER_BY_KEY.set(canonicalRateKey(row.modelNumber), row);
  if (row.modelNumber === 'SZGH-ED75H' || row.modelNumber === 'SZGH-E7D75H') {
    SERVO_DRIVER_BY_KEY.set(canonicalRateKey('SZGH-ED75H'), row);
    SERVO_DRIVER_BY_KEY.set(canonicalRateKey('SZGH-E7D75H'), row);
  }
}

export const INDUSTRIAL_ROBOT_RATE_LIST_2026: IndustrialRobotRateRow[] = [
  // =========================================================================
  // 1. SZGH-T SERIES — General Handling & Pick-and-Place Industrial Robots (6-Axis)
  // =========================================================================
  {
    modelNumber: 'SZGH-T3100-500',
    buttonLabel: 'T3100-500',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 3100mm load 500kg',
    description:
      '6 Axis reach 3100mm load 500kg. Heavy-duty SZGH-T3100-500 6-axis industrial handling robot with 3100mm reach and 500kg payload capacity, including robot control system, servo motors, reducers, control cabinet, and cables.',
    exwRmb: 312500,
    packedWeightKg: null,
  },
  {
    modelNumber: 'SZGH-T3100-210',
    buttonLabel: 'T3100-210',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 3150mm load 210kg',
    description:
      '6 Axis reach 3150mm load 210kg. Heavy-duty SZGH-T3100-210 6-axis industrial handling robot with 3150mm reach and 210kg payload capacity, including robot control system, servo motors, reducers, control cabinet, and cables.',
    exwRmb: 164600,
    packedWeightKg: null,
  },
  {
    modelNumber: 'SZGH-T3100-180',
    buttonLabel: 'T3100-180',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 3150mm load 180kg',
    description:
      '6 Axis reach 3150mm load 180kg. Heavy-duty SZGH-T3100-180 6-axis industrial handling robot with 3150mm reach and 180kg payload capacity, including robot control system, servo motors, reducers, control cabinet, and cables.',
    exwRmb: 158200,
    packedWeightKg: null,
  },
  {
    modelNumber: 'SZGH-T2700-360',
    buttonLabel: 'T2700-360',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 2700mm load 360kg',
    description:
      '6 Axis reach 2700mm load 360kg. Heavy-duty SZGH-T2700-360 6-axis industrial handling robot with 2700mm reach and 360kg payload capacity, including robot control system, servo motors, reducers, control cabinet, and cables.',
    exwRmb: 293500,
    packedWeightKg: null,
  },
  {
    modelNumber: 'SZGH-T2700-210',
    buttonLabel: 'T2700-210',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 2700mm load 210kg',
    description:
      '6 Axis reach 2700mm load 210kg. Heavy-duty SZGH-T2700-210 6-axis industrial handling & machine tending robot with 2700mm reach, 210kg payload, and 1580kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 137679,
    packedWeightKg: 1580,
    bodyWeightKg: 1210,
    cabinetWeightKg: 150,
    woodenBoxDimensions: '175×114×212 cm (Body) + 100×80×133 cm (Cabinet)',
  },
  {
    modelNumber: 'SZGH-T2700-180',
    buttonLabel: 'T2700-180',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 2700mm load 180kg',
    description:
      '6 Axis reach 2700mm load 180kg. Heavy-duty SZGH-T2700-180 6-axis industrial handling & machine tending robot with 2700mm reach, 180kg payload, and 1580kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 129731,
    packedWeightKg: 1580,
    bodyWeightKg: 1210,
    cabinetWeightKg: 150,
    woodenBoxDimensions: '175×114×212 cm (Body) + 100×80×133 cm (Cabinet)',
  },
  {
    modelNumber: 'SZGH-T2500-100',
    buttonLabel: 'T2500-100',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 2500mm load 100kg',
    description:
      '6 Axis reach 2500mm load 100kg. Industrial SZGH-T2500-100 6-axis handling & machine tending robot with 2500mm reach, 100kg payload, and 845kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: null,
    packedWeightKg: 845,
    bodyWeightKg: 600,
    cabinetWeightKg: 95,
    woodenBoxDimensions: '130×92×174 cm (Body) + 75×65×116 cm (Cabinet)',
  },
  {
    modelNumber: 'SZGH-T2100-100',
    buttonLabel: 'T2100-100',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 2000mm load 100kg',
    description:
      '6 Axis reach 2000mm load 100kg. Industrial SZGH-T2100-100 6-axis handling & machine tending robot with 2000mm reach, 100kg payload, and 740kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 108192,
    packedWeightKg: 740,
    bodyWeightKg: 495,
    cabinetWeightKg: 95,
    woodenBoxDimensions: '130×92×174 cm (Body) + 75×65×116 cm (Cabinet)',
  },
  {
    modelNumber: 'SZGH-T2200-80',
    buttonLabel: 'T2200-80',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 2200mm load 80kg',
    description:
      '6 Axis reach 2200mm load 80kg. Industrial SZGH-T2200-80 6-axis handling & machine tending robot with 2200mm reach, 80kg payload, and 750kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 106910,
    packedWeightKg: 750,
    bodyWeightKg: 505,
    cabinetWeightKg: 95,
    woodenBoxDimensions: '130×92×174 cm (Body) + 75×65×116 cm (Cabinet)',
  },
  {
    modelNumber: 'SZGH-T2500-70',
    buttonLabel: 'T2500-70',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 2500mm load 70kg',
    description:
      '6 Axis reach 2500mm load 70kg. Industrial SZGH-T2500-70 6-axis handling & machine tending robot with 2500mm reach, 70kg payload, and 830kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 106910,
    packedWeightKg: 830,
    bodyWeightKg: 585,
    cabinetWeightKg: 95,
    woodenBoxDimensions: '130×92×174 cm (Body) + 75×65×116 cm (Cabinet)',
  },
  {
    modelNumber: 'SZGH-T2500-50',
    buttonLabel: 'T2500-50',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 2500mm load 50kg',
    description:
      '6 Axis reach 2500mm load 50kg. Industrial SZGH-T2500-50 6-axis handling & machine tending robot with 2500mm reach, 50kg payload, and 825kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 103064,
    packedWeightKg: 825,
    bodyWeightKg: 580,
    cabinetWeightKg: 95,
    woodenBoxDimensions: '130×92×174 cm (Body) + 75×65×116 cm (Cabinet)',
  },
  {
    modelNumber: 'SZGH-T2000-50',
    buttonLabel: 'T2000-50',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 2000mm load 50kg',
    description:
      '6 Axis reach 2000mm load 50kg. Industrial SZGH-T2000-50 6-axis handling & machine tending robot with 2000mm reach, 50kg payload, and 515kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 77423,
    packedWeightKg: 515,
    bodyWeightKg: 350,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×112×154 cm',
  },
  {
    modelNumber: 'SZGH-T1900-45',
    buttonLabel: 'T1900-45',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 1900mm load 45kg',
    description:
      '6 Axis reach 1900mm load 45kg. Industrial SZGH-T1900-45 6-axis handling & machine tending robot with 1900mm reach, 45kg payload, and 446kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 73577,
    packedWeightKg: 446,
    bodyWeightKg: 281,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×112×154 cm',
  },
  {
    modelNumber: 'SZGH-T1900-35',
    buttonLabel: 'T1900-35',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 1900mm load 35kg',
    description:
      '6 Axis reach 1900mm load 35kg. Industrial SZGH-T1900-35 6-axis handling & machine tending robot with 1900mm reach, 35kg payload, and 445kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 69731,
    packedWeightKg: 445,
    bodyWeightKg: 280,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×112×154 cm',
  },
  {
    modelNumber: 'SZGH-T2300-30',
    buttonLabel: 'T2300-30',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 2300mm load 30kg 1-axis hollow shaft',
    description:
      '6 Axis reach 2300mm load 30kg 1-axis hollow shaft. Industrial SZGH-T2300-30 6-axis handling robot with 2300mm reach, 30kg payload, 1-axis hollow shaft, and 440kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 72295,
    packedWeightKg: 440,
    bodyWeightKg: 275,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×112×174 cm',
  },
  {
    modelNumber: 'SZGH-T2500-15',
    buttonLabel: 'T2500-15',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 2500mm load 15kg 1-axis hollow shaft',
    description:
      '6 Axis reach 2500mm load 15kg 1-axis hollow shaft. Long-reach SZGH-T2500-15 6-axis handling robot with 2500mm reach, 15kg payload, 1-axis hollow shaft, and 455kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 68449,
    packedWeightKg: 455,
    bodyWeightKg: 290,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×112×174 cm',
  },
  {
    modelNumber: 'SZGH-T2100-20C',
    buttonLabel: 'T2100-20C',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 2100mm load 20kg 1-axis hollow shaft',
    description:
      '6 Axis reach 2100mm load 20kg 1-axis hollow shaft. Industrial SZGH-T2100-20C 6-axis handling & machine tending robot with 2100mm reach, 20kg payload, and 1-axis hollow shaft.',
    exwRmb: 59474,
    packedWeightKg: null,
    cabinetWeightKg: 45,
  },
  {
    modelNumber: 'SZGH-T1800-30C',
    buttonLabel: 'T1800-30C',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 1800mm load 30kg 1-axis hollow shaft',
    description:
      '6 Axis reach 1800mm load 30kg 1-axis hollow shaft. Industrial SZGH-T1800-30C 6-axis handling & machine tending robot with 1800mm reach, 30kg payload, and 1-axis hollow shaft.',
    exwRmb: 59474,
    packedWeightKg: null,
    cabinetWeightKg: 45,
  },
  {
    modelNumber: 'SZGH-T1800-25C',
    buttonLabel: 'T1800-25C',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 1800mm load 25kg 1-axis hollow shaft',
    description:
      '6 Axis reach 1800mm load 25kg 1-axis hollow shaft. Industrial SZGH-T1800-25C 6-axis handling & machine tending robot with 1800mm reach, 25kg payload, and 1-axis hollow shaft.',
    exwRmb: 56910,
    packedWeightKg: null,
    cabinetWeightKg: 45,
  },
  {
    modelNumber: 'SZGH-T1800-20C (1800mm)',
    buttonLabel: 'T1800-20C (1800mm)',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 1800mm load 20kg 1-axis hollow shaft',
    description:
      '6 Axis reach 1800mm load 20kg 1-axis hollow shaft. Industrial SZGH-T1800-20C (1800mm reach version) 6-axis handling & machine tending robot with 1800mm reach, 20kg payload, and 1-axis hollow shaft.',
    exwRmb: 51782,
    packedWeightKg: null,
    cabinetWeightKg: 45,
  },
  {
    modelNumber: 'SZGH-T2000-10C',
    buttonLabel: 'T2000-10C',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 2000mm load 10kg',
    description:
      '6 Axis reach 2000mm load 10kg. Long-reach SZGH-T2000-10C 6-axis handling & machine tending robot with 2000mm reach, 10kg payload, and 327kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 50500,
    packedWeightKg: 327,
    bodyWeightKg: 192,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×154 cm',
  },
  {
    modelNumber: 'SZGH-T1800-20C',
    buttonLabel: 'T1800-20C',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 1710mm load 20kg',
    description:
      '6 Axis reach 1710mm load 20kg. Industrial SZGH-T1800-20C 6-axis handling & CNC machine tending robot with 1710mm reach, 20kg payload, and 312kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 50500,
    packedWeightKg: 312,
    bodyWeightKg: 177,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×143 cm',
  },
  {
    modelNumber: 'SZGH-T1600-15C',
    buttonLabel: 'T1600-15C',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 1510mm load 15kg',
    description:
      '6 Axis reach 1510mm load 15kg. Industrial SZGH-T1600-15C 6-axis handling & CNC machine tending robot with 1510mm reach, 15kg payload, and 285.5kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 49218,
    packedWeightKg: 285.5,
    bodyWeightKg: 150.5,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×143 cm',
  },
  {
    modelNumber: 'SZGH-T1100-15C',
    buttonLabel: 'T1100-15C',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 1100mm load 15kg',
    description:
      '6 Axis reach 1100mm load 15kg. Compact SZGH-T1100-15C 6-axis handling & CNC machine tending robot with 1100mm reach, 15kg payload, and 285kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: null,
    packedWeightKg: 285,
    bodyWeightKg: 150,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×124 cm',
  },
  {
    modelNumber: 'SZGH-T1850-10C',
    buttonLabel: 'T1850-10C',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 1850mm load 10kg',
    description:
      '6 Axis reach 1850mm load 10kg. Industrial SZGH-T1850-10C 6-axis handling & CNC machine tending robot with 1850mm reach, 10kg payload, and 314kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 46654,
    packedWeightKg: 314,
    bodyWeightKg: 179,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×143 cm',
  },
  {
    modelNumber: 'SZGH-T1850-6C',
    buttonLabel: 'T1850-6C',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 1850mm load 6kg',
    description:
      '6 Axis reach 1850mm load 6kg. Industrial SZGH-T1850-6C 6-axis handling & CNC machine tending robot with 1850mm reach, 6kg payload, and 314kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 45372,
    packedWeightKg: 314,
    bodyWeightKg: 179,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×143 cm',
  },
  {
    modelNumber: 'SZGH-T1600-10C',
    buttonLabel: 'T1600-10C',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 1600mm load 10kg',
    description:
      '6 Axis reach 1600mm load 10kg. Industrial SZGH-T1600-10C 6-axis handling & CNC machine tending robot with 1600mm reach, 10kg payload, and 284.5kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 42808,
    packedWeightKg: 284.5,
    bodyWeightKg: 149.5,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×124 cm',
  },
  {
    modelNumber: 'SZGH-T1500-5',
    buttonLabel: 'T1500-5',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 1500mm load 5kg',
    description:
      '6 Axis reach 1500mm load 5kg. Compact SZGH-T1500-5 6-axis handling & pick-and-place robot with 1500mm reach, 5kg payload, and 178kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 38321,
    packedWeightKg: 178,
    bodyWeightKg: 83,
    cabinetWeightKg: 35,
    woodenBoxDimensions: '108×94×115 cm',
  },
  {
    modelNumber: 'SZGH-T1300-6',
    buttonLabel: 'T1300-6',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 1300mm load 6kg',
    description:
      '6 Axis reach 1300mm load 6kg. Compact SZGH-T1300-6 6-axis handling & pick-and-place robot with 1300mm reach, 6kg payload, and 161kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 39500,
    packedWeightKg: 161,
    bodyWeightKg: 76,
    cabinetWeightKg: 35,
    woodenBoxDimensions: '95×86×115 cm',
  },
  {
    modelNumber: 'SZGH-T1100-7',
    buttonLabel: 'T1100-7',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 1100mm load 7kg',
    description:
      '6 Axis reach 1100mm load 7kg. High-speed SZGH-T1100-7 6-axis handling & CNC machine tending robot with 1100mm reach, 7kg payload, and 149.5kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 39500,
    packedWeightKg: 149.5,
    bodyWeightKg: 64.5,
    cabinetWeightKg: 35,
    woodenBoxDimensions: '95×86×115 cm',
  },
  {
    modelNumber: 'SZGH-T700-8',
    buttonLabel: 'T700-8',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 720mm load 8kg',
    description:
      '6 Axis reach 720mm load 8kg. Desktop/compact SZGH-T700-8 6-axis handling & pick-and-place robot with 720mm reach, 8kg payload, and 137kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 35115,
    packedWeightKg: 137,
    bodyWeightKg: 60,
    cabinetWeightKg: 35,
    woodenBoxDimensions: '89×80×104 cm',
  },
  {
    modelNumber: 'SZGH-T920-7',
    buttonLabel: 'T920-7',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 920mm load 7kg',
    description:
      '6 Axis reach 920mm load 7kg. Compact SZGH-T920-7 6-axis handling & pick-and-place robot with 920mm reach, 7kg payload, and 140kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 37500,
    packedWeightKg: 140,
    bodyWeightKg: 58,
    cabinetWeightKg: 35,
    woodenBoxDimensions: '89×80×104 cm',
  },
  {
    modelNumber: 'SZGH-T980-6',
    buttonLabel: 'T980-6',
    seriesKey: 'ROBOT_SERIES_T',
    seriesClubName: 'SZGH-T Series',
    seriesTitle: 'SZGH-T Series 6-Axis General Handling & Machine Tending Industrial Robots',
    robotTypeLabel: 'General Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '6 Axis reach 980mm load 6kg',
    description:
      '6 Axis reach 980mm load 6kg. Compact SZGH-T980-6 6-axis handling & pick-and-place robot with 980mm reach, 6kg payload, and 142kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 37500,
    packedWeightKg: 142,
    bodyWeightKg: 60,
    cabinetWeightKg: 35,
    woodenBoxDimensions: '89×80×104 cm',
  },

  // =========================================================================
  // 2. SZGH-P SERIES — Spray Painting Robots (6-Axis, Includes Spray Gun & Spray Bottle)
  // =========================================================================
  {
    modelNumber: 'SZGH-P920-7',
    buttonLabel: 'P920-7',
    seriesKey: 'ROBOT_SERIES_P',
    seriesClubName: 'SZGH-P Series',
    seriesTitle: 'SZGH-P Series 6-Axis High-Speed Spray Painting & Coating Industrial Robots',
    robotTypeLabel: 'Spray Painting Robots',
    subcategory: 'Spraying & Grinding Robot',
    spec: '6 Axis reach 920mm load 7kg High-speed version',
    description:
      '6 Axis reach 920mm load 7kg High-speed version. Turnkey SZGH-P920-7 6-axis high-speed spray painting robot including spray gun, spray bottle, robot control system, servo motors, reducers, control cabinet, and 165kg packed wooden box weight.',
    exwRmb: 46000,
    packedWeightKg: 165,
    bodyWeightKg: 58,
    cabinetWeightKg: 35,
    woodenBoxDimensions: '89×80×104 cm',
  },
  {
    modelNumber: 'SZGH-P980-6',
    buttonLabel: 'P980-6',
    seriesKey: 'ROBOT_SERIES_P',
    seriesClubName: 'SZGH-P Series',
    seriesTitle: 'SZGH-P Series 6-Axis High-Speed Spray Painting & Coating Industrial Robots',
    robotTypeLabel: 'Spray Painting Robots',
    subcategory: 'Spraying & Grinding Robot',
    spec: '6 Axis reach 980mm load 6kg High-speed version',
    description:
      '6 Axis reach 980mm load 6kg High-speed version. Turnkey SZGH-P980-6 6-axis high-speed spray painting robot including spray gun, spray bottle, robot control system, servo motors, reducers, control cabinet, and 167kg packed wooden box weight.',
    exwRmb: 46000,
    packedWeightKg: 167,
    bodyWeightKg: 60,
    cabinetWeightKg: 35,
    woodenBoxDimensions: '89×80×104 cm',
  },
  {
    modelNumber: 'SZGH-P1850-6',
    buttonLabel: 'P1850-6',
    seriesKey: 'ROBOT_SERIES_P',
    seriesClubName: 'SZGH-P Series',
    seriesTitle: 'SZGH-P Series 6-Axis High-Speed Spray Painting & Coating Industrial Robots',
    robotTypeLabel: 'Spray Painting Robots',
    subcategory: 'Spraying & Grinding Robot',
    spec: '6 Axis reach 1850mm load 6kg High-speed version',
    description:
      '6 Axis reach 1850mm load 6kg High-speed version. Long-reach SZGH-P1850-6 6-axis high-speed spray painting robot including spray gun, spray bottle, robot control system, servo motors, reducers, control cabinet, and 304kg packed wooden box weight.',
    exwRmb: 56900,
    packedWeightKg: 304,
    bodyWeightKg: 149,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×154 cm',
  },
  {
    modelNumber: 'SZGH-P1250-10',
    buttonLabel: 'P1250-10',
    seriesKey: 'ROBOT_SERIES_P',
    seriesClubName: 'SZGH-P Series',
    seriesTitle: 'SZGH-P Series 6-Axis High-Speed Spray Painting & Coating Industrial Robots',
    robotTypeLabel: 'Spray Painting Robots',
    subcategory: 'Spraying & Grinding Robot',
    spec: '6 Axis reach 1250mm load 10kg High-speed version',
    description:
      '6 Axis reach 1250mm load 10kg High-speed version. Industrial SZGH-P1250-10 6-axis high-speed spray painting robot including spray gun, spray bottle, robot control system, servo motors, reducers, control cabinet, and 287kg packed wooden box weight.',
    exwRmb: 54300,
    packedWeightKg: 287,
    bodyWeightKg: 132,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×124 cm',
  },
  {
    modelNumber: 'SZGH-P1600-10',
    buttonLabel: 'P1600-10',
    seriesKey: 'ROBOT_SERIES_P',
    seriesClubName: 'SZGH-P Series',
    seriesTitle: 'SZGH-P Series 6-Axis High-Speed Spray Painting & Coating Industrial Robots',
    robotTypeLabel: 'Spray Painting Robots',
    subcategory: 'Spraying & Grinding Robot',
    spec: '6 Axis reach 1510mm load 10kg High-speed version',
    description:
      '6 Axis reach 1510mm load 10kg High-speed version. Industrial SZGH-P1600-10 6-axis high-speed spray painting robot including spray gun, spray bottle, robot control system, servo motors, reducers, control cabinet, and 301kg packed wooden box weight.',
    exwRmb: 53200,
    packedWeightKg: 301,
    bodyWeightKg: 146,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×124 cm',
  },
  {
    modelNumber: 'SZGH-P2000-10',
    buttonLabel: 'P2000-10',
    seriesKey: 'ROBOT_SERIES_P',
    seriesClubName: 'SZGH-P Series',
    seriesTitle: 'SZGH-P Series 6-Axis High-Speed Spray Painting & Coating Industrial Robots',
    robotTypeLabel: 'Spray Painting Robots',
    subcategory: 'Spraying & Grinding Robot',
    spec: '6 Axis reach 2000mm load 10kg High-speed version',
    description:
      '6 Axis reach 2000mm load 10kg High-speed version. Long-reach SZGH-P2000-10 6-axis high-speed spray painting robot including spray gun, spray bottle, robot control system, servo motors, reducers, control cabinet, and 322kg packed wooden box weight.',
    exwRmb: 62300,
    packedWeightKg: 322,
    bodyWeightKg: 167,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×154 cm',
  },
  {
    modelNumber: 'SZGH-P2000-6',
    buttonLabel: 'P2000-6',
    seriesKey: 'ROBOT_SERIES_P',
    seriesClubName: 'SZGH-P Series',
    seriesTitle: 'SZGH-P Series 6-Axis High-Speed Spray Painting & Coating Industrial Robots',
    robotTypeLabel: 'Spray Painting Robots',
    subcategory: 'Spraying & Grinding Robot',
    spec: '6 Axis reach 2000mm load 6kg High-speed version',
    description:
      '6 Axis reach 2000mm load 6kg High-speed version. Long-reach SZGH-P2000-6 6-axis high-speed spray painting robot including spray gun, spray bottle, robot control system, servo motors, reducers, control cabinet, and 312kg packed wooden box weight.',
    exwRmb: null,
    packedWeightKg: 312,
    bodyWeightKg: 157,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×154 cm',
  },

  // =========================================================================
  // 3. SZGH-B SERIES — Palletizing Industrial Robots (4-Axis, Excluding Custom Grippers)
  // =========================================================================
  {
    modelNumber: 'SZGH-B3100-180',
    buttonLabel: 'B3100-180',
    seriesKey: 'ROBOT_SERIES_B',
    seriesClubName: 'SZGH-B Series',
    seriesTitle: 'SZGH-B Series 4-Axis Heavy-Duty Palletizing & Stacking Industrial Robots',
    robotTypeLabel: 'Palletizing Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '4 Axis reach 3100mm load 180kg',
    description:
      '4 Axis reach 3100mm load 180kg. Heavy-duty SZGH-B3100-180 4-axis palletizing robot with 3100mm reach, 180kg payload, and 1774kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 132551,
    packedWeightKg: 1774,
    bodyWeightKg: 1134,
    cabinetWeightKg: 260,
    woodenBoxDimensions: '220×115×244 cm (Body) + 95×80×150 cm (Cabinet)',
  },
  {
    modelNumber: 'SZGH-B2300-100',
    buttonLabel: 'B2300-100',
    seriesKey: 'ROBOT_SERIES_B',
    seriesClubName: 'SZGH-B Series',
    seriesTitle: 'SZGH-B Series 4-Axis Heavy-Duty Palletizing & Stacking Industrial Robots',
    robotTypeLabel: 'Palletizing Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '4 Axis reach 2300mm load 100kg',
    description:
      '4 Axis reach 2300mm load 100kg. Heavy-duty SZGH-B2300-100 4-axis palletizing robot with 2300mm reach, 100kg payload, and 845kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 103064,
    packedWeightKg: 845,
    bodyWeightKg: 590,
    cabinetWeightKg: 95,
    woodenBoxDimensions: '150×90×177 cm (Body) + 75×65×116 cm (Cabinet)',
  },
  {
    modelNumber: 'SZGH-B2850-100',
    buttonLabel: 'B2850-100',
    seriesKey: 'ROBOT_SERIES_B',
    seriesClubName: 'SZGH-B Series',
    seriesTitle: 'SZGH-B Series 4-Axis Heavy-Duty Palletizing & Stacking Industrial Robots',
    robotTypeLabel: 'Palletizing Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '4 Axis reach 2850mm load 100kg',
    description:
      '4 Axis reach 2850mm load 100kg. Heavy-duty SZGH-B2850-100 4-axis palletizing robot with 2850mm reach and 100kg payload capacity, including robot control system, servo motors, reducers, control cabinet, and cables.',
    exwRmb: 99218,
    packedWeightKg: null,
  },
  {
    modelNumber: 'SZGH-B2850-80',
    buttonLabel: 'B2850-80',
    seriesKey: 'ROBOT_SERIES_B',
    seriesClubName: 'SZGH-B Series',
    seriesTitle: 'SZGH-B Series 4-Axis Heavy-Duty Palletizing & Stacking Industrial Robots',
    robotTypeLabel: 'Palletizing Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '4 Axis reach 2850mm load 80kg',
    description:
      '4 Axis reach 2850mm load 80kg. Heavy-duty SZGH-B2850-80 4-axis palletizing robot with 2850mm reach and 80kg payload capacity, including robot control system, servo motors, reducers, control cabinet, and cables.',
    exwRmb: 94090,
    packedWeightKg: null,
  },
  {
    modelNumber: 'SZGH-B2300-60',
    buttonLabel: 'B2300-60',
    seriesKey: 'ROBOT_SERIES_B',
    seriesClubName: 'SZGH-B Series',
    seriesTitle: 'SZGH-B Series 4-Axis Heavy-Duty Palletizing & Stacking Industrial Robots',
    robotTypeLabel: 'Palletizing Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '4 Axis reach 2300mm load 60kg',
    description:
      '4 Axis reach 2300mm load 60kg. Heavy-duty SZGH-B2300-60 4-axis palletizing robot with 2300mm reach and 60kg payload capacity, including robot control system, servo motors, reducers, control cabinet, and cables.',
    exwRmb: 94090,
    packedWeightKg: null,
  },
  {
    modelNumber: 'SZGH-B1800-35C',
    buttonLabel: 'B1800-35C',
    seriesKey: 'ROBOT_SERIES_B',
    seriesClubName: 'SZGH-B Series',
    seriesTitle: 'SZGH-B Series 4-Axis Heavy-Duty Palletizing & Stacking Industrial Robots',
    robotTypeLabel: 'Palletizing Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '4 Axis reach 1800mm load 35kg',
    description:
      '4 Axis reach 1800mm load 35kg. Industrial SZGH-B1800-35C 4-axis palletizing & stacking robot with 1800mm reach and 35kg payload capacity, including robot control system, servo motors, reducers, control cabinet, and cables.',
    exwRmb: 51782,
    packedWeightKg: null,
    cabinetWeightKg: 45,
  },
  {
    modelNumber: 'SZGH-B1800-25C',
    buttonLabel: 'B1800-25C',
    seriesKey: 'ROBOT_SERIES_B',
    seriesClubName: 'SZGH-B Series',
    seriesTitle: 'SZGH-B Series 4-Axis Heavy-Duty Palletizing & Stacking Industrial Robots',
    robotTypeLabel: 'Palletizing Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '4 Axis reach 1800mm load 25kg',
    description:
      '4 Axis reach 1800mm load 25kg. Industrial SZGH-B1800-25C 4-axis palletizing & stacking robot with 1800mm reach and 25kg payload capacity, including robot control system, servo motors, reducers, control cabinet, and cables.',
    exwRmb: 49218,
    packedWeightKg: null,
    cabinetWeightKg: 45,
  },
  {
    modelNumber: 'SZGH-B1500-15C',
    buttonLabel: 'B1500-15C',
    seriesKey: 'ROBOT_SERIES_B',
    seriesClubName: 'SZGH-B Series',
    seriesTitle: 'SZGH-B Series 4-Axis Heavy-Duty Palletizing & Stacking Industrial Robots',
    robotTypeLabel: 'Palletizing Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '4 Axis reach 1500mm load 15kg',
    description:
      '4 Axis reach 1500mm load 15kg. Industrial SZGH-B1500-15C 4-axis palletizing & stacking robot with 1500mm reach, 15kg payload, and 279.5kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 39603,
    packedWeightKg: 279.5,
    bodyWeightKg: 144.5,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×124 cm',
  },
  {
    modelNumber: 'SZGH-B1500-10C',
    buttonLabel: 'B1500-10C',
    seriesKey: 'ROBOT_SERIES_B',
    seriesClubName: 'SZGH-B Series',
    seriesTitle: 'SZGH-B Series 4-Axis Heavy-Duty Palletizing & Stacking Industrial Robots',
    robotTypeLabel: 'Palletizing Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '4 Axis reach 1500mm load 10kg',
    description:
      '4 Axis reach 1500mm load 10kg. Industrial SZGH-B1500-10C 4-axis palletizing & stacking robot with 1500mm reach, 10kg payload, and 277.5kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 35756,
    packedWeightKg: 277.5,
    bodyWeightKg: 142.5,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×124 cm',
  },
  {
    modelNumber: 'SZGH-B1400-6',
    buttonLabel: 'B1400-6',
    seriesKey: 'ROBOT_SERIES_B',
    seriesClubName: 'SZGH-B Series',
    seriesTitle: 'SZGH-B Series 4-Axis Heavy-Duty Palletizing & Stacking Industrial Robots',
    robotTypeLabel: 'Palletizing Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '4 Axis reach 1400mm load 6kg',
    description:
      '4 Axis reach 1400mm load 6kg. Compact SZGH-B1400-6 4-axis palletizing & stacking robot with 1400mm reach, 6kg payload, and 186.5kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 32551,
    packedWeightKg: 186.5,
    bodyWeightKg: 91.5,
    cabinetWeightKg: 35,
    woodenBoxDimensions: '108×94×115 cm',
  },
  {
    modelNumber: 'SZGH-B1000-8',
    buttonLabel: 'B1000-8',
    seriesKey: 'ROBOT_SERIES_B',
    seriesClubName: 'SZGH-B Series',
    seriesTitle: 'SZGH-B Series 4-Axis Heavy-Duty Palletizing & Stacking Industrial Robots',
    robotTypeLabel: 'Palletizing Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '4 Axis reach 1000mm load 8kg',
    description:
      '4 Axis reach 1000mm load 8kg. Compact SZGH-B1000-8 4-axis palletizing & stacking robot with 1000mm reach, 8kg payload, and 179kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 32551,
    packedWeightKg: 179,
    bodyWeightKg: 84,
    cabinetWeightKg: 35,
    woodenBoxDimensions: '108×94×115 cm',
  },

  // =========================================================================
  // 4. SZGH-S SERIES — High-Speed SCARA Industrial Robots (4-Axis)
  // =========================================================================
  {
    modelNumber: 'SZGH-S600-6',
    buttonLabel: 'S600-6',
    seriesKey: 'ROBOT_SERIES_S',
    seriesClubName: 'SZGH-S Series',
    seriesTitle: 'SZGH-S Series 4-Axis High-Speed SCARA Pick-and-Place & Assembly Robots',
    robotTypeLabel: 'Scara Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '4 Axis reach 600mm load 6kg',
    description:
      '4 Axis reach 600mm load 6kg. High-speed SZGH-S600-6 4-axis SCARA assembly & pick-and-place robot with 600mm reach, 6kg payload, and 95kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 25500,
    packedWeightKg: 95,
    bodyWeightKg: 21,
    cabinetWeightKg: 39,
    woodenBoxDimensions: '89×80×104 cm',
  },
  {
    modelNumber: 'SZGH-S400-6',
    buttonLabel: 'S400-6',
    seriesKey: 'ROBOT_SERIES_S',
    seriesClubName: 'SZGH-S Series',
    seriesTitle: 'SZGH-S Series 4-Axis High-Speed SCARA Pick-and-Place & Assembly Robots',
    robotTypeLabel: 'Scara Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '4 Axis reach 6400mm load 6kg',
    description:
      '4 Axis reach 6400mm load 6kg. High-speed SZGH-S400-6 4-axis SCARA assembly & pick-and-place robot with 400mm/6400mm spec, 6kg payload, and 113kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: 24859,
    packedWeightKg: 113,
    bodyWeightKg: 39,
    cabinetWeightKg: 39,
    woodenBoxDimensions: '89×80×104 cm',
  },
  {
    modelNumber: 'SZGH-S800-10',
    buttonLabel: 'S800-10',
    seriesKey: 'ROBOT_SERIES_S',
    seriesClubName: 'SZGH-S Series',
    seriesTitle: 'SZGH-S Series 4-Axis High-Speed SCARA Pick-and-Place & Assembly Robots',
    robotTypeLabel: 'Scara Robots',
    subcategory: 'Pick-and-Place & Machine Tending',
    spec: '4 Axis reach 800mm load 10kg',
    description:
      '4 Axis reach 800mm load 10kg. Long-reach SZGH-S800-10 4-axis SCARA assembly & pick-and-place robot with 800mm reach, 10kg payload, and 126.5kg packed wooden box weight (Robot + Control Cabinet + Wooden Box).',
    exwRmb: null,
    packedWeightKg: 126.5,
    bodyWeightKg: 42.5,
    cabinetWeightKg: 39,
    woodenBoxDimensions: '95×86×115 cm',
  },

  // =========================================================================
  // 5. SZGH-H SERIES — Articulated MIG/MAG & TIG Arc Welding Robots (6-Axis, from 一体机机器人)
  // =========================================================================
  {
    modelNumber: 'SZGH-H1300-6',
    buttonLabel: 'H1300-6',
    seriesKey: 'ROBOT_SERIES_H',
    seriesClubName: 'SZGH-H Series',
    seriesTitle: 'SZGH-H Series 6-Axis Articulated MIG/MAG & TIG Arc Welding Industrial Robots',
    robotTypeLabel: 'Welding Robots',
    subcategory: 'Robotic Welding Cell',
    spec: '6 Axis reach 1300mm load 6kg Welding Robot (Includes 350A Welder)',
    description:
      '6 Axis reach 1300mm load 6kg Welding Robot. Articulated SZGH-H1300-6 6-axis MIG/MAG & TIG arc welding robot with 1300mm reach, 6kg payload, 350A welding power source, and 266kg packed wooden box weight (Control Cabinet + Robot + Welder + Wooden Box).',
    exwRmb: null,
    packedWeightKg: 266,
    bodyWeightKg: 76,
    cabinetWeightKg: 35,
    woodenBoxDimensions: '108×94×115 cm',
  },
  {
    modelNumber: 'SZGH-H1600-10',
    buttonLabel: 'H1600-10',
    seriesKey: 'ROBOT_SERIES_H',
    seriesClubName: 'SZGH-H Series',
    seriesTitle: 'SZGH-H Series 6-Axis Articulated MIG/MAG & TIG Arc Welding Industrial Robots',
    robotTypeLabel: 'Welding Robots',
    subcategory: 'Robotic Welding Cell',
    spec: '6 Axis reach 1600mm load 10kg Welding Robot (Includes 350A Welder)',
    description:
      '6 Axis reach 1600mm load 10kg Welding Robot. Articulated SZGH-H1600-10 6-axis MIG/MAG & TIG arc welding robot with 1600mm reach, 10kg payload, 350A welding power source, and 391kg packed wooden box weight (Control Cabinet + Robot + Welder + Wooden Box).',
    exwRmb: null,
    packedWeightKg: 391,
    bodyWeightKg: 151,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×124 cm',
  },
  {
    modelNumber: 'SZGH-H1600-10C',
    buttonLabel: 'H1600-10C',
    seriesKey: 'ROBOT_SERIES_H',
    seriesClubName: 'SZGH-H Series',
    seriesTitle: 'SZGH-H Series 6-Axis Articulated MIG/MAG & TIG Arc Welding Industrial Robots',
    robotTypeLabel: 'Welding Robots',
    subcategory: 'Robotic Welding Cell',
    spec: '6 Axis reach 1600mm load 10kg Hollow-Wrist Welding Robot (Includes 350A Welder)',
    description:
      '6 Axis reach 1600mm load 10kg Hollow-Wrist Welding Robot. Articulated SZGH-H1600-10C 6-axis MIG/MAG & TIG arc welding robot with 1600mm reach, 10kg payload, 350A welding power source, and 377.5kg packed wooden box weight.',
    exwRmb: null,
    packedWeightKg: 377.5,
    bodyWeightKg: 147.5,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×124 cm',
  },
  {
    modelNumber: 'SZGH-H1600-10C-800',
    buttonLabel: 'H1600-10C-800',
    seriesKey: 'ROBOT_SERIES_H',
    seriesClubName: 'SZGH-H Series',
    seriesTitle: 'SZGH-H Series 6-Axis Articulated MIG/MAG & TIG Arc Welding Industrial Robots',
    robotTypeLabel: 'Welding Robots',
    subcategory: 'Robotic Welding Cell',
    spec: '6 Axis reach 1600mm load 10kg High-Base (800mm) Welding Robot (Includes 350A Welder)',
    description:
      '6 Axis reach 1600mm load 10kg High-Base (800mm) Welding Robot. Articulated SZGH-H1600-10C-800 6-axis MIG/MAG & TIG arc welding robot with 1600mm reach, 10kg payload, 350A welding power source, and 435kg packed wooden box weight.',
    exwRmb: null,
    packedWeightKg: 435,
    bodyWeightKg: 175,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×154 cm',
  },
  {
    modelNumber: 'SZGH-H1850-10',
    buttonLabel: 'H1850-10',
    seriesKey: 'ROBOT_SERIES_H',
    seriesClubName: 'SZGH-H Series',
    seriesTitle: 'SZGH-H Series 6-Axis Articulated MIG/MAG & TIG Arc Welding Industrial Robots',
    robotTypeLabel: 'Welding Robots',
    subcategory: 'Robotic Welding Cell',
    spec: '6 Axis reach 1850mm load 10kg Welding Robot (Includes 350A Welder)',
    description:
      '6 Axis reach 1850mm load 10kg Welding Robot. Articulated SZGH-H1850-10 6-axis MIG/MAG & TIG arc welding robot with 1850mm reach, 10kg payload, 350A welding power source, and 402kg packed wooden box weight.',
    exwRmb: null,
    packedWeightKg: 402,
    bodyWeightKg: 162,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×124 cm',
  },
  {
    modelNumber: 'SZGH-H1850-10C',
    buttonLabel: 'H1850-10C',
    seriesKey: 'ROBOT_SERIES_H',
    seriesClubName: 'SZGH-H Series',
    seriesTitle: 'SZGH-H Series 6-Axis Articulated MIG/MAG & TIG Arc Welding Industrial Robots',
    robotTypeLabel: 'Welding Robots',
    subcategory: 'Robotic Welding Cell',
    spec: '6 Axis reach 1850mm load 10kg Hollow-Wrist Welding Robot (Includes 350A Welder)',
    description:
      '6 Axis reach 1850mm load 10kg Hollow-Wrist Welding Robot. Articulated SZGH-H1850-10C 6-axis MIG/MAG & TIG arc welding robot with 1850mm reach, 10kg payload, 350A welding power source, and 417kg packed wooden box weight.',
    exwRmb: null,
    packedWeightKg: 417,
    bodyWeightKg: 177,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×143 cm',
  },
  {
    modelNumber: 'SZGH-H1850-10C-800',
    buttonLabel: 'H1850-10C-800',
    seriesKey: 'ROBOT_SERIES_H',
    seriesClubName: 'SZGH-H Series',
    seriesTitle: 'SZGH-H Series 6-Axis Articulated MIG/MAG & TIG Arc Welding Industrial Robots',
    robotTypeLabel: 'Welding Robots',
    subcategory: 'Robotic Welding Cell',
    spec: '6 Axis reach 1850mm load 10kg High-Base (800mm) Welding Robot (Includes 350A Welder)',
    description:
      '6 Axis reach 1850mm load 10kg High-Base (800mm) Welding Robot. Articulated SZGH-H1850-10C-800 6-axis MIG/MAG & TIG arc welding robot with 1850mm reach, 10kg payload, 350A welding power source, and 452kg packed wooden box weight.',
    exwRmb: null,
    packedWeightKg: 452,
    bodyWeightKg: 192,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×154 cm',
  },
  {
    modelNumber: 'SZGH-H2000-6',
    buttonLabel: 'H2000-6',
    seriesKey: 'ROBOT_SERIES_H',
    seriesClubName: 'SZGH-H Series',
    seriesTitle: 'SZGH-H Series 6-Axis Articulated MIG/MAG & TIG Arc Welding Industrial Robots',
    robotTypeLabel: 'Welding Robots',
    subcategory: 'Robotic Welding Cell',
    spec: '6 Axis reach 2000mm load 6kg Welding Robot (Includes 350A Welder)',
    description:
      '6 Axis reach 2000mm load 6kg Welding Robot. Long-reach SZGH-H2000-6 6-axis MIG/MAG & TIG arc welding robot with 2000mm reach, 6kg payload, 350A welding power source, and 426kg packed wooden box weight.',
    exwRmb: null,
    packedWeightKg: 426,
    bodyWeightKg: 166,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×154 cm',
  },
  {
    modelNumber: 'SZGH-H2000-6C',
    buttonLabel: 'H2000-6C',
    seriesKey: 'ROBOT_SERIES_H',
    seriesClubName: 'SZGH-H Series',
    seriesTitle: 'SZGH-H Series 6-Axis Articulated MIG/MAG & TIG Arc Welding Industrial Robots',
    robotTypeLabel: 'Welding Robots',
    subcategory: 'Robotic Welding Cell',
    spec: '6 Axis reach 2000mm load 6kg Hollow-Wrist Welding Robot (Includes 350A Welder)',
    description:
      '6 Axis reach 2000mm load 6kg Hollow-Wrist Welding Robot. Long-reach SZGH-H2000-6C 6-axis MIG/MAG & TIG arc welding robot with 2000mm reach, 6kg payload, 350A welding power source, and 421kg packed wooden box weight.',
    exwRmb: null,
    packedWeightKg: 421,
    bodyWeightKg: 181,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×143 cm',
  },
  {
    modelNumber: 'SZGH-H2000-6C-800',
    buttonLabel: 'H2000-6C-800',
    seriesKey: 'ROBOT_SERIES_H',
    seriesClubName: 'SZGH-H Series',
    seriesTitle: 'SZGH-H Series 6-Axis Articulated MIG/MAG & TIG Arc Welding Industrial Robots',
    robotTypeLabel: 'Welding Robots',
    subcategory: 'Robotic Welding Cell',
    spec: '6 Axis reach 2000mm load 6kg High-Base (800mm) Welding Robot (Includes 350A Welder)',
    description:
      '6 Axis reach 2000mm load 6kg High-Base (800mm) Welding Robot. Long-reach SZGH-H2000-6C-800 6-axis MIG/MAG & TIG arc welding robot with 2000mm reach, 6kg payload, 350A welding power source, and 466kg packed wooden box weight.',
    exwRmb: null,
    packedWeightKg: 466,
    bodyWeightKg: 206,
    cabinetWeightKg: 45,
    woodenBoxDimensions: '122×102×154 cm',
  },
];

const ROBOT_BY_KEY = new Map<string, IndustrialRobotRateRow>();
for (const row of INDUSTRIAL_ROBOT_RATE_LIST_2026) {
  ROBOT_BY_KEY.set(canonicalRateKey(row.modelNumber), row);
}

/**
 * Resolves the official 2026 Retail Price, updated Controller Rate List-1 description/title/subcategory/features,
 * Servo Motor 3-option configuration, and Industrial Robot EXW + Freight * 1.25 calculation for any product model number.
 */
export function resolveOfficialRateListPricing(
  item: {
    category?: string;
    modelNumber?: string;
    title?: string;
    description?: string;
    price?: number;
  },
  rmbToPkrRate: number = DEFAULT_RMB_TO_PKR_RATE,
  freightRatePerKg: number = DEFAULT_FREIGHT_RATE_PER_KG
): {
  price?: number;
  title?: string;
  description?: string;
  subcategory?: string;
  features?: string[];
  servoConfigOptions?: ServoMotorConfigOption[];
  panelPrices?: PanelPricingMap;
  exwRmb?: number | null;
  packedWeightKg?: number | null;
  woodenBoxDimensions?: string;
  bodyWeightKg?: number | null;
  cabinetWeightKg?: number | null;
  baseDealerPricePKR?: number;
  brakePricePKR?: number;
  brakeDealerPricePKR?: number;
  absolutePricePKR?: number;
  absoluteDealerPricePKR?: number;
} {
  const rawModel = (item.modelNumber || '').trim();
  if (!rawModel) return {};

  // Check standalone I/O board
  if (
    /(?:SZGH[-\s]*)?(?:CNC(?:880)?[-\s]*)?I[O0][-\s]*12/i.test(rawModel) ||
    `${item.title || ''} ${item.description || ''}`
      .toLowerCase()
      .includes('i/o board is recommended for controllers')
  ) {
    return {
      price: OFFICIAL_IO_BOARD_PRICE_PKR,
      title: 'Optical Isolated I/O Expansion Board for CNC Controllers',
      description:
        'I/O board is recommended for controllers. Provides optically isolated 24VDC input/output terminal conditioning and relay outputs for SZGH CNC lathe, milling, engraving, and grinder controllers.',
    };
  }

  const key = canonicalRateKey(rawModel);
  let keyNoPanel = canonicalRateKey(stripPanelInfoFromText(rawModel));

  const robotRow = ROBOT_BY_KEY.get(key) || ROBOT_BY_KEY.get(keyNoPanel);
  if (robotRow) {
    const calc = calculateRobotRetailPriceBreakdown(
      robotRow.exwRmb,
      robotRow.packedWeightKg,
      rmbToPkrRate,
      freightRatePerKg,
      DEFAULT_RETAIL_MARKUP
    );
    return {
      ...(calc.retailPricePkr > 0 ? { price: calc.retailPricePkr } : {}),
      title: `${robotRow.modelNumber} — ${robotRow.spec} (${robotRow.robotTypeLabel})`,
      description: robotRow.description,
      subcategory: robotRow.subcategory,
      exwRmb: robotRow.exwRmb,
      packedWeightKg: robotRow.packedWeightKg,
      woodenBoxDimensions: robotRow.woodenBoxDimensions,
      bodyWeightKg: robotRow.bodyWeightKg,
      cabinetWeightKg: robotRow.cabinetWeightKg,
    };
  }

  let controllerRow =
    CONTROLLER_ROW_BY_KEY.get(key) || CONTROLLER_ROW_BY_KEY.get(keyNoPanel);

  // If the modelNumber in Firestore has no trailing axis digit (e.g., "SZGH1000-TDB", "SZGH1000-TDC", "SZGH-1000MDB", "SZGH-1000MDC", "SZGH-1000MDCB"),
  // resolve the axis from title/description (or price) so the exact axis rate row & panelPrices are matched.
  if (controllerRow === undefined) {
    const combinedText = `${rawModel} ${item.title || ''} ${item.description || ''}`;
    const axisMatch = combinedText.match(/\b([1-8])\s*[-–]?\s*(?:ax(?:is|es)|dof)\b/i);
    if (axisMatch) {
      const candidateKeyWithAxis = `${keyNoPanel}${axisMatch[1]}`;
      controllerRow = CONTROLLER_ROW_BY_KEY.get(candidateKeyWithAxis);
      if (controllerRow) {
        keyNoPanel = candidateKeyWithAxis;
      }
    }
    if (controllerRow === undefined) {
      const seriesRows = CONTROLLER_ROWS_BY_SERIES_KEY.get(keyNoPanel);
      if (seriesRows && seriesRows.length > 0) {
        if (item.price && item.price > 0) {
          controllerRow =
            seriesRows.find(
              (r) =>
                Math.abs(r.pricePKR - item.price!) <= 2000 ||
                Math.abs(r.pricePKR + PANEL_CE_PRICE_DELTA_PKR - item.price!) <= 2000 ||
                Math.abs(r.pricePKR - PANEL_CE_PRICE_DELTA_PKR - item.price!) <= 2000
            ) || seriesRows[0];
        } else {
          controllerRow = seriesRows[0];
        }
        const matchedWithoutPanel = stripPanelInfoFromText(controllerRow.modelNumber);
        keyNoPanel = canonicalRateKey(matchedWithoutPanel);
      }
    }
  }

  if (controllerRow !== undefined) {
    const panelPrices = PANEL_PRICES_BY_NO_PANEL_KEY.get(keyNoPanel);
    const displayPrice =
      panelPrices?.defaultDisplayPrice ?? panelPrices?.A ?? controllerRow.pricePKR;
    return {
      price: displayPrice,
      title: stripPanelInfoFromText(controllerRow.spec),
      description: stripPanelInfoFromText(controllerRow.description),
      subcategory: controllerRow.subcategory,
      features: buildControllerFeatures(controllerRow),
      panelPrices,
    };
  }

  // Also check 880TIC series (SZGH-880TIC-2..4) which is an 880 series controller (Absolute & ATC Supported per user note)
  if (/^880TIC[-_]?([2-6])$/i.test(key)) {
    const axisMatch = key.match(/([2-6])$/);
    const ax = axisMatch ? axisMatch[1] : '2';
    return {
      title: `CNC ${ax}-axis Absolute Lathe Controller, ATC Supported (8 inch display Without I/O)`,
      description: `CNC ${ax} axis Absolute lathe controller, ATC Supported, 8 inch display Without I/O. High-stability bus-type dual-panel SZGH-880TIC CNC turning controller featuring multi-turn Absolute encoder support, Automatic Tool Changer (ATC) & turret PLC logic, MODBUS/Ethernet bus interface, and 8-inch display Without I/O.`,
      subcategory: 'Lathe controller',
      features: [
        'Multi-turn Absolute servo encoder support for zero-return-free power-on positioning',
        'ATC Supported — Built-in open PLC ladder for Automatic Tool Changers (ATC) and multi-station electric/hydraulic turrets',
        'High-speed CNC bus architecture with MODBUS, Ethernet, Subpanel, Servo Spindle, Encoder, and Output/Input interfaces',
        'Compatible with Without I/O and With I/O (+PKR 22,000) expansion board configurations',
      ],
    };
  }

  const motorRow = SERVO_MOTOR_BY_KEY.get(key);
  if (motorRow) {
    return {
      price: motorRow.basePricePKR,
      description: motorRow.spec,
      servoConfigOptions: buildServoMotorConfigOptions(motorRow),
      baseDealerPricePKR: motorRow.baseDealerPricePKR,
      brakePricePKR: motorRow.brakePricePKR,
      brakeDealerPricePKR: motorRow.brakeDealerPricePKR,
      absolutePricePKR: motorRow.absolutePricePKR,
      absoluteDealerPricePKR: motorRow.absoluteDealerPricePKR,
    };
  }

  const driverRow = SERVO_DRIVER_BY_KEY.get(key);
  if (driverRow) {
    return {
      price: driverRow.basePricePKR,
      description: driverRow.spec,
      baseDealerPricePKR: driverRow.baseDealerPricePKR,
    };
  }

  return {};
}


