"use client";

import { useState, useEffect } from "react";
import { userService } from "@/lib/api-client";

interface Account {
  id: string;
  name: string;
  email: string;
  role: "SuperAdmin" | "Internal";
  status: "Aktif" | "Nonaktif";
  createdAt: string;
}

export default function ManajemenAkunInternalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    role: "Marketing",
    nomor_telepon: ""
  });

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const data: any = await userService.getUsers();
      // Filter for Internal Roles Only
      const internalRoles = ["SuperAdmin", "Marketing", "Finance", "CEO", "Komisaris"];
      const internalData = data.filter((u: any) => internalRoles.includes(u.role));
      setAccounts(internalData);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data akun");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    setUserRole(localStorage.getItem("userRole"));
  }, []);

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await userService.adminCreateUser(formData);
      setGeneratedPassword(res.data.generated_password);
      fetchAccounts();
      setFormData({ nama: "", email: "", role: "Marketing", nomor_telepon: "" });
    } catch (err: any) {
      const msg = err.response?.data?.role || err.message || "Gagal membuat akun";
      alert(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  const handleEditAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.updateUser(editingAccount.id, editingAccount);
      setShowEditModal(false);
      fetchAccounts();
      alert("Akun berhasil diperbarui");
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "Gagal memperbarui akun";
      alert(msg);
    }
  };

  const handleToggleStatus = async (account: any) => {
    const action = account.is_active ? "nonaktifkan" : "aktifkan";
    if (confirm(`Apakah Anda yakin ingin ${action} akun ini?`)) {
      try {
        if (account.is_active) {
          await userService.deleteUser(account.id);
        } else {
          await userService.updateUser(account.id, { is_active: true });
        }
        fetchAccounts();
      } catch (err: any) {
        alert(err.message || `Gagal ${action} akun`);
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await userService.exportUsers("internal");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `akun_internal_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      alert("Gagal mengekspor data");
    }
  };

  const filteredAccounts = accounts.filter((account: any) => {
    const matchesSearch =
      account.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || account.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAccounts = filteredAccounts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Manajemen Akun Internal & SuperAdmin
        </h1>
        <p className="text-gray-600">Kelola akun internal dan superadmin sistem</p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none"
          >
            <option value="all">Semua Role</option>
            <option value="SuperAdmin">SuperAdmin</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="CEO">CEO</option>
            <option value="Komisaris">Komisaris</option>
          </select>
          <button
            onClick={handleExport}
            className="bg-[#1a8245] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#22ad5c] transition-colors whitespace-nowrap"
          >
            Export Data
          </button>
          {userRole === "SuperAdmin" && (
            <button
              onClick={() => {
                setGeneratedPassword("");
                setShowAddModal(true);
              }}
              className="bg-[#1a8245] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#22ad5c] transition-colors whitespace-nowrap"
            >
              + Tambah Akun
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tanggal Dibuat
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : currentAccounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              ) : (
                currentAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {account.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {account.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${account.role === "SuperAdmin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {account.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${account.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {account.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(account.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingAccount(account);
                            setShowDetailModal(true);
                          }}
                          className="text-[#1a8245] hover:text-[#22ad5c] font-medium"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => {
                            setEditingAccount(account);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(account)}
                          className={`${account.is_active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'} font-medium`}
                        >
                          {account.is_active ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredAccounts.length)} dari {filteredAccounts.length} akun
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tambah Akun Baru</h2>

            {generatedPassword ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-semibold mb-2">Akun Berhasil Dibuat!</p>
                  <p className="text-sm text-green-700">Berikan password ini kepada pengguna:</p>
                  <div className="mt-2 p-3 bg-white border border-green-300 rounded text-center text-xl font-mono font-bold select-all">
                    {generatedPassword}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setGeneratedPassword("");
                  }}
                  className="w-full px-4 py-2 bg-[#1a8245] text-white rounded-lg font-semibold hover:bg-[#22ad5c]"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none"
                    placeholder="Nama Lengkap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none"
                    placeholder="email@mazashi.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                  <input
                    type="text"
                    required
                    value={formData.nomor_telepon}
                    onChange={(e) => setFormData({ ...formData, nomor_telepon: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none"
                  >
                    <option value="SuperAdmin">SuperAdmin</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="CEO">CEO</option>
                    <option value="Komisaris">Komisaris</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#1a8245] text-white rounded-lg font-semibold hover:bg-[#22ad5c]"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {showEditModal && editingAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Akun</h2>
            <form onSubmit={handleEditAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                <input
                  type="text"
                  required
                  value={editingAccount.nama}
                  onChange={(e) => setEditingAccount({ ...editingAccount, nama: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                <input
                  type="text"
                  required
                  value={editingAccount.nomor_telepon}
                  onChange={(e) => setEditingAccount({ ...editingAccount, nomor_telepon: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  disabled={userRole !== "SuperAdmin"}
                  value={editingAccount.role}
                  onChange={(e) => setEditingAccount({ ...editingAccount, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] outline-none disabled:bg-gray-100"
                >
                  <option value="SuperAdmin">SuperAdmin</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="CEO">CEO</option>
                  <option value="Komisaris">Komisaris</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingAccount.is_active}
                    onChange={(e) => setEditingAccount({ ...editingAccount, is_active: e.target.checked })}
                    className="w-4 h-4 text-[#1a8245] border-gray-300 rounded focus:ring-[#1a8245]"
                  />
                  <span className="text-sm font-medium text-gray-700">Akun Aktif</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#1a8245] text-white rounded-lg font-semibold hover:bg-[#22ad5c]"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Detail Modal */}
      {showDetailModal && editingAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detail Akun Internal</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Nama</span>
                <span className="text-sm font-medium text-gray-900 col-span-2">{editingAccount.nama}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm font-medium text-gray-900 col-span-2">{editingAccount.email}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Telepon</span>
                <span className="text-sm font-medium text-gray-900 col-span-2">{editingAccount.nomor_telepon}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Role</span>
                <span className="text-sm font-medium text-gray-900 col-span-2">{editingAccount.role}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Status</span>
                <span className="col-span-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${editingAccount.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {editingAccount.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 mb-4">
                <span className="text-sm text-gray-500">Terdaftar</span>
                <span className="text-sm font-medium text-gray-900 col-span-2">
                  {new Date(editingAccount.created_at).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowDetailModal(false)}
              className="w-full mt-6 bg-[#1a8245] text-white py-2 rounded-lg font-semibold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
