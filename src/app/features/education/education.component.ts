import { Component } from '@angular/core';

interface Topic {
  category: string;
  title: string;
  description: string;
  example: string;
  advantages: string;
  cautions: string;
}

@Component({
  selector: 'app-education',
  template: `
    <section class="page-heading">
      <span class="eyebrow">GUIA DE EDUCAÇÃO FINANCEIRA</span>
      <h1>Aprenda antes de investir.</h1>
      <p>Conceitos explicados de forma simples para você compreender possibilidades, riscos e limites de cada modalidade.</p>
    </section>
    <div class="notice"><strong>Importante:</strong> conteúdo educativo geral, não personalizado. Produtos, garantias e regras podem mudar; consulte as condições oficiais antes de tomar decisões.</div>
    <section class="education-grid">
      @for (topic of topics; track topic.title) {
        <article class="education-card">
          <span class="eyebrow">{{ topic.category }}</span>
          <h2>{{ topic.title }}</h2>
          <p>{{ topic.description }}</p>
          <div class="example-box"><strong>Exemplo didático</strong><span>{{ topic.example }}</span></div>
          <div class="pros-cons"><p><strong>Possível vantagem:</strong> {{ topic.advantages }}</p><p><strong>Ponto de atenção:</strong> {{ topic.cautions }}</p></div>
        </article>
      }
    </section>
  `,
})
export class EducationComponent {
  readonly topics: Topic[] = [
    { category: 'FUNDAMENTOS', title: 'O que são investimentos?', description: 'Investir é aplicar recursos em ativos ou projetos com a expectativa de obter benefícios no futuro, aceitando riscos e incertezas.', example: 'Ao comprar um título, você empresta recursos ao emissor conforme regras e prazo definidos.', advantages: 'Planejar objetivos e buscar retorno ao longo do tempo.', cautions: 'Retorno passado não garante retorno futuro; pode haver perdas.' },
    { category: 'FUNDAMENTOS', title: 'Renda fixa e renda variável', description: 'Na renda fixa, as regras de remuneração são definidas na contratação. Na renda variável, o retorno não é predefinido e pode oscilar.', example: 'Um CDB pode pagar uma taxa definida; uma ação varia conforme mercado e empresa.', advantages: 'Modalidades diferentes podem atender a objetivos e tolerâncias distintas.', cautions: 'Renda fixa também tem riscos; renda variável pode perder valor.' },
    { category: 'FUNDAMENTOS', title: 'Risco, liquidez e rentabilidade', description: 'Risco é a possibilidade de resultados diferentes do esperado; liquidez é a facilidade de converter em dinheiro; rentabilidade mede o retorno.', example: 'Um investimento pode render mais, mas exigir prazo longo para resgate.', advantages: 'Avaliar os três fatores ajuda a entender as características do produto.', cautions: 'Não existe garantia de que maior risco resultará em maior retorno.' },
    { category: 'FUNDAMENTOS', title: 'Inflação e poder de compra', description: 'A inflação representa a elevação geral dos preços. Se o dinheiro rende menos do que os preços sobem, o poder de compra diminui.', example: 'Com inflação hipotética de 5%, algo que custa R$ 100 poderia custar R$ 105 após um ano.', advantages: 'Comparar retorno real ajuda a avaliar o poder de compra.', cautions: 'Inflação futura é incerta e varia conforme índices e cesta de consumo.' },
    { category: 'PLANEJAMENTO', title: 'Reserva de emergência', description: 'É uma quantia separada para imprevistos. Em geral, o planejamento considera estabilidade e acesso rápido, de acordo com necessidades pessoais.', example: 'Uma despesa inesperada pode ser coberta sem precisar vender um ativo de longo prazo.', advantages: 'Pode reduzir a necessidade de crédito caro em situações urgentes.', cautions: 'O valor necessário varia; liquidez, segurança e custos devem ser examinados.' },
    { category: 'FUNDAMENTOS', title: 'Juros simples e compostos', description: 'Nos juros simples, o cálculo incide sobre o principal. Nos compostos, os juros acumulados também passam a render, no modelo de capitalização.', example: 'R$ 1.000 a 1% ao mês: simples soma R$ 10 por mês; composto calcula sobre o saldo atualizado.', advantages: 'Entender a capitalização ajuda a interpretar projeções de prazo.', cautions: 'Simulações constantes simplificam taxas, impostos e condições reais.' },
    { category: 'RENDA FIXA', title: 'Poupança', description: 'Modalidade de depósito bancário com remuneração determinada por regras legais que dependem de condições econômicas.', example: 'O rendimento é creditado conforme a data de aniversário da aplicação.', advantages: 'É simples de entender e pode ter resgate acessível conforme regras aplicáveis.', cautions: 'A remuneração pode ficar abaixo da inflação; há risco da instituição e regras específicas.' },
    { category: 'RENDA FIXA', title: 'CDB', description: 'Certificado de Depósito Bancário: título emitido por banco. Pode ser prefixado, pós-fixado (por exemplo, percentual do CDI) ou híbrido.', example: 'Um CDB de 100% do CDI acompanha o CDI conforme condições e período de aplicação.', advantages: 'Há diferentes prazos, indexadores e condições de liquidez.', cautions: 'Pode haver IR e IOF; risco de crédito do emissor e cobertura do FGC têm limites e regras.' },
    { category: 'RENDA FIXA', title: 'Tesouro Direto', description: 'Programa de negociação de títulos públicos federais. O Tesouro Selic acompanha a taxa Selic; preços e regras de resgate variam por título.', example: 'No Tesouro Selic, a remuneração acompanha a taxa e o preço pode oscilar antes do vencimento.', advantages: 'Acesso a títulos públicos com diferentes objetivos e prazos.', cautions: 'Há tributação, custos e risco de oscilação de preço; liquidez segue regras do programa.' },
    { category: 'RENDA FIXA', title: 'LCI e LCA', description: 'Letras de Crédito Imobiliário e do Agronegócio são títulos emitidos por instituições financeiras ligados a esses setores.', example: 'Uma letra pode remunerar por taxa prefixada ou percentual de um índice.', advantages: 'Podem ter tratamento tributário específico para pessoa física conforme legislação vigente.', cautions: 'Carência, prazo, liquidez e risco de crédito devem ser avaliados; regras podem mudar.' },
    { category: 'FUNDOS', title: 'Fundos de investimento', description: 'Veículos que reúnem recursos de investidores e seguem uma política definida, administrados por prestadores de serviço.', example: 'Um fundo pode investir em títulos, ações ou diferentes classes de ativos.', advantages: 'Gestão profissional e acesso a uma carteira diversificada conforme regulamento.', cautions: 'Taxas, tributação, riscos, prazos de cotização e resgate variam entre fundos.' },
    { category: 'RENDA VARIÁVEL', title: 'Ações', description: 'Uma ação representa uma fração do capital de uma companhia. Seu preço varia no mercado e pode haver distribuição de proventos.', example: 'O preço de uma ação pode subir ou cair conforme expectativas e resultados da empresa.', advantages: 'Possibilidade de participar dos resultados e crescimento de empresas.', cautions: 'Há volatilidade e possibilidade de perda significativa, inclusive do capital investido.' },
  ];
}
