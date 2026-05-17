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

export function generateMazdagingInvoice(orderData: any, customerInfo: any, productsList: any[], orderItemsData: any[] = []) {
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
        
        const invoiceNo = `${orderData.id_pesanan || '0121'}/SGR/002/${new Date().getFullYear()}`;

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
        
        (doc as any).autoTable({
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
            showFoot: 'never',
            didDrawPage: function (data: any) {
                // ...
            }
        });

        const finalY = (doc as any).lastAutoTable.finalY;

        // Diskon, Total Row
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("DISKON", 120, finalY + 11);
        doc.setFont("helvetica", "normal");
        doc.text("0", pageWidth - 45, finalY + 11, { align: "right" });

        doc.setFillColor(172, 41, 37);
        doc.rect(40, finalY + 15, pageWidth - 80, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.text(totalKuantitas.toString(), 280, finalY + 26, { align: "center" });
        doc.text(totalHarga.toLocaleString("id-ID"), pageWidth - 45, finalY + 26, { align: "right" });

        // Total Invoice Block
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(200, 200, 200);
        const invY = finalY + 50;
        doc.rect(40, invY, 100, 15, "S");
        doc.rect(140, invY, 150, 15, "S");
        doc.setFontSize(9);
        doc.text("Total Invoice", 45, invY + 11);
        doc.text("Rp " + totalHarga.toLocaleString("id-ID"), 285, invY + 11, { align: "right" });

        // Terbilang
        const terbilangY = invY + 15;
        const terbilangText = terbilang(totalHarga).trim() + " Rupiah";
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
        doc.rect(40, bankY, 250, 55, "S");
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Pembayaran dapat dilakukan melalui transfer ke rekening berikut:", 45, bankY + 12);
        doc.text("BRI", 45, bankY + 25); doc.text("037901050843502", 120, bankY + 25);
        doc.text("BCA", 45, bankY + 38); doc.text("6520947343", 120, bankY + 38);
        doc.text("BSI", 45, bankY + 51); doc.setFont("helvetica", "bold"); doc.text("7303385767", 120, bankY + 51);
        doc.setFont("helvetica", "normal");
        doc.text("a.n.", 45, bankY + 64); doc.text("Shidqi Muhammad Naufal", 120, bankY + 64);

        // Signatures
        const sigY = bankY + 40;
        doc.setFontSize(9);
        doc.text("Customer", 420, sigY);
        doc.setFont("helvetica", "bold");
        doc.text(customerInfo.nama ? customerInfo.nama.toUpperCase() : "NY ASTUTI", 420, sigY + 80);

        // Footer
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(`#${invoiceNo.split('/')[0]}`, 40, doc.internal.pageSize.getHeight() - 20);
        doc.text("Page 1 of 1", pageWidth - 40, doc.internal.pageSize.getHeight() - 20, { align: "right" });

        doc.save(`Invoice_Daging_${invoiceNo.replace(/\//g, '-')}.pdf`);
    };

    loadImage(logoUrl).then((img) => drawPDF(img)).catch(() => drawPDF());
}

