# Faça Seu Dinheiro Render

Aplicação web de educação financeira desenvolvida em Angular e TypeScript. Ensina conceitos de investimentos no Brasil e permite explorar simulações hipotéticas, comparar produtos e organizar uma carteira fictícia. O aplicativo roda no navegador, sem backend e sem integração com bancos ou corretoras.

> **Aviso:** finalidade exclusivamente educativa. Taxas são ilustrativas, resultados não são garantidos e o aplicativo não fornece recomendações personalizadas. Consulte as regras e documentos oficiais dos produtos antes de tomar decisões.

## Tecnologias

- Angular 22, componentes standalone, Angular Router e Angular Signals.
- TypeScript em modo strict e SCSS.
- Angular Material para controles de interface.
- Vitest, Angular CLI e navegador simulado para testes.
- LocalStorage para histórico e carteira locais; gráficos SVG/CSS sem envio de dados a terceiros.

## Pré-requisitos

- Node.js 24 LTS (ou versão aceita pelo Angular CLI 22: Node.js 20.19+, 22.12+ ou 24+).
- npm 11 (o gerenciador npm incluído nas versões compatíveis do Node.js também pode ser usado).
- VS Code é recomendado para editar; Android Studio é **desnecessário** para executar a versão web.

## Instalação e execução

No PowerShell, abra esta pasta no VS Code e execute:

```powershell
npm install
npm start
```

