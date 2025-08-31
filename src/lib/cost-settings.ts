import type { CostRate } from './cost-settings.schema';

export const initialCostSettings: CostRate[] = [
  // Materials
  {
    id: 'mat_01',
    name: 'Ready-mix Concrete (30 MPa)',
    category: 'Material',
    unit: 'm³',
    rate: 35.0,
  },
  {
    id: 'mat_02',
    name: 'Steel Reinforcement (Rebar)',
    category: 'Material',
    unit: 'ton',
    rate: 280.0,
  },
  {
    id: 'mat_03',
    name: '20cm Concrete Block',
    category: 'Material',
    unit: 'each',
    rate: 0.35,
  },
  {
    id: 'mat_04',
    name: 'Portland Cement',
    category: 'Material',
    unit: '50kg bag',
    rate: 1.8,
  },
  {
    id: 'mat_05',
    name: 'Plaster (Ready-mix)',
    category: 'Material',
    unit: 'm³',
    rate: 25.0,
  },
  {
    id: 'mat_06',
    name: 'Interior Paint (Emulsion)',
    category: 'Material',
    unit: 'gallon',
    rate: 5.5,
  },
  // Labor
  {
    id: 'lab_01',
    name: 'General Laborer',
    category: 'Labor',
    unit: 'per day',
    rate: 10.0,
  },
  {
    id: 'lab_02',
    name: 'Mason',
    category: 'Labor',
    unit: 'per day',
    rate: 15.0,
  },
  {
    id: 'lab_03',
    name: 'Steel Fixer',
    category: 'Labor',
    unit: 'per day',
    rate: 18.0,
  },
  {
    id: 'lab_04',
    name: 'Painter',
    category: 'Labor',
    unit: 'per day',
    rate: 14.0,
  },
  // Equipment
  {
    id: 'eqp_01',
    name: 'Excavator Rental',
    category: 'Equipment',
    unit: 'per day',
    rate: 120.0,
  },
  {
    id: 'eqp_02',
    name: 'Concrete Mixer Rental',
    category: 'Equipment',
    unit: 'per day',
    rate: 25.0,
  },
];
