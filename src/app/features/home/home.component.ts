import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">EDUCAÇÃO FINANCEIRA, NA PRÁTICA</span>
        <h1>Seu próximo passo financeiro começa com <em>conhecimento.</em></h1>
        <p>Aprenda como os investimentos funcionam, compare cenários e simule o crescimento do seu dinheiro — com transparência sobre riscos e impostos.</p>
        <div class="hero-actions">
          <a class="button button-primary" routerLink="/simulador">Começar uma simulação <span aria-hidden="true">→</span></a>
          <a class="button button-light" routerLink="/comparador">Comparar investimentos</a>
        </div>
        <small>Simulações educativas. Rentabilidades não são garantidas.</small>
      </div>
      <div class="hero-art" aria-label="Ilustração de crescimento financeiro">
        <div class="art-label">UM PASSO DE CADA VEZ</div>
        <div class="art-amount">R$ <strong>10.000</strong></div>
        <svg viewBox="0 0 360 180" role="img" aria-label="Linha ilustrativa de crescimento"><path d="M8 155 C 60 138, 68 126, 110 132 S 163 82, 208 100 S 260 39, 294 56 S 327 24, 352 10" /><path class="chart-fill" d="M8 155 C60 138 68 126 110 132 S163 82 208 100 S260 39 294 56 S327 24 352 10 V180 H8Z" /></svg>
        <div class="art-caption"><span>Comece pelo básico</span><span>Conhecimento cresce</span></div>
      </div>
    </section>
    <section class="section home-intro">
      <div>
        <span class="eyebrow">POR QUE INVESTIR?</span>
        <h2>Não é sobre enriquecer rápido.<br>É sobre construir possibilidades.</h2>
      </div>
      <p>Investir é direcionar recursos para objetivos futuros. Com informação, tempo e escolhas compatíveis com sua realidade, você pode buscar proteger o poder de compra e planejar projetos. Todo investimento envolve riscos — entender cada um deles faz parte do aprendizado.</p>
    </section>
    <section class="feature-grid" aria-label="Recursos do aplicativo">
      <a class="feature-card" routerLink="/educacao"><span class="feature-icon">01</span><h3>Aprenda sem complicação</h3><p>Conheça produtos, conceitos, riscos, liquidez e tributação com exemplos didáticos.</p><span class="text-link">Explorar conteúdos →</span></a>
      <a class="feature-card featured" routerLink="/simulador"><span class="feature-icon">02</span><h3>Simule cenários</h3><p>Entenda como prazos, aportes e taxas podem afetar o resultado estimado.</p><span class="text-link">Abrir simulador →</span></a>
      <a class="feature-card" routerLink="/carteira"><span class="feature-icon">03</span><h3>Organize sua carteira</h3><p>Monte uma carteira fictícia e visualize a distribuição dos valores.</p><span class="text-link">Montar carteira →</span></a>
    </section>
    <section class="emergency-banner">
      <div><span class="eyebrow">ANTES DE INVESTIR</span><h2>Conheça a reserva de emergência</h2><p>Uma reserva para imprevistos costuma priorizar acesso ao dinheiro e estabilidade. O tamanho e o local adequado dependem da situação de cada pessoa. Compare liquidez, riscos e custos antes de decidir.</p></div>
      <a class="button button-dark" routerLink="/educacao">Entender o conceito <span aria-hidden="true">→</span></a>
    </section>
    <p class="disclaimer">As taxas e resultados demonstrados nesta aplicação são hipotéticos e servem apenas para fins educacionais. Não constituem aconselhamento financeiro, tributário ou recomendação de investimento.</p>
  `,
})
export class HomeComponent {}
