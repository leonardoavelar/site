import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-growth-chart',
  template: `
    <div class="chart-frame">
      <svg viewBox="0 0 720 220" role="img" [attr.aria-label]="ariaLabel">
        <line x1="42" y1="20" x2="42" y2="184" class="chart-axis" />
        <line x1="42" y1="184" x2="700" y2="184" class="chart-axis" />
        <line x1="42" y1="130" x2="700" y2="130" class="chart-grid" />
        <line x1="42" y1="75" x2="700" y2="75" class="chart-grid" />
        <polyline [attr.points]="chartPoints()" class="chart-line" />
        <text x="42" y="208" class="chart-label">Início</text>
        <text x="700" y="208" text-anchor="end" class="chart-label">Final do período</text>
      </svg>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .chart-frame { width: 100%; overflow: hidden; }
    svg { display: block; width: 100%; min-width: 300px; }
    .chart-axis { stroke: #dce4df; stroke-width: 1.5; }
    .chart-grid { stroke: #edf1ee; stroke-dasharray: 4 6; }
    .chart-line { fill: none; stroke: #18806a; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; }
    .chart-label { fill: #7b8982; font-size: 12px; }
  `],
})
export class GrowthChartComponent {
  @Input() values: number[] = [];
  @Input() ariaLabel = 'Evolução do patrimônio simulado';

  chartPoints(): string {
    if (!this.values.length) return '42,184 700,184';
    const min = Math.min(...this.values);
    const max = Math.max(...this.values);
    const spread = max - min || 1;
    return this.values.map((value, index) => {
      const x = 42 + (this.values.length === 1 ? 658 : index * 658 / (this.values.length - 1));
      const y = 184 - (value - min) / spread * 145;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }
}
