# Changelog - PokeCraft

## [v1.99.0] - 16/05/2026 15:45
### Alterado
- **Standardização de Backgrounds**: Migração completa de todos os assets de fundo para a convenção `bg_` unificada em todo o projeto.
- **Limpeza de Ativos**: Remoção de prefixos `battle_bg_` e eliminação de timestamps em arquivos de cenários de Kanto e demais regiões.
- **Correção de Caminhos**: Atualização de `gyms.js`, `battleBackgrounds.js`, `expeditions.js` e componentes de UI (`BossScreen`, `GymScreen`, `ExpeditionsScreen`, `RaidScreen`) para o novo padrão de nomes limpos.
- **Performance**: Otimização do carregamento dinâmico de backgrounds via helper centralizado, garantindo compatibilidade com GitHub Pages e Vite.

## [v1.88.8] - 14/05/2026 22:10
### Adicionado
- **Tutorial de Boas-Vindas**: Modal de 6 passos (Rotas, Cidade, Rivais, Ginásios, Raids, Boss) exibido na primeira visita à Cidade após o starter.
- **Barra de Progresso**: Tutorial agora exibe o progresso visual de aprendizado.
- **Trigger Inteligente**: Tutorial bloqueia interações de fundo e só fecha ao concluir ou pular.

## [v1.88.5] - 14/05/2026 19:23
### Alterado
- **Habitats Regionais**: áreas Habitat I, II e III agora exigem ser Campeão da região para serem liberadas — válido para todas as 9 regiões. Facilita completar a Pokédex de forma organizada após terminar a liga.

## [v1.88.4] - 14/05/2026 19:19
### Adicionado
- **Botão Sair**: botão "Sair da Conta" na tela inicial (visível apenas quando logado) — desloga via Firebase e retorna à tela de login.
### Corrigido
- **Ícone Minha Casa**: substituído por casinha SVG com temática cartoon/Pokémon (telhado vermelho, janelas azuis, porta de madeira e chaminé).

## [v1.88.3] - 14/05/2026 19:07
### Corrigido
- **Forja (Bug Crítico)**: itens não eram fabricados mesmo após confirmação. Causa: validação de materiais ignorava `inventory.items`, causando falha silenciosa quando parte dos recursos estava nessa sub-chave. Dedução agora drena `materials` primeiro e `items` depois, espelhando o cálculo da UI.

## [v1.88.2] - 14/05/2026 18:55
### Corrigido
- **Trainer Card — Título**: mais espaço abaixo do nome (`mt-3`, `text-[10px]`, `py-2.5`) para melhor legibilidade.
- **Trainer Card — Regiões**: label da região com largura maior (`w-14`) e padding esquerdo (`pl-1`) para evitar texto cortado na borda.
- **Trainer Card — Ícone de Campeão**: substituído `kings-rock.png` por troféu SVG dourado com brilho âmbar.

## [v1.88.1] - 14/05/2026 18:52
### Corrigido
- **Barra Superior — Botão de Som**: substituído sprite de item por ícone SVG de alto-falante (ativado = ondas, mutado = cortado com X).
- **Barra Superior — Botão Home**: substituído sprite de item por ícone SVG de casa.

## [v1.88.0] - 14/05/2026 18:48
### Adicionado
- **Raid — Opções na Fase de Captura**: botões "Continuar e tentar derrotar" (volta à fase de luta) e "Sair sem capturar" (encerra a raid sem captura) agora disponíveis na tela de Raid.
- **Clima por Golpe**: Sunny Day, Rain Dance, Sandstorm e Hail ativam o clima correspondente por 5 turnos; ao fim, o clima volta ao natural da rota.
### Corrigido
- **Banner de Raid (Mobile)**: notificação de Raid reestruturada em bloco — título não é mais cortado, botão OK virou faixa larga (44px) para facilitar toque no celular.
### Alterado
- **Sistema de Clima**: rotas comuns não geram mais clima aleatório; apenas biomas especiais mantêm clima fixo (Deserto → Sandstorm, Neve/Gelo → Hail).

## [v1.87.0] - 14/05/2026 18:27
### Adicionado
- **Safari Zone Interativa**: nova tela dedicada com captura sem batalha, Safari Balls por sessao e Pokemon exclusivos.
- **Mecanicas da Safari Zone**: sistema de Isca e Lama para variar risco de fuga e chance de captura.
- **Mega Evolucao Permanente**: sistema completo com tela dedicada, comparacao antes/depois e bonus permanentes de stats.
- **Sistema de Clima**: Sol, Chuva, Tempestade de Areia e Granizo com multiplicadores e efeitos em batalha.
- **Receitas Safari Zone**: Safari Ball, Isca Pokemon e Bola de Lama fabricaveis na Forja.

## [v1.85.3] - 14/05/2026 15:32
### Corrigido
- **Ícone de Recompensa de Raid**: Corrigido ícone de moedas (`currency`) que estava quebrado, utilizando agora o sprite oficial de `nugget` da PokeAPI.

## [v1.85.2] - 14/05/2026 15:20
### Corrigido
- **Hotfix de Inicialização**: Corrigido `ReferenceError` causado pela remoção acidental de `EXP_CANDIES` em `raids.js`.
- **Arquitetura de Dados**: `REGION_ORDER` agora é importado centralmente, evitando duplicação e conflitos de carregamento.

