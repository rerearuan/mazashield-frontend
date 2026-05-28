import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

function drawLunasStamp(doc: jsPDF, x: number, y: number) {
    // Save style
    const prevColor = doc.getTextColor();
    const prevDraw = doc.getDrawColor();
    const prevLineWidth = doc.getLineWidth();
    
    // Set stamp style
    doc.setDrawColor(220, 38, 38); // Red
    doc.setTextColor(220, 38, 38);
    
    // Outer border
    doc.setLineWidth(2.5);
    doc.rect(x, y, 100, 35, "S");
    
    // Inner border
    doc.setLineWidth(0.8);
    doc.rect(x + 3, y + 3, 94, 29, "S");
    
    // Text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("LUNAS", x + 50, y + 22, { align: "center" });
    
    // Restore style
    doc.setTextColor(prevColor);
    doc.setDrawColor(prevDraw);
    doc.setLineWidth(prevLineWidth);
}

export function generateMazdafarmInvoice(orderData: any, customerInfo: any, cattleList: any[], signatureImage?: string) {
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
        const invoiceNo = orderData.id_pesanan || `NEW/MZF/${new Date().getFullYear()}`;

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

        autoTable(doc, {
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
            showFoot: 'never'
        });

        const finalY = (doc as any).lastAutoTable.finalY;
        const ongkir = parseFloat(orderData.ongkir) || 0;

        // Lain-lain / Ongkir, DP, Potongan, Total Row
        doc.setFillColor(238, 188, 177);
        doc.rect(40, finalY, pageWidth - 80, 15, "F");
        doc.setFont("helvetica", "normal");
        doc.text("Ongkos Kirim", 120, finalY + 11);
        doc.text(ongkir.toLocaleString("id-ID"), pageWidth - 45, finalY + 11, { align: "right" });

        doc.setFillColor(249, 218, 95);
        doc.rect(40, finalY + 15, pageWidth - 80, 15, "F");
        doc.setFont("helvetica", "bold");
        doc.text("DP", 120, finalY + 26);
        doc.text("0", pageWidth - 45, finalY + 26, { align: "right" });

        doc.setFillColor(249, 218, 95);
        doc.rect(40, finalY + 30, pageWidth - 80, 15, "F");
        doc.text("Potongan", 120, finalY + 41);
        doc.text("0", pageWidth - 45, finalY + 41, { align: "right" });

        const grandTotal = totalHarga + ongkir;

        doc.setFillColor(172, 41, 37);
        doc.rect(40, finalY + 45, pageWidth - 80, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.text(totalBerat.toString(), 280, finalY + 56, { align: "center" });
        doc.text(grandTotal.toLocaleString("id-ID"), pageWidth - 45, finalY + 56, { align: "right" });

        // Total Invoice Block
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(200, 200, 200);
        const invY = finalY + 80;
        doc.rect(40, invY, 100, 15, "S");
        doc.rect(140, invY, 150, 15, "S");
        doc.setFontSize(9);
        doc.text("Total Invoice", 45, invY + 11);
        doc.text("Rp " + grandTotal.toLocaleString("id-ID"), 285, invY + 11, { align: "right" });

        // Terbilang
        const terbilangY = invY + 20;
        const terbilangText = terbilang(grandTotal).trim() + " Rupiah";
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
        doc.rect(40, bankY, 280, 50, "S");
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Pembayaran dapat dilakukan melalui transfer ke rekening berikut:", 45, bankY + 12);
        doc.text("BSI", 45, bankY + 25); doc.text("9000 6060 78", 120, bankY + 25);
        doc.text("a.n.", 45, bankY + 38); doc.text("PT Mazashi Semuda Farm", 120, bankY + 38);

        // Signatures
        const sigY = bankY + 20;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Hormat Kami,", 340, sigY);
        doc.text("PT MAZASHI SEMUDA FARM", 340, sigY + 12);
        
        if (signatureImage) {
            try {
                doc.addImage(signatureImage, "PNG", 340, sigY + 16, 90, 45);
            } catch (err) {
                console.error("Failed to render signature image", err);
            }
        }
        
        doc.text("Authorized Signatory", 340, sigY + 70);

        doc.text("Customer", 480, sigY);
        doc.setFont("helvetica", "bold");
        doc.text(customerInfo.nama || "-", 480, sigY + 70);

        // LUNAS Stamp
        if (orderData.status_pesanan === "Completed") {
            drawLunasStamp(doc, 210, sigY + 15);
        }

        // Footer
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(`#${invoiceNo.split('/')[0]}`, 40, doc.internal.pageSize.getHeight() - 20);
        doc.text("Page 1 of 1", pageWidth - 40, doc.internal.pageSize.getHeight() - 20, { align: "right" });

        doc.save(`Invoice_${invoiceNo.replace(/\//g, '-')}.pdf`);
    };

    loadImage(logoUrl).then((img) => drawPDF(img)).catch(() => drawPDF());
}

