import { Icons } from "./Icons";

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export default function CTASection({ title, description, buttonText, onButtonClick }: CTASectionProps) {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden font-primary">
      <div className="absolute inset-0 bg-[#1a8245]"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-10">
        <div className="space-y-4">
          <h2 className="text-white font-black text-4xl lg:text-6xl tracking-tighter leading-tight">
            {title}
          </h2>
          <p className="text-green-50/80 text-lg lg:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            {description}
          </p>
        </div>
        <button
          onClick={onButtonClick}
          className="group bg-white text-[#1a8245] px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center gap-4 mx-auto shadow-2xl shadow-black/20 hover:-translate-y-1 transition-all active:scale-95"
        >
          <Icons.WhatsApp className="w-6 h-6 group-hover:scale-110 transition-transform" />
          {buttonText}
        </button>
      </div>
    </section>
  );
}
