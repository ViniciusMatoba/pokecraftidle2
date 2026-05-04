# Changelog - PokeCraft

## [V1.50.5] - 03/05/2026 21:47
### Corrigido
- **Expedicoes**: desbloqueio agora usa a contagem normalizada de insignias, aceitando saves com ids (`boulder_badge`) e saves antigos numericos.
- **Cache PWA**: service worker atualizado para `pokecraft-cache-v1.50.5`, forçando a troca dos assets antigos.
- **Versao Publica**: `package.json`, `package-lock.json`, `version.json` e constantes internas atualizados para `1.50.5`.

## [V1.45.1] - 30/04/2026 11:54
### Adicionado
- **PWA Android Fix**: Reestruturação completa do Service Worker com Cache-First para ativos estáticos e Network-First para APIs.
- **PWA Manifest Update**: Adicionado campo `id` e correção do `start_url` para melhorar a instalabilidade.
- **PWA Debugging**: Adicionados logs de depuração para monitoramento do evento `beforeinstallprompt` em dispositivos móveis.
- **Melhorias na Login Screen**: Remoção do Ranking Global da tela inicial para limpeza visual e reorganização do espaçamento entre botões.
- **PWA Early Capture**: Implementação de captura antecipada do prompt de instalação no `index.html` para evitar perda do evento `beforeinstallprompt`.
- **Refatoração do Trainer Card**: Novo visual Dark RPG com exibição de regiões (Kanto/Johto) em linhas separadas.
- **Sistema de Conquistas**: Introdução de medalhas (Pokédex, Crafting, Boss Slayer) com efeitos de brilho (glow) ao serem desbloqueadas.
- **Inspecionar Treinadores**: Agora é possível clicar em qualquer jogador no Ranking Global para visualizar seu Trainer Card completo.
- **Power Score Global**: O Power Score (PS) agora é a soma de todos os atributos (HP, ATK, DEF, etc.) de todos os Pokémons que o jogador possui (Equipe + PC), refletindo o verdadeiro poder da sua coleção.
- **Coroa de Campeão**: Efeito visual animado para treinadores que derrotaram o campeão regional.

## [V1.40.2] - 30/04/2026 09:20
- **Bugfix Crítico**: Correção de um erro de Temporal Dead Zone (TDZ) relacionado à ordem de inicialização do estado global (`gameState` e `powerScore`) que impedia a renderização completa da aplicação na branch principal, causando a tela azul/preta vazia.

## [V1.40.0] - 30/04/2026 08:27
### Adicionado
- **Reclassificação da Forja**: Nova categoria 'Relíquias de Elite' com estilo visual lendário.
- **Power Score (PS)**: Implementado sistema de pontuação global baseado em níveis, capturas e insígnias.
- **Material Ranks (I a IX)**: Sistema de escalonamento para 9 regiões vinculado ao Power Score.
- **Segurança de Conteúdo**: Bônus de itens de Boss agora são protegidos e ativados exclusivamente em batalhas de Boss.
- **Tema Dark RPG**: Interface da Forja completamente remodelada com estética sombria e imersiva.

## [V1.33.0] - 30/04/2026 08:22
### Adicionado
- **Sistema de Drops de Boss**: Recompensas exclusivas (Fragmento de Armadura, Essência de Fúria, Escama de Dragão, Poeira Estelar) baseadas no dano causado.
- **Novas Receitas de Forja**: Criados itens Lendários (Escudo de Titã, Poção de Adrenalina, Pingente de Penetração).
- **Passivas de Gear**: Itens equipados agora concedem bônus reais contra Bosses (Redução de dano, Bônus de Atk e Penetração de Defesa).
- **Modal de Saques**: Nova interface para visualização de prêmios conquistados após o Enrage Timer.
- **Indicadores Visuais**: Novos ícones no BossScreen mostram quais passivas estão ativas antes da batalha.