export function generateMazdagingInvoice(orderData: any, customerInfo: any, productsList: any[], orderItemsData: any[] = [], signatureImage?: string) {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Set base font
    doc.setFont("helvetica");

    // Logo
    const logoUrl = "/Daging.png"; 
    
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
        doc.text("MAZDAGING", 115, 55);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Jl. Bali ED 19, Komplek Jatisari Permai, Jatiasih, Kota Bekasi, Jawa Barat", 115, 68);
        doc.text("Kota Bekasi, Jawa Barat, 17426", 115, 81);
        doc.text("mazdaging99@gmail.com", 115, 94);
        doc.text("Telp. 085819051216", 115, 107);

        // Date processing
        // The image shows date format "17 February 2026" and delivery "17 February 2026 12:00:00"
        const dateObj = new Date();
        const dateStr = dateObj.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
        const timeStr = dateObj.toLocaleTimeString("en-GB", { hour: '2-digit', minute:'2-digit', second:'2-digit' });
        const tomorrow = new Date(dateObj);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tempoStr = tomorrow.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
        
        const invoiceNo = orderData.id_pesanan || `0121/SGR/${new Date().getFullYear()}`;

        // Boxes
        doc.setDrawColor(200, 200, 200);
        
        // Left Box (Nota Pembelian)
        doc.setFillColor(244, 204, 176); // #f4ccb0
        doc.rect(40, 140, 240, 20, "F");
        doc.rect(40, 140, 240, 70, "S");
        doc.setFillColor(248, 222, 200); // Lighter for body
        doc.rect(40, 160, 240, 50, "F");
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Nota Pembelian", 45, 153);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("Nama", 45, 172); doc.text(":", 85, 172); doc.text(customerInfo.nama || "-", 95, 172);
        doc.text("Alamat", 45, 184); doc.text(":", 85, 184); doc.text(customerInfo.email || "-", 95, 184); // using email as address for now
        doc.text("Delivery", 45, 196); doc.text(":", 85, 196); doc.text(`${dateStr} ${timeStr}`, 95, 196);
        doc.text("Telepon", 45, 208); doc.text(":", 85, 208); doc.text(customerInfo.no_telp || "-", 95, 208);

        // Right Box (Faktur)
        doc.setFillColor(248, 222, 200);
        doc.rect(340, 140, 215, 55, "F");
        doc.rect(340, 140, 215, 55, "S");
        doc.text("FAKTUR", 345, 153); doc.text(invoiceNo, 400, 153);
        doc.text("Tanggal", 345, 165); doc.text(dateStr, 400, 165);
        doc.text("Tempo", 345, 177); doc.text(tempoStr, 400, 177);
        doc.text("Terms", 345, 189); doc.text("-", 400, 189);

        // Table
        const head = [["No", "Produk", "Jenis", "Kuantitas (kg)", "KETERANGAN", "Harga (Rp)", "Jumlah (Rp)"]];
        
        let totalKuantitas = 0;
        let totalHarga = 0;

        const body = productsList.map((p, i) => {
            // Find order item if provided to get correct quantity, else default to 1
            const oi = orderItemsData.find((item: any) => item.daging === p.id_daging || item.daging?.id_daging === p.id_daging);
            const qty = oi ? parseFloat(oi.kuantitas_kg) : 1;
            const hargaPerKg = parseFloat(p.harga_per_kg) || 0;
            const subtotal = qty * hargaPerKg;
            
            totalKuantitas += qty;
            totalHarga += subtotal;
            return [
                (i + 1).toString(),
                p.nama, // "DAGING" or product name
                p.bagian, // "RENDANG" or product type
                qty.toString(),
                "",
                hargaPerKg.toLocaleString("id-ID"),
                subtotal.toLocaleString("id-ID")
            ];
        });

        // Add 2 empty rows just for styling space
        body.push(["", "", "", "", "", "", ""]);
        
        autoTable(doc, {
            startY: 220,
            head: head,
            body: body,
            theme: 'grid',
            headStyles: { fillColor: [172, 41, 37], textColor: 255, halign: 'center', fontSize: 9 }, // #ac2925
            bodyStyles: { fontSize: 8, halign: 'center' },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 90 },
                2: { cellWidth: 70 },
                3: { cellWidth: 70 },
                4: { cellWidth: 90 },
                5: { cellWidth: 80, halign: 'right' },
                6: { cellWidth: 85, halign: 'right' }
            },
            margin: { left: 40, right: 40 },
            showFoot: 'never'
        });

        const finalY = (doc as any).lastAutoTable.finalY;
        const ongkir = parseFloat(orderData.ongkir) || 0;

        // Diskon, Ongkir, Total Row
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("DISKON", 120, finalY + 11);
        doc.setFont("helvetica", "normal");
        doc.text("0", pageWidth - 45, finalY + 11, { align: "right" });

        doc.setFont("helvetica", "bold");
        doc.text("ONGKOS KIRIM", 120, finalY + 26);
        doc.setFont("helvetica", "normal");
        doc.text(ongkir.toLocaleString("id-ID"), pageWidth - 45, finalY + 26, { align: "right" });

        const grandTotal = totalHarga + ongkir;

        doc.setFillColor(172, 41, 37);
        doc.rect(40, finalY + 30, pageWidth - 80, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.text(totalKuantitas.toString(), 280, finalY + 41, { align: "center" });
        doc.text(grandTotal.toLocaleString("id-ID"), pageWidth - 45, finalY + 41, { align: "right" });

        // Total Invoice Block
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(200, 200, 200);
        const invY = finalY + 65;
        doc.rect(40, invY, 100, 15, "S");
        doc.rect(140, invY, 150, 15, "S");
        doc.setFontSize(9);
        doc.text("Total Invoice", 45, invY + 11);
        doc.text("Rp " + grandTotal.toLocaleString("id-ID"), 285, invY + 11, { align: "right" });

        // Terbilang
        const terbilangY = invY + 15;
        const terbilangText = terbilang(grandTotal).trim() + " Rupiah";
        doc.rect(40, terbilangY, 100, 15, "S");
        doc.rect(140, terbilangY, pageWidth - 180, 15, "S");
        doc.setFont("helvetica", "bold");
        doc.text("Terbilang", 45, terbilangY + 11);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.text(terbilangText, 145, terbilangY + 11);

        // Notes
        const notesY = terbilangY + 30;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Notes:", 45, notesY);

        // Bank Info
        const bankY = notesY + 20;
        doc.setDrawColor(172, 41, 37); // Red border
        doc.rect(40, bankY, 280, 75, "S");
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Pembayaran dapat dilakukan melalui transfer ke rekening berikut:", 45, bankY + 12);
        doc.text("BRI", 45, bankY + 25); doc.text("037901050843502", 120, bankY + 25);
        doc.text("BCA", 45, bankY + 38); doc.text("6520947343", 120, bankY + 38);
        doc.text("BSI", 45, bankY + 51); doc.setFont("helvetica", "bold"); doc.text("9000 6060 78", 120, bankY + 51);
        doc.setFont("helvetica", "normal");
        doc.text("a.n.", 45, bankY + 64); doc.text("PT Mazashi Semuda Farm", 120, bankY + 64);

        // Signatures
        const sigY = bankY + 20;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Hormat Kami,", 340, sigY);
        doc.text("PT MAZASHI SEMUDA FARM", 340, sigY + 12);
        
        if (signatureImage) {
            try {
                doc.addImage(signatureImage, "PNG", 340, sigY + 16, 90, 45);
            } catch (err) {
                console.error("Failed to render signature image", err);
            }
        }
        
        doc.text("Authorized Signatory", 340, sigY + 70);

        doc.text("Customer", 480, sigY);
        doc.setFont("helvetica", "bold");
        doc.text(customerInfo.nama ? customerInfo.nama.toUpperCase() : "NY ASTUTI", 480, sigY + 70);

        // LUNAS Stamp
        if (orderData.status_pesanan === "Completed") {
            drawLunasStamp(doc, 210, sigY + 15);
        }

        // Footer
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(`#${invoiceNo.split('/')[0]}`, 40, doc.internal.pageSize.getHeight() - 20);
        doc.text("Page 1 of 1", pageWidth - 40, doc.internal.pageSize.getHeight() - 20, { align: "right" });

        doc.save(`Invoice_Daging_${invoiceNo.replace(/\//g, '-')}.pdf`);
    };

    loadImage(logoUrl).then((img) => drawPDF(img)).catch(() => drawPDF());
}

