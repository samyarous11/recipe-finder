export function Loading() {
  return <p className="status" role="status">Loading…</p>;
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="status error" role="alert">
      Couldn’t load recipes: {message}. Check your connection and try again.
    </p>
  );
}

export function Empty({ query }: { query: string }) {
  return (
    <p className="status">
      No recipes found for “{query}”. Try a simpler word, like an ingredient name.
    </p>
  );
}
