import { apiFetch } from "@/lib/api-client";

export interface MonthlyData {
  bulan: string;
  bulan_ke: number;
  total_penjualan?: number;
  jumlah_customer?: number;
}

export interface PiutangDetail {
  tagihan: number;
  menunggu_verifikasi: number;
}

export interface FinancialDashboardData {
  tahun: number;
  total_pendapatan_keseluruhan: number;
  breakdown_pendapatan: {
    mazdafarm: number;
    mazdaging: number;
    invest_ternak: number;
  };
  piutang: {
    total_tagihan: number;
    total_menunggu_verifikasi: number;
    detail: {
      mazdafarm: PiutangDetail;
      mazdaging: PiutangDetail;
      invest_ternak: PiutangDetail;
    };
  };
  data_penjualan_per_bulan: MonthlyData[];
  data_customer_baru_per_bulan: MonthlyData[];
}

export const financeService = {
  getDashboard: (tahun?: number): Promise<FinancialDashboardData> =>
    apiFetch("/finance/dashboard/", {
      method: "GET",
      params: tahun ? { tahun: String(tahun) } : undefined,
    }),
};
