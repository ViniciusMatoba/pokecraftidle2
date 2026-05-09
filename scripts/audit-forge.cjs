const path = require('path');
const { pathToFileURL } = require('url');

const ROOT = path.resolve(__dirname, '..');

(async () => {
  const recipesModule = await import(pathToFileURL(path.join(ROOT, 'src/data/recipes.js')).href);
  const {
    CRAFTING_RECIPES,
    FORGE_MATERIAL_DROP_GUIDE,
    FORGE_RECIPE_DROP_BY_POKEMON,
    FORGE_RECIPE_DROP_GUIDE,
    FORGE_RECIPE_IDS,
  } = recipesModule;

  const allRecipes = Object.values(CRAFTING_RECIPES).flat();
  const recipeIds = [...new Set(allRecipes.map(recipe => recipe.id))];
  const costMaterials = [...new Set(allRecipes.flatMap(recipe =>
    Object.keys(recipe.cost || {}).filter(material => material !== 'currency')
  ))].sort();

  const recipeDropsByPokemon = new Set(Object.values(FORGE_RECIPE_DROP_BY_POKEMON).flat());
  const missingMaterialGuides = costMaterials.filter(material => !FORGE_MATERIAL_DROP_GUIDE[material]);
  const missingRecipeGuides = recipeIds.filter(recipeId => !FORGE_RECIPE_DROP_GUIDE[recipeId]);
  const missingPokemonDrops = recipeIds.filter(recipeId => !recipeDropsByPokemon.has(`recipe_${recipeId}`));
  const missingGatedIds = recipeIds.filter(recipeId => !FORGE_RECIPE_IDS.includes(recipeId));

  console.log('\nForge audit');
  console.log('-----------');
  console.log(`Receitas: ${recipeIds.length}`);
  console.log(`Materiais usados em receitas: ${costMaterials.length}`);
  console.log(`Materiais com guia de drop: ${Object.keys(FORGE_MATERIAL_DROP_GUIDE).length}`);
  console.log(`Receitas com guia de drop raro: ${Object.keys(FORGE_RECIPE_DROP_GUIDE).length}`);
  console.log(`Pokemon com drops de receita: ${Object.keys(FORGE_RECIPE_DROP_BY_POKEMON).length}`);

  console.log('\nLista de materiais de forja e origem:');
  costMaterials.forEach(material => {
    const guide = FORGE_MATERIAL_DROP_GUIDE[material];
    console.log(`  - ${material}: ${guide?.label || 'SEM GUIA'}`);
  });

  const failures = [
    missingMaterialGuides.length && `Materiais sem guia: ${missingMaterialGuides.join(', ')}`,
    missingRecipeGuides.length && `Receitas sem guia raro: ${missingRecipeGuides.join(', ')}`,
    missingPokemonDrops.length && `Receitas sem Pokemon dropando: ${missingPokemonDrops.join(', ')}`,
    missingGatedIds.length && `Receitas fora do gate: ${missingGatedIds.join(', ')}`,
  ].filter(Boolean);

  if (failures.length) {
    console.log('\nFalhas:');
    failures.forEach(failure => console.log(`  - ${failure}`));
    process.exit(1);
  }
})();
