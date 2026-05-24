import { describe, expect, it } from 'vitest';
import { CRAFTING_RECIPES, FORGE_MATERIAL_DROP_GUIDE } from '../data/recipes';

const allRecipes = Object.values(CRAFTING_RECIPES).flat();

describe('Forge material guides', () => {
  it('todo material usado em receita possui guia de origem', () => {
    const materials = [...new Set(allRecipes.flatMap(recipe =>
      Object.keys(recipe.cost || {}).filter(material => material !== 'currency')
    ))];

    const missingGuides = materials.filter(material => !FORGE_MATERIAL_DROP_GUIDE[material]);
    expect(missingGuides).toEqual([]);
  });

  it('usa oran_berry como chave canonica da Oran Berry nas receitas', () => {
    const recipesUsingLegacyKey = allRecipes
      .filter(recipe => recipe.cost?.berry_oran)
      .map(recipe => recipe.id);

    expect(recipesUsingLegacyKey).toEqual([]);
  });
});
