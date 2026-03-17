import { useState, useEffect } from "react";
import { catalogService } from "@/services/catalog.service";

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

export function useInvestPublic(itemsPerPage: number = 6) {
    const [packages, setPackages] = useState<InvestTernak[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchInvestPackages = async () => {
        try {
            setLoading(true);
            const data: any = await catalogService.getInvestPublic({
                status_investernak: "Tersedia",
                page: currentPage.toString(),
            });

            if (data.results) {
                setPackages(data.results);
                setTotalPages(Math.ceil(data.count / itemsPerPage));
            } else {
                setPackages(Array.isArray(data) ? data : []);
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
    }, [currentPage]);

    return {
        packages,
        loading,
        currentPage,
        setCurrentPage,
        totalPages,
        refresh: fetchInvestPackages
    };
}
