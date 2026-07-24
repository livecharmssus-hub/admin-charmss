import ApiClient from './api/axios/apiClient';
import { GetSalesCurrentParams, SalesCurrentResponse } from '../types/dashboard.types';

const FINANCIAL_BASE = '/api/financial';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

type CacheEntry = {
  key: string;
  data: SalesCurrentResponse;
  fetchedAt: number;
};

const buildCacheKey = (params: GetSalesCurrentParams) =>
  `${params.weekofYear}-${params.year}-${params.studioId}`;

class DashboardService {
  private cache: CacheEntry | null = null;
  private inflight: Promise<SalesCurrentResponse> | null = null;
  private inflightKey: string | null = null;

  getCached(params: GetSalesCurrentParams): SalesCurrentResponse | null {
    const key = buildCacheKey(params);
    if (!this.cache || this.cache.key !== key) return null;
    if (Date.now() - this.cache.fetchedAt >= CACHE_TTL_MS) return null;
    return this.cache.data;
  }

  async getSalesCurrent(
    params: GetSalesCurrentParams,
    options?: { force?: boolean }
  ): Promise<SalesCurrentResponse> {
    const key = buildCacheKey(params);
    const force = options?.force ?? false;

    if (!force) {
      const cached = this.getCached(params);
      if (cached) return cached;
    }

    if (!force && this.inflight && this.inflightKey === key) {
      return this.inflight;
    }

    this.inflightKey = key;
    this.inflight = ApiClient.post<SalesCurrentResponse>(
      `${FINANCIAL_BASE}/get-sales-current`,
      params
    )
      .then((response) => {
        this.cache = {
          key,
          data: response.data,
          fetchedAt: Date.now(),
        };
        return response.data;
      })
      .finally(() => {
        this.inflight = null;
        this.inflightKey = null;
      });

    return this.inflight;
  }
}

export default new DashboardService();
