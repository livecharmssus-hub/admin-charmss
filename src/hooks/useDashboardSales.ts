import { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardService from '../app/services/dashboard.service';
import {
  GetSalesCurrentParams,
  SalesCurrentResponse,
  SalesDayDto,
  SalesPerformerResultDto,
} from '../app/types/dashboard.types';

const DEFAULT_STUDIO_ID = 1;

const WEEK_DAYS = [
  { daynum: 1, label: 'Mon' },
  { daynum: 2, label: 'Tue' },
  { daynum: 3, label: 'Wed' },
  { daynum: 4, label: 'Thu' },
  { daynum: 5, label: 'Fri' },
  { daynum: 6, label: 'Sat' },
  { daynum: 7, label: 'Sun' },
] as const;

export type DashboardChartBar = {
  key: string;
  label: string;
  height: number;
  earnings: number;
  hasValue: boolean;
};

export type DashboardQuantityBar = {
  key: string;
  label: string;
  customers: number;
  performers: number;
  customersHeight: number;
  performersHeight: number;
  hasValue: boolean;
};

const toUtcDay = (date: Date) =>
  new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

const getISOWeekInfo = (date: Date) => {
  const d = toUtcDay(date);
  const dayNum = d.getUTCDay() || 7;

  const mondayUtc = new Date(d);
  mondayUtc.setUTCDate(d.getUTCDate() - (dayNum - 1));

  const thursdayUtc = new Date(mondayUtc);
  thursdayUtc.setUTCDate(mondayUtc.getUTCDate() + 3);

  const year = thursdayUtc.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(((thursdayUtc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

  return { week, year };
};

const getCurrentSalesParams = (): GetSalesCurrentParams => {
  const { week, year } = getISOWeekInfo(new Date());
  return {
    weekofYear: week,
    year,
    studioId: DEFAULT_STUDIO_ID,
  };
};

const applySalesResponse = (data: SalesCurrentResponse) => ({
  salesDays: data.salesDay ?? [],
  performers: data.salesPerformerResults ?? [],
  onlinePerformers: data.onlinePerformers ?? 0,
  customerQuantity: data.customerQuantity ?? 0,
});

export const useDashboardSales = () => {
  const initialCache = DashboardService.getCached(getCurrentSalesParams());
  const initialData = initialCache ? applySalesResponse(initialCache) : null;

  const [salesDays, setSalesDays] = useState<SalesDayDto[]>(initialData?.salesDays ?? []);
  const [performers, setPerformers] = useState<SalesPerformerResultDto[]>(
    initialData?.performers ?? []
  );
  const [onlinePerformers, setOnlinePerformers] = useState(initialData?.onlinePerformers ?? 0);
  const [customerQuantity, setCustomerQuantity] = useState(initialData?.customerQuantity ?? 0);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadSalesCurrent = useCallback(async (force = false) => {
    const params = getCurrentSalesParams();

    if (!force) {
      const cached = DashboardService.getCached(params);
      if (cached) {
        const data = applySalesResponse(cached);
        setSalesDays(data.salesDays);
        setPerformers(data.performers);
        setOnlinePerformers(data.onlinePerformers);
        setCustomerQuantity(data.customerQuantity);
        setLoading(false);
        setError(null);
        return;
      }
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setError(null);

    try {
      const response = await DashboardService.getSalesCurrent(params, { force });
      const data = applySalesResponse(response);
      setSalesDays(data.salesDays);
      setPerformers(data.performers);
      setOnlinePerformers(data.onlinePerformers);
      setCustomerQuantity(data.customerQuantity);
    } catch (err) {
      console.error('Error loading dashboard sales:', err);
      if (!force) {
        setSalesDays([]);
        setPerformers([]);
        setOnlinePerformers(0);
        setCustomerQuantity(0);
      }
      setError('No se pudieron cargar las ventas de la semana.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadSalesCurrent(false);
  }, [loadSalesCurrent]);

  const chartBars = useMemo<DashboardChartBar[]>(() => {
    const byDaynum = new Map(
      salesDays.map((day) => [Number(day.daynum), parseFloat(day.totalearnings) || 0])
    );
    const values = WEEK_DAYS.map(({ daynum }) => byDaynum.get(daynum) ?? 0);
    const max = Math.max(...values, 0);

    return WEEK_DAYS.map(({ daynum, label }, index) => {
      const earningsValue = values[index];
      const height = max > 0 ? (earningsValue / max) * 100 : 0;

      return {
        key: `day-${daynum}`,
        label,
        height,
        earnings: earningsValue,
        hasValue: byDaynum.has(daynum),
      };
    });
  }, [salesDays]);

  const quantityChartBars = useMemo<DashboardQuantityBar[]>(() => {
    const byDaynum = new Map(
      salesDays.map((day) => [
        Number(day.daynum),
        {
          customers: parseInt(day.customerquantity, 10) || 0,
          performers: parseInt(day.performerquantiy, 10) || 0,
        },
      ])
    );

    const values = WEEK_DAYS.map(({ daynum }) => byDaynum.get(daynum) ?? { customers: 0, performers: 0 });
    const max = Math.max(...values.flatMap(({ customers, performers }) => [customers, performers]), 0);

    return WEEK_DAYS.map(({ daynum, label }, index) => {
      const { customers, performers } = values[index];

      return {
        key: `qty-day-${daynum}`,
        label,
        customers,
        performers,
        customersHeight: max > 0 ? (customers / max) * 100 : 0,
        performersHeight: max > 0 ? (performers / max) * 100 : 0,
        hasValue: byDaynum.has(daynum),
      };
    });
  }, [salesDays]);

  const totalEarnings = useMemo(
    () => salesDays.reduce((sum, day) => sum + (parseFloat(day.totalearnings) || 0), 0),
    [salesDays]
  );

  const totalSales = useMemo(
    () => salesDays.reduce((sum, day) => sum + (parseFloat(day.totalsales) || 0), 0),
    [salesDays]
  );

  const refresh = useCallback(() => loadSalesCurrent(true), [loadSalesCurrent]);

  return {
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
  };
};
