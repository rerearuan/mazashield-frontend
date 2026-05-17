"use client";
import React, { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api-client";


const fmtF = (v: number | null | undefined) =>
  v != null ? "Rp " + Math.round(v).toLocaleString("id-ID") : "—";

interface HistoriBerat {
  id: number;
  tanggal_input: string;
  berat_kg: number;
  keterangan: string;
  estimasi_harga_jual: number;
}
interface LaporanData {
  id_pesanan: number;
  status_pesanan: string;
  detail?: string;
  harga_jual_per_kg: number;
  harga_beli: number | null;
  info_invest: { nama: string; berat_awal: number | null; durasi_hari: number; foto: string | null; harga_beli: number }[];
  histori_berat: HistoriBerat[];
  harga_jual_aktual: number | null;
  laba_kotor: number | null;
  total_biaya: number | null;
  laba_bersih: number | null;
  bagi_hasil_investor: number | null;
}

function Sk({ c }: { c: string }) { return <div className={`animate-pulse bg-gray-100 rounded-2xl ${c}`} />; }

function MiniChart({ data }: { data: HistoriBerat[] }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => Number(d.berat_kg)), 1);
  return (
    <div className="flex items-end gap-1.5 h-28 w-full mt-4">
      {data.map((d, i) => {
        const pct = (Number(d.berat_kg) / max) * 100;
        return (
          <div key={i} className="relative flex-1 flex flex-col items-center group" style={{ height: "100%" }}>
            <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap z-10 pointer-events-none">
              {d.berat_kg} kg
            </div>
            <div className="w-full rounded-t-md bg-emerald-400 mt-auto" style={{ height: `${Math.max(pct, 3)}%` }} />
            <span className="text-[8px] text-gray-400 mt-1">{d.tanggal_input.slice(5)}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function LaporanModal({
  orderId,
  isOpen,
  onClose
}: {
  orderId: number | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [data, setData] = useState<LaporanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !orderId) return;
    setLoading(true);
    setError(null);
    setData(null);

    apiFetch<LaporanData>(`/order/invest/${orderId}/laporan/`)
      .then(d => setData(d))
      .catch(e => setError(e?.status === 401 ? "Silakan login." : e?.status === 404 ? "Pesanan tidak ditemukan." : e?.message ?? "Gagal memuat."))
      .finally(() => setLoading(false));
  }, [orderId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[#f8fafc] rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#f8fafc]/90 backdrop-blur-md z-20 px-6 pt-6 pb-4 border-b border-gray-100 flex justify-between items-center rounded-t-[32px]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Laporan Investasi</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900">Pesanan #{orderId}</h1>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-500"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
        </div>

        <div className="p-6">
          {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 mb-5">{error}</div>}
          {loading && <div className="space-y-4"><Sk c="h-32" /><Sk c="h-48" /></div>}

          {!loading && data && (
            <div className="space-y-5">
              {/* Status badge */}
              <div className="flex items-center gap-3">
                <span className={`text-[10px] uppercase tracking-widest font-black px-4 py-1.5 rounded-full ${
                  data.status_pesanan === "Completed" ? "bg-blue-100 text-blue-700" :
                  data.status_pesanan === "Cancelled" ? "bg-red-100 text-red-600" :
                  "bg-amber-100 text-amber-700"
                }`}>{data.status_pesanan}</span>
              </div>

              {/* Dibatalkan */}
              {data.status_pesanan === "Cancelled" && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                  <p className="font-bold text-red-700">Investasi Dibatalkan</p>
                  <p className="text-sm text-red-500 mt-1">{data.detail ?? "Tidak ada laporan hasil yang tersedia."}</p>
                </div>
              )}

              {/* Info invest */}
              {data.info_invest?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h2 className="text-sm font-bold text-gray-700 mb-3">Detail Investasi</h2>
                  {data.info_invest.map((inv, i) => (
                    <div key={i} className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <div><span className="text-gray-400 text-xs block mb-0.5">Paket</span><p className="font-semibold text-gray-800">{inv.nama}</p></div>
                      <div><span className="text-gray-400 text-xs block mb-0.5">Berat Awal</span><p className="font-semibold text-gray-800">{inv.berat_awal ?? "—"} kg</p></div>
                      <div><span className="text-gray-400 text-xs block mb-0.5">Durasi</span><p className="font-semibold text-gray-800">{inv.durasi_hari} hari</p></div>
                      <div><span className="text-gray-400 text-xs block mb-0.5">Harga Beli</span><p className="font-semibold text-gray-800">{fmtF(inv.harga_beli)}</p></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Processed: show weight history + estimations */}
              {["Processed"].includes(data.status_pesanan) && (
                <>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h2 className="text-sm font-bold text-gray-700 mb-1">Perkembangan Berat Mingguan</h2>
                    <p className="text-xs text-gray-400 mb-4">Estimasi nilai jual diperbarui setiap input berat baru · Harga/kg: {fmtF(data.harga_jual_per_kg)}</p>
                    <MiniChart data={data.histori_berat} />
                    {data.histori_berat.length > 0 ? (
                      <div className="mt-6 space-y-2">
                        {[...data.histori_berat].reverse().map(h => (
                          <div key={h.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{h.berat_kg} kg</p>
                              <p className="text-xs text-gray-400 mt-0.5">{h.tanggal_input}{h.keterangan ? ` · ${h.keterangan}` : ""}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Estimasi Harga Jual</p>
                              <p className="text-sm font-bold text-emerald-700">{fmtF(h.estimasi_harga_jual)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-400 text-sm py-8 font-medium italic">Belum ada histori perkembangan berat yang dilaporkan</p>
                    )}
                  </div>
                </>
              )}

              {/* Completed: show full final report */}
              {data.status_pesanan === "Completed" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h2 className="text-sm font-bold text-gray-700 mb-4">Laporan Akhir Investasi</h2>
                  <div className="space-y-2 mb-5">
                    {[
                      { label: "Harga Beli", value: fmtF(data.harga_beli), muted: true },
                      { label: "Harga Jual Aktual", value: fmtF(data.harga_jual_aktual), muted: false },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between text-sm py-2 border-b border-gray-50">
                        <span className="text-gray-500">{r.label}</span>
                        <span className={`font-semibold ${r.muted ? "text-gray-700" : "text-blue-700"}`}>{r.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Laba Kotor", value: data.laba_kotor, color: "bg-blue-50 text-blue-700 border border-blue-100" },
                      { label: "Total Biaya", value: data.total_biaya, color: "bg-orange-50 text-orange-700 border border-orange-100" },
                      { label: "Laba Bersih", value: data.laba_bersih, color: "bg-emerald-50 text-emerald-700 border border-emerald-100" },
                      { label: "Bagi Hasil (50%)", value: data.bagi_hasil_investor, color: "bg-violet-50 text-violet-700 border border-violet-100" },
                    ].map(c => (
                      <div key={c.label} className={`${c.color} rounded-xl p-4 text-center shadow-sm`}>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{c.label}</p>
                        <p className="text-lg font-black">{fmtF(c.value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
