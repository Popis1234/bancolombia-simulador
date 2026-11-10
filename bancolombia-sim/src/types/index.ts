export type PlanType = 'free' | 'premium' | 'pro';

export interface Position {
  assetId: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

export interface Trade {
  id: string;
  assetId: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  timestamp: string;
  type: 'manual' | 'copy';
  traderId?: string;
}

export interface CopiedStrategy {
  traderId: string;
  traderName: string;
  allocatedCapital: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  startedAt: string;
  status: 'active' | 'paused' | 'stopped';
  stopLoss?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: PlanType;
  planExpiresAt?: string;
  cash: number; // disponible
  positions: Position[];
  trades: Trade[];
  copiedStrategies: CopiedStrategy[];
  createdAt: string;
}
