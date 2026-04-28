# Changelog - PokéCraft Idle

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
