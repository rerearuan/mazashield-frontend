"use client";
import React, { useState, useEffect, useCallback } from "react";
import { financeService, FinancialDashboardData } from "@/services/finance.service";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

const BULAN_FULL  = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const BULAN_SHORT = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

const LAYANAN = ["Mazdafarm","Mazdaging","Investernak"];
const COLORS: Record<string, {dot:string, bg:string, text:string}> = {
  Mazdafarm:   { dot:"#1D9E75", bg:"#E1F5EE", text:"#0F6E56" },
  Mazdaging:   { dot:"#EF9F27", bg:"#FAEEDA", text:"#854F0B" },
  Investernak: { dot:"#7F77DD", bg:"#EEEDFE", text:"#3C3489" },
};

function fmt(n: number | null | undefined): string | null {
  if (n === null || n === undefined) return null;
  if (n >= 1000000) return "Rp\u00a0" + (n/1000000).toFixed(1).replace(".",",") + "Jt";
  if (n >= 1000)    return "Rp\u00a0" + Math.round(n/1000) + "Rb";
  return "Rp\u00a0" + n.toLocaleString("id-ID");
}

function fmtFull(n: number | null | undefined): string | null {
  if (!n) return null;
  return "Rp\u00a0" + n.toLocaleString("id-ID");
}

function Dot({ color, size=7 }: { color: string, size?: number }) {
  return <span style={{ width:size, height:size, borderRadius:"50%", background:color, display:"inline-block", flexShrink:0 }} />;
}

function SummaryCard({ label, sub, value, valueColor, accent }: { label: string, sub?: string | null, value: string | null, valueColor: string, accent: string }) {
  return (
    <div style={{
      background:"#fff", border:"0.5px solid #e8e8e8", borderRadius:14,
      padding:"16px 20px", position:"relative", overflow:"hidden",
    }}>
      <div style={{ width:3, height:36, background:accent, borderRadius:2, position:"absolute", left:0, top:16 }} />
      <div style={{ paddingLeft:10 }}>
        <div style={{ fontSize:11, color:"#aaa", textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:2 }}>{label}</div>
        <div style={{ fontSize:22, fontWeight:500, color:valueColor||"#1a1a1a", marginBottom:2 }}>{value}</div>
        {sub && <div style={{ fontSize:11, color:"#bbb" }}>{sub}</div>}
      </div>
    </div>
  );
}

