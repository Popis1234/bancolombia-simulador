'use client';

import { useApp } from '@/context/AppContext';
import { ASSETS, formatCOP, formatPercent } from '@/lib/mockData';
import AssetCard from '@/components/AssetCard';
import Link from 'next/link';
import { useMemo } from 'react';

export default function HomePage() {
  const { user, totalPortfolioValue, totalPnL, totalPnLPercent, isLoading } = useApp();

  const topMovers = useMemo(() => {
    return [...ASSETS].sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h)).slice(0, 6);
  }, []);

  const categories = [
    { id: 'crypto', label: 'Criptomonedas', count: ASSETS.filter((a) => a.category === 'crypto').length },
    { id: 'stocks', label: 'Acciones', count: ASSETS.filter((a) => a.category === 'stocks').length },
    { id: 'commodities', label: 'Materias Primas', count: ASSETS.filter((a) => a.category === 'commodities').length },
    { id: 'forex', label: 'Divisas', count: ASSETS.filter((a) => a.category === 'forex').length },
    { id: 'indices', label: 'Índices', count: ASSETS.filter((a) => a.category === 'indices').length },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--bancolombia-yellow)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <section className="mb-10">
        <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--card-bg)] to-black p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--bancolombia-yellow)]">
                Simulador de Inversiones · Capital 100% virtual
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {user ? `Hola, ${user.name}` : 'Invierte sin riesgo'}
              </h1>
              <p className="mt-2 max-w-xl text-neutral-400">
                Experimenta con mercados globales usando dinero virtual. Explora activos, construye tu
                portafolio y descubre el poder del Copy Trading con el Plan Pro.
              </p>
            </div>

            {user ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:min-w-[420px]">
                <div className="rounded-xl bg-black/50 p-4">
                  <p className="text-xs text-neutral-400">Capital total</p>
                  <p className="mt-1 text-lg font-bold text-white">{formatCOP(totalPortfolioValue)}</p>
                </div>
                <div className="rounded-xl bg-black/50 p-4">
                  <p className="text-xs text-neutral-400">Disponible</p>
                  <p className="mt-1 text-lg font-bold text-white">{formatCOP(user.cash)}</p>
                </div>
                <div className="rounded-xl bg-black/50 p-4">
                  <p className="text-xs text-neutral-400">P&L</p>
                  <p
                    className={`mt-1 text-lg font-bold ${
                      totalPnL >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                    }`}
                  >
                    {formatCOP(totalPnL)}
                  </p>
                </div>
                <div className="rounded-xl bg-black/50 p-4">
                  <p className="text-xs text-neutral-400">Rentabilidad</p>
                  <p
                    className={`mt-1 text-lg font-bold ${
                      totalPnLPercent >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                    }`}
                  >
                    {formatPercent(totalPnLPercent)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/profile"
                  className="rounded-xl bg-[var(--bancolombia-yellow)] px-6 py-3 text-center font-bold text-black hover:bg-[var(--bancolombia-yellow-dark)]"
                >
                  Comenzar con $100.000.000 COP
                </Link>
                <p className="text-center text-xs text-neutral-500">Registro instantáneo · Sin datos reales</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Mercados</h2>
          <Link href="/markets" className="text-sm font-medium text-[var(--bancolombia-yellow)] hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/markets?cat=${cat.id}`}
              className="card-hover rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 text-center"
            >
              <p className="font-semibold text-white">{cat.label}</p>
              <p className="mt-1 text-xs text-neutral-400">{cat.count} activos</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-white">Movimientos destacados</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topMovers.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--bancolombia-yellow)]/30 bg-gradient-to-r from-[#1a1500] to-[var(--card-bg)] p-6 sm:p-8">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--bancolombia-yellow)]/10 blur-3xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-block rounded-full bg-[var(--bancolombia-yellow)]/20 px-3 py-1 text-xs font-bold text-[var(--bancolombia-yellow)]">
                EXCLUSIVO PLAN PRO
              </span>
              <h2 className="mt-3 text-2xl font-bold text-white">Copy Trading</h2>
              <p className="mt-2 max-w-lg text-neutral-300">
                Replica automáticamente las estrategias de los mejores inversionistas del mundo. Explora
                rankings, estadísticas y copia con un clic.
              </p>
            </div>
            <Link
              href="/copy-trading"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[var(--bancolombia-yellow)] px-6 py-3.5 font-bold text-black transition hover:bg-[var(--bancolombia-yellow-dark)]"
            >
              Explorar traders →
            </Link>
          </div>
        </div>
      </section>

      {user && user.positions.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Tu portafolio</h2>
            <Link href="/profile" className="text-sm text-[var(--bancolombia-yellow)] hover:underline">
              Ver detalle →
            </Link>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-black/50 text-neutral-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Activo</th>
                  <th className="px-4 py-3 font-medium">Cantidad</th>
                  <th className="px-4 py-3 font-medium">Precio prom.</th>
                  <th className="px-4 py-3 font-medium">Valor actual</th>
                  <th className="px-4 py-3 font-medium">P&L</th>
                </tr>
              </thead>
              <tbody>
                {user.positions.map((pos) => {
                  const value = pos.quantity * pos.currentPrice;
                  const cost = pos.quantity * pos.avgPrice;
                  const pnl = value - cost;
                  const pnlPct = (pnl / cost) * 100;
                  return (
                    <tr key={pos.assetId} className="border-t border-[var(--border)] hover:bg-white/5">
                      <td className="px-4 py-3">
                        <Link href={`/asset/${pos.assetId}`} className="font-medium text-white hover:text-[var(--bancolombia-yellow)]">
                          {pos.symbol}
                        </Link>
                        <p className="text-xs text-neutral-500">{pos.name}</p>
                      </td>
                      <td className="px-4 py-3 text-neutral-300">{pos.quantity.toFixed(6)}</td>
                      <td className="px-4 py-3 text-neutral-300">{formatCOP(pos.avgPrice)}</td>
                      <td className="px-4 py-3 text-white">{formatCOP(value)}</td>
                      <td className={`px-4 py-3 font-medium ${pnl >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                        {formatCOP(pnl)} ({formatPercent(pnlPct)})
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
