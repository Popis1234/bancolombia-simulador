'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCOP, formatPercent } from '@/lib/mockData';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, login, logout, totalPortfolioValue, totalPnL, totalPnLPercent, pauseCopy, stopCopy } = useApp();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
        <h1 className="text-2xl font-bold text-white">Ingresar / Registrarse</h1>
        <p className="mt-2 text-center text-neutral-400">
          Crea una cuenta de demostración. Todo se guarda localmente en tu navegador.
        </p>
        <form
          className="mt-8 w-full space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (email) login(email, name || undefined);
          }}
        >
          <div>
            <label className="text-sm text-neutral-400">Nombre (opcional)</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-4 py-2.5 text-white"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="text-sm text-neutral-400">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-4 py-2.5 text-white"
              placeholder="demo@bancolombia.com"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-[var(--bancolombia-yellow)] py-3 font-bold text-black hover:bg-[var(--bancolombia-yellow-dark)]"
          >
            Entrar al simulador
          </button>
        </form>
        <p className="mt-4 text-xs text-neutral-500">
          Al ingresar recibes $100.000.000 COP virtuales de inmediato.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Mi cuenta</h1>
          <p className="text-neutral-400">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-neutral-300 hover:border-red-500 hover:text-red-400"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Summary cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5">
          <p className="text-xs text-neutral-400">Capital total</p>
          <p className="mt-1 text-xl font-bold text-white">{formatCOP(totalPortfolioValue)}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5">
          <p className="text-xs text-neutral-400">Disponible</p>
          <p className="mt-1 text-xl font-bold text-white">{formatCOP(user.cash)}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5">
          <p className="text-xs text-neutral-400">P&L acumulado</p>
          <p className={`mt-1 text-xl font-bold ${totalPnL >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
            {formatCOP(totalPnL)}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5">
          <p className="text-xs text-neutral-400">Plan</p>
          <p className="mt-1 text-xl font-bold uppercase text-[var(--bancolombia-yellow)]">{user.plan}</p>
          {user.planExpiresAt && (
            <p className="text-xs text-neutral-500">
              Vence: {new Date(user.planExpiresAt).toLocaleDateString('es-CO')}
            </p>
          )}
        </div>
      </div>

      {/* Positions */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold text-white">Posiciones abiertas</h2>
        {user.positions.length === 0 ? (
          <p className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 text-center text-neutral-500">
            Aún no tienes posiciones.{' '}
            <Link href="/markets" className="text-[var(--bancolombia-yellow)] hover:underline">
              Explorar mercados
            </Link>
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-black/50 text-neutral-400">
                <tr>
                  <th className="px-4 py-3">Activo</th>
                  <th className="px-4 py-3">Cantidad</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">P&L</th>
                </tr>
              </thead>
              <tbody>
                {user.positions.map((pos) => {
                  const value = pos.quantity * pos.currentPrice;
                  const pnl = value - pos.quantity * pos.avgPrice;
                  return (
                    <tr key={pos.assetId} className="border-t border-[var(--border)]">
                      <td className="px-4 py-3">
                        <Link href={`/asset/${pos.assetId}`} className="font-medium text-white hover:text-[var(--bancolombia-yellow)]">
                          {pos.symbol}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-neutral-300">{pos.quantity.toFixed(6)}</td>
                      <td className="px-4 py-3 text-white">{formatCOP(value)}</td>
                      <td className={`px-4 py-3 ${pnl >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                        {formatCOP(pnl)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Copied strategies */}
      {user.copiedStrategies.filter((c) => c.status !== 'stopped').length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-white">Estrategias copiadas</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {user.copiedStrategies
              .filter((c) => c.status !== 'stopped')
              .map((c) => (
                <div key={c.traderId} className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white">{c.traderName}</h3>
                    <span className={`rounded px-2 py-0.5 text-xs ${c.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-400">
                    Capital: {formatCOP(c.allocatedCapital)} · Valor: {formatCOP(c.currentValue)}
                  </p>
                  <p className={`text-sm ${c.pnl >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                    P&L: {formatCOP(c.pnl)} ({formatPercent(c.pnlPercent)})
                  </p>
                  <div className="mt-3 flex gap-2">
                    {c.status === 'active' && (
                      <button
                        onClick={() => pauseCopy(c.traderId)}
                        className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-neutral-300"
                      >
                        Pausar
                      </button>
                    )}
                    <button
                      onClick={() => stopCopy(c.traderId)}
                      className="rounded-lg border border-red-900 px-3 py-1.5 text-xs text-red-400"
                    >
                      Detener y recuperar
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Recent trades */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-white">Últimas operaciones</h2>
        {user.trades.length === 0 ? (
          <p className="text-neutral-500">Sin operaciones aún.</p>
        ) : (
          <div className="space-y-2">
            {user.trades.slice(0, 15).map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-4 py-3 text-sm"
              >
                <div>
                  <span className={`font-medium ${t.side === 'buy' ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                    {t.side === 'buy' ? 'COMPRA' : 'VENTA'}
                  </span>{' '}
                  <span className="text-white">{t.symbol}</span>
                  <span className="ml-2 text-neutral-500">{t.quantity.toFixed(4)}</span>
                </div>
                <div className="text-right">
                  <p className="text-white">{formatCOP(t.total)}</p>
                  <p className="text-xs text-neutral-500">
                    {new Date(t.timestamp).toLocaleString('es-CO')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
