# Plano de Carregamento de Imagens e Sprites

Atualizado em 08/07/2026 22:41 (Brasilia).

## Diagnostico

O projeto ainda usa muitos assets externos diretamente nos componentes e dados:

- PokeAPI raw GitHub para sprites de Pokemon e itens.
- Pokemon Showdown para treinadores e sprites animados.
- Repositorio externo de icones SVG de tipos.

A camada de cache do service worker ja ajuda em carregamentos seguintes, mas nao resolve o primeiro carregamento nem falhas temporarias das CDNs. O problema principal pendente e reduzir dependencia direta de URLs espalhadas e criar uma estrategia local seletiva.

## Arquivos com maior incidencia

- `src/AppRoot.jsx`
- `src/components/MenuScreen.jsx`
- `src/components/PokemonManagement.jsx`
- `src/components/TowerBattleScreen.jsx`
- `src/components/TravelScreen.jsx`
- `src/components/RaidScreen.jsx`
- `src/components/TutorialModal.jsx`
- `src/data/routes.js`
- `src/data/trainerTitles.js`
- `src/data/villains.js`

## Fases concluidas

Foi criado `src/utils/assetUrls.js` para centralizar URLs de:

- itens: `getItemSpriteUrl`
- treinadores: `getTrainerSpriteUrl`
- tipos: `getTypeIconUrl`

Primeira migracao aplicada em `src/components/RaidScreen.jsx`, apenas nas Pokebolas da captura e auto-captura. Sprites de Pokemon regionais nao foram alterados nesta fase.

Tambem foram migrados os componentes pequenos da fase 2:

- `src/components/TutorialModal.jsx`
- `src/components/RareDropModal.jsx`
- `src/components/RankingModal.jsx`
- `src/components/VsScreen.jsx`

## Proximas fases recomendadas

1. Migrar telas medias com cuidado:
   - `TravelScreen.jsx`
   - `RegionBuilderScreen.jsx`
   - `PrestigeShop.jsx`

2. Criar fallbacks locais leves:
   - item generico
   - treinador generico
   - Pokemon placeholder
   - Pokebola comum

3. Criar pacote local seletivo:
   - Pokebolas e itens de interface mais usados
   - treinadores fixos
   - starters
   - sprites comuns de batalha inicial

4. Auditar sprites regionais antes de migrar qualquer Pokemon hardcoded:
   - Kanto vs Alola
   - Galar
   - Hisui
   - Paldea
   - shiny + regional
   - mega + shiny

## Regra de entrega

Cada fase deve terminar com:

- bump de versao com horario de Brasilia
- nota no historico
- `npm test -- --run`
- `npm run lint`
- `npm run build`
- `npm audit --audit-level=moderate`
- commit
- `git push origin main`
- `npm run deploy`
