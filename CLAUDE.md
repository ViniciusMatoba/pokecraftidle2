# CLAUDE.md — PokéCraft Idle 2

Lido automaticamente pelo Claude Code no início de cada sessão. Mantido atualizado após cada feature.

---

## ⚠️ REGRA PRIMORDIAL — BUMP DE VERSÃO

**TODA VEZ que o número de versão for alterado, os 5 arquivos abaixo DEVEM ser atualizados na mesma sessão, sem exceção.**

| # | Arquivo | O que alterar |
|---|---------|---------------|
| 1 | `src/constants/version.js` | `APP_VERSION`, `VERSION`, `APP_VERSION_DATE` e novo bloco no topo do `CHANGELOG[]` |
| 2 | `package.json` | campo `"version"` |
| 3 | `package-lock.json` | campo `"version"` nas **linhas 3 e 9** (raiz + entrada `""` dos packages) |
| 4 | `public/version.json` | campos `"version"`, `"date"` e `"notes"` |
| 5 | `public/sw.js` | `let CACHE_NAME = 'pokecraft-cache-vX.Y.Z'` — atualizado automaticamente pelo prebuild |

> **Versão atual: v2.11.34** — `package.json` ainda pode estar em 2.11.33 (atualizar manualmente).

### Data/hora: sempre Brasília (UTC-3)

Antes de escrever qualquer timestamp, rodar:

```powershell
[System.TimeZoneInfo]::ConvertTimeBySystemTimeZoneId([DateTime]::UtcNow, 'E. South America Standard Time').ToString('dd/MM/yyyy HH:mm')
```

Nunca usar hora estimada ou futura — apenas o valor retornado pelo comando.

---

## ⚠️ REGRA PRIMORDIAL — RELEASE

**SEMPRE usar `npm run release` para publicar. Nunca `npm run deploy` diretamente.**

O `deploy` sozinho não commita o código-fonte — causa dessincronização entre `main` e produção.

```bash
npm run release
# ou com descrição:
npm run release -- "Nome da Feature"
```

O script `scripts/release.cjs` executa: stash → pull → pop → commit → push → build → deploy.

---

## Comandos Essenciais

```bash
npm run release        # ✅ USAR ESTE — fluxo completo
npm run dev            # Servidor local (Vite HMR)
npm run build          # Build de produção (inclui prebuild: sw-version + check-circulars + audit-content)
npm run deploy         # ⚠️ Só deploy — NÃO commita código-fonte
npm run check          # Detectar dependências circulares
npm run audit-content  # Auditoria de dados (rotas, raids, pokédex)
firebase deploy --only firestore:rules  # Publicar regras do Firestore
```

**Não há suite de testes automatizados.** Validar manualmente no browser após build.

---

## Stack

- **React 18** (sem router — navegação por `currentView` em AppRoot)
- **Vite 5** com code splitting manual em `vite.config.js`
- **Firebase**: Auth (email/senha) + Firestore (save na nuvem)
- **Tailwind CSS v4** via PostCSS
- **Deploy**: GitHub Pages via `gh-pages`

---

## Arquitetura de Navegação

`src/AppRoot.jsx` (~12.000 linhas) é o componente raiz único que:
- Mantém `gameState` (save do jogador) via `useState`
- Controla `currentView` para renderizar a tela correta
- Persiste no Firestore com debounce
- **Não existe React Router** — navegação é `setCurrentView('nome_da_tela')`

### Carregamento de Componentes

**Estáticos** (críticos para o primeiro render):
`AuthScreen`, `MenuScreen`, `BattleScreen`, `CityScreen`, `TravelScreen`, `PokemonManagement`, `VsScreen`, `RegionBuilderScreen`, `RaidScreen`

**Lazy** (sob demanda):
`CraftingStation`, `EvolutionScreen`, `SafariZoneScreen`, `MegaEvolutionScreen`, `PokedexScreen`, `TutorialModal`, `GymScreen`, `ChallengesScreen`, `HouseScreen`, `ExpeditionsScreen`, `PrestigeShop`, `FriendsScreen`, `RegionChallengeScreen`, `BattleTowerScreen`, `TowerBattleScreen`

### Chunks do Vite
`vendor-react`, `vendor-firebase`, `vendor`, `pokedex`, `moves`, `routes`, `gyms`, `villains`, `towerLogic`, `screen-battle`, `screen-city`, `screen-pokemon`, `screen-menu`

