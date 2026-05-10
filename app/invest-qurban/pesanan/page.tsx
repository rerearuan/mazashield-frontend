"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Image from "next/image";
import { apiFetch } from "@/lib/api-client";

const fmtF = (v: number | string) => "Rp " + Math.round(Number(v)).toLocaleString("id-ID");

interface InvestItem {
  id_invest: string; nama: string; berat: number | null;
  umur: number; harga_beli: number; foto: string | null; status_investernak: string;
}
interface PesananInvest {
  id_pesanan: number; status_pesanan: string; created_at: string;
  daftar_invest: InvestItem[];
  tagihan: number; sudah_dibayar: number; menunggu_persetujuan: number;
}

const STATUS_COLORS: Record<string, string> = {
  Diproses: "bg-amber-100 text-amber-800",
  Selesai: "bg-[#1a8245]/10 text-[#1a8245]",
  Dibatalkan: "bg-red-100 text-red-800",
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 animate-pulse">
      <div className="flex justify-between mb-4"><div className="h-4 bg-gray-100 rounded-full w-32" /><div className="h-6 bg-gray-100 rounded-full w-20" /></div>
      <div className="flex gap-3 mb-4">{[1,2,3].map(i => <div key={i} className="w-14 h-14 bg-gray-100 rounded-2xl" />)}</div>
      <div className="h-4 bg-gray-100 rounded-full w-3/4 mb-2" />
      <div className="h-10 bg-gray-100 rounded-2xl mt-4" />
    </div>
  );
}

