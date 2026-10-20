import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { SimulationInput, SimulationResult } from '../../core/models/finance.models';
import { DEFAULT_SIMULATION } from '../../core/services/local-data.service';
import { INVESTMENTS, compareInvestments } from '../../core/financial-engine/financial-engine';

@Component({
  selector: 'app-comparison',
  imports: [FormsModule, CurrencyPipe, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <section class="page-heading"><span class="eyebrow">COMPARADOR</span><h1>Compare cenários lado a lado.</h1><p>Use o mesmo valor inicial e prazo para observar diferenças de rendimento, tributação, liquidez e risco.</p></section>
    <form class="panel comparison-controls" (ngSubmit)="compare()">
      <div><label class="field-label" for="amount">Capital inicial (R$)</label><mat-form-field appearance="outline"><input matInput id="amount" name="amount" type="number" min="1" [(ngModel)]="input.initialAmount"></mat-form-field></div>
      <div><label class="field-label" for="days">Prazo (dias)</label><mat-form-field appearance="outline"><input matInput id="days" name="days" type="number" min="1" max="36500" [(ngModel)]="input.periodDays"></mat-form-field></div>
      <div><label class="field-label" for="cdiRate">CDI anual ilustrativo (%)</label><mat-form-field appearance="outline"><input matInput id="cdiRate" name="cdiRate" type="number" min="0" max="1000" step="0.01" [(ngModel)]="input.cdiAnnualRate"></mat-form-field></div>
      <div><label class="field-label" for="cdiPercent">CDB (% do CDI)</label><mat-form-field appearance="outline"><input matInput id="cdiPercent" name="cdiPercent" type="number" min="0" max="500" [(ngModel)]="input.cdiPercentage"></mat-form-field></div>
      <button mat-flat-button color="primary" type="submit">Atualizar comparação</button>
    </form>
    @if (error) { <p class="error-message" role="alert">{{ error }}</p> }
    @if (results.length) {
      <section class="panel comparison-chart"><div class="panel-heading"><div><span class="eyebrow">VALORES FINAIS ESTIMADOS</span><h2>Uma comparação, não um ranking</h2></div><span class="subtle">Mesmo capital e prazo</span></div>
        <div class="bar-chart">@for (item of results; track item.input.investment) {<div class="bar-row"><span>{{ investments[item.input.investment].label }}</span><div class="bar-track"><div class="bar-fill" [style.width.%]="barWidth(item)"></div></div><strong>{{ item.finalBalance | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong></div>}</div>
      </section>
      <section class="comparison-grid">
        @for (item of results; track item.input.investment) {
          <article class="panel comparison-card">
            <span class="eyebrow">{{ investments[item.input.investment].liquidity }}</span>
            <h2>{{ investments[item.input.investment].label }}</h2>
            <p class="comparison-final">{{ item.finalBalance | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</p>
            <span class="subtle">Patrimônio final estimado</span>
            <dl>
              <div><dt>Taxa utilizada</dt><dd>{{ rateText(item) }}</dd></div>
              <div><dt>Rendimento bruto</dt><dd>{{ item.grossProfit | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</dd></div>
              <div><dt>Impostos estimados</dt><dd>{{ item.taxes | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</dd></div>
              <div><dt>Rendimento líquido</dt><dd>{{ item.netProfit | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</dd></div>
              <div><dt>Risco indicativo</dt><dd>{{ investments[item.input.investment].risk }}</dd></div>
              <div><dt>Liquidez indicativa</dt><dd>{{ investments[item.input.investment].liquidity }}</dd></div>
            </dl>
          </article>
        }
      </section>
      <p class="notice">As taxas das modalidades são hipóteses ilustrativas para comparação educacional, não cotações atuais. Custos, regras contratuais, feriados, oscilação de preços e elegibilidade de garantias não estão integralmente modelados. Um resultado maior nesta projeção não significa que seja a melhor opção para todas as pessoas.</p>
    }
  `,
})
export class ComparisonComponent {
  input: SimulationInput = { ...DEFAULT_SIMULATION, initialAmount: 10000, periodDays: 365 };
  results: SimulationResult[] = [];
  error = '';
  readonly investments = INVESTMENTS;

  constructor() { this.compare(); }

  compare(): void {
    this.error = '';
    try {
      this.results = compareInvestments(this.input);
    } catch (error) {
      this.results = [];
      this.error = error instanceof Error ? error.message : 'Não foi possível comparar os investimentos.';
    }
  }

  barWidth(item: SimulationResult): number {
    const max = Math.max(...this.results.map((result) => result.finalBalance), 1);
    return item.finalBalance / max * 100;
  }

  rateText(item: SimulationResult): string {
    return item.input.investment === 'cdb-cdi'
      ? `${item.input.cdiPercentage}% do CDI (${item.input.cdiAnnualRate}% a.a. ilustrativo)`
      : `${item.input.annualRate}% a.a. ilustrativo`;
  }
}
