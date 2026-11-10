// Datos simulados para la plataforma - NO son precios reales en tiempo real
// Etiquetados claramente como SIMULADOS para fines educativos y de demostración

export type AssetCategory = 'crypto' | 'commodities' | 'stocks' | 'forex' | 'indices';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  price: number; // en COP para consistencia del simulador
  change24h: number; // porcentaje
  volume?: string;
  description: string;
  history: number[]; // últimos 30 puntos para gráfica
}

export interface Trader {
  id: string;
  name: string;
  avatar: string; // emoji o inicial
  country: string;
  countryFlag: string;
  monthlyReturn: number;
  totalReturn: number;
  riskLevel: 'Bajo' | 'Medio' | 'Alto';
  followers: number;
  winRate: number;
  maxDrawdown: number;
  aum: string; // Assets Under Management simulado
  portfolio: { asset: string; percentage: number }[];
  recentTrades: { asset: string; side: 'buy' | 'sell'; pnl: number; date: string }[];
  description: string;
  consistency: number; // 0-100
}

// Generador de historial simulado
function generateHistory(base: number, volatility: number = 0.02): number[] {
  const history: number[] = [];
  let price = base * (0.9 + Math.random() * 0.1);
  for (let i = 0; i < 30; i++) {
    price = price * (1 + (Math.random() - 0.5) * volatility);
    history.push(Math.round(price * 100) / 100);
  }
  return history;
}

export const ASSETS: Asset[] = [
  // Criptomonedas (precios aproximados convertidos a COP ~ 4000 COP/USD)
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    category: 'crypto',
    price: 420000000, // ~105k USD
    change24h: 2.34,
    volume: '28.5B',
    description: 'La criptomoneda líder del mercado. Activo digital descentralizado.',
    history: generateHistory(410000000, 0.03),
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    category: 'crypto',
    price: 14200000,
    change24h: -0.87,
    volume: '12.1B',
    description: 'Plataforma de contratos inteligentes y DeFi.',
    history: generateHistory(14500000, 0.035),
  },
  {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    category: 'crypto',
    price: 720000,
    change24h: 5.12,
    volume: '3.8B',
    description: 'Blockchain de alto rendimiento y bajas comisiones.',
    history: generateHistory(680000, 0.05),
  },
  {
    id: 'bnb',
    symbol: 'BNB',
    name: 'BNB',
    category: 'crypto',
    price: 2450000,
    change24h: 1.05,
    description: 'Token nativo de Binance.',
    history: generateHistory(2400000, 0.025),
  },
  {
    id: 'xrp',
    symbol: 'XRP',
    name: 'XRP',
    category: 'crypto',
    price: 9800,
    change24h: -1.23,
    description: 'Criptomoneda para pagos internacionales rápidos.',
    history: generateHistory(10000, 0.04),
  },
  // Materias primas
  {
    id: 'gold',
    symbol: 'XAU',
    name: 'Oro',
    category: 'commodities',
    price: 10800000, // ~2700 USD/oz
    change24h: 0.45,
    description: 'Activo refugio tradicional. Precio por onza troy.',
    history: generateHistory(10700000, 0.01),
  },
  {
    id: 'silver',
    symbol: 'XAG',
    name: 'Plata',
    category: 'commodities',
    price: 132000,
    change24h: 1.12,
    description: 'Metal precioso industrial y de inversión.',
    history: generateHistory(130000, 0.02),
  },
  {
    id: 'oil',
    symbol: 'WTI',
    name: 'Petróleo WTI',
    category: 'commodities',
    price: 285000,
    change24h: -0.65,
    description: 'Crudo West Texas Intermediate. Precio por barril.',
    history: generateHistory(290000, 0.025),
  },
  {
    id: 'copper',
    symbol: 'HG',
    name: 'Cobre',
    category: 'commodities',
    price: 18500,
    change24h: 0.88,
    description: 'Metal industrial clave para la transición energética.',
    history: generateHistory(18200, 0.015),
  },
  // Acciones
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    category: 'stocks',
    price: 920000,
    change24h: 0.32,
    description: 'Gigante tecnológico. iPhone, servicios y wearables.',
    history: generateHistory(910000, 0.015),
  },
  {
    id: 'msft',
    symbol: 'MSFT',
    name: 'Microsoft',
    category: 'stocks',
    price: 1680000,
    change24h: 1.15,
    description: 'Cloud, IA (Azure, OpenAI) y software empresarial.',
    history: generateHistory(1650000, 0.012),
  },
  {
    id: 'amzn',
    symbol: 'AMZN',
    name: 'Amazon',
    category: 'stocks',
    price: 780000,
    change24h: -0.45,
    description: 'E-commerce, AWS y publicidad digital.',
    history: generateHistory(790000, 0.02),
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    name: 'Tesla',
    category: 'stocks',
    price: 980000,
    change24h: 3.78,
    description: 'Vehículos eléctricos, energía y robotaxi.',
    history: generateHistory(940000, 0.04),
  },
  {
    id: 'nvda',
    symbol: 'NVDA',
    name: 'NVIDIA',
    category: 'stocks',
    price: 5200000,
    change24h: 2.91,
    description: 'Líder en GPUs para IA y gaming.',
    history: generateHistory(5000000, 0.03),
  },
  {
    id: 'googl',
    symbol: 'GOOGL',
    name: 'Alphabet (Google)',
    category: 'stocks',
    price: 720000,
    change24h: 0.67,
    description: 'Búsqueda, YouTube, Cloud y Waymo.',
    history: generateHistory(710000, 0.015),
  },
  // Divisas (pares vs COP aproximado)
  {
    id: 'usd',
    symbol: 'USD/COP',
    name: 'Dólar Estadounidense',
    category: 'forex',
    price: 4120,
    change24h: -0.12,
    description: 'Par USD/COP. Principal divisa de referencia.',
    history: generateHistory(4150, 0.008),
  },
  {
    id: 'eur',
    symbol: 'EUR/COP',
    name: 'Euro',
    category: 'forex',
    price: 4480,
    change24h: 0.25,
    description: 'Par EUR/COP.',
    history: generateHistory(4450, 0.01),
  },
  {
    id: 'gbp',
    symbol: 'GBP/COP',
    name: 'Libra Esterlina',
    category: 'forex',
    price: 5320,
    change24h: -0.38,
    description: 'Par GBP/COP.',
    history: generateHistory(5350, 0.012),
  },
  // Índices
  {
    id: 'spx',
    symbol: 'S&P 500',
    name: 'S&P 500',
    category: 'indices',
    price: 23500000, // índice * 4000 approx for display
    change24h: 0.55,
    description: 'Índice de las 500 mayores empresas de EE.UU.',
    history: generateHistory(23200000, 0.01),
  },
  {
    id: 'ndx',
    symbol: 'NASDAQ',
    name: 'Nasdaq Composite',
    category: 'indices',
    price: 78000000,
    change24h: 1.02,
    description: 'Índice tecnológico de EE.UU.',
    history: generateHistory(77000000, 0.015),
  },
  {
    id: 'dji',
    symbol: 'DOW',
    name: 'Dow Jones',
    category: 'indices',
    price: 175000000,
    change24h: 0.28,
    description: 'Índice de 30 blue chips estadounidenses.',
    history: generateHistory(174000000, 0.008),
  },
];

