"use client";

import { useState } from "react";
import { Button } from "@/components/button";

interface InvestmentReport {
  id: string;
  investorName: string;
  packageName: string;
  investmentAmount: number;
  returnAmount: number;
  profit: number;
  startDate: string;
  endDate: string;
  status: "Aktif" | "Selesai";
}

export default function LaporanInvestasiPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "Aktif" | "Selesai">("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setDateRange({ start: "", end: "" });
    setCurrentPage(1);
  };

  // Mock data
  const [reports] = useState<InvestmentReport[]>([
    {
      id: "INV-001",
      investorName: "John Doe",
      packageName: "Paket Investasi 6 Bulan",
      investmentAmount: 10000000,
      returnAmount: 11500000,
      profit: 1500000,
      startDate: "2024-01-15",
      endDate: "2024-07-15",
      status: "Aktif",
    },
    {
      id: "INV-002",
      investorName: "Jane Smith",
      packageName: "Paket Investasi 12 Bulan",
      investmentAmount: 20000000,
      returnAmount: 26000000,
      profit: 6000000,
      startDate: "2023-06-01",
      endDate: "2024-06-01",
      status: "Selesai",
    },
  ]);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.investorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  // Calculate totals
  const totalInvestment = filteredReports.reduce((sum, r) => sum + r.investmentAmount, 0);
  const totalReturn = filteredReports.reduce((sum, r) => sum + r.returnAmount, 0);
  const totalProfit = filteredReports.reduce((sum, r) => sum + r.profit, 0);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Laporan Investasi</h1>
        <p className="text-gray-600">Laporan lengkap investasi ternak</p>
      </div>

      {/* Summary Cards */}
      <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0 mb-6">
        <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 min-w-max md:min-w-0">
          <div className="min-w-[160px] md:min-w-0 bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 flex-shrink-0">
            <p className="text-sm text-gray-600 mb-1">Total Investasi</p>
            <p className="text-lg md:text-2xl font-bold text-gray-900">Rp {totalInvestment.toLocaleString("id-ID")}</p>
          </div>
          <div className="min-w-[160px] md:min-w-0 bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 flex-shrink-0">
            <p className="text-sm text-gray-600 mb-1">Total Return</p>
            <p className="text-lg md:text-2xl font-bold text-blue-600">Rp {totalReturn.toLocaleString("id-ID")}</p>
          </div>
          <div className="min-w-[160px] md:min-w-0 bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 flex-shrink-0">
            <p className="text-sm text-gray-600 mb-1">Total Profit</p>
            <p className="text-lg md:text-2xl font-bold text-green-600">Rp {totalProfit.toLocaleString("id-ID")}</p>
          </div>
          <div className="min-w-[160px] md:min-w-0 bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 flex-shrink-0">
            <p className="text-sm text-gray-600 mb-1">ROI</p>
            <p className="text-lg md:text-2xl font-bold text-purple-600">
              {totalInvestment > 0 ? ((totalProfit / totalInvestment) * 100).toFixed(2) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <input
            type="text"
            placeholder="Cari ID atau nama investor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:col-span-2 lg:col-span-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Selesai">Selesai</option>
          </select>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="md"
            type="button"
            onClick={handleResetFilters}
            className="rounded-xl h-[42px] bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 font-black text-[10px] uppercase tracking-[0.16em] shadow-sm"
          >
            Reset Filter
          </Button>
          <button
            type="button"
            className="bg-[#1a8245] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#22ad5c] transition-colors whitespace-nowrap h-[42px] text-sm"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ID Investasi
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Investor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Paket
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Investasi
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Return
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Profit
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ROI
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Periode
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentReports.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              ) : (
                currentReports.map((report) => {
                  const roi = (report.profit / report.investmentAmount) * 100;
                  return (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.investorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {report.packageName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rp {report.investmentAmount.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                        Rp {report.returnAmount.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                        Rp {report.profit.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-semibold">
                        {roi.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {report.startDate} - {report.endDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            report.status === "Aktif"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredReports.length)} dari {filteredReports.length} laporan
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
    </div>
  );
}
