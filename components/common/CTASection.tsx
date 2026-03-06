"use client";

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export default function CTASection({ title, description, buttonText, onButtonClick }: CTASectionProps) {
  return (
    <section className="bg-[#267d48] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center space-y-5">
        <h2 className="text-white font-bold text-3xl lg:text-[32px]">{title}</h2>
        <p className="text-white text-lg lg:text-[20px] max-w-3xl mx-auto leading-[30px]">
          {description}
        </p>
        <button
          onClick={onButtonClick}
          className="bg-white text-[#267d48] px-8 py-3 rounded-[50px] font-semibold text-base hover:bg-gray-100 transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
}
