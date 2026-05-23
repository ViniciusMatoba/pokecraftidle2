# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos Essenciais

```bash
npm run dev          # Servidor local (Vite HMR)
npm run build        # Build de produção (roda check-circulars antes)
npm run deploy       # Build + publicar no GitHub Pages (gh-pages -d dist)
npm run check        # Detectar dependências circulares em /src
npm run audit-content  # Auditoria de conteúdo dos dados
npm run fix-encoding   # Corrigir encoding de arquivos
firebase deploy --only firestore:rules  # Publicar regras do Firestore
```

**Não existe suite de testes automatizados.** Valide manualmente no browser após cada build.

## Arquitetura Geral

### Stack
- **React 18** (sem router — navegação por estado)
- **Vite 5** com code splitting manual em `vite.config.js`
- **Firebase**: Auth (email/senha) + Firestore (save na nuvem)
- **Tailwind CSS v4** (via PostCSS)
- Deploy: **GitHub Pages** via `gh-pages`

### Estrutura de Navegação

Todo o estado do jogo vive em `src/AppRoot.jsx` — um único componente gigante (3000+ linhas) que:
- Mantém `gameState` (o save do jogador) via `useState`
- Controla `currentView` para decidir qual tela renderizar
- Persiste no Firestore via `setDoc('saves/{uid}', gameState)` com debounce

Não há React Router. A navegação é feita por `setCurrentView('nome_da_tela')`.

### Componentes — Carregamento

Alguns componentes são **importados estaticamente** (críticos para o primeiro render):
`AuthScreen`, `MenuScreen`, `BattleScreen`, `CityScreen`, `TravelScreen`, `PokemonManagement`, `VsScreen`, `RegionBuilderScreen`, `RaidScreen`

Outros são **lazy** (carregados sob demanda via `React.lazy`):
`CraftingStation`, `EvolutionScreen`, `SafariZoneScreen`, `MegaEvolutionScreen`, `PokedexScreen`, `TutorialModal`, `GymScreen`, `ChallengesScreen`, `HouseScreen`, `ExpeditionsScreen`, `PrestigeShop`, `FriendsScreen`, `RegionChallengeScreen`

### Chunks do Vite (vite.config.js)
Chunking manual para otimizar cache:
`vendor-react`, `vendor-firebase`, `vendor`, `pokedex`, `moves`, `routes`, `gyms`, `villains`, `screen-battle`, `screen-city`, `screen-pokemon`, `screen-menu`

## Estado do Jogo (gameState)

Definido em `src/data/constants.js` como `DEFAULT_GAME_STATE`. Campos principais:
- `team[]` — Pokémon ativos (máx. 6)
- `pc[]` — Box do PC
- `regional_teams{}` — Times separados por região (kanto/johto/.../paldea)
- `activeRegion` — região atual do jogador
- `badges[]` — IDs de insígnias conquistadas (strings como `'boulder_badge'`)
- `worldFlags[]` — flags de progressão (ex: `'has_starter'`, `'champion'`, `'johto_started'`)
- `inventory.materials{}` — essências e materiais da Forja
- `myRegion{}` — configuração da região personalizada do jogador
- `prestige{}` — troféus, títulos, frames, temas visuais
- `retention{}` — streaks e missões diárias/semanais
- `activeRaid` — raid ativa atual (null se nenhuma)
- `battlesSinceLastRaid` — contador para trigger de raid (dispara a cada 200)

**Migração de save**: `src/utils/saveMigration.js` normaliza saves antigos ao carregar. Sempre que adicionar novos campos ao `DEFAULT_GAME_STATE`, o `migrateGameState()` garante que saves antigos recebam os defaults.

## Sistema de Regiões

9 regiões em ordem: `kanto → johto → hoenn → sinnoh → unova → kalos → alola → galar → paldea`

Definidas em `src/data/regionStandards.js`:
- `REGION_ORDER[]` — ordem de progressão
- `REGION_CHAMPION_FLAGS{}` — flag de worldFlags para cada campeão (ex: `kanto → 'champion'`)
- `REGION_START_FLAGS{}` — flag de worldFlags que indica início da região
- `REGION_DEX_RANGES{}` — range de IDs da Pokédex por região

**Cap de nível por insígnia**: `GYM_LEVEL_CAPS` em `src/data/constants.js` — após 8 insígnias o cap é sempre 100. Pós-campeão: sem cap (flag de campeão verificada em `validateTeamAccess`).

**Insígnias de Alola** são chamadas de "stamps" (melemele_stamp, etc.) mas funcionam igual.

## Firestore — Coleções

| Coleção | Acesso | Conteúdo |
|---|---|---|
| `saves/{uid}` | Apenas o dono | Save completo do jogador |
| `users/{uid}` | Leitura pública autenticada | Perfil público (nome, level, powerScore, etc.) |
| `userRegions/{uid}` | Leitura pública autenticada | Região personalizada publicada |
| `bossRankings/{uid}` | Leitura pública autenticada | Ranking do Boss Global |
| `friends/{uid}/requests/{fromUid}` | Destinatário lê/deleta; remetente cria | Solicitações de amizade |
| `friends/{uid}/list/{friendUid}` | Apenas o dono | Lista de amigos aceitos |
| `config/{doc}` | Leitura pública, escrita bloqueada | Config do app (versão, etc.) |