export function generateInvestInvoice(orderData: any, customerInfo: any, investList: any[], signatureImage?: string) {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Set base font
    doc.setFont("helvetica");

    // Logo
    const logoUrl = "/Kepala_Sapi.png";
    
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
        doc.text("PT. MAZASHI SEMUDA FARM (INVEST TERNAK)", 115, 55);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Jl. Bali ED 19, Komplek Jatisari Permai, Jatiasih, Kota Bekasi, Jawa Barat", 115, 68);
        doc.text("Kota Bekasi, Jawa Barat, 17426", 115, 81);
        doc.text("mazdafarmco@gmail.com", 115, 94);
        doc.text("Telp. 081553016262", 115, 107);

        // Date processing
        const dateStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
        const invoiceNo = orderData.id_pesanan || `NEW/INV/${new Date().getFullYear()}`;

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
        const head = [["No", "ID Paket", "Paket Investasi", "Durasi (hari)", "ROI (%)", "Modal (Rp)", "Total (Rp)"]];
        
        let totalHarga = 0;

        const body = investList.map((inv, i) => {
            const price = parseFloat(inv.harga_sapi) || 0;
            totalHarga += price;
            return [
                (i + 1).toString(),
                inv.id_invest,
                inv.nama_paket,
                `${inv.durasi_hari} hari`,
                `${inv.roi_persen}%`,
                price.toLocaleString("id-ID"),
                price.toLocaleString("id-ID")
            ];
        });

        // Add 2 empty rows just for styling space
        body.push(["", "", "", "", "", "", ""]);

        autoTable(doc, {
            startY: 220,
            head: head,
            body: body,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 63], textColor: 255, halign: 'center', fontSize: 9 }, // invest theme uses green head [59, 130, 63]
            bodyStyles: { fontSize: 8, halign: 'center' },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 70 },
                2: { cellWidth: 150, halign: 'left' },
                3: { cellWidth: 70 },
                4: { cellWidth: 50 },
                5: { cellWidth: 80, halign: 'right' },
                6: { cellWidth: 80, halign: 'right' }
            },
            margin: { left: 40, right: 40 },
            showFoot: 'never'
        });

        const finalY = (doc as any).lastAutoTable.finalY;

        // Diskon, Total Row
        doc.setFillColor(238, 188, 177);
        doc.rect(40, finalY, pageWidth - 80, 15, "F");
        doc.setFont("helvetica", "normal");
        doc.text("Diskon", 120, finalY + 11);
        doc.text("0", pageWidth - 45, finalY + 11, { align: "right" });

        const grandTotal = totalHarga;

        doc.setFillColor(172, 41, 37);
        doc.rect(40, finalY + 15, pageWidth - 80, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("Total Modal Investasi", 120, finalY + 26);
        doc.text(grandTotal.toLocaleString("id-ID"), pageWidth - 45, finalY + 26, { align: "right" });

        // Total Invoice Block
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(200, 200, 200);
        const invY = finalY + 50;
        doc.rect(40, invY, 100, 15, "S");
        doc.rect(140, invY, 150, 15, "S");
        doc.setFontSize(9);
        doc.text("Total Invoice", 45, invY + 11);
        doc.text("Rp " + grandTotal.toLocaleString("id-ID"), 285, invY + 11, { align: "right" });

        // Terbilang
        const terbilangY = invY + 20;
        const terbilangText = terbilang(grandTotal).trim() + " Rupiah";
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
        doc.rect(40, bankY, 280, 50, "S");
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Pembayaran dapat dilakukan melalui transfer ke rekening berikut:", 45, bankY + 12);
        doc.text("BSI", 45, bankY + 25); doc.text("9000 6060 78", 120, bankY + 25);
        doc.text("a.n.", 45, bankY + 38); doc.text("PT Mazashi Semuda Farm", 120, bankY + 38);

        // Signatures
        const sigY = bankY + 20;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Hormat Kami,", 340, sigY);
        doc.text("PT MAZASHI SEMUDA FARM", 340, sigY + 12);
        
        if (signatureImage) {
            try {
                doc.addImage(signatureImage, "PNG", 340, sigY + 16, 90, 45);
            } catch (err) {
                console.error("Failed to render signature image", err);
            }
        }
        
        doc.text("Authorized Signatory", 340, sigY + 70);

        doc.text("Customer", 480, sigY);
        doc.setFont("helvetica", "bold");
        doc.text(customerInfo.nama || "-", 480, sigY + 70);

        // LUNAS Stamp
        if (orderData.status_pesanan === "Completed") {
            drawLunasStamp(doc, 210, sigY + 15);
        }

        // Footer
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(`#${invoiceNo.split('/')[0]}`, 40, doc.internal.pageSize.getHeight() - 20);
        doc.text("Page 1 of 1", pageWidth - 40, doc.internal.pageSize.getHeight() - 20, { align: "right" });

        doc.save(`Invoice_Invest_${invoiceNo.replace(/\//g, '-')}.pdf`);
    };

    loadImage(logoUrl).then((img) => drawPDF(img)).catch(() => drawPDF());
}

