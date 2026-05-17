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
  const [jenis, setJenis] = useState("");
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
  const reset = () => { setStartDate(""); setEndDate(""); setJenis(""); setPage(1); };
  const inp = "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400 bg-white";
  const rekap = result?.rekapitulasi;

  const CARDS = [
    { label: "Total Transaksi", value: loading ? "—" : String(rekap?.total_jumlah_transaksi ?? 0), sub: "pesanan selesai", accent: "border-l-emerald-500" },
    { label: "Customer Unik", value: loading ? "—" : String(rekap?.total_customer_unik ?? 0), sub: "customer berbeda", accent: "border-l-blue-500" },
    { label: "Total Tagihan", value: loading ? "—" : fmtS(rekap?.total_pendapatan ?? 0), sub: "semua pesanan selesai", accent: "border-l-violet-500" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><div className="w-1 h-5 rounded-full bg-emerald-500" /><span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Penjualan</span></div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900">Laporan Penjualan</h1>
        <p className="text-sm text-gray-400 mt-0.5">Pesanan selesai · Mazdafarm, Mazdaging, Invest Ternak</p>
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

      {/* Filters + Export */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-gray-700">Filter</p>
          <button onClick={() => exportCSV(allRows)} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round"/></svg>
            Export CSV
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div><label className="text-xs text-gray-400 mb-1 block">Dari Tanggal</label><input type="date" className={inp} value={startDate} onChange={e => { setStartDate(e.target.value); setPage(1); }} /></div>
          <div><label className="text-xs text-gray-400 mb-1 block">Sampai Tanggal</label><input type="date" className={inp} value={endDate} onChange={e => { setEndDate(e.target.value); setPage(1); }} /></div>
          <div><label className="text-xs text-gray-400 mb-1 block">Jenis Layanan</label>
            <select className={inp} value={jenis} onChange={e => { setJenis(e.target.value); setPage(1); }}>
              {JENIS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex items-end"><button onClick={reset} className="w-full px-3 py-2 text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100">Reset</button></div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="p-6 space-y-2"><Sk/><Sk/><Sk/><Sk/></div> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["ID", "Customer", "Layanan", "Total Tagihan", "Sudah Dibayar", "Menunggu Verif.", "Tanggal"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {!result?.data.length
                    ? <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-300 text-sm">Tidak ada data transaksi</td></tr>
                    : result.data.map(row => (
                      <tr key={`${row.jenis_layanan}-${row.id_pesanan}`} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-gray-700">#{row.id_pesanan}</td>
                        <td className="px-5 py-3.5 text-gray-800">{row.nama_customer}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${BADGE[row.jenis_layanan] ?? "bg-gray-100 text-gray-600"}`}>{row.jenis_layanan}</span>
                        </td>
                        <td className="px-5 py-3.5 font-mono tabular-nums font-bold text-gray-800">{fmtF(row.total_tagihan)}</td>
                        <td className="px-5 py-3.5 font-mono tabular-nums text-emerald-700">{fmtF(row.sudah_dibayar)}</td>
                        <td className="px-5 py-3.5 font-mono tabular-nums text-amber-600">{fmtF(row.menunggu_persetujuan)}</td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs">{new Date(row.tanggal_transaksi).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {result && result.pagination.total_pages > 1 && (
              <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400">Hal. {result.pagination.page} / {result.pagination.total_pages} · {result.pagination.total_items} transaksi</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">← Prev</button>
                  <button onClick={() => setPage(p => Math.min(result.pagination.total_pages, p + 1))} disabled={page === result.pagination.total_pages} className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next →</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
