"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
import Image from "next/image";
import { catalogService } from "@/lib/api-client";
import { toast, Toaster } from "react-hot-toast";
=======
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/button";
import { useCattleCatalog, Cattle } from "@/features/mazdafarm-catalog/useCattleCatalog";
import { catalogService } from "@/services/catalog.service";
import toast from "react-hot-toast";
import { Icons } from "@/components/common/Icons";
import SafeImage from "@/components/common/SafeImage";
import { getRandomCowImage } from "@/lib/image-utils";
<<<<<<< HEAD
>>>>>>> 9c782b3ab20679041e48227693740b9d65d536ff
=======
import CattleFilters from "@/features/mazdafarm-catalog/components/CattleFilters";
>>>>>>> 09dc2cfe5959e08480f9acc4d1c4eb42f983915c

// Code splitting
const ConfirmationModal = dynamic(() => import("@/components/ui/ConfirmationModal"), {
  loading: () => null,
});
const CattleModal = dynamic(() => import("@/features/mazdafarm-catalog/components/CattleModal"), {
  loading: () => null,
});

export default function KatalogMazdafarmPage() {
  const {
    cattle,
    loading,
    totalPages,
    currentPage,
    setCurrentPage,
    filters,
    fetchCattle
  } = useCattleCatalog();

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
  }, []);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Cattle | null>(null);

<<<<<<< HEAD
  // Filter states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minWeight, setMinWeight] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Form states
  const [formData, setFormData] = useState({
    id_ternak: "",
    nama: "",
    jenis: "Sapi",
    berat: "",
    tanggal_penimbangan: new Date().toISOString().split('T')[0],
    berat_target: "",
    tanggal_lahir: "",
    harga: "",
    deskripsi: "",
    status_ternak: "Tersedia",
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    fetchCattle();
  }, [currentPage, searchTerm, minPrice, maxPrice, minWeight, maxWeight, statusFilter]);

  const fetchCattle = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage.toString(),
      };

      if (searchTerm) params.nama = searchTerm;
      if (minPrice) params.min_harga = minPrice;
      if (maxPrice) params.max_harga = maxPrice;
      if (minWeight) params.min_berat = minWeight;
      if (maxWeight) params.max_berat = maxWeight;
      if (statusFilter !== "all") params.status_ternak = statusFilter;

      const data: any = await catalogService.getTernakInternal(params);

      if (data.results) {
        setCattle(data.results);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / 10));
      } else {
        setCattle(Array.isArray(data) ? data : []);
        setTotalCount(Array.isArray(data) ? data.length : 0);
        setTotalPages(1);
      }
    } catch (error: any) {
      toast.error("Gagal mengambil data ternak");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id_ternak: "",
      nama: "",
      jenis: "Sapi",
      berat: "",
      tanggal_penimbangan: new Date().toISOString().split('T')[0],
      berat_target: "",
      tanggal_lahir: "",
      harga: "",
      deskripsi: "",
      status_ternak: "Tersedia",
    });
    setUploadFile(null);
    setSelectedItem(null);