## [V1.32.1] - 30/04/2026 07:53
### Adicionado
- **Enrage Timer**: Cronômetro de 2 minutos para batalhas contra Bosses Mundiais com HUD dedicada.
- **Backgrounds Dinâmicos**: Padronização dos cenários de Boss baseados no tipo do oponente (Ginásio, Lab, Caverna).
- **Persistência Refinada**: Sistema de salvamento de dano final agora integrado ao ciclo de debounce de 5s.
- **Navegação Inteligente**: Retorno automático para a aba de Boss no Modo VS após o término da batalha por tempo esgotado.

## [V1.32.0] - 30/04/2026 07:45
### Adicionado
- **Sistema de Boss Raid Global**: Nova aba "BOSS" no Modo VS com geração dinâmica de oponentes.
- **Escalonamento Épico**: Bosses possuem 100x HP e +50% de Atributos (ATK/DEF) para um desafio competitivo.
- **HUD de Batalha Premium**: Barra de vida gigante, segmentada e pulsante exclusiva para confrontos contra Bosses Mundiais.
- **Ranking de Dano (DPS)**: Sistema de persistência no Firestore (`bossRankings`) que rastreia os top 5 maiores danos.
- **Sincronização Debounced**: Lógica de salvamento de dano com 5 segundos de debounce para otimização de performance.
- **Dev Tools**: Botão de reset de Boss para facilitar testes em ambiente de desenvolvimento.

## [V1.31.0] - 30/04/2026 07:35
### Ranking Global & Power Score
- **Sistema de Ranking:** Leaderboard Top 50 baseada em Power Score (Insígnias + Níveis Totais).
- **Power Score System:** Algoritmo de pontuação sincronizado com a nuvem a cada salvamento.
- **Botão de Ranking:** Acesso rápido por ícone de troféu nas telas de Login e de Jornada.
- **Sair da Batalha:** Botão de saída rápida integrado na tela de combate para retorno imediato ao mapa.
- **Indicador de Rota:** Selo "Treinando Aqui" no mapa de viagens para localização instantânea.
- **PWA Robusto:** Botão de instalação agora persistente com guia visual manual para usuários iOS (Safari).
- **UI de Autenticação:** Modal de login expandido e espaçamento otimizado para melhor usabilidade.
- **Design de Ranking:** Tema Dark Mode RPG com efeitos de brilho para o Top 3 e destaque para o próprio jogador.

## [V1.30.0] - 30/04/2026 07:25
### Melhorias de Navegação e PWA
- **Sair da Batalha:** Implementado botão para abandonar rotas de farm diretamente da tela de combate.
- **Indicador de Rota:** Adicionado selo visual no mapa indicando a rota onde o jogador está atualmente.
- **UX de Login:** Aumento do card de autenticação para 680px e melhoria no espaçamento dos botões.
- **Fallback PWA:** Adicionado guia de instalação para iOS e mensagens de ajuda para navegadores sem suporte ao prompt automático.

## [V1.29.0] - 30/04/2026 07:05
### Melhorias de UI e PWA
- **Z-Index Fix:** Elevado o `ConfirmModal` para `z-index: 20000` para garantir que apareça acima do Poké Mart e outros modais.
- **Backgrounds de Batalha:** Corrigida a exibição dos fundos da arena em subdiretórios (GitHub Pages) usando caminhos dinâmicos.
- **Instalação PWA:** Adicionado botão de instalação direta do App na página de login para facilitar o acesso como WebApp.

## [V1.28.0] - 30/04/2026 06:45
### Sistema de Verificação de Atualizações
- **Botão de Verificação:** Adicionado botão "Verificar Atualizações" na tela de login com estilo Navy & Green.
- **Lógica de Versão:** Implementada comparação entre versão local e `version.json` no servidor.
- **Force Update:** Integração com Service Worker e `window.location.reload(true)` para forçar a atualização imediata do App quando uma nova versão é detectada.
- **Centralização:** Migrada a gestão de versão para `src/constants/version.js`.

