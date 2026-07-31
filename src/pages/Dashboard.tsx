import React, { useState } from 'react';
import { Users, Eye, ShoppingBag, DollarSign, TrendingUp, RefreshCw } from 'lucide-react';
import { useDashboardSales } from '../hooks/useDashboardSales';

interface DashboardProps {
  earnings: number;
  isStreaming: boolean;
}

const AVATAR_COLORS = [
  'bg-purple-500',
  'bg-pink-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-orange-500',
  'bg-indigo-500',
  'bg-red-500',
  'bg-teal-500',
];

const formatCurrency = (value: number) =>
  `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatCount = (value: number) => value.toLocaleString('en-US');

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || '?';
};

const Dashboard: React.FC<DashboardProps> = ({ earnings: _earnings, isStreaming: _isStreaming }) => {
  const {
    performers,
    onlinePerformers,
    customerQuantity,
    totalEarnings,
    totalSales,
    chartBars,
    quantityChartBars,
    loading,
    error,
    isRefreshing,
    refresh,
  } = useDashboardSales();

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredQuantityBar, setHoveredQuantityBar] = useState<number | null>(null);

  const stats = [
    {
      label: 'Total Sales',
      value: loading ? '—' : formatCurrency(totalSales),
      icon: ShoppingBag,
      color: 'bg-pink-600',
    },
    {
      label: 'Total Earnings',
      value: loading ? '—' : formatCurrency(totalEarnings),
      icon: DollarSign,
      color: 'bg-green-600',
    },
    {
      label: 'Active Performers',
      value: loading ? '—' : onlinePerformers.toLocaleString('en-US'),
      icon: Users,
      color: 'bg-blue-600',
    },
    {
      label: 'Total Clients Online',
      value: loading ? '—' : customerQuantity.toLocaleString('en-US'),
      icon: Eye,
      color: 'bg-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={isRefreshing || loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          title="Actualizar datos"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Actualizar</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-slate-800 rounded-lg p-3 md:p-6 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs md:text-sm">{stat.label}</p>
                  <p className="text-lg md:text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-2 md:p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
        {/* Earnings Chart */}
        <div className="bg-slate-800 rounded-lg p-3 md:p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base md:text-lg font-semibold">Weekly Earnings</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>

          {loading ? (
            <div className="h-32 md:h-48 flex items-center justify-center text-sm text-gray-400">
              Cargando ventas...
            </div>
          ) : error ? (
            <div className="h-32 md:h-48 flex items-center justify-center text-sm text-red-400">
              {error}
            </div>
          ) : (
            <>
              <div className="h-32 md:h-48 flex items-end justify-between gap-1 md:gap-2">
                {chartBars.map((bar, index) => (
                  <div
                    key={bar.key}
                    className="group relative flex-1 flex flex-col items-center justify-end h-full cursor-pointer"
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {hoveredBar === index && (
                      <div className="absolute -top-8 z-10 whitespace-nowrap rounded bg-slate-950 px-2 py-1 text-xs font-medium text-white shadow-lg border border-slate-600">
                        {bar.hasValue ? formatCurrency(bar.earnings) : 'Sin datos'}
                      </div>
                    )}
                    <div
                      className={`w-full rounded-t transition-all ${
                        bar.hasValue
                          ? 'bg-pink-600 group-hover:bg-pink-500 min-h-[4px]'
                          : 'bg-slate-700/60 group-hover:bg-slate-600 min-h-[2px]'
                      }`}
                      style={{ height: bar.hasValue ? `${Math.max(bar.height, 2)}%` : '2%' }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between gap-1 md:gap-2">
                {chartBars.map((bar) => (
                  <div
                    key={`${bar.key}-label`}
                    className="flex-1 min-w-0 text-center"
                  >
                    <p className="text-[10px] md:text-xs font-medium text-gray-200 leading-tight truncate">
                      {bar.hasValue ? formatCurrency(bar.earnings) : '—'}
                    </p>
                    <p className="mt-0.5 text-[10px] md:text-xs text-gray-400">{bar.label}</p>
                  </div>
                ))}
              </div>
              {!chartBars.some((bar) => bar.hasValue) && (
                <p className="mt-3 text-center text-xs text-gray-500">
                  No hay ventas registradas esta semana.
                </p>
              )}
            </>
          )}
        </div>

        {/* Top Performers */}
        <div className="bg-slate-800 rounded-lg p-3 md:p-6 border border-slate-700 flex flex-col min-h-0">
          <h3 className="text-base md:text-lg font-semibold mb-4">Top Performers</h3>

          {loading ? (
            <div className="h-32 md:h-48 flex items-center justify-center text-sm text-gray-400">
              Cargando modelos...
            </div>
          ) : error ? (
            <div className="h-32 md:h-48 flex items-center justify-center text-sm text-red-400">
              {error}
            </div>
          ) : performers.length === 0 ? (
            <div className="h-32 md:h-48 flex items-center justify-center text-sm text-gray-400">
              No hay modelos con ventas esta semana.
            </div>
          ) : (
            <div className="space-y-3 max-h-64 md:max-h-72 overflow-y-auto scrollbar-hide pr-1">
              {performers.map((performer, index) => {
                const displayName = (performer.nickname || performer.fullname).trim();
                const sales = parseFloat(performer.totalsales) || 0;
                const avatarColor = AVATAR_COLORS[performer.performerid % AVATAR_COLORS.length];

                return (
                  <div key={performer.performerid} className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="w-5 shrink-0 text-xs text-gray-500 font-medium text-right">
                        {index + 1}
                      </span>
                      <div
                        className={`w-6 h-6 md:w-8 md:h-8 ${avatarColor} rounded-full flex items-center justify-center shrink-0`}
                      >
                        <span className="text-xs font-bold text-white">
                          {getInitials(displayName)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm text-white font-medium truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{performer.email}</p>
                      </div>
                    </div>
                    <span className="text-green-500 font-medium text-xs md:text-sm shrink-0">
                      {formatCurrency(sales)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Daily Customers & Performers Chart */}
      <div className="bg-slate-800 rounded-lg p-3 md:p-6 border border-slate-700">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-base md:text-lg font-semibold">Daily Customers & Performers</h3>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-purple-500" />
              Customers
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" />
              Performers
            </span>
          </div>
        </div>

        {loading ? (
          <div className="h-32 md:h-48 flex items-center justify-center text-sm text-gray-400">
            Cargando cantidades...
          </div>
        ) : error ? (
          <div className="h-32 md:h-48 flex items-center justify-center text-sm text-red-400">
            {error}
          </div>
        ) : (
          <>
            <div className="h-32 md:h-48 flex items-end justify-between gap-1 md:gap-3">
              {quantityChartBars.map((bar, index) => (
                <div
                  key={bar.key}
                  className="group relative flex-1 flex items-end justify-center gap-0.5 md:gap-1 h-full cursor-pointer"
                  onMouseEnter={() => setHoveredQuantityBar(index)}
                  onMouseLeave={() => setHoveredQuantityBar(null)}
                >
                  {hoveredQuantityBar === index && (
                    <div className="absolute -top-10 z-10 whitespace-nowrap rounded bg-slate-950 px-2 py-1 text-xs font-medium text-white shadow-lg border border-slate-600">
                      {bar.hasValue
                        ? `Customers: ${formatCount(bar.customers)} · Performers: ${formatCount(bar.performers)}`
                        : 'Sin datos'}
                    </div>
                  )}
                  <div
                    className={`w-full max-w-[18px] md:max-w-[28px] rounded-t transition-all ${
                      bar.hasValue
                        ? 'bg-purple-500 group-hover:bg-purple-400 min-h-[4px]'
                        : 'bg-slate-700/60 min-h-[2px]'
                    }`}
                    style={{
                      height: bar.hasValue ? `${Math.max(bar.customersHeight, 2)}%` : '2%',
                    }}
                  />
                  <div
                    className={`w-full max-w-[18px] md:max-w-[28px] rounded-t transition-all ${
                      bar.hasValue
                        ? 'bg-blue-500 group-hover:bg-blue-400 min-h-[4px]'
                        : 'bg-slate-700/60 min-h-[2px]'
                    }`}
                    style={{
                      height: bar.hasValue ? `${Math.max(bar.performersHeight, 2)}%` : '2%',
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between gap-1 md:gap-3">
              {quantityChartBars.map((bar) => (
                <div key={`${bar.key}-label`} className="flex-1 min-w-0 text-center">
                  <p className="text-[10px] md:text-xs font-medium text-purple-300 leading-tight truncate">
                    {bar.hasValue ? formatCount(bar.customers) : '—'}
                  </p>
                  <p className="text-[10px] md:text-xs font-medium text-blue-300 leading-tight truncate">
                    {bar.hasValue ? formatCount(bar.performers) : '—'}
                  </p>
                  <p className="mt-0.5 text-[10px] md:text-xs text-gray-400">{bar.label}</p>
                </div>
              ))}
            </div>
            {!quantityChartBars.some((bar) => bar.hasValue) && (
              <p className="mt-3 text-center text-xs text-gray-500">
                No hay datos de clientes o performers esta semana.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
