import { useState, useEffect } from "react";
import { catalogService } from "@/services/catalog.service";

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


export function useInvestPublic(itemsPerPage: number = 6) {
    const [packages, setPackages] = useState<InvestTernak[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Filters - PBI 22
    const [searchTerm, setSearchTerm] = useState("");
    const [jenisFilter, setJenisFilter] = useState("");
    const [minHarga, setMinHarga] = useState("");
    const [maxHarga, setMaxHarga] = useState("");

    const fetchInvestPackages = async () => {
        try {
            setLoading(true);
            const params: any = {
                status_investernak: "Open",
                page: currentPage.toString(),
            };

            if (searchTerm) params.search = searchTerm;
            if (jenisFilter && jenisFilter !== "all") params.jenis = jenisFilter;
            if (minHarga) params.min_harga_sapi = minHarga;
            if (maxHarga) params.max_harga_sapi = maxHarga;

            const data: any = await catalogService.getInvestPublic(params);

            if (data.results) {
                setPackages(data.results);
                setTotalCount(data.count);
                setTotalPages(Math.ceil(data.count / itemsPerPage));
            } else {
                setPackages(Array.isArray(data) ? data : []);
                setTotalCount(Array.isArray(data) ? data.length : 0);
                setTotalPages(1);
            }
        } catch (error: any) {
            console.error("Error fetching invest packages:", error);
            setPackages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvestPackages();
    }, [currentPage, searchTerm, jenisFilter, minHarga, maxHarga]);

    return {
        packages,
        loading,
        currentPage,
        setCurrentPage,
        totalPages,
        totalCount,
        filters: {
            searchTerm, setSearchTerm,
            jenisFilter, setJenisFilter,
            minHarga, setMinHarga,
            maxHarga, setMaxHarga,
        },
        refresh: fetchInvestPackages
    };
}

