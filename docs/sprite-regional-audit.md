# Auditoria de Sprites Regionais

Atualizado em 08/07/2026 22:58 (Brasilia).

## Objetivo

Evitar regressao em que Pokemon base de uma regiao exibem sprite regional incorreto, como Rattata de Kanto aparecendo como Rattata-Alola. Antes de qualquer pacote local de sprites Pokemon, a regra precisa continuar centralizada em `src/utils/pokemonSprites.js`.

## Regra segura atual

- `getPokemonSpriteId` so usa sprite regional quando `formKey` e valido e os marcadores de regiao nao entram em conflito.
- Se `capturedRegion` indica uma regiao diferente da forma regional e `isRegionalForm` nao esta explicitamente verdadeiro, o sprite volta para o ID base.
- `getPokemonSpriteUrl` e `getPokemonSpriteFallbackUrl` devem ser usados em telas que exibem Pokemon capturados, times, inimigos ou selecoes.
- URLs hardcoded `.../pokemon/${id}.png` devem ser evitadas para objetos que possam carregar `formKey`, `formRegion`, `capturedRegion`, `isRegionalForm`, `isShiny`, `megaSprite` ou `spriteUrl`.

## Cobertura adicionada

`src/utils/pokemonSprites.test.js` cobre:

- Rattata de Kanto com metadata regional antiga continua usando sprite `19`.
- Rattata-Alola valido usa `10091`.
- Vulpix/Ponyta com marcadores regionais conflitantes voltam para o ID base.
- Ponyta-Galar e Growlithe-Hisui validos usam seus IDs especiais.
- Shiny e sprite de costas preservam o ID regional quando a forma e valida.

## Correcao aplicada

`src/components/TowerBattleScreen.jsx` passou a usar:

- `getPokemonSpriteUrl(activeEnemy)`
- `getPokemonSpriteUrl(activePoke, { back: true })`
- `getPokemonSpriteFallbackUrl(...)`

Isso evita que a Battle Tower exiba formas regionais como especies base, ou especies base como regionais, quando o objeto carrega metadados de forma.

## Pontos ainda pendentes

Migrar com cuidado, em fases pequenas:

- `src/AppRoot.jsx`: possui muitos sprites hardcoded em onboarding, modais, preloads, notificacoes e telas de historia.
- `src/components/PokemonManagement.jsx`: ainda ha trechos de mega/evolucao com URL manual.
- `src/components/MenuScreen.jsx`: icones regionais hardcoded podem migrar para helper, mas sao menos criticos por serem especies lendarias fixas.
- `src/data/trainerTitles.js`: icones de titulos com Pokemon fixos.
- `src/data/recipes.js`: imagens de receitas especiais com Pokemon fixos.
- `src/components/TowerBattleScreen.jsx`: migrado nesta fase.

## Regra para proximas migracoes

Migrar primeiro exibicoes que recebem objeto Pokemon completo. Evitar migrar sprites Pokemon fixos apenas por ID sem revisar se representam uma especie base intencional, uma forma especial, uma mega ou um icone decorativo.
