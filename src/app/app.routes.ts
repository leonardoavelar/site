import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: 'inicio', loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent), title: 'Início | Faça Seu Dinheiro Render' },
  { path: 'educacao', loadComponent: () => import('./features/education/education.component').then((m) => m.EducationComponent), title: 'Aprenda | Faça Seu Dinheiro Render' },
  { path: 'simulador', loadComponent: () => import('./features/simulator/simulator.component').then((m) => m.SimulatorComponent), title: 'Simulador | Faça Seu Dinheiro Render' },
  { path: 'comparador', loadComponent: () => import('./features/comparison/comparison.component').then((m) => m.ComparisonComponent), title: 'Comparador | Faça Seu Dinheiro Render' },
  { path: 'carteira', loadComponent: () => import('./features/portfolio/portfolio.component').then((m) => m.PortfolioComponent), title: 'Carteira virtual | Faça Seu Dinheiro Render' },
  { path: 'historico', loadComponent: () => import('./features/history/history.component').then((m) => m.HistoryComponent), title: 'Histórico | Faça Seu Dinheiro Render' },
  { path: '**', redirectTo: 'inicio' },
];
