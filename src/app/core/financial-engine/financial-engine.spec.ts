import {
  annualToDailyRate,
  compoundInterest,
  incomeTaxRate,
  iofRate,
  simulateInvestment,
  validateSimulation,
} from './financial-engine';
import { SimulationInput } from '../models/finance.models';

const validInput: SimulationInput = {
  initialAmount: 100000,
  monthlyContribution: 0,
  investment: 'cdb-cdi',
  annualRate: 12,
  cdiAnnualRate: 10.65,
  cdiPercentage: 100,
  startDate: '2026-01-05',
  periodDays: 30,
  lciTaxExempt: true,
};

describe('financial engine', () => {
  it('converts an effective annual rate to a daily compound rate', () => {
    const dailyRate = annualToDailyRate(10);
    expect(Math.pow(1 + dailyRate, 252)).toBeCloseTo(1.1, 10);
  });

  it('calculates compound interest over the requested business days', () => {
    expect(compoundInterest(1000, 10, 252)).toBeCloseTo(1100, 8);
  });

  it('applies the income-tax brackets at their boundaries', () => {
    expect(incomeTaxRate(180)).toBe(0.225);
    expect(incomeTaxRate(181)).toBe(0.2);
    expect(incomeTaxRate(361)).toBe(0.175);
    expect(incomeTaxRate(721)).toBe(0.15);
  });

  it('uses the regressive IOF schedule through day 29 and zero from day 30', () => {
    expect(iofRate(1)).toBe(0.96);
    expect(iofRate(15)).toBe(0.5);
    expect(iofRate(29)).toBe(0.03);
    expect(iofRate(30)).toBe(0);
  });

  it('produces 30 individual calendar days and computes net redemption taxes', () => {
    const result = simulateInvestment(validInput);
    expect(result.daily).toHaveLength(30);
    expect(result.totalContributed).toBe(100000);
    expect(result.grossProfit).toBeGreaterThan(0);
    expect(result.iof).toBe(0);
    expect(result.incomeTax).toBeGreaterThan(0);
    expect(result.finalBalance).toBeCloseTo(100000 + result.netProfit, 6);
    expect(result.daily[0].businessDay).toBe(true);
    expect(result.daily[5].businessDay).toBe(false);
  });

  it('calculates short-term IOF and IR using the net gain', () => {
    const result = simulateInvestment({ ...validInput, periodDays: 10 });
    expect(result.iof).toBeGreaterThan(0);
    expect(result.incomeTax).toBeCloseTo((result.grossProfit - result.iof) * 0.225, 8);
  });

  it('reports invalid simulation inputs instead of calculating them', () => {
    const errors = validateSimulation({ ...validInput, initialAmount: 0, periodDays: 0 });
    expect(errors).toContain('O valor inicial deve ser maior que zero.');
    expect(errors).toContain('O prazo deve ser de 1 a 36.500 dias.');
    expect(() => simulateInvestment({ ...validInput, periodDays: 0 })).toThrow(RangeError);
  });
});