---

## Estado do Jogo (gameState)

Definido em `src/data/constants.js` como `DEFAULT_GAME_STATE`. Campos principais:

| Campo | Descrição |
|-------|-----------|
| `team[]` | Pokémon ativos (máx. 6) |
| `pc[]` | Box do PC |
| `regional_teams{}` | Times separados por região |
| `activeRegion` | Região atual |
| `badges[]` | IDs de insígnias (`'boulder_badge'`, etc.) |
| `worldFlags[]` | Flags de progressão (`'has_starter'`, `'champion'`, etc.) |
| `inventory.materials{}` | Essências e materiais da Forja |
| `myRegion{}` | Liga personalizada do jogador |
| `prestige{}` | Troféus, títulos, frames, temas |
| `retention{}` | Streaks e missões diárias/semanais |
| `activeRaid` | Raid ativa (null se nenhuma) |
| `battlesSinceLastRaid` | Contador de batalhas (raid dispara a cada 200) |
| `settings.manualBattle` | `false` = auto-farm; `true` = modo turno-a-turno |
| `tower{}` | Estado da Battle Tower (activeRun, bp, highestFloor, upgrades) |

**Migração de save**: `src/utils/saveMigration.js` — sempre que adicionar campos ao `DEFAULT_GAME_STATE`, garantir que `migrateGameState()` aplique os defaults para saves antigos.

---

## Sistema de Pokémon Alfa

Pokémon especiais capturáveis apenas em Raids. Marcados com `isAlpha: true`.

### Lógica de stat
```js
// Padrão usado em applyXp, sanitizeCollection, EvolutionScreen e loop de level-up:
const statMult = p.isAlpha
  ? (p.isShiny ? 1.5 : 1.3)
  : (p.isShiny ? 1.2 : 1.0);
```
> ⚠️ Nunca usar apenas `p.isShiny ? 1.2 : 1.0` — ignora alfa e quebra os stats.

### Visuais implementados
| Local | Efeito |
|-------|--------|
| `BattleScreen` | `<AlphaAuraEffect>` + drop-shadow vermelho no sprite + badge `α` no HUD |
| `PokemonManagement` — card do time | Fundo rose/red + glow + badge `α` canto superior direito |
| `PokemonManagement` — card do PC | Drop-shadow vermelho + badge `α` canto inferior direito |
| `PokemonManagement` — modal detalhe | Gradiente escarlate + badge "α Alfa" + sprite w-32 + `AlphaAuraEffect` |

### Função de aplicação
`applyAlphaUpgrade(pokemon, pokedexData, isAlsoShiny)` em `AppRoot.jsx` — aplica `isAlpha: true` e multiplica todos os stats pelo fator correto.

---

## Sistema de Efeitos Visuais

Componentes em `src/components/effects/`:

| Componente | Props | Uso |
|-----------|-------|-----|
| `ShinyEncounterEffect` | `active`, `compact`, `persistent` | Aura dourada — encontro/pokémon shiny |
| `AlphaAuraEffect` | `compact`, `isAlsoShiny` | Aura vermelha — pokémon alfa |
| `PokemonEntranceEffect` | `ballId` | Animação de saída da Pokébola |

**Z-index padrão**: `ShinyEncounterEffect` usa `z-30` (compact) / `z-40`; `AlphaAuraEffect` usa `z-[31]` (compact) / `z-[41]` — fica acima do efeito shiny.

---

## Formas Regionais

Sistema em `src/data/regionalForms.js` e `src/data/regionalEvolutions.js`.

Campos relevantes em Pokémon com forma regional:
- `formKey` — identificador único da forma (ex: `'ninetales-alola'`)
- `formSpriteId` — ID para busca de sprite
- `formRegion` — região de origem da forma
- `isRegionalForm: true`
- `capturedRegion` — região onde foi capturado

`REGIONAL_FORM_METADATA` em `regionalForms.js` — metadados de tipos, regiões e sprites para cada forma. Consultado por `fixPokemonTypes()` **antes** do Pokédex base para preservar tipos corretos na migração de save.

---

## Battle Tower

Modo de jogo separado do idle principal. Estado em `gameState.tower`.