## [v1.84.0] - 14/05/2026 09:12
- **Suporte a Sprites Shiny**: Raids de Pokémon shiny agora exibem corretamente a sprite brilhante.
### Corrigido
- **Sincronização de Recompensas**: Corrigido ID de Pokébola (`pokeballs`) para evitar falha no inventário.
- **Ícones de Recompensa**: Overhaul completo do objeto `REWARD_ICONS` usando PokeAPI e placeholders de segurança (Rare Candy, Hard Stone, Up-grade).

## [v1.83.6] - 14/05/2026 09:04
- **Bloqueio de Camadas**: Implementado bloqueio via `pointer-events: none` na `CityScreen` e `CraftingStation` (Forja) sempre que um modal (Títulos, Power Rank ou Confirmação) estiver aberto.
- **Landing Screen UI**: Restaurada a integridade visual da tela inicial, eliminando corrupções de código e duplicatas do Ranking Global.

## [v1.83.5] - 14/05/2026 08:48
### Corrigido
- **Fluxo de Confirmação Padronizado**: Revertida a paleta de cores para o padrão Dark/Pokémon (Slate/Blue) e removidos bloqueios de eventos redundantes em botões internos.
- **Isolamento Independente**: A CityScreen agora depende puramente de `pointer-events: none` para evitar interações enquanto modais estão ativos, garantindo que a lógica interna do modal permaneça intacta.

## [v1.83.4] - 14/05/2026 08:44
### Corrigido
- **Isolamento de Eventos Simplificado**: Removidas camadas de bloqueio agressivas (divs transparentes e `stopPropagation` em botões) para permitir que o React processe eventos internos normalmente.
- **Estratégia de Pointer-Events**: A interatividade com a cidade ao fundo agora é controlada exclusivamente via `pointer-events: none` dinâmico no container da `CityScreen`.
- **Logs de Diagnóstico**: Adicionado log de clique para confirmar a restauração da interatividade dos botões de título.

