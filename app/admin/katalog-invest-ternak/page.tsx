"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { catalogService } from "@/lib/api-client";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "@/components/button";

interface InvestTernak {
  id: number;
  id_invest: string;
  nama: string;
  berat: string;
  umur: number;
  harga_beli: string;
  harga_jual_per_kg: string;
  deskripsi: string;
  foto: string | null;
  status_investernak: "Tersedia" | "Dipesan" | "Terjual";
  created_at: string;
  updated_at: string;
}

export default function KatalogInvestTernakPage() {
  const [investList, setInvestList] = useState<InvestTernak[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InvestTernak | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [minHargaBeli, setMinHargaBeli] = useState("");
  const [maxHargaBeli, setMaxHargaBeli] = useState("");
  const [minHargaJual, setMinHargaJual] = useState("");
  const [maxHargaJual, setMaxHargaJual] = useState("");
  const [minBerat, setMinBerat] = useState("");
  const [maxBerat, setMaxBerat] = useState("");
  const [minUmur, setMinUmur] = useState("");
  const [maxUmur, setMaxUmur] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form states
  const [formData, setFormData] = useState({
    id_invest: "",
    nama: "",
    berat: "",
    umur: "",
    harga_beli: "",
    harga_jual_per_kg: "",
    deskripsi: "",
    status_investernak: "Tersedia" as "Tersedia" | "Dipesan" | "Terjual",
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    fetchInvestList();
  }, [currentPage, searchTerm, minHargaBeli, maxHargaBeli, minHargaJual, maxHargaJual, minBerat, maxBerat, minUmur, maxUmur, statusFilter]);

  const fetchInvestList = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage.toString(),
      };

      if (searchTerm) params.nama = searchTerm;
      if (minHargaBeli) params.min_harga_beli = minHargaBeli;
      if (maxHargaBeli) params.max_harga_beli = maxHargaBeli;
      if (minHargaJual) params.min_harga_jual = minHargaJual;
      if (maxHargaJual) params.max_harga_jual = maxHargaJual;
      if (minBerat) params.min_berat = minBerat;
      if (maxBerat) params.max_berat = maxBerat;
      if (minUmur) params.min_umur = minUmur;
      if (maxUmur) params.max_umur = maxUmur;
      if (statusFilter !== "all") params.status_investernak = statusFilter;

      const data: any = await catalogService.getInvestInternal(params);

      if (data.results) {
        setInvestList(data.results);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / 10));
      } else {
        setInvestList(Array.isArray(data) ? data : []);
        setTotalCount(Array.isArray(data) ? data.length : 0);
        setTotalPages(1);
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal mengambil data invest ternak");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id_invest: "",
      nama: "",
      berat: "",
      umur: "",
      harga_beli: "",
      harga_jual_per_kg: "",
      deskripsi: "",
      status_investernak: "Tersedia",
    });
    setUploadFile(null);
    setSelectedItem(null);
    setIsEditing(false);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (item: InvestTernak) => {
    setFormData({
      id_invest: item.id_invest,
      nama: item.nama,
      berat: item.berat,
      umur: item.umur.toString(),
      harga_beli: item.harga_beli,
      harga_jual_per_kg: item.harga_jual_per_kg,
      deskripsi: item.deskripsi,
      status_investernak: item.status_investernak,
    });
    setSelectedItem(item);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading(isEditing ? "Memperbarui data..." : "Menambahkan data...");

    try {
      const formDataToSend = new FormData();
      
      if (!isEditing) {
        formDataToSend.append("id_invest", formData.id_invest);
      }
      formDataToSend.append("nama", formData.nama);
      formDataToSend.append("berat", formData.berat);
      formDataToSend.append("umur", formData.umur);
      formDataToSend.append("harga_beli", formData.harga_beli);
      formDataToSend.append("harga_jual_per_kg", formData.harga_jual_per_kg);
      formDataToSend.append("deskripsi", formData.deskripsi);
      formDataToSend.append("status_investernak", formData.status_investernak);
      
      if (uploadFile) {
        formDataToSend.append("foto", uploadFile);
      }

      if (isEditing && selectedItem) {
        await catalogService.updateInvest(selectedItem.id, formDataToSend);
        toast.success("Invest ternak berhasil diperbarui", { id: loadingToast });
      } else {
        await catalogService.createInvest(formDataToSend);
        toast.success("Invest ternak berhasil ditambahkan", { id: loadingToast });
      }

      setShowModal(false);
      resetForm();
      fetchInvestList();
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan data", { id: loadingToast });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus invest ternak ini?")) {
      return;
    }

    const loadingToast = toast.loading("Menghapus data...");
    try {
      await catalogService.deleteInvest(id);
      toast.success("Invest ternak berhasil dihapus", { id: loadingToast });
      fetchInvestList();
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus data", { id: loadingToast });
    }
  };

  const getImageUrl = (foto: string | null) => {
    if (!foto) return null;
    if (foto.startsWith("http")) return foto;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8000";
    return `${apiUrl}${foto}`;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Katalog Invest Ternak</h1>
          <p className="text-gray-600">Kelola paket investasi ternak</p>
        </div>
        <Button
          onClick={handleOpenAddModal}
          variant="primary"
          size="md"
          leftIcon={<span>+</span>}
        >
          Tambah Invest Ternak
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex-1 relative col-span-1 md:col-span-2 lg:col-span-1">
            <label className="text-xs font-bold text-gray-400 mb-1 block">Cari Invest</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="ID atau Nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1 block">Harga Beli (Min-Max)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minHargaBeli}
                onChange={(e) => setMinHargaBeli(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxHargaBeli}
                onChange={(e) => setMaxHargaBeli(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1 block">Harga Jual (Min-Max)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minHargaJual}
                onChange={(e) => setMinHargaJual(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxHargaJual}
                onChange={(e) => setMaxHargaJual(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1 block">Berat (Min-Max)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minBerat}
                onChange={(e) => setMinBerat(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxBerat}
                onChange={(e) => setMaxBerat(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1 block">Umur (Min-Max)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minUmur}
                onChange={(e) => setMinUmur(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxUmur}
                onChange={(e) => setMaxUmur(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1 block">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="Tersedia">Tersedia</option>
              <option value="Dipesan">Dipesan</option>
              <option value="Terjual">Terjual</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm("");
                setMinHargaBeli("");
                setMaxHargaBeli("");
                setMinHargaJual("");
                setMaxHargaJual("");
                setMinBerat("");
                setMaxBerat("");
                setMinUmur("");
                setMaxUmur("");
                setStatusFilter("all");
                setCurrentPage(1);
              }}
              variant="secondary"
              size="sm"
              fullWidth
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a8245] mb-4"></div>
          <p className="text-gray-500 font-medium">Memuat data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investList.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">Tidak ada data invest ternak terdaftar.</p>
              </div>
            ) : (
              investList.map((item) => {
                const imageUrl = getImageUrl(item.foto);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-48 bg-gray-100">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.nama}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-4xl">🐄</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.status_investernak === "Tersedia"
                              ? "bg-green-100 text-green-800"
                              : item.status_investernak === "Dipesan"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status_investernak}
                        </span>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-white/80 px-2 py-1 rounded text-[10px] font-bold text-gray-700 shadow-sm border border-gray-100">
                          {item.id_invest}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{item.nama}</h3>

                      <div className="space-y-1 text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded-lg">
                        <div className="flex justify-between">
                          <span>⚖️ Berat:</span>
                          <span className="font-bold">{Number(item.berat).toLocaleString()} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>📅 Umur:</span>
                          <span className="font-bold">{item.umur} Bulan</span>
                        </div>
                        <div className="flex justify-between">
                          <span>💰 Beli:</span>
                          <span className="font-bold">Rp {Number(item.harga_beli).toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>💵 Jual:</span>
                          <span className="font-bold">Rp {Number(item.harga_jual_per_kg).toLocaleString("id-ID")}/kg</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleOpenEditModal(item)}
                          variant="primary"
                          size="sm"
                          className="flex-1"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(item.id)}
                          variant="danger"
                          size="sm"
                        >
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${
                      currentPage === i + 1
                        ? "bg-[#1a8245] text-white shadow-lg shadow-green-100"
                        : "bg-white text-gray-400 hover:text-[#1a8245] border border-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900">
                {isEditing ? "Edit Data Invest Ternak" : "Tambah Invest Ternak Baru"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ID Invest (Unik)</label>
                  <input
                    type="text"
                    required
                    disabled={isEditing}
                    value={formData.id_invest}
                    onChange={(e) => setFormData({ ...formData, id_invest: e.target.value })}
                    placeholder="Contoh: INV-001"
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Invest</label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: Paket Invest Sapi Premium"
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Berat (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0"
                    value={formData.berat}
                    onChange={(e) => setFormData({ ...formData, berat: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Umur (bulan)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.umur}
                    onChange={(e) => setFormData({ ...formData, umur: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Harga Beli (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.harga_beli}
                    onChange={(e) => setFormData({ ...formData, harga_beli: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Harga Jual per Kg (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.harga_jual_per_kg}
                    onChange={(e) => setFormData({ ...formData, harga_jual_per_kg: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                  <select
                    required
                    value={formData.status_investernak}
                    onChange={(e) => setFormData({ ...formData, status_investernak: e.target.value as any })}
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-medium"
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Dipesan">Dipesan</option>
                    <option value="Terjual">Terjual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  rows={3}
                  required
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Deskripsi paket investasi..."
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Foto Produk</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#1a8245]/10 file:text-[#1a8245] hover:file:bg-[#1a8245]/20 cursor-pointer"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="flex-[2]"
                  isLoading={isEditing ? false : false}
                >
                  {isEditing ? "Simpan Perubahan" : "Tambah ke Katalog"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
