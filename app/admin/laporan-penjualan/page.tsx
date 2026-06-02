"use client";
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api-client";

const fmtF = (v: number) => "Rp " + Math.round(v).toLocaleString("id-ID");
const fmtS = (v: number) => v >= 1e9 ? `Rp ${(v/1e9).toFixed(1)}M` : v >= 1e6 ? `Rp ${(v/1e6).toFixed(1)}Jt` : v >= 1e3 ? `Rp ${(v/1e3).toFixed(0)}Rb` : `Rp ${v}`;

interface OrderRow { id_pesanan: number; nama_customer: string; jenis_layanan: string; total_tagihan: number; sudah_dibayar: number; menunggu_persetujuan: number; tanggal_transaksi: string; }
interface Rekap { total_jumlah_transaksi: number; total_customer_unik: number; total_pendapatan: number; }
interface ApiRes { rekapitulasi: Rekap; pagination: { page: number; limit: number; total_pages: number; total_items: number }; data: OrderRow[]; }

const JENIS = [{ value: "", label: "Semua Layanan" }, { value: "Mazdafarm", label: "Mazdafarm" }, { value: "Mazdaging", label: "Mazdaging" }, { value: "Investernak", label: "Invest Ternak" }];
const BADGE: Record<string, string> = { Mazdafarm: "bg-emerald-100 text-emerald-700", Mazdaging: "bg-amber-100 text-amber-700", Investernak: "bg-violet-100 text-violet-700" };

function Sk() { return <div className="animate-pulse bg-gray-100 rounded-xl h-10 mb-2" />; }

