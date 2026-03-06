import Image from "next/image";

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: string;
}

export default function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-b from-[#1a8245] to-[#22ad5c] pt-[116px] pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          {icon && (
            <Image
              src={icon}
              alt=""
              width={48}
              height={48}
              className="object-contain"
            />
          )}
          <h1 className="text-white font-bold text-4xl sm:text-5xl lg:text-[64px] leading-tight">
            {title}
          </h1>
        </div>
        <p className="text-white text-lg lg:text-[20px] max-w-3xl leading-[30px]">
          {description}
        </p>
      </div>
    </div>
  );
}