function BarChart({ rows }: { rows: any[] }) {
  const maxVal = Math.max(...rows.map(r => Object.values(r.penjualan).reduce((a: any, v: any)=>a+(v||0),0)), 1);
  const aktifIdx = rows.map((r,i) => Object.values(r.penjualan).some(v=>v) ? i : -1).filter(i=>i>=0);

  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:120, marginTop:12 }}>
      {rows.map((r, i) => {
        const total: number = Object.values(r.penjualan).reduce((a: any,v: any)=>a+(v||0),0) as number;
        const h = Math.max((total/maxVal)*110, total>0?3:1);
        const isActive = total > 0;
        return (
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <div style={{ width:"100%", height:h, background: isActive?"#378ADD":"#e8e8e8", borderRadius:"3px 3px 0 0", transition:"height 0.3s" }} />
            {aktifIdx.includes(i) && (
              <span style={{ fontSize:9, color:"#aaa" }}>{BULAN_SHORT[i]}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LineChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const pts = data.map((v,i) => ({ x:(i/(data.length-1))*296+2, y:98-((v/max)*88) }));
  const path = pts.map((p,i)=>i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`).join(" ");
  const area = path+` L${pts[pts.length-1].x},100 L${pts[0].x},100 Z`;
  return (
    <svg width="100%" height="120" viewBox="0 0 300 100" preserveAspectRatio="none" style={{ marginTop:12 }}>
      <path d={area} fill="#7F77DD" fillOpacity="0.12" />
      <path d={path} fill="none" stroke="#7F77DD" strokeWidth="1.5" />
      {pts.filter((_,i)=>data[i]>0).map((p,i)=>(
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#7F77DD" />
      ))}
    </svg>
  );
}

function TabelBreakdown({ rows, customer, tahun, expanded, onToggle }: { rows: any[], customer: number[], tahun: number, expanded: boolean, onToggle: () => void }) {
  const totals: any = LAYANAN.reduce((acc: any, l: string) => {
    acc[l] = rows.reduce((a,r)=>a+(r.penjualan[l]||0), 0);
    return acc;
  }, {});
  const totalBulan   = rows.map(r => LAYANAN.reduce((a,l)=>a+(r.penjualan[l]||0),0));
  const totalAll     = totalBulan.reduce((a,v)=>a+v,0);
  const totalCustomer= customer.reduce((a,v)=>a+v,0);

  return (
    <div style={{ background:"#fff", border:"0.5px solid #e8e8e8", borderRadius:14, overflow:"hidden" }}>
      <div style={{
        padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center",
        borderBottom: expanded ? "0.5px solid #f0f0f0" : "none",
      }}>
        <div>
          <div style={{ fontSize:14, fontWeight:500 }}>Rincian penjualan per bulan — {tahun}</div>
          <div style={{ fontSize:11, color:"#aaa", marginTop:1 }}>Breakdown per layanan · pesanan selesai</div>
        </div>
        <button onClick={onToggle} style={{
          fontSize:12, padding:"5px 12px", borderRadius:8,
          border:"0.5px solid #e0e0e0", background:"#fafafa",
          color:"#666", cursor:"pointer",
        }}>
          {expanded ? "Sembunyikan ↑" : "Tampilkan ↓"}
        </button>
      </div>

      {expanded && (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:640 }}>
            <thead>
              <tr style={{ background:"#fafafa" }}>
                <th style={{ textAlign:"left", padding:"9px 20px", fontSize:11, fontWeight:500, color:"#aaa", borderBottom:"0.5px solid #f0f0f0", width:"16%" }}>BULAN</th>
                {LAYANAN.map(l => (
                  <th key={l} style={{ textAlign:"right", padding:"9px 14px", fontSize:11, fontWeight:500, color:COLORS[l].text, borderBottom:"0.5px solid #f0f0f0", width:"16%" }}>
                    <span style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:4 }}>
                      <Dot color={COLORS[l].dot} />
                      {l === "Investernak" ? "Invest Ternak" : l}
                    </span>
                  </th>
                ))}
                <th style={{ textAlign:"right", padding:"9px 14px", fontSize:11, fontWeight:500, color:"#aaa", borderBottom:"0.5px solid #f0f0f0", width:"16%" }}>TOTAL</th>
                <th style={{ textAlign:"right", padding:"9px 20px", fontSize:11, fontWeight:500, color:"#7F77DD", borderBottom:"0.5px solid #f0f0f0", width:"16%" }}>CUSTOMER BARU</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const totalBln = totalBulan[i];
                const adaData  = totalBln > 0 || customer[i] > 0;
                return (
                  <tr key={i} style={{ borderBottom:"0.5px solid #f5f5f5", background: adaData ? "#fff" : "#fafafa" }}>
                    <td style={{ padding:"10px 20px", fontWeight: adaData?500:400, color: adaData?"#1a1a1a":"#ccc" }}>
                      {BULAN_FULL[i]}
                    </td>
                    {LAYANAN.map(l => (
                      <td key={l} style={{ padding:"10px 14px", textAlign:"right", color: r.penjualan[l] ? "#1a1a1a" : "#ddd" }}>
                        {r.penjualan[l] ? fmt(r.penjualan[l]) : "—"}
                      </td>
                    ))}
                    <td style={{ padding:"10px 14px", textAlign:"right", fontWeight: totalBln?500:400, color: totalBln?"#1a1a1a":"#ddd" }}>
                      {totalBln ? fmt(totalBln) : "—"}
                    </td>
                    <td style={{ padding:"10px 20px", textAlign:"right" }}>
                      {customer[i] > 0 ? (
                        <span style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:5 }}>
                          <Dot color="#7F77DD" />
                          {customer[i]} orang
                        </span>
                      ) : <span style={{ color:"#ddd" }}>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop:"0.5px solid #e0e0e0", background:"#fafafa" }}>
                <td style={{ padding:"11px 20px", fontWeight:500 }}>Total</td>
                {LAYANAN.map(l => (
                  <td key={l} style={{ padding:"11px 14px", textAlign:"right", fontWeight:500, color:COLORS[l].text }}>
                    {fmt(totals[l]) || "—"}
                  </td>
                ))}
                <td style={{ padding:"11px 14px", textAlign:"right", fontWeight:500 }}>{fmt(totalAll)}</td>
                <td style={{ padding:"11px 20px", textAlign:"right", fontWeight:500 }}>{totalCustomer} orang</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

function Sk({ c }: { c: string }) { return <div className={`animate-pulse bg-gray-100 rounded-2xl ${c}`} />; }

export default function DashboardKeuanganPage() {
  const now = new Date().getFullYear();
  const [tahun, setTahun] = useState(now);
  const [data, setData] = useState<FinancialDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  const load = useCallback(async (y: number) => {
    setLoading(true); setError(null);
    try { setData(await financeService.getDashboard(y)); }
    catch (e: any) { setError(e?.status === 403 ? "Akses ditolak (403 Forbidden)." : e?.message || "Gagal memuat data."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(tahun); }, [tahun, load]);

  if (error) {
    return (
      <div className="bg-[#f8fafc] min-h-screen">
        <Navbar activePage="dashboard" />
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 inline-block font-medium">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  const rows = Array.from({length: 12}, (_, i) => {
    const t = data?.tren_bulanan?.find((x: any) => x.bulan === i + 1);
    return {
      penjualan: {
        Mazdafarm: t?.penjualan_mazdafarm ? Number(t.penjualan_mazdafarm) : null,
        Mazdaging: t?.penjualan_mazdaging ? Number(t.penjualan_mazdaging) : null,
        Investernak: t?.penjualan_investernak ? Number(t.penjualan_investernak) : null,
      },
      customer: t?.customer_baru ?? 0,
    };
  });

  const customerArr = rows.map(r => r.customer);
  const totalPenjualan = data?.summary?.total_penjualan_aktif ?? 0;
  const totalCustomer = data?.summary?.total_customer_baru ?? 0;
  const totalPiutang = data?.summary?.total_piutang_aktif ?? 0;
  const bulanAktif = data?.summary?.bulan_aktif ?? 0;

  const piutangBelumAll = LAYANAN.reduce((a, l) => a + Number(data?.breakdown_piutang?.[l as keyof typeof data.breakdown_piutang]?.belum_bayar || 0), 0);
  const piutangTungguAll = LAYANAN.reduce((a, l) => a + Number(data?.breakdown_piutang?.[l as keyof typeof data.breakdown_piutang]?.menunggu_verifikasi || 0), 0);

  const breakdownTotals = LAYANAN.map(l => ({
    layanan: l,
    total: Number(data?.breakdown_penjualan?.[l as keyof typeof data.breakdown_penjualan] || 0),
  }));
  const persen = breakdownTotals.map(b => ({
    ...b,
    persen: totalPenjualan > 0 ? ((b.total/totalPenjualan)*100).toFixed(1) : "0.0",
  }));

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <Navbar activePage="dashboard" />
      <div style={{ fontFamily:"'DM Sans',sans-serif", maxWidth:900, margin:"0 auto", padding:"32px 16px", display:"flex", flexDirection:"column", gap:12 }}>

        {loading && <div className="space-y-4 mb-8"><Sk c="h-10 w-48" /><Sk c="h-32" /><Sk c="h-64" /></div>}
        
        {!loading && data && (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
              <div>
                <div style={{ fontSize:11, color:"#1D9E75", fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase" }}>Keuangan</div>
                <div style={{ fontSize:22, fontWeight:500, color:"#1a1a1a", marginTop:2 }}>Dashboard Keuangan</div>
                <div style={{ fontSize:12, color:"#aaa", marginTop:2 }}>Performa finansial &amp; pertumbuhan customer · Semua layanan</div>
              </div>
              <select
                value={tahun}
                onChange={e => setTahun(Number(e.target.value))}
                style={{
                  fontSize:13, padding:"7px 12px", borderRadius:10,
                  border:"0.5px solid #ddd", background:"#fff",
                  color:"#1a1a1a", cursor:"pointer", fontFamily:"inherit",
                }}
              >
                <option value={now}>Tahun {now}</option>
                <option value={now-1}>Tahun {now-1}</option>
                <option value={now-2}>Tahun {now-2}</option>
              </select>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
              <SummaryCard
                label={`Total penjualan lunas ${tahun}`}
                value={fmt(totalPenjualan)}
                sub={fmtFull(totalPenjualan)}
                valueColor="#1D9E75"
                accent="#1D9E75"
              />
              <SummaryCard
                label="Total piutang aktif"
                value={fmt(totalPiutang)}
                sub={`${fmt(piutangBelumAll)} blm bayar · ${fmt(piutangTungguAll)} menunggu verif`}
                valueColor="#D85A30"
                accent="#D85A30"
              />
              <SummaryCard
                label={`Customer baru ${tahun}`}
                value={`${totalCustomer} orang`}
                sub={`${bulanAktif} bulan aktif`}
                valueColor="#7F77DD"
                accent="#7F77DD"
              />
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div style={{ background:"#fff", border:"0.5px solid #e8e8e8", borderRadius:14, padding:"14px 18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:500 }}>Penjualan per bulan</div>
                    <div style={{ fontSize:11, color:"#aaa" }}>Pesanan selesai · {tahun}</div>
                  </div>
                  <div style={{ fontSize:13, fontWeight:500, color:"#378ADD" }}>{fmt(totalPenjualan)}</div>
                </div>
                <BarChart rows={rows} />
              </div>
              <div style={{ background:"#fff", border:"0.5px solid #e8e8e8", borderRadius:14, padding:"14px 18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:500 }}>Customer baru per bulan</div>
                    <div style={{ fontSize:11, color:"#aaa" }}>Tanggal registrasi · {tahun}</div>
                  </div>
                  <div style={{ fontSize:13, fontWeight:500, color:"#7F77DD" }}>{totalCustomer} orang</div>
                </div>
                <LineChart data={customerArr} />
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div style={{ background:"#fff", border:"0.5px solid #e8e8e8", borderRadius:14, padding:"14px 18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:500 }}>Breakdown penjualan per layanan</div>
                    <div style={{ fontSize:11, color:"#aaa" }}>Dari pesanan selesai · {tahun}</div>
                  </div>
                </div>
                <div style={{ display:"flex", height:10, borderRadius:5, overflow:"hidden", gap:2, marginBottom:14 }}>
                  {persen.map(r => (
                    <div key={r.layanan} style={{ width:r.persen+"%", background:COLORS[r.layanan].dot }} />
                  ))}
                </div>
                {persen.map(r => (
                  <div key={r.layanan} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                      <span style={{ fontSize:12, display:"flex", alignItems:"center", gap:5 }}>
                        <Dot color={COLORS[r.layanan].dot} />
                        {r.layanan === "Investernak" ? "Invest Ternak" : r.layanan}
                      </span>
                      <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:12, fontWeight:500 }}>{fmt(r.total) || "—"}</span>
                        <span style={{ fontSize:11, padding:"2px 7px", borderRadius:20, background:COLORS[r.layanan].bg, color:COLORS[r.layanan].text, fontWeight:500 }}>
                          {r.persen}%
                        </span>
                      </span>
                    </div>
                    <div style={{ height:5, background:"#f0f0ee", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ width:r.persen+"%", height:"100%", background:COLORS[r.layanan].dot, borderRadius:3 }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background:"#fff", border:"0.5px solid #e8e8e8", borderRadius:14, padding:"14px 18px" }}>
                <div style={{ fontSize:13, fontWeight:500, marginBottom:2 }}>Piutang aktif (diproses)</div>
                <div style={{ fontSize:11, color:"#aaa", marginBottom:12 }}>Pesanan aktif yang belum lunas</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                  <div style={{ background:"#FAECE7", borderRadius:10, padding:"10px 14px" }}>
                    <div style={{ fontSize:10, fontWeight:500, color:"#993C1D", textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:4 }}>Belum bayar</div>
                    <div style={{ fontSize:18, fontWeight:500, color:"#D85A30" }}>{fmt(piutangBelumAll) || "Rp 0"}</div>
                  </div>
                  <div style={{ background:"#FAEEDA", borderRadius:10, padding:"10px 14px" }}>
                    <div style={{ fontSize:10, fontWeight:500, color:"#854F0B", textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:4 }}>Menunggu verifikasi</div>
                    <div style={{ fontSize:18, fontWeight:500, color:"#BA7517" }}>{fmt(piutangTungguAll) || "Rp 0"}</div>
                  </div>
                </div>
                {[
                  { l:"Mazdafarm",   belum:fmt(data?.breakdown_piutang?.Mazdafarm?.belum_bayar), tunggu:fmt(data?.breakdown_piutang?.Mazdafarm?.menunggu_verifikasi) },
                  { l:"Mazdaging",   belum:fmt(data?.breakdown_piutang?.Mazdaging?.belum_bayar),  tunggu:fmt(data?.breakdown_piutang?.Mazdaging?.menunggu_verifikasi) },
                  { l:"Investernak", belum:fmt(data?.breakdown_piutang?.Investernak?.belum_bayar), tunggu:fmt(data?.breakdown_piutang?.Investernak?.menunggu_verifikasi) },
                ].map(r => (
                  <div key={r.l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"0.5px solid #f5f5f5" }}>
                    <span style={{ fontSize:12, display:"flex", alignItems:"center", gap:5 }}>
                      <Dot color={COLORS[r.l].dot} />
                      {r.l === "Investernak" ? "Invest Ternak" : r.l}
                    </span>
                    <div style={{ display:"flex", gap:16, textAlign:"right" }}>
                      <div>
                        <div style={{ fontSize:10, color:"#aaa" }}>belum dibayar</div>
                        <div style={{ fontSize:12, fontWeight:500, color:"#D85A30" }}>{r.belum || "Rp 0"}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:10, color:"#aaa" }}>menunggu verif.</div>
                        <div style={{ fontSize:12, fontWeight:500, color:"#BA7517" }}>{r.tunggu || "Rp 0"}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <TabelBreakdown
              rows={rows}
              customer={customerArr}
              tahun={tahun}
              expanded={expanded}
              onToggle={() => setExpanded(e => !e)}
            />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
