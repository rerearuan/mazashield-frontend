"use client";

import { useState } from "react";

export default function DashboardFinancialPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Mock data
  const financialData = {
    revenue: {
      total: 2500000000,
      growth: 12.5,
      breakdown: {
        investTernak: 1500000000,
        qurban: 600000000,
        dagingPotong: 400000000,
      },
    },
    expenses: {
      total: 1800000000,
      growth: -5.2,
      breakdown: {
        operasional: 800000000,
        pakan: 500000000,
        perawatan: 300000000,
        lainnya: 200000000,
      },
    },
    profit: {
      total: 700000000,
      growth: 35.8,
    },
    transactions: {
      total: 245,
      pending: 18,
      completed: 227,
    },
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Financial</h1>
          <p className="text-gray-600">Ringkasan keuangan perusahaan</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none"
        >
          <option value="week">Minggu Ini</option>
          <option value="month">Bulan Ini</option>
          <option value="quarter">Kuartal Ini</option>
          <option value="year">Tahun Ini</option>
        </select>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">
            Rp {(financialData.revenue.total / 1000000).toFixed(0)}M
          </p>
          <p className="text-sm text-green-600 mt-2">
            ↑ {financialData.revenue.growth}% dari periode sebelumnya
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-gray-900">
            Rp {(financialData.expenses.total / 1000000).toFixed(0)}M
          </p>
          <p className="text-sm text-red-600 mt-2">
            ↓ {Math.abs(financialData.expenses.growth)}% dari periode sebelumnya
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Net Profit</p>
          <p className="text-2xl font-bold text-green-600">
            Rp {(financialData.profit.total / 1000000).toFixed(0)}M
          </p>
          <p className="text-sm text-green-600 mt-2">
            ↑ {financialData.profit.growth}% dari periode sebelumnya
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Transaksi</p>
          <p className="text-2xl font-bold text-gray-900">{financialData.transactions.total}</p>
          <p className="text-sm text-gray-600 mt-2">
            {financialData.transactions.completed} selesai, {financialData.transactions.pending} pending
          </p>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Breakdown</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Invest Ternak</span>
                <span className="text-sm font-semibold text-gray-900">
                  Rp {(financialData.revenue.breakdown.investTernak / 1000000).toFixed(0)}M
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Qurban</span>
                <span className="text-sm font-semibold text-gray-900">
                  Rp {(financialData.revenue.breakdown.qurban / 1000000).toFixed(0)}M
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: "24%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Daging Potong</span>
                <span className="text-sm font-semibold text-gray-900">
                  Rp {(financialData.revenue.breakdown.dagingPotong / 1000000).toFixed(0)}M
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: "16%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Expenses Breakdown</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Operasional</span>
                <span className="text-sm font-semibold text-gray-900">
                  Rp {(financialData.expenses.breakdown.operasional / 1000000).toFixed(0)}M
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: "44%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Pakan</span>
                <span className="text-sm font-semibold text-gray-900">
                  Rp {(financialData.expenses.breakdown.pakan / 1000000).toFixed(0)}M
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full"
                  style={{ width: "28%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Perawatan</span>
                <span className="text-sm font-semibold text-gray-900">
                  Rp {(financialData.expenses.breakdown.perawatan / 1000000).toFixed(0)}M
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: "17%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Lainnya</span>
                <span className="text-sm font-semibold text-gray-900">
                  Rp {(financialData.expenses.breakdown.lainnya / 1000000).toFixed(0)}M
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-600 h-2 rounded-full"
                  style={{ width: "11%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Transaksi Terbaru</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  ID Transaksi
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Tipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Tanggal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">INV-001</td>
                <td className="px-6 py-4 text-sm text-gray-600">Invest Ternak</td>
                <td className="px-6 py-4 text-sm text-gray-900">John Doe</td>
                <td className="px-6 py-4 text-sm text-gray-900">Rp 10.000.000</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Selesai
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">2024-03-15</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">QUR-001</td>
                <td className="px-6 py-4 text-sm text-gray-600">Qurban</td>
                <td className="px-6 py-4 text-sm text-gray-900">Ahmad Hidayat</td>
                <td className="px-6 py-4 text-sm text-gray-900">Rp 25.000.000</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">2024-03-14</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