- `BattleTowerScreen.jsx` — lobby, draft, shop entre andares
- `TowerBattleScreen.jsx` — combate manual turno-a-turno
- `src/data/towerLogic.js` — funções: `startTowerRun`, `getTowerStarters`, `generateFloorShop`
- Time da Torre vive exclusivamente em `tower.activeRun.team` — **não altera `gameState.team`**
- Batalhas vão para a view `tower_battle`, não para o sistema de batalha normal

---

## Modo Manual de Batalha

Ativado via `gameState.settings.manualBattle = true` (toggle no Painel Automático).

- Auto-farm pausado: `useAutoFarm(pokemon, route, tick, battleReady && !isManualMode)`
- 4 botões de golpe clicáveis em `BattleScreen`
- `handleManualAttack(moveIdx)` em `AppRoot.jsx` — executa um turno completo
- `isManualActing` — estado React que bloqueia cliques duplos durante resposta do inimigo

---

## Sistema de Regiões

9 regiões em ordem: `kanto → johto → hoenn → sinnoh → unova → kalos → alola → galar → paldea`

Definidas em `src/data/regionStandards.js`:
- `REGION_ORDER[]` — ordem de progressão
- `REGION_CHAMPION_FLAGS{}` — ex: `kanto → 'champion'`
- `REGION_DEX_RANGES{}` — range de IDs por região

Cap de nível por insígnia: `GYM_LEVEL_CAPS` em `src/data/constants.js`. Pós-8 insígnias: cap 100. Pós-campeão: sem cap.

**Insígnias de Alola** são chamadas "stamps" mas funcionam igual.

---

## Multi-Avatar

Até 3 avatares por conta. Saves separados no Firestore:
- Slot 1: `saves/{uid}` + `users/{uid}` (backward compat)
- Slot 2: `saves/{uid}_s2` + `users/{uid}_s2`
- Slot 3: `saves/{uid}_s3` + `users/{uid}_s3`

`getSlotDocId(uid, slot)` em `src/auth.js` — retorna o ID correto do documento para cada slot.
Nicks são únicos globais — reservados atomicamente via transação em `nicknames/{nick_lower}`.

---

## Raids

Disparadas a cada `RAID_BATTLE_TRIGGER = 200` batalhas. Config em `src/data/raids.js`.

**HP multipliers por estrela** (atualizados em v2.7.7):
`1★: 2×` | `2★: 3×` | `3★: 6×` | `4★: 10×` | `5★: 15×`

- Duração: 60 segundos
- Pós-combate: janela de captura (5 tentativas)
- Lendários/míticos: **bloqueados por padrão** — só entram no pool após derrota no Modo VS (verificado por `isLegendaryUnlockedForRaid(id, worldFlags)`)
- Gate de estrelas: 0 insígnias→1★ | 1-2→2★ | 3-4→3★ | 5-6→4★ | 7+→5★

---

## Firestore — Coleções

| Coleção | Acesso | Conteúdo |
|---------|--------|----------|
| `saves/{uid}` | Apenas o dono | Save completo |
| `users/{uid}` | Leitura pública autenticada | Perfil público |
| `userRegions/{uid}` | Leitura pública autenticada | Região personalizada publicada |
| `bossRankings/{uid}` | Leitura pública autenticada | Ranking Boss Global |
| `friends/{uid}/requests/{fromUid}` | Destinatário lê/deleta; remetente cria | Solicitações de amizade |
| `friends/{uid}/list/{friendUid}` | Apenas o dono | Lista de amigos |
| `nicknames/{nick_lower}` | Qualquer auth lê; dono escreve | Reserva de nick único global |
| `config/{doc}` | Leitura pública, escrita bloqueada | Config do app |

Regras em `firestore.rules`. Após editar: `firebase deploy --only firestore:rules`.

---

## Assets e Imagens

- **Backgrounds de batalha**: `/backgrounds/*.webp`
- **Ícones de itens**: `/items/*.webp`
- **Sprites Pokémon**: PokeAPI CDN — `https://raw.githubusercontent.com/PokeAPI/sprites/...`
- **Sprites treinadores**: Showdown CDN — `https://play.pokemonshowdown.com/sprites/trainers/...`

### Caminhos locais (Vite `base: './'`)

`import.meta.env.BASE_URL = './'` em produção — caminhos absolutos (`/items/...`) quebram.

