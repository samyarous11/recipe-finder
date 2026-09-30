import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getRecipe } from "../api";
import { useFetch } from "../hooks/useFetch";
import { ErrorMessage, Loading } from "../components/Status";
import FavoriteButton from "../components/FavoriteButton";

export default function RecipeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: r, loading, error } = useFetch(() => getRecipe(id!), id ?? null);
  const [have, setHave] = useState<Set<string>>(new Set());
  const [done, setDone] = useState<Set<number>>(new Set());

  const flip = <T,>(set: Set<T>, v: T, apply: (s: Set<T>) => void) => {
    const n = new Set(set); n.has(v) ? n.delete(v) : n.add(v); apply(n);
  };

  return (
    <article className="details">
      <button className="back" onClick={() => navigate(-1)}>← Back</button>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && r === null && <p className="status">Recipe not found. <Link to="/">Search again</Link>.</p>}
      {r && (
        <>
          <div className="details-head">
            <img src={r.image} alt={r.name} />
            <div>
              <div className="tags">
                {r.category && <Link to={`/?c=${r.category}`} className="chip">{r.category}</Link>}
                {r.area && <span className="chip static">{r.area}</span>}
              </div>
              <h1>{r.name}</h1>
              <p className="meta">{r.ingredients.length} ingredients · {r.instructions.length} steps</p>
              <div className="actions">
                <FavoriteButton label recipe={{ idMeal: r.id, strMeal: r.name, strMealThumb: r.image }} />
                {r.youtube && <a className="ghost" href={r.youtube} target="_blank" rel="noreferrer">Watch video</a>}
                <button className="ghost" onClick={() => window.print()}>Print</button>
              </div>
            </div>
          </div>
          <div className="details-body">
            <section>
              <h2>Ingredients <small>{have.size}/{r.ingredients.length} ready</small></h2>
              <ul className="checks">
                {r.ingredients.map((i) => (
                  <li key={i.name}>
                    <label>
                      <input type="checkbox" checked={have.has(i.name)} onChange={() => flip(have, i.name, setHave)} />
                      <span><strong>{i.measure}</strong> {i.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2>Instructions <small>{done.size}/{r.instructions.length} done</small></h2>
              <ol className="steps">
                {r.instructions.map((s, n) => (
                  <li key={n} className={done.has(n) ? "done" : ""} onClick={() => flip(done, n, setDone)}>{s}</li>
                ))}
              </ol>
            </section>
          </div>
        </>
      )}
    </article>
  );
}
