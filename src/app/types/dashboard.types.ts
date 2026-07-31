export interface GetSalesCurrentParams {
  weekofYear: number;
  year: number;
  studioId: number;
}

export interface SalesDayDto {
  weeknum: string;
  daynum: string;
  dayname: string;
  totalsales: string;
  totalearnings: string;
  customerquantity: string;
  /** API field name (typo preserved): performerquantiy */
  performerquantiy: string;
}

export interface SalesPerformerResultDto {
  performerid: number;
  fullname: string;
  email: string;
  nickname: string;
  totalsales: string;
  totalpayment: string;
  percentcomission: string;
  pricetoken: string;
  statuspayment: string;
}

export interface SalesCurrentResponse {
  onlinePerformers: number;
  customerQuantity: number;
  salesDay: SalesDayDto[];
  salesPerformerResults: SalesPerformerResultDto[];
}
