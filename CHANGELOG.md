# Changelog - PokeCraft

## [1.55.35] - 11/05/2026 14:58
### Fixed
- Atualizado o filtro de ordenação por Nº Pokédex no PC e na Equipe para ser dinâmico (ex: 1-151, 1-251, 1-386) de acordo com o progresso das regiões desbloqueadas.
- Implementado isolamento regional para Pokémon Iniciais: eles agora só aparecem como encontros selvagens em suas respectivas regiões de origem, evitando "leaks" de Bulbasaur, Charmander, etc., em rotas de gerações futuras (via sistema de encontros Legacy).

## [1.55.34] - 11/05/2026 14:48
### Fixed
- Reajustada a sequência das rotas no mapa: agora elas seguem estritamente a ordem de dificuldade (nível médio dos Pokémon).
- Implementado agrupamento sequencial no Travel Screen para garantir que rotas de alto nível não apareçam no início da lista apenas por pertencerem a um grupo comum (como habitats de Pokédex).

## [1.55.33] - 11/05/2026 14:34
### Fixed
- Corrigida a unificação de espécie que criava duplicatas ao capturar Pokémon que estavam em times de outras regiões.
- Integrados os times regionais (Kanto, etc) na aba de PC Storage. Agora todos os seus Pokémon são visíveis no PC, marcados com a sigla da região de origem.
- Corrigida a lógica de movimentação de Pokémon entre o PC e o time para suportar a retirada de Pokémon "estacionados" em outras regiões.

## [1.55.32] - 11/05/2026 14:31
### Fixed
- Corrigido o botão "Configurar Rota" no Painel Automático que não abria o modal.
- O modal de Auto-Captura agora pode ser aberto em qualquer lugar (como Cidades) e lembrará da última rota de treino visitada.
- Removido fechamento automático agressivo do modal de configuração de captura.

## [1.55.31] - 11/05/2026 14:26
### Fixed
- Corrigido bloqueio de progressão em Johto onde rotas apareciam trancadas.
- Level Cap agora é liberado para 100 automaticamente ao se tornar campeão da região.
- Restaurados sons de Centro Pokémon, Level Up e Derrota.
- Melhorada estabilidade e loop da música de fundo (BGM).
- Corrigido fechamento do modal Poder do Treinador (Poder PS).
