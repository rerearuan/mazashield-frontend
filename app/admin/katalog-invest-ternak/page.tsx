"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/button";
import { useInvestCatalog, InvestTernak } from "@/features/invest-ternak/useInvestCatalog";
import InvestCard from "@/features/invest-ternak/components/InvestCard";
import InvestFilters from "@/features/invest-ternak/components/InvestFilters";

// Dynamic imports for code splitting
const InvestModal = dynamic(() => import("@/features/invest-ternak/components/InvestModal"), {
  loading: () => null,
});
const ConfirmationModal = dynamic(() => import("@/components/ui/ConfirmationModal"), {
  loading: () => null,
});

export default function KatalogInvestTernakPage() {
  const {
    investList,
    loading,
    totalPages,
    currentPage,
    setCurrentPage,
    filters,
    fetchInvestList,
    deleteInvest,
  } = useInvestCatalog();

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InvestTernak | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (item: InvestTernak) => {
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
      await deleteInvest(itemToDelete);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="p-10 relative">
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
        <div>
          <span className="text-[#1a8245] font-black uppercase tracking-[0.2em] text-[10px] mb-2 block">
            Dashboard Investasi
          </span>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">
            Katalog <span className="text-[#1a8245]">Invest Ternak</span>
          </h1>
          <p className="text-gray-500 font-medium">
            Manajemen paket investasi ternak secara efektif dan transparan.
          </p>
        </div>
        <Button
          onClick={handleOpenAddModal}
          variant="primary"
          size="lg"
          className="rounded-[24px] shadow-xl shadow-green-100/50 hover:shadow-green-200/50 hover:-translate-y-1 transition-all duration-300 font-black uppercase text-xs tracking-widest px-10"
          leftIcon={<span className="text-lg">+</span>}
        >
          Tambah Invest Baru
        </Button>
      </div>

      {/* Filters */}
      <InvestFilters filters={filters} />

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-md rounded-[40px] border border-white/20">
          <div className="w-16 h-16 border-4 border-[#1a8245]/20 border-t-[#1a8245] rounded-full animate-spin mb-6"></div>
          <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">
            Menyinkronkan Data...
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {investList.length === 0 ? (
              <div className="col-span-full py-32 text-center bg-white/50 backdrop-blur-md rounded-[40px] border-2 border-dashed border-gray-200">
                <div className="text-6xl mb-6 opacity-20">📭</div>
                <p className="text-gray-400 font-bold text-xl">Katalog masih kosong.</p>
                <p className="text-gray-400">Gunakan tombol tambah untuk membuat paket perdana.</p>
              </div>
            ) : (
              investList.map((item) => (
                <InvestCard
                  key={item.id}
                  item={item}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                />
              ))
            )}
          </div>

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
        </>
      )}

      {/* Modals */}
      <InvestModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          fetchInvestList();
        }}
        isEditing={isEditing}
        selectedItem={selectedItem}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={onConfirmDelete}
        title="Hapus Invest"
        message="Data yang sudah dihapus tidak dapat dikembalikan. Pastikan Anda sudah memverifikasi data ini."
        confirmText="Ya, Hapus Permanen"
        type="danger"
      />
    </div>
  );
}
