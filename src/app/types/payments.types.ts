export type ApiPaymentStatus = 'GENERATED' | 'PENDING' | 'PAID' | 'FAILED';

export interface StudioPaymentDto {
  performerid: number;
  fullname: string;
  email: string;
  nickname: string;
  totalsales: string;
  totalpayment: string;
  percentcomission: string;
  pricetoken: string;
  statuspayment: ApiPaymentStatus;
}

export interface GetStudioSalesParams {
  weekofYear: number;
  year: number;
  studioId: number;
}

export interface PerformerPayment {
  id: string;
  nickname: string;
  fullname: string;
  email: string;
  initials: string;
  avatar_color: string;
  total_sales: number;
  total_payment: number;
  commission_percent: number;
  price_token: number;
  payment_status: ApiPaymentStatus;
}
