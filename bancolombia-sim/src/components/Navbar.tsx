'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { formatCOP } from '@/lib/mockData';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, totalPortfolioValue } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Simulador' },
    { href: '/markets', label: 'Mercados' },
    { href: '/copy-trading', label: 'Copy Trading', highlight: true },
    { href: '/subscriptions', label: 'Planes' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-black/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90">
          <div className="logo-symbol text-[var(--bancolombia-yellow)]">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="text-lg font-bold tracking-tight">Bancolombia</span>
          <span className="hidden rounded bg-[var(--bancolombia-yellow)] px-1.5 py-0.5 text-[10px] font-bold text-black sm:inline">
            SIM
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-[var(--bancolombia-yellow)] text-black'
                  : item.highlight
                  ? 'text-[var(--bancolombia-yellow)] hover:bg-[var(--bancolombia-yellow)]/10'
                  : 'text-neutral-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.label}
              {item.highlight && (
                <span className="ml-1.5 rounded bg-[var(--bancolombia-yellow)] px-1 text-[10px] font-bold text-black">
                  PRO
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* User area */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-xs text-neutral-400">Capital virtual</p>
                <p className="text-sm font-semibold text-[var(--bancolombia-yellow)]">
                  {formatCOP(totalPortfolioValue)}
                </p>
              </div>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card-bg)] px-3 py-1.5 text-sm hover:border-[var(--bancolombia-yellow)]"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bancolombia-yellow)] text-xs font-bold text-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden max-w-[100px] truncate sm:inline">{user.name}</span>
                <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] uppercase text-neutral-300">
                  {user.plan}
                </span>
              </Link>
              <button
                onClick={logout}
                className="hidden rounded-lg px-2 py-1.5 text-xs text-neutral-400 hover:text-white sm:block"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              href="/profile"
              className="rounded-lg bg-[var(--bancolombia-yellow)] px-4 py-2 text-sm font-semibold text-black hover:bg-[var(--bancolombia-yellow-dark)]"
            >
              Ingresar
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            className="rounded-lg p-2 text-neutral-300 hover:bg-white/10 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-black px-4 py-3 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                isActive(item.href)
                  ? 'bg-[var(--bancolombia-yellow)] text-black'
                  : 'text-neutral-300 hover:bg-white/10'
              }`}
            >
              {item.label}
              {item.highlight && (
                <span className="ml-2 rounded bg-[var(--bancolombia-yellow)] px-1.5 text-[10px] font-bold text-black">
                  PRO
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
