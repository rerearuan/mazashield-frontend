"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/button";
import { useUserManagement } from "@/features/admin-users/useUserManagement";

import { Icons } from "@/components/common/Icons";

const UserModal = dynamic(() => import("@/features/admin-users/components/UserModal"), {
  loading: () => null,
});
const ConfirmationModal = dynamic(() => import("@/components/ui/ConfirmationModal"), {
  loading: () => null,
});

export default function ManajemenAkunInternalPage() {
  const {
    users,
    loading,
    userRole,
    filters,
    actions
  } = useUserManagement("internal");

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const handleOpenDelete = (user: any) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const onConfirmDelete = async () => {
    if (userToDelete) {
      await actions.toggleStatus(userToDelete);
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleOpenEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditing(true);
    setShowModal(true);
  };


  const itemsPerPage = 8;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice((filters.currentPage - 1) * itemsPerPage, filters.currentPage * itemsPerPage);

  return (
    <div className="p-10 relative font-primary">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10 text-center sm:text-left">
        <div>
          <span className="text-[#1a8245] font-black uppercase tracking-[0.2em] text-[10px] mb-2 block">
            Administrasi Sistem
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter mb-2">
            Akun <span className="text-[#1a8245]">Internal</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            Manajemen hak akses staf dan pimpinan perusahaan.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          {/* Export CSV: only SuperAdmin can export internal accounts */}
          {userRole === "SuperAdmin" && (
            <Button
              onClick={actions.exportData}
              variant="secondary"
              size="lg"
              className="rounded-2xl font-black uppercase text-[10px] tracking-widest px-8 h-14"
            >
              Export CSV
            </Button>
          )}
          {userRole === "SuperAdmin" && (
            <Button
              onClick={handleOpenAdd}
              variant="primary"
              size="lg"
              className="rounded-2xl shadow-xl shadow-green-100/50 hover:-translate-y-1 transition-all duration-300 font-black uppercase text-[10px] tracking-widest px-8 h-14"
            >
              + Akun Baru
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/85 backdrop-blur-xl rounded-[32px] shadow-lg shadow-green-900/5 border border-white/50 p-6 md:p-7 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <div className="md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1a8245] mb-2 block">Cari Anggota</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Icons.Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Nama atau alamat email..."
                value={filters.searchTerm}
                onChange={(e) => filters.setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white focus:border-transparent outline-none transition-all font-semibold text-sm text-gray-900 shadow-sm placeholder:text-gray-300"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1a8245] mb-2 block">Role</label>
            <select
              value={filters.filterRole}
              onChange={(e) => filters.setFilterRole(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white focus:border-transparent outline-none font-semibold text-sm transition-all appearance-none cursor-pointer text-gray-900 shadow-sm"
            >
              <option value="all">Semua Jabatan</option>
              <option value="SuperAdmin">SuperAdmin</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="CEO">CEO</option>
              <option value="Komisaris">Komisaris</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-xl shadow-gray-200/50 border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Nama Lengkap</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Role / Jabatan</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                {userRole !== "Marketing" && (
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={userRole === "Marketing" ? 3 : 4} className="px-8 py-20 text-center">
                    <div className="w-10 h-10 border-4 border-[#1a8245]/20 border-t-[#1a8245] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Menyinkronkan data...</p>
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={userRole === "Marketing" ? 3 : 4} className="px-8 py-20 text-center">
                    <p className="text-gray-400 font-bold text-lg">Tidak ada akun ditemukan.</p>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900 group-hover:text-[#1a8245] transition-colors">{user.nama}</span>
                        <span className="text-xs text-gray-400 font-medium tracking-tight">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'SuperAdmin' ? 'bg-purple-50 text-purple-600' :
                          user.role === 'CEO' ? 'bg-indigo-50 text-indigo-600' :
                            user.role === 'Komisaris' ? 'bg-amber-50 text-amber-600' :
                              user.role === 'Finance' ? 'bg-emerald-50 text-emerald-600' :
                                'bg-blue-50 text-blue-600'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-300'}`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${user.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                          {user.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>
                    </td>
                      {userRole !== "Marketing" && (
                        <td className="px-8 py-6">
                          <div className="flex justify-end gap-2">
                            {/* CEO/Komisaris: read-only, no action buttons */}
                            {userRole === "SuperAdmin" && (
                              user.is_active ? (
                                <>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    className="rounded-xl font-black text-[10px] uppercase tracking-widest px-4 border-gray-100"
                                    onClick={() => handleOpenEdit(user)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    className="rounded-xl px-3 border-red-100"
                                    onClick={() => handleOpenDelete(user)}
                                  >
                                    <Icons.Trash className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 py-1.5 px-3">Nonaktif</span>
                              )
                            )}
                            {(userRole === "CEO" || userRole === "Komisaris" || userRole === "Finance") && !user.is_active && (
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 py-1.5 px-3">Nonaktif</span>
                            )}
                          </div>
                        </td>
                      )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => filters.setCurrentPage(i + 1)}
                  className={`min-w-[40px] h-10 rounded-xl font-black text-xs transition-all ${filters.currentPage === i + 1
                      ? "bg-[#1a8245] text-white shadow-lg shadow-green-200"
                      : "text-gray-400 hover:bg-white hover:text-gray-900"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <UserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={isEditing ? (data) => actions.updateUser(selectedUser.id, data) : (data) => actions.createUser(data)}
        isEditing={isEditing}
        selectedUser={selectedUser}
        type="internal"
        currentUserRole={userRole}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={onConfirmDelete}
        title="Hapus Akun Pengguna"
        message="Akun ini akan dinonaktifkan (soft delete) dan tidak dapat diakses lagi. Lanjutkan?"
        confirmText="Hapus Akun"
        type="danger"
      />

    </div>
  );
}
