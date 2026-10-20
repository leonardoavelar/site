import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LocalDataService } from '../../core/services/local-data.service';
import { INVESTMENTS } from '../../core/financial-engine/financial-engine';

@Component({
  selector: 'app-history',
  imports: [CurrencyPipe, DatePipe, MatButtonModule],
  template: `
    <section class="page-heading"><span class="eyebrow">SEUS DADOS, NO SEU NAVEGADOR</span><h1>Histórico de simulações.</h1><p>Reabra um cenário para continuar explorando ou remova registros que não precisa mais.</p></section>
    <div class="notice">As simulações são armazenadas localmente neste navegador; limpar os dados do navegador também as remove. Não guarde informações pessoais ou sensíveis.</div>
    @if (error) { <p class="error-message" role="alert">{{ error }}</p> }
    @if (data.history().length) {
      <section class="history-list">
        @for (saved of data.history(); track saved.id) {
          <article class="panel history-item">
            <div class="history-date"><span class="eyebrow">SALVA EM</span><strong>{{ saved.savedAt | date:'dd/MM/yyyy, HH:mm':'':'pt-BR' }}</strong></div>
            <div class="history-description"><h2>{{ investments[saved.result.input.investment].label }}</h2><p>{{ saved.result.initialAmount | currency:'BRL':'symbol':'1.2-2':'pt-BR' }} · {{ saved.result.input.periodDays }} dias · saldo final estimado {{ saved.result.finalBalance | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</p></div>
            <div class="history-actions"><button mat-stroked-button type="button" (click)="reopen(saved.result.input)">Reabrir</button><button mat-button type="button" class="remove-button" (click)="remove(saved.id)">Excluir</button></div>
          </article>
        }
      </section>
    } @else {
      <div class="panel empty-state"><span class="empty-icon">◷</span><h2>Seu histórico está vazio</h2><p>Calcule uma simulação e salve o resultado para encontrá-lo aqui.</p><button mat-flat-button color="primary" type="button" (click)="goToSimulator()">Ir para o simulador</button></div>
    }
  `,
})
export class HistoryComponent {
  readonly investments = INVESTMENTS;
  error = '';
  constructor(readonly data: LocalDataService, private readonly router: Router) {}

  reopen(input: Parameters<LocalDataService['saveSimulation']>[0]): void {
    this.data.draft.set({ ...input });
    void this.router.navigate(['/simulador']);
  }

  remove(id: string): void {
    this.error = '';
    try {
      this.data.removeSimulation(id);
    } catch (error) {
      this.error = error instanceof Error ? `Não foi possível excluir a simulação: ${error.message}` : 'Não foi possível excluir a simulação neste navegador.';
    }
  }
  goToSimulator(): void { void this.router.navigate(['/simulador']); }
}
