import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { byCategory, getCategories, searchRecipes } from "../api";
import { useFetch } from "../hooks/useFetch";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import Skeleton from "../components/Skeleton";
import { Empty, ErrorMessage } from "../components/Status";

const PAGE = 12;

export default function Home() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q");
  const cat = params.get("c") ?? (q ? null : "Dessert");
  const [visible, setVisible] = useState(PAGE);
  const [sort, setSort] = useState<"default" | "az">("default");

  const categories = useFetch(getCategories, "categories");
  const key = q ? `q:${q}` : cat ? `c:${cat}` : null;
  const { data, loading, error } = useFetch(
    () => (q ? searchRecipes(q) : byCategory(cat!)), key);

  useEffect(() => { setVisible(PAGE); }, [key]);

  const list = data ? (sort === "az" ? [...data].sort((a, b) => a.strMeal.localeCompare(b.strMeal)) : data) : [];

  return (
    <>
      <section className="hero">
        <h1>Find something delicious to cook tonight.</h1>
        <p>Search by dish or ingredient, or browse a category.</p>
        <SearchBar initial={q ?? ""} onSearch={(v) => setParams({ q: v })} />
      </section>

      <div className="chips" role="group" aria-label="Categories">
        {categories.data?.map((c) => (
          <button key={c} className={`chip ${!q && cat === c ? "active" : ""}`}
            onClick={() => setParams({ c })}>{c}</button>
        ))}
      </div>

      <div className="toolbar">
        <h2>{q ? `Results for “${q}”` : `${cat} recipes`}{data && <small> {data.length} found</small>}</h2>
        <select value={sort} onChange={(e) => setSort(e.target.value as "default" | "az")} aria-label="Sort recipes">
          <option value="default">Default order</option>
          <option value="az">A → Z</option>
        </select>
      </div>

      {loading && <Skeleton />}
      {error && <ErrorMessage message={error} />}
      {q && data && data.length === 0 && <Empty query={q} />}
      {list.length > 0 && (
        <>
          <section className="grid" aria-label="Recipes">
            {list.slice(0, visible).map((r) => <RecipeCard key={r.idMeal} recipe={r} />)}
          </section>
          {visible < list.length && (
            <button className="more" onClick={() => setVisible((v) => v + PAGE)}>
              Show more ({list.length - visible} left)
            </button>
          )}
        </>
      )}
    </>
  );
}
