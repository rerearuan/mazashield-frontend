import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#fffbed] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <h4 className="text-[#07260e] font-semibold text-2xl">PT. MAZASHI SEMUDA FARM</h4>
            <p className="text-[#07260e] text-base opacity-80">
              Peternakan modern yang menghadirkan produk berkualitas untuk masa depan yang lebih baik.
            </p>
          </div>
          <div className="space-y-4">
            <h5 className="text-[#07260e] font-bold text-xl">Company</h5>
            <ul className="space-y-3 text-[#07260e] text-base opacity-80">
              <li>
                <Link href="/" className="hover:opacity-100 transition-opacity">
                  About
                </Link>
              </li>
              <li>
                <Link href="/mazdaging" className="hover:opacity-100 transition-opacity">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:opacity-100 transition-opacity">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-[#07260e] font-bold text-xl">Contact</h5>
            <div className="space-y-4 text-gray-500 font-medium text-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#1a8245]/10 flex items-center justify-center text-[#1a8245]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <span>+62 822-3054-9634</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <span>support@mazashi.farm</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-[#07260e]/20 pt-8">
          <p className="text-[#07260e] text-xs">
            Copyright © 2025 PT. MAZASHI SEMUDA FARM. All Right Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
