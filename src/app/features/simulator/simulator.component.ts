import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GrowthChartComponent } from '../../shared/components/growth-chart.component';
import { InvestmentType, SimulationInput, SimulationResult } from '../../core/models/finance.models';
import { DEFAULT_SIMULATION, LocalDataService } from '../../core/services/local-data.service';
import { INVESTMENTS, simulateInvestment, validateSimulation } from '../../core/financial-engine/financial-engine';

@Component({
  selector: 'app-simulator',
  imports: [FormsModule, CurrencyPipe, DatePipe, DecimalPipe, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, GrowthChartComponent],
  template: `
    <section class="page-heading">
      <span class="eyebrow">SIMULADOR FINANCEIRO</span>
      <h1>Explore cenários, entenda os resultados.</h1>
      <p>Altere os parâmetros para observar uma projeção educativa. Os valores não representam promessa de rendimento.</p>
    </section>
    <section class="example-callout">
      <div><span class="eyebrow">EXEMPLO DA ATIVIDADE</span><h2>R$ 100.000 em CDB por 30 dias</h2><p>Preencha automaticamente o cenário e veja a evolução diária, com estimativas de IOF e IR.</p></div>
      <button mat-flat-button color="primary" type="button" (click)="loadExample()">Carregar exemplo de 30 dias <span aria-hidden="true">→</span></button>
    </section>
    <div class="sim-layout">
      <form class="panel form-panel" (ngSubmit)="calculate()" #simulationForm="ngForm">
        <h2>Parâmetros da simulação</h2>
        <label class="field-label" for="initial">Valor inicial (R$)</label>
        <mat-form-field appearance="outline"><input matInput id="initial" name="initial" type="number" min="0.01" step="0.01" required [(ngModel)]="form.initialAmount"></mat-form-field>
        <label class="field-label" for="monthly">Aporte mensal opcional (R$)</label>
        <mat-form-field appearance="outline"><input matInput id="monthly" name="monthly" type="number" min="0" step="0.01" [(ngModel)]="form.monthlyContribution"></mat-form-field>
        <label class="field-label" for="investment">Tipo de investimento</label>
        <mat-form-field appearance="outline"><mat-select id="investment" name="investment" [(ngModel)]="form.investment"><mat-option value="savings">Poupança</mat-option><mat-option value="cdb-fixed">CDB prefixado</mat-option><mat-option value="cdb-cdi">CDB percentual do CDI</mat-option><mat-option value="tesouro-selic">Tesouro Selic (simplificado)</mat-option><mat-option value="lci-lca">LCI / LCA</mat-option></mat-select></mat-form-field>
        @if (form.investment === 'cdb-cdi') {
          <label class="field-label" for="cdi">CDI anual ilustrativo (%)</label><mat-form-field appearance="outline"><input matInput id="cdi" name="cdi" type="number" min="0" max="1000" step="0.01" [(ngModel)]="form.cdiAnnualRate"></mat-form-field>
          <label class="field-label" for="percentage">Percentual do CDI (%)</label><mat-form-field appearance="outline"><input matInput id="percentage" name="percentage" type="number" min="0" max="500" step="0.01" [(ngModel)]="form.cdiPercentage"></mat-form-field>
        } @else {
          <label class="field-label" for="rate">Rentabilidade anual (%)</label><mat-form-field appearance="outline"><input matInput id="rate" name="rate" type="number" min="0" max="1000" step="0.01" [(ngModel)]="form.annualRate"></mat-form-field>
        }
        @if (form.investment === 'lci-lca') {
          <label class="check-row"><input type="checkbox" name="exempt" [(ngModel)]="form.lciTaxExempt"> Simular isenção de IR (hipótese configurável)</label>
        }
        <div class="form-row">
          <div><label class="field-label" for="start">Data inicial</label><mat-form-field appearance="outline"><input matInput id="start" name="start" type="date" required [(ngModel)]="form.startDate"></mat-form-field></div>
          <div><label class="field-label" for="period">Prazo em dias</label><mat-form-field appearance="outline"><input matInput id="period" name="period" type="number" min="1" max="36500" required [(ngModel)]="form.periodDays"></mat-form-field></div>
        </div>
        @if (error) { <p class="error-message" role="alert">{{ error }}</p> }
        <button mat-flat-button color="primary" class="submit-button" type="submit">Calcular simulação</button>
      </form>
      <section class="results-column" aria-live="polite">
        @if (result) {
          <div class="result-grid">
            <article class="metric"><span>Valor inicial</span><strong>{{ result.initialAmount | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong></article>
            <article class="metric"><span>Total aportado</span><strong>{{ result.totalContributed | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong></article>
            <article class="metric"><span>Rendimento bruto</span><strong>{{ result.grossProfit | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong></article>
            <article class="metric"><span>Impostos estimados</span><strong>{{ result.taxes | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong></article>
            <article class="metric"><span>Rendimento líquido</span><strong class="positive">{{ result.netProfit | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong></article>
            <article class="metric metric-highlight"><span>Patrimônio final estimado</span><strong>{{ result.finalBalance | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong></article>
          </div>
          <article class="panel chart-panel"><div class="panel-heading"><div><span class="eyebrow">PROJEÇÃO EDUCATIVA</span><h2>Evolução do patrimônio</h2></div><span class="return-pill">{{ result.returnPercentage | number:'1.2-2':'pt-BR' }}% líquido</span></div>
            <app-growth-chart [values]="chartValues()" />
            <div class="chart-legend"><span>Taxa utilizada: {{ rateDescription() }}</span><span>Retorno líquido estimado</span></div>
            <button mat-stroked-button type="button" (click)="save()" [disabled]="saved"> {{ saved ? 'Simulação salva no histórico' : 'Salvar no histórico' }} </button>
          </article>
          <div class="notice assumptions"><strong>Convenções:</strong> capitalização composta em dias úteis (252 dias/ano), sem feriados; poupança simplificada em dias corridos (365 dias/ano). Aportes adicionados a cada 30 dias. O saldo diário é arredondado apenas na exibição. IR e IOF estimados sobre o ganho total no resgate, pelas tabelas regressivas configuradas. Não considera taxas, custos, marcação a mercado ou regras particulares do produto. CDI ilustrativo, não oficial.</div>
          <article class="panel table-panel">
            <div class="panel-heading"><div><span class="eyebrow">DETALHAMENTO</span><h2>Evolução dia a dia</h2></div><span class="subtle">Dia corrido e indicação de dia útil</span></div>
            <div class="table-scroll"><table><thead><tr><th>Dia</th><th>Data</th><th>Classificação</th><th>Saldo bruto</th><th>Ganho bruto</th><th>IOF estimado</th><th>IR estimado</th><th>Resgate líquido</th></tr></thead><tbody>
              @for (day of result.daily; track day.day) { <tr><td>{{ day.day }}</td><td>{{ day.date | date:'dd/MM/yyyy':'':'pt-BR' }}</td><td>{{ day.businessDay ? 'Útil*' : 'Não útil' }}</td><td>{{ day.balance | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</td><td>{{ day.grossProfit | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</td><td>{{ day.iof | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</td><td>{{ day.incomeTax | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</td><td>{{ day.netBalance | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</td></tr> }
            </tbody></table></div>
            <p class="table-note">*Dia útil considera apenas segunda a sexta; feriados não são descontados. Dias corridos contam sábados, domingos e feriados.</p>
          </article>
        } @else {
          <div class="empty-state panel"><span class="empty-icon">↗</span><h2>Sua simulação aparece aqui</h2><p>Informe os parâmetros ao lado ou carregue o exemplo de R$ 100.000 em CDB por 30 dias.</p></div>
        }
      </section>
    </div>
  `,
})
export class SimulatorComponent {
  form: SimulationInput;
  result: SimulationResult | null = null;
  error = '';
  saved = false;
  readonly investments = INVESTMENTS;