## [v1.83.3] - 14/05/2026 08:39
### Adicionado
- **Modal de Confirmação de Título**: Introduzido um fluxo de dois passos para a troca de títulos, exibindo uma prévia visual do badge antes da aplicação definitiva.
- **Design System Navy & Green**: Interface do modal de confirmação estilizada com a paleta da Agência VM (#0F2D3A e #1DB954).
- **Isolamento de Eventos**: O novo modal de confirmação mantém o bloqueio de cliques (pointer-events) para evitar interações indesejadas com a CityScreen.

## [v1.83.2] - 14/05/2026 08:32
### Corrigido
- **Seleção Reativa de Títulos**: Implementado o campo `selectedTitle` no estado global e logs de auditoria para rastrear mudanças de estado em tempo real.
- **Forçar Re-renderização**: Adicionada uma `key` baseada no ID do título para forçar o React a redesenhar o componente do Trainer Card instantaneamente.
- **Feedback Visual**: O seletor de títulos agora exibe uma borda esmeralda e brilho no título selecionado para confirmação visual imediata antes do fechamento.

## [v1.83.1] - 14/05/2026 08:26
### Corrigido
- **Restauração de Interatividade**: Removido o uso de `stopImmediatePropagation` que causava o "congelamento" dos modais, permitindo que o React processe eventos internos normalmente.
- **Sincronização de Títulos**: Implementado delay de 50ms na seleção de títulos para garantir a persistência do estado antes do fechamento do modal.
- **Pointer-Events Recovery**: Forçado `pointer-events: auto` nos containers de modais para garantir clique interno.

## [v1.83.0] - 14/05/2026 08:18
### Corrigido
- **Bloqueio Físico de Pointer-Events**: Implementada desativação total de interações na `CityScreen` via CSS (`pointer-events: none`) sempre que um modal de interface estiver ativo.
- **Isolamento de Baixo Nível**: Adicionado `stopImmediatePropagation` nos eventos de clique dos modais e logs de auditoria para rastrear vazamentos de eventos.

## [v1.82.10] - 14/05/2026 08:02
### Corrigido
- **Técnica do Escudo Duplo**: Implementada propagação bloqueada no container de lista de títulos e delay de 100ms no fechamento do modal para garantir que o clique não "vaze" para o Centro Pokémon ao fundo.

## [v1.82.9] - 14/05/2026 07:46
### Corrigido
- **Escudo Atômico de Eventos**: Adicionado overlay transparente (`z-100004`) dedicado ao bloqueio de interações com o fundo durante a seleção de títulos.
- **Reforço de Seletores**: Implementação de bloqueio de propagação em `pointerdown` e `mousedown` nos botões da lista de títulos.

## [v1.82.8] - 14/05/2026 07:35
### Corrigido
- **Isolamento de Eventos**: Implementado bloqueio absoluto de propagação de cliques (`stopPropagation`) nos modais do Trainer Card.
- **Z-Index**: Elevado para `z-100005` para garantir que os seletores de título e info fiquem sempre acima da CityScreen.

## [v1.82.7] - 14/05/2026 07:20
### Corrigido
- **Sincronização de Versão**: Corrigido bug de cache no `AuthScreen` que impedia a detecção da versão mais recente.
- **Cache-Buster**: Implementada estratégia agressiva de bypass de cache (`?v=timestamp`) na verificação de atualizações.
- **Forced Reload**: Adicionado `window.location.reload(true)` para garantir a limpeza de scripts em cache após atualização.

## [v1.82.6] - 14/05/2026 07:13
### Refactor & Cleanup
- Auditoria de Limpeza: Remoção de ativos obsoletos (`vite.svg`, `react.svg`).
- Limpeza de débitos técnicos: Remoção de imports comentados e código morto no `AppRoot.jsx`.
- Padronização de ativos: Implementação de `assetPath` e `POKEAPI` no `RaidScreen.jsx` para links de recompensas.
- Criação de Tag de segurança `v1.82.5-stable-backup` pré-limpeza.

## [V1.82.5] - 14/05/2026 06:56
### Adicionado
- **Animação de Captura (Raids)**: Implementação de sistema visual completo com lançamento de pokébola, absorção do pokémon, tremores de captura e efeitos de resultado (CSS Keyframes).
### Corrigido
- **Sincronização de Captura**: Cálculo de sucesso pré-computado para garantir que o resultado visual da animação corresponda exatamente ao commit no estado do jogo.
 
## [V1.82.4] - 14/05/2026 06:47
### Corrigido
- **Refatoração da Forja (handleCraft)**: Lógica de estado isolada de side-effects (addLog), garantindo transições de estado puras e maior estabilidade.
- **Blindagem de UI (Global)**: Interceptação robusta de eventos em todos os modais para evitar cliques vazados (UI Leakage).
- **Labels da Forja**: Categorias atualizadas com novos ícones e descrições na Crafting Station.

## [V1.82.3] - 13/05/2026 22:49
### Adicionado
- **Guia da Jornada**: nova area no MENU com objetivo principal, rota recomendada, proxima rota bloqueada e atalhos para MODO VS ou treino.
- **Diario de Drops**: receitas e materiais uteis agora aparecem no Guia com botao para ir diretamente para a rota de drop quando ela estiver liberada.

## [V1.82.2] - 13/05/2026 22:32
### Corrigido
- **Modais de Vitoria**: recompensas de lideres, rivais, equipe vila e Elite agora exibem exatamente as moedas recebidas apos o rebalanceamento economico.
- **MODO VS/Ginasios**: cards de recompensa passam a mostrar o valor real aplicado no save.
- **Titulos do Trainer Card**: selecao de titulos sincronizada com a Loja de Prestigio e cliques do modal nao vazam mais para outras telas ou para o card expansivel.

## [V1.82.1] - 13/05/2026 22:18
### Adicionado
- **Menu Missoes**: nova area no MENU com login diario, streak, melhor sequencia e recompensas em ciclos de 7 dias.
- **Missoes Recorrentes**: objetivos diarios e semanais para derrotar Pokemon, capturar, vencer treinadores, capturar shiny e concluir raids.
### Corrigido
- **Forja (Mega Pedras)**: receitas e fragmentos de Mega Stone agora ficam bloqueados ate Kalos e exigem Mega Evolucao desbloqueada.

## [V1.82.0] - 13/05/2026 22:03
### Adicionado
- **Treinador (Interface)**: redesign completo do Trainer Card com visual premium, glassmorphism e PS detalhado.
- **Sistema de Titulos**: novo modal unificado para titulos de conquistas e Loja de Prestigio.
- **Titulos Novos**: novas conquistas desbloqueaveis, incluindo campeoes regionais, Mestre de Forja e Cacador de Lendas.
### Alterado
- **Economia**: recompensa de moedas em batalhas de treinadores reduzida para controlar inflacao.
### Corrigido
- **Versao Publica**: `package.json`, `package-lock.json`, `public/version.json` e service worker alinhados em `1.82.0`.

## [V1.79.7] - 13/05/2026 17:38
### Adicionado
- **Menu Estatisticas**: nova area dentro do MENU para exibir tempo de jogo, especies registradas, capturas, derrotas, shinies, treinadores, equipe vila, boss de area, raids e dano em boss.
- **Contadores Persistentes**: o save passa a registrar estatisticas de jornada em `playerStats`, mantendo compatibilidade com dados antigos como `trainerBattleWins`, `shinyCapturedCount` e `raidStats`.
### Melhorado
- **Mochila Mobile**: as categorias agora aparecem como bolsos grandes em grade, com sprites tematicos, contadores visiveis e cards maiores para toque no celular.

## [V1.79.6] - 13/05/2026 17:34
### Release
- **Forja e TMs**:
    - Incluidos 329 TMs oficiais como receitas fabricaveis com drops pelo sistema existente.
- **Raids**:
    - HP rebalanceado por estrelas e aviso visivel na rota ao finalizar, expirar, entrar em captura ou liberar recompensas.
- **Batalhas**:
    - Efeitos visuais dos golpes agora resolvem nomes traduzidos e usam sprites `/fx/` do Pokemon Showdown.
- **Rotas e Pokedex Regional**:
    - Progressao de nivel normalizada em todas as regioes, com cobertura completa dos Pokemon regionais nas rotas/habitats.
## [V1.79.5] - 13/05/2026 17:32
### Balanceamento
- **Progressao das Rotas**:
    - Normalizada a escala de niveis das rotas de treino por regiao, do inicio ate o nivel 100.
    - Corrigidos saltos grandes em Johto e nas demais regioes.
    - Treinadores de rota passam a ficar pelo menos 3 niveis acima dos selvagens, exceto limite natural do nivel 100.
- **Auditoria de Pokedex Regional**:
    - Confirmada cobertura completa dos Pokemon de cada geracao em rotas/habitats da respectiva regiao.
## [V1.79.4] - 13/05/2026 17:25
### Corrigido
- **Efeitos Visuais de Golpes**:
    - Golpes traduzidos agora resolvem para a chave oficial e usam a animacao correta.
    - Golpes de status tambem disparam FX durante a batalha.
    - Sprites publicos `/fx/` do Pokemon Showdown foram validados e ganharam fallback seguro.
## [V1.79.3] - 13/05/2026 17:15
### Balanceamento
- **Raids**:
    - Reduzida a curva de HP por estrelas para batalhas dificeis, mas possiveis.
    - Raids ja salvas sao recalculadas para a curva nova quando iniciadas.
    - Adicionado aviso na tela de rota para raid expirada, falha, captura liberada e recompensas coletadas.
## [V1.79.2] - 13/05/2026 17:07
### Adicionado
- **Forja de TMs Completa**:
    - Incluidos 329 TMs oficiais como receitas fabricaveis.
    - Todas as receitas de TM entram no sistema existente de drop por Pokemon.
    - Custos de fabricacao escalam por tier de poder/categoria e usam essencias + materiais tematicos.
## [V1.79.1] - 13/05/2026 15:47
### Corrigido
- **Sistema de Raids**: 
    - Correção de ícones quebrados no modal de recompensas (Candies, Shards e moedas).
    - Rebalanceamento da tabela de drops (quantidades reduzidas para melhor economia).
    - Nova regra: recompensas só são liberadas se o Boss for derrotado (HP=0) ou capturado.

## [V1.79.0] - 13/05/2026 15:12
### Adicionado
- **Mega Evoluções (Sistema Global)**: 
    - Implementação de 96 novas formas Mega Evolution com suporte a branching paths (ex: Absolite Z).
    - Registro completo de atributos, tipos e habilidades exclusivas no Pokedex.
    - Sincronização de IDs regionais (bloco 20XXX) para garantir estabilidade do motor de jogo.
- **Forja e Economia**:
    - 96 novas receitas de Mega Stones adicionadas ao sistema de crafting.
    - Integração de `mega_stone_shard` como material base universal para pedras evolutivas.
    - Mapeamento de drops raros para as novas receitas.
- **Ferramentas de Desenvolvimento**:
    - Script de auditoria `audit_megas.ps1` para validação automática de dados evolutivos.

## [V1.78.2] - 13/05/2026 12:12

### Adicionado
- **Interface (UI)**:
    - Novo layout da tela de Raid:
        - Nome e Nível movidos para o cabeçalho superior.
        - Pokémon centralizado com animação de flutuar e brilho pulsante.
        - Barra de HP e cronômetro reposicionados abaixo do Pokémon.
        - Botões de fechar e coletar agora em branco para máximo contraste.

## [V1.78.1] - 13/05/2026 12:02
### Adicionado
- **Sistema de Raids**:
    - Adicionada chance de 0.5% de spawn imediato ao encontrar Pokémon selvagens nas rotas.
    - Corrigido bug onde Raids expiradas bloqueavam o surgimento de novas.
    - Reduzido tempo de spawn passivo para 1 hora.

## [V1.78.0] - 13/05/2026 11:36
### Adicionado
- **Sistema**:
    - Padronização da taxa Shiny para 1/4096 (base).
    - Redução do gatilho de Raids para 50 batalhas.

## [V1.77.9] - 13/05/2026 11:24
### Corrigido
- **Batalha**:
    - Corrigido posicionamento dos textos flutuantes. Agora curas (`+HP`), buffs e debuffs aparecem sobre o Pokémon alvo (jogador ou inimigo) corretamente.

## [V1.77.8] - 13/05/2026 10:51
### Corrigido
- **Expedições**:
    - Resolvido bug crítico de duplicação de Pokémon (agora permanecem no PC com flag `onExpedition`).
    - Implementada trava de segurança na UI para impedir evolução ou alteração de Pokémon em missão.
    - Adicionado feedback visual (badges e cadeados) para Pokémon ocupados.

## [V1.77.7] - 13/05/2026 09:23
### Corrigido
- **Forja & Navegação**:
    - Resolvido problema de notificações redundantes de novas receitas de forja (correção de sincronização de estado do inventário).
    - Corrigido erro de navegação no botão "CIDADE" que levava incorretamente ao menu de Rotas/Mapa.

## [V1.77.6] - 13/05/2026 09:00
### Corrigido
- **Balanceamento Global de Spawns**:
    - Padronização total da taxa de spawn de Pokémon iniciais (Starters) em todas as 9 gerações para **spawnWeight: 10** (~1% de chance).
    - Implementação de trava de progresso para todos os starters: agora só aparecem após a derrota do primeiro rival de sua respectiva região.
    - Regiões afetadas nesta etapa: Unova, Kalos, Alola, Galar e Paldea (Johto/Hoenn/Sinnoh já corrigidas na v1.77.5).

## [V1.77.5] - 13/05/2026 08:45
### Corrigido
- **Balanceamento de Spawns**:
    - Taxa de aparição dos Pokémon iniciais (Starters) em Johto, Hoenn e Sinnoh corrigida. O `spawnWeight` foi aumentado de 2 para 10, garantindo uma chance de ~1% por batalha (mesmo padrão de Kanto).
    - Nota: Requisito de derrota do rival Silver para liberar starters de Johto permanece ativo e documentado.

## [V1.77.4] - 13/05/2026 08:30
### Corrigido
- **Imagens e Ícones**:
    - Ícones de região (Johto/Hoenn/Alola/Paldea) atualizados para sprites dos lendários (Lugia, Rayquaza, Solgaleo, Koraidon).
    - Ícone do título `rival_breaker` corrigido para `scope-lens` (evitando erro 404).
    - Imagens de itens da Forja/Mart (`link_cable`, `poke_food`, `poke_food_premium`) migradas para o PokeAPI para maior confiabilidade.
- **UX/UI**:
    - Seleção de Títulos: Adicionado um delay de 200ms ao selecionar um título para permitir que o usuário veja a confirmação visual ("Ativo") antes do fechamento do modal.

## [V1.77.3] - 13/05/2026 07:10
### Corrigido
- **Sistema de Drops da Forja**: 
    - Implementado `TYPE_MATERIAL_MAP` que garante drop de materiais físicos baseados no tipo do Pokémon em qualquer região.
    - Expansão massiva do `FORGE_MATERIAL_DROP_GUIDE` com IDs de Pokémon de todas as 9 gerações (Aron, Gible, Tinkatink, etc.).
    - Fix: Materiais como Iron Ore, Silk e Feather agora estão acessíveis globalmente.

## [V1.77.2] - 13/05/2026 06:50
### Adicionado
- **Efeitos Visuais de Golpes**: Sistema de animação estilo Pokémon Showdown:
    - 120+ golpes com animações exclusivas usando sprites `/fx/`.
    - **MoveAnimationLayer**: Motor de animação com 12 tipos (projectile, burst, drain, quake, beam, slash, etc.).
    - **Fallback por Tipo**: Golpes sem animação definida usam um efeito visual padrão baseado no seu tipo elemental.
    - **Integração Visual**: Sistema desacoplado via CustomEvents entre a lógica de batalha e a interface.

## [V1.77.1] - 13/05/2026 06:30
### Adicionado
- **Efeitos Secundários de Golpes**: Implementação completa de efeitos para golpes de dano:
    - **Drain**: Recupera 50% do dano causado (Absorb, Giga Drain, etc.).
    - **Recoil**: Dano ao próprio usuário (Double-Edge, Brave Bird, etc.).
    - **Buffs de Stat**: Golpes que aumentam Ataque, Velocidade ou At. Especial (Power-Up Punch, Flame Charge, Torch Song).
    - **Chance de Status**: Chance de queimar, paralisar, envenenar, congelar ou confundir o inimigo ao causar dano.
    - **Debuffs Inimigos**: Chance de reduzir Defesa, Def. Especial ou Velocidade do oponente.
    - **Golpes Especiais**: Nuzzle (sempre paralisa), Fell Stinger (+3 Atk se nocautear), Syrup Bomb, etc.

## [V1.77.0] - 13/05/2026 10:30
### Adicionado
- **Expansão Massiva de TMs**: 40 novos TMs divididos em 4 tiers regionais, abrangendo todas as gerações.
- **Sistema de Materiais de Pokémon**: 12 novos materiais temáticos (ex: Ember Shard, Scale Dust, Thunder Fang) que dropam de famílias específicas de Pokémon.
- **Drop Global Inteligente**: Pokémon agora dropam seus materiais específicos em qualquer rota do jogo automaticamente.
- **Held Items Completos**: Expansão para 18 itens de bônus de tipo (Silk Scarf, Miracle Seed, etc.) + 4 itens especiais (Life Orb, Leftovers, Focus Sash, Expert Belt).
- **Efeitos de Batalha**: Implementação de recuo de Life Orb, cura passiva de Leftovers, bônus de Expert Belt e sobrevivência com Focus Sash.
- **Guia de Localização**: Dicas de onde encontrar as receitas de todos os 22 held items e 40 TMs integradas na UI da Forja.

## [V1.76.9] - 12/05/2026 18:36
### Publicado
- **Release Consolidado**: pacote final com Loja de Prestigio refinada, relatorio de Expedicoes corrigido e Minha Casa plantando em todos os slots disponiveis.
- **Versao Publica**: `package.json`, `package-lock.json`, `version.json`, `APP_VERSION` e Service Worker sincronizados para V1.76.9.

## [V1.76.8] - 12/05/2026 18:33
### Corrigido
- **Minha Casa**: plantio agora valida o canteiro selecionado e permite usar todos os slots disponiveis.
- **Sementes**: plantar consome 1 semente do inventario por slot, sem cobrar coins novamente.

## [V1.76.7] - 12/05/2026 18:27
### Corrigido
- **Relatorio de Expedicoes**: removido o modal antigo que piscava e podia impedir o fechamento correto.
- **Sprites no Relatorio**: itens coletados e Pokemon da equipe agora usam sprites com fallback estavel.
- **Fluxo de Expedicoes**: iniciar expedicao nao retorna mais automaticamente para a Cidade.
- **Duracao Escolhida**: multiplicador de duracao da expedicao agora e respeitado ao iniciar.

## [V1.76.6] - 12/05/2026 18:15
### Ajustado
- **Loja de Prestigio**: abas principais refinadas com sprites tematicos de Pokemon, subtitulos e destaque ativo.
- **Icones Quebrados**: adicionados fallbacks de Pokebola para sprites remotos que falharem.
- **Ginasio Proprio**: estandartes agora exibem icones ligados ao tipo/tema em vez de blocos simples.
- **Versao Publica**: cache PWA atualizado para V1.76.6.

## [V1.76.5] - 12/05/2026 17:58
### Corrigido
- **Batalhas de Historia**: adicionada confirmacao de destino apos vitorias contra Rival e Equipes.
- **Versao Publica**: `package.json`, `package-lock.json`, `version.json` e Service Worker sincronizados para V1.76.5.
- **Publicacao**: cache PWA atualizado para evitar exibir builds antigas.

## [V1.57.2] - 11/05/2026 21:28
### Adicionado
- **Sistema de Prestígio e Reputação**: Novo hub de progressão de fim de jogo centralizado na cidade.
- **Loja de Prestígio**: Interface tabulada com Troféus, Títulos, Visual (Molduras/Temas), Aliados, Mineração, Pesca e Ginásio.
- **Mineração Passiva**: Coleta automática de materiais a cada hora, com até 3 níveis de upgrade.
- **Aliados NPC Temporários**: Contratar aliados que aplicam bônus de dano/defesa/XP por tempo limitado.
- **Temas Visuais Premium**: Esquemas cromáticos que alteram variáveis CSS do jogo e concedem bônus passivos.
- **PokéCenter Doações**: Sistema de doação que converte moedas em curas gratuitas armazenadas.
- **Personalização de Ginásio**: Estandartes exclusivos para representar seu ginásio no cenário competitivo.

### Melhorado
- **UI Prestígio**: Redesign completo com glassmorphism, gradientes dinâmicos, animações de entrada e tipografia temática.
- **Molduras Pokédex e Títulos**: Cosméticos visuais colecionáveis desbloqueados por badges e moedas.

### Corrigido
- **ReferenceError: PrestigeShop is not defined**: Corrigido desbalanceamento de parênteses no AppRoot.jsx que impedia o Vite de transformar o arquivo, resultando em erro 500 e tela branca.
- **Z-index da barra de navegação**: Elevado para `z-[10001]` para garantir visibilidade sobre todos os modais.


### Correções de Código
- **Save Migration Fix**: Corrigido `TypeError` no `saveMigration.js` que impedia o carregamento do jogo devido a um nome de propriedade incorreto (`autoConfig` vs `autoCaptureConfig`).
- **Data Integrity**: Melhorada a resiliência do carregamento de saves antigos com suporte a mapeamento legado.

## [V1.56.3] - 11/05/2026 20:09
### Estabilidade de Desenvolvimento
- **SW Localhost Bypass**: O registro do Service Worker foi desativado em `localhost` e `127.0.0.1` para evitar conflitos com o HMR do Vite.
- **Service Worker Silent**: Adicionada trava de segurança no `sw.js` para não interceptar nenhuma requisição vinda de domínios locais.
- **Auto-Cleanup**: Atualizado `CACHE_NAME` para garantir a remoção de caches corrompidos.

## [V1.56.2] - 11/05/2026 20:04
### Correções Críticas
- **PWA Service Worker**: Corrigido erro `Failed to convert value to Response` que causava tela branca.
- **Dev Mode Stability**: O Service Worker agora ignora corretamente caminhos internos do Vite (`/@vite`, `node_modules`), evitando bloqueio no desenvolvimento local.
- **Cache Management**: Atualizado nome do cache para forçar renovação de ativos estáticos.

## [V1.56.1] - 11/05/2026 20:01
### Ajustes de Progressão
- **Victory Road Global**: Adicionada rota de Elite (Lv 74) ao template de regiões futuras para ponte final com a Elite Four.
- **Alola Fix**: Corrigido o nível da Kahili (Líder) de 100 para 80, eliminando a inversão de dificuldade antes da E4.
- **Template Core**: Refinamento dos requisitos de desbloqueio para fluxo linear de rotas.

## [V1.56.0] - 11/05/2026 19:58
### Balanceamento e Expansão
- **Johto Patch**: Corrigido o teto de nível das rotas finais (Ice Path, Dragon's Den, Victory Road) para eliminar o gap antes da Elite Four.
- **Hoenn Adjustments**: Suavizada a curva de nível de Tate & Liza e Wallace (Milotic).
- **Global Progression**: Adicionada rota intermediária (`route_mid` Lv 46) em todas as gerações futuras (Unova até Paldea).
- **Conteúdo Extra**: Integradas rotas icônicas (`extraRoutes`) em todas as regiões de Gen 5 a 9.
- **Template System**: Expansão do sistema `buildRegionRoutes` para melhor escalonamento de conteúdo.



## [V1.55.52] - 11/05/2026 19:18
### Adicionado
- Sistema de Shiny Stacking implementado (+5% stats por shiny repetido, cap em x10).
- Indicadores visuais de acúmulo (✨ xN) na UI de gerenciamento.
- Bloqueio de evoluções de gerações futuras em rotas regionais (Ex: Ursaluna em Kanto/Johto).
- Recalculo dinâmico de stats no level-up e evolução baseado no multiplicador de shiny.
- Sanitização de dados compatível com novos atributos de shiny.

### Corrigido
- Melhorias de estabilidade em expedições ao retornar Pokémon para o PC.

## [V1.55.8] - 09/05/2026 10:12
### Adicionado
- **Titulos de Shinies**: novos titulos para 1, 5, 25 e 100 Pokemon shiny capturados.
- **Titulos de Treinadores**: novos titulos para 10, 50, 100 e 250 vitorias contra treinadores.
- **Titulos de Historia VS**: novos titulos para superar rivais e derrotar equipes vilas.

### Atualizado
- **Progresso Permanente**: `shinyCapturedCount` e `trainerBattleWins` passam a ser salvos e sincronizados no perfil global.
- **Trainer Card**: a selecao de titulos agora considera capturas shiny, batalhas VS, historia, regioes, forja, boss e Pokedex.

## [V1.55.7] - 09/05/2026 10:08
### Adicionado
- **Titulos Personalizaveis no Trainer Card**: area ao lado do nome do treinador para exibir titulos com cores e icones proprios.
- **Desbloqueio por Progresso**: novos titulos por capturas totais, mestre de cada regiao, campeao de liga, forja e dano em Boss.
- **Selecao de Titulo**: o jogador pode abrir o modal de titulos desbloqueados e escolher qual titulo fica ativo no card.

### Atualizado
- **Perfil Global**: o titulo ativo e a Pokedex capturada passam a ser sincronizados para exibir o Trainer Card com progresso real no ranking.

## [V1.55.6] - 09/05/2026 10:01
### Atualizado
- **World Boss de 120s**: o Boss agora possui HP virtualmente inesgotavel e nao cai para zero antes do fim do cronometro.
- **Ranking Global de Boss**: o painel mostra top global, maior dano, pontuacao, tentativas e destaque da posicao do jogador quando ele aparece no top 25.
- **Pontuacao de Boss**: cada tentativa salva maior dano, ultimo dano, melhor pontuacao, ultima pontuacao, tentativas e Power Score do treinador.

### Corrigido
- **Fim da Batalha de Boss**: o resultado passa a depender do timer de 120 segundos, mantendo o objetivo como causar o maximo de dano possivel.

## [V1.55.5] - 09/05/2026 09:56
### Adicionado
- **Lista Completa de Materiais da Forja**: todos os materiais usados em receitas agora possuem guia de origem por Pokemon e rota.
- **Receitas como Drops Raros**: todas as receitas da forja agora geram itens `recipe_*` dropaveis por Pokemon tematicamente relacionados.
- **Auditoria da Forja**: novo comando `npm run audit-forge` valida receitas, materiais, guias de drop e Pokemon que dropam receitas.

### Atualizado
- **Fonte Unica da Forja**: guias de materiais, guias de receitas e tabela de drops raros foram centralizados em `src/data/recipes.js`.
- **Drops de Receita**: cada vitoria pode sortear uma receita rara relacionada ao Pokemon derrotado, com chance maior em shiny.
- **Click to Go**: a tela de forja usa a lista central para direcionar o jogador ate a rota onde a receita ou material pode ser dropado.

## [V1.55.4] - 09/05/2026 09:49
### Adicionado
- **Cobertura Regional Completa**: adicionadas rotas de Habitat Regional para Kanto, Johto, Hoenn, Sinnoh, Unova, Kalos, Alola, Galar e Paldea.
- **Todos os 1025 Pokemon Obtiveis**: cada Pokemon da Pokédex local agora aparece como selvagem em rota regional ou pode ser alcancado por evolucao.
- **Treino Nivel 100 por Regiao**: cada regiao ganhou uma rota final de treino nivel 100 apos a progressao pos-Liga.

### Atualizado
- **Progressao de Encontros**: habitats foram divididos em fases inicial, intermediaria, avancada e pos-Liga, aumentando nivel e raridade conforme o jogador progride.
- **Regioes Novas com Legado**: Unova em diante podem misturar alguns encontros de regioes antigas sem quebrar a liberacao principal por regiao.
- **Auditoria Estrita**: `npm run audit-content:strict` agora passa com cobertura completa de obtencao.

## [V1.55.3] - 09/05/2026 09:43
### Adicionado
- **Auditoria Permanente de Conteudo**: novo comando `npm run audit-content` valida Pokédex, referencias de rotas, evolucoes, backgrounds e cobertura de obtencao.
- **Modo Estrito Futuro**: `npm run audit-content:strict` ja fica preparado para bloquear release quando todos os 1025 Pokemon precisarem estar obtiveis.
- **Catalogo de Formas Alternativas**: adicionada estrutura inicial para formas regionais, variantes climaticas, lendarias, especiais e cosmeticas.

### Verificado
- **Pokedex Base**: confirmadas 1025 entradas locais, sem buracos de numeracao.
- **Backgrounds**: confirmadas 126 referencias de cenario sem arquivos ausentes.
- **Mapa de Lacunas**: auditoria identifica 577 Pokemon ainda nao obtiveis e 31 rotas com selvagens fora da regiao inferida, guiando a proxima etapa de conteudo.

## [V1.55.2] - 08/05/2026 17:29
### Atualizado
- **Lint de Produção**: a configuração agora ignora arquivos temporários e mantém o lint focado em erros práticos, permitindo validação limpa com `npm run lint -- --quiet`.
- **Qualidade do AppRoot**: removidos ramos constantes e componentes definidos dentro do render da Cidade, reduzindo risco de recriação desnecessária de UI.

### Corrigido
- **Cura Parcial de Status**: itens com lista de status curáveis agora removem somente os status previstos antes de cair na cura total.
- **Confirmações de Compra e Forja**: removidas condições constantes nos fluxos de Mart e Forja.
- **Validação Visual**: backgrounds seguem com todas as referências resolvidas.

## [V1.55.1] - 08/05/2026 17:05
### Atualizado
- **Build Otimizado**: separação de chunks para React, Firebase, vendors, dados grandes e telas principais, mantendo o bundle inicial abaixo do limite de alerta.
- **Auditoria de Saves Legados**: adicionada migração centralizada para normalizar badges, flags regionais, times regionais, inventário, casa, expedições, auto captura e dados de progresso.
- **Lint Mais Útil**: `scratch` saiu da varredura e regras ruidosas do React Compiler foram ajustadas para destacar problemas mais práticos.

### Corrigido
- **Inicialização do Save**: `gameState` agora é inicializado antes dos listeners de autenticação/cloud, evitando acesso estruturalmente inseguro ao `setGameState`.
- **Drops de Evolução**: removidas chaves duplicadas em fragmentos de evolução para preservar comportamento sem ambiguidade.
- **Dados de Galar**: corrigidos IDs com zero à esquerda nas batalhas de líderes.
- **Componentes React**: ajustados TrainerCard, brilho shiny da batalha e ação de evolução por item para evitar padrões problemáticos de hooks/componentes.

## [V1.55.0] - 08/05/2026 16:41
### Adicionado
- **Poder PS Global Completo**: cálculo centralizado considerando time ativo, PC, times regionais, expedições, casa, Pokédex capturada, shinies e insígnias de todas as regiões.
- **Modal Explicativo do Poder PS**: o trainer card agora explica a composição do PS e a régua de ranks Poké Ball, Great Ball, Ultra Ball e Master Ball.
- **Backgrounds Regionais Faltantes**: adicionados cenários para Battle Frontier, Ever Grande City e novas cavernas/elites de Unova, Kalos, Alola, Galar e Paldea.

### Corrigido
- **Botão Continuar Jornada**: o botão voltou a aparecer na tela inicial mesmo quando o time ativo está vazio, reconhecendo progresso por PC, times regionais, Pokédex, flags e insígnias.
- **Insígnias por Região no PS**: Johto, Hoenn, Sinnoh e regiões futuras agora entram no cálculo de pontuação e na exibição do modal.
- **Referências de Background**: verificação completa confirmou que não há mais `bg_*.png` referenciado sem arquivo em `public`.
- **Aliases de Background Legados**: restaurados arquivos `bg_*.png` usados por rotas, desafios e boss battles para evitar telas sem cenário.

### Atualizado
- **Régua de Rank PS**: ranks recalibrados para a escala global com todos os Pokémon e regiões.
- **Cache PWA**: service worker atualizado para `pokecraft-cache-v1.55.0`, forçando a troca dos assets antigos.
 
## [V1.54.0] - 06/05/2026 07:35
### Adicionado
- **Cenários Regionais Únicos (Gen 5-9)**: Implementados 10 novos backgrounds exclusivos e artísticos para Unova, Kalos, Alola, Galar e Paldea, eliminando os placeholders de Kanto.
- **Menu de Viagem Expandido**: Interface agora exibe abas para todas as 9 regiões, permitindo visualizar a progressão global do jogo.
- **Sistema de Múltiplas Evoluções**: Pokémon como Eevee agora possuem todas as ramificações evolutivas disponíveis (Vaporeon, Jolteon, Flareon, Espeon, Umbreon, Leafeon, Glaceon e Sylveon) com critérios específicos.
- **Critérios Ambientais**: Implementada evolução baseada no período do dia (Manhã/Dia vs Noite), necessária para Espeon e Umbreon.
- **Interface de Evolução Dinâmica**: O Guia de Evolução agora exibe múltiplos caminhos, permitindo visualizar requisitos de nível, pedras e horários simultaneamente.
 
### Corrigido
- **Sequência de Batalha**: Corrigido bug onde a equipe voltava para o primeiro Pokémon após uma derrota ou exaustão; agora o jogo segue a sequência correta (1 -> 2 -> 3...).
- **Estabilidade do Motor de Combate**: Resolvido problema de estado "stale" no ciclo de batalha, garantindo que as trocas automáticas e detecção de HP funcionem perfeitamente.
- **Evoluções de Sinnoh**: Corrigidas as rotas de evolução de Kirlia (Gallade) e Snorunt (Froslass) usando a Dawn Stone.

## [V1.53.0] - 05/05/2026 23:43
### Atualizado
- **Economia de Pokebolas**: Pokebolas, Great Balls e Ultra Balls ficaram bem mais caras no Mart; drops de Pokebola em batalha agora sao raros para valorizar fabricacao.
- **Forja sem Moedas**: Craft/Forja agora consome somente materiais, inclusive no modal de fabricacao em lote da cidade.
- **Expedicoes Regionais**: adicionada progressao por local, mastery por expedicao e locais liberados por regiao de Kanto ate Sinnoh.
- **Estrutura ate a 9a Geracao**: preparados desbloqueios e biomas futuros para Unova, Kalos, Alola, Galar e Paldea, ativados por flags regionais.
- **Cache PWA**: service worker atualizado para `pokecraft-cache-v1.53.0`, forçando a troca dos assets antigos.

## [V1.52.9] - 05/05/2026 18:48
### Corrigido
- **Rotas de Sinnoh**: cenarios atualizados para usar os assets salvos em `public`, incluindo Twinleaf, Sandgem, Jubilife, Eterna, Mt. Coronet, Snowpoint, Sunyshore e Victory Road.
- **Exp Share Regional**: Sinnoh agora nao herda insignias de Kanto/Johto/Hoenn; sem insignias proprias, nao ha compartilhamento regional automatico.
- **Cache PWA**: service worker atualizado para `pokecraft-cache-v1.52.9`, forçando a troca dos assets antigos.

## [V1.52.8] - 05/05/2026 14:32
### Atualizado
- **Versao Publica**: `package.json`, `package-lock.json`, `version.json` e constantes internas atualizados para `1.52.8`.
- **Cache PWA**: service worker atualizado para `pokecraft-cache-v1.52.8`, forçando a troca dos assets antigos.
- **Verificacao**: copia local conferida; nao foram encontrados arquivos com timestamp de alteracao em 05/05/2026 nesta pasta.

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
