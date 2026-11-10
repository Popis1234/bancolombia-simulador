'use client';

import { PLANS, formatCOP } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { PlanType } from '@/types';
import { useState } from 'react';

export default function SubscriptionsPage() {
  const { user, upgradePlan } = useApp();
  const [message, setMessage] = useState('');

  const handleSelect = (planId: PlanType) => {
    if (!user) {
      setMessage('Inicia sesión primero desde tu perfil.');
      return;
    }
    upgradePlan(planId);
    setMessage(`¡Plan ${planId.toUpperCase()} activado! (Simulación — sin cobro real)`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white">Planes y Suscripciones</h1>
        <p className="mt-2 text-neutral-400">
          Elige el plan que mejor se adapte a tu experiencia de simulación. Todo es demostración sin cobros reales.
        </p>
        {user && (
          <p className="mt-2 text-sm text-[var(--bancolombia-yellow)]">
            Plan actual: <strong className="uppercase">{user.plan}</strong>
          </p>
        )}
      </div>

      {message && (
        <div className="mb-6 rounded-lg bg-green-900/40 px-4 py-3 text-center text-sm text-green-300">
          {message}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-2xl border p-6 ${
              plan.highlighted
                ? 'border-[var(--bancolombia-yellow)] bg-gradient-to-b from-[#1a1500] to-[var(--card-bg)] shadow-lg shadow-yellow-900/20'
                : 'border-[var(--border)] bg-[var(--card-bg)]'
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--bancolombia-yellow)] px-4 py-1 text-xs font-bold text-black">
                RECOMENDADO · COPY TRADING
              </div>
            )}
            <h2 className="text-xl font-bold text-white">{plan.name}</h2>
            <div className="mt-3">
              <span className="text-3xl font-bold text-white">
                {plan.price === 0 ? 'Gratis' : formatCOP(plan.price)}
              </span>
              {plan.price > 0 && <span className="text-neutral-400"> / {plan.period}</span>}
            </div>
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                  <span className="mt-0.5 text-[var(--bancolombia-yellow)]">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSelect(plan.id as PlanType)}
              disabled={user?.plan === plan.id}
              className={`mt-8 w-full rounded-xl py-3 font-bold transition ${
                user?.plan === plan.id
                  ? 'cursor-default bg-neutral-800 text-neutral-400'
                  : plan.highlighted
                  ? 'bg-[var(--bancolombia-yellow)] text-black hover:bg-[var(--bancolombia-yellow-dark)]'
                  : 'border border-[var(--border)] text-white hover:border-[var(--bancolombia-yellow)] hover:text-[var(--bancolombia-yellow)]'
              }`}
            >
              {user?.plan === plan.id ? 'Plan actual' : plan.price === 0 ? 'Seleccionar' : 'Obtener plan'}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-neutral-500">
        Esta es una interfaz de demostración. No se procesan pagos ni se almacenan datos de tarjetas.
        La restricción de Copy Trading se valida en el estado de la aplicación.
      </p>
    </div>
  );
}
