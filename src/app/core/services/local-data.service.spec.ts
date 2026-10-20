import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LocalDataService } from './local-data.service';

describe('LocalDataService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
  });

  it('saves, lists, reopens from persisted JSON and removes a simulation', () => {
    const service = TestBed.inject(LocalDataService);
    const saved = service.saveSimulation({
      initialAmount: 1000,
      monthlyContribution: 0,
      investment: 'cdb-fixed',
      annualRate: 12,
      cdiAnnualRate: 10.65,
      cdiPercentage: 100,
      startDate: '2026-01-05',
      periodDays: 30,
      lciTaxExempt: true,
    });
    expect(service.history()).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem('fdr.simulations.v1') ?? '[]')).toHaveLength(1);
    expect(service.history()[0].result.input.investment).toBe('cdb-fixed');

    service.removeSimulation(saved.id);
    expect(service.history()).toHaveLength(0);
    expect(JSON.parse(localStorage.getItem('fdr.simulations.v1') ?? '[]')).toHaveLength(0);
  });

  it('rejects invalid simulations before they are persisted', () => {
    const service = TestBed.inject(LocalDataService);
    expect(() => service.saveSimulation({
      initialAmount: 0,
      monthlyContribution: 0,
      investment: 'cdb-fixed',
      annualRate: 12,
      cdiAnnualRate: 10.65,
      cdiPercentage: 100,
      startDate: '2026-01-05',
      periodDays: 30,
      lciTaxExempt: true,
    })).toThrow(RangeError);
    expect(service.history()).toHaveLength(0);
  });
});
