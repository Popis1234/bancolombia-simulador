'use client';

import Link from 'next/link';
import { Asset, formatCOP, formatPercent } from '@/lib/mockData';

interface Props {
  asset: Asset;
}

export default function AssetCard({ asset }: Props) {
  const isPositive = asset.change24h >= 0;
  const miniHistory = asset.history.slice(-12);
  const min = Math.min(...miniHistory);
  const max = Math.max(...miniHistory);
  const range = max - min || 1;

  return (
    <Link
      href={`/asset/${asset.id}`}
      className="card-hover block rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">{asset.symbol}</span>
            <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] uppercase text-neutral-400">
              {asset.category}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-neutral-400">{asset.name}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-white">{formatCOP(asset.price)}</p>
          <p className={`text-sm font-medium ${isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
            {formatPercent(asset.change24h)}
          </p>
        </div>
      </div>

      {/* Mini sparkline */}
      <div className="mt-3 flex h-8 items-end gap-0.5">
        {miniHistory.map((v, i) => {
          const h = ((v - min) / range) * 100;
          return (
            <div
              key={i}
              className={`flex-1 rounded-sm ${isPositive ? 'bg-[var(--success)]/60' : 'bg-[var(--danger)]/60'}`}
              style={{ height: `${Math.max(8, h)}%` }}
            />
          );
        })}
      </div>
    </Link>
  );
}
