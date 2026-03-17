"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";
import { DEFAULT_COW_IMAGE } from "@/lib/image-utils";

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined;
  fallbackSrc?: string;
}

export default function SafeImage({ 
  src, 
  fallbackSrc = DEFAULT_COW_IMAGE, 
  alt, 
  ...props 
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setErrorCount(0);
  }, [src, fallbackSrc]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (errorCount < 2) { // Prevent infinite loops
          setImgSrc(fallbackSrc);
          setErrorCount(prev => prev + 1);
        }
      }}
    />
  );
}