=======
  const handleOpenAdd = () => {
>>>>>>> 9c782b3ab20679041e48227693740b9d65d536ff
    setIsEditing(false);
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleOpenEdit = (item: Cattle) => {
    setSelectedItem(item);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleOpenDeleteModal = (id: number) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const onConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        await catalogService.deleteTernak(itemToDelete);
        toast.success("Data berhasil dihapus");
        fetchCattle();
      } catch (error) {
        toast.error("Gagal menghapus data");
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

<<<<<<< HEAD
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (isEditing && key === 'id_ternak') return;
      data.append(key, value);
    });

    if (uploadFile) {
      data.append("foto", uploadFile);
    }

    try {
      if (isEditing && selectedItem) {
        await catalogService.updateTernak(selectedItem.id, data);
        toast.success("Data berhasil diperbarui");
      } else {
        await catalogService.createTernak(data);
        toast.success("Data berhasil ditambahkan");
      }
      setShowModal(false);
      resetForm();
      fetchCattle();
    } catch (error: any) {
      const message = error.message || "Gagal menyimpan data";
      toast.error(message);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      <div className="mb-8 flex justify-between items-end">
=======
  const getImageUrl = (foto: string | null) => {
    if (!foto) return null;
    if (foto.startsWith('http')) return foto;
    return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${foto}`;
  };

  return (
    <div className="p-10 relative">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-center sm:text-left">
>>>>>>> 9c782b3ab20679041e48227693740b9d65d536ff
        <div>
          <span className="text-[#1a8245] font-black uppercase tracking-[0.2em] text-[10px] mb-2 block">
            Dashboard Ternak
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter mb-2">
            Katalog <span className="text-[#1a8245]">Mazdafarm</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            Manajemen unit hewan ternak secara komprehensif.
          </p>
        </div>
<<<<<<< HEAD
<<<<<<< HEAD
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-[#1a8245] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#22ad5c] transition-all shadow-lg shadow-green-200 flex items-center gap-2"
        >
          <span>+ Tambah Ternak</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="flex-1 relative col-span-1 md:col-span-2 lg:col-span-1">
            <label className="text-xs font-bold text-gray-400 mb-1 block">Cari Sapi</label>
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
            <label className="text-xs font-bold text-gray-400 mb-1 block">Harga (Min-Max)</label>
=======
        {(userRole === "SuperAdmin" || userRole === "Marketing" || userRole === "CEO") && (
=======
        {(userRole === "SuperAdmin" || userRole === "CEO" || userRole === "Marketing" || userRole === "Komisaris") && (
>>>>>>> 09dc2cfe5959e08480f9acc4d1c4eb42f983915c
          <Button
            onClick={handleOpenAdd}
            variant="primary"
            size="lg"
            className="rounded-2xl shadow-xl shadow-green-100/50 hover:-translate-y-1 transition-all duration-300 font-black uppercase text-xs tracking-widest px-10 h-14"
          >
            + Tambah Unit Ternak
          </Button>
        )}
      </div>

<<<<<<< HEAD
      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-md rounded-[32px] shadow-sm border border-white/20 p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#1a8245] mb-2 block">Cari Ternak</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Icons.Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="ID atau Nama Ternak..."
                value={filters.searchTerm}
                onChange={(e) => filters.setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none transition-all font-bold text-sm text-gray-900"
              />
            </div>
          </div>
          
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[#1a8245] mb-2 block">Range Harga</label>
>>>>>>> 9c782b3ab20679041e48227693740b9d65d536ff
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
<<<<<<< HEAD
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1 block">Berat (Min-Max)</label>
=======
                value={filters.minPrice}
                onChange={(e) => filters.setMinPrice(e.target.value)}
                className="w-full px-3 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none transition-all font-bold text-xs text-gray-900"
              />
              <span className="text-gray-300 self-center font-bold">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => filters.setMaxPrice(e.target.value)}
                className="w-full px-3 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none transition-all font-bold text-xs text-gray-900"
              />
            </div>
          </div>
          
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[#1a8245] mb-2 block">Range Berat (Kg)</label>
>>>>>>> 9c782b3ab20679041e48227693740b9d65d536ff
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
<<<<<<< HEAD
                value={minWeight}
                onChange={(e) => setMinWeight(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxWeight}
                onChange={(e) => setMaxWeight(e.target.value)}
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
            <button
              onClick={() => {
                setSearchTerm("");
                setMinPrice("");
                setMaxPrice("");
                setMinWeight("");
                setMaxWeight("");
                setStatusFilter("all");
                setCurrentPage(1);
              }}
              className="w-full py-2 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition-all"
            >
              Reset
            </button>
=======
                value={filters.minWeight}
                onChange={(e) => filters.setMinWeight(e.target.value)}
                className="w-full px-3 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none transition-all font-bold text-xs text-gray-900"
              />
              <span className="text-gray-300 self-center font-bold">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxWeight}
                onChange={(e) => filters.setMaxWeight(e.target.value)}
                className="w-full px-3 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none transition-all font-bold text-xs text-gray-900"
              />
            </div>
          </div>

          <div className="flex items-end">
            <Button
              onClick={filters.resetFilters}
              variant="secondary"
              size="md"
              fullWidth
              className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-[46px] shadow-sm"
            >
              Reset Filter
            </Button>
>>>>>>> 9c782b3ab20679041e48227693740b9d65d536ff
          </div>
        </div>
      </div>
=======
      <CattleFilters filters={filters} />
>>>>>>> 09dc2cfe5959e08480f9acc4d1c4eb42f983915c

      {/* Grid Content */}
      {loading ? (
<<<<<<< HEAD
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a8245] mb-4"></div>
          <p className="text-gray-500 font-medium">Memuat data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cattle.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">Tidak ada data ternak terdaftar.</p>
              </div>
            ) : (
              cattle.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48 bg-gray-100">
                    {item.foto ? (
                      <Image
                        src={item.foto.startsWith('http') ? item.foto : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${item.foto}`}
                        alt={item.nama}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl">🐄</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${item.status_ternak === "Tersedia"
                          ? "bg-green-100 text-green-800"
                          : item.status_ternak === "Dipesan"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item.status_ternak}
                      </span>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="bg-white/80 px-2 py-1 rounded text-[10px] font-bold text-gray-700 shadow-sm border border-gray-100">
                        {item.id_ternak}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{item.nama}</h3>
                    <p className="text-sm text-gray-600 mb-2 text-xs">Jenis: {item.jenis}</p>

                    <div className="space-y-1 text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded-lg">
                      <div className="flex justify-between">
                        <span>⚖️ Berat:</span>
                        <span className="font-bold">{Number(item.berat).toLocaleString()} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>📅 Usia:</span>
                        <span className="font-bold">{item.umur} Bulan</span>
                      </div>
                    </div>

                    <p className="text-lg font-bold text-[#1a8245] mb-3">
                      Rp {Number(item.harga).toLocaleString("id-ID")}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 px-4 py-2 bg-[#1a8245] text-white rounded-lg text-sm font-medium hover:bg-[#22ad5c] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === i + 1
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

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900">
                {isEditing ? "Edit Data Ternak" : "Tambah Ternak Baru"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ID Ternak (Unik)</label>
                  <input
                    type="text"
                    required
                    disabled={isEditing}
                    value={formData.id_ternak}
                    onChange={(e) => setFormData({ ...formData, id_ternak: e.target.value })}
                    placeholder="Contoh: MS-001"
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Sapi</label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: Si Jago"
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Jenis</label>
                  <input
                    type="text"
                    required
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status_ternak}
                    onChange={(e) => setFormData({ ...formData, status_ternak: e.target.value as any })}
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-medium"
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Dipesan">Dipesan</option>
                    <option value="Terjual">Terjual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Berat Saat Ini (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.berat}
                    onChange={(e) => setFormData({ ...formData, berat: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Berat Target (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.berat_target}
                    onChange={(e) => setFormData({ ...formData, berat_target: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Lahir</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal_lahir}
                    onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Penimbangan</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal_penimbangan}
                    onChange={(e) => setFormData({ ...formData, tanggal_penimbangan: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Harga Jual (Rp)</label>
                <input
                  type="number"
                  required
                  value={formData.harga}
                  onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  rows={3}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
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
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-8 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-[2] px-8 py-4 bg-[#1a8245] text-white rounded-2xl font-bold hover:bg-[#22ad5c] transition-all shadow-xl shadow-green-100"
                >
                  {isEditing ? "Simpan Perubahan" : "Tambah ke Katalog"}
                </button>
              </div>
            </form>
=======
        <div className="flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-md rounded-[40px] border border-white/20">
          <div className="w-16 h-16 border-4 border-[#1a8245]/20 border-t-[#1a8245] rounded-full animate-spin mb-6"></div>
          <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Sinkronisasi ternak...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-primary">
          {cattle.map((item) => (
            <div key={item.id} className="bg-white/80 backdrop-blur-md rounded-[32px] shadow-sm border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="relative h-56 bg-gray-100">
                <SafeImage
                  src={getImageUrl(item.foto)}
                  fallbackSrc={getRandomCowImage(item.id_ternak)}
                  alt={item.nama}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status_ternak === 'Tersedia' ? 'bg-[#1a8245] text-white' : 'bg-amber-500 text-white'
                    }`}>
                    {item.status_ternak}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-gray-800 shadow-lg border border-white/20 uppercase">
                        {item.id_ternak}
                    </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-black text-xl text-gray-900 mb-1 tracking-tight">{item.nama}</h3>
                <div className="bg-[#1a8245]/5 p-4 rounded-2xl mb-6 space-y-2 border border-[#1a8245]/10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Jenis</span>
                    <span className="font-black text-gray-900">{item.jenis}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Kelas</span>
                    <span className="font-black text-[#1a8245]">{item.kelas}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Berat</span>
                    <span className="font-black text-gray-900">{item.berat} kg</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Usia</span>
                    <span className="font-black text-gray-900">{item.umur} Bln</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-2xl mb-6 border border-gray-200/80 shadow-sm">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Harga</p>
                    <p className="text-gray-900 font-black text-xl tracking-tight flex items-end">
                        <span className="text-[10px] mr-1 font-bold text-[#1a8245] uppercase tracking-widest mb-1">Rp</span>
                        {Number(item.harga).toLocaleString("id-ID")}
                    </p>
                </div>
                {(userRole === "SuperAdmin" || userRole === "CEO" || userRole === "Marketing" || userRole === "Komisaris") && (
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 rounded-2xl font-black uppercase text-[10px] tracking-widest py-3"
                      onClick={() => handleOpenEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" className="rounded-2xl px-4" onClick={() => handleOpenDeleteModal(item.id)}>
                      <Icons.Trash className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-20 flex justify-center pb-10">
          <div className="bg-white/70 backdrop-blur-md p-2 rounded-[24px] shadow-lg border border-white/20 flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`min-w-[48px] h-12 rounded-[18px] font-black text-sm transition-all duration-300 ${currentPage === i + 1
                    ? "bg-[#1a8245] text-white shadow-lg shadow-green-200"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                {i + 1}
              </button>
            ))}
>>>>>>> 9c782b3ab20679041e48227693740b9d65d536ff
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={onConfirmDelete}
        title="Hapus Ternak"
        message="Menghapus ternak ini akan menghilangkan data monitoring secara permanen. Lanjutkan?"
        confirmText="Hapus Sekarang"
        type="danger"
      />
      <CattleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          fetchCattle();
        }}
        isEditing={isEditing}
        selectedItem={selectedItem}
      />
    </div>
  );
}
