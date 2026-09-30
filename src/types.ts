export interface RecipeSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface Ingredient {
  name: string;
  measure: string;
}

export interface RecipeDetails {
  id: string;
  name: string;
  image: string;
  category: string;
  area: string;
  instructions: string[];
  ingredients: Ingredient[];
  youtube?: string;
}
