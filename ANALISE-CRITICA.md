# Análise crítica — Faça Seu Dinheiro Render

## Objetivo

O projeto oferece um ambiente didático para introduzir investimentos no Brasil. A pessoa usuária pode aprender conceitos, testar cenários hipotéticos, observar uma estimativa de tributação, comparar modalidades e organizar uma carteira fictícia sem acessar instituições financeiras.

## Justificativa das tecnologias

Angular com componentes standalone e roteamento organiza a aplicação por funcionalidades e mantém cada página separada. TypeScript strict ajuda a detectar incompatibilidades entre parâmetros, modelos e resultados. Signals tornam o estado local de histórico e carteira reativo sem exigir uma camada de estado adicional. SCSS permite uma linguagem visual compartilhada e adaptável a telas pequenas. Angular Material fornece controles acessíveis e consistentes. O motor financeiro TypeScript é isolado da interface, facilitando testes e eventual reutilização em uma aplicação Capacitor.

## Funcionalidades desenvolvidas

- Página inicial com introdução, acesso ao simulador/comparador e conteúdo sobre reserva de emergência.
- Conteúdo educativo com 12 temas, exemplos, vantagens e pontos de atenção, sem recomendação personalizada.
- Simulador com cinco modalidades, aportes, taxas configuráveis, evolução diária, gráfico, impostos estimados e exemplo de R$ 100.000 em CDB por 30 dias.
- Comparador com capital e prazo comuns, taxas, retorno bruto/líquido, tributos e atributos qualitativos.
- Carteira fictícia com cálculo percentual, visualização de distribuição e persistência local.
- Histórico local com listagem, reabertura e exclusão de simulações.
- Navegação responsiva, formulários com validação e documentação de execução, hipóteses e preparação Android.

## Benefícios educacionais

A evolução dia a dia ajuda a diferenciar dias corridos de úteis; a estimativa líquida evidencia o efeito da tributação; o comparador mostra que liquidez, risco e imposto também importam; e os textos explicam que taxas elevadas não eliminam risco. A possibilidade de alterar hipóteses favorece aprendizagem exploratória, enquanto o aviso de taxas ilustrativas evita confundir uma projeção com uma cotação.

## Dificuldades e limitações

Produtos financeiros têm regras, calendários, taxas, custos e tributação específicos, que podem mudar. Para manter a aplicação offline e sem afirmar dados atuais, CDI e taxas de produtos são hipóteses informadas como ilustrativas. O modelo de 252 dias úteis não considera feriados; o Tesouro Selic usa CDI como aproximação; a poupança recebe uma taxa anual simplificada. A tributação é estimada sobre o ganho total como se houvesse um único lote, portanto aportes feitos em datas diferentes não reproduzem a apuração real. Também não são calculadas taxas de custódia, spreads, marcação a mercado ou condições particulares de contratos. LocalStorage não é sincronizado nem adequado para informações sensíveis.

## Possíveis melhorias

- Integrar fontes oficiais de taxas e índices com data, origem, atualização e tratamento de indisponibilidade.
- Implementar calendários de feriados, lotes de aportes, custos, regras por produto e validação dos modelos com especialistas tributários.
- Adicionar cenários de inflação e retorno real, exportação acessível de resultados e opção para apagar todos os dados locais.
- Ampliar testes de interface, acessibilidade automatizada e cobertura em navegadores/dispositivos reais.
- Integrar Capacitor apenas após validar navegação, armazenamento, políticas de privacidade e fluxos Android.

## Conclusão

A aplicação transforma conceitos financeiros em uma experiência interativa e local, com separação entre interface, estado e cálculos. O principal valor é educacional: tornar premissas e riscos visíveis, não prever rendimentos ou escolher investimentos pela pessoa usuária. Antes de uso para decisões reais, seria necessário validar cada regra financeira e tributária, bem como substituir as taxas ilustrativas por fontes confiáveis claramente identificadas.
