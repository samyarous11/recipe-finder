import { useEffect, useRef, useState, type FormEvent } from "react";

interface Props {
  initial: string;
  onSearch: (q: string) => void;
}

/** Search as you type (400 ms debounce) or press Enter. */
export default function SearchBar({ initial, onSearch }: Props) {
  const [value, setValue] = useState(initial);
  const first = useRef(true);

  useEffect(() => { setValue(initial); }, [initial]);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const q = value.trim();
    if (q.length < 2 || q === initial) return;
    const t = setTimeout(() => onSearch(q), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <form className="search" onSubmit={submit} role="search">
      <label htmlFor="q" className="sr-only">Recipe name or ingredient</label>
      <input id="q" value={value} onChange={(e) => setValue(e.target.value)}
        placeholder="Search a dish or an ingredient: chicken, rice, tart…" />
      {value && <button type="button" className="clear" aria-label="Clear search" onClick={() => setValue("")}>×</button>}
      <button type="submit" className="primary">Search</button>
    </form>
  );
}
