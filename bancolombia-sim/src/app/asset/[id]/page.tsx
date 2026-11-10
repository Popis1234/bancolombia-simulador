'use client';

import { useParams } from 'next/navigation';
import { ASSETS, formatCOP, formatPercent } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import Link from 'next/link';

export default function AssetPage() {
  const params = useParams();
  const id = params.id as string;
  const asset = ASSETS.find((a) => a.id === id);
  const { user, buyAsset, sellAsset } = useApp();
  const [amount, setAmount] = useState(1000000);
  const [qty, setQty] = useState(0.01);
  const [msg, setMsg] = useState('');
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');

  if (!asset) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-neutral-400">Activo no encontrado</p>
        <Link href="/markets" className="mt-4 inline-block text-[var(--bancolombia-yellow)]">
          Volver a mercados
        </Link>
      </div>
    );
  }

  const isPositive = asset.change24h >= 0;
  const history = asset.history;
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;

  const position = user?.positions.find((p) => p.assetId === asset.id);

  const handleTrade = () => {
    if (!user) {
      setMsg('Inicia sesión para operar');
      return;
    }
    if (mode === 'buy') {
      const res = buyAsset(asset.id, amount);
      setMsg(res.message);
    } else {
      const res = sellAsset(asset.id, qty);
      setMsg(res.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link href="/markets" className="text-sm text-neutral-400 hover:text-[var(--bancolombia-yellow)]">
        ← Mercados
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{asset.symbol}</h1>
            <span className="rounded bg-neutral-800 px-2 py-0.5 text-xs uppercase text-neutral-400">
              {asset.category}
            </span>
          </div>
          <p className="text-neutral-400">{asset.name}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">{formatCOP(asset.price)}</p>
          <p className={`text-lg font-medium ${isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
            {formatPercent(asset.change24h)} (24h)
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <p className="mb-3 text-sm text-neutral-400">Comportamiento simulado (últimos 30 puntos)</p>
        <div className="flex h-48 items-end gap-1">
          {history.map((v, i) => {
            const h = ((v - min) / range) * 100;
            return (
              <div
                key={i}
                className={`flex-1 rounded-t transition-all ${isPositive ? 'bg-[var(--success)]/70 hover:bg-[var(--success)]' : 'bg-[var(--danger)]/70 hover:bg-[var(--danger)]'}`}
                style={{ height: `${Math.max(4, h)}%` }}
                title={formatCOP(v)}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-bold text-white">Información</h2>
          <p className="mt-2 text-neutral-300">{asset.description}</p>
          <p className="mt-4 text-xs text-neutral-500">
            Los precios mostrados son simulados y no corresponden a cotizaciones reales de mercado.
            Esta plataforma es un prototipo educativo.
          </p>
          {position && (
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-black/40 p-4">
              <p className="text-sm text-neutral-400">Tu posición</p>
              <p className="text-white">
                {position.quantity.toFixed(6)} {asset.symbol} · Valor{' '}
                {formatCOP(position.quantity * position.currentPrice)}
              </p>
            </div>
          )}
        </div>

        {/* Trade panel */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setMode('buy')}
              className={`flex-1 rounded-lg py-2 font-semibold ${
                mode === 'buy' ? 'bg-[var(--success)] text-black' : 'bg-neutral-800 text-neutral-300'
              }`}
            >
              Comprar
            </button>
            <button
              onClick={() => setMode('sell')}
              className={`flex-1 rounded-lg py-2 font-semibold ${
                mode === 'sell' ? 'bg-[var(--danger)] text-white' : 'bg-neutral-800 text-neutral-300'
              }`}
            >
              Vender
            </button>
          </div>

          {mode === 'buy' ? (
            <div>
              <label className="text-sm text-neutral-400">Monto en COP</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={10000}
                step={100000}
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-black px-4 py-3 text-white"
              />
              <p className="mt-1 text-xs text-neutral-500">
                ≈ {(amount / asset.price).toFixed(6)} {asset.symbol}
              </p>
            </div>
          ) : (
            <div>
              <label className="text-sm text-neutral-400">Cantidad a vender</label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                min={0}
                step={0.001}
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-black px-4 py-3 text-white"
              />
              <p className="mt-1 text-xs text-neutral-500">
                ≈ {formatCOP(qty * asset.price)}
                {position && ` · Disponible: ${position.quantity.toFixed(6)}`}
              </p>
            </div>
          )}

          <button
            onClick={handleTrade}
            className={`mt-6 w-full rounded-xl py-3.5 font-bold ${
              mode === 'buy'
                ? 'bg-[var(--success)] text-black hover:bg-green-400'
                : 'bg-[var(--danger)] text-white hover:bg-red-500'
            }`}
          >
            {mode === 'buy' ? 'Comprar ahora' : 'Vender ahora'}
          </button>

          {msg && (
            <p className={`mt-3 text-center text-sm ${msg.includes('insuficiente') || msg.includes('Debes') ? 'text-yellow-300' : 'text-green-300'}`}>
              {msg}
            </p>
          )}

          {!user && (
            <p className="mt-3 text-center text-sm text-neutral-400">
              <Link href="/profile" className="text-[var(--bancolombia-yellow)] hover:underline">
                Inicia sesión
              </Link>{' '}
              para operar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