function exportCSV(rows: OrderRow[]) {
  const header = ["ID Pesanan", "Nama Customer", "Jenis Layanan", "Total Tagihan", "Sudah Dibayar", "Menunggu Verif.", "Tanggal Transaksi"];
  const body = rows.map(r => [r.id_pesanan, r.nama_customer, r.jenis_layanan, r.total_tagihan, r.sudah_dibayar, r.menunggu_persetujuan, new Date(r.tanggal_transaksi).toLocaleDateString("id-ID")].join(","));
  const csv = [header.join(","), ...body].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `laporan-penjualan-${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
}

export default function LaporanPenjualanPage() {
  const [result, setResult] = useState<ApiRes | null>(null);
  const [allRows, setAllRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [jenis, setJenis] = useState("Mazdafarm");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const params: Record<string, string> = { page: String(page), limit: "10" };
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (jenis) params.jenis_layanan = jenis;
      const d = await apiFetch<ApiRes>("/sales/laporan-penjualan/", { params });
      setResult(d);
      // Also fetch all for export (limit=1000)
      const all = await apiFetch<ApiRes>("/sales/laporan-penjualan/", { params: { ...params, page: "1", limit: "1000" } });
      setAllRows(all.data ?? []);
    } catch (e: any) { setError(e?.message ?? "Gagal memuat."); }
    finally { setLoading(false); }
  }, [page, startDate, endDate, jenis]);

  useEffect(() => { load(); }, [load]);
  const reset = () => { setStartDate(""); setEndDate(""); setJenis("Mazdafarm"); setPage(1); };
  const inp = "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400 bg-white";
  const rekap = result?.rekapitulasi;

  const CARDS = [
    { label: "Total Transaksi", value: loading ? "—" : String(rekap?.total_jumlah_transaksi ?? 0), sub: "produk terjual", accent: "border-l-emerald-500" },
    { label: "Customer Unik", value: loading ? "—" : String(rekap?.total_customer_unik ?? 0), sub: "customer berbeda", accent: "border-l-blue-500" },
    { label: "Total Pendapatan", value: loading ? "—" : fmtS(rekap?.total_pendapatan ?? 0), sub: "semua pesanan selesai", accent: "border-l-violet-500" },
  ];

  const getHeaders = () => {
    if (jenis === "Mazdafarm") return ["ID Pesanan", "Customer", "Eartag/ID", "Nama Ternak", "Detail Ternak", "Modal Awal", "Harga Jual", "Keuntungan", "Tanggal"];
    if (jenis === "Mazdaging") return ["ID Pesanan", "Customer", "ID Daging", "Nama Produk", "Detail Daging", "Modal Awal", "Harga Jual", "Keuntungan", "Tanggal"];
    return ["ID Pesanan", "Customer", "ID Invest", "Paket Investasi", "Detail Paket", "Modal Awal", "Harga Jual", "Keuntungan", "Tanggal"];
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#1a8245]">Penjualan</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2 text-[#1a8245]">Laporan Penjualan</h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">Pesanan selesai · Mazdafarm, Mazdaging, Invest Ternak</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => exportCSV(allRows)}
            className="flex w-full md:w-auto items-center justify-center gap-1.5 px-6 py-2 bg-[#1a8245] hover:bg-[#156a38] text-white text-[10px] font-black uppercase tracking-[0.16em] rounded-xl transition-all duration-300 shadow-xl shadow-green-100/50 h-14 border border-[#1a8245] whitespace-nowrap cursor-pointer"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-1">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {error && <div className="mb-5 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">{error}</div>}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {CARDS.map(c => (
          <div key={c.label} className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 border-l-4 ${c.accent}`}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{c.label}</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{c.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white/85 backdrop-blur-xl rounded-[28px] md:rounded-[32px] shadow-lg shadow-green-900/5 border border-white/50 p-4 sm:p-6 md:p-7 mb-8 md:mb-10 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1a8245] mb-2 block">Dari Tanggal</label>
            <input 
              type="date" 
              className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white focus:border-transparent outline-none transition-all font-semibold text-sm text-gray-900 shadow-sm" 
              value={startDate} 
              onChange={e => { setStartDate(e.target.value); setPage(1); }} 
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1a8245] mb-2 block">Sampai Tanggal</label>
            <input 
              type="date" 
              className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white focus:border-transparent outline-none transition-all font-semibold text-sm text-gray-900 shadow-sm" 
              value={endDate} 
              onChange={e => { setEndDate(e.target.value); setPage(1); }} 
            />
          </div>
          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <button 
              onClick={reset} 
              className="rounded-xl h-[42px] bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 font-black text-[10px] uppercase tracking-[0.16em] shadow-sm w-full transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full overflow-x-auto mb-6">
        <div className="flex gap-2 p-1.5 bg-gray-100/80 rounded-2xl min-w-max sm:min-w-0 sm:max-w-max border border-gray-200">
        {[
          { id: "Mazdafarm", label: "Mazdafarm" },
          { id: "Mazdaging", label: "Mazdaging" },
          { id: "Investernak", label: "Invest Ternak" }
        ].map((tab) => {
          const isSel = jenis === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setJenis(tab.id); setPage(1); }}
              className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all rounded-xl whitespace-nowrap cursor-pointer ${
                isSel 
                  ? "bg-[#1a8245] text-white shadow-md" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="p-6 space-y-2"><Sk/><Sk/><Sk/><Sk/></div> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    {getHeaders().map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {!result?.data.length
                    ? <tr><td colSpan={9} className="px-5 py-10 text-center text-gray-300 text-sm">Tidak ada data transaksi</td></tr>
                    : result.data.map((row: any) => {
                      const keuntungan = Number(row.total_tagihan || 0) - Number(row.modal_awal || 0);
                      return (
                        <tr key={`${row.jenis_layanan}-${row.produk_id}-${row.id_pesanan}`} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-gray-700 whitespace-nowrap">#{row.id_pesanan}</td>
                          <td className="px-5 py-3.5 text-gray-800 whitespace-nowrap">{row.nama_customer}</td>
                          <td className="px-5 py-3.5 font-mono text-xs text-gray-500 font-bold whitespace-nowrap">{row.produk_id}</td>
                          <td className="px-5 py-3.5 text-gray-900 font-bold whitespace-nowrap">{row.nama_produk}</td>
                          <td className="px-5 py-3.5 text-gray-400 text-xs italic font-medium whitespace-nowrap">{row.detail_layanan}</td>
                          <td className="px-5 py-3.5 font-mono tabular-nums text-gray-600 whitespace-nowrap">{fmtF(row.modal_awal || 0)}</td>
                          <td className="px-5 py-3.5 font-mono tabular-nums font-bold text-gray-800 whitespace-nowrap">{fmtF(row.total_tagihan || 0)}</td>
                          <td className={`px-5 py-3.5 font-mono tabular-nums font-black whitespace-nowrap ${keuntungan >= 0 ? "text-[#1a8245]" : "text-red-600"}`}>
                            {fmtF(keuntungan)}
                          </td>
                          <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">{new Date(row.tanggal_transaksi).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            {result && result.pagination.total_pages > 1 && (
              <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs text-gray-400">Hal. {result.pagination.page} / {result.pagination.total_pages} · {result.pagination.total_items} item</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 cursor-pointer">← Prev</button>
                  <button onClick={() => setPage(p => Math.min(result.pagination.total_pages, p + 1))} disabled={page === result.pagination.total_pages} className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 cursor-pointer">Next →</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
