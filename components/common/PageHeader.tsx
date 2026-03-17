import SafeImage from "./SafeImage";

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: string;
}

export default function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-[#126033] via-[#1a8245] to-[#22ad5c] pt-[140px] pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-black/10 mix-blend-overlay -z-1" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-6">
            {icon && (
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                <SafeImage
                  src={icon}
                  alt=""
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
            )}
            <h1 className="text-white font-black text-4xl sm:text-6xl lg:text-[72px] leading-tight tracking-tighter">
              {title}
            </h1>
          </div>
          <p className="text-white/90 text-lg lg:text-[22px] max-w-2xl font-medium leading-[1.6]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
