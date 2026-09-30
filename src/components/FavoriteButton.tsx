import { toggleFavorite, useAppDispatch, useAppSelector } from "../store";
import type { RecipeSummary } from "../types";

export default function FavoriteButton({ recipe, label }: { recipe: RecipeSummary; label?: boolean }) {
  const dispatch = useAppDispatch();
  const active = useAppSelector((s) => s.favorites.some((r) => r.idMeal === recipe.idMeal));
  return (
    <button
      className={`fav ${active ? "on" : ""}`}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Save to favorites"}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch(toggleFavorite(recipe)); }}
    >
      {active ? "♥" : "♡"}{label && <span> {active ? "Saved" : "Save recipe"}</span>}
    </button>
  );
}
