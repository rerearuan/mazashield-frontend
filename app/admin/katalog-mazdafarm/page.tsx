"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/button";
import { useCattleCatalog, Cattle } from "@/features/cattle/useCattleCatalog";
import { catalogService } from "@/services/catalog.service";
import toast from "react-hot-toast";
import { Icons } from "@/components/common/Icons";
import SafeImage from "@/components/common/SafeImage";
import { getRandomCowImage } from "@/lib/image-utils";

// Code splitting
const ConfirmationModal = dynamic(() => import("@/components/ui/ConfirmationModal"), {
  loading: () => null,
});
const CattleModal = dynamic(() => import("@/features/cattle/components/CattleModal"), {
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

  const handleOpenAdd = () => {
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

  const getImageUrl = (foto: string | null) => {
    if (!foto) return null;
    if (foto.startsWith('http')) return foto;
    return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${foto}`;
  };

  return (
    <div className="p-10 relative">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-center sm:text-left">
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
        {(userRole === "SuperAdmin" || userRole === "CEO") && (
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

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl shadow-green-900/5 border border-white/40 p-10 mb-10">
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
                className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-sm text-gray-900 shadow-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[#1a8245] mb-2 block">Range Harga</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => filters.setMinPrice(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-xs text-gray-900 shadow-sm"
              />
              <span className="text-gray-300 self-center font-bold">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => filters.setMaxPrice(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-xs text-gray-900 shadow-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[#1a8245] mb-2 block">Range Berat (Kg)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minWeight}
                onChange={(e) => filters.setMinWeight(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-xs text-gray-900 shadow-sm"
              />
              <span className="text-gray-300 self-center font-bold">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxWeight}
                onChange={(e) => filters.setMaxWeight(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-xs text-gray-900 shadow-sm"
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
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
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

                <div className="bg-gray-900/5 p-4 rounded-2xl mb-6 border border-gray-900/5">
                    <p className="text-gray-900 font-black text-2xl tracking-tighter">
                        <span className="text-xs mr-1 font-bold text-gray-400">Rp</span>
                        {Number(item.harga).toLocaleString("id-ID")}
                    </p>
                </div>
                {(userRole === "SuperAdmin" || userRole === "CEO") && (
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
