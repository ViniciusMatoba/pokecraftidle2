# Changelog - PokÃ©Craft Idle
## [1.22.1] - 2026-04-28 (18:11)
### Corrigido
- Ajustado o modal de detalhes da rota para celular, mantendo o botao Comecar Treino acessivel sem corte no arredondamento inferior.
- Rebalanceada a distribuicao de encontros por Manha, Dia, Tarde e Noite; a previa do modal agora usa a mesma logica de spawn da batalha.
- Corrigidos icones locais do Link Cable e das racoes da Forja.

## [1.22.0] - 2026-04-28 (16:09)
### âš¡ Performance & Preloader
- **Sistema de Preloader:** Implementada tela de carregamento inicial que prÃ©-carrega backgrounds e sons crÃ­ticos.
- **Cache Agressivo:** Configurado Cache-Control para expiraÃ§Ã£o de 1 ano em assets estÃ¡ticos (Imagens/Ãudio) no Firebase.
- **Barra de Progresso:** Adicionada UI premium com tracking real do download dos assets iniciais.
- **OtimizaÃ§Ã£o de InicializaÃ§Ã£o:** ReduÃ§Ã£o de flashes brancos e elementos sem estilo durante o carregamento de imagens.

## [1.21.0] - 2026-04-28 (15:57)
### âš”ï¸ GestÃ£o de Golpes & Paridade Johto
- **GestÃ£o de Golpes (Summary):** Implementada interface para troca e reordenaÃ§Ã£o de golpes ativos. Agora Ã© possÃ­vel escolher quais ataques seu PokÃ©mon usarÃ¡ no modo idle.
- **Aprendizado Inteligente:** PokÃ©mon agora mantÃªm uma "MemÃ³ria de Golpes" (`learnedMoves`), permitindo recuperar ataques antigos a qualquer momento.
- **EvoluÃ§Ã£o com Golpes:** Ao evoluir, o PokÃ©mon aprende automaticamente todos os golpes da nova espÃ©cie correspondentes ao seu nÃ­vel atual.
- **InsÃ­gnias de Johto:** Implementados os 8 designs SVG exclusivos para as insÃ­gnias de Johto, agora visÃ­veis no TrainerCard e MODO VS.
- **UI de Batalha:** Melhorado o feedback visual de troca de golpes e animaÃ§Ãµes de modal.

## [1.20.0] - 2026-04-28 (15:05)
### ðŸ—ºï¸ NavegaÃ§Ã£o & ProgressÃ£o
- **Johto Region Parity:** RefatoraÃ§Ã£o do MODO VS para correta segregaÃ§Ã£o de Desafios (Rocket/Rival) e GinÃ¡sios na regiÃ£o de Johto.
- **Click-to-Go:** Implementada navegaÃ§Ã£o direta para locais de desafio a partir de modais de requisitos.
- **Level Labels:** Adicionados indicadores de nÃ­vel `[Min] - [Max]` em todos os cards de rota.

### ðŸš€ Estabilidade & UI Modernizada
- **CorreÃ§Ã£o CrÃ­tica (Rotas):** Resolvido crash fatal na Sprout Tower e rotas de Johto causado por vÃ­rgulas duplicadas no banco de dados.
- **RefatoraÃ§Ã£o Pokemon Management:** Modal totalmente reconstruÃ­do com visualizaÃ§Ã£o moderna de golpes (Type Badges/Stats), sistema de Candies expansÃ­vel e painel de reordenamento de equipe simplificado.
- **ResoluÃ§Ã£o de TDZ:** Corrigido erro de inicializaÃ§Ã£o `ReferenceError` que causava "tela azul" no carregamento inicial.
- **Limpeza de Logs:** RemoÃ§Ã£o massiva de caracteres UTF-8 corrompidos em logs de sistema, diÃ¡logos do Prof. Carvalho e notificaÃ§Ãµes de UI.
- **Design Johto:** Cards de desafios e lÃ­deres de Johto atualizados para o padrÃ£o visual "Corner Accent" (Branco/Acento lateral).
- **MecÃ¢nica de Spawn:** Ativado filtro que impede PokÃ©mon evoluÃ­dos em rotas de nÃ­vel baixo (<= 15) para melhor progressÃ£o.

