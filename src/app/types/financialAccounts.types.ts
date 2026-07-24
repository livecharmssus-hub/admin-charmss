export type FinancialAccountType = 'Ahorros' | 'Corriente';

export interface PerformerFinancialAccount {
  id: string;
  performerId: string;
  accountName: string;
  email: string;
  accountNumber: string;
  financialEntity: string;
  accountType: FinancialAccountType;
  country: string;
  currency: string;
  isDefault: boolean;
}

export type PerformerFinancialAccountInput = Omit<
  PerformerFinancialAccount,
  'id' | 'performerId'
>;

export interface CreateFinancialAccountRequest {
  accountName: string;
  accountNumber: string;
  country: string;
  financialEntity: string;
  currency: string;
  accountType: FinancialAccountType;
  paymentAccountDefault: boolean;
  accountState: boolean;
  performerId: number;
  email: string;
}

/** Body for PATCH /api/financial/{id} — same shape as create */
export type UpdateFinancialAccountRequest = CreateFinancialAccountRequest;

export interface FinancialAccountApiDto {
  id?: number | string;
  accountName?: string;
  accountNumber?: string;
  country?: string;
  financialEntity?: string;
  currency?: string;
  accountType?: FinancialAccountType | string;
  paymentAccountDefault?: boolean;
  accountState?: boolean;
  performerId?: number | string;
  email?: string;
}

export const mapFinancialAccountDto = (
  dto: FinancialAccountApiDto,
  fallbackPerformerId?: string
): PerformerFinancialAccount => ({
  id: String(dto.id ?? `account-${Date.now()}`),
  performerId: String(dto.performerId ?? fallbackPerformerId ?? ''),
  accountName: dto.accountName ?? '',
  accountNumber: dto.accountNumber ?? '',
  country: dto.country ?? '',
  financialEntity: dto.financialEntity ?? '',
  currency: dto.currency ?? 'USD',
  accountType: (dto.accountType as FinancialAccountType) || 'Ahorros',
  isDefault: Boolean(dto.paymentAccountDefault),
  email: dto.email ?? '',
});
