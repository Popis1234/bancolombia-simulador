'use client';

import { useState } from 'react';
import { TRADERS, formatPercent } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import UpgradeModal from '@/components/UpgradeModal';
import Link from 'next/link';

type SortKey = 'monthlyReturn' | 'totalReturn' | 'risk' | 'consistency' | 'followers';

export default function CopyTradingPage() {
  const { user, copyTrader } = useApp();
  const [sortBy, setSortBy] = useState<SortKey>('monthlyReturn');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<string | null>(null);
  const [copyAmount, setCopyAmount] = useState(5000000);
  const [message, setMessage] = useState('');

  const isPro = user?.plan === 'pro';

  const sorted = [...TRADERS].sort((a, b) => {
    if (sortBy === 'risk') {
      const order = { Bajo: 0, Medio: 1, Alto: 2 };
      return order[a.riskLevel] - order[b.riskLevel];
    }
    if (sortBy === 'consistency') return b.consistency - a.consistency;
    if (sortBy === 'followers') return b.followers - a.followers;
    return (b[sortBy] as number) - (a[sortBy] as number);
  });

  const handleCopyClick = (traderId: string) => {
    if (!user) {
      setMessage('Inicia sesión para copiar estrategias');
      return;
    }
    if (!isPro) {
      setShowUpgrade(true);
      return;
    }
    setSelectedTrader(traderId);
    setMessage('');
  };

  const confirmCopy = () => {
    if (!selectedTrader) return;
    const trader = TRADERS.find((t) => t.id === selectedTrader);
    if (!trader) return;
    const res = copyTrader(trader.id, trader.name, copyAmount);
    setMessage(res.message);
    if (res.success) setSelectedTrader(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Copy Trading</h1>
          <span className="rounded-full bg-[var(--bancolombia-yellow)] px-3 py-1 text-xs font-bold text-black">
            PLAN PRO
          </span>
        </div>
        <p className="mt-2 max-w-2xl text-neutral-400">
          Explora a los mejores inversionistas (perfiles ficticios con fines de demostración) y replica
          sus estrategias con tu capital virtual. Función exclusiva del Plan Pro.
        </p>
      </div>

      {/* Ranking filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { key: 'monthlyReturn' as SortKey, label: 'Mayor rentabilidad mensual' },
          { key: 'totalReturn' as SortKey, label: 'Mayor rentabilidad total' },
          { key: 'risk' as SortKey, label: 'Menor riesgo' },
          { key: 'consistency' as SortKey, label: 'Mayor consistencia' },
          { key: 'followers' as SortKey, label: 'Más seguidores' },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setSortBy(s.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm ${
              sortBy === s.key
                ? 'bg-[var(--bancolombia-yellow)] text-black'
                : 'bg-[var(--card-bg)] text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {message && (
        <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${message.includes('Ahora') || message.includes('éxito') ? 'bg-green-900/40 text-green-300' : 'bg-yellow-900/40 text-yellow-200'}`}>
          {message}
        </div>
      )}

      {/* Trader cards - BingX inspired */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((trader, idx) => (
          <div
            key={trader.id}
            className="card-hover relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]"
          >
            {idx < 3 && (
              <div className="absolute right-3 top-3 rounded bg-[var(--bancolombia-yellow)] px-2 py-0.5 text-[10px] font-bold text-black">
                TOP {idx + 1}
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--bancolombia-yellow)] to-yellow-600 text-lg font-bold text-black">
                  {trader.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-white">{trader.name}</h3>
                  <p className="text-sm text-neutral-400">
                    {trader.countryFlag} {trader.country} · {trader.followers.toLocaleString()} seguidores
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-black/40 p-3">
                  <p className="text-[10px] uppercase text-neutral-500">Mensual</p>
                  <p className={`text-lg font-bold ${trader.monthlyReturn >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                    {formatPercent(trader.monthlyReturn)}
                  </p>
                </div>
                <div className="rounded-lg bg-black/40 p-3">
                  <p className="text-[10px] uppercase text-neutral-500">Total</p>
                  <p className={`text-lg font-bold ${trader.totalReturn >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                    {formatPercent(trader.totalReturn)}
                  </p>
                </div>
                <div className="rounded-lg bg-black/40 p-3">
                  <p className="text-[10px] uppercase text-neutral-500">Riesgo</p>
                  <p className={`text-sm font-semibold ${
                    trader.riskLevel === 'Bajo' ? 'text-green-400' :
                    trader.riskLevel === 'Medio' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {trader.riskLevel}
                  </p>
                </div>
                <div className="rounded-lg bg-black/40 p-3">
                  <p className="text-[10px] uppercase text-neutral-500">Win rate</p>
                  <p className="text-sm font-semibold text-white">{trader.winRate}%</p>
                </div>
              </div>

              <div className="mt-3">
                <p className="mb-1 text-xs text-neutral-500">Portafolio</p>
                <div className="flex h-2 overflow-hidden rounded-full bg-neutral-800">
                  {trader.portfolio.map((p, i) => (
                    <div
                      key={i}
                      style={{ width: `${p.percentage}%` }}
                      className={`h-full ${
                        ['bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-neutral-500'][i % 5]
                      }`}
                      title={`${p.asset} ${p.percentage}%`}
                    />
                  ))}
                </div>
                <div className="mt-1 flex flex-wrap gap-x-2 text-[10px] text-neutral-500">
                  {trader.portfolio.map((p) => (
                    <span key={p.asset}>{p.asset} {p.percentage}%</span>
                  ))}
                </div>
              </div>

              <p className="mt-3 line-clamp-2 text-xs text-neutral-400">{trader.description}</p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleCopyClick(trader.id)}
                  className="flex-1 rounded-lg bg-[var(--bancolombia-yellow)] py-2.5 text-sm font-bold text-black hover:bg-[var(--bancolombia-yellow-dark)]"
                >
                  {isPro ? 'Copiar inversión' : 'Copiar (Pro)'}
                </button>
                <button
                  onClick={() => setSelectedTrader(selectedTrader === trader.id ? null : trader.id)}
                  className="rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm text-neutral-300 hover:border-neutral-500"
                >
                  Ver
                </button>
              </div>
            </div>

            {/* Expand strategy */}
            {selectedTrader === trader.id && isPro && (
              <div className="border-t border-[var(--border)] bg-black/30 p-4">
                <p className="mb-2 text-sm font-medium text-white">Configurar copia</p>
                <label className="block text-xs text-neutral-400">Capital a destinar (COP)</label>
                <input
                  type="number"
                  value={copyAmount}
                  onChange={(e) => setCopyAmount(Number(e.target.value))}
                  min={1000000}
                  step={500000}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2 text-white"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={confirmCopy}
                    className="flex-1 rounded-lg bg-[var(--bancolombia-yellow)] py-2 text-sm font-bold text-black"
                  >
                    Confirmar copia
                  </button>
                  <button
                    onClick={() => setSelectedTrader(null)}
                    className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-neutral-400"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-neutral-500">
        Los perfiles y rentabilidades son ficticios y generados para demostración. No representan resultados reales de
        inversionistas.
      </p>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
