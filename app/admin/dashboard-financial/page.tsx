"use client";
import { useState, useEffect, useCallback } from "react";
import { financeService, FinancialDashboardData } from "@/services/finance.service";

const fmtS = (v: number) => v >= 1e9 ? `Rp ${(v/1e9).toFixed(1).replace('.',',')}M` : v >= 1e6 ? `Rp ${(v/1e6).toFixed(1).replace('.',',')}Jt` : v >= 1e3 ? `Rp ${(v/1e3).toFixed(0)}Rb` : `Rp ${Math.round(v)}`;
const fmtF = (v: number) => "Rp " + Math.round(v).toLocaleString("id-ID");
const ML = ["","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const MS = ["","Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

function Sk({ c }: { c: string }) { return <div className={`animate-pulse bg-gray-100 rounded-2xl ${c}`} />; }

function KpiCard({ label, value, sub, color, icon, badge }: { label: string; value: string; sub?: string; color: string; icon: React.ReactNode; badge?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${color}`} />
      <div className="pl-2 flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color} bg-opacity-10`}>{icon}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider truncate">{label}</p>
            {badge && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0">{badge}</span>}
          </div>
          <p className="text-xl font-black text-gray-900 leading-tight truncate">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5 truncate">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function BarChart({ vals, lbls, color }: { vals: number[]; lbls: string[]; color: string }) {
  const [hov, setHov] = useState<number | null>(null);
  if (!vals.length) return <p className="text-center text-gray-300 text-sm py-16">Tidak ada data</p>;
  const max = Math.max(...vals, 1);
  const bw = 100 / vals.length;
  return (
    <div className="flex items-end gap-1 h-40 w-full px-1">
      {vals.map((v, i) => {
        const pct = (v / max) * 100;
        return (
          <div key={i} className="relative flex flex-col items-center flex-1 group" style={{ height: "100%" }}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
            {hov === i && (
              <div className="absolute bottom-full mb-1 z-10 bg-gray-800 text-white text-[10px] font-bold rounded-lg px-2 py-1 whitespace-nowrap pointer-events-none">
                {fmtS(v)}
              </div>
            )}
            <div className="w-full rounded-t-md transition-all duration-200 mt-auto" style={{ height: `${Math.max(pct, 2)}%`, background: color, opacity: hov === null || hov === i ? 1 : 0.5 }} />
            <span className="text-[9px] text-gray-400 mt-1 font-medium">{lbls[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

function LineChart({ vals, lbls }: { vals: number[]; lbls: string[] }) {
  const [hov, setHov] = useState<number | null>(null);
  if (!vals.length) return <p className="text-center text-gray-300 text-sm py-16">Tidak ada data</p>;
  const max = Math.max(...vals, 1);
  const W = 100, H = 80;
  const step = vals.length > 1 ? W / (vals.length - 1) : W;
  const pts = vals.map((v, i) => ({ x: i * step, y: H - (v / max) * H * 0.85 - H * 0.05 }));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = d + ` L ${pts[pts.length - 1].x} ${H} L 0 ${H} Z`;
  return (
    <div className="w-full">
      <svg viewBox={`0 0 100 ${H}`} className="w-full" style={{ height: 140 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#lg)" />
        <path d={d} fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={hov === i ? 2 : 1.2} fill="white" stroke="#8b5cf6" strokeWidth="1.2"
            vectorEffect="non-scaling-stroke" onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} style={{ cursor: "default" }} />
        ))}
      </svg>
      <div className="flex justify-between mt-1 px-0.5">
        {lbls.map((l, i) => <span key={i} className="text-[9px] text-gray-400 font-medium">{l}</span>)}
      </div>
      {hov !== null && (
        <p className="text-center text-xs font-bold text-violet-600 mt-1">{lbls[hov]}: {vals[hov]} orang</p>
      )}
    </div>
  );
}

function BreakdownBar({ data }: { data: { layanan: string; total: number; persentase: number }[] }) {
  const bd = data || [];
  const colorMap: Record<string, { bg: string, pillBg: string, pillText: string }> = { 
    "Mazdafarm": { bg: "#10b981", pillBg: "#d1fae5", pillText: "#065f46" }, 
    "Mazdaging": { bg: "#f59e0b", pillBg: "#fef3c7", pillText: "#92400e" }, 
    "Investernak": { bg: "#8b5cf6", pillBg: "#ede9fe", pillText: "#5b21b6" }
  };
  return (
    <div>
      <div className="flex w-full h-3 rounded-full overflow-hidden gap-0.5 mb-5">
        {bd.map(s => <div key={s.layanan} style={{ width: `${Math.max(s.persentase, 1)}%`, background: colorMap[s.layanan]?.bg }} className="first:rounded-l-full last:rounded-r-full" />)}
      </div>
      <div className="space-y-4">
        {bd.map(s => {
          const cm = colorMap[s.layanan] || { bg: "#ccc", pillBg: "#eee", pillText: "#333" };
          return (
            <div key={s.layanan}>
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: cm.bg }} />
                  <span className="text-sm font-medium text-gray-800">{s.layanan === "Investernak" ? "Invest Ternak" : s.layanan}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-800">{fmtS(s.total)}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: cm.pillBg, color: cm.pillText }}>{s.persentase.toFixed(1).replace('.',',')}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 flex justify-start">
                <div className="h-1.5 rounded-full" style={{ width: `${s.persentase}%`, background: cm.bg }}></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

function PiutangRow({ label, color, tagihan, menunggu }: { label: string; color: string; tagihan: number; menunggu: number }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
      <span className="text-sm text-gray-600 flex-1">{label}</span>
      <div className="text-right">
        <p className="text-xs font-bold text-orange-600">{fmtS(tagihan)}</p>
        <p className="text-[10px] text-gray-400">belum dibayar</p>
      </div>
      <div className="text-right">
        <p className="text-xs font-bold text-yellow-600">{fmtS(menunggu)}</p>
        <p className="text-[10px] text-gray-400">menunggu verif.</p>
      </div>
    </div>
  );
}

export default function DashboardKeuanganPage() {
  const now = new Date().getFullYear();
  const [year, setYear] = useState(now);
  const [data, setData] = useState<FinancialDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const years = Array.from({ length: 5 }, (_, i) => now - i);

  const load = useCallback(async (y: number) => {
    setLoading(true); setError(null);
    try { setData(await financeService.getDashboard(y)); }
    catch (e: any) { setError(e?.status === 403 ? "Akses ditolak (403 Forbidden)." : e?.message || "Gagal memuat data."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(year); }, [year, load]);

  const salesYear = data?.total_penjualan_tahun_aktif ?? 0;
  const custTotal = data?.total_customer_baru ?? 0;

  const salesVals = data?.penjualan_per_bulan.map(d => d.total) ?? Array(12).fill(0);
  const custVals  = data?.customer_baru_per_bulan.map(d => d.jumlah) ?? Array(12).fill(0);
  const lastS = salesVals.map((v, i) => v > 0 ? i : -1).filter(i => i >= 0).pop() ?? -1;
  const lastC = custVals.map((v, i)  => v > 0 ? i : -1).filter(i => i >= 0).pop() ?? -1;
  const tSales = lastS >= 0 ? salesVals.slice(0, lastS + 1) : [];
  const tCust  = lastC >= 0 ? custVals.slice(0, lastC + 1)  : [];
  const lSales = MS.slice(1, tSales.length + 1);
  const lCust  = MS.slice(1, tCust.length + 1);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      {/* Header */}
      <div className="mb-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Keuangan</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">Dashboard Keuangan</h1>
          <p className="text-sm text-gray-400 mt-0.5">Performa finansial &amp; pertumbuhan customer · Semua layanan</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm self-start sm:self-auto">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          <select id="year-filter" value={year} onChange={e => setYear(Number(e.target.value))}
            className="text-sm font-semibold text-gray-700 bg-transparent border-none outline-none cursor-pointer">
            {years.map(y => <option key={y} value={y}>Tahun {y}</option>)}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          <p className="text-sm text-red-700 flex-1">{error}</p>
          <button onClick={() => load(year)} className="text-xs font-bold text-red-600 underline">Coba lagi</button>
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {loading ? <><Sk c="h-28"/><Sk c="h-28"/><Sk c="h-28"/></> : <>
          <KpiCard label={`Total Penjualan Lunas ${year}`} value={data ? fmtS(data.total_penjualan_tahun_aktif) : "—"}
            sub={data ? fmtF(data.total_penjualan_tahun_aktif) : undefined} color="bg-emerald-500" badge={String(year)}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round"/></svg>}
          />
          <KpiCard label="Total Piutang Aktif" value={fmtS((data?.total_piutang.belum_bayar ?? 0) + (data?.total_piutang.menunggu_verif ?? 0))}
            sub={`${fmtS(data?.total_piutang.belum_bayar??0)} blm bayar · ${fmtS(data?.total_piutang.menunggu_verif??0)} menunggu verif`} color="bg-orange-500"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><path d="M9 14l6-6M9 9h.01M15 14h.01M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" strokeLinecap="round"/></svg>}
          />
          <KpiCard label={`Customer Baru ${year}`} value={`${custTotal} orang`}
            sub={`${data?.customer_baru_per_bulan.length ?? 0} bulan aktif`} color="bg-violet-500"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/></svg>}
          />
        </>}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div><h2 className="font-bold text-gray-800 text-sm">Penjualan Per Bulan</h2><p className="text-xs text-gray-400 mt-0.5">Pesanan selesai · {year}</p></div>
            {!loading && <span className="text-xs font-black text-blue-600">{fmtS(salesYear)}</span>}
          </div>
          {loading ? <Sk c="h-44"/> : <BarChart vals={tSales} lbls={lSales} color="#3b82f6"/>}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div><h2 className="font-bold text-gray-800 text-sm">Customer Baru Per Bulan</h2><p className="text-xs text-gray-400 mt-0.5">Tanggal registrasi · {year}</p></div>
            {!loading && <span className="text-xs font-black text-violet-600">{custTotal} orang</span>}
          </div>
          {loading ? <Sk c="h-44"/> : <LineChart vals={tCust} lbls={lCust}/>}
        </div>
      </div>

      {/* Breakdown + Piutang */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        {/* Revenue breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div><h2 className="font-bold text-gray-800 text-sm">Breakdown Penjualan per Layanan</h2><p className="text-xs text-gray-400 mt-0.5">Dari pesanan selesai · {year}</p></div>
            <button onClick={() => setDetailOpen(o => !o)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              {detailOpen ? "Sembunyikan" : "Detail"}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d={detailOpen ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          {loading ? <Sk c="h-32"/> : <BreakdownBar data={data?.breakdown_per_layanan ?? []}/>}
        </div>

        {/* Piutang */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="mb-4">
            <h2 className="font-bold text-gray-800 text-sm">Piutang Aktif (Diproses)</h2>
            <p className="text-xs text-gray-400 mt-0.5">Pesanan aktif yang belum lunas</p>
          </div>
          {loading ? <Sk c="h-32"/> : data?.total_piutang ? (
            <div>
              <div className="flex gap-3 mb-4">
                <div className="flex-1 bg-orange-50 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wide">Belum Bayar</p>
                  <p className="text-lg font-black text-orange-600 mt-0.5">{fmtS(data.total_piutang.belum_bayar)}</p>
                </div>
                <div className="flex-1 bg-yellow-50 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-wide">Menunggu Verifikasi</p>
                  <p className="text-lg font-black text-yellow-600 mt-0.5">{fmtS(data.total_piutang.menunggu_verif)}</p>
                </div>
              </div>
              {data.piutang_per_layanan.map(p => (
                <PiutangRow key={p.layanan} label={p.layanan} color={p.layanan === "Mazdafarm" ? "#10b981" : p.layanan === "Mazdaging" ? "#f59e0b" : "#6366f1"} tagihan={p.belum_bayar} menunggu={p.menunggu_verif}/>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Detail table */}
      {!loading && data && detailOpen && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-bold text-gray-800 text-sm">Rincian penjualan per bulan — {year}</h2>
              <p className="text-xs text-gray-400 mt-0.5">Breakdown per layanan · pesanan selesai</p>
            </div>
            <button onClick={() => setDetailOpen(false)} className="self-start sm:self-auto text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
              Sembunyikan <span className="text-gray-400">↑</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Bulan</th>
                  <th className="px-5 py-3.5 text-center text-xs font-bold text-[#10b981] uppercase tracking-wide"><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10b981] mr-1.5 mb-0.5"></span>Mazdafarm</th>
                  <th className="px-5 py-3.5 text-center text-xs font-bold text-[#f59e0b] uppercase tracking-wide"><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f59e0b] mr-1.5 mb-0.5"></span>Mazdaging</th>
                  <th className="px-5 py-3.5 text-center text-xs font-bold text-[#8b5cf6] uppercase tracking-wide"><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8b5cf6] mr-1.5 mb-0.5"></span>Invest Ternak</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">Total</th>
                  <th className="px-5 py-3.5 text-right text-xs font-bold text-violet-500 uppercase tracking-wide">Customer Baru</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ML.slice(1).map((name, i) => {
                  const p = data.penjualan_per_bulan[i];
                  const sv = p?.total ?? 0;
                  const mf = p?.mazdafarm ?? 0;
                  const mg = p?.mazdaging ?? 0;
                  const inv = p?.investernak ?? 0;
                  const cv = data.customer_baru_per_bulan[i]?.jumlah ?? 0;
                  return (
                    <tr key={i} className={`hover:bg-gray-50/60 transition-colors ${!sv && !cv ? "opacity-40" : ""}`}>
                      <td className={`px-5 py-3 font-medium ${!sv && !cv ? "text-gray-400" : "text-gray-800"}`}>{name}</td>
                      <td className="px-5 py-3 text-center text-gray-800">{mf > 0 ? fmtS(mf) : <span className="text-gray-300">—</span>}</td>
                      <td className="px-5 py-3 text-center text-gray-800">{mg > 0 ? fmtS(mg) : <span className="text-gray-300">—</span>}</td>
                      <td className="px-5 py-3 text-center text-gray-800">{inv > 0 ? fmtS(inv) : <span className="text-gray-300">—</span>}</td>
                      <td className="px-5 py-3 text-center text-gray-700">{sv > 0 ? fmtS(sv) : <span className="text-gray-300">—</span>}</td>
                      <td className="px-5 py-3 text-right font-medium text-gray-800">
                        {cv > 0 ? <span className="flex items-center justify-end gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>{cv} orang</span> : <span className="text-gray-300">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50/50 border-t border-gray-200">
                <tr>
                  <td className="px-5 py-4 font-bold text-gray-900">Total</td>
                  <td className="px-5 py-4 text-center font-bold text-[#10b981]">{fmtS(data.breakdown_per_layanan.find(x => x.layanan === "Mazdafarm")?.total ?? 0)}</td>
                  <td className="px-5 py-4 text-center font-bold text-[#f59e0b]">{fmtS(data.breakdown_per_layanan.find(x => x.layanan === "Mazdaging")?.total ?? 0)}</td>
                  <td className="px-5 py-4 text-center font-bold text-[#8b5cf6]">{fmtS(data.breakdown_per_layanan.find(x => x.layanan === "Investernak")?.total ?? 0)}</td>
                  <td className="px-5 py-4 text-center font-bold text-gray-900">{fmtS(salesYear)}</td>
                  <td className="px-5 py-4 text-right font-bold text-gray-900">{custTotal} orang</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
