"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/button";
import { useCattleCatalog, Cattle } from "@/features/cattle/useCattleCatalog";
import Image from "next/image";
import { catalogService } from "@/services/catalog.service";
import toast from "react-hot-toast";

// Code splitting
const ConfirmationModal = dynamic(() => import("@/components/ui/ConfirmationModal"), {
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

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
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[#1a8245] font-black uppercase tracking-[0.2em] text-[10px] mb-2 block">
            Dashboard Ternak
          </span>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">
            Katalog <span className="text-[#1a8245]">Mazdafarm</span>
          </h1>
          <p className="text-gray-500 font-medium">
            Manajemen unit hewan ternak secara komprehensif.
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          className="rounded-[24px] shadow-xl shadow-green-100/50 hover:-translate-y-1 transition-all duration-300 font-black uppercase text-xs tracking-widest px-10"
        >
          + Tambah Unit Ternak
        </Button>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-md rounded-[40px] border border-white/20">
          <div className="w-16 h-16 border-4 border-[#1a8245]/20 border-t-[#1a8245] rounded-full animate-spin mb-6"></div>
          <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Sinkronisasi ternak...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 font-primary">
          {cattle.map((item) => (
            <div key={item.id} className="bg-white/80 backdrop-blur-md rounded-[32px] shadow-sm border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="relative h-56 bg-gray-100">
                <Image
                  src={getImageUrl(item.foto) || "https://placehold.co/400x300?text=Cow"}
                  alt={item.nama}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status_ternak === 'Tersedia' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                    {item.status_ternak}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-black text-xl text-gray-900 mb-1">{item.nama}</h3>
                <div className="bg-gray-50/50 p-4 rounded-2xl mb-6 space-y-2 border border-gray-100/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Berat</span>
                    <span className="font-extrabold text-gray-900">{item.berat} kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Usia</span>
                    <span className="font-extrabold text-gray-900">{item.umur} Bln</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1 rounded-2xl">Edit</Button>
                  <Button variant="danger" size="sm" className="rounded-2xl" onClick={() => handleOpenDeleteModal(item.id)}>🗑️</Button>
                </div>
              </div>
            </div>
          ))}
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
    </div>
  );
}