## [V1.27.0] - 30/04/2026 06:20
### Otimização de Performance & Banda
- **Cache Agressivo (Service Worker):**
  - Implementado Service Worker (`sw.js`) para interceptação de requisições de assets (PNG, JPG, MP3).
  - Estratégia **Cache-First**: arquivos pesados agora são servidos localmente após o primeiro download, reduzindo drasticamente o consumo de banda do Firebase.
- **Headers de Cache (Firebase):**
  - Configurados cabeçalhos `Cache-Control` no `firebase.json` para expiração em 1 semana para arquivos estáticos.
- **Preloader Inteligente:**
  - Refatorada a utilidade `preloadAssets` para verificar a existência de arquivos no **Cache Storage API** antes de realizar novos fetches.
- **Auditoria de Recursos:**
  - Identificados assets críticos para compressão (MP3 > 2MB e PNG > 1MB) com economia potencial de ~50% no tamanho da pasta `/public`.


## [V1.26.2] - 29/04/2026 12:55
### Correção: Motor de Combate (Precisão e Hit Rate)
- **Cálculo de Precisão:**
  - Corrigida a fórmula de multiplicador de precisão para estágios negativos (`accStageMult`). Antes, reduzir a precisão do jogador aumentava suas chances de acerto ou causava erros críticos.
  - Sincronizada a fórmula com os padrões de Pokémon Gen 2-4: `3 / (3 + abs(stage))`.
- **Integridade de Golpes:**
  - Corrigido bug crítico em `PokemonManagement.jsx` onde trocar golpes de um Pokémon removia todas as propriedades (Poder, Precisão, Tipo) exceto o nome.
  - Refatorado `calcDamage` no `AppRoot.jsx` para resolver dados de golpes diretamente da base mestra `MOVES` se o objeto de entrada estiver incompleto.
  - Inicializados estágios de `accuracy` e `evasion` em todos os spawns e resets de batalha.
- **Interface (Equipe):**
  - Corrigido o botão **"Voltar ao Treino"** na tela de Equipe que não funcionava devido a uma falha na passagem de props.

## [V1.26.1] - 29/04/2026 12:42
### Correção: Consistência de Dados (Batalha & Troca)
- **Data Resolution:**
  - Corrigida falha no `BattleScreen` onde os golpes eram lidos apenas como nomes simples, perdendo as propriedades de categoria e poder. Agora o componente resolve os dados completos a partir da base de dados mestra.
  - Sincronizado o visual do **Modal de Troca de Golpes** com a listagem principal, garantindo que "Dano" vs "Status" seja exibido corretamente em todos os menus.
  - Corrigido erro de referência `move is not defined` no log de detalhes da batalha.

## [V1.26.0] - 29/04/2026 15:35
### Etapa 4: UI de Batalha & Navegação
- **Correção de Golpes:**
  - Golpes com dano fixo ou efeitos especiais que possuíam `power: 0` (ex: Guillotine, Seismic Toss) agora são corretamente identificados como **ESPECIAL** ou **DANO** na UI, em vez de serem rotulados genericamente como STATUS.
  - Descrições de golpes atualizadas para refletir se o dano é físico, especial ou fixo.
- **Navegação (UX):**
  - Adicionado botão **"Voltar ao Treino"** na tela de Equipe, permitindo retorno imediato à rota de farm ativa sem passar pelo Hub.
  - Melhorado o alinhamento de slots de golpes no resumo do Pokémon.

## [V1.25.0] - 29/04/2026 12:22
### Etapa 3: Trava Financeira (PokéMart & Forja)
- **Segurança Transacional:**
  - Implementada validação rigorosa de saldo para evitar contas negativas.
  - Botões de compra em lote (x10, Max) agora verificam o custo total antes de serem habilitados.
- **Trava de Alto Valor:**
  - Adicionada confirmação visual para compras e forjas acima de 5.000 Pokédollars, prevenindo gastos acidentais.
- **Feedback UI:**
  - Notificações de sucesso e erro integradas ao fluxo de compra e criação de itens.

