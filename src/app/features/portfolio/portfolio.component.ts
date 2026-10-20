import { Component } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { InvestmentType, PortfolioAsset } from '../../core/models/finance.models';
import { LocalDataService } from '../../core/services/local-data.service';
import { INVESTMENTS } from '../../core/financial-engine/financial-engine';

@Component({
  selector: 'app-portfolio',
  imports: [FormsModule, CurrencyPipe, DecimalPipe, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <section class="page-heading"><span class="eyebrow">CARTEIRA VIRTUAL</span><h1>Organize uma carteira de aprendizado.</h1><p>Inclua ativos fictícios e visualize como os valores se distribuem. Nenhuma ordem ou conexão financeira é realizada.</p></section>
    <div class="portfolio-layout">
      <form class="panel form-panel portfolio-form" (ngSubmit)="addAsset()">
        <h2>Adicionar investimento</h2>
        <label class="field-label" for="assetName">Identificação</label><mat-form-field appearance="outline"><input matInput id="assetName" name="assetName" required maxlength="48" [(ngModel)]="name" placeholder="Ex.: Reserva simulada"></mat-form-field>
        <label class="field-label" for="assetType">Modalidade</label><mat-form-field appearance="outline"><mat-select id="assetType" name="assetType" [(ngModel)]="investment"><mat-option value="savings">Poupança</mat-option><mat-option value="cdb-fixed">CDB prefixado</mat-option><mat-option value="cdb-cdi">CDB percentual do CDI</mat-option><mat-option value="tesouro-selic">Tesouro Selic</mat-option><mat-option value="lci-lca">LCI / LCA</mat-option></mat-select></mat-form-field>
        <label class="field-label" for="assetAmount">Valor fictício (R$)</label><mat-form-field appearance="outline"><input matInput id="assetAmount" name="assetAmount" type="number" min="0.01" step="0.01" required [(ngModel)]="amount"></mat-form-field>
        @if (error) { <p class="error-message" role="alert">{{ error }}</p> }
        <button mat-flat-button color="primary" type="submit">Adicionar à carteira</button>
      </form>
      <section class="panel portfolio-summary">
        <div class="panel-heading"><div><span class="eyebrow">DISTRIBUIÇÃO FICTÍCIA</span><h2>Minha carteira</h2></div><span class="portfolio-total">{{ total() | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</span></div>
        @if (assets.length) {
          <div class="stacked-bar" role="img" aria-label="Distribuição percentual da carteira">
            @for (asset of assets; track asset.id; let i = $index) { <span [style.width.%]="share(asset)" [style.background]="color(i)" [attr.aria-label]="asset.name + ': ' + (share(asset) | number:'1.1-1') + '%'"></span> }
          </div>
          @for (asset of assets; track asset.id; let i = $index) {
            <div class="asset-row"><span class="asset-dot" [style.background]="color(i)"></span><div class="asset-info"><strong>{{ asset.name }}</strong><small>{{ investments[asset.investment].label }} · {{ share(asset) | number:'1.1-1':'pt-BR' }}%</small></div><strong>{{ asset.amount | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong><button mat-button type="button" class="remove-button" (click)="remove(asset.id)" [attr.aria-label]="'Remover ' + asset.name">Remover</button></div>
          }
          <p class="diversification-note"><strong>Diversificação é mais do que quantidade.</strong> Distribuir valores entre diferentes produtos pode reduzir algumas concentrações, mas não elimina riscos. Avalie emissores, prazos, liquidez, objetivos e características de cada ativo.</p>
        } @else {
          <div class="empty-state compact"><span class="empty-icon">＋</span><h3>Nenhum investimento cadastrado</h3><p>Adicione itens fictícios para visualizar sua distribuição. A carteira fica salva apenas neste navegador.</p></div>
        }
      </section>
    </div>
  `,
})
export class PortfolioComponent {
  assets: PortfolioAsset[];
  name = '';
  investment: InvestmentType = 'cdb-cdi';
  amount = 1000;
  error = '';
  readonly investments = INVESTMENTS;
  private readonly colors = ['#18806a', '#d4a654', '#647cc2', '#d17b66', '#8e69ab', '#57a4a2'];

  constructor(private readonly data: LocalDataService) { this.assets = [...data.portfolio()]; }

  total(): number { return this.assets.reduce((sum, asset) => sum + asset.amount, 0); }
  share(asset: PortfolioAsset): number { return this.total() ? asset.amount / this.total() * 100 : 0; }
  color(index: number): string { return this.colors[index % this.colors.length]; }

  addAsset(): void {
    this.error = '';
    const cleanName = this.name.trim();
    if (!cleanName) { this.error = 'Informe um nome para o investimento.'; return; }
    if (!Number.isFinite(this.amount) || this.amount <= 0) { this.error = 'O valor deve ser maior que zero.'; return; }
    const next = [...this.assets, { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name: cleanName, investment: this.investment, amount: this.amount }];
    try {
      this.data.savePortfolio(next);
      this.assets = next;
      this.name = '';
    } catch (error) {
      this.error = error instanceof Error ? `Não foi possível salvar a carteira: ${error.message}` : 'Não foi possível salvar a carteira neste navegador.';
    }
  }

  remove(id: string): void {
    const next = this.assets.filter((asset) => asset.id !== id);
    try {
      this.data.savePortfolio(next);
      this.assets = next;
      this.error = '';
    } catch (error) {
      this.error = error instanceof Error ? `Não foi possível atualizar a carteira: ${error.message}` : 'Não foi possível atualizar a carteira neste navegador.';
    }
  }
}