As regras estão em `firestore.rules`. Após editar, publicar com `firebase deploy --only firestore:rules`.

## Serviços e Utils

- `src/auth.js` — login, registro, logout, exclusão de conta (com re-autenticação)
- `src/services/friends.js` — busca de usuários, envio/aceite/remoção de amizades, onSnapshot de solicitações
- `src/services/ranking.js` — leitura do ranking do Boss Global
- `src/utils/progress.js` — `calculatePowerScore`, `getBadgeCount`, `getEarnedBadgeIds`, `hasProgressRequirement`
- `src/utils/saveMigration.js` — migração de saves antigos para o DEFAULT_GAME_STATE atual
- `src/utils/gameHelpers.js` — `getEffectiveStat`, `getShinyMult`, `getMasteryPath`
- `src/utils/pokemonDifficulty.js` — `getCaptureRate`, `pickWeightedEncounter`
- `src/utils/timeSystem.js` — `getTimeOfDay`, pool de inimigos ajustado por hora
- `src/utils/economy.js` — recompensas de moedas por treinador
- `src/utils/regionBattle.js` — lógica de batalha na RegionChallengeScreen

## Raids

Disparadas a cada `RAID_BATTLE_TRIGGER = 200` batalhas. Configurações em `src/data/raids.js`:
- 1★ a 5★ com HP multipliers: 2×, 4×, 9×, 18×, 40×
- Duração: 60 segundos de combate
- Depois do combate: janela de captura (5 tentativas)
- Shiny chance aumentada durante raids
- Recompensas: EXP Candies, moedas, Evolution Stones (raids 2★+)

## Sistema "Minha Região" (RegionBuilderScreen)

O jogador pode criar sua própria liga com até 8 ginásios + Elite Four + Campeão. Slots comprados na Loja de Prestígio. Publicada em `userRegions/{uid}`. Amigos podem desafiar via `RegionChallengeScreen` (batalha simulada com fator ±20% aleatório).

## Imagens e Assets

- Backgrounds de batalha: `/backgrounds/*.webp` (convertidos de PNG para WebP em v1.90.5 — -760MB)
- Ícones de itens: `/items/*.webp`
- Sprites de Pokémon: PokeAPI (CDN externo) `https://raw.githubusercontent.com/PokeAPI/sprites/...`
- Sprites de treinadores: PokémonShowdown (CDN externo) `https://play.pokemonshowdown.com/sprites/trainers/...`
- `fixPath()` em AppRoot.jsx adapta caminhos locais para o base URL do GitHub Pages

## Versionamento

Versão em 5 lugares — manter todos sincronizados ao bump:
1. `src/constants/version.js` — `APP_VERSION`, `VERSION`, `APP_VERSION_DATE`, `CHANGELOG[]`
2. `package.json` — campo `version`
3. `public/version.json` — `version`, `date`, `notes`
4. `public/sw.js` — `let CACHE_NAME = 'pokecraft-cache-vX.Y.Z'` (também atualizado automaticamente pelo script `scripts/update-sw-version.cjs` no `prebuild`)
5. `package-lock.json` — campos `"version"` nas linhas 3 e 9 (raiz e entrada `""` dos packages)

**Data/hora**: sempre usar horário de Brasília (UTC-3). Verificar com PowerShell:
```powershell
[System.TimeZoneInfo]::ConvertTimeBySystemTimeZoneId([DateTime]::UtcNow, 'E. South America Standard Time').ToString('dd/MM/yyyy HH:mm')
```

## LGPD

- `src/components/PrivacyModal.jsx` — modal com Política de Privacidade e Termos de Uso
- Checkbox de consentimento obrigatório no cadastro (`AuthScreen.jsx`)
- Exclusão de conta: `deleteUserAccount(password)` em `src/auth.js` — apaga `saves`, `users`, `bossRankings` e deleta o Auth user (exige re-autenticação)

## Tutorial de Boas-vindas

`src/components/TutorialModal.jsx` — 6 passos:
1. Rotas, 2. Cidade, 3. Rivais & Equipe Vilã, 4. Ginásios & Liga, 5. Raids, 6. Boss Global

Disparado em `AppRoot.jsx` via `useEffect` quando `has_starter` está em `worldFlags` e `gameTutorialShown` é `false`. Flag `gameTutorialShown` persiste no Firestore para não repetir.

## Cuidados Importantes

- **Importações em AppRoot.jsx**: usar hooks nomeados (`useEffect`, `useState`), não `React.useEffect`. O default `React` não é importado.
- **`removeUndefinedFields()`** deve ser aplicado antes de qualquer `setDoc` no Firestore (Firestore rejeita `undefined`).
- **Dependências circulares**: o prebuild (`check-circulars.cjs`) bloqueia o build se houver. Não criar imports circulares entre `/data`, `/utils` e `/components`.
- **Dados grandes**: `pokedex.js`, `moves.js` e `routes.js` são os maiores arquivos de dados — fazem parte de chunks separados. Evitar importá-los em componentes pequenos sem necessidade.
