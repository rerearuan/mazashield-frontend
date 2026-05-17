import jsPDF from "jspdf";
import "jspdf-autotable";

export function terbilang(angka: number): string {
    const huruf = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
    
    if (angka < 12) return huruf[angka];
    if (angka < 20) return terbilang(angka - 10) + " Belas";
    if (angka < 100) return terbilang(Math.floor(angka / 10)) + " Puluh " + terbilang(angka % 10);
    if (angka < 200) return "Seratus " + terbilang(angka - 100);
    if (angka < 1000) return terbilang(Math.floor(angka / 100)) + " Ratus " + terbilang(angka % 100);
    if (angka < 2000) return "Seribu " + terbilang(angka - 1000);
    if (angka < 1000000) return terbilang(Math.floor(angka / 1000)) + " Ribu " + terbilang(angka % 1000);
    if (angka < 1000000000) return terbilang(Math.floor(angka / 1000000)) + " Juta " + terbilang(angka % 1000000);
    if (angka < 1000000000000) return terbilang(Math.floor(angka / 1000000000)) + " Milyar " + terbilang(angka % 1000000000);
    
    return "";
}

export function generateMazdafarmInvoice(orderData: any, customerInfo: any, cattleList: any[]) {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Set base font
    doc.setFont("helvetica");

    // Logo
    const logoUrl = "/Kepala_Sapi.png"; // We will try to add logo image
    // Note: jsPDF needs image as base64 or HTMLImageElement.
    // For simplicity, we can load it from a canvas or just add text if logo fails.
    
    const loadImage = (url: string) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("Failed to load image"));
        });
    };

    const drawPDF = (logoImg?: HTMLImageElement) => {
        if (logoImg) {
            doc.addImage(logoImg, "PNG", 40, 40, 60, 60);
        }

        // Header Text
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("MAZDAFARM", 115, 55);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Jl. Bali ED 19, Komplek Jatisari Permai, Jatiasih, Kota Bekasi, Jawa Barat", 115, 68);
        doc.text("Kota Bekasi, Jawa Barat, 17426", 115, 81);
        doc.text("mazdafarmco@gmail.com", 115, 94);
        doc.text("Telp. 081553016262", 115, 107);

        // Date processing
        const dateStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
        const invoiceNo = `${orderData.id_pesanan || 'NEW'}/MZF/${new Date().getFullYear()}`;

        // Boxes
        doc.setDrawColor(200, 200, 200);
        
        // Left Box (Nota Pembelian)
        doc.setFillColor(238, 188, 177); // #eebcb1
        doc.rect(40, 140, 240, 20, "F");
        doc.rect(40, 140, 240, 70, "S");
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Nota Pembelian", 45, 153);
        doc.setFont("helvetica", "normal");
        doc.text("Nama", 45, 172); doc.text(":", 85, 172); doc.text(customerInfo.nama || "-", 95, 172);
        doc.text("Alamat", 45, 184); doc.text(":", 85, 184); doc.text(customerInfo.email || "-", 95, 184);
        doc.text("Tanggal", 45, 196); doc.text(":", 85, 196); doc.text(dateStr, 95, 196);
        doc.text("Telepon", 45, 208); doc.text(":", 85, 208); doc.text(customerInfo.no_telp || "-", 95, 208);

        // Right Box (Faktur)
        doc.rect(340, 140, 215, 55, "S");
        doc.text("FAKTUR", 345, 153); doc.text(invoiceNo, 400, 153);
        doc.text("Tanggal", 345, 165); doc.text(dateStr, 400, 165);
        doc.text("Terms", 345, 177); doc.text("-", 400, 177);
        doc.text("Tempo", 345, 189); doc.text(dateStr, 400, 189);

        // Table
        const head = [["No", "Eartag", "Jenis", "Kuantitas (kg)", "KETERANGAN", "Harga (Rp)", "Jumlah (Rp)"]];
        
        let totalBerat = 0;
        let totalHarga = 0;

        const body = cattleList.map((c, i) => {
            const berat = parseFloat(c.berat) || 0;
            const harga = parseFloat(c.harga) || 0;
            totalBerat += berat;
            totalHarga += harga;
            return [
                (i + 1).toString(),
                c.id_ternak,
                c.jenis,
                berat.toString(),
                "",
                harga.toLocaleString("id-ID"),
                harga.toLocaleString("id-ID")
            ];
        });

        // Add 2 empty rows just for styling space
        body.push(["", "", "", "", "", "", ""]);

        (doc as any).autoTable({
            startY: 220,
            head: head,
            body: body,
            theme: 'grid',
            headStyles: { fillColor: [172, 41, 37], textColor: 255, halign: 'center', fontSize: 9 }, // #ac2925
            bodyStyles: { fontSize: 8, halign: 'center' },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 70 },
                2: { cellWidth: 70 },
                3: { cellWidth: 70 },
                4: { cellWidth: 100 },
                5: { cellWidth: 80, halign: 'right' },
                6: { cellWidth: 80, halign: 'right' }
            },
            margin: { left: 40, right: 40 },
            showFoot: 'never',
            didDrawPage: function (data: any) {
                // ...
            }
        });

        const finalY = (doc as any).lastAutoTable.finalY;

        // Lain-lain, DP, Potongan, Total Row
        doc.setFillColor(238, 188, 177);
        doc.rect(40, finalY, pageWidth - 80, 15, "F");
        doc.setFont("helvetica", "normal");
        doc.text("Lain-lain", 120, finalY + 11);
        doc.text("0", pageWidth - 45, finalY + 11, { align: "right" });

        doc.setFillColor(249, 218, 95);
        doc.rect(40, finalY + 15, pageWidth - 80, 15, "F");
        doc.setFont("helvetica", "bold");
        doc.text("DP", 120, finalY + 26);
        doc.text("0", pageWidth - 45, finalY + 26, { align: "right" });

        doc.setFillColor(249, 218, 95);
        doc.rect(40, finalY + 30, pageWidth - 80, 15, "F");
        doc.text("Potongan", 120, finalY + 41);
        doc.text("0", pageWidth - 45, finalY + 41, { align: "right" });

        doc.setFillColor(172, 41, 37);
        doc.rect(40, finalY + 45, pageWidth - 80, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.text(totalBerat.toString(), 280, finalY + 56, { align: "center" });
        doc.text(totalHarga.toLocaleString("id-ID"), pageWidth - 45, finalY + 56, { align: "right" });

        // Total Invoice Block
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(200, 200, 200);
        const invY = finalY + 80;
        doc.rect(40, invY, 100, 15, "S");
        doc.rect(140, invY, 150, 15, "S");
        doc.setFontSize(9);
        doc.text("Total Invoice", 45, invY + 11);
        doc.text("Rp " + totalHarga.toLocaleString("id-ID"), 285, invY + 11, { align: "right" });

        // Terbilang
        const terbilangY = invY + 20;
        const terbilangText = terbilang(totalHarga).trim() + " Rupiah";
        doc.rect(40, terbilangY, 100, 15, "S");
        doc.rect(140, terbilangY, pageWidth - 180, 15, "S");
        doc.setFont("helvetica", "bold");
        doc.text("Terbilang", 45, terbilangY + 11);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.text(terbilangText, 145, terbilangY + 11);

        // Bank Info
        const bankY = terbilangY + 30;
        doc.setDrawColor(172, 41, 37); // Red border for bank info
        doc.rect(40, bankY, 250, 45, "S");
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Pembayaran dapat dilakukan melalui transfer ke rekening berikut:", 45, bankY + 12);
        doc.text("BSI", 45, bankY + 25); doc.text("9000606078", 120, bankY + 25);
        doc.text("a.n.", 45, bankY + 38); doc.text("PT Mazashi Semuda Farm", 120, bankY + 38);

        // Signatures
        const sigY = bankY + 40;
        doc.setFontSize(9);
        doc.text("Customer", 420, sigY);
        doc.setFont("helvetica", "bold");
        doc.text(customerInfo.nama || "-", 420, sigY + 60);

        // Footer
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(`#${invoiceNo.split('/')[0]}`, 40, doc.internal.pageSize.getHeight() - 20);
        doc.text("Page 1 of 1", pageWidth - 40, doc.internal.pageSize.getHeight() - 20, { align: "right" });

        doc.save(`Invoice_${invoiceNo.replace(/\//g, '-')}.pdf`);
    };

    loadImage(logoUrl).then((img) => drawPDF(img)).catch(() => drawPDF());
}
