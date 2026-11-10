'use client';

import { useSearchParams } from 'next/navigation';
import { ASSETS, AssetCategory } from '@/lib/mockData';
import AssetCard from '@/components/AssetCard';
import { useMemo, useState, Suspense } from 'react';

const CATEGORIES: { id: AssetCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'crypto', label: 'Cripto' },
  { id: 'stocks', label: 'Acciones' },
  { id: 'commodities', label: 'Materias Primas' },
  { id: 'forex', label: 'Divisas' },
  { id: 'indices', label: 'Índices' },
];

function MarketsContent() {
  const searchParams = useSearchParams();
  const initialCat = (searchParams.get('cat') as AssetCategory) || 'all';
  const [category, setCategory] = useState<AssetCategory | 'all'>(initialCat);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return ASSETS.filter((a) => {
      const matchCat = category === 'all' || a.category === category;
      const matchSearch =
        !search ||
        a.symbol.toLowerCase().includes(search.toLowerCase()) ||
        a.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [category, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Mercados</h1>
        <p className="mt-1 text-neutral-400">
          Explora activos simulados. Precios y variaciones son ficticios con fines educativos.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                category === c.id
                  ? 'bg-[var(--bancolombia-yellow)] text-black'
                  : 'bg-[var(--card-bg)] text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Buscar activo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-[var(--bancolombia-yellow)] focus:outline-none sm:w-64"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-neutral-500">No se encontraron activos.</p>
      )}
    </div>
  );
}

export default function MarketsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-neutral-400">Cargando mercados...</div>}>
      <MarketsContent />
    </Suspense>
  );
}
