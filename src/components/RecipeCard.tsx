import { Link } from "react-router-dom";
import type { RecipeSummary } from "../types";
import FavoriteButton from "./FavoriteButton";

export default function RecipeCard({ recipe }: { recipe: RecipeSummary }) {
  return (
    <Link to={`/recipe/${recipe.idMeal}`} className="card">
      <div className="thumb">
        <img src={`${recipe.strMealThumb}/preview`} alt={recipe.strMeal} loading="lazy" />
        <FavoriteButton recipe={recipe} />
      </div>
      <h3>{recipe.strMeal}</h3>
    </Link>
  );
}
