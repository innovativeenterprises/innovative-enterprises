
export interface InvestorDocument {
    name: string;
    dataUri: string;
}

export interface Investor {
  id: string;
  name: string;
  type: 'Investor' | 'Funder';
  subType: 'Personal/Private' | 'Angel' | 'Institute/Government' | 'VC Fund';
  profile: string;
  documents: {
    cr?: InvestorDocument;
    vatId?: InvestorDocument;
    passport?: InvestorDocument;
    civilId?: InvestorDocument;
    incomeProof?: InvestorDocument;
  };
  investmentValue?: number;
  sharePercentage?: number;
}

export const initialInvestors: Investor[] = [
    {
        id: "inv_1",
        name: "Oman Technology Fund",
        type: "Funder",
        subType: "Institute/Government",
        profile: "A government-backed fund focused on nurturing technology startups and innovation within the Sultanate of Oman.",
        documents: {},
        investmentValue: 50000,
        sharePercentage: 0,
    },
    {
        id: "inv_2",
        name: "Future Growth Ventures",
        type: "Investor",
        subType: "VC Fund",
        profile: "A Dubai-based Venture Capital fund investing in early-stage SaaS and AI companies across the GCC.",
        documents: {},
        investmentValue: 150000,
        sharePercentage: 15,
    },
    {
        id: "inv_3",
        name: "Ali Al-Saidi",
        type: "Investor",
        subType: "Angel",
        profile: "An individual angel investor with a background in logistics and supply chain technology.",
        documents: {},
        investmentValue: 25000,
        sharePercentage: 5,
    },
     {
        id: "inv_4",
        name: "SME Development Fund (Inma)",
        type: "Funder",
        subType: "Institute/Government",
        profile: "Provides financial solutions and support for the growth and development of Small and Medium Enterprises in Oman.",
        documents: {},
        investmentValue: 75000,
        sharePercentage: 0,
    }
];
