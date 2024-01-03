export class Pnl_Calculation {
  static calculate_pnl( ccy1_amount: number, deal_rate: number, syst_rate: number, ccy2_rate: number): number {
    const pnl = -ccy1_amount * (deal_rate - syst_rate) * ccy2_rate;
    return pnl;
  }
}







