import { useState, useEffect } from "react";
import { catalogService } from "@/services/catalog.service";
import toast from "react-hot-toast";

export interface Meat {
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

export function useMeatCatalog() {
    const [meatList, setMeatList] = useState<Meat[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const fetchMeatList = async () => {
        try {
            setLoading(true);
            const params: any = { page: currentPage.toString() };

            if (searchTerm) params.nama = searchTerm;
            if (filterStatus !== "all") params.status_daging = filterStatus;
            if (minPrice) params.min_harga = minPrice;
            if (maxPrice) params.max_harga = maxPrice;

            const data: any = await catalogService.getDagingInternal(params);

            if (data.results) {
                setMeatList(data.results);
                setTotalCount(data.count);
                setTotalPages(Math.ceil(data.count / 10));
            } else {
                setMeatList(Array.isArray(data) ? data : []);
                setTotalCount(Array.isArray(data) ? data.length : 0);
                setTotalPages(1);
            }
        } catch (error: any) {
            console.error("Error fetching meat list:", error);
            toast.error(error.message || "Gagal mengambil data katalog daging");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeatList();
    }, [currentPage, searchTerm, filterStatus, minPrice, maxPrice]);

    const resetFilters = () => {
        setSearchTerm("");
        setFilterStatus("all");
        setMinPrice("");
        setMaxPrice("");
        setCurrentPage(1);
    };

    return {
        meatList,
        loading,
        totalCount,
        totalPages,
        currentPage,
        setCurrentPage,
        filters: {
            searchTerm, setSearchTerm,
            filterStatus, setFilterStatus,
            minPrice, setMinPrice,
            maxPrice, setMaxPrice,
            resetFilters,
        },
        fetchMeatList,
    };
}