  constructor(private readonly data: LocalDataService) {
    this.form = { ...DEFAULT_SIMULATION, ...(data.draft() ?? {}) };
    data.draft.set(null);
    this.calculate();
  }

  calculate(): void {
    this.error = '';
    this.saved = false;
    const errors = validateSimulation(this.form);
    if (errors.length) {
      this.result = null;
      this.error = errors.join(' ');
      return;
    }
    try {
      this.result = simulateInvestment(this.form);
    } catch (error) {
      this.result = null;
      this.error = error instanceof Error ? error.message : 'Não foi possível calcular esta simulação.';
    }
  }

  loadExample(): void {
    this.form = {
      initialAmount: 100000,
      monthlyContribution: 0,
      investment: 'cdb-cdi',
      annualRate: 12,
      cdiAnnualRate: 10.65,
      cdiPercentage: 100,
      startDate: new Date().toISOString().slice(0, 10),
      periodDays: 30,
      lciTaxExempt: true,
    };
    this.calculate();
  }

  chartValues(): number[] {
    return this.result ? [this.result.totalContributed, ...this.result.daily.map((item) => item.netBalance)] : [];
  }

  rateDescription(): string {
    if (this.form.investment === 'cdb-cdi') {
      return `${this.form.cdiPercentage}% do CDI (${this.form.cdiAnnualRate}% a.a. ilustrativo)`;
    }
    return `${this.form.annualRate}% a.a. ilustrativo`;
  }

  save(): void {
    if (!this.result) return;
    try {
      this.data.saveSimulation(this.form);
      this.saved = true;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Não foi possível salvar a simulação.';
    }
  }
}
