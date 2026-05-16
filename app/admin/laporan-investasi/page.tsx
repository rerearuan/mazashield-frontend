"use client";
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api-client";

const fmtF = (v: number | null | undefined) =>
  v != null ? "Rp " + Math.round(v).toLocaleString("id-ID") : "—";

interface HistoriBerat { id: number; tanggal_input: string; berat_kg: number; keterangan: string; estimasi_harga_jual: number; }
interface LaporanData {
  id: number; id_pesanan: number; status_pesanan: string;
  harga_jual_per_kg: number; harga_beli: number | null;
  info_invest: { nama: string; berat_awal: number | null; durasi_hari: number; foto: string | null; harga_beli: number }[];
  histori_berat: HistoriBerat[];
  harga_jual_aktual: number | null; biaya_pakan: number | null; biaya_operasional: number | null;
  biaya_obat_vitamin: number | null; fee_marketing: number | null;
  laba_kotor: number | null; total_biaya: number | null; laba_bersih: number | null; bagi_hasil_investor: number | null;
}
interface OrderRow {
  id_pesanan: number;
  data_customer: { nama: string; email: string; no_telp: string };
  status_pesanan: string;
  created_at: string;
  daftar_invest: { nama_paket: string }[];
  tagihan: number; sudah_dibayar: number; menunggu_persetujuan?: number;
}

const STATUS_COLOR: Record<string, string> = {
  Diproses: "bg-amber-100 text-amber-700 border-amber-200",
  Selesai: "bg-blue-100 text-blue-700 border-blue-200",
  Dibatalkan: "bg-red-100 text-red-600 border-red-200",
};
const STATUS_DOT: Record<string, string> = { Diproses: "bg-amber-400", Selesai: "bg-blue-500", Dibatalkan: "bg-red-400" };

function Sk({ c }: { c: string }) { return <div className={`animate-pulse bg-gray-100 rounded-xl ${c}`} />; }

