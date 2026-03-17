"use client";

import { useState } from "react";
import Image from "next/image";

interface Livestock {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  healthStatus: "Sehat" | "Sakit" | "Perlu Perawatan";
  location: string;
  image: string;
  lastCheckup: string;
}

export default function DashboardKondisiTernakPage() {
  const [filterStatus, setFilterStatus] = useState<"all" | "Sehat" | "Sakit" | "Perlu Perawatan">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const [livestock] = useState<Livestock[]>([
    {
      id: "LIV-001",
      name: "Sapi Limousin #001",
      breed: "Limousin",
      age: 24,
      weight: 450,
      healthStatus: "Sehat",
      location: "Kandang A",
      image: "/images/homepages/Sapi.png",
      lastCheckup: "2024-03-10",
    },
    {
      id: "LIV-002",
      name: "Sapi Brahman #002",
      breed: "Brahman",
      age: 30,
      weight: 500,
      healthStatus: "Perlu Perawatan",
      location: "Kandang B",
      image: "/images/homepages/Sapi.png",
      lastCheckup: "2024-03-08",
    },
    {
      id: "LIV-003",
      name: "Sapi Limousin #003",
      breed: "Limousin",
      age: 18,
      weight: 380,
      healthStatus: "Sakit",
      location: "Kandang C",
      image: "/images/homepages/Sapi.png",
      lastCheckup: "2024-03-12",
    },
  ]);

  const filteredLivestock = livestock.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.healthStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: livestock.length,
    sehat: livestock.filter((l) => l.healthStatus === "Sehat").length,
    sakit: livestock.filter((l) => l.healthStatus === "Sakit").length,
    perluPerawatan: livestock.filter((l) => l.healthStatus === "Perlu Perawatan").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sehat":
        return "bg-green-100 text-green-800 border-green-200";
      case "Sakit":
        return "bg-red-100 text-red-800 border-red-200";
      case "Perlu Perawatan":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Kondisi Ternak</h1>
        <p className="text-gray-600">Monitoring kondisi kesehatan ternak</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Ternak</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Sehat</p>
          <p className="text-3xl font-bold text-green-600">{stats.sehat}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.total > 0 ? ((stats.sehat / stats.total) * 100).toFixed(1) : 0}% dari total
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Sakit</p>
          <p className="text-3xl font-bold text-red-600">{stats.sakit}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.total > 0 ? ((stats.sakit / stats.total) * 100).toFixed(1) : 0}% dari total
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Perlu Perawatan</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.perluPerawatan}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.total > 0 ? ((stats.perluPerawatan / stats.total) * 100).toFixed(1) : 0}% dari total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari ID, nama, atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="Sehat">Sehat</option>
            <option value="Sakit">Sakit</option>
            <option value="Perlu Perawatan">Perlu Perawatan</option>
          </select>
          <button className="bg-[#1a8245] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#22ad5c] transition-colors whitespace-nowrap">
            + Tambah Data Checkup
          </button>
        </div>
      </div>

      {/* Livestock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLivestock.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            Tidak ada data ditemukan
          </div>
        ) : (
          filteredLivestock.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(item.healthStatus)}`}
                  >
                    {item.healthStatus}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-3">ID: {item.id}</p>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Jenis:</span>
                    <span className="font-medium">{item.breed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Usia:</span>
                    <span className="font-medium">{item.age} bulan</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Berat:</span>
                    <span className="font-medium">{item.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lokasi:</span>
                    <span className="font-medium">{item.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Checkup Terakhir:</span>
                    <span className="font-medium">{item.lastCheckup}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-[#1a8245] text-white rounded-lg text-sm font-medium hover:bg-[#22ad5c] transition-colors">
                    Detail
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    Update
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
