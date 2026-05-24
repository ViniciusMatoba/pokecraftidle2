import { describe, expect, it } from 'vitest';
import { ROUTES } from '../data/routes';
import { applyRegionalFormMetadata } from '../data/regionalForms';

const byId = (routeId, id) => ROUTES[routeId].enemies.find(enemy => Number(enemy.id) === Number(id));

describe('regionalForms - rotas e encontros', () => {
  it('usa Vulpix/Sandshrew de Alola em Mount Lanakila', () => {
    expect(byId('alola_mount_lanakila', 37)).toMatchObject({ formKey: 'vulpix-alola', formRegion: 'alola' });
    expect(byId('alola_mount_lanakila', 38)).toMatchObject({ formKey: 'ninetales-alola', formRegion: 'alola' });
    expect(byId('alola_mount_lanakila', 28)).toMatchObject({ formKey: 'sandslash-alola', formRegion: 'alola' });
  });

  it('marca outras formas regionais canonicas nas rotas de Alola e Galar', () => {
    expect(byId('alola_verdant_cavern', 19)).toMatchObject({ formKey: 'rattata-alola' });
    expect(byId('alola_wela_volcano', 105)).toMatchObject({ formKey: 'marowak-alola' });
    expect(byId('alola_aether_paradise', 89)).toMatchObject({ formKey: 'muk-alola' });
    expect(byId('alola_vast_poni_canyon', 103)).toMatchObject({ formKey: 'exeggutor-alola' });
    expect(byId('galar_wild_area_south', 263)).toMatchObject({ formKey: 'zigzagoon-galar' });
    expect(byId('galar_route_5', 865)).toMatchObject({ id: 865 });
  });

  it('aplica nome, tipo e sprite da forma regional sem trocar o id base', () => {
    const vulpix = applyRegionalFormMetadata({ id: 37, name: 'Vulpix', types: ['Fire'] }, 'vulpix-alola');
    expect(vulpix).toMatchObject({
      id: 37,
      name: 'Vulpix Alola',
      type: 'Ice',
      types: ['Ice'],
      formKey: 'vulpix-alola',
      formSpriteId: 10103,
      isRegionalForm: true,
    });
  });
});
