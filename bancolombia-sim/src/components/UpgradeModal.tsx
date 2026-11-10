'use client';

import Link from 'next/link';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--bancolombia-yellow)]/40 bg-[var(--card-bg)] shadow-2xl">
        {/* Accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[var(--bancolombia-yellow)] via-yellow-300 to-[var(--bancolombia-yellow)]" />

        <div className="p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 text-neutral-400 hover:bg-white/10 hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[var(--bancolombia-yellow)]/15 px-3 py-1 text-xs font-semibold text-[var(--bancolombia-yellow)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--bancolombia-yellow)]" />
            EXCLUSIVO PLAN PRO
          </div>

          <h2 className="mt-3 text-2xl font-bold text-white">
            Desbloquea el poder de invertir como los mejores
          </h2>
          <p className="mt-3 text-neutral-300">
            Con el <strong className="text-[var(--bancolombia-yellow)]">Plan Pro</strong> puedes acceder a
            estrategias de inversionistas destacados y replicar sus operaciones dentro de tu simulador.
          </p>

          <ul className="mt-5 space-y-2 text-sm text-neutral-300">
            <li className="flex items-center gap-2">
              <span className="text-[var(--bancolombia-yellow)]">✓</span> Copy Trading completo
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[var(--bancolombia-yellow)]">✓</span> Seguir a los mejores traders
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[var(--bancolombia-yellow)]">✓</span> Gestión de riesgo avanzada
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[var(--bancolombia-yellow)]">✓</span> Historial y estadísticas exclusivas
            </li>
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/subscriptions"
              onClick={onClose}
              className="pulse-yellow flex w-full items-center justify-center rounded-xl bg-[var(--bancolombia-yellow)] py-3.5 text-center text-base font-bold text-black transition hover:bg-[var(--bancolombia-yellow-dark)]"
            >
              OBTENER PLAN PRO
            </Link>
            <button
              onClick={onClose}
              className="w-full rounded-xl border border-[var(--border)] py-3 text-sm text-neutral-400 hover:border-neutral-500 hover:text-white"
            >
              Continuar explorando
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-neutral-500">
            Simulación 100% virtual · Sin cobros reales
          </p>
        </div>
      </div>
    </div>
  );
}
