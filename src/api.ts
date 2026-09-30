import type { RecipeDetails, RecipeSummary } from "./types";

const BASE = "https://www.themealdb.com/api/json/v1/1";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json() as Promise<T>;
}

/** Search by recipe name first; if nothing matches, fall back to ingredient. */
export async function searchRecipes(query: string): Promise<RecipeSummary[]> {
  const q = encodeURIComponent(query.trim());
  const byName = await get<{ meals: RecipeSummary[] | null }>(`/search.php?s=${q}`);
  if (byName.meals?.length) return byName.meals;
  const byIngredient = await get<{ meals: RecipeSummary[] | null }>(
    `/filter.php?i=${q.replace(/%20/g, "_")}`
  );
  return byIngredient.meals ?? [];
}

export async function getRecipe(id: string): Promise<RecipeDetails | null> {
  const data = await get<{ meals: Record<string, string | null>[] | null }>(`/lookup.php?i=${id}`);
  const m = data.meals?.[0];
  if (!m) return null;

  const ingredients = Array.from({ length: 20 }, (_, i) => ({
    name: (m[`strIngredient${i + 1}`] ?? "").trim(),
    measure: (m[`strMeasure${i + 1}`] ?? "").trim(),
  })).filter((i) => i.name);

  return {
    id: m.idMeal!,
    name: m.strMeal!,
    image: m.strMealThumb!,
    category: m.strCategory ?? "",
    area: m.strArea ?? "",
    instructions: (m.strInstructions ?? "")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean),
    ingredients,
    youtube: m.strYoutube || undefined,
  };
}

export async function getCategories(): Promise<string[]> {
  const d = await get<{ meals: { strCategory: string }[] }>("/list.php?c=list");
  return d.meals.map((c) => c.strCategory);
}

export async function byCategory(cat: string): Promise<RecipeSummary[]> {
  const d = await get<{ meals: RecipeSummary[] | null }>(`/filter.php?c=${encodeURIComponent(cat)}`);
  return d.meals ?? [];
}

export async function randomRecipeId(): Promise<string> {
  const d = await get<{ meals: { idMeal: string }[] }>("/random.php");
  return d.meals[0].idMeal;
}
