'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, PlanType, Position, Trade, CopiedStrategy } from '@/types';
import { ASSETS, formatCOP } from '@/lib/mockData';

const INITIAL_CAPITAL = 100_000_000;
const STORAGE_KEY = 'bancolombia_sim_user';

interface AppContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  buyAsset: (assetId: string, amountCOP: number) => { success: boolean; message: string };
  sellAsset: (assetId: string, quantity: number) => { success: boolean; message: string };
  upgradePlan: (plan: PlanType) => void;
  copyTrader: (traderId: string, traderName: string, capital: number, stopLoss?: number) => { success: boolean; message: string };
  pauseCopy: (traderId: string) => void;
  stopCopy: (traderId: string) => void;
  totalPortfolioValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  refreshPrices: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function createDefaultUser(email: string, name: string): User {
  return {
    id: crypto.randomUUID(),
    email,
    name,
    plan: 'free',
    cash: INITIAL_CAPITAL,
    positions: [],
    trades: [],
    copiedStrategies: [],
    createdAt: new Date().toISOString(),
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  const login = useCallback((email: string, name?: string) => {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) {
      const parsed = JSON.parse(existing);
      if (parsed.email === email) {
        setUser(parsed);
        return;
      }
    }
    setUser(createDefaultUser(email, name || email.split('@')[0]));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    // keep storage for demo re-login
  }, []);

  const refreshPrices = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedPositions = prev.positions.map((pos) => {
        const asset = ASSETS.find((a) => a.id === pos.assetId);
        return asset ? { ...pos, currentPrice: asset.price } : pos;
      });
      return { ...prev, positions: updatedPositions };
    });
  }, []);

  const buyAsset = useCallback((assetId: string, amountCOP: number) => {
    if (!user) return { success: false, message: 'Debes iniciar sesión' };
    const asset = ASSETS.find((a) => a.id === assetId);
    if (!asset) return { success: false, message: 'Activo no encontrado' };
    if (amountCOP <= 0) return { success: false, message: 'Monto inválido' };
    if (amountCOP > user.cash) return { success: false, message: 'Saldo insuficiente' };

    const quantity = amountCOP / asset.price;
    const trade: Trade = {
      id: crypto.randomUUID(),
      assetId,
      symbol: asset.symbol,
      side: 'buy',
      quantity,
      price: asset.price,
      total: amountCOP,
      timestamp: new Date().toISOString(),
      type: 'manual',
    };

    setUser((prev) => {
      if (!prev) return prev;
      const existing = prev.positions.find((p) => p.assetId === assetId);
      let newPositions: Position[];
      if (existing) {
        const totalQty = existing.quantity + quantity;
        const avgPrice = (existing.avgPrice * existing.quantity + asset.price * quantity) / totalQty;
        newPositions = prev.positions.map((p) =>
          p.assetId === assetId
            ? { ...p, quantity: totalQty, avgPrice, currentPrice: asset.price }
            : p
        );
      } else {
        newPositions = [
          ...prev.positions,
          {
            assetId,
            symbol: asset.symbol,
            name: asset.name,
            quantity,
            avgPrice: asset.price,
            currentPrice: asset.price,
          },
        ];
      }
      return {
        ...prev,
        cash: prev.cash - amountCOP,
        positions: newPositions,
        trades: [trade, ...prev.trades].slice(0, 100),
      };
    });

    return { success: true, message: `Compraste ${quantity.toFixed(6)} ${asset.symbol} por ${formatCOP(amountCOP)}` };
  }, [user]);

  const sellAsset = useCallback((assetId: string, quantity: number) => {
    if (!user) return { success: false, message: 'Debes iniciar sesión' };
    const asset = ASSETS.find((a) => a.id === assetId);
    if (!asset) return { success: false, message: 'Activo no encontrado' };
    const position = user.positions.find((p) => p.assetId === assetId);
    if (!position || position.quantity < quantity) {
      return { success: false, message: 'Cantidad insuficiente en portafolio' };
    }

    const total = quantity * asset.price;
    const trade: Trade = {
      id: crypto.randomUUID(),
      assetId,
      symbol: asset.symbol,
      side: 'sell',
      quantity,
      price: asset.price,
      total,
      timestamp: new Date().toISOString(),
      type: 'manual',
    };

    setUser((prev) => {
      if (!prev) return prev;
      const newQty = position.quantity - quantity;
      const newPositions =
        newQty <= 0.000001
          ? prev.positions.filter((p) => p.assetId !== assetId)
          : prev.positions.map((p) =>
              p.assetId === assetId ? { ...p, quantity: newQty, currentPrice: asset.price } : p
            );
      return {
        ...prev,
        cash: prev.cash + total,
        positions: newPositions,
        trades: [trade, ...prev.trades].slice(0, 100),
      };
    });

    return { success: true, message: `Vendiste ${quantity.toFixed(6)} ${asset.symbol} por ${formatCOP(total)}` };
  }, [user]);

  const upgradePlan = useCallback((plan: PlanType) => {
    setUser((prev) => {
      if (!prev) return prev;
      const expires = new Date();
      expires.setMonth(expires.getMonth() + 1);
      return {
        ...prev,
        plan,
        planExpiresAt: expires.toISOString(),
      };
    });
  }, []);

  const copyTrader = useCallback(
    (traderId: string, traderName: string, capital: number, stopLoss?: number) => {
      if (!user) return { success: false, message: 'Debes iniciar sesión' };
      if (user.plan !== 'pro') {
        return { success: false, message: 'Copy Trading es exclusivo del Plan Pro' };
      }
      if (capital > user.cash) return { success: false, message: 'Saldo insuficiente' };
      if (capital < 1000000) return { success: false, message: 'Mínimo $1.000.000 COP para copiar' };

      const existing = user.copiedStrategies.find((c) => c.traderId === traderId && c.status !== 'stopped');
      if (existing) return { success: false, message: 'Ya estás copiando a este inversionista' };

      const strategy: CopiedStrategy = {
        traderId,
        traderName,
        allocatedCapital: capital,
        currentValue: capital,
        pnl: 0,
        pnlPercent: 0,
        startedAt: new Date().toISOString(),
        status: 'active',
        stopLoss,
      };

      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          cash: prev.cash - capital,
          copiedStrategies: [...prev.copiedStrategies, strategy],
        };
      });

      return { success: true, message: `Ahora copias la estrategia de ${traderName}` };
    },
    [user]
  );

  const pauseCopy = useCallback((traderId: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        copiedStrategies: prev.copiedStrategies.map((c) =>
          c.traderId === traderId && c.status === 'active' ? { ...c, status: 'paused' } : c
        ),
      };
    });
  }, []);

  const stopCopy = useCallback((traderId: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const strategy = prev.copiedStrategies.find((c) => c.traderId === traderId);
      if (!strategy) return prev;
      return {
        ...prev,
        cash: prev.cash + strategy.currentValue,
        copiedStrategies: prev.copiedStrategies.map((c) =>
          c.traderId === traderId ? { ...c, status: 'stopped' } : c
        ),
      };
    });
  }, []);

  // Derived values
  const positionsValue = user
    ? user.positions.reduce((sum, p) => sum + p.quantity * p.currentPrice, 0)
    : 0;
  const copiedValue = user
    ? user.copiedStrategies
        .filter((c) => c.status !== 'stopped')
        .reduce((sum, c) => sum + c.currentValue, 0)
    : 0;
  const totalPortfolioValue = (user?.cash || 0) + positionsValue + copiedValue;
  const totalPnL = totalPortfolioValue - INITIAL_CAPITAL;
  const totalPnLPercent = (totalPnL / INITIAL_CAPITAL) * 100;

  return (
    <AppContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        buyAsset,
        sellAsset,
        upgradePlan,
        copyTrader,
        pauseCopy,
        stopCopy,
        totalPortfolioValue,
        totalPnL,
        totalPnLPercent,
        refreshPrices,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
