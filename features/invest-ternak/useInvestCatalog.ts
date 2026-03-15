import { useState, useEffect } from "react";
import { catalogService } from "@/services/catalog.service";
import toast from "react-hot-toast";

export interface InvestTernak {
    id: number;
    id_invest: string;
    nama: string;
    jenis: string;
    berat: string;
    umur: number;
    harga_beli: string;
    harga_jual_per_kg: string;
    deskripsi: string;
    foto: string | null;
    status_investernak: "Tersedia" | "Dipesan" | "Terjual";
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
    const [minHargaBeli, setMinHargaBeli] = useState("");
    const [maxHargaBeli, setMaxHargaBeli] = useState("");
    const [minHargaJual, setMinHargaJual] = useState("");
    const [maxHargaJual, setMaxHargaJual] = useState("");
    const [minBerat, setMinBerat] = useState("");
    const [maxBerat, setMaxBerat] = useState("");
    const [minUmur, setMinUmur] = useState("");
    const [maxUmur, setMaxUmur] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [jenisFilter, setJenisFilter] = useState("");

    const fetchInvestList = async () => {
        try {
            setLoading(true);
            const params: any = { page: currentPage.toString() };

            if (searchTerm) params.nama = searchTerm;
            if (minHargaBeli) params.min_harga_beli = minHargaBeli;
            if (maxHargaBeli) params.max_harga_beli = maxHargaBeli;
            if (minHargaJual) params.min_harga_jual = minHargaJual;
            if (maxHargaJual) params.max_harga_jual = maxHargaJual;
            if (minBerat) params.min_berat = minBerat;
            if (maxBerat) params.max_berat = maxBerat;
            if (minUmur) params.min_umur = minUmur;
            if (maxUmur) params.max_umur = maxUmur;
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
    }, [currentPage, searchTerm, minHargaBeli, maxHargaBeli, minHargaJual, maxHargaJual, minBerat, maxBerat, minUmur, maxUmur, statusFilter, jenisFilter]);

    const resetFilters = () => {
        setSearchTerm("");
        setMinHargaBeli("");
        setMaxHargaBeli("");
        setMinHargaJual("");
        setMaxHargaJual("");
        setMinBerat("");
        setMaxBerat("");
        setMinUmur("");
        setMaxUmur("");
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
            minHargaBeli, setMinHargaBeli,
            maxHargaBeli, setMaxHargaBeli,
            minHargaJual, setMinHargaJual,
            maxHargaJual, setMaxHargaJual,
            minBerat, setMinBerat,
            maxBerat, setMaxBerat,
            minUmur, setMinUmur,
            maxUmur, setMaxUmur,
            statusFilter, setStatusFilter,
            jenisFilter, setJenisFilter,
            resetFilters,
        },
        fetchInvestList,
        deleteInvest,
    };
}
