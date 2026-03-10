"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { catalogService } from "@/lib/api-client";
import { toast } from "react-hot-toast";

interface Cattle {
  id: number;
  id_ternak: string;
  nama: string;
  jenis: string;
  berat: string;
  tanggal_penimbangan: string;
  berat_target: string;
  tanggal_lahir: string;
  umur: number;
  harga: string;
  deskripsi: string;
  foto: string | null;
  status_ternak: "Tersedia" | "Dipesan" | "Terjual";
  created_at: string;
  updated_at: string;
}

export default function KatalogMazdafarmPage() {
  const [cattle, setCattle] = useState<Cattle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Cattle | null>(null);

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
  }, []);

  const fetchCattle = async () => {
    try {
      setLoading(true);
      const data = await catalogService.getTernakInternal();
      // data might be an array or an object with results depending on pagination
      setCattle(Array.isArray(data) ? data : (data as any).results || []);
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
    setIsEditing(false);
  };

  const handleEdit = (item: Cattle) => {
    setSelectedItem(item);
    setFormData({
      id_ternak: item.id_ternak,
      nama: item.nama,
      jenis: item.jenis,
      berat: item.berat,
      tanggal_penimbangan: item.tanggal_penimbangan,
      berat_target: item.berat_target,
      tanggal_lahir: item.tanggal_lahir || "",
      harga: item.harga,
      deskripsi: item.deskripsi,
      status_ternak: item.status_ternak,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await catalogService.deleteTernak(id);
        toast.success("Data berhasil dihapus");
        fetchCattle();
      } catch (error) {
        toast.error("Gagal menghapus data");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    // Append fields
    Object.entries(formData).forEach(([key, value]) => {
      // Don't send id_ternak on update
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

  const filteredCattle = cattle.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id_ternak.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Katalog Mazdafarm</h1>
          <p className="text-gray-600">Kelola Katalog Hewan Ternak</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-[#1a8245] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#22ad5c] transition-colors shadow-sm"
        >
          + Tambah Ternak
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari berdasarkan ID Ternak atau Nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a8245] transition-all outline-none"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a8245]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCattle.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">Belum ada data ternak terdaftar.</p>
            </div>
          ) : (
            filteredCattle.map((item) => (
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
                  <p className="text-sm text-gray-600 mb-2">Jenis: {item.jenis}</p>

                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <p>Berat: {Number(item.berat).toLocaleString()} kg</p>
                    <p>Usia: {item.umur} Bulan</p>
                    <p>Penimbangan: {new Date(item.tanggal_penimbangan).toLocaleDateString('id-ID')}</p>
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
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
              {isEditing ? "📝 Edit Data Ternak" : "➕ Tambah Ternak Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">ID Ternak (Unik)</label>
                  <input
                    type="text"
                    required
                    disabled={isEditing}
                    value={formData.id_ternak}
                    onChange={(e) => setFormData({ ...formData, id_ternak: e.target.value })}
                    placeholder="Contoh: MS-001"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white transition-all outline-none disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Sapi</label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: Si Jago"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white transition-all outline-none"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Jenis</label>
                  <input
                    type="text"
                    required
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white transition-all outline-none"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                  <select
                    value={formData.status_ternak}
                    onChange={(e) => setFormData({ ...formData, status_ternak: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white transition-all outline-none"
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Dipesan">Dipesan</option>
                    <option value="Terjual">Terjual</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Berat Saat Ini (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.berat}
                    onChange={(e) => setFormData({ ...formData, berat: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white transition-all outline-none"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Berat Target (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.berat_target}
                    onChange={(e) => setFormData({ ...formData, berat_target: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white transition-all outline-none"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tanggal Lahir</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal_lahir}
                    onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white transition-all outline-none"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tgl Penimbangan</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal_penimbangan}
                    onChange={(e) => setFormData({ ...formData, tanggal_penimbangan: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white transition-all outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    required
                    value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Deskripsi</label>
                <textarea
                  rows={3}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white transition-all outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Upload Foto</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all overflow-hidden">
                    {uploadFile ? (
                      <span className="text-sm text-[#1a8245] font-bold">✅ {uploadFile.name}</span>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <p className="mb-2 text-sm text-gray-500 italic">Klik untuk upload gambar</p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 border border-gray-200 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 transition-all transition-all active:scale-[0.98]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-[2] px-6 py-4 bg-[#1a8245] text-white rounded-2xl font-black text-lg hover:bg-[#22ad5c] shadow-lg shadow-green-200 transition-all active:scale-[0.98]"
                >
                  {isEditing ? "Simpan Perubahan" : "Tambahkan Ternak"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