## [1.18.0] - 2026-04-28
### âœ¨ Performance & OtimizaÃ§Ã£o
- **Code Splitting:** Implementado `React.lazy` e `Suspense` em todos os modais pesados (`Pokedex`, `Crafting`, `VsScreen`, `Expeditions`, `House`).
- **Asset Preloading:** Novo sistema de preloader dinÃ¢mico para sprites da equipe, backgrounds de rotas e itens essenciais.
- **Lazy Images:** Adicionado `loading="lazy"` em todas as listas de PokÃ©mons (PC, Pokedex, Travel) para reduzir consumo de RAM e rede.
- **ReduÃ§Ã£o de Bundle:** OtimizaÃ§Ã£o da carga inicial do `AppRoot`, movendo lÃ³gica secundÃ¡ria para mÃ³dulos sob demanda.

## [1.17.3] - 2026-04-28
### Alterado
- **Balanceamento de Encontros:** Removidos PokÃ©mon evoluÃ­dos de encontros selvagens em rotas iniciais (Kanto e Johto). EvoluÃ§Ãµes agora aparecem apenas com treinadores nestas Ã¡reas.
- **PadronizaÃ§Ã£o Visual:** LÃ­deres de GinÃ¡sio de Johto agora utilizam o padrÃ£o de cores/gradientes por tipo, idÃªntico aos lÃ­deres de Kanto.

### Corrigido
- **UI de Equipe:** Removido caractere extraviado "(" que aparecia nos cards de PokÃ©mon Shiny no menu Equipe.

## [1.17.2] - 2026-04-28
### Corrigido
- **NavegaÃ§Ã£o Regional (Click-to-go):** Implementado o estado `vsInitialRegion` para garantir que cliques em requisitos de Johto (Rival/Rocket) abram a aba regional correta no Modo VS.

## [1.17.1] - 2026-04-28
### Adicionado
- **ExpansÃ£o de Desafios Johto:** Adicionadas 4 novas batalhas canÃ´nicas (Silver em Azalea, Burned Tower e Goldenrod Tunnel; Executivo Rocket em Mahogany).
- **ProgressÃ£o Vinculada:** Novos desafios agora atuam como bloqueios de rota. Ex: Ilex Forest exige vitÃ³ria contra Rival em Azalea.
- **NavegaÃ§Ã£o Inteligente:** Requisitos clicÃ¡veis no mapa e em desafios agora redirecionam automaticamente para a aba e categoria correta no Modo VS.

### Corrigido
- **Filtragem Regional (Modo VS):** Corrigida falha lÃ³gica que permitia a exibiÃ§Ã£o de desafios de Kanto quando a aba Johto estava selecionada.

## [1.17.0] - 2026-04-28
### Adicionado
- **ExpansÃ£o Regional (Johto):** Implementado suporte completo para a regiÃ£o de Johto no Modo VS.
- **Seletor de RegiÃ£o:** Novo controle no Modo VS que alterna entre Kanto e Johto em Desafios e GinÃ¡sios.
- **Bloqueio de Batalha (Battle Lock):** Sistema de proteÃ§Ã£o que impede a saÃ­da acidental de batalhas importantes (Treinadores, Chefes e LendÃ¡rios) sem confirmaÃ§Ã£o.
- **Indicador Shiny:** Adicionado o Ã­cone âœ¨ ao lado do nome de PokÃ©mon Shiny no BattleScreen e InventÃ¡rio para melhor feedback visual.

### Alterado
- **NavegaÃ§Ã£o Segura:** Todos os botÃµes do menu inferior agora utilizam o `handleSafeNavigation` para garantir integridade durante combates.
- **Resumo de SessÃ£o:** Melhorada a lÃ³gica de desistÃªncia de batalha para exibir o resumo de recompensas ao abandonar via confirmaÃ§Ã£o.
- **ConsolidaÃ§Ã£o de UI:** Removidos seletores regionais duplicados dentro de componentes embutidos para uma interface mais limpa.


## [1.7.6] - 2026-04-23
### Fixed
- Fixed Enemy HUD (Name/Lv/HP) visibility issues by adding `instanceId` tracking.
- Reduced wild trainer encounter rate (8% -> 3%) and villain ambushes (4% -> 2%).
- Sped up battle intro animations for faster gameplay.
- Improved battle UI stability during rapid spawns.

## [1.7.5] - 2026-04-23
### Fixed
- Fixed critical syntax error in `ChallengesScreen.jsx` that caused application crash.
- Fixed broken enemy images and missing HUD bars in VS battles.
- Fixed `startKeyBattle` data initialization (now correctly fetches Pokedex data).
- Optimized Hub VS layout for desktop (max-width 448px).

