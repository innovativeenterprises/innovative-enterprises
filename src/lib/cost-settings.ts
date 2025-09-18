
import type { CostRate } from './cost-settings.schema';

export const initialCostSettings: CostRate[] = [
  {
    id: 'cost_concrete_ready_mix_30',
    name: 'Ready-mix Concrete 30N/mm2',
    category: 'Material',
    unit: 'm³',
    rate: 35.0,
  },
  {
    id: 'cost_steel_reinforcement',
    name: 'Steel Reinforcement',
    category: 'Material',
    unit: 'ton',
    rate: 280.0,
  },
  {
    id: 'cost_skilled_labor',
    name: 'Skilled Labor',
    category: 'Labor',
    unit: 'per day',
    rate: 15.0,
  },
  {
    id: 'cost_unskilled_labor',
    name: 'Unskilled Labor',
    category: 'Labor',
    unit: 'per day',
    rate: 8.0,
  },
  {
    id: 'cost_excavator_rental',
    name: 'Excavator Rental',
    category: 'Equipment',
    unit: 'per day',
    rate: 80.0,
  },
  {
    id: 'cost_formwork',
    name: 'Formwork',
    category: 'Material',
    unit: 'm²',
    rate: 4.5,
  },
];
