import { useState, useEffect } from "react";
import { catalogService } from "@/services/catalog.service";
import toast from "react-hot-toast";

export interface InvestTernak {
    id: number;
    id_invest: string;
    nama_paket: string;
    harga_sapi: string;
    biaya_pemeliharaan: string;
    vaksin_vitamin: string;
    fee_marketing: string;
    total_modal: string;
    harga_jual: string;
    keuntungan: string;
    hasil_investor: string;
    roi_persen: string;
    jenis: string;
    berat: string;
    durasi_hari: number;
    deskripsi: string;
    foto: string | null;
    status_investernak: "Open" | "Ongoing" | "Closed";
    created_at: string;
    updated_at: string;
}

export function useInvestCatalog() {
    const [investList, setInvestList] = useState<InvestTernak[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [minHargaSapi, setMinHargaSapi] = useState("");
    const [maxHargaSapi, setMaxHargaSapi] = useState("");
    const [minHargaJual, setMinHargaJual] = useState("");
    const [maxHargaJual, setMaxHargaJual] = useState("");
    const [minBerat, setMinBerat] = useState("");
    const [maxBerat, setMaxBerat] = useState("");
    const [minDurasi, setMinDurasi] = useState("");
    const [maxDurasi, setMaxDurasi] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [jenisFilter, setJenisFilter] = useState("");

    const fetchInvestList = async () => {
        try {
            setLoading(true);
            const params: any = { page: currentPage.toString() };

            if (searchTerm) params.nama_paket = searchTerm;
            if (minHargaSapi) params.min_harga_sapi = minHargaSapi;
            if (maxHargaSapi) params.max_harga_sapi = maxHargaSapi;
            if (minHargaJual) params.min_harga_jual = minHargaJual;
            if (maxHargaJual) params.max_harga_jual = maxHargaJual;
            if (minBerat) params.min_berat = minBerat;
            if (maxBerat) params.max_berat = maxBerat;
            if (minDurasi) params.min_durasi = minDurasi;
            if (maxDurasi) params.max_durasi = maxDurasi;
            if (statusFilter !== "all") params.status_investernak = statusFilter;
            if (jenisFilter) params.jenis = jenisFilter;

            const data: any = await catalogService.getInvestInternal(params);

            if (data.results) {
                setInvestList(data.results);
                setTotalCount(data.count);
                setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 per page
            } else {
                setInvestList(Array.isArray(data) ? data : []);
                setTotalCount(Array.isArray(data) ? data.length : 0);
                setTotalPages(1);
            }
        } catch (error: any) {
            console.error("Error fetching invest list:", error);
            toast.error(error.message || "Gagal mengambil data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvestList();
    }, [currentPage, searchTerm, minHargaSapi, maxHargaSapi, minHargaJual, maxHargaJual, minBerat, maxBerat, minDurasi, maxDurasi, statusFilter, jenisFilter]);

    const resetFilters = () => {
        setSearchTerm("");
        setMinHargaSapi("");
        setMaxHargaSapi("");
        setMinHargaJual("");
        setMaxHargaJual("");
        setMinBerat("");
        setMaxBerat("");
        setMinDurasi("");
        setMaxDurasi("");
        setStatusFilter("all");
        setJenisFilter("");
        setCurrentPage(1);
    };

    const deleteInvest = async (id: number) => {
        try {
            await catalogService.deleteInvest(id);
            toast.success("Invest berhasil dihapus");
            fetchInvestList();
        } catch (error: any) {
            toast.error(error.message || "Gagal menghapus invest");
        }
    };

    return {
        investList,
        loading,
        totalCount,
        totalPages,
        currentPage,
        setCurrentPage,
        filters: {
            searchTerm, setSearchTerm,
            minHargaSapi, setMinHargaSapi,
            maxHargaSapi, setMaxHargaSapi,
            minHargaJual, setMinHargaJual,
            maxHargaJual, setMaxHargaJual,
            minBerat, setMinBerat,
            maxBerat, setMaxBerat,
            minDurasi, setMinDurasi,
            maxDurasi, setMaxDurasi,
            statusFilter, setStatusFilter,
            jenisFilter, setJenisFilter,
            resetFilters,
        },
        fetchInvestList,
        deleteInvest,
    };
}
