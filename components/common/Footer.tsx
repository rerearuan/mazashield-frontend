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
            <div className="space-y-3 text-[#07260e] text-base opacity-80">
              <div className="flex items-center gap-2">
                <Image
                  src="http://localhost:3845/assets/45e4af6ea2c65bf0a51b9ee3249273f57227b9ed.svg"
                  alt="Phone"
                  width={22}
                  height={22}
                />
                <span>+62 822-3054-9634</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="http://localhost:3845/assets/16d34c06888333b15db5a099603cf7a98cef842d.svg"
                  alt="Email"
                  width={22}
                  height={22}
                />
                <span>support@nawasenaexport.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="http://localhost:3845/assets/16d34c06888333b15db5a099603cf7a98cef842d.svg"
                  alt="Email"
                  width={22}
                  height={22}
                />
                <span>ptnawasenaamertaekspora@gmail.com</span>
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
