// src/components/TestQueryComponent.tsx
import { useQuery } from "@/hooks/useQuery"

export default function TestQueryComponent() {
  const { query, setQuery, toQueryString } = useQuery({ page: 1, category: "vacuna" });

  return (
    <div>
      <h1 data-cy="query-string">Query: {toQueryString()}</h1>
      <button data-cy="set-category" onClick={() => setQuery(prev => ({ ...prev, category: "productos" }))}>
        Cambiar Categoría a productos
      </button>
    </div>
  );
}
