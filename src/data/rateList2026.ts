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
  brakePricePKR: number;
  absolutePricePKR: number;
}

export interface ServoDriverRateRow {
  modelNumber: string;
  spec: string;
  basePricePKR: number;
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
 * Official 2026 SZGH Pakistan AC Servo Motor Rate List (48 Models — Base, With Brake, Absolute Retail PKR)
 */
export const SERVO_MOTOR_RATE_LIST_2026: ServoMotorRateRow[] = [
  { modelNumber: 'SZGH-04005D', spec: '50W, 0.16NM, 3000RPM', basePricePKR: 42941, brakePricePKR: 56759, absolutePricePKR: 67757 },
  { modelNumber: 'SZGH-04010D', spec: '100W, 0.32NM, 3000RPM', basePricePKR: 47304, brakePricePKR: 61122, absolutePricePKR: 72120 },
  { modelNumber: 'SZGH-06020DC', spec: '200W, 0.637NM, 3000RPM', basePricePKR: 40460, brakePricePKR: 54278, absolutePricePKR: 65276 },
  { modelNumber: 'SZGH-06040DC', spec: '400W, 1.27NM, 3000RPM', basePricePKR: 45969, brakePricePKR: 59787, absolutePricePKR: 70785 },
  { modelNumber: 'SZGH-06060DC', spec: '600W, 1.91NM, 3000RPM', basePricePKR: 57826, brakePricePKR: 71644, absolutePricePKR: 82642 },
  { modelNumber: 'SZGH-08040DC', spec: '80mm flange, 400W, 1.27NM, 3000RPM', basePricePKR: 59164, brakePricePKR: 72982, absolutePricePKR: 83980 },
  { modelNumber: 'SZGH-08075BC', spec: '80mm flange, 750W, 3.5NM, 2000RPM', basePricePKR: 70048, brakePricePKR: 83866, absolutePricePKR: 94864 },
  { modelNumber: 'SZGH-08075DC', spec: '80mm flange, 750W, 2.4NM, 3000RPM', basePricePKR: 56549, brakePricePKR: 70367, absolutePricePKR: 81365 },
  { modelNumber: 'SZGH-08100CC', spec: '80mm flange, 1000W, 4NM, 2500RPM', basePricePKR: 86056, brakePricePKR: 103540, absolutePricePKR: 114538 },
  { modelNumber: 'SZGH-09075BC', spec: '90mm flange, 730W, 3.5NM, 2000RPM', basePricePKR: 70048, brakePricePKR: 87532, absolutePricePKR: 98530 },
  { modelNumber: 'SZGH-09075DC', spec: '90mm flange, 750W, 2.4NM, 3000RPM', basePricePKR: 67312, brakePricePKR: 84796, absolutePricePKR: 95794 },
  { modelNumber: 'SZGH-09100CC', spec: '90mm flange, 1000W, 4NM, 2500RPM', basePricePKR: 71031, brakePricePKR: 88515, absolutePricePKR: 99513 },
  { modelNumber: 'SZGH-11060DC', spec: '110mm flange, 600W, 2NM, 3000RPM', basePricePKR: 77527, brakePricePKR: 95011, absolutePricePKR: 106009 },
  { modelNumber: 'SZGH-11080DC', spec: '110mm flange, 800W, 4NM, 2000RPM', basePricePKR: 73463, brakePricePKR: 90947, absolutePricePKR: 101945 },
  { modelNumber: 'SZGH-11120BC', spec: '110mm flange, 1200W, 6NM, 2000RPM', basePricePKR: 81638, brakePricePKR: 99122, absolutePricePKR: 110120 },
  { modelNumber: 'SZGH-11120DC', spec: '110mm flange, 1200W, 4NM, 3000RPM', basePricePKR: 83994, brakePricePKR: 101478, absolutePricePKR: 112476 },
  { modelNumber: 'SZGH-11150DC', spec: '110mm flange, 1.5KW, 5NM, 3000RPM', basePricePKR: 91693, brakePricePKR: 109177, absolutePricePKR: 120175 },
  { modelNumber: 'SZGH-11180DC', spec: '110mm flange, 1800W, 6NM, 3000RPM', basePricePKR: 118685, brakePricePKR: 136169, absolutePricePKR: 147167 },
  { modelNumber: 'SZGH-13100AC', spec: '130mm flange, 1.0KW, 10NM, 1000RPM', basePricePKR: 125664, brakePricePKR: 143148, absolutePricePKR: 154146 },
  { modelNumber: 'SZGH-13100CC', spec: '130mm flange, 1.0KW, 4NM, 2500RPM', basePricePKR: 92643, brakePricePKR: 110127, absolutePricePKR: 121125 },
  { modelNumber: 'SZGH-13130CC', spec: '130mm flange, 1.3KW, 5NM, 2500RPM', basePricePKR: 101399, brakePricePKR: 118883, absolutePricePKR: 129881 },
  { modelNumber: 'SZGH-13150AC', spec: '130mm flange, 1.5KW, 10NM, 1500RPM', basePricePKR: 106689, brakePricePKR: 124173, absolutePricePKR: 135171 },
  { modelNumber: 'SZGH-13150CC', spec: '130mm flange, 1.5KW, 6NM, 2500RPM', basePricePKR: 85218, brakePricePKR: 102702, absolutePricePKR: 113700 },
  { modelNumber: 'SZGH-13200BC', spec: '130mm flange, 2.0KW, 10NM, 2000RPM', basePricePKR: 98839, brakePricePKR: 116323, absolutePricePKR: 127321 },
  { modelNumber: 'SZGH-13200CC', spec: '130mm flange, 2.0KW, 7.7NM, 2500RPM', basePricePKR: 91542, brakePricePKR: 109026, absolutePricePKR: 120024 },
  { modelNumber: 'SZGH-13230AC', spec: '130mm flange, 2.3KW, 15NM, 1500RPM', basePricePKR: 121885, brakePricePKR: 139933, absolutePricePKR: 150931 },
  { modelNumber: 'SZGH-13260CC', spec: '130mm flange, 2.6KW, 10NM, 2500RPM', basePricePKR: 104714, brakePricePKR: 122762, absolutePricePKR: 133760 },
  { modelNumber: 'SZGH-13300CC', spec: '130mm flange, 3.0KW, 15NM, 2000RPM', basePricePKR: 119910, brakePricePKR: 155160, absolutePricePKR: 166158 },
  { modelNumber: 'SZGH-13380CC', spec: '130mm flange, 3.8KW, 15NM, 2500RPM', basePricePKR: 119910, brakePricePKR: 155160, absolutePricePKR: 166158 },
  { modelNumber: 'SZGH-15300BC', spec: '150mm flange, 3.0KW, 15NM, 2000RPM', basePricePKR: 188510, brakePricePKR: 223760, absolutePricePKR: 234758 },
  { modelNumber: 'SZGH-15360BC', spec: '150mm flange, 3.6KW, 18NM, 2000RPM', basePricePKR: 193685, brakePricePKR: 228935, absolutePricePKR: 239933 },
  { modelNumber: 'SZGH-15380CC', spec: '150mm flange, 3.8KW, 15NM, 2500RPM', basePricePKR: 184560, brakePricePKR: 219810, absolutePricePKR: 230808 },
  { modelNumber: 'SZGH-15470BC', spec: '150mm flange, 4.7KW, 23NM, 2000RPM', basePricePKR: 224565, brakePricePKR: 259815, absolutePricePKR: 270813 },
  { modelNumber: 'SZGH-15550BC', spec: '150mm flange, 5.5KW, 27NM, 2000RPM', basePricePKR: 267490, brakePricePKR: 302740, absolutePricePKR: 313738 },
  { modelNumber: 'SZGH-18270BC', spec: '180mm flange, 2.7KW, 17.2NM, 1500RPM', basePricePKR: 200155, brakePricePKR: 232585, absolutePricePKR: 243583 },
  { modelNumber: 'SZGH-18290BC', spec: '180mm flange, 2.9KW, 27NM, 1000RPM', basePricePKR: 282122, brakePricePKR: 314552, absolutePricePKR: 325550 },
  { modelNumber: 'SZGH-18300CC', spec: '180mm flange, 3.0KW, 19NM, 1500RPM', basePricePKR: 215323, brakePricePKR: 247753, absolutePricePKR: 258751 },
  { modelNumber: 'SZGH-18370BC', spec: '180mm flange, 3.7KW, 35NM, 1000RPM', basePricePKR: 338356, brakePricePKR: 370786, absolutePricePKR: 381784 },
  { modelNumber: 'SZGH-18430AC', spec: '180mm flange, 4.3KW, 27NM, 1500RPM', basePricePKR: 278172, brakePricePKR: 310602, absolutePricePKR: 321600 },
  { modelNumber: 'SZGH-18450CC', spec: '180mm flange, 4.5KW, 21.5NM, 2000RPM', basePricePKR: 287191, brakePricePKR: 319621, absolutePricePKR: 330619 },
  { modelNumber: 'SZGH-18550CC', spec: '180mm flange, 5.5KW, 35NM, 1000RPM', basePricePKR: 342306, brakePricePKR: 374736, absolutePricePKR: 385734 },
  { modelNumber: 'SZGH-18750CC', spec: '180mm flange, 7.5KW, 48NM, 1500RPM', basePricePKR: 407646, brakePricePKR: 440076, absolutePricePKR: 451074 },
  { modelNumber: 'SZGH-190105BC', spec: '190mm flange, 10.5KW, 67NM, 1500RPM, 380V', basePricePKR: 534649, brakePricePKR: 569899, absolutePricePKR: 580897 },
  { modelNumber: 'SZGH-190150BC', spec: '190mm flange, 15KW, 95.5NM, 1500RPM, 380V', basePricePKR: 592225, brakePricePKR: 644395, absolutePricePKR: 655393 },
  { modelNumber: 'SZGH-20011BC', spec: '200mm flange, 11KW, 70NM, 1500RPM, 380V', basePricePKR: 551052, brakePricePKR: 603222, absolutePricePKR: 614220 },
  { modelNumber: 'SZGH-20015BC', spec: '200mm flange, 15KW, 96NM, 1500RPM, 380V', basePricePKR: 707931, brakePricePKR: 760101, absolutePricePKR: 771099 },
  { modelNumber: 'SZGH-20018CC', spec: '200mm flange, 18.6KW, 118NM, 1500RPM, 380V', basePricePKR: 640559, brakePricePKR: 692729, absolutePricePKR: 703727 },
  { modelNumber: 'SZGH-20022CC', spec: '200mm flange, 22KW, 140NM, 1500RPM, 380V', basePricePKR: 684826, brakePricePKR: 736996, absolutePricePKR: 747994 },
];

/**
 * Official 2026 SZGH Pakistan Servo Driver Rate List (27 Models — Base Retail PKR)
 */
export const SERVO_DRIVER_RATE_LIST_2026: ServoDriverRateRow[] = [
  { modelNumber: 'SZGH-E7D20L', spec: 'servo driver 40-60 flange 3-PHASE 220V', basePricePKR: 72663 },
  { modelNumber: 'SZGH-E7D30L', spec: 'servo driver 80.90.110.130 flange power below 2.6kw 3-PHASE 220V', basePricePKR: 75582 },
  { modelNumber: 'SZGH-E7D50B', spec: 'servo driver 150.180 flange power below 3.7kw, 130 flange 3.8kw 3-PHASE 220V', basePricePKR: 100289 },
  { modelNumber: 'SZGH-E7D35H', spec: 'servo driver 110.130 flange power below 3.8kw 3-PHASE 380V', basePricePKR: 130935 },
  { modelNumber: 'SZGH-E7D50L', spec: 'servo driver 150.180 flange power below 5.5kw 3-PHASE 220V', basePricePKR: 158663 },
  { modelNumber: 'SZGH-E7D75L', spec: 'servo driver 180 flange power below 7.5kw 3-PHASE 220V', basePricePKR: 172770 },
  { modelNumber: 'SZGH-E7D50H', spec: 'servo driver 150.180 flange power below 5.5kw 3-PHASE 380V', basePricePKR: 161730 },
  { modelNumber: 'SZGH-E7D75H', spec: 'servo driver 150.180 flange power below 7.5kw 3-PHASE 380V', basePricePKR: 182012 },
  { modelNumber: 'SZGH-E7D160H', spec: 'servo driver 190.200 flange power below 11kw 3-PHASE 380V', basePricePKR: 296328 },
  { modelNumber: 'SZGH-E7D200H', spec: 'servo driver 190.200 flange power below 15kw 3-PHASE 380V', basePricePKR: 372701 },
  { modelNumber: 'SZGH-E7i20L', spec: 'Absolute servo driver 40-60 flange 3-PHASE 220V', basePricePKR: 73027 },
  { modelNumber: 'SZGH-E7i30L', spec: 'Absolute servo driver 80.90.110.130 flange power below 2.6kw 3-PHASE 220V', basePricePKR: 75946 },
  { modelNumber: 'SZGH-E7i50B', spec: 'Absolute servo driver 150.180 flange power below 3.7kw, 130 flange 3.8kw 3-PHASE 220V', basePricePKR: 99951 },
  { modelNumber: 'SZGH-E7i50L', spec: 'Absolute servo driver 150.180 flange power below 5.5kw 3-PHASE 220V', basePricePKR: 154920 },
  { modelNumber: 'SZGH-E7i35H', spec: 'Absolute servo driver 110.130 flange power below 3.8kw 3-PHASE 380V', basePricePKR: 125564 },
  { modelNumber: 'SZGH-E7i50H', spec: 'Absolute servo driver 150.180 flange power below 5.5kw 3-PHASE 220V', basePricePKR: 169513 },
  { modelNumber: 'SZGH-E7i75H', spec: 'Absolute servo driver 150.180 flange power below 7.5kw 3-PHASE 380V', basePricePKR: 181675 },
  { modelNumber: 'SZGH-E7i160H', spec: 'Absolute servo driver 220 flange power below 11kw 3-PHASE 380V', basePricePKR: 313840 },
  { modelNumber: 'SZGH-E7i200H', spec: 'Absolute servo driver 220 flange power below 15kw 3-PHASE 380V', basePricePKR: 389726 },
  { modelNumber: 'SZGH-E7A20LE', spec: 'servo driver absolute EtherCAT power below 400W 3-PHASE 220V', basePricePKR: 73027 },
  { modelNumber: 'SZGH-E7A30LE', spec: 'servo driver absolute EtherCAT power below 1KW 3-PHASE 220V', basePricePKR: 76919 },
  { modelNumber: 'SZGH-E7A50BE', spec: 'servo driver absolute EtherCAT power below 2.3KW 3-PHASE 220V', basePricePKR: 91681 },
  { modelNumber: 'SZGH-E7A50LE', spec: 'servo driver absolute EtherCAT power below 3.6KW 3-PHASE 220V', basePricePKR: 180215 },
  { modelNumber: 'SZGH-E7A35HE', spec: 'servo driver absolute EtherCAT power below 2.3KW 3-PHASE 380V', basePricePKR: 124591 },
  { modelNumber: 'SZGH-E7A50HE', spec: 'servo driver absolute EtherCAT power below 4.3KW 3-PHASE 380V', basePricePKR: 133516 },
  { modelNumber: 'SZGH-E7A75HE', spec: 'servo driver absolute EtherCAT power below 5.5KW 3-PHASE 380V', basePricePKR: 190431 },
  { modelNumber: 'SZGH-E7A160HE', spec: 'servo driver absolute EtherCAT power below 7.5KW 3-PHASE 380V', basePricePKR: 221415 },
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
  if (row.modelNumber === 'SZGH-E7D75H') {
    SERVO_DRIVER_BY_KEY.set(canonicalRateKey('SZGH-ED75H'), row);
  }
}

/**
 * Resolves the official 2026 Retail Price, updated Controller Rate List-1 description/title/subcategory/features,
 * and Servo Motor 3-option configuration for any product model number (including Firestore custom/override items).
 */
export function resolveOfficialRateListPricing(item: {
  modelNumber?: string;
  title?: string;
  description?: string;
  price?: number;
}): {
  price?: number;
  title?: string;
  description?: string;
  subcategory?: string;
  features?: string[];
  servoConfigOptions?: ServoMotorConfigOption[];
  panelPrices?: PanelPricingMap;
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
      servoConfigOptions: buildServoMotorConfigOptions(motorRow),
    };
  }

  const driverRow = SERVO_DRIVER_BY_KEY.get(key);
  if (driverRow) {
    return { price: driverRow.basePricePKR };
  }

  return {};
}

