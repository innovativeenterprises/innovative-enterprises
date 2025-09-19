
import type { Investor } from './investors.schema';

export const initialInvestors: Investor[] = [
  {
    id: 'inv_01',
    name: 'Oman Technology Fund',
    type: 'Funder',
    subType: 'Institute/Government',
    focusArea: 'Early-stage Omani tech startups',
    country: 'Oman',
  },
  {
    id: 'inv_02',
    name: 'Seedstars',
    type: 'Investor',
    subType: 'VC Fund',
    focusArea: 'Emerging Market Technology',
    country: 'Switzerland',
  },
];
