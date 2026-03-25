"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/button";
import { useMeatCatalog, Meat } from "@/features/meat/useMeatCatalog";
import MeatCard from "@/features/meat/components/MeatCard";

import { Icons } from "@/components/common/Icons";

// Dynamic imports for code splitting
const MeatModal = dynamic(() => import("@/features/meat/components/MeatModal"), {
  loading: () => null,
});
const ConfirmationModal = dynamic(() => import("@/components/ui/ConfirmationModal"), {
  loading: () => null,
});

export default function KatalogMazdagingPage() {
  const {
    meatList,
    loading,
    totalPages,
    currentPage,
    setCurrentPage,
    filters,
    fetchMeatList,
  } = useMeatCatalog();

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Meat | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
  }, []);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (item: Meat) => {
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
        const { catalogService } = await import("@/services/catalog.service");
        await catalogService.deleteDaging(itemToDelete);
        const { toast } = await import("react-hot-toast");
        toast.success("Produk berhasil dihapus");
        fetchMeatList();
      } catch (error) {
        console.error(error);
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="p-10 relative">
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10 text-center sm:text-left">
        <div>
          <span className="text-[#1a8245] font-black uppercase tracking-[0.2em] text-[10px] mb-2 block">
            Dashboard Produk
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter mb-2">
            Katalog <span className="text-[#1a8245]">Mazdaging</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            Kelola stok dan harga produk daging sapi premium.
          </p>
        </div>
        {(userRole === "SuperAdmin" || userRole === "CEO") && (
          <Button
            onClick={handleOpenAddModal}
            variant="primary"
            size="lg"
            className="rounded-2xl shadow-xl shadow-green-100/50 hover:shadow-green-200/50 hover:-translate-y-1 transition-all duration-300 font-black uppercase text-xs tracking-widest px-10 h-14"
          >
            + Tambah Daging
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl shadow-green-900/5 border border-white/40 p-10 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex-1 relative col-span-1 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#1a8245] mb-2 block">Cari Produk</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Icons.Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="ID, Nama, atau Bagian..."
                value={filters.searchTerm}
                onChange={(e) => filters.setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-sm text-gray-900 shadow-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[#1a8245] mb-2 block">Status</label>
            <select
              value={filters.filterStatus}
              onChange={(e) => filters.setFilterStatus(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white focus:border-transparent outline-none font-bold text-sm transition-all appearance-none shadow-sm"
            >
              <option value="all">Semua Status</option>
              <option value="Tersedia">Tersedia</option>
              <option value="Terjual">Terjual</option>
              <option value="Pre Order">Pre Order</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={filters.resetFilters}
              variant="secondary"
              size="md"
              fullWidth
              className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-[50px] shadow-sm"
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
          <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Sinkronisasi data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {meatList.length === 0 ? (
              <div className="col-span-full py-32 text-center bg-white/50 backdrop-blur-md rounded-[40px] border-2 border-dashed border-gray-200">
                <div className="flex justify-center mb-6 text-[#1a8245]/20">
                  <Icons.Meat className="w-20 h-20" />
                </div>
                <p className="text-gray-400 font-black text-xl tracking-tight">Belum ada stok terdaftar.</p>
              </div>
            ) : (
              meatList.map((item) => (
                <MeatCard
                  key={item.id}
                  item={item}
                  userRole={userRole}
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
      <MeatModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          fetchMeatList();
        }}
        isEditing={isEditing}
        selectedItem={selectedItem}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={onConfirmDelete}
        title="Hapus Produk"
        message="Produk ini akan dihapus permanen dari katalog. Lanjutkan?"
        confirmText="Ya, Hapus"
        type="danger"
      />
    </div>
  );
}
