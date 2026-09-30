import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { useAppSelector } from "../store";

export default function Favorites() {
  const favs = useAppSelector((s) => s.favorites);
  return (
    <section className="favs">
      <h1>Your favorites</h1>
      {favs.length === 0 ? (
        <p className="status">Nothing saved yet. Tap the heart on any recipe to keep it here. <Link to="/">Browse recipes</Link>.</p>
      ) : (
        <div className="grid">{favs.map((r) => <RecipeCard key={r.idMeal} recipe={r} />)}</div>
      )}
    </section>
  );
}
