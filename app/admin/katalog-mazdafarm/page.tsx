"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/button";
import { useCattleCatalog, Cattle } from "@/features/mazdafarm-catalog/useCattleCatalog";
import { catalogService } from "@/services/catalog.service";
import toast from "react-hot-toast";
import { Icons } from "@/components/common/Icons";
import SafeImage from "@/components/common/SafeImage";
import { getRandomCowImage } from "@/lib/image-utils";
import CattleFilters from "@/features/mazdafarm-catalog/components/CattleFilters";

// Code splitting
const ConfirmationModal = dynamic(() => import("@/components/ui/ConfirmationModal"), {
  loading: () => null,
});
const CattleModal = dynamic(() => import("@/features/mazdafarm-catalog/components/CattleModal"), {
  loading: () => null,
});

function DescriptionToggle({ text }: { text: string }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const isLong = text.length > 80;

    if (!isLong) return <p className="bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">{text}</p>;

    return (
        <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100 group-hover:bg-white group-hover:border-[#1a8245]/20 transition-all duration-300 overflow-hidden">
            <p className={`break-words ${!isExpanded ? 'line-clamp-2' : ''} transition-all duration-300 text-gray-600`}>
                {text}
            </p>

            <button

                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-[#1a8245] font-black uppercase text-[8px] tracking-widest hover:underline flex items-center gap-1"
            >
                {isExpanded ? (
                    <>Show Less <Icons.ChevronUp className="w-2.5 h-2.5" /></>
                ) : (
                    <>Read More <Icons.ChevronDown className="w-2.5 h-2.5" /></>
                )}
            </button>
        </div>
    );
}

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
    <div className="p-4 md:p-10 relative">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-center sm:text-left">
        <div>
          <span className="text-[#1a8245] font-black uppercase tracking-[0.2em] text-[10px] mb-2 block">
            Dashboard Ternak
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2">
            Katalog <span className="text-[#1a8245]">Mazdafarm</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            Manajemen unit hewan ternak secara komprehensif.
          </p>
        </div>
        {(userRole === "SuperAdmin" || userRole === "CEO" || userRole === "Marketing" || userRole === "Komisaris") && (

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

      <CattleFilters filters={filters} />

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
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    item.status_ternak === 'Tersedia' ? 'bg-[#1a8245] text-white' :
                    item.status_ternak === 'Dipesan' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'
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
                
                {/* Description - Progressive Disclosure Implementation */}
                <div className="mb-6">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1a8245] mb-2 opacity-70">Deskripsi Unit</p>
                    <div className="text-xs text-gray-600 font-medium leading-relaxed">
                        {item.deskripsi ? (
                            <DescriptionToggle text={item.deskripsi} />
                        ) : (
                            <p className="text-gray-400 italic">Tidak ada deskripsi unit.</p>
                        )}
                    </div>
                </div>


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

                <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm mb-6 group-hover:shadow-md group-hover:border-[#1a8245]/30 transition-all duration-300">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Harga Unit</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-sm font-black text-[#1a8245] leading-none mb-0.5">Rp</span>
                        <span className="text-2xl font-black text-gray-900 tracking-tighter leading-none">
                            {Number(item.harga).toLocaleString("id-ID")}
                        </span>
                    </div>
                </div>

                {(userRole === "SuperAdmin" || userRole === "CEO" || userRole === "Marketing" || userRole === "Komisaris") && (

                   <div className="flex gap-2">
                     <Button
                       variant="primary"
                       className="flex-1 rounded-[20px] font-black uppercase text-[10px] tracking-[0.15em] h-12 shadow-lg shadow-green-100/50"
                       onClick={() => handleOpenEdit(item)}
                     >
                       Edit Ternak
                     </Button>
                     <button 
                       onClick={() => handleOpenDeleteModal(item.id)}
                       className="w-12 h-12 rounded-[20px] bg-red-50 text-red-600 border border-red-100 flex items-center justify-center hover:bg-red-100 transition-all shadow-sm"
                       title="Hapus Ternak"
                     >
                       <Icons.Trash className="w-5 h-5" />
                     </button>


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