function exportCSV(orders: OrderRow[]) {
  const header = ["ID Pesanan", "Nama Customer", "Email", "Status", "Tagihan", "Sudah Dibayar", "Tanggal"];
  const body = orders.map(o => [
    o.id_pesanan,
    o.data_customer?.nama ?? "",
    o.data_customer?.email ?? "",
    o.status_pesanan,
    o.tagihan,
    o.sudah_dibayar,
    o.created_at?.slice(0, 10),
  ].join(","));
  const csv = [header.join(","), ...body].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `laporan-investasi-${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
}

function BeratChart({ data }: { data: HistoriBerat[] }) {
  if (!data.length) return (
    <div className="flex flex-col items-center justify-center h-32 text-gray-300 gap-2">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18M7 16l4-4 4 4 4-4" strokeLinecap="round"/></svg>
      <span className="text-xs">Belum ada data berat</span>
    </div>
  );
  const max = Math.max(...data.map(d => Number(d.berat_kg)), 1);
  return (
    <div className="flex items-end gap-1.5 h-32 w-full pt-2">
      {data.map((d, i) => (
        <div key={i} className="relative flex-1 flex flex-col items-center group" style={{ height: "100%" }}>
          <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap z-10 pointer-events-none">
            {d.berat_kg} kg · {d.tanggal_input}
          </div>
          <div className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-300 mt-auto transition-all"
            style={{ height: `${Math.max((Number(d.berat_kg) / max) * 100, 3)}%` }} />
          <span className="text-[8px] text-gray-400 mt-1">{d.tanggal_input.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

export default function LaporanInvestasiPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [laporan, setLaporan] = useState<LaporanData | null>(null);
  const [loadingLaporan, setLoadingLaporan] = useState(false);
  const [search, setSearch] = useState("");
  const [beratForm, setBeratForm] = useState({ tanggal_input: "", berat_kg: "", keterangan: "", harga_jual_per_kg: "" });
  const [savingBerat, setSavingBerat] = useState(false);
  const [beratMsg, setBeratMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [akhirForm, setAkhirForm] = useState({ harga_jual_aktual: "", biaya_pakan: "", biaya_operasional: "", biaya_obat_vitamin: "", fee_marketing: "" });
  const [savingAkhir, setSavingAkhir] = useState(false);
  const [akhirMsg, setAkhirMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    apiFetch("/sales/order/invest/")
      .then(d => setOrders(Array.isArray(d) ? d : (d.results ?? [])))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  }, []);

  const loadLaporan = useCallback(async (id: number) => {
    setLaporan(null); setLoadingLaporan(true); setBeratMsg(null); setAkhirMsg(null);
    try {
      const d = await apiFetch<LaporanData>(`/sales/laporan-invest/${id}/`);
      setLaporan(d);
      if (d.harga_jual_aktual) setAkhirForm({ harga_jual_aktual: String(d.harga_jual_aktual), biaya_pakan: String(d.biaya_pakan ?? ""), biaya_operasional: String(d.biaya_operasional ?? ""), biaya_obat_vitamin: String(d.biaya_obat_vitamin ?? ""), fee_marketing: String(d.fee_marketing ?? "") });
    } catch { setLaporan(null); }
    finally { setLoadingLaporan(false); }
  }, []);

  const handleSelect = (id: number) => { setSelectedId(id); loadLaporan(id); };

  const submitBerat = async () => {
    if (!selectedId || !beratForm.tanggal_input || !beratForm.berat_kg) return;
    setSavingBerat(true); setBeratMsg(null);
    try {
      const body: any = { tanggal_input: beratForm.tanggal_input, berat_kg: beratForm.berat_kg };
      if (beratForm.keterangan) body.keterangan = beratForm.keterangan;
      if (beratForm.harga_jual_per_kg) body.harga_jual_per_kg = beratForm.harga_jual_per_kg;
      const d = await apiFetch<LaporanData>(`/sales/laporan-invest/${selectedId}/berat/`, { method: "POST", body: JSON.stringify(body) });
      setLaporan(d); setBeratForm({ tanggal_input: "", berat_kg: "", keterangan: "", harga_jual_per_kg: "" });
      setBeratMsg({ type: "ok", text: "✓ Berat berhasil ditambahkan." });
    } catch (e: any) { setBeratMsg({ type: "err", text: e?.message ?? "Gagal menyimpan." }); }
    finally { setSavingBerat(false); }
  };

  const submitAkhir = async () => {
    if (!selectedId) return;
    setSavingAkhir(true); setAkhirMsg(null);
    try {
      const d = await apiFetch<LaporanData>(`/sales/laporan-invest/${selectedId}/akhir/`, { method: "PUT", body: JSON.stringify(akhirForm) });
      setLaporan(d); setAkhirMsg({ type: "ok", text: "✓ Perhitungan akhir berhasil disimpan." });
    } catch (e: any) { setAkhirMsg({ type: "err", text: e?.message ?? "Gagal menyimpan." }); }
    finally { setSavingAkhir(false); }
  };

  const filtered = orders.filter(o =>
    o.data_customer?.nama?.toLowerCase().includes(search.toLowerCase()) ||
    String(o.id_pesanan).includes(search)
  );

  const selectedOrder = orders.find(o => o.id_pesanan === selectedId);
  const inp = "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400 bg-white";

  // Summary stats
  const totalTagihan = orders.filter(o => o.status_pesanan !== "Dibatalkan").reduce((s, o) => s + Number(o.tagihan), 0);
  const countByStatus = (s: string) => orders.filter(o => o.status_pesanan === s).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Investasi</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900">Laporan Hasil Investasi</h1>
        <p className="text-sm text-gray-400 mt-0.5">Input berat mingguan &amp; perhitungan akhir per pesanan invest ternak</p>
      </div>

      {/* Summary Cards + Export */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Pesanan", value: String(orders.length), accent: "border-l-gray-400" },
          { label: "Diproses", value: String(countByStatus("Diproses")), accent: "border-l-amber-400" },
          { label: "Selesai", value: String(countByStatus("Selesai")), accent: "border-l-blue-500" },
          { label: "Total Tagihan Aktif", value: loadingOrders ? "—" : "Rp " + Math.round(totalTagihan).toLocaleString("id-ID"), accent: "border-l-emerald-500" },
        ].map(c => (
          <div key={c.label} className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 border-l-4 ${c.accent}`}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{c.label}</p>
            <p className="text-xl font-black text-gray-900 mt-1">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-end mb-4">
        <button onClick={() => exportCSV(orders)} disabled={orders.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-40 transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round"/></svg>
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Left: order list ── */}
        <div className="xl:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Pilih Pesanan</p>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50" placeholder="Cari nama atau ID..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 max-h-[65vh] divide-y divide-gray-50">
            {loadingOrders
              ? <div className="p-4 space-y-3"><Sk c="h-20"/><Sk c="h-20"/><Sk c="h-20"/></div>
              : filtered.length === 0
              ? <div className="flex flex-col items-center justify-center py-14 text-gray-300 gap-2">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinecap="round"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
                  <span className="text-xs">Tidak ada pesanan</span>
                </div>
              : filtered.map(o => {
                  const isActive = selectedId === o.id_pesanan;
                  const nama = o.data_customer?.nama ?? "—";
                  const totalHarga = Number(o.sudah_dibayar) + Number(o.tagihan) + Number(o.menunggu_persetujuan || 0);
                  const pct = totalHarga > 0 ? Math.min((Number(o.sudah_dibayar) / totalHarga) * 100, 100) : 0;
                  return (
                    <button key={o.id_pesanan} onClick={() => handleSelect(o.id_pesanan)}
                      className={`w-full text-left px-4 py-3.5 transition-all hover:bg-emerald-50/70 ${isActive ? "bg-emerald-50 border-l-[3px] border-l-emerald-500" : "border-l-[3px] border-l-transparent"}`}>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">{nama}</p>
                          <p className="text-xs text-gray-400">Pesanan #{o.id_pesanan} · {o.created_at?.slice(0, 10)}</p>
                        </div>
                        <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLOR[o.status_pesanan] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
                          {o.status_pesanan}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">{pct.toFixed(0)}% terbayar</p>
                    </button>
                  );
                })}
          </div>
        </div>

        {/* ── Right: detail ── */}
        <div className="xl:col-span-2 space-y-5">
          {!selectedId && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round"/></svg>
              </div>
              <p className="text-sm font-semibold text-gray-400">Pilih pesanan untuk melihat laporan</p>
              <p className="text-xs text-gray-300 mt-1">Klik salah satu pesanan di panel kiri</p>
            </div>
          )}

          {selectedId && loadingLaporan && <><Sk c="h-28"/><Sk c="h-64"/></>}

          {selectedId && laporan && !loadingLaporan && (
            <>
              {/* ── Info card ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Laporan untuk</p>
                    <h2 className="text-lg font-black text-gray-900">{selectedOrder?.data_customer?.nama ?? "—"}</h2>
                    <p className="text-xs text-gray-400">{selectedOrder?.data_customer?.email} · Pesanan #{laporan.id_pesanan}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[laporan.status_pesanan] ?? "bg-gray-400"}`} />
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${STATUS_COLOR[laporan.status_pesanan] ?? ""}`}>{laporan.status_pesanan}</span>
                  </div>
                </div>
                {laporan.info_invest.map((inv, i) => (
                  <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Paket", value: inv.nama },
                      { label: "Berat Awal", value: inv.berat_awal ? `${inv.berat_awal} kg` : "—" },
                      { label: "Durasi", value: `${inv.durasi_hari} hari` },
                      { label: "Harga Beli", value: fmtF(inv.harga_beli) },
                    ].map(f => (
                      <div key={f.label} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{f.label}</p>
                        <p className="text-sm font-bold text-gray-800 mt-0.5 truncate">{f.value}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* ── Berat chart ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-gray-800">Perkembangan Berat Mingguan</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Harga/kg: {fmtF(laporan.harga_jual_per_kg)} · {laporan.histori_berat.length} entri</p>
                  </div>
                  {laporan.histori_berat.length > 0 && (
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400">Estimasi terbaru</p>
                      <p className="text-sm font-black text-emerald-700">{fmtF(laporan.histori_berat[laporan.histori_berat.length - 1].estimasi_harga_jual)}</p>
                    </div>
                  )}
                </div>
                <BeratChart data={laporan.histori_berat} />
                {laporan.histori_berat.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-gray-100">
                        <th className="pb-2 text-left text-xs text-gray-400 font-semibold">Tanggal</th>
                        <th className="pb-2 text-right text-xs text-gray-400 font-semibold">Berat (kg)</th>
                        <th className="pb-2 text-right text-xs text-gray-400 font-semibold">Estimasi Jual</th>
                        <th className="pb-2 text-left text-xs text-gray-400 font-semibold pl-4">Keterangan</th>
                      </tr></thead>
                      <tbody className="divide-y divide-gray-50">
                        {laporan.histori_berat.map(h => (
                          <tr key={h.id} className="hover:bg-gray-50">
                            <td className="py-2 text-gray-600 text-xs">{h.tanggal_input}</td>
                            <td className="py-2 text-right font-mono tabular-nums font-semibold text-gray-800">{h.berat_kg}</td>
                            <td className="py-2 text-right font-mono tabular-nums text-emerald-700 font-bold">{fmtF(h.estimasi_harga_jual)}</td>
                            <td className="py-2 text-xs text-gray-400 pl-4">{h.keterangan || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* ── Input berat form (Diproses only) ── */}
              {laporan.status_pesanan === "Diproses" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h2 className="text-sm font-bold text-gray-800 mb-0.5">Tambah Berat Mingguan</h2>
                  <p className="text-xs text-gray-400 mb-4">Setiap input tersimpan sebagai histori · estimasi dihitung otomatis</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { key: "tanggal_input", label: "Tanggal *", type: "date" },
                      { key: "berat_kg", label: "Berat (kg) *", type: "number", ph: "320.5" },
                      { key: "harga_jual_per_kg", label: "Harga Jual/kg (opsional)", type: "number", ph: "55000" },
                      { key: "keterangan", label: "Keterangan (opsional)", type: "text", ph: "Minggu ke-3..." },
                    ].map(f => (
                      <div key={f.key} className="col-span-2 sm:col-span-1">
                        <label className="text-xs text-gray-500 mb-1 block font-medium">{f.label}</label>
                        <input type={f.type} step={f.type === "number" ? "0.01" : undefined} className={inp} placeholder={f.ph}
                          max={f.type === "date" ? new Date().toISOString().split("T")[0] : undefined}
                          value={(beratForm as any)[f.key]} onChange={e => setBeratForm(p => ({ ...p, [f.key]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                  {beratMsg && <p className={`text-xs mb-3 font-medium ${beratMsg.type === "ok" ? "text-emerald-600" : "text-red-500"}`}>{beratMsg.text}</p>}
                  <button onClick={submitBerat} disabled={savingBerat || !beratForm.tanggal_input || !beratForm.berat_kg}
                    className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-40 transition-colors">
                    {savingBerat ? "Menyimpan..." : "Simpan Berat"}
                  </button>
                </div>
              )}

              {/* ── Perhitungan akhir (Selesai only) ── */}
              {laporan.status_pesanan === "Selesai" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h2 className="text-sm font-bold text-gray-800 mb-0.5">Perhitungan Akhir Investasi</h2>
                  <p className="text-xs text-gray-400 mb-4">Laba &amp; bagi hasil dihitung otomatis setelah disimpan</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { key: "harga_jual_aktual", label: "Harga Jual Aktual (Rp) *" },
                      { key: "biaya_pakan", label: "Biaya Pakan (Rp) *" },
                      { key: "biaya_operasional", label: "Biaya Operasional Kandang (Rp) *" },
                      { key: "biaya_obat_vitamin", label: "Biaya Obat & Vitamin (Rp) *" },
                      { key: "fee_marketing", label: "Fee Marketing (Rp) *" },
                    ].map(f => (
                      <div key={f.key} className="col-span-2 sm:col-span-1">
                        <label className="text-xs text-gray-500 mb-1 block font-medium">{f.label}</label>
                        <input type="number" className={inp} value={(akhirForm as any)[f.key]}
                          onChange={e => setAkhirForm(p => ({ ...p, [f.key]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                  {laporan.laba_bersih != null && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {[
                        { label: "Laba Kotor", v: laporan.laba_kotor, cls: "bg-blue-50 text-blue-700" },
                        { label: "Total Biaya", v: laporan.total_biaya, cls: "bg-orange-50 text-orange-700" },
                        { label: "Laba Bersih", v: laporan.laba_bersih, cls: "bg-emerald-50 text-emerald-700" },
                        { label: "Bagi Hasil (50%)", v: laporan.bagi_hasil_investor, cls: "bg-violet-50 text-violet-700" },
                      ].map(c => (
                        <div key={c.label} className={`${c.cls} rounded-xl p-3 text-center`}>
                          <p className="text-[10px] font-bold uppercase tracking-wide opacity-60">{c.label}</p>
                          <p className="text-sm font-black mt-0.5">{fmtF(c.v)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {akhirMsg && <p className={`text-xs mb-3 font-medium ${akhirMsg.type === "ok" ? "text-emerald-600" : "text-red-500"}`}>{akhirMsg.text}</p>}
                  <button onClick={submitAkhir} disabled={savingAkhir}
                    className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-colors">
                    {savingAkhir ? "Menyimpan..." : "Simpan Perhitungan Akhir"}
                  </button>
                </div>
              )}

              {laporan.status_pesanan === "Dibatalkan" && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                  <p className="font-bold text-red-700">Pesanan Dibatalkan</p>
                  <p className="text-xs text-red-400 mt-1">Laporan tidak dapat diperbarui untuk pesanan yang dibatalkan.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
