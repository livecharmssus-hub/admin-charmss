import ApiClient from './api/axios/apiClient';
import {
  CreateFinancialAccountRequest,
  FinancialAccountApiDto,
  PerformerFinancialAccount,
  PerformerFinancialAccountInput,
  UpdateFinancialAccountRequest,
  mapFinancialAccountDto,
} from '../types/financialAccounts.types';

const FINANCIAL_BASE = '/api/financial';

/** Cache local hasta que existan endpoints de listado / eliminación */
const financialAccountsStore = new Map<string, PerformerFinancialAccount[]>();

class FinancialAccountsService {
  /**
   * Inicializa/actualiza el cache con las cuentas que ya vienen en el listado de performers.
   */
  seedAccounts(performerId: string, accounts: PerformerFinancialAccount[]): void {
    financialAccountsStore.set(performerId, [...accounts]);
  }

  private toUpdatePayload(
    performerId: string,
    data: PerformerFinancialAccountInput,
    options?: { isDefault?: boolean; accountState?: boolean }
  ): UpdateFinancialAccountRequest {
    const numericPerformerId = Number(performerId);

    if (!Number.isInteger(numericPerformerId) || numericPerformerId <= 0) {
      throw new Error('El performer no tiene un identificador válido');
    }

    return {
      accountName: data.accountName,
      accountNumber: data.accountNumber,
      country: data.country,
      financialEntity: data.financialEntity,
      currency: data.currency,
      accountType: data.accountType,
      paymentAccountDefault: options?.isDefault ?? data.isDefault,
      accountState: options?.accountState ?? true,
      performerId: numericPerformerId,
      email: data.email,
    };
  }

  private syncStoreAfterUpdate(
    performerId: string,
    accountId: string,
    updated: PerformerFinancialAccount
  ): PerformerFinancialAccount {
    const existing = financialAccountsStore.get(performerId) ?? [];
    const next = existing.map((account) =>
      account.id === accountId ? updated : account
    );
    const normalized = updated.isDefault
      ? next.map((account) => ({
          ...account,
          isDefault: account.id === accountId,
        }))
      : next;

    financialAccountsStore.set(performerId, normalized);
    return normalized.find((account) => account.id === accountId) ?? updated;
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
    const existing = financialAccountsStore.get(performerId) ?? [];
    const current = existing.find((account) => account.id === accountId);
    if (!current) throw new Error('Cuenta bancaria no encontrada');

    const payload = this.toUpdatePayload(performerId, data);

    if (import.meta.env.DEV) {
      console.log('[FinancialAccounts] Update request:', { id: accountId, body: payload });
    }

    const response = await ApiClient.patch<FinancialAccountApiDto>(
      `${FINANCIAL_BASE}/${accountId}`,
      payload
    );

    if (import.meta.env.DEV) {
      console.log('[FinancialAccounts] Update response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      });
    }

    const responseData =
      response.data && typeof response.data === 'object' ? response.data : undefined;
    const updated = mapFinancialAccountDto(
      responseData ?? {
        ...payload,
        id: accountId,
        performerId: Number(performerId),
      },
      performerId
    );

    return this.syncStoreAfterUpdate(performerId, accountId, {
      ...updated,
      id: accountId,
    });
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

  /**
   * Soft-delete: PATCH /api/financial/{id} con accountState: false.
   * El backend deja de devolver la cuenta en listados.
   */
  async deleteFinancialAccount(performerId: string, accountId: string): Promise<void> {
    const existing = financialAccountsStore.get(performerId) ?? [];
    const current = existing.find((account) => account.id === accountId);
    if (!current) throw new Error('Cuenta bancaria no encontrada');

    const input: PerformerFinancialAccountInput = {
      accountName: current.accountName,
      email: current.email,
      accountNumber: current.accountNumber,
      financialEntity: current.financialEntity,
      accountType: current.accountType,
      country: current.country,
      currency: current.currency,
      isDefault: current.isDefault,
    };
    const payload = this.toUpdatePayload(performerId, input, {
      isDefault: current.isDefault,
      accountState: false,
    });

    if (import.meta.env.DEV) {
      console.log('[FinancialAccounts] Soft-delete request:', { id: accountId, body: payload });
    }

    await ApiClient.patch<FinancialAccountApiDto>(`${FINANCIAL_BASE}/${accountId}`, payload);

    let next = existing.filter((account) => account.id !== accountId);
    if (next.length > 0 && !next.some((account) => account.isDefault)) {
      next = next.map((account, index) => ({ ...account, isDefault: index === 0 }));
    }
    financialAccountsStore.set(performerId, next);
  }

  /**
   * Marca una cuenta como predeterminada vía PATCH /api/financial/{id}
   * enviando paymentAccountDefault: true junto al resto de datos de la cuenta.
   */
  async setDefaultFinancialAccount(performerId: string, accountId: string): Promise<void> {
    const existing = financialAccountsStore.get(performerId) ?? [];
    const current = existing.find((account) => account.id === accountId);
    if (!current) throw new Error('Cuenta bancaria no encontrada');

    const input: PerformerFinancialAccountInput = {
      accountName: current.accountName,
      email: current.email,
      accountNumber: current.accountNumber,
      financialEntity: current.financialEntity,
      accountType: current.accountType,
      country: current.country,
      currency: current.currency,
      isDefault: true,
    };
    const payload = this.toUpdatePayload(performerId, input, { isDefault: true });

    if (import.meta.env.DEV) {
      console.log('[FinancialAccounts] Set default request:', { id: accountId, body: payload });
    }

    const response = await ApiClient.patch<FinancialAccountApiDto>(
      `${FINANCIAL_BASE}/${accountId}`,
      payload
    );

    if (import.meta.env.DEV) {
      console.log('[FinancialAccounts] Set default response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      });
    }

    const responseData =
      response.data && typeof response.data === 'object' ? response.data : undefined;
    const updated = mapFinancialAccountDto(
      responseData ?? {
        ...payload,
        id: accountId,
        performerId: Number(performerId),
        paymentAccountDefault: true,
      },
      performerId
    );

    this.syncStoreAfterUpdate(performerId, accountId, {
      ...updated,
      id: accountId,
      isDefault: true,
    });
  }
}

export default new FinancialAccountsService();
