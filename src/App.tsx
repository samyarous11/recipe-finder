import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import RecipeDetails from "./pages/RecipeDetails";
import Favorites from "./pages/Favorites";
import { randomRecipeId } from "./api";
import { toggleTheme, useAppDispatch, useAppSelector } from "./store";

export default function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useAppSelector((s) => s.theme);
  const favCount = useAppSelector((s) => s.favorites.length);
  const [busy, setBusy] = useState(false);

  const surprise = async () => {
    setBusy(true);
    try { navigate(`/recipe/${await randomRecipeId()}`); } finally { setBusy(false); }
  };

  return (
    <>
      <header className="site-header">
        <Link to="/" className="logo">Recipe<span>Finder</span></Link>
        <nav>
          <NavLink to="/" end>Search</NavLink>
          <NavLink to="/favorites">Favorites{favCount > 0 && <b className="badge">{favCount}</b>}</NavLink>
          <button className="ghost" onClick={surprise} disabled={busy}>Surprise me</button>
          <button className="ghost icon" onClick={() => dispatch(toggleTheme())}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<p className="status">Page not found. <Link to="/">Go home</Link>.</p>} />
        </Routes>
      </main>
    </>
  );
}