## [1.7.4] - 2026-04-23
### Adicionado
- **Novo Hub VS Unificado:** Agora todos os desafios (GinÃ¡sios, Elite 4, Rivais, Rocket e LendÃ¡rios) estÃ£o em uma Ãºnica tela com abas superiores.
- **Abas do Modo VS:** 
  - **Desafios:** Rivais e Equipe Rocket.
  - **GinÃ¡sios & Liga:** Todos os lÃ­deres de Kanto e a Elite 4 (com auto-scroll).
  - **LendÃ¡rios:** Encontros com Articuno, Zapdos, Moltres e Mewtwo.

### Alterado
- **RemoÃ§Ã£o de RedundÃ¢ncia:** O card "Modo VS" foi removido definitivamente do menu da Cidade, jÃ¡ que agora possui um botÃ£o exclusivo no menu inferior.
- **CorreÃ§Ã£o de Erros:** Corrigido erro de sintaxe em `CityScreen.jsx` que impedia atualizaÃ§Ãµes em tempo real.

## [1.7.3] - 2026-04-23
### Adicionado
- **CategorizaÃ§Ã£o no Modo VS:** O Hub VS agora possui 3 cards distintos: **Desafios**, **GinÃ¡sios** e **Elite 4**.
- **Auto-Scroll na Liga:** Ao selecionar "Elite 4" no menu VS, a tela de ginÃ¡sios rola automaticamente para a seÃ§Ã£o da Liga PokÃ©mon.

### Alterado
- **Limpeza de Cidade:** Removido definitivamente qualquer acesso redundante ao Modo VS de dentro do menu da Cidade.

## [1.7.2] - 2026-04-23
### Alterado
- **NavegaÃ§Ã£o Global:** O "Modo VS" foi movido do mapa da cidade para o menu de navegaÃ§Ã£o inferior (tab bar).
- **Layout de Menu:** Atualizada a barra inferior para 5 colunas, permitindo acesso rÃ¡pido a GinÃ¡sios e Desafios de qualquer tela.

## [1.7.1] - 2026-04-23
### Adicionado
- **Hub Modo VS:** Criado o componente `VsScreen.jsx` que unifica o acesso a GinÃ¡sios e Desafios em um Ãºnico menu.
- **Aves LendÃ¡rias:** Adicionados Articuno, Zapdos e Moltres Ã  categoria de Desafios LendÃ¡rios.

### Alterado
- **NavegaÃ§Ã£o Urbana:** SubstituÃ­dos os botÃµes individuais de GinÃ¡sios e Desafios por um Ãºnico Ã­cone "Modo VS" na cidade.

## [1.7.0] - 2026-04-23
### Adicionado
- **Sistema de Desafios da Cidade:** Novo componente `ChallengesScreen.jsx` que centraliza batalhas especiais.
- **Categorias de Desafios:** Filtros para Rivais, Equipe Rocket e PokÃ©mon LendÃ¡rios.
- **PrÃ©via de Equipe:** VisualizaÃ§Ã£o dos PokÃ©mon e nÃ­veis do oponente antes de iniciar o desafio.
- **IntegraÃ§Ã£o Urbana:** Novo prÃ©dio "Desafios" adicionado ao mapa da cidade em `CityScreen.jsx`.

### Alterado
- **CentralizaÃ§Ã£o de Batalhas:** Movida a lÃ³gica de batalhas de elite e rivais das rotas individuais para o sistema central de desafios.
- **Limpeza de Rotas:** Removido o campo `keyBattles` de `src/data/routes.js` para simplificar o farm de rotas.
- **UI de Modais:** Ajustado o tamanho e posicionamento dos modais de desafio para seguirem o padrÃ£o visual dos ginÃ¡sios (bottom sheet `max-w-md`).

### Corrigido
- **Posicionamento de Modais:** Modais de confirmaÃ§Ã£o agora centralizados e com fundo escurecido (backdrop).
- **Dados da Equipe:** Corrigido problema onde a equipe do oponente nÃ£o aparecia na confirmaÃ§Ã£o do desafio.

---
## [1.6.31] - 2026-04-23
- AtualizaÃ§Ãµes de balanceamento e correÃ§Ãµes menores de UI.