export function generateInvestReportPDF(laporan: any, customerInfo: any) {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFont("helvetica");

    const logoUrl = "/Kepala_Sapi.png";

    const loadImage = (url: string) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("Failed to load image"));
        });
    };

    const drawPDF = (logoImg?: HTMLImageElement) => {
        // Logo
        if (logoImg) {
            doc.addImage(logoImg, "PNG", 60, 40, 48, 48);
        }

        const startX = logoImg ? 120 : 60;

        // Header Text
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(26, 130, 69); // Premium Forest Green (#1a8245)
        doc.text("PT. MAZASHI SEMUDA FARM", startX, 54);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(71, 85, 105); // Slate-600
        doc.text("Investernak - Perdagangan & Penggemukan Sapi", startX, 68);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139); // Slate-500
        doc.text("Jl. Bali ED 19, Komplek Jatisari Permai, Jatiasih, Kota Bekasi, Jawa Barat", startX, 81);
        doc.text("Contact : 0815-5301-6262 | E-mail : mazdafarmco@gmail.com", startX, 93);

        // Elegant double header rule
        doc.setDrawColor(26, 130, 69); // Premium Green
        doc.setLineWidth(2.5);
        doc.line(60, 106, pageWidth - 60, 106);

        doc.setDrawColor(251, 191, 36); // Amber/Gold (#fbbf24)
        doc.setLineWidth(1);
        doc.line(60, 110, pageWidth - 60, 110);

        // Title
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59); // Slate-800
        doc.text("LAPORAN PERKEMBANGAN & ESTIMASI HASIL INVESTASI", pageWidth / 2, 134, { align: "center" });

        // Customer Info Box (rounded rect)
        doc.setFillColor(248, 250, 252); // #f8fafc
        doc.setDrawColor(226, 232, 240); // #e2e8f0
        doc.setLineWidth(0.75);
        doc.roundedRect(60, 150, pageWidth - 120, 60, 8, 8, "FD");

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(26, 130, 69);
        doc.text("INFORMASI CUSTOMER", 75, 166);


        doc.setFont("helvetica", "normal");
        doc.setTextColor(51, 65, 85); // Slate-700
        doc.text(`Nama Customer : ${customerInfo?.nama || "-"}`, 75, 181);
        doc.text(`Email : ${customerInfo?.email || "-"}`, 75, 194);

        doc.text(`ID Pesanan : #${laporan.id_pesanan}`, 340, 181);
        doc.text("Status : ", 340, 194);

        // Badge drawing logic
        const statusText = laporan.status_pesanan || "-";
        const statusX = 378;
        const statusY = 186;
        let badgeBg = [219, 234, 254]; // Completed (Blue badge)
        let badgeText = [30, 58, 138];
        if (statusText === "Processed") {
            badgeBg = [254, 243, 199]; // Amber badge
            badgeText = [120, 53, 4];
        } else if (statusText === "Cancelled") {
            badgeBg = [254, 226, 226]; // Red badge
            badgeText = [127, 29, 29];
        }

        // Measure text width
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        const statusWidth = doc.getTextWidth(statusText);

        // Draw badge background
        doc.setFillColor(badgeBg[0], badgeBg[1], badgeBg[2]);
        doc.roundedRect(statusX, statusY, statusWidth + 12, 11, 3, 3, "F");

        // Draw badge text
        doc.setTextColor(badgeText[0], badgeText[1], badgeText[2]);
        doc.text(statusText, statusX + 6, statusY + 8);

        // Reset text color for body
        doc.setTextColor(30, 41, 59);

        // Package Details
        let currentY = 228;
        if (laporan.info_invest && laporan.info_invest.length > 0) {
            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(30, 41, 59);
            doc.text("DETAIL PAKET INVESTASI", 60, currentY);
            currentY += 8;

            const pkgHead = [["Nama Paket", "Berat Awal", "Durasi Kontrak", "Modal Investasi (Harga Beli)"]];
            const pkgBody = laporan.info_invest.map((inv: any) => [
                inv.nama,
                inv.berat_awal ? `${Number(inv.berat_awal).toLocaleString("id-ID")} kg` : "—",
                `${inv.durasi_hari} hari`,
                inv.harga_beli ? "Rp " + Math.round(inv.harga_beli).toLocaleString("id-ID") : "—"
            ]);

            autoTable(doc, {
                startY: currentY,
                head: pkgHead,
                body: pkgBody,
                theme: 'grid',
                headStyles: { 
                    fillColor: [26, 130, 69], 
                    textColor: 255, 
                    halign: 'center', 
                    fontSize: 8, 
                    fontStyle: 'bold' 
                },
                bodyStyles: { 
                    fontSize: 8, 
                    halign: 'center',
                    textColor: [51, 65, 85]
                },
                styles: {
                    lineColor: [226, 232, 240],
                    lineWidth: 0.5
                },
                columnStyles: {
                    0: { cellWidth: 130 },
                    1: { cellWidth: 90, halign: 'center' },
                    2: { cellWidth: 90, halign: 'center' },
                    3: { cellWidth: 160, halign: 'right' }
                },
                margin: { left: 60, right: 60 }
            });
            currentY = (doc as any).lastAutoTable.finalY + 20;
        }

        // Weight logs history
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text("HISTORI PERKEMBANGAN BERAT & ESTIMASI HARGA JUAL", 60, currentY);
        currentY += 8;

        const histHead = [["No", "Tanggal Input", "Berat Ternak", "Harga / kg", "Estimasi Nilai Jual", "Catatan Keterangan"]];
        const histBody = (laporan.histori_berat || []).map((h: any, idx: number) => [
            (idx + 1).toString(),
            h.tanggal_input,
            h.berat_kg + " kg",
            h.harga_per_kg ? "Rp " + Math.round(h.harga_per_kg).toLocaleString("id-ID") : "—",
            h.estimasi_harga_jual ? "Rp " + Math.round(h.estimasi_harga_jual).toLocaleString("id-ID") : "—",
            h.keterangan || "—"
        ]);

        if (histBody.length === 0) {
            histBody.push(["-", "-", "-", "-", "-", "Belum ada log penimbangan berat"]);
        }

        autoTable(doc, {
            startY: currentY,
            head: histHead,
            body: histBody,
            theme: 'grid',
            headStyles: { 
                fillColor: [26, 130, 69], 
                textColor: 255, 
                halign: 'center', 
                fontSize: 8, 
                fontStyle: 'bold' 
            },
            bodyStyles: { 
                fontSize: 8, 
                halign: 'center',
                textColor: [51, 65, 85]
            },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 75 },
                2: { cellWidth: 70 },
                3: { cellWidth: 80, halign: 'right' },
                4: { cellWidth: 100, halign: 'right' },
                5: { cellWidth: 120, halign: 'left' }
            },
            styles: {
                lineColor: [226, 232, 240],
                lineWidth: 0.5
            },
            margin: { left: 60, right: 60 }
        });
        currentY = (doc as any).lastAutoTable.finalY + 20;

        // Final calculations (Completed only)
        if (laporan.status_pesanan === "Completed" && laporan.harga_jual_aktual != null) {
            if (currentY > 580) {
                doc.addPage();
                currentY = 40;
            }

            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(30, 41, 59);
            doc.text("PERHITUNGAN AKHIR BAGI HASIL INVESTASI", 60, currentY);
            currentY += 8;

            const A = Number(laporan.harga_beli || 0);
            const B = Number(laporan.harga_jual_aktual || 0);
            const LK = Number(laporan.laba_kotor || 0);
            const C = Number(laporan.biaya_pakan || 0) + Number(laporan.biaya_operasional || 0);
            const D = Number(laporan.biaya_obat_vitamin || 0);
            const E = Number(laporan.fee_marketing || 0);
            const LB = Number(laporan.laba_bersih || 0);
            const BH = Number(laporan.bagi_hasil_investor || 0);

            const calcHead = [["Item", "Keterangan Pos Biaya", "Jumlah Nilai (Rp)"]];
            const calcBody = [
                ["A", "Belanja Sapi (Modal Awal)", "Rp " + Math.round(A).toLocaleString("id-ID")],
                ["B", "Harga Jual Sapi Aktual", "Rp " + Math.round(B).toLocaleString("id-ID")],
                ["LK", "Laba Kotor (B - A)", "Rp " + Math.round(LK).toLocaleString("id-ID")],
                ["C", "Pakan & Operasional Kandang", "Rp " + Math.round(C).toLocaleString("id-ID")],
                ["D", "Obat & Vitamin", "Rp " + Math.round(D).toLocaleString("id-ID")],
                ["E", "Fee Marketing", "Rp " + Math.round(E).toLocaleString("id-ID")],
                ["LB", "Laba Bersih (LK - C - D - E)", "Rp " + Math.round(LB).toLocaleString("id-ID")],
                ["BH", "Bagi Hasil Investor (LB * 50%)", "Rp " + Math.round(BH).toLocaleString("id-ID")],
            ];

            autoTable(doc, {
                startY: currentY,
                head: calcHead,
                body: calcBody,
                theme: 'grid',
                headStyles: { 
                    fillColor: [30, 41, 59], 
                    textColor: 255, 
                    halign: 'center', 
                    fontSize: 8, 
                    fontStyle: 'bold' 
                },
                bodyStyles: { 
                    fontSize: 8,
                    textColor: [51, 65, 85]
                },
                columnStyles: {
                    0: { cellWidth: 40, halign: 'center', fontStyle: 'bold', textColor: [26, 130, 69] },
                    1: { cellWidth: 275 },
                    2: { cellWidth: 160, halign: 'right', fontStyle: 'bold', textColor: [30, 41, 59] }
                },
                styles: {
                    lineColor: [226, 232, 240],
                    lineWidth: 0.5
                },
                margin: { left: 60, right: 60 },
                willDrawCell: function(data: any) {
                    if (data.section === 'body') {
                        if (data.row.index === 2 || data.row.index === 6 || data.row.index === 7) {
                            doc.setFont("helvetica", "bold");
                            if (data.row.index === 7) {
                                data.cell.styles.fillColor = [240, 253, 244]; // Soft emerald highlight
                                data.cell.styles.textColor = [26, 130, 69]; // Forest green text
                            }
                        }
                    }
                }
            });
            currentY = (doc as any).lastAutoTable.finalY + 25;
        }

        // Signatures block
        if (currentY > 660) {
            doc.addPage();
            currentY = 40;
        }

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139); // Slate-500
        doc.text("Mengetahui,", 60, currentY);
        
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59); // Slate-800
        doc.text("Direktur Keuangan", 60, currentY + 15);
        doc.text("Direktur Utama", pageWidth - 160, currentY + 15);

        // Signatures divider line
        doc.setDrawColor(203, 213, 225); // Slate-300
        doc.setLineWidth(0.5);
        doc.line(60, currentY + 60, 160, currentY + 60);
        doc.line(pageWidth - 160, currentY + 60, pageWidth - 60, currentY + 60);

        doc.setFont("helvetica", "bold");
        doc.text("Agung NKH", 60, currentY + 72);
        doc.text("Shidqi MN, S.Pt., M.Si", pageWidth - 160, currentY + 72);

        doc.save(`Laporan_Hasil_Invest_${laporan.id_pesanan.replace(/\//g, '-')}.pdf`);
    };

    loadImage(logoUrl).then((img) => drawPDF(img)).catch(() => drawPDF());
}

