import Image from "next/image";
import Link from "next/link";

const logo = "/images/logoPrimer 1.png";

interface NavbarProps {
  activePage?: string;
}

export default function Navbar({ activePage = "home" }: NavbarProps) {
  const navItems = [
    { href: "/", label: "Home", key: "home" },
    { href: "/mazdaging", label: "Mazdaging", key: "mazdaging" },
    { href: "/mazdafarm", label: "Mazdafarm", key: "mazdafarm" },
    { href: "/invest-qurban", label: "Invest Qurban", key: "invest-qurban" },
    { href: "/faq", label: "FAQ", key: "faq" },
    { href: "/contact", label: "Contact", key: "contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[58px]">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={logo}
              alt="PT Mazashi Semuda Farm Logo"
              width={57}
              height={57}
              className="object-contain"
              unoptimized
            />
          </Link>
          <div className="hidden md:flex items-center gap-[60px]">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`font-semibold text-[20px] transition-colors ${
                  activePage === item.key
                    ? "text-[#1a8245]"
                    : "text-black hover:text-[#1a8245]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="/login"
            className="bg-[#1a8245] text-white px-7 py-2.5 rounded-[50px] font-bold text-base hover:bg-[#22ad5c] transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
