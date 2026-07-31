import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DollarSign, Users, TrendingUp, Clock, Building2, Calendar, ChevronDown } from 'lucide-react';
import PaymentList from '../components/payments/PaymentList';
import BulkPayModal from '../components/payments/BulkPayModal';
import PaymentsService from '../app/services/payments.service';
import {
  PerformerPayment,
  StudioPaymentDto,
} from '../app/types/payments.types';

const STUDIOS = [{ id: '1', name: 'Charmss Studio' }];

const AVATAR_COLORS = [
  'bg-purple-500',
  'bg-pink-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-orange-500',
  'bg-indigo-500',
  'bg-red-500',
  'bg-teal-500',
  'bg-fuchsia-500',
  'bg-cyan-500',
  'bg-rose-500',
  'bg-violet-500',
];

interface WeekOption {
  id: string;
  week: number;
  year: number;
  label: string;
}

const toUtcDay = (date: Date) =>
  new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

const fromUtcDay = (date: Date) =>
  new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

const getISOWeekInfo = (date: Date) => {
  const d = toUtcDay(date);
  const dayNum = d.getUTCDay() || 7;

  const mondayUtc = new Date(d);
  mondayUtc.setUTCDate(d.getUTCDate() - (dayNum - 1));

  const sundayUtc = new Date(mondayUtc);
  sundayUtc.setUTCDate(mondayUtc.getUTCDate() + 6);

  const thursdayUtc = new Date(mondayUtc);
  thursdayUtc.setUTCDate(mondayUtc.getUTCDate() + 3);

  const year = thursdayUtc.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(
    ((thursdayUtc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );

  return {
    week,
    year,
    monday: fromUtcDay(mondayUtc),
    sunday: fromUtcDay(sundayUtc),
  };
};

const formatDayMonth = (date: Date) =>
  date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

const formatWeekRange = (monday: Date, sunday: Date) => {
  const sameYear = monday.getFullYear() === sunday.getFullYear();
  if (sameYear) {
    return `${formatDayMonth(monday)} – ${formatDayMonth(sunday)} ${sunday.getFullYear()}`;
  }
  return `${formatDayMonth(monday)} ${monday.getFullYear()} – ${formatDayMonth(sunday)} ${sunday.getFullYear()}`;
};

const generateRecentWeeks = (count = 8): WeekOption[] => {
  const weeks: WeekOption[] = [];
  const date = new Date();

  for (let i = 0; i < count; i++) {
    const { week, year, monday, sunday } = getISOWeekInfo(date);
    weeks.push({
      id: `${week}-${year}`,
      week,
      year,
      label: formatWeekRange(monday, sunday),
    });
    date.setDate(date.getDate() - 7);
  }

  return weeks;
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const mapDtoToPayment = (dto: StudioPaymentDto): PerformerPayment => ({
  id: String(dto.performerid),
  nickname: dto.nickname,
  fullname: dto.fullname,
  email: dto.email,
  initials: getInitials(dto.nickname || dto.fullname),
  avatar_color: AVATAR_COLORS[dto.performerid % AVATAR_COLORS.length],
  total_sales: parseFloat(dto.totalsales),
  total_payment: parseFloat(dto.totalpayment),
  commission_percent: parseFloat(dto.percentcomission),
  price_token: parseFloat(dto.pricetoken),
  payment_status: dto.statuspayment,
});

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export default function Payments() {
  const weekOptions = useMemo(() => generateRecentWeeks(), []);
  const [payments, setPayments] = useState<PerformerPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudio, setSelectedStudio] = useState(STUDIOS[0].id);
  const [selectedWeek, setSelectedWeek] = useState(weekOptions[0].id);
  const [bulkPayOpen, setBulkPayOpen] = useState(false);

  const parseWeekSelection = (weekId: string) => {
    const [week, year] = weekId.split('-').map(Number);
    return { weekofYear: week, year };
  };

  const selectedWeekLabel = useMemo(
    () => weekOptions.find((week) => week.id === selectedWeek)?.label ?? selectedWeek,
    [weekOptions, selectedWeek]
  );

  const priceToken = useMemo(() => {
    const value = payments.find((p) => Number.isFinite(p.price_token))?.price_token;
    return value ?? null;
  }, [payments]);

  const loadPayments = useCallback(async () => {
    const { weekofYear, year } = parseWeekSelection(selectedWeek);
    const studioId = Number(selectedStudio);

    setLoading(true);
    setError(null);

    try {
      const data = await PaymentsService.getStudioSales({
        weekofYear,
        year,
        studioId,
      });
      setPayments(data.map(mapDtoToPayment));
    } catch (err) {
      console.error('Error loading studio payments:', err);
      setPayments([]);
      setError('Could not load payments. Please check your connection to the server.');
    } finally {
      setLoading(false);
    }
  }, [selectedStudio, selectedWeek]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleConfirmBulkPay = (selectedPayments: PerformerPayment[]) => {
    const selectedIds = new Set(selectedPayments.map((p) => p.id));
    setPayments((prev) =>
      prev.map((p) => (selectedIds.has(p.id) ? { ...p, payment_status: 'PAID' } : p))
    );
    setBulkPayOpen(false);
  };

  const stats = useMemo(() => {
    const totalPayment = payments.reduce((sum, p) => sum + p.total_payment, 0);
    const totalSales = payments.reduce((sum, p) => sum + p.total_sales, 0);
    const activePerformers = payments.length;
    const pendingPayments = payments.filter(
      (p) => p.payment_status === 'GENERATED' || p.payment_status === 'PENDING'
    ).length;

    return [
      {
        label: 'Total Payments',
        value: formatCurrency(totalPayment),
        icon: DollarSign,
        color: 'bg-green-600',
      },
      {
        label: 'Total Sales',
        value: formatCurrency(totalSales),
        icon: TrendingUp,
        color: 'bg-blue-600',
      },
      {
        label: 'Performers',
        value: String(activePerformers),
        icon: Users,
        color: 'bg-purple-600',
      },
      {
        label: 'Pending Payments',
        value: String(pendingPayments),
        icon: Clock,
        color: 'bg-pink-600',
      },
    ];
  }, [payments]);

  return (
    <div className="md:h-full md:flex md:flex-col md:overflow-hidden md:gap-4 gap-6">
      <div className="flex-shrink-0 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-linear-to-r from-pink-600 to-purple-600 rounded-lg">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <span className="flex items-baseline gap-2">
            Payments
            {priceToken !== null && (
              <span className="text-sm font-normal text-gray-400 dark:text-gray-500">
                (Price Token: {priceToken.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                US)
              </span>
            )}
          </span>
        </h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative sm:w-56">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <select
              id="studio-select"
              value={selectedStudio}
              onChange={(e) => setSelectedStudio(e.target.value)}
              aria-label="Studio"
              className="w-full appearance-none pl-10 pr-9 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent cursor-pointer"
            >
              {STUDIOS.map((studio) => (
                <option key={studio.id} value={studio.id}>
                  {studio.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative sm:w-64">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <select
              id="week-select"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              aria-label="Week"
              className="w-full appearance-none pl-10 pr-9 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent cursor-pointer"
            >
              {weekOptions.map((week) => (
                <option key={week.id} value={week.id}>
                  {week.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-800 rounded-lg p-3.5 border border-gray-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-4 md:p-5 md:flex-1 md:min-h-0 md:flex md:flex-col md:overflow-hidden">
        <PaymentList
          payments={payments}
          loading={loading}
          error={error}
          onBulkPay={() => setBulkPayOpen(true)}
        />
      </div>

      <BulkPayModal
        payments={payments}
        weekLabel={selectedWeekLabel}
        open={bulkPayOpen}
        onClose={() => setBulkPayOpen(false)}
        onConfirm={handleConfirmBulkPay}
      />
    </div>
  );
}
