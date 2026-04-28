# Changelog - PokéCraft Idle

## [1.19.0] - 2026-04-28
### 🚀 Estabilidade & UI Modernizada
- **Correção Crítica (Rotas):** Resolvido crash fatal na Sprout Tower e rotas de Johto causado por vírgulas duplicadas no banco de dados.
- **Refatoração Pokemon Management:** Modal totalmente reconstruído com visualização moderna de golpes (Type Badges/Stats), sistema de Candies expansível e painel de reordenamento de equipe simplificado.
- **Resolução de TDZ:** Corrigido erro de inicialização `ReferenceError` que causava "tela azul" no carregamento inicial.
- **Limpeza de Logs:** Remoção massiva de caracteres UTF-8 corrompidos em logs de sistema, diálogos do Prof. Carvalho e notificações de UI.
- **Design Johto:** Cards de desafios e líderes de Johto atualizados para o padrão visual "Corner Accent" (Branco/Acento lateral).
- **Mecânica de Spawn:** Ativado filtro que impede Pokémon evoluídos em rotas de nível baixo (<= 15) para melhor progressão.

## [1.18.0] - 2026-04-28
### ✨ Performance & Otimização
- **Code Splitting:** Implementado `React.lazy` e `Suspense` em todos os modais pesados (`Pokedex`, `Crafting`, `VsScreen`, `Expeditions`, `House`).
- **Asset Preloading:** Novo sistema de preloader dinâmico para sprites da equipe, backgrounds de rotas e itens essenciais.
- **Lazy Images:** Adicionado `loading="lazy"` em todas as listas de Pokémons (PC, Pokedex, Travel) para reduzir consumo de RAM e rede.
- **Redução de Bundle:** Otimização da carga inicial do `AppRoot`, movendo lógica secundária para módulos sob demanda.

## [1.17.3] - 2026-04-28
### Alterado
- **Balanceamento de Encontros:** Removidos Pokémon evoluídos de encontros selvagens em rotas iniciais (Kanto e Johto). Evoluções agora aparecem apenas com treinadores nestas áreas.
- **Padronização Visual:** Líderes de Ginásio de Johto agora utilizam o padrão de cores/gradientes por tipo, idêntico aos líderes de Kanto.

### Corrigido
- **UI de Equipe:** Removido caractere extraviado "(" que aparecia nos cards de Pokémon Shiny no menu Equipe.

## [1.17.2] - 2026-04-28
### Corrigido
- **Navegação Regional (Click-to-go):** Implementado o estado `vsInitialRegion` para garantir que cliques em requisitos de Johto (Rival/Rocket) abram a aba regional correta no Modo VS.

## [1.17.1] - 2026-04-28
### Adicionado
- **Expansão de Desafios Johto:** Adicionadas 4 novas batalhas canônicas (Silver em Azalea, Burned Tower e Goldenrod Tunnel; Executivo Rocket em Mahogany).
- **Progressão Vinculada:** Novos desafios agora atuam como bloqueios de rota. Ex: Ilex Forest exige vitória contra Rival em Azalea.
- **Navegação Inteligente:** Requisitos clicáveis no mapa e em desafios agora redirecionam automaticamente para a aba e categoria correta no Modo VS.

### Corrigido
- **Filtragem Regional (Modo VS):** Corrigida falha lógica que permitia a exibição de desafios de Kanto quando a aba Johto estava selecionada.

## [1.17.0] - 2026-04-28
### Adicionado
- **Expansão Regional (Johto):** Implementado suporte completo para a região de Johto no Modo VS.
- **Seletor de Região:** Novo controle no Modo VS que alterna entre Kanto e Johto em Desafios e Ginásios.
- **Bloqueio de Batalha (Battle Lock):** Sistema de proteção que impede a saída acidental de batalhas importantes (Treinadores, Chefes e Lendários) sem confirmação.
- **Indicador Shiny:** Adicionado o ícone ✨ ao lado do nome de Pokémon Shiny no BattleScreen e Inventário para melhor feedback visual.

