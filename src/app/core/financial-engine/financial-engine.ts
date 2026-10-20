import {
  DailyResult,
  InvestmentType,
  SimulationInput,
  SimulationResult,
} from '../models/finance.models';

export const INVESTMENTS: Record<
  InvestmentType,
  { label: string; liquidity: string; risk: string; defaultRate: number }
> = {
  savings: {
    label: 'Poupança',
    liquidity: 'Imediata, conforme regras da poupança',
    risk: 'Baixo (risco de crédito do banco)',
    defaultRate: 6,
  },
  'cdb-fixed': {
    label: 'CDB prefixado',
    liquidity: 'No vencimento (conforme contrato)',
    risk: 'Baixo a moderado (FGC, limites e regras aplicáveis)',
    defaultRate: 12,
  },
  'cdb-cdi': {
    label: 'CDB percentual do CDI',
    liquidity: 'No vencimento ou diária (conforme contrato)',
    risk: 'Baixo a moderado (FGC, limites e regras aplicáveis)',
    defaultRate: 0,
  },
  'tesouro-selic': {
    label: 'Tesouro Selic (simplificado)',
    liquidity: 'Liquidez diária, sujeita às regras do Tesouro',
    risk: 'Baixo (risco soberano; preço pode oscilar)',
    defaultRate: 10.65,
  },
  'lci-lca': {
    label: 'LCI / LCA',
    liquidity: 'Geralmente no vencimento ou após carência',
    risk: 'Baixo a moderado (FGC, limites e regras aplicáveis)',
    defaultRate: 9,
  },
};

export function annualToDailyRate(annualRate: number, daysPerYear = 252): number {
  if (!Number.isFinite(annualRate) || annualRate <= -100 || daysPerYear <= 0) {
    throw new RangeError('Informe uma taxa anual válida e positiva.');
  }
  return Math.pow(1 + annualRate / 100, 1 / daysPerYear) - 1;
}

export function compoundInterest(
  principal: number,
  annualRate: number,
  days: number,
  daysPerYear = 252,
): number {
  if (!Number.isFinite(principal) || principal < 0 || !Number.isInteger(days) || days < 0) {
    throw new RangeError('Capital e prazo devem ser valores válidos.');
  }
  return principal * Math.pow(1 + annualToDailyRate(annualRate, daysPerYear), days);
}

export function incomeTaxRate(holdingDays: number): number {
  if (holdingDays < 0) throw new RangeError('O prazo não pode ser negativo.');
  if (holdingDays <= 180) return 0.225;
  if (holdingDays <= 360) return 0.2;
  if (holdingDays <= 720) return 0.175;
  return 0.15;
}

export function iofRate(holdingDays: number): number {
  if (!Number.isInteger(holdingDays) || holdingDays < 0) {
    throw new RangeError('O prazo deve ser um número inteiro não negativo.');
  }
  const rates = [
    0.96, 0.93, 0.9, 0.86, 0.83, 0.8, 0.76, 0.73, 0.7, 0.66,
    0.63, 0.6, 0.56, 0.53, 0.5, 0.46, 0.43, 0.4, 0.36, 0.33,
    0.3, 0.26, 0.23, 0.2, 0.16, 0.13, 0.1, 0.06, 0.03,
  ];
  return holdingDays >= 1 && holdingDays <= 29 ? rates[holdingDays - 1] : 0;
}

