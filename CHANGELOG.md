# Changelog - PokeCraft

## [V1.55.23] - 10/05/2026 19:26
### Corrigido
- **Continuar Jornada**: o botao agora carrega o save mais completo entre dispositivo e nuvem, sem depender de estado temporario da tela.
- **Backup Local de Save**: cada salvamento passa a gravar tambem uma copia de seguranca no navegador.
- **Times Regionais**: ao carregar saves com `team` vazio, o jogo restaura automaticamente o time salvo da regiao ativa.

## [V1.55.22] - 10/05/2026 19:21
### Implementado
- **Drops de Sementes de Apricorn**: rotas agora podem dropar sementes de Apricorn para alimentar a forja de Pokebolas especiais.
- **Jardim da Casa**: Apricorns agora usam sementes dedicadas no plantio, igual ao fluxo das berries.
- **Progressao de Drops**: sementes comuns aparecem mais cedo, enquanto Pink/Black Apricorn ficam ligadas a encontros mais avancados.

## [V1.55.21] - 10/05/2026 19:17
### Implementado
- **Drops de Sementes**: berries agora possuem sementes dedicadas que podem cair em batalhas de rota.
- **Jardim da Casa**: plantar berries consome uma semente, mantendo compatibilidade com saves que ainda tenham berries antigas como sementes.
- **Progressao de Raridade**: sementes comuns aparecem cedo; Sitrus e Lum ficam ligadas a niveis/encounters mais avancados.

## [V1.55.20] - 10/05/2026 18:50
### Corrigido
- **Salvar Jogo**: o botao do menu agora confirma imediatamente o save local.
- **Sincronizacao em Nuvem**: envio para Firebase acontece em segundo plano, sem travar o feedback do jogador.
- **Protecao de Progresso**: falha da nuvem nao impede mais que o jogador veja que o progresso ficou salvo no dispositivo.

## [V1.55.19] - 10/05/2026 18:40
### Corrigido
- **Salvamento de Progresso**: save local agora e persistido em toda mudanca real depois da hidratacao.
- **Salvar Jogo**: o botao salva primeiro no dispositivo e sincroniza na nuvem depois, preservando progresso se a nuvem falhar.
- **Carregamento de Save**: removido listener duplicado de nuvem que podia competir com o save local/nuvem escolhido.

## [V1.55.18] - 10/05/2026 16:10
### Corrigido
- **Continuar Jornada**: agora compara save local e nuvem, carregando o progresso mais completo.
- **Protecao de Save**: o `localStorage` nao e sobrescrito por estado vazio enquanto o jogo ainda esta carregando.
- **Autosave**: sincronizacao automatica ignora estados vazios acidentais para evitar perda de progresso.

## [V1.55.17] - 10/05/2026 16:04
### Corrigido
- **Receitas de Forja**: receitas ja obtidas nao dropam novamente e nao exibem notificacao repetida.
- **Rotas de Receita**: cada receita agora usa a rota do material principal necessario para sua propria forja.
- **Encontros de Kanto**: evolucao automatica de selvagens respeita a geracao da rota, evitando especies futuras em Kanto.

## [V1.55.16] - 10/05/2026 12:02
### Corrigido
- **Forja e Rotas**: receitas que dropam em rotas agora respeitam o mesmo bloqueio de progressao das rotas.
- **Ir Dropar Receita**: o botao nao envia mais o jogador para uma rota ainda travada.
- **Save Antigo**: migracao separa `autoConfig` e `autoCaptureConfig`, evitando erro ao carregar saves anteriores.

## [V1.55.15] - 10/05/2026 11:59
### Corrigido
- **Forja e Rotas**: receitas que dropam em rotas agora respeitam o mesmo bloqueio de progressao das rotas.
- **Ir Dropar Receita**: o botao nao envia mais o jogador para uma rota ainda travada.
- **Guia de Receita**: a forja passa a indicar quando a rota da receita ainda precisa ser desbloqueada.

## [V1.55.14] - 10/05/2026 11:51
### Corrigido
- **Continuar Jornada**: o jogo nao reinicia mais quando a nuvem nao retorna save, usando o progresso local como fallback seguro.
- **Carregamento de Save**: login/autenticacao preservam o `localStorage` antes de cair para estado novo.

## [V1.55.13] - 10/05/2026 11:48
### Adicionado
- **Mega Stones Completas**: adicionadas todas as Mega Stones oficiais disponiveis como itens de forja, incluindo variacoes X/Y.
- **Mega Forma Permanente**: ao equipar uma Mega Stone compativel uma vez, o Pokemon desperta a Mega Forma para sempre.

### Atualizado
- **Drops Mega**: receitas e Fragmentos Mega agora consideram todos os Pokemon com potencial Mega.
- **Bonus Mega**: a batalha considera a Mega Forma permanente mesmo se a pedra for removida depois.

## [V1.55.12] - 10/05/2026 11:42
### Adicionado
- **Itens Segurados**: Pokemon agora podem equipar e remover Hold Items pela tela de detalhes da equipe/PC.
- **Mega Stones**: adicionadas Venusaurite, Charizardite X, Blastoisinite, Lucarionite, Gardevoirite e Metagrossite como itens forjaveis.
- **Fragmentos Mega**: Pokemon com potencial Mega podem dropar Fragmento Mega raro.
- **Receitas Mega**: cada Mega Stone exige uma receita rara dropada por Pokemon com potencial Mega, alem de varios fragmentos.

### Atualizado
- **Batalha**: Hold Items aplicam bonus de tipo, itens de boss continuam funcionando e Mega Stones ativam bonus ofensivo/defensivo quando equipadas no Pokemon correto.

## [V1.55.11] - 10/05/2026 11:30
### Adicionado
- **Drop de Receitas**: ao dropar uma receita rara de forja, o jogo agora abre uma janela exibindo a receita encontrada.
- **Acesso Direto a Forja**: a janela de receita tem botao para abrir a Forja diretamente na categoria do item desbloqueado.

### Corrigido
- **Tela de Login**: textos e icones quebrados por codificacao foram substituidos por textos limpos e icones estaveis.

## [V1.55.10] - 10/05/2026 11:11
### Corrigido
- **Forja / Ir Dropar Receita**: receitas comuns como Poke Ball, Great Ball, Ultra Ball, Repels, Iscas, racoes e varas agora apontam para rotas de Kanto.
- **Progressao de Rotas**: rotas de treino passam a respeitar requisitos e nivel do time antes de liberarem conteudo mais alto.
- **Encontros Raros**: familias de Pokemon iniciais de todas as geracoes ficaram muito mais raras nos encontros selvagens.

### Adicionado
- **Metal Coat**: nova receita rara de Johto, dropada em Rotas 38 e 39 por Pokemon de aco como Magnemite e Skarmory.

## [V1.55.9] - 09/05/2026 10:23
### Corrigido
- **Botao de Instalacao**: removido o estado visual "Preparando instalacao..." quando o navegador nao oferece prompt PWA.
- **Fallback PWA**: ao clicar no botao sem prompt disponivel, o jogo exibe orientacao manual para instalar pelo menu do navegador.

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
