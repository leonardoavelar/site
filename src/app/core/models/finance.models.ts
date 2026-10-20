export type InvestmentType =
  | 'savings'
  | 'cdb-fixed'
  | 'cdb-cdi'
  | 'tesouro-selic'
  | 'lci-lca';

export interface SimulationInput {
  initialAmount: number;
  monthlyContribution: number;
  investment: InvestmentType;
  annualRate: number;
  cdiAnnualRate: number;
  cdiPercentage: number;
  startDate: string;
  periodDays: number;
  lciTaxExempt: boolean;
}

export interface DailyResult {
  day: number;
  date: string;
  businessDay: boolean;
  balance: number;
  grossProfit: number;
  iof: number;
  incomeTax: number;
  netBalance: number;
}

export interface SimulationResult {
  input: SimulationInput;
  initialAmount: number;
  totalContributed: number;
  grossProfit: number;
  taxes: number;
  iof: number;
  incomeTax: number;
  netProfit: number;
  finalBalance: number;
  returnPercentage: number;
  daily: DailyResult[];
}

export interface SavedSimulation {
  id: string;
  savedAt: string;
  result: SimulationResult;
}

export interface PortfolioAsset {
  id: string;
  name: string;
  investment: InvestmentType;
  amount: number;
}
