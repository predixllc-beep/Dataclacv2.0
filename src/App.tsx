import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ScanLine, 
  Terminal, 
  Bot, 
  Wallet, 
  ShieldAlert, 
  Activity, 
  Settings,
  Bell,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Plus,
  Home,
  BarChart3,
  User
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

// ═══════════════════════════════════════════════════════════════════════════════
// COLOR SYSTEM (Dark Theme - Exact from reference images)
// ═══════════════════════════════════════════════════════════════════════════════
const COLORS = {
  bg: {
    primary: '#0A0A0A',
    secondary: '#0D0D0D',
    card: '#141414',
    cardHover: '#1A1A1A',
    elevated: '#1E1E1E',
    input: '#242424'
  },
  accent: {
    primary: '#7C3AED',
    primaryGlow: 'rgba(124, 58, 237, 0.3)',
    primaryLight: '#A78BFA',
    secondary: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  },
  text: {
    primary: '#F5F5F5',
    secondary: '#A1A1AA',
    tertiary: '#52525B',
    muted: '#3F3F46'
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.06)',
    hover: 'rgba(255, 255, 255, 0.1)',
    active: 'rgba(124, 58, 237, 0.5)'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════
const generateChartData = () => {
  const data = [];
  let price = 182.45;
  for (let i = 0; i < 50; i++) {
    price += (Math.random() - 0.5) * 2;
    data.push({
      time: `${10 + Math.floor(i / 6)}:${(i % 6) * 10}`,
      price: parseFloat(price.toFixed(2))
    });
  }
  return data;
};

const ORDER_BOOK = {
  asks: [
    { price: 182.46, size: 15, total: 15 },
    { price: 182.47, size: 25, total: 40 },
    { price: 182.48, size: 55, total: 95 },
    { price: 182.49, size: 100, total: 195 },
    { price: 182.50, size: 45, total: 240 },
  ],
  bids: [
    { price: 182.44, size: 20, total: 20 },
    { price: 182.43, size: 60, total: 80 },
    { price: 182.42, size: 120, total: 200 },
    { price: 182.41, size: 40, total: 240 },
    { price: 182.40, size: 110, total: 350 },
  ]
};

const EVENTS = [
  { id: 'E-FED-001', title: 'Fed cuts rates in May 2026?', category: 'ECONOMICS', market: 'Polymarket', vol: 1500000, ev: 14.59, yes: 45, no: 55 },
  { id: 'E-POL-003', title: 'Democrat Win in PA 2028', category: 'POLITICS', market: 'Polymarket', vol: 5000000, ev: 2.0, yes: 51, no: 49 },
  { id: 'E-CRYPTO-009', title: 'Bitcoin > $150k EOY', category: 'CRYPTO', market: 'Polymarket', vol: 8500000, ev: 8.5, yes: 40, no: 60 },
  { id: 'E-SPORT-042', title: 'Arsenal vs Liverpool - Over 2.5', category: 'SPORTS', market: 'Predict.fun', vol: 45000, ev: 5.2, yes: 60, no: 40 },
];

const POSITIONS = [
  { symbol: 'E-FED-001', side: 'LONG', size: 500, entry: 0.45, current: 0.48, pnl: 150 },
  { symbol: 'E-POL-003', side: 'SHORT', size: 300, entry: 0.51, current: 0.49, pnl: 60 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const Card = ({ children, className = '', style = {} }: { children: React.ReactNode, className?: string, style?: React.CSSProperties, key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.005, y: -1 }}
    transition={{ duration: 0.2 }}
    className={`rounded-2xl p-5 ${className}`}
    style={{
      backgroundColor: COLORS.bg.card,
      border: `1px solid ${COLORS.border.subtle}`,
      ...style
    }}
  >
    {children}
  </motion.div>
);

const Badge = ({ children, color = 'primary', className = '' }: { children: React.ReactNode, color?: string, className?: string }) => {
  const colorMap: Record<string, { bg: string, text: string, border: string }> = {
    primary: { bg: 'rgba(124,58,237,0.15)', text: '#A78BFA', border: 'rgba(124,58,237,0.3)' },
    success: { bg: 'rgba(16,185,129,0.15)', text: '#34D399', border: 'rgba(16,185,129,0.3)' },
    danger: { bg: 'rgba(239,68,68,0.15)', text: '#F87171', border: 'rgba(239,68,68,0.3)' },
    warning: { bg: 'rgba(245,158,11,0.15)', text: '#FBBF24', border: 'rgba(245,158,11,0.3)' },
    neutral: { bg: 'rgba(255,255,255,0.05)', text: '#A1A1AA', border: 'rgba(255,255,255,0.1)' }
  };
  const c = colorMap[color] || colorMap.primary;
  return (
    <span 
      className={`px-2.5 py-1 rounded-lg text-xs font-medium ${className}`}
      style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {children}
    </span>
  );
};

const PriceDisplay = ({ value, prefix = '', suffix = '', decimals = 2, className = '' }: { value: number, prefix?: string, suffix?: string, decimals?: number, className?: string }) => {
  const isPositive = value >= 0;
  return (
    <span 
      className={`font-mono font-semibold truncate whitespace-nowrap block ${className}`}
      style={{ 
        color: isPositive ? COLORS.accent.secondary : COLORS.accent.danger,
        fontSize: 'clamp(0.875rem, 4vw, 1.25rem)'
      }}
    >
      {prefix}{isPositive && value !== 0 ? '+' : ''}{value.toLocaleString(undefined, {minimumFractionDigits: decimals})}{suffix}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SIDEBAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const Sidebar = ({ activeWorkspace, setActiveWorkspace }: { activeWorkspace: string, setActiveWorkspace: (ws: string) => void }) => {
  const items = [
    { id: 'HOME', icon: Home, label: 'Home' },
    { id: 'SCANNER', icon: ScanLine, label: 'Scanner' },
    { id: 'EXECUTION', icon: Terminal, label: 'Execution' },
    { id: 'AGENTS', icon: Bot, label: 'Agents' },
    { id: 'PORTFOLIO', icon: Wallet, label: 'Portfolio' },
    { id: 'RISK', icon: ShieldAlert, label: 'Risk' },
    { id: 'ACTIVITY', icon: Activity, label: 'Activity' },
  ];

  return (
    <div 
      className="flex flex-col items-center py-4 gap-1 h-full relative"
      style={{ 
        width: '64px', 
        backgroundColor: COLORS.bg.secondary,
        borderRight: `1px solid ${COLORS.border.subtle}`
      }}
    >
      {/* Logo */}
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
        style={{ 
          backgroundColor: COLORS.accent.primary,
          boxShadow: `0 0 20px ${COLORS.accent.primaryGlow}`
        }}
      >
        <span className="text-white font-bold text-lg">P</span>
      </div>

      {/* Nav Items */}
      {items.map((item) => {
        const isActive = activeWorkspace === item.id;
        const Icon = item.icon;
        return (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveWorkspace(item.id)}
            className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group"
            style={{
              backgroundColor: isActive ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
            }}
          >
            {/* Active indicator - left border */}
            {isActive && (
              <motion.div
                layoutId="sidebarActive"
                className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full"
                style={{ backgroundColor: COLORS.accent.primary }}
              />
            )}

            <Icon 
              size={20} 
              style={{ 
                color: isActive ? COLORS.accent.primaryLight : COLORS.text.tertiary,
                transition: 'color 0.2s'
              }} 
            />

            {/* Tooltip */}
            <div 
              className="absolute left-14 px-2 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
              style={{ 
                backgroundColor: COLORS.bg.elevated, 
                color: COLORS.text.primary,
                border: `1px solid ${COLORS.border.subtle}`
              }}
            >
              {item.label}
            </div>
          </motion.button>
        );
      })}

      <div className="flex-1" />

      {/* Settings at bottom */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setActiveWorkspace('ADMIN')}
        className="w-12 h-12 rounded-xl flex items-center justify-center mt-auto transition-all duration-200"
        style={{ 
          backgroundColor: activeWorkspace === 'ADMIN' ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
          color: activeWorkspace === 'ADMIN' ? COLORS.accent.primaryLight : COLORS.text.tertiary 
        }}
      >
        <Settings size={20} />
      </motion.button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HEADER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const Header = ({ workspaceName }: { workspaceName: string }) => (
  <div 
    className="h-14 flex items-center justify-between px-6 shrink-0"
    style={{ 
      backgroundColor: COLORS.bg.secondary,
      borderBottom: `1px solid ${COLORS.border.subtle}`
    }}
  >
    {/* Left: Breadcrumb */}
    <div className="flex items-center gap-2">
      <span style={{ color: COLORS.text.tertiary }} className="text-sm">Workspace</span>
      <span style={{ color: COLORS.text.tertiary }} className="text-sm">/</span>
      <span style={{ color: COLORS.text.primary }} className="text-sm font-semibold tracking-wider">
        {workspaceName}
      </span>
    </div>

    {/* Right: Notifications + Avatar */}
    <div className="flex items-center gap-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ 
          backgroundColor: COLORS.bg.card,
          border: `1px solid ${COLORS.border.subtle}`
        }}
      >
        <Bell size={18} style={{ color: COLORS.text.secondary }} />
        <div 
          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
          style={{ backgroundColor: COLORS.accent.danger }}
        />
      </motion.button>

      <div className="flex items-center gap-2 cursor-pointer">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
          style={{ 
            backgroundColor: COLORS.accent.primary,
            color: 'white'
          }}
        >
          U
        </div>
        <ChevronDown size={14} style={{ color: COLORS.text.tertiary }} />
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// ORDER BOOK COMPONENT (Exact from reference image)
// ═══════════════════════════════════════════════════════════════════════════════

const OrderBook = () => {
  const maxAskTotal = Math.max(...ORDER_BOOK.asks.map(a => a.total));
  const maxBidTotal = Math.max(...ORDER_BOOK.bids.map(b => b.total));
  const spread = (ORDER_BOOK.asks[0].price - ORDER_BOOK.bids[0].price).toFixed(2);

  return (
    <Card className="h-full">
      <h3 
        className="text-sm font-semibold tracking-wider mb-4"
        style={{ color: COLORS.text.primary }}
      >
        ORDER BOOK
      </h3>

      {/* Headers */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-1">
        <span style={{ color: COLORS.text.tertiary }} className="text-left text-xs font-medium">PRICE</span>
        <span style={{ color: COLORS.text.tertiary }} className="w-16 text-right text-xs font-medium">SIZE</span>
        <span style={{ color: COLORS.text.tertiary }} className="w-16 text-right text-xs font-medium">TOTAL</span>
      </div>

      {/* Asks (Red) */}
      <div className="space-y-0.5">
        {ORDER_BOOK.asks.map((ask, i) => (
          <div key={i} className="relative grid grid-cols-[1fr_auto_auto] gap-4 py-1 px-1 rounded">
            {/* Depth bar */}
            <div 
              className="absolute right-0 top-0 bottom-0 rounded"
              style={{ 
                width: `${(ask.total / maxAskTotal) * 100}%`,
                backgroundColor: 'rgba(239, 68, 68, 0.1)'
              }}
            />
            <span 
              className="relative font-mono text-sm text-left"
              style={{ color: COLORS.accent.danger }}
            >
              {ask.price.toFixed(2)}
            </span>
            <span 
              className="relative w-16 font-mono text-sm text-right"
              style={{ color: COLORS.text.secondary }}
            >
              {ask.size}
            </span>
            <span 
              className="relative w-16 font-mono text-sm text-right"
              style={{ color: COLORS.text.secondary }}
            >
              {ask.total}
            </span>
          </div>
        ))}
      </div>

      {/* Spread Line */}
      <div 
        className="my-3 py-2 px-3 rounded-lg flex items-center justify-between"
        style={{ 
          backgroundColor: COLORS.bg.elevated,
          border: `1px solid ${COLORS.border.subtle}`
        }}
      >
        <span 
          className="font-mono text-lg font-bold"
          style={{ color: COLORS.accent.secondary }}
        >
          {ORDER_BOOK.bids[0].price.toFixed(2)}
        </span>
        <span style={{ color: COLORS.text.tertiary }} className="text-sm">
          Spread: <span className="font-mono">{spread}</span>
        </span>
      </div>

      {/* Bids (Green) */}
      <div className="space-y-0.5">
        {ORDER_BOOK.bids.map((bid, i) => (
          <div key={i} className="relative grid grid-cols-[1fr_auto_auto] gap-4 py-1 px-1 rounded">
            {/* Depth bar */}
            <div 
              className="absolute right-0 top-0 bottom-0 rounded"
              style={{ 
                width: `${(bid.total / maxBidTotal) * 100}%`,
                backgroundColor: 'rgba(16, 185, 129, 0.1)'
              }}
            />
            <span 
              className="relative font-mono text-sm text-left"
              style={{ color: COLORS.accent.secondary }}
            >
              {bid.price.toFixed(2)}
            </span>
            <span 
              className="relative w-16 font-mono text-sm text-right"
              style={{ color: COLORS.text.secondary }}
            >
              {bid.size}
            </span>
            <span 
              className="relative w-16 font-mono text-sm text-right"
              style={{ color: COLORS.text.secondary }}
            >
              {bid.total}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHART COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const Chart = () => {
  const [data, setData] = useState(generateChartData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        const lastPrice = prev[prev.length - 1].price;
        newData.push({
          time: newData[newData.length - 1].time,
          price: parseFloat((lastPrice + (Math.random() - 0.5) * 0.5).toFixed(2))
        });
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-64">
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-sm font-semibold tracking-wider"
          style={{ color: COLORS.text.primary }}
        >
          PRICE ACTION
        </h3>
        <Badge color="success">LIVE</Badge>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
          <XAxis 
            dataKey="time" 
            stroke={COLORS.text.tertiary}
            tick={{ fill: COLORS.text.tertiary, fontSize: 10 }}
          />
          <YAxis 
            domain={['dataMin - 1', 'dataMax + 1']}
            stroke={COLORS.text.tertiary}
            tick={{ fill: COLORS.text.tertiary, fontSize: 10 }}
            tickFormatter={(v) => v.toFixed(2)}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: COLORS.bg.elevated,
              border: `1px solid ${COLORS.border.subtle}`,
              borderRadius: '12px',
              color: COLORS.text.primary
            }}
            itemStyle={{ color: COLORS.accent.primaryLight }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#7C3AED" 
            strokeWidth={2}
            fill="url(#chartGradient)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const EventCard = ({ event }: { event: any, key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.01, y: -2 }}
    className="rounded-2xl p-5 mb-4"
    style={{
      backgroundColor: COLORS.bg.card,
      border: `1px solid ${COLORS.border.subtle}`
    }}
  >
    {/* Header */}
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 
          className="text-base font-semibold mb-1"
          style={{ color: COLORS.text.primary }}
        >
          {event.title}
        </h3>
        <div className="flex items-center gap-2">
          <Badge color="neutral">{event.category}</Badge>
          <span style={{ color: COLORS.text.tertiary }} className="text-xs font-mono">
            {event.id}
          </span>
        </div>
      </div>
      <PriceDisplay value={event.ev} prefix="+" suffix="%" className="text-lg" />
    </div>

    {/* Market Info */}
    <div className="flex items-center justify-between mb-4">
      <Badge color="primary">{event.market}</Badge>
      <span style={{ color: COLORS.text.tertiary }} className="text-xs font-mono">
        VOL: ${event.vol.toLocaleString()}
      </span>
    </div>

    {/* Yes/No Buttons */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="py-3 rounded-xl text-center font-mono font-semibold text-sm cursor-pointer"
        style={{
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: COLORS.accent.secondary,
          border: `1px solid rgba(16, 185, 129, 0.2)`
        }}
      >
        YES {event.yes.toFixed(1)}¢
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="py-3 rounded-xl text-center font-mono font-semibold text-sm cursor-pointer"
        style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: COLORS.accent.danger,
          border: `1px solid rgba(239, 68, 68, 0.2)`
        }}
      >
        NO {event.no.toFixed(1)}¢
      </motion.button>
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// WORKSPACE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const HomeWorkspace = () => (
  <div className="space-y-4">
    {/* Stats Row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'REALIZED PNL', value: 1240.50, prefix: '$', suffix: '' },
        { label: 'UNREALIZED', value: 450.20, prefix: '$', suffix: '' },
        { label: 'TOTAL EQUITY', value: 15690.70, prefix: '$', suffix: '' },
        { label: 'ACTIVE AGENTS', value: 3, prefix: '', suffix: '' },
      ].map((stat, i) => (
        <Card key={i}>
          <span style={{ color: COLORS.text.tertiary }} className="text-xs font-medium tracking-wider">
            {stat.label}
          </span>
          <div className="mt-2">
            <PriceDisplay 
              value={stat.value} 
              prefix={stat.prefix} 
              suffix={stat.suffix}
              className="text-xl"
            />
          </div>
        </Card>
      ))}
    </div>

    {/* Chart + Order Book */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[400px]">
      <Chart />
      <OrderBook />
    </div>
  </div>
);

const ScannerWorkspace = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const tabs = ['ALL', 'POLYMARKET', 'KALSHI', 'PREDICT.FUN'];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(tab => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer"
            style={{
              backgroundColor: activeTab === tab ? COLORS.accent.primary : COLORS.bg.card,
              color: activeTab === tab ? 'white' : COLORS.text.secondary,
              border: `1px solid ${activeTab === tab ? COLORS.accent.primary : COLORS.border.subtle}`
            }}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      {/* Events */}
      <div className="space-y-0">
        {EVENTS.filter(e => activeTab === 'ALL' || e.market.toUpperCase() === activeTab).map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

const ExecutionWorkspace = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[600px]">
    <div className="space-y-4">
      <Chart />
      <Card>
        <h3 style={{ color: COLORS.text.primary }} className="text-sm font-semibold mb-4">
          ORDER ENTRY
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
              className="py-3 rounded-xl font-semibold text-sm cursor-pointer"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: COLORS.accent.secondary }}
            >
              BUY / YES
            </button>
            <button 
              className="py-3 rounded-xl font-semibold text-sm cursor-pointer"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: COLORS.accent.danger }}
            >
              SELL / NO
            </button>
          </div>
          <input 
            type="text" 
            placeholder="Symbol (e.g. E-FED-001)"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ 
              backgroundColor: COLORS.bg.input,
              color: COLORS.text.primary,
              border: `1px solid ${COLORS.border.subtle}`
            }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input 
              type="number" 
              placeholder="Price"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono"
              style={{ 
                backgroundColor: COLORS.bg.input,
                color: COLORS.text.primary,
                border: `1px solid ${COLORS.border.subtle}`
              }}
            />
            <input 
              type="number" 
              placeholder="Size"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono"
              style={{ 
                backgroundColor: COLORS.bg.input,
                color: COLORS.text.primary,
                border: `1px solid ${COLORS.border.subtle}`
              }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl font-semibold text-sm cursor-pointer"
            style={{ 
              backgroundColor: COLORS.accent.primary,
              color: 'white',
              boxShadow: `0 0 20px ${COLORS.accent.primaryGlow}`
            }}
          >
            PLACE ORDER
          </motion.button>
        </div>
      </Card>
    </div>
    <OrderBook />
  </div>
);

const PortfolioWorkspace = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <span style={{ color: COLORS.text.tertiary }} className="text-xs">NET DELTA</span>
        <div className="mt-2">
          <PriceDisplay value={12450.0} prefix="$" className="text-2xl mt-2 block" />
        </div>
      </Card>
      <Card>
        <span style={{ color: COLORS.text.tertiary }} className="text-xs">REALIZED PNL</span>
        <div className="mt-2">
           <PriceDisplay value={1200.5} prefix="$" className="text-2xl mt-2 block" />
        </div>
      </Card>
      <Card>
        <span style={{ color: COLORS.text.tertiary }} className="text-xs">UNREALIZED M2M</span>
        <div className="mt-2">
          <PriceDisplay value={450.2} prefix="$" className="text-2xl mt-2 block" />
        </div>
      </Card>
    </div>

    <Card>
      <h3 style={{ color: COLORS.text.primary }} className="text-sm font-semibold mb-4">
        POSITIONS
      </h3>
      <div className="space-y-2">
        {POSITIONS.map((pos, i) => (
          <div 
            key={i}
            className="flex items-center justify-between p-3 rounded-xl"
            style={{ backgroundColor: COLORS.bg.elevated }}
          >
            <div className="flex items-center gap-3">
              <Badge color={pos.side === 'LONG' ? 'success' : 'danger'}>{pos.side}</Badge>
              <span style={{ color: COLORS.text.primary }} className="font-mono text-sm">{pos.symbol}</span>
            </div>
            <div className="flex items-center gap-6">
              <span style={{ color: COLORS.text.secondary }} className="font-mono text-sm">{pos.size} units</span>
              <span style={{ color: COLORS.text.secondary }} className="font-mono text-sm">@{pos.entry}</span>
              <PriceDisplay value={pos.pnl} prefix="$" className="font-mono" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const RiskWorkspace = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <Card>
      <h3 style={{ color: COLORS.text.primary }} className="text-sm font-semibold mb-4">
        RISK METRICS
      </h3>
      <div className="space-y-4">
        {[
          { label: 'VaR (95%)', value: '2.3%', color: COLORS.accent.secondary },
          { label: 'Max Drawdown', value: '1.2%', color: COLORS.accent.secondary },
          { label: 'Sharpe Ratio', value: '1.85', color: COLORS.accent.secondary },
          { label: 'Margin Utilization', value: '45.5%', color: COLORS.accent.warning },
        ].map((metric, i) => (
          <div key={i} className="flex items-center justify-between">
            <span style={{ color: COLORS.text.secondary }} className="text-sm">{metric.label}</span>
            <span style={{ color: metric.color }} className="font-mono font-semibold">{metric.value}</span>
          </div>
        ))}
      </div>
    </Card>
    <Card>
      <h3 style={{ color: COLORS.text.primary }} className="text-sm font-semibold mb-4">
        CIRCUIT BREAKERS
      </h3>
      <div className="space-y-3">
        {[
          { label: 'Daily Loss Limit', status: 'ACTIVE', threshold: '$500' },
          { label: 'Position Size Limit', status: 'ACTIVE', threshold: '$5,000' },
          { label: 'Kill Switch', status: 'ARMED', threshold: 'Manual' },
        ].map((cb, i) => (
          <div 
            key={i}
            className="flex items-center justify-between p-3 rounded-xl"
            style={{ backgroundColor: COLORS.bg.elevated }}
          >
            <div>
              <span style={{ color: COLORS.text.primary }} className="text-sm font-medium">{cb.label}</span>
              <span style={{ color: COLORS.text.tertiary }} className="text-xs block">{cb.threshold}</span>
            </div>
            <Badge color={cb.status === 'ARMED' ? 'danger' : 'success'}>{cb.status}</Badge>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const AgentsWorkspace = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center bg-[#1A1A1A] p-4 rounded-xl border border-[rgba(255,255,255,0.06)]">
      <div>
        <h3 className="text-sm font-semibold tracking-wider text-[#F5F5F5]">OPENCLAW SWARM OPERATOR</h3>
        <p className="text-xs text-[#A1A1AA] mt-1">Oasis protocol driven asynchronous swarm intelligence</p>
      </div>
      <div className="flex gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
          <span className="text-[#10B981] text-[10px] font-bold tracking-wider">CONSENSUS MET</span>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-4 py-2 bg-[#7C3AED] text-white rounded-xl text-xs font-semibold flex items-center shadow-[0_0_15px_rgba(124,58,237,0.3)]">
          <Plus size={16} className="mr-1" />
          DEPLOY SWARM AGENT
        </motion.button>
      </div>
    </div>

    {/* Swarm Engine Status and Risk Profile */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <span className="text-[10px] text-[#A1A1AA] font-bold tracking-widest block mb-2">MAX DRAWDOWN LIMIT</span>
        <div className="text-lg font-mono text-[#F5F5F5]">15.0%</div>
      </Card>
      <Card>
        <span className="text-[10px] text-[#A1A1AA] font-bold tracking-widest block mb-2">VOLATILITY THRESHOLD</span>
        <div className="text-lg font-mono text-[#F5F5F5]">5.0%</div>
      </Card>
      <Card>
        <span className="text-[10px] text-[#A1A1AA] font-bold tracking-widest block mb-2">PNL REWARD RATIO</span>
        <div className="text-lg font-mono text-[#F5F5F5]">2.5x</div>
      </Card>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[1, 2, 3].map((agent) => {
        const roles = ['Validator', 'Trader', 'Strategist'];
        const role = roles[(agent - 1) % 3];
        const isActive = agent !== 2;
        
        return (
          <Card key={agent} className="flex flex-col gap-4 relative overflow-hidden">
            {/* Background pattern for swarm visual */}
            <div className="absolute right-0 top-0 opacity-[0.03] pointer-events-none">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L22 7L22 17L12 22L2 17L2 7L12 2Z" />
              </svg>
            </div>
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h4 className="text-[#F5F5F5] font-semibold flex items-center gap-2">
                  SwarmAgent_0{agent}
                  <span className="px-1.5 py-0.5 rounded border border-[#333] bg-[#242424] text-[9px] text-[#A1A1AA] tracking-wider uppercase font-mono">
                    {role}
                  </span>
                </h4>
                <span className="text-[#A1A1AA] text-xs font-mono ml-0 block mt-1">Status: Awaiting task...</span>
              </div>
              <Badge color={!isActive ? 'danger' : 'success'}>{!isActive ? 'OFFLINE' : 'ACTIVE'}</Badge>
            </div>
            
            <div className="h-16 w-full opacity-50 relative z-10">
               <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={generateChartData().slice(0, 20)}>
                  <Area type="monotone" dataKey="price" stroke={isActive ? "#10B981" : "#A1A1AA"} strokeWidth={2} fill={isActive ? "rgba(16, 185, 129, 0.1)" : "rgba(161, 161, 170, 0.1)"} />
                </AreaChart>
               </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between items-center border-t border-[rgba(255,255,255,0.06)] pt-4 mt-2 relative z-10">
              <div>
                <span className="text-[#52525B] text-[10px] uppercase block tracking-wider font-bold">Consensus Vote</span>
                <span className={`text-xs font-mono font-bold ${isActive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                  {isActive ? 'SUCCESS' : 'FAILED'}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.1)] text-xs font-medium text-[#F5F5F5] hover:bg-white/5 transition-colors">
                  Logs
                </button>
                <button className={`px-3 py-1.5 rounded-lg text-xs font-medium ${!isActive ? 'bg-[#10B981]/20 text-[#10B981] hover:bg-[#10B981]/30' : 'bg-[#EF4444]/20 text-[#EF4444] hover:bg-[#EF4444]/30'} transition-colors`}>
                  {!isActive ? 'Reboot' : 'Halt Agent'}
                </button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  </div>
);

const SystemWorkspace = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
       {[
         { name: 'API Latency', value: '12ms', color: 'success' },
         { name: 'Database', value: '450 ops/s', color: 'primary' },
         { name: 'WebSocket', value: 'Connected', color: 'success' },
         { name: 'Memory', value: '45%', color: 'warning' }
       ].map((metric, i) => (
         <Card key={i} className="flex flex-col">
            <span className="text-xs text-[#A1A1AA] uppercase tracking-wider">{metric.name}</span>
            <div className="text-lg font-mono text-[#F5F5F5] font-semibold mt-2">{metric.value}</div>
         </Card>
       ))}
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="flex flex-col min-h-[400px]">
         <h3 className="text-sm font-semibold tracking-wider text-[#F5F5F5] mb-4">LIVE LOG STREAM</h3>
         <div className="flex-1 bg-[#0A0A0A] rounded-xl border border-[#333] p-4 overflow-y-auto font-mono text-xs space-y-2">
            {[1,2,3,4,5,6,7].map((i) => (
              <div key={i} className="flex gap-3">
                <span className="text-[#52525B]">14:2{i}:01</span>
                {i % 3 === 0 ? <span className="text-[#F59E0B]">[WARN]</span> : <span className="text-[#10B981]">[INFO]</span>}
                <span className="text-[#A1A1AA]">
                  {i % 3 === 0 ? `Rate limit approaching for endpoint: /v1/market/${i}` : `Successfully processed batch ${i*112}`}
                </span>
              </div>
            ))}
         </div>
      </Card>
      
      <Card className="flex flex-col min-h-[400px]">
         <h3 className="text-sm font-semibold tracking-wider text-[#F5F5F5] mb-4">AUDIT TRAIL</h3>
         <div className="space-y-3">
           {[
             { user: 'SYSTEM', action: 'Risk Limits Reset', status: 'Success' },
             { user: 'admin@claw.os', action: 'Deployed Agent_Alpha', status: 'Success' },
             { user: 'SYSTEM', action: 'Market Data Sync Exception', status: 'Failed' },
           ].map((audit, i) => (
             <div key={i} className="p-3 bg-[#0A0A0A] rounded-xl border border-[#333] flex justify-between items-center">
                <div>
                  <div className="text-[#F5F5F5] text-sm font-medium">{audit.action}</div>
                  <div className="text-[#A1A1AA] text-xs font-mono">{audit.user}</div>
                </div>
                <Badge color={audit.status === 'Success' ? 'success' : 'danger'}>{audit.status}</Badge>
             </div>
           ))}
         </div>
      </Card>
    </div>
  </div>
);

const SecretInput = ({ label, envKey, isDanger = false, defaultValue = "" }: { label: string, envKey: string, isDanger?: boolean, defaultValue?: string }) => {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(defaultValue);
  return (
    <div>
      <label className="text-xs text-[#A1A1AA] uppercase tracking-wider mb-2 flex justify-between items-center">
        <span>{label}</span>
        <span className="text-[#10B981] ml-2 text-[9px] bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/20">ENCRYPTED</span>
      </label>
      <div className="relative">
        <input 
          type={show ? "text" : "password"} 
          value={value} 
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter API Key or Secret"
          className={`w-full bg-[#0A0A0A] border ${isDanger ? 'border-[#EF4444]/30 text-[#EF4444] focus:border-[#EF4444]' : 'border-[#333] text-[#F5F5F5] focus:border-[#7C3AED]'} rounded-xl p-3 pr-20 text-sm font-mono outline-none transition-colors`} 
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
           <button 
             onClick={() => setShow(!show)}
             className="text-[10px] text-[#A1A1AA] hover:text-[#F5F5F5] px-2 py-1 bg-[#1A1A1A] rounded-lg border border-[#333] transition-colors cursor-pointer"
           >
             {show ? 'HIDE' : 'SHOW'}
           </button>
        </div>
      </div>
      <div className="mt-1.5 text-[10px] text-[#52525B] font-mono flex items-center gap-1">
        <ShieldAlert size={10} /> Saved to secure vault as <code>{envKey}</code>
      </div>
    </div>
  );
};

const AdminWorkspace = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  return (
  <div className="space-y-4">
    <div className="flex justify-between items-center bg-[#1A1A1A] p-4 rounded-xl border border-[rgba(255,255,255,0.06)] flex-wrap gap-4">
      <div>
        <h3 className="text-sm font-semibold tracking-wider text-[#F5F5F5]">SYSTEM ADMINISTRATION & SECURITY VAULT</h3>
        <p className="text-xs text-[#A1A1AA] mt-1">Configure global parameters and manage encrypted API keys. Secrets are never exposed to the client bundle.</p>
      </div>
      <div className="flex items-center gap-3">
        {saved && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[#10B981] text-xs font-bold tracking-wider flex items-center gap-1"
          >
            <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
            CONFIG APPLIED
          </motion.div>
        )}
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={handleSave}
          disabled={isSaving}
          className={`px-4 py-2 ${isSaving ? 'bg-[#10B981]/50 cursor-not-allowed' : 'bg-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.3)]'} text-white rounded-xl text-xs font-semibold overflow-hidden relative`}
        >
          {isSaving ? 'APPLYING...' : 'APPLY CONFIGURATION'}
        </motion.button>
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
       {/* SECRETS VAULT */}
       <Card style={{ borderColor: 'rgba(124, 58, 237, 0.2)' }}>
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert size={16} color="#7C3AED" />
            <h4 className="text-[#7C3AED] text-sm font-bold tracking-wide uppercase">API Secrets Vault</h4>
          </div>
          <div className="space-y-5">
            <SecretInput label="OpenAI API Key (Agents)" envKey="VITE_OPENAI_API_KEY" />
            <SecretInput label="Polygon.io Market Data" envKey="VITE_POLYGON_API_KEY" defaultValue="••••••••••••••••" />
            <div className="pt-2 border-t border-[#333]">
              <SecretInput label="Brokerage Secret (Alpaca)" envKey="VITE_ALPACA_SECRET_KEY" isDanger={true} />
            </div>
            <div className="text-xs text-[#A1A1AA] bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-[#F59E0B] font-bold">NOTE: </span> 
              Do not commit these values to version control. Set them in your <code>.env</code> file or deployment CI/CD variables.
            </div>
          </div>
       </Card>
       
       <div className="space-y-4">
         {/* INFRASTRUCTURE DEFAULTS */}
         <Card>
            <h4 className="text-[#F5F5F5] text-sm font-bold mb-4 tracking-wide uppercase">Infrastructure Connections</h4>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#A1A1AA] uppercase tracking-wider mb-2 block">Polygon Node WSS</label>
                <input type="text" defaultValue="wss://polygon-mainnet.g.alchemy.com/v2" className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl p-3 text-sm text-[#F5F5F5] font-mono outline-none focus:border-[#7C3AED] transition-colors" />
              </div>
              <div>
                <label className="text-xs text-[#A1A1AA] uppercase tracking-wider mb-2 block flex justify-between">
                  <span>Database Connection String</span>
                  <span className="text-[#10B981] ml-2 text-[9px] bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/20">ENCRYPTED</span>
                </label>
                <input type="password" defaultValue="postgres://system:***@db.internal:5432" className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl p-3 text-sm text-[#F5F5F5] font-mono outline-none focus:border-[#7C3AED] transition-colors" />
                <div className="mt-1 text-[10px] text-[#52525B] font-mono flex items-center gap-1">
                   <ShieldAlert size={10} /> Sourced from <code>VITE_DATABASE_URL</code>
                </div>
              </div>
            </div>
         </Card>

         {/* GLOBAL RISK BOUNDS */}
         <Card style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
            <h4 className="text-[#F59E0B] text-sm font-bold mb-4 tracking-wide uppercase">Global Risk Bounds</h4>
            <div className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 <div>
                   <label className="text-xs text-[#A1A1AA] uppercase tracking-wider mb-2 block">Max Slippage (%)</label>
                   <input type="number" defaultValue={2.0} className="w-full bg-[#242424] border border-[#333] rounded-xl p-3 text-sm text-[#F5F5F5] font-mono focus:border-[#7C3AED] outline-none transition-colors" />
                 </div>
                 <div>
                   <label className="text-xs text-[#A1A1AA] uppercase tracking-wider mb-2 block">Order Timeout (ms)</label>
                   <input type="number" defaultValue={5000} className="w-full bg-[#242424] border border-[#333] rounded-xl p-3 text-sm text-[#F5F5F5] font-mono focus:border-[#7C3AED] outline-none transition-colors" />
                 </div>
               </div>
               <div>
                 <label className="text-xs text-[#A1A1AA] uppercase tracking-wider mb-2 block flex justify-between">
                   <span>Drawdown Kill Switch (%)</span>
                   <span className="text-[#EF4444]">DANGER ZONE</span>
                 </label>
                 <input type="number" defaultValue={5.0} className="w-full bg-[#242424] border border-[#EF4444]/30 text-[#EF4444] rounded-xl p-3 text-sm font-mono focus:border-[#EF4444] outline-none transition-colors" />
               </div>
               
               <div className="flex items-center justify-between pt-3 border-t border-[#333]">
                  <div>
                    <div className="text-sm text-[#F5F5F5] font-medium">Require 2FA for System Halt</div>
                    <div className="text-xs text-[#A1A1AA]">Prompt for authenticator code when shutting down agents</div>
                  </div>
                  <div className="w-10 h-6 bg-[#7C3AED] rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 bottom-1 w-4 bg-white rounded-full"></div>
                  </div>
               </div>
            </div>
         </Card>
       </div>
    </div>
  </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// BOTTOM NAV (Mobile)
// ═══════════════════════════════════════════════════════════════════════════════

const BottomNav = ({ activeWorkspace, setActiveWorkspace }: { activeWorkspace: string, setActiveWorkspace: (ws: string) => void }) => {
  const items = [
    { id: 'HOME', icon: Home, label: 'Home' },
    { id: 'SCANNER', icon: ScanLine, label: 'Scanner' },
    { id: 'EXECUTION', icon: Terminal, label: 'Trade' },
    { id: 'AGENTS', icon: Bot, label: 'Agents' },
    { id: 'PORTFOLIO', icon: Wallet, label: 'Portfolio' },
    { id: 'RISK', icon: ShieldAlert, label: 'Risk' },
    { id: 'ACTIVITY', icon: Activity, label: 'System' },
    { id: 'ADMIN', icon: Settings, label: 'Admin' },
  ];

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] flex items-center px-4 z-50 overflow-x-auto [&::-webkit-scrollbar]:hidden gap-6 pb-2 border-t border-white/5 bg-[#1A1A1A]/90 backdrop-blur-xl"
    >
      {items.map((item) => {
        const isActive = activeWorkspace === item.id;
        const Icon = item.icon;
        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveWorkspace(item.id)}
            className="flex flex-col items-center justify-center gap-1.5 cursor-pointer min-w-[56px] pt-2"
          >
            <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-[#7C3AED]/20' : 'bg-transparent'}`}>
              <Icon 
                size={22} 
                style={{ color: isActive ? '#7C3AED' : '#52525B' }}
              />
            </div>
            <span 
              className="text-[10px] font-medium whitespace-nowrap"
              style={{ color: isActive ? '#F5F5F5' : '#52525B' }}
            >
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [activeWorkspace, setActiveWorkspace] = useState('HOME');

  const workspaces: Record<string, { component: React.FC<any>, name: string }> = {
    HOME: { component: HomeWorkspace, name: 'DASHBOARD' },
    SCANNER: { component: ScannerWorkspace, name: 'SCANNER' },
    EXECUTION: { component: ExecutionWorkspace, name: 'EXECUTION' },
    AGENTS: { component: AgentsWorkspace, name: 'AGENTS' },
    PORTFOLIO: { component: PortfolioWorkspace, name: 'PORTFOLIO' },
    RISK: { component: RiskWorkspace, name: 'RISK MANAGEMENT' },
    ACTIVITY: { component: SystemWorkspace, name: 'SYSTEM LOGS' },
    ADMIN: { component: AdminWorkspace, name: 'ADMINISTRATION' }
  };

  const CurrentWorkspace = workspaces[activeWorkspace]?.component || HomeWorkspace;
  const workspaceName = workspaces[activeWorkspace]?.name || 'DASHBOARD';

  return (
    <div 
      className="h-screen w-full flex overflow-hidden lg:pl-16 relative"
      style={{ backgroundColor: COLORS.bg.primary, color: COLORS.text.primary }}
    >
      {/* Desktop Sidebar */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 z-50">
        <Sidebar activeWorkspace={activeWorkspace} setActiveWorkspace={setActiveWorkspace} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header workspaceName={workspaceName} />

        <main 
          className="flex-1 overflow-y-auto p-4 lg:p-6 pb-28 lg:pb-6"
          style={{ backgroundColor: COLORS.bg.primary }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeWorkspace}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full min-h-full"
            >
              <CurrentWorkspace />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav activeWorkspace={activeWorkspace} setActiveWorkspace={setActiveWorkspace} />
    </div>
  );
}
