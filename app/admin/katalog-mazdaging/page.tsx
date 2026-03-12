"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { catalogService } from "@/lib/api-client";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "@/components/button";

interface Daging {
  id: number;
  id_daging: string;
  nama: string;
  bagian: string;
  harga_per_kg: string;
  deskripsi: string;
  foto: string | null;
  status_daging: string;
  created_at: string;
  updated_at: string;
}

export default function KatalogMazdagingPage() {
  const [products, setProducts] = useState<Daging[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Daging | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Additional Filter states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [formData, setFormData] = useState({
    id_daging: "",
    nama: "",
    bagian: "",
    harga_per_kg: "",
    deskripsi: "",
    status_daging: "Tersedia",
    foto: null as File | null,
  });

  useEffect(() => {
    fetchDaging();
  }, [currentPage, searchTerm, filterStatus, minPrice, maxPrice]);

  const fetchDaging = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage.toString(),
      };

      if (searchTerm) params.nama = searchTerm;
      if (filterStatus !== "all") params.status_daging = filterStatus;
      if (minPrice) params.min_harga = minPrice;
      if (maxPrice) params.max_harga = maxPrice;

      const data: any = await catalogService.getDagingInternal(params);

      if (data.results) {
        setProducts(data.results);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / 10));
      } else {
        setProducts(Array.isArray(data) ? data : []);
        setTotalPages(1);
      }
    } catch (error) {
      toast.error("Gagal mengambil data katalog daging");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, foto: e.target.files![0] }));
    }
  };

  const resetForm = () => {
    setFormData({
      id_daging: "",
      nama: "",
      bagian: "",
      harga_per_kg: "",
      deskripsi: "",
      status_daging: "Tersedia",
      foto: null,
    });
    setSelectedProduct(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading(isEditing ? "Memperbarui data..." : "Menambahkan data...");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          if (key === 'id_daging' && isEditing) return;
          data.append(key, value);
        }
      });

      if (isEditing && selectedProduct) {
        await catalogService.updateDaging(selectedProduct.id, data);
        toast.success("Produk berhasil diperbarui", { id: loadingToast });
      } else {
        await catalogService.createDaging(data);
        toast.success("Produk berhasil ditambahkan", { id: loadingToast });
      }

      setShowModal(false);
      resetForm();
      fetchDaging();
    } catch (error: any) {
      const errorMessage = error.message || "Terjadi kesalahan";
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  const handleEdit = (product: Daging) => {
    setSelectedProduct(product);
    setFormData({
      id_daging: product.id_daging,
      nama: product.nama,
      bagian: product.bagian,
      harga_per_kg: product.harga_per_kg.toString(),
      deskripsi: product.deskripsi,
      status_daging: product.status_daging,
      foto: null,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      const loadingToast = toast.loading("Menghapus produk...");
      try {
        await catalogService.deleteDaging(id);
        toast.success("Produk berhasil dihapus", { id: loadingToast });
        fetchDaging();
      } catch (error) {
        toast.error("Gagal menghapus produk", { id: loadingToast });
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Katalog Mazdaging</h1>
          <p className="text-gray-600">Kelola katalog produk daging sapi</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          variant="primary"
          size="md"
          leftIcon={<span>+</span>}
        >
          Tambah Daging
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="flex-1 relative col-span-1 md:col-span-2 lg:col-span-1">
            <label className="text-xs font-bold text-gray-400 mb-1 block">Cari Produk</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="ID, Nama, Bagian..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1 block">Harga Jual (Min-Max)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
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
            <label className="text-xs font-bold text-gray-400 mb-1 block">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none font-medium"
            >
              <option value="all">Semua Status</option>
              <option value="Tersedia">Tersedia</option>
              <option value="Terjual">Terjual</option>
              <option value="Pre Order">Pre Order</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
                setMinPrice("");
                setMaxPrice("");
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
            {products.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">Belum ada data daging terdaftar.</p>
              </div>
            ) : (
              products.map((item) => (
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
                        <span className="text-4xl">🥩</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${item.status_daging === "Tersedia"
                          ? "bg-green-100 text-green-800"
                          : item.status_daging === "Terjual"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {item.status_daging}
                      </span>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="bg-white/80 px-2 py-1 rounded text-[10px] font-bold text-gray-700 shadow-sm border border-gray-100">
                        {item.id_daging}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{item.nama}</h3>
                    <p className="text-sm text-gray-600 mb-2 text-xs">Bagian: {item.bagian}</p>

                    <div className="space-y-1 text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded-lg">
                      <div className="truncate text-xs" title={item.deskripsi}>{item.deskripsi || "Tidak ada deskripsi"}</div>
                    </div>

                    <p className="text-lg font-bold text-[#1a8245] mb-3">
                      Rp {Number(item.harga_per_kg).toLocaleString("id-ID")} <span className="text-xs font-normal text-gray-500">/kg</span>
                    </p>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(item)}
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
          <div className="bg-white rounded-[32px] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900">
                {isEditing ? "Edit Data Daging" : "Tambah Daging Baru"}
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">ID Daging</label>
                  <input
                    type="text"
                    name="id_daging"
                    required
                    disabled={isEditing}
                    value={formData.id_daging}
                    onChange={handleInputChange}
                    placeholder="Contoh: DG-001"
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Produk</label>
                  <input
                    type="text"
                    name="nama"
                    required
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Contoh: Has Dalam Premium"
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bagian Daging</label>
                  <input
                    type="text"
                    name="bagian"
                    required
                    value={formData.bagian}
                    onChange={handleInputChange}
                    placeholder="Contoh: Has Dalam"
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Harga per Kg (Rp)</label>
                  <input
                    type="number"
                    name="harga_per_kg"
                    required
                    value={formData.harga_per_kg}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                  <select
                    name="status_daging"
                    value={formData.status_daging}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-medium"
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Terjual">Terjual</option>
                    <option value="Pre Order">Pre Order</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Foto Produk</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#1a8245]/10 file:text-[#1a8245] hover:file:bg-[#1a8245]/20 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  name="deskripsi"
                  rows={3}
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  placeholder="Deskripsi singkat produk..."
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all resize-none"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
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