export const TRADERS: Trader[] = [
  {
    id: 't1',
    name: 'Carlos Mendoza',
    avatar: 'CM',
    country: 'Colombia',
    countryFlag: '🇨🇴',
    monthlyReturn: 18.4,
    totalReturn: 142.7,
    riskLevel: 'Medio',
    followers: 12840,
    winRate: 68.5,
    maxDrawdown: -12.3,
    aum: '$4.2M',
    portfolio: [
      { asset: 'BTC', percentage: 35 },
      { asset: 'ETH', percentage: 25 },
      { asset: 'NVDA', percentage: 20 },
      { asset: 'Oro', percentage: 12 },
      { asset: 'Otros', percentage: 8 },
    ],
    recentTrades: [
      { asset: 'BTC', side: 'buy', pnl: 4.2, date: '2026-11-08' },
      { asset: 'NVDA', side: 'sell', pnl: 2.1, date: '2026-11-07' },
      { asset: 'ETH', side: 'buy', pnl: -1.3, date: '2026-11-06' },
    ],
    description: 'Trader cuantitativo con enfoque en crypto y tech. 8 años de experiencia.',
    consistency: 82,
  },
  {
    id: 't2',
    name: 'Sofia Reyes',
    avatar: 'SR',
    country: 'España',
    countryFlag: '🇪🇸',
    monthlyReturn: 9.8,
    totalReturn: 67.3,
    riskLevel: 'Bajo',
    followers: 8920,
    winRate: 74.2,
    maxDrawdown: -6.8,
    aum: '$2.8M',
    portfolio: [
      { asset: 'Oro', percentage: 30 },
      { asset: 'S&P 500', percentage: 25 },
      { asset: 'AAPL', percentage: 20 },
      { asset: 'USD', percentage: 15 },
      { asset: 'Otros', percentage: 10 },
    ],
    recentTrades: [
      { asset: 'XAU', side: 'buy', pnl: 1.8, date: '2026-11-08' },
      { asset: 'AAPL', side: 'buy', pnl: 0.9, date: '2026-11-05' },
    ],
    description: 'Estrategia conservadora orientada a preservación de capital y crecimiento estable.',
    consistency: 91,
  },
  {
    id: 't3',
    name: 'Alex Rivera',
    avatar: 'AR',
    country: 'México',
    countryFlag: '🇲🇽',
    monthlyReturn: 32.1,
    totalReturn: 289.5,
    riskLevel: 'Alto',
    followers: 21560,
    winRate: 61.3,
    maxDrawdown: -28.4,
    aum: '$7.1M',
    portfolio: [
      { asset: 'SOL', percentage: 40 },
      { asset: 'TSLA', percentage: 25 },
      { asset: 'BTC', percentage: 20 },
      { asset: 'Otros', percentage: 15 },
    ],
    recentTrades: [
      { asset: 'SOL', side: 'buy', pnl: 12.5, date: '2026-11-09' },
      { asset: 'TSLA', side: 'buy', pnl: 5.4, date: '2026-11-08' },
      { asset: 'BTC', side: 'sell', pnl: -3.2, date: '2026-11-07' },
    ],
    description: 'Especialista en alta volatilidad y momentum trading. No apto para perfiles conservadores.',
    consistency: 58,
  },
  {
    id: 't4',
    name: 'Laura Chen',
    avatar: 'LC',
    country: 'Singapur',
    countryFlag: '🇸🇬',
    monthlyReturn: 14.6,
    totalReturn: 98.2,
    riskLevel: 'Medio',
    followers: 15430,
    winRate: 71.8,
    maxDrawdown: -9.7,
    aum: '$5.5M',
    portfolio: [
      { asset: 'NVDA', percentage: 30 },
      { asset: 'MSFT', percentage: 25 },
      { asset: 'ETH', percentage: 20 },
      { asset: 'Oro', percentage: 15 },
      { asset: 'Otros', percentage: 10 },
    ],
    recentTrades: [
      { asset: 'NVDA', side: 'buy', pnl: 3.7, date: '2026-11-08' },
      { asset: 'MSFT', side: 'buy', pnl: 1.4, date: '2026-11-06' },
    ],
    description: 'Enfoque en IA y tecnología de crecimiento con cobertura en commodities.',
    consistency: 85,
  },
  {
    id: 't5',
    name: 'Diego Vargas',
    avatar: 'DV',
    country: 'Colombia',
    countryFlag: '🇨🇴',
    monthlyReturn: 11.2,
    totalReturn: 54.8,
    riskLevel: 'Bajo',
    followers: 6780,
    winRate: 69.4,
    maxDrawdown: -8.1,
    aum: '$1.9M',
    portfolio: [
      { asset: 'USD', percentage: 25 },
      { asset: 'Oro', percentage: 25 },
      { asset: 'S&P 500', percentage: 20 },
      { asset: 'AAPL', percentage: 15 },
      { asset: 'Otros', percentage: 15 },
    ],
    recentTrades: [
      { asset: 'XAU', side: 'buy', pnl: 0.8, date: '2026-11-07' },
      { asset: 'USD/COP', side: 'sell', pnl: 1.2, date: '2026-11-05' },
    ],
    description: 'Trader local enfocado en cobertura cambiaria y activos refugio para el mercado colombiano.',
    consistency: 88,
  },
  {
    id: 't6',
    name: 'Elena Moreau',
    avatar: 'EM',
    country: 'Francia',
    countryFlag: '🇫🇷',
    monthlyReturn: 22.7,
    totalReturn: 176.3,
    riskLevel: 'Medio',
    followers: 18920,
    winRate: 65.9,
    maxDrawdown: -15.2,
    aum: '$6.3M',
    portfolio: [
      { asset: 'BTC', percentage: 28 },
      { asset: 'ETH', percentage: 22 },
      { asset: 'EUR', percentage: 15 },
      { asset: 'NVDA', percentage: 20 },
      { asset: 'Otros', percentage: 15 },
    ],
    recentTrades: [
      { asset: 'BTC', side: 'buy', pnl: 6.1, date: '2026-11-09' },
      { asset: 'EUR/COP', side: 'buy', pnl: 0.6, date: '2026-11-08' },
    ],
    description: 'Estrategia multi-activo con sesgo europeo y exposición controlada a crypto.',
    consistency: 76,
  },
];

export const PLANS = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    period: 'Siempre',
    features: [
      'Acceso al simulador completo',
      '$100.000.000 COP de capital virtual',
      'Compra y venta de activos',
      'Gráficas básicas',
      'Seguimiento de portafolio',
      'Visualización de Copy Trading (sin uso)',
    ],
    highlighted: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19900,
    period: 'mes',
    features: [
      'Todo lo del plan Gratuito',
      'Estadísticas avanzadas',
      'Análisis detallado del portafolio',
      'Comparaciones de activos',
      'Alertas personalizadas',
    ],
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 34900,
    period: 'mes',
    features: [
      'Todo lo del plan Premium',
      'Acceso completo a Copy Trading',
      'Copiar estrategias de inversionistas',
      'Seguimiento avanzado de estrategias',
      'Herramientas de gestión de riesgo',
      'Funciones exclusivas de la plataforma',
    ],
    highlighted: true,
  },
];

export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
