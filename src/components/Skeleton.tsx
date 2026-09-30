export default function Skeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid" aria-busy="true" aria-label="Loading recipes">
      {Array.from({ length: count }, (_, i) => <div key={i} className="card skel" />)}
    </div>
  );
}