export function validateSimulation(input: SimulationInput): string[] {
  const errors: string[] = [];
  if (!Number.isFinite(input.initialAmount) || input.initialAmount <= 0) {
    errors.push('O valor inicial deve ser maior que zero.');
  }
  if (!Number.isFinite(input.monthlyContribution) || input.monthlyContribution < 0) {
    errors.push('O aporte mensal não pode ser negativo.');
  }
  if (!Number.isInteger(input.periodDays) || input.periodDays < 1 || input.periodDays > 36500) {
    errors.push('O prazo deve ser de 1 a 36.500 dias.');
  }
  if (!Number.isFinite(input.annualRate) || input.annualRate < 0 || input.annualRate > 1000) {
    errors.push('A taxa anual deve ser não negativa e de até 1.000%.');
  }
  if (!Number.isFinite(input.cdiAnnualRate) || input.cdiAnnualRate < 0 || input.cdiAnnualRate > 1000) {
    errors.push('A taxa CDI anual deve ser não negativa e de até 1.000%.');
  }
  if (!Number.isFinite(input.cdiPercentage) || input.cdiPercentage < 0 || input.cdiPercentage > 500) {
    errors.push('O percentual do CDI deve estar entre 0% e 500%.');
  }
  const parsedDate = new Date(`${input.startDate}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.startDate)
    || Number.isNaN(parsedDate.getTime())
    || parsedDate.toISOString().slice(0, 10) !== input.startDate) {
    errors.push('Informe uma data inicial válida.');
  }
  if (!Object.hasOwn(INVESTMENTS, input.investment)) errors.push('Selecione um investimento válido.');
  return errors;
}

function effectiveAnnualRate(input: SimulationInput): number {
  switch (input.investment) {
    case 'cdb-cdi':
      return input.cdiAnnualRate * input.cdiPercentage / 100;
    case 'savings':
    case 'cdb-fixed':
    case 'tesouro-selic':
    case 'lci-lca':
      return input.annualRate;
  }
}

function isBusinessDay(date: Date): boolean {
  const weekday = date.getDay();
  return weekday !== 0 && weekday !== 6;
}

function taxesFor(
  input: SimulationInput,
  profit: number,
  holdingDays: number,
): { iof: number; incomeTax: number } {
  if (profit <= 0 || input.investment === 'savings') return { iof: 0, incomeTax: 0 };
  const iof = profit * iofRate(holdingDays);
  const taxableProfit = Math.max(0, profit - iof);
  const exempt = input.investment === 'lci-lca' && input.lciTaxExempt;
  const incomeTax = exempt ? 0 : taxableProfit * incomeTaxRate(holdingDays);
  return { iof, incomeTax };
}

export function simulateInvestment(input: SimulationInput): SimulationResult {
  const errors = validateSimulation(input);
  if (errors.length) throw new RangeError(errors.join(' '));

  const dailyRate = annualToDailyRate(effectiveAnnualRate(input), 252);
  const start = new Date(`${input.startDate}T12:00:00`);
  let balance = input.initialAmount;
  let contributed = input.initialAmount;
  const daily: DailyResult[] = [];

  for (let day = 1; day <= input.periodDays; day++) {
    const date = new Date(start);
    date.setDate(start.getDate() + day - 1);
    if (day > 1 && (day - 1) % 30 === 0 && input.monthlyContribution > 0) {
      balance += input.monthlyContribution;
      contributed += input.monthlyContribution;
    }
    const businessDay = isBusinessDay(date);
    if (businessDay && input.investment !== 'savings') balance *= 1 + dailyRate;
    if (input.investment === 'savings') {
      balance *= 1 + annualToDailyRate(effectiveAnnualRate(input), 365);
    }

    const grossProfit = Math.max(0, balance - contributed);
    const taxes = taxesFor(input, grossProfit, day);
    const netBalance = balance - taxes.iof - taxes.incomeTax;
    daily.push({
      day,
      date: date.toISOString().slice(0, 10),
      businessDay,
      balance,
      grossProfit,
      iof: taxes.iof,
      incomeTax: taxes.incomeTax,
      netBalance,
    });
  }

  const last = daily[daily.length - 1];
  const grossProfit = last.grossProfit;
  const iof = last.iof;
  const incomeTax = last.incomeTax;
  const netProfit = grossProfit - iof - incomeTax;
  return {
    input: { ...input },
    initialAmount: input.initialAmount,
    totalContributed: contributed,
    grossProfit,
    taxes: iof + incomeTax,
    iof,
    incomeTax,
    netProfit,
    finalBalance: last.netBalance,
    returnPercentage: contributed > 0 ? netProfit / contributed * 100 : 0,
    daily,
  };
}

export function compareInvestments(input: SimulationInput): SimulationResult[] {
  return (Object.keys(INVESTMENTS) as InvestmentType[]).map((investment) =>
    simulateInvestment({
      ...input,
      investment,
      annualRate: investment === 'cdb-fixed' ? 12 : investment === 'savings' ? 6
        : investment === 'lci-lca' ? 9 : investment === 'tesouro-selic' ? input.cdiAnnualRate : input.annualRate,
      cdiPercentage: investment === 'cdb-cdi' ? input.cdiPercentage : 100,
      lciTaxExempt: input.lciTaxExempt,
    }),
  );
}

export function dailySimulation(input: SimulationInput): DailyResult[] {
  return simulateInvestment(input).daily;
}