Abra [http://localhost:4200](http://localhost:4200) no navegador do próprio computador. O servidor de desenvolvimento escuta somente `127.0.0.1` por padrão.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm start` | Servidor Angular local em `http://localhost:4200`. |
| `npm run build` | Build otimizado de produção em `dist/fazer-seu-dinheiro-render/browser`. |
| `npm run build:html` | Gera um único HTML offline em `dist/offline/site.html`. |
| `npm test` | Executa uma vez os testes unitários pelo Angular CLI/Vitest. |
| `npm run watch` | Recompila continuamente em modo de desenvolvimento. |

## Distribuir como um único arquivo HTML

```powershell
npm run build:html
```

O arquivo gerado em `dist\offline\site.html` pode ser copiado, renomeado e aberto
diretamente com dois cliques, sem servidor, internet, Node.js ou instalação do
Angular no computador de destino. Apenas esse arquivo precisa ser distribuído.

O projeto continua em Angular: o HTML inclui o JavaScript compilado do aplicativo
e do Angular, as páginas carregadas sob demanda, os estilos, o favicon e os avisos
de licenças. Não se trata de uma conversão para HTML estático sem JavaScript.
Node.js e as dependências do projeto são necessários apenas para gerar o arquivo.

A exportação usa rotas com `#` (por exemplo, `site.html#/simulador`) para funcionar
via `file://`. O build web normal permanece com suas rotas e arquivos separados.
Use um navegador moderno com JavaScript habilitado, como Chrome, Edge, Firefox ou
Safari atual; não há garantia para navegadores antigos. Em dispositivos móveis,
a abertura de arquivos locais depende das restrições do sistema e do navegador.

Histórico e carteira continuam no LocalStorage. A disponibilidade e a persistência
desse armazenamento em arquivos locais dependem do navegador e das configurações
de privacidade; mover ou renomear o HTML pode mudar o armazenamento utilizado.
O arquivo distribuído não inclui os dados salvos no navegador de quem o gerou.

Para gerar novamente e verificar a estrutura autocontida do HTML:

```powershell
npm run test:html
```

## Funcionalidades

- **Início:** introdução à educação financeira, acesso rápido a recursos e orientação sobre reserva de emergência.
- **Aprenda:** 12 tópicos sobre fundamentos, inflação, juros, poupança, CDB, Tesouro Direto, LCI/LCA, fundos e ações; cada tópico inclui exemplo, possível vantagem e ponto de atenção.
- **Simulador:** capital inicial, aportes mensais, produto, taxa, CDI, data e prazo; exibe valores brutos e líquidos, impostos estimados, gráfico, tabela diária e salvamento no histórico. O botão de exemplo carrega R$ 100.000 em CDB percentual do CDI por 30 dias.
- **Comparador:** projeta o mesmo capital e prazo em cinco modalidades, exibindo taxa, retorno bruto e líquido, impostos, liquidez e risco indicativos.
- **Carteira virtual:** adiciona, remove e distribui ativos fictícios; a composição é salva localmente.
- **Histórico:** lista simulações salvas, permite reabri-las no simulador e excluí-las.

## Organização do projeto

```text
src/app/
  core/
    financial-engine/     # cálculos independentes da interface
    models/               # modelos TypeScript
    services/             # histórico e carteira no navegador
  features/
    home/ education/ simulator/
    comparison/ portfolio/ history/
  shared/components/      # gráfico SVG compartilhado
  app.routes.ts           # rotas carregadas sob demanda
src/styles.scss           # identidade visual e estilos responsivos
```

## Premissas dos cálculos

- Juros compostos; taxas anuais são convertidas para taxas diárias equivalentes.
- Para CDB, LCI/LCA e o cenário simplificado de Tesouro Selic, o modelo usa 252 dias úteis por ano. Conta segunda a sexta como dia útil, sem calendário de feriados. Poupança usa 365 dias corridos e uma taxa anual genérica configurável, não a fórmula legal atual da caderneta.
- O exemplo começa com CDI anual de **10,65%** e remuneração de **100% do CDI**, ambos valores ilustrativos editáveis, não uma consulta a taxas oficiais. Tesouro Selic usa a taxa CDI informada como aproximação didática da Selic.
- O IR usa as faixas regressivas usuais de 22,5%, 20%, 17,5% e 15%, aplicadas ao ganho depois do IOF. O IOF regressivo é aplicado nas primeiras 29 diárias, conforme a tabela de percentuais implementada. Poupança não tem esses tributos no modelo. A opção LCI/LCA permite simular a hipótese de isenção de IR; o IOF permanece modelado para resgates antes de 30 dias.
- Os aportes opcionais são adicionados a cada 30 dias e as estimativas de imposto são feitas como se todo o ganho acumulado tivesse o prazo total da simulação. Não há cálculo por lote/data de aporte.
- Valores mantêm precisão decimal durante os cálculos e são arredondados visualmente para centavos. A tabela diária mostra o imposto hipotético caso o resgate acontecesse naquele dia; tributos são recalculados sobre o ganho acumulado.

## Limitações

Esta é uma ferramenta de aprendizagem, não uma calculadora de liquidação ou recomendação. Não consulta CDI, Selic, inflação ou preços em tempo real; não modela feriados, taxas de custódia/administração, spreads, marcação a mercado, regras contratuais, detalhes de cada emissor, limites e elegibilidade do FGC, nem mudanças legais. A rentabilidade real pode divergir substancialmente das projeções. A simplificação tributária não substitui orientação profissional nem a conferência das regras vigentes.

Histórico e carteira são dados não sensíveis persistidos no LocalStorage deste navegador. Eles não são sincronizados e podem ser apagados pelo usuário ou pelo navegador. Não armazene informações pessoais ou financeiras sensíveis.

## Testes

```powershell
npm test
npm run build
```

Os testes cobrem conversão de taxas, juros compostos, faixas de IR, IOF, cenário de 30 dias, dias corridos/úteis, validação e persistência do histórico.

## Preparação futura para Android (Capacitor)

A versão web não depende do Android Studio. Para uma futura compilação híbrida, após instalar Android Studio e configurar o JDK/SDK Android:

1. Adicione Capacitor: `npm install @capacitor/core @capacitor/android` e `npm install -D @capacitor/cli`.
2. Inicialize a configuração do projeto: `npx cap init "Faça Seu Dinheiro Render" "br.com.educacao.fazeseudinheirorender" --web-dir=dist/fazer-seu-dinheiro-render/browser`.
3. Gere o build web e adicione a plataforma: `npm run build` e `npx cap add android`.
4. Sincronize alterações web: `npm run build` e `npx cap sync android`.
5. Abra e execute no dispositivo/emulador: `npx cap open android`; selecione o dispositivo e use **Run** no Android Studio.
6. APK debug: Android Studio → **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
7. APK release assinado: Android Studio → **Build > Generate Signed Bundle / APK**, crie/seleciona um keystore protegido e escolha APK e variante `release`. Guarde as chaves fora do repositório.

As instruções são um roteiro futuro; Capacitor ainda não faz parte das dependências instaladas. Reveja os comandos e a configuração `webDir` ao integrar, usando a documentação oficial atual do Capacitor.