export default function PesananInvestPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<PesananInvest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    apiFetch<PesananInvest[]>("/order/invest/")
      .then(d => setOrders(Array.isArray(d) ? d : []))
      .catch(e => setError(e?.status === 401 ? "Silakan login terlebih dahulu." : e?.message ?? "Gagal memuat."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterStatus === "all" ? orders : orders.filter(o => o.status_pesanan === filterStatus);
  const countOf = (s: string) => orders.filter(o => o.status_pesanan === s).length;

  return (
    <div className="bg-white min-h-screen selection:bg-[#1a8245] selection:text-white">
      <Navbar activePage="invest-qurban" />

      {/* Page Header — sama dengan invest-qurban/page.tsx */}
      <div className="pt-[80px] md:pt-[80px] bg-[#f8fafc] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <span className="text-[#1a8245] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">
            Invest Ternak
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
            Pesanan Saya
          </h1>
          <p className="text-gray-500 font-medium text-base md:text-lg max-w-xl">
            Pantau progres investasi dan pembayaran paket invest ternak kamu.
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-[24px] p-5 text-sm font-medium text-red-700 mb-8">{error}</div>
          )}

          {/* Filter chips */}
          {!loading && orders.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-10">
              {[
                { key: "all", label: `Semua (${orders.length})` },
                { key: "Diproses", label: `Diproses (${countOf("Diproses")})` },
                { key: "Selesai", label: `Selesai (${countOf("Selesai")})` },
                { key: "Dibatalkan", label: `Dibatalkan (${countOf("Dibatalkan")})` },
              ].map(f => (
                <button key={f.key} onClick={() => setFilterStatus(f.key)}
                  className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                    filterStatus === f.key
                      ? "bg-[#1a8245] text-white shadow-lg shadow-green-100"
                      : "bg-gray-50 text-gray-500 border border-gray-200 hover:border-[#1a8245] hover:text-[#1a8245]"
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {/* Skeletons */}
          {loading && (
            <div className="space-y-5">
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && !error && (
            <div className="py-24 text-center bg-gray-50 rounded-[48px] border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 rounded-[28px] bg-white shadow-sm flex items-center justify-center mx-auto mb-6">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="font-black text-gray-900 text-xl tracking-tight mb-2">
                {filterStatus !== "all" ? `Tidak ada pesanan "${filterStatus}"` : "Belum Ada Pesanan"}
              </p>
              <p className="text-gray-400 font-medium text-sm mb-8 max-w-xs mx-auto">
                {filterStatus !== "all"
                  ? "Coba pilih filter lain di atas."
                  : "Kamu belum memiliki pesanan invest ternak. Yuk mulai investasi sekarang!"}
              </p>
              {filterStatus === "all" && (
                <button onClick={() => router.push("/invest-qurban")}
                  className="px-8 py-3 bg-[#1a8245] text-white text-[10px] font-black rounded-2xl hover:bg-[#22ad5c] transition-all shadow-lg shadow-green-100 uppercase tracking-widest">
                  Lihat Katalog Invest Ternak
                </button>
              )}
            </div>
          )}

          {/* Order cards */}
          <div className="space-y-5">
            {filtered.map(order => {
              const pct = Number(order.tagihan) > 0 ? Math.min((Number(order.sudah_dibayar) / Number(order.tagihan)) * 100, 100) : 0;
              const sisa = Number(order.tagihan) - Number(order.sudah_dibayar);

              return (
                <div key={order.id_pesanan}
                  className="bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">

                  {/* Header */}
                  <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-gray-50">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Pesanan #{order.id_pesanan}
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {new Date(order.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${STATUS_COLORS[order.status_pesanan] ?? "bg-gray-100 text-gray-800"}`}>
                      {order.status_pesanan}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="px-6 md:px-8 py-5 flex items-start gap-4">
                    {/* Photo strip */}
                    <div className="flex gap-2 shrink-0">
                      {order.daftar_invest.slice(0, 3).map((item, i) => (
                        <div key={i} className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 ring-1 ring-gray-200">
                          {item.foto
                            ? <Image src={item.foto} alt={item.nama} fill className="object-cover" unoptimized />
                            : <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] font-bold">—</div>
                          }
                          {i === 2 && order.daftar_invest.length > 3 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white text-xs font-black">+{order.daftar_invest.length - 3}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Item names */}
                    <div className="flex-1 min-w-0">
                      {order.daftar_invest.slice(0, 2).map((item, i) => (
                        <div key={i} className={i > 0 ? "mt-2" : ""}>
                          <p className="text-sm font-black text-gray-900 tracking-tight truncate">{item.nama}</p>
                          <p className="text-xs text-gray-400 font-medium">
                            {item.berat ? `${item.berat} kg · ` : ""}{item.umur} hari · {item.status_investernak}
                          </p>
                        </div>
                      ))}
                      {order.daftar_invest.length > 2 && (
                        <p className="text-xs text-gray-400 mt-1.5">+{order.daftar_invest.length - 2} paket lainnya</p>
                      )}
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="px-6 md:px-8 pb-6">
                    <div className="bg-[#f8fafc] rounded-[24px] p-5">
                      {/* Progress bar */}
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-black uppercase tracking-widest text-[10px] text-gray-400">Progres Pembayaran</span>
                        <span className="font-black text-gray-900">{Math.round(pct)}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${pct >= 100 ? "bg-[#1a8245]" : pct > 0 ? "bg-amber-400" : "bg-gray-300"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      {/* Breakdown */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: "Total Tagihan", value: fmtF(order.tagihan), color: "text-gray-900" },
                          { label: "Terbayar", value: fmtF(order.sudah_dibayar), color: "text-[#1a8245]" },
                          { label: "Menunggu", value: fmtF(order.menunggu_persetujuan), color: "text-amber-600" },
                        ].map(c => (
                          <div key={c.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
                            <p className="text-[9px] font-black uppercase tracking-wide text-gray-400 mb-1">{c.label}</p>
                            <p className={`text-xs font-black ${c.color}`}>{c.value}</p>
                          </div>
                        ))}
                      </div>

                      {sisa > 0 && order.status_pesanan !== "Dibatalkan" && (
                        <p className="text-center text-[10px] text-gray-400 font-medium mt-3">
                          Sisa tagihan: <span className="font-black text-gray-700">{fmtF(sisa)}</span>
                        </p>
                      )}
                    </div>

                    {order.status_pesanan !== "Dibatalkan" && (
                      <button
                        onClick={() => router.push(`/invest-qurban/pesanan/${order.id_pesanan}/laporan`)}
                        className="mt-4 w-full py-3.5 bg-[#1a8245] text-white text-[10px] font-black rounded-2xl hover:bg-[#22ad5c] hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-green-100 uppercase tracking-widest">
                        Lihat Laporan Perkembangan →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
