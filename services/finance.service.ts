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
  filter_tahun: number;
  total_penjualan_tahun_aktif: number;
  total_piutang: {
    belum_bayar: number;
    menunggu_verif: number;
  };
  total_customer_baru: number;
  penjualan_per_bulan: { bulan: string; total: number }[];
  customer_baru_per_bulan: { bulan: string; jumlah: number }[];
  breakdown_per_layanan: { layanan: string; total: number; persentase: number }[];
  piutang_per_layanan: { layanan: string; belum_bayar: number; menunggu_verif: number }[];
}

export const financeService = {
  getDashboard: (tahun?: number): Promise<FinancialDashboardData> =>
    apiFetch("/finance/dashboard/", {
      method: "GET",
      params: tahun ? { tahun: String(tahun) } : undefined,
    }),
};
