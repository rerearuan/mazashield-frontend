import { useState, useEffect } from "react";
import { catalogService } from "@/services/catalog.service";
import toast from "react-hot-toast";

export interface Cattle {
    id: number;
    id_ternak: string;
    nama: string;
    jenis: "Sapi" | "Kambing";
    kelas: "A" | "B" | "C" | "D" | "E" | "Patungan";
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

export function useCattleCatalog() {
    const [cattle, setCattle] = useState<Cattle[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minWeight, setMinWeight] = useState("");
    const [maxWeight, setMaxWeight] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchCattle = async () => {
        try {
            setLoading(true);
            const params: any = { page: currentPage.toString() };

            if (searchTerm) params.nama = searchTerm;
            if (minPrice) params.min_harga = minPrice;
            if (maxPrice) params.max_harga = maxPrice;
            if (minWeight) params.min_berat = minWeight;
            if (maxWeight) params.max_berat = maxWeight;
            if (statusFilter !== "all") params.status_ternak = statusFilter;

            const data: any = await catalogService.getTernakInternal(params);

            if (data.results) {
                setCattle(data.results);
                setTotalCount(data.count);
                setTotalPages(Math.ceil(data.count / 10));
            } else {
                setCattle(Array.isArray(data) ? data : []);
                setTotalCount(Array.isArray(data) ? data.length : 0);
                setTotalPages(1);
            }
        } catch (error: any) {
            console.error("Error fetching cattle:", error);
            toast.error(error.message || "Gagal mengambil data ternak");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCattle();
    }, [currentPage, searchTerm, minPrice, maxPrice, minWeight, maxWeight, statusFilter]);

    const resetFilters = () => {
        setSearchTerm("");
        setMinPrice("");
        setMaxPrice("");
        setMinWeight("");
        setMaxWeight("");
        setStatusFilter("all");
        setCurrentPage(1);
    };

    return {
        cattle,
        loading,
        totalCount,
        totalPages,
        currentPage,
        setCurrentPage,
        filters: {
            searchTerm, setSearchTerm,
            minPrice, setMinPrice,
            maxPrice, setMaxPrice,
            minWeight, setMinWeight,
            maxWeight, setMaxWeight,
            statusFilter, setStatusFilter,
            resetFilters,
        },
        fetchCattle,
    };
}
