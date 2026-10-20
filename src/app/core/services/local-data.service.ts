import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  InvestmentType,
  PortfolioAsset,
  SavedSimulation,
  SimulationInput,
} from '../models/finance.models';
import { INVESTMENTS, simulateInvestment, validateSimulation } from '../financial-engine/financial-engine';

const HISTORY_KEY = 'fdr.simulations.v1';
const PORTFOLIO_KEY = 'fdr.portfolio.v1';

export const DEFAULT_SIMULATION: SimulationInput = {
  initialAmount: 10000,
  monthlyContribution: 0,
  investment: 'cdb-cdi',
  annualRate: 12,
  cdiAnnualRate: 10.65,
  cdiPercentage: 100,
  startDate: new Date().toISOString().slice(0, 10),
  periodDays: 365,
  lciTaxExempt: true,
};

@Injectable({ providedIn: 'root' })
export class LocalDataService {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly history = signal<SavedSimulation[]>(this.read<SavedSimulation[]>(HISTORY_KEY, []));
  readonly portfolio = signal<PortfolioAsset[]>(this.read<PortfolioAsset[]>(PORTFOLIO_KEY, []));
  readonly draft = signal<SimulationInput | null>(null);

  saveSimulation(input: SimulationInput): SavedSimulation {
    const errors = validateSimulation(input);
    if (errors.length) throw new RangeError(errors.join(' '));
    const saved: SavedSimulation = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      savedAt: new Date().toISOString(),
      result: simulateInvestment(input),
    };
    const next = [saved, ...this.history()];
    this.write(HISTORY_KEY, next);
    this.history.set(next);
    return saved;
  }

  removeSimulation(id: string): void {
    const next = this.history().filter((item) => item.id !== id);
    this.write(HISTORY_KEY, next);
    this.history.set(next);
  }

  savePortfolio(assets: PortfolioAsset[]): void {
    this.write(PORTFOLIO_KEY, assets);
    this.portfolio.set(assets);
  }

  investmentLabel(investment: InvestmentType): string {
    return INVESTMENTS[investment].label;
  }

  private read<T>(key: string, fallback: T): T {
    if (!this.browser) return fallback;
    let raw: string | null;
    try {
      raw = localStorage.getItem(key);
    } catch (error) {
      console.error(`Não foi possível ler ${key} do armazenamento local.`, error);
      return fallback;
    }
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      console.warn(`Os dados armazenados em ${key} estão inválidos e foram descartados.`, error);
      localStorage.removeItem(key);
      return fallback;
    }
  }

  private write(key: string, value: unknown): void {
    if (this.browser) localStorage.setItem(key, JSON.stringify(value));
  }
}