```js
// Em AppRoot.jsx:
fixPath('/items/mega_stone_shard.webp')

// Em componentes isolados (sem acesso a fixPath):
const _base = (import.meta.env.BASE_URL || './').replace(/\/$/, '');
const localAsset = (path) => `${_base}${path}`;
```

### onError — regra obrigatória

```js
// SEMPRE setar onerror = null primeiro para evitar loop infinito:
onError={e => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = fallbackUrl;
}}
```

PokeAPI só serve `.png` — nunca usar `.webp` em URLs do PokeAPI.

---

## Serviços e Utils Principais

| Arquivo | Conteúdo-chave |
|---------|---------------|
| `src/auth.js` | login, registro, logout, exclusão de conta, `getSlotDocId` |
| `src/utils/saveMigration.js` | `migrateGameState()` — normaliza saves antigos |
| `src/utils/gameHelpers.js` | `getEffectiveStat`, `getShinyMult`, `getMasteryPath` |
| `src/utils/pokemonSprites.js` | `getPokemonSpriteUrl`, `getPokemonSpriteFallbackUrl` |
| `src/utils/progress.js` | `calculatePowerScore`, `getBadgeCount`, `hasProgressRequirement` |
| `src/utils/timeSystem.js` | `getTimeOfDay`, pool de inimigos por hora |
| `src/data/raids.js` | `pickRaidPokemon`, `isLegendaryUnlockedForRaid`, `LEGENDARY_RAID_LOCKED_IDS` |
| `src/data/regionalForms.js` | `REGIONAL_FORM_METADATA` |
| `src/data/regionStandards.js` | `REGION_ORDER`, `REGION_CHAMPION_FLAGS`, `isPokemonLegal` |

---

## Cuidados Importantes

- **AppRoot imports**: usar hooks nomeados (`useEffect`, `useState`) — `React` default não é importado.
- **`removeUndefinedFields()`** antes de qualquer `setDoc` — Firestore rejeita `undefined`.
- **Dependências circulares**: o prebuild bloqueia o build se houver. Não criar imports circulares entre `/data`, `/utils` e `/components`.
- **Tailwind**: não existe `w-15` — usar `w-[60px]` ou `w-14`/`w-16`.
- **Arquivos grandes** (`pokedex.js`, `moves.js`, `routes.js`): são chunks separados — evitar importar em componentes pequenos.
- **`getShinyMult(p)`** em `gameHelpers.js` só verifica `isShiny` — para pokémon alfa, sempre usar o padrão `p.isAlpha ? (p.isShiny ? 1.5 : 1.3) : (p.isShiny ? 1.2 : 1.0)` diretamente.

---

## Estado Atual do Projeto (atualizar após cada sessão)

**Versão**: v2.11.34 — 25/05/2026 13:58

**Últimas features implementadas**:
- v2.11.34 — Pokémon Alfa: visuais completos (BattleScreen, PC, modal) + correção de stats em level-up/evolução/sanitize
- v2.11.33 — Formas regionais tratadas como Pokémon distintos (tipos, aba PC, modal)
- v2.11.29 — Compressão LZString no save local + fix de quota excedida
- v2.11.16 — Multi-avatar (3 slots por conta, nick único global)
- v2.11.6 — Battle Tower (combate manual por turno)
- v2.8.5 — Modo Manual de Batalha (toggle auto/turno)

**Pendências conhecidas**:
- `package.json` e `package-lock.json` podem estar em 2.11.33 — verificar ao próxima sessão
- 80 Pokémon base ainda não obtíveis por nenhuma rota (aviso do audit-content — não é blocker)

---

## Sistema "Minha Região"

Jogador cria liga personalizada com até 8 ginásios + Elite Four + Campeão. Slots comprados na Loja de Prestígio. Publicada em `userRegions/{uid}`. Amigos desafiam via `RegionChallengeScreen` (fator ±20% aleatório).

---

## LGPD

- `src/components/PrivacyModal.jsx` — Política de Privacidade e Termos de Uso
- Checkbox obrigatório no cadastro (`AuthScreen.jsx`)
- Exclusão de conta: `deleteUserAccount(password)` em `src/auth.js` — apaga saves de todos os slots, perfis, nicks e deleta o Auth user (exige re-autenticação)