### Alterado
- **Navegação Segura:** Todos os botões do menu inferior agora utilizam o `handleSafeNavigation` para garantir integridade durante combates.
- **Resumo de Sessão:** Melhorada a lógica de desistência de batalha para exibir o resumo de recompensas ao abandonar via confirmação.
- **Consolidação de UI:** Removidos seletores regionais duplicados dentro de componentes embutidos para uma interface mais limpa.


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
- **Novo Hub VS Unificado:** Agora todos os desafios (Ginásios, Elite 4, Rivais, Rocket e Lendários) estão em uma única tela com abas superiores.
- **Abas do Modo VS:** 
  - **Desafios:** Rivais e Equipe Rocket.
  - **Ginásios & Liga:** Todos os líderes de Kanto e a Elite 4 (com auto-scroll).
  - **Lendários:** Encontros com Articuno, Zapdos, Moltres e Mewtwo.

### Alterado
- **Remoção de Redundância:** O card "Modo VS" foi removido definitivamente do menu da Cidade, já que agora possui um botão exclusivo no menu inferior.
- **Correção de Erros:** Corrigido erro de sintaxe em `CityScreen.jsx` que impedia atualizações em tempo real.

## [1.7.3] - 2026-04-23
### Adicionado
- **Categorização no Modo VS:** O Hub VS agora possui 3 cards distintos: **Desafios**, **Ginásios** e **Elite 4**.
- **Auto-Scroll na Liga:** Ao selecionar "Elite 4" no menu VS, a tela de ginásios rola automaticamente para a seção da Liga Pokémon.

### Alterado
- **Limpeza de Cidade:** Removido definitivamente qualquer acesso redundante ao Modo VS de dentro do menu da Cidade.

## [1.7.2] - 2026-04-23
### Alterado
- **Navegação Global:** O "Modo VS" foi movido do mapa da cidade para o menu de navegação inferior (tab bar).
- **Layout de Menu:** Atualizada a barra inferior para 5 colunas, permitindo acesso rápido a Ginásios e Desafios de qualquer tela.

## [1.7.1] - 2026-04-23
### Adicionado
- **Hub Modo VS:** Criado o componente `VsScreen.jsx` que unifica o acesso a Ginásios e Desafios em um único menu.
- **Aves Lendárias:** Adicionados Articuno, Zapdos e Moltres à categoria de Desafios Lendários.

### Alterado
- **Navegação Urbana:** Substituídos os botões individuais de Ginásios e Desafios por um único ícone "Modo VS" na cidade.

## [1.7.0] - 2026-04-23
### Adicionado
- **Sistema de Desafios da Cidade:** Novo componente `ChallengesScreen.jsx` que centraliza batalhas especiais.
- **Categorias de Desafios:** Filtros para Rivais, Equipe Rocket e Pokémon Lendários.
- **Prévia de Equipe:** Visualização dos Pokémon e níveis do oponente antes de iniciar o desafio.
- **Integração Urbana:** Novo prédio "Desafios" adicionado ao mapa da cidade em `CityScreen.jsx`.

### Alterado
- **Centralização de Batalhas:** Movida a lógica de batalhas de elite e rivais das rotas individuais para o sistema central de desafios.
- **Limpeza de Rotas:** Removido o campo `keyBattles` de `src/data/routes.js` para simplificar o farm de rotas.
- **UI de Modais:** Ajustado o tamanho e posicionamento dos modais de desafio para seguirem o padrão visual dos ginásios (bottom sheet `max-w-md`).

### Corrigido
- **Posicionamento de Modais:** Modais de confirmação agora centralizados e com fundo escurecido (backdrop).
- **Dados da Equipe:** Corrigido problema onde a equipe do oponente não aparecia na confirmação do desafio.

---
## [1.6.31] - 2026-04-23
- Atualizações de balanceamento e correções menores de UI.
