import ApiClient from './api/axios/apiClient';
import {
  CreateFinancialAccountRequest,
  FinancialAccountApiDto,
  PerformerFinancialAccount,
  PerformerFinancialAccountInput,
  mapFinancialAccountDto,
} from '../types/financialAccounts.types';

const FINANCIAL_BASE = '/api/financial';

/** Cache local hasta que existan endpoints de listado / edición / eliminación */
const financialAccountsStore = new Map<string, PerformerFinancialAccount[]>();

class FinancialAccountsService {
  /**
   * Inicializa/actualiza el cache con las cuentas que ya vienen en el listado de performers.
   */
  seedAccounts(performerId: string, accounts: PerformerFinancialAccount[]): void {
    financialAccountsStore.set(performerId, [...accounts]);
  }

  async getFinancialAccounts(
    performerId: string,
    seedAccounts?: PerformerFinancialAccount[]
  ): Promise<PerformerFinancialAccount[]> {
    if (seedAccounts && seedAccounts.length > 0 && !financialAccountsStore.has(performerId)) {
      this.seedAccounts(performerId, seedAccounts);
    }

    // Si hay seed más reciente del listado y el store está vacío o desactualizado, preferir seed
    if (seedAccounts) {
      const cached = financialAccountsStore.get(performerId) ?? [];
      const byId = new Map(cached.map((account) => [account.id, account]));
      for (const account of seedAccounts) {
        if (!byId.has(account.id)) {
          byId.set(account.id, account);
        }
      }
      const merged = Array.from(byId.values());
      financialAccountsStore.set(performerId, merged);
      return [...merged];
    }

    return [...(financialAccountsStore.get(performerId) ?? [])];
  }

  async getFinancialAccount(performerId: string): Promise<PerformerFinancialAccount | null> {
    const accounts = await this.getFinancialAccounts(performerId);
    return accounts.find((a) => a.isDefault) ?? accounts[0] ?? null;
  }

  async createFinancialAccount(
    performerId: string,
    data: PerformerFinancialAccountInput
  ): Promise<PerformerFinancialAccount> {
    const existing = financialAccountsStore.get(performerId) ?? [];
    const numericPerformerId = Number(performerId);

    if (!Number.isInteger(numericPerformerId) || numericPerformerId <= 0) {
      throw new Error('El performer no tiene un identificador válido');
    }

    const payload: CreateFinancialAccountRequest = {
      accountName: data.accountName,
      accountNumber: data.accountNumber,
      country: data.country,
      financialEntity: data.financialEntity,
      currency: data.currency,
      accountType: data.accountType,
      paymentAccountDefault: data.isDefault || existing.length === 0,
      accountState: true,
      performerId: numericPerformerId,
      email: data.email,
    };

    if (import.meta.env.DEV) {
      console.log('[FinancialAccounts] Create request body:', payload);
    }

    const response = await ApiClient.post<FinancialAccountApiDto>(
      `${FINANCIAL_BASE}/create-financial-account`,
      payload
    );

    if (import.meta.env.DEV) {
      console.log('[FinancialAccounts] Create response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      });
    }

    const responseData =
      response.data && typeof response.data === 'object' ? response.data : undefined;
    const created = mapFinancialAccountDto(
      responseData ?? {
        ...payload,
        id: `account-${Date.now()}`,
        performerId: numericPerformerId,
      },
      performerId
    );

    const next = [...existing, created].map((account) => ({
      ...account,
      isDefault: created.isDefault ? account.id === created.id : account.isDefault,
    }));

    financialAccountsStore.set(performerId, next);
    return created;
  }

  async updateFinancialAccount(
    performerId: string,
    accountId: string,
    data: PerformerFinancialAccountInput
  ): Promise<PerformerFinancialAccount> {
    // TODO: Reemplazar con el endpoint de edición cuando esté disponible
    const existing = financialAccountsStore.get(performerId) ?? [];
    const next = existing.map((account) =>
      account.id === accountId ? { ...account, ...data, id: accountId, performerId } : account
    );
    const normalized = data.isDefault
      ? next.map((account) => ({ ...account, isDefault: account.id === accountId }))
      : next;

    financialAccountsStore.set(performerId, normalized);
    const updated = normalized.find((account) => account.id === accountId);
    if (!updated) throw new Error('Cuenta bancaria no encontrada');
    return updated;
  }

  async saveFinancialAccount(
    performerId: string,
    data: PerformerFinancialAccountInput,
    accountId?: string
  ): Promise<PerformerFinancialAccount> {
    if (accountId) {
      return this.updateFinancialAccount(performerId, accountId, data);
    }
    return this.createFinancialAccount(performerId, data);
  }

  async deleteFinancialAccount(performerId: string, accountId: string): Promise<void> {
    // TODO: Implementar llamada a backend cuando esté disponible
    await new Promise((resolve) => setTimeout(resolve, 300));
    const existing = financialAccountsStore.get(performerId) ?? [];
    let next = existing.filter((account) => account.id !== accountId);
    if (next.length > 0 && !next.some((account) => account.isDefault)) {
      next = next.map((account, index) => ({ ...account, isDefault: index === 0 }));
    }
    financialAccountsStore.set(performerId, next);
  }

  async setDefaultFinancialAccount(performerId: string, accountId: string): Promise<void> {
    // TODO: Implementar llamada a backend cuando esté disponible
    await new Promise((resolve) => setTimeout(resolve, 200));
    const existing = financialAccountsStore.get(performerId) ?? [];
    financialAccountsStore.set(
      performerId,
      existing.map((account) => ({
        ...account,
        isDefault: account.id === accountId,
      }))
    );
  }
}

export default new FinancialAccountsService();