export function generateCustomerInvestmentsPDF(customerName: string, orders: any[]) {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFont("helvetica");

    const logoUrl = "/Kepala_Sapi.png";

    const loadImage = (url: string) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("Failed to load image"));
        });
    };

    const drawPDF = (logoImg?: HTMLImageElement) => {
        // Logo
        if (logoImg) {
            doc.addImage(logoImg, "PNG", 60, 40, 48, 48);
        }

        const startX = logoImg ? 120 : 60;

        // Header Text
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(26, 130, 69); // Premium Forest Green (#1a8245)
        doc.text("PT. MAZASHI SEMUDA FARM", startX, 54);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(71, 85, 105); // Slate-600
        doc.text("Investernak - Perdagangan & Penggemukan Sapi", startX, 68);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139); // Slate-500
        doc.text("Jl. Bali ED 19, Komplek Jatisari Permai, Jatiasih, Kota Bekasi, Jawa Barat", startX, 81);
        doc.text("Contact : 0815-5301-6262 | E-mail : mazdafarmco@gmail.com", startX, 93);

        // Elegant double header rule
        doc.setDrawColor(26, 130, 69); // Premium Green
        doc.setLineWidth(2.5);
        doc.line(60, 106, pageWidth - 60, 106);

        doc.setDrawColor(251, 191, 36); // Amber/Gold (#fbbf24)
        doc.setLineWidth(1);
        doc.line(60, 110, pageWidth - 60, 110);

        // Title
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59); // Slate-800
        doc.text("LAPORAN KONSOLIDASI INVESTASI CUSTOMER", pageWidth / 2, 134, { align: "center" });

        // Customer Info Box (rounded rect)
        doc.setFillColor(248, 250, 252); // #f8fafc
        doc.setDrawColor(226, 232, 240); // #e2e8f0
        doc.setLineWidth(0.75);
        doc.roundedRect(60, 150, pageWidth - 120, 60, 8, 8, "FD");

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(26, 130, 69);
        doc.text("INFORMASI PORTFOLIO CUSTOMER", 75, 166);


        doc.setFont("helvetica", "normal");
        doc.setTextColor(51, 65, 85); // Slate-700
        doc.text(`Nama Customer : ${customerName}`, 75, 181);
        doc.text(`Total Pesanan   : ${orders.length} Transaksi`, 75, 194);

        doc.text(`Tanggal Cetak   : ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`, 340, 181);
        doc.text("Status Cetak    : Dokumen Sah Hasil Investasi", 340, 194);

        let currentY = 228;

        const head = [["No", "ID Pesanan", "Paket Investasi", "Status", "Tagihan (Rp)", "Sudah Dibayar (Rp)", "Tanggal Pemesanan"]];
        const body = orders.map((o, i) => {
            const paketName = o.daftar_invest?.map((d: any) => d.nama_paket).join(", ") || o.items?.map((d: any) => d.invest?.nama_paket).join(", ") || "—";
            return [
                (i + 1).toString(),
                o.id_pesanan,
                paketName,
                o.status_pesanan,
                o.tagihan ? "Rp " + Math.round(o.tagihan).toLocaleString("id-ID") : "—",
                o.sudah_dibayar ? "Rp " + Math.round(o.sudah_dibayar).toLocaleString("id-ID") : "—",
                o.created_at?.slice(0, 10) || "—"
            ];
        });

        autoTable(doc, {
            startY: currentY,
            head: head,
            body: body,
            theme: 'grid',
            headStyles: { 
                fillColor: [26, 130, 69], 
                textColor: 255, 
                halign: 'center', 
                fontSize: 8, 
                fontStyle: 'bold' 
            },
            bodyStyles: { 
                fontSize: 8, 
                halign: 'center',
                textColor: [51, 65, 85]
            },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 70 },
                2: { cellWidth: 115, halign: 'left' },
                3: { cellWidth: 55, fontStyle: 'bold' },
                4: { cellWidth: 75, halign: 'right' },
                5: { cellWidth: 75, halign: 'right' },
                6: { cellWidth: 55 }
            },
            styles: {
                lineColor: [226, 232, 240],
                lineWidth: 0.5
            },
            margin: { left: 60, right: 60 },
            willDrawCell: function(data: any) {
                if (data.section === 'body' && data.column.index === 3) {
                    const statusText = data.cell.text[0];
                    if (statusText === "Completed") {
                        data.cell.styles.textColor = [26, 130, 69]; // bold green
                    } else if (statusText === "Processed") {
                        data.cell.styles.textColor = [180, 83, 9]; // bold amber
                    } else if (statusText === "Cancelled") {
                        data.cell.styles.textColor = [185, 28, 28]; // bold red
                    }
                }
            }
        });

        currentY = (doc as any).lastAutoTable.finalY + 30;

        if (currentY > 660) {
            doc.addPage();
            currentY = 40;
        }

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139); // Slate-500
        doc.text("Mengetahui,", 60, currentY);
        
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59); // Slate-800
        doc.text("Direktur Keuangan", 60, currentY + 15);
        doc.text("Direktur Utama", pageWidth - 160, currentY + 15);

        // Signatures divider line
        doc.setDrawColor(203, 213, 225); // Slate-300
        doc.setLineWidth(0.5);
        doc.line(60, currentY + 60, 160, currentY + 60);
        doc.line(pageWidth - 160, currentY + 60, pageWidth - 60, currentY + 60);

        doc.setFont("helvetica", "bold");
        doc.text("Agung NKH", 60, currentY + 72);
        doc.text("Shidqi MN, S.Pt., M.Si", pageWidth - 160, currentY + 72);

        doc.save(`Laporan_Invest_Customer_${customerName.replace(/\s+/g, '_')}.pdf`);
    };

    loadImage(logoUrl).then((img) => drawPDF(img)).catch(() => drawPDF());
}