export function generateInvestInvoice(orderData: any, customerInfo: any, investList: any[]) {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Set base font
    doc.setFont("helvetica");

    // Logo
    const logoUrl = "/LogoMazdafarm.png";
    
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
            doc.addImage(logoImg, "PNG", 60, 40, 80, 80);
        }

        // Header Text
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(172, 41, 37); // Dark red
        doc.text("PT. MAZASHI SEMUDA FARM", 150, 60);
        
        doc.setFontSize(14);
        doc.setTextColor(59, 130, 63); // Greenish
        doc.text("Investernak - Cattle Trading - Feedlot", 150, 75);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text("Jl. Bali blok ED no.19, Kel. Jatisari, Kec. Jatiasih, Kota Bekasi", 150, 90);
        doc.text("Contact : (+62)815 5301 6262 E-mail : mazdafarmco@gmail.com", 150, 105);

        // Header Line
        doc.setLineWidth(1.5);
        doc.line(60, 115, pageWidth - 60, 115);

        // Title
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("LAPORAN HASIL INVESTERNAK", pageWidth / 2, 135, { align: "center" });

        // Introduction text
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const introText = "Assalamu'alaikum warahmatullahi wabarakatuh\n\nSegala puji dan syukur kita panjatkan ke hadirat Allah SWT atas limpahan rahmat dan karunia-Nya, sehingga pelaksanaan usaha Qurban tahun " + new Date().getFullYear() + " dapat berjalan dengan lancar dan penuh keberkahan. Alhamdulillah, pada tahun ini kami berhasil menjual hewan qurban kepada sohibul qurban. Laporan ini merupakan proyeksi dan hasil transaksi investasi ternak Anda. Seperti yang kita ketahui, berbagai tantangan di lapangan mewarnai proses pemeliharaan. Namun, dengan kerja keras dan kolaborasi bersama, seluruh proses dapat kami selesaikan dengan baik dan tuntas.";
        
        const textLines = doc.splitTextToSize(introText, pageWidth - 120);
        doc.text(textLines, 60, 155);

        const currentY = 155 + (textLines.length * 12) + 20;

        // Info Block
        // We will sum the investment total from investList. Since they selected specific packages, we take the first package's name as representation, or generic if multiple.
        const firstInvestName = investList.length > 0 ? investList[0].nama_paket : "Paket Investasi";
        const totalInvestasi = investList.reduce((sum, inv) => sum + (parseFloat(inv.harga_sapi) || 0), 0);
        const totalEstimateReturn = totalInvestasi + (totalInvestasi * 0.1); // just a placeholder formula if actual return isn't fixed

        doc.text(`Nama : ${customerInfo.nama || "-"}`, 60, currentY);
        doc.text(`Rekening : - (Silakan konfirmasi ke Admin)`, 60, currentY + 15);
        doc.setFont("helvetica", "bold");
        doc.text(firstInvestName, 60, currentY + 30);
        doc.text("Terjual ke DKM (Estimasi / Realisasi)", 60, currentY + 45);

        // Table Data
        // Based on the image: Item | Keterangan | Biaya (Rp)
        // A | Belanja sapi | <amount>
        // B | Harga Jual Sapi | <amount + profit>
        // LK | Laba Kotor (B-A) | <profit>
        // C | Pakan & Operasional Kandang | 0 (placeholder)
        // D | Obat & Vitamin | 0 (placeholder)
        // E | Fee Marketing | 0 (placeholder)
        // LB | Laba Bersih (LK-C-D-E) | <profit>
        //  | Bagi Hasil (LB*50%) | <profit/2>

        const head = [["Item", "Keterangan", "Biaya (Rp)"]];
        const body = [
            ["A", "Belanja sapi", totalInvestasi.toLocaleString("id-ID")],
            ["B", "Harga Jual Sapi", "0"],
            ["LK", "Laba Kotor (B-A)", "0"],
            ["C", "Pakan & Operasional Kandang", "0"],
            ["D", "Obat & Vitamin", "0"],
            ["E", "Fee Marketing", "0"],
            ["LB", "Laba Bersih (LK-C-D-E)", "0"],
            ["", "Bagi Hasil (LB*50%)", "0"],
        ];

        (doc as any).autoTable({
            startY: currentY + 60,
            head: head,
            body: body,
            theme: 'grid',
            headStyles: { fillColor: [255, 255, 255], textColor: 0, halign: 'center', fontSize: 10, fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 1 },
            bodyStyles: { fontSize: 10, textColor: 0, lineColor: [0, 0, 0], lineWidth: 1 },
            columnStyles: {
                0: { cellWidth: 40, halign: 'center' },
                1: { cellWidth: 260 },
                2: { cellWidth: 120, halign: 'right' }
            },
            margin: { left: 60, right: 60 },
            willDrawCell: function(data: any) {
                // Bold specific rows
                if (data.section === 'body') {
                    if (data.row.index === 2 || data.row.index === 6 || data.row.index === 7) {
                        doc.setFont("helvetica", "bold");
                    }
                }
            }
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Mengetahui,", 60, finalY);
        doc.text("Direktur Keuangan", 60, finalY + 15);
        doc.text("Direktur Utama", pageWidth - 160, finalY + 15);

        // Signatures space
        doc.text("Agung NKH", 60, finalY + 70);
        doc.text("Shidqi MN", pageWidth - 160, finalY + 70);

        const invoiceNo = `${orderData.id_pesanan || 'INV'}/IVT/${new Date().getFullYear()}`;
        doc.save(`Laporan_Invest_${invoiceNo.replace(/\//g, '-')}.pdf`);
    };

    loadImage(logoUrl).then((img) => drawPDF(img)).catch(() => drawPDF());
}