## [V1.24.0] - 29/04/2026 09:10
### Etapa 2: Progressão e Ordenação (Modo VS)
- **Reordenação por Level:**
  - Ginásios de Kanto reordenados (Blaine agora é o 7º e Giovanni o 8º).
  - **Buff do Chefe:** Níveis da equipe do Giovanni aumentados (50-55) para consolidar sua posição como o desafio final de Kanto.
  - Desafios (CHALLENGES) reordenados por nível de dificuldade em todas as categorias (Rivais, Rocket, Johto).
- **Interface Johto:**
  - Implementada a renderização de **Insígnias Reais** no Modo VS de Johto.
  - Círculos de conquista agora exibem o ícone SVG da insígnia quando o líder é derrotado, mantendo a paridade visual com Kanto.

## [1.23.0] - 2026-04-29 (08:37)
### ⚔️ Motor de Batalha & Ataques (Etapa 1)
- **Correção de Imunidades:** Implementada lógica de dano real para imunidades (Ex: Normal vs Fantasma), garantindo 0 de dano em vez do mínimo de 1.
- **Precisão de Golpes (Accuracy):** Integrado o atributo `accuracy` de cada movimento no cálculo de acerto. Agora golpes como *Thunder* ou *Hydro Pump* podem errar naturalmente.
- **Novos Danos Fixos:** Adicionado suporte para os golpes *Super Fang* (50% do HP atual) e *Psywave* (dano variável baseado no nível).
- **Feedback de Batalha:** 
    - Adicionado log de "Errou!" quando um ataque falha por precisão.
    - Adicionado floating text de dano para ataques dos inimigos (anteriormente invisíveis).
    - Corrigida exibição de mensagens de efetividade em ataques que erraram.
- **Estabilidade de Estado:** Corrigido bug crítico na confusão do inimigo que descartava o progresso do turno (stamina/exp) ao causar auto-dano.

## [1.22.1] - 2026-04-28 (18:11)
### Corrigido
- Ajustado o modal de detalhes da rota para celular, mantendo o botao Comecar Treino acessivel sem corte no arredondamento inferior.
- Rebalanceada a distribuicao de encontros por Manha, Dia, Tarde e Noite; a previa do modal agora usa a mesma logica de spawn da batalha.
- Corrigidos icones locais do Link Cable e das racoes da Forja.

## [1.22.0] - 2026-04-28 (16:09)
### ⚡ Performance & Preloader
- **Sistema de Preloader:** Implementada tela de carregamento inicial que pré-carrega backgrounds e sons críticos.
- **Cache Agressivo:** Configurado Cache-Control para expiração de 1 ano em assets estáticos (Imagens/Áudio) no Firebase.
- **Barra de Progresso:** Adicionada UI premium com tracking real do download dos assets iniciais.
- **Otimização de Inicialização:** Redução de flashes brancos e elementos sem estilo durante o carregamento de imagens.

## [1.21.0] - 2026-04-28 (15:57)
### ⚔️ Gestão de Golpes & Paridade Johto
- **Gestão de Golpes (Summary):** Implementada interface para troca e reordenação de golpes ativos. Agora é possível escolher quais ataques seu Pokémon usará no modo idle.
- **Aprendizado Inteligente:** Pokémon agora mantêm uma "Memória de Golpes" (`learnedMoves`), permitindo recuperar ataques antigos a qualquer momento.
- **Evolução com Golpes:** Ao evoluir, o Pokémon aprende automaticamente todos os golpes da nova espécie correspondentes ao seu nível atual.
- **Insígnias de Johto:** Implementados os 8 designs SVG exclusivos para as insígnias de Johto, agora visíveis no TrainerCard e MODO VS.
- **UI de Batalha:** Melhorado o feedback visual de troca de golpes e animações de modal.

## [1.20.0] - 2026-04-28 (15:05)
### 🗺️ Navegação & Progressão
- **Johto Region Parity:** Refatoração do MODO VS para correta segregação de Desafios (Rocket/Rival) e Ginásios na região de Johto.
- **Click-to-Go:** Implementada navegação direta para locais de desafio a partir de modais de requisitos.
- **Level Labels:** Adicionados indicadores de nível `[Min] - [Max]` em todos os cards de rota.

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
