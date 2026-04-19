"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { getRandomCowImage, getRandomMeatImage, DEFAULT_COW_IMAGE } from "@/lib/image-utils";

interface SafeImageProps extends Omit<ImageProps, "src" | "alt" | "id"> {
  src: string | null | undefined;
  alt: string;
  fallbackType?: "cow" | "meat" | "general";
  fallbackSrc?: string;
  id?: string | number;
}

export default function SafeImage({ 
  src, 
  alt, 
  fallbackType = "cow", 
  fallbackSrc,
  id,
  className,
  ...props 
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(DEFAULT_COW_IMAGE);
  const [isFallback, setIsFallback] = useState(false);

  const getFallback = () => {
    if (fallbackSrc) return fallbackSrc;
    return fallbackType === "meat" ? getRandomMeatImage(id) : getRandomCowImage(id);
  };

  const handleError = () => {
    if (!isFallback) {
      setImgSrc(getFallback());
      setIsFallback(true);
    }
  };

  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setIsFallback(false);
    } else {
      setImgSrc(getFallback());
      setIsFallback(true);
    }
  }, [src, id, fallbackSrc, fallbackType]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      id={id ? String(id) : undefined}
      className={`${className} ${isFallback ? "opacity-90 grayscale-[10%]" : ""}`}
      onError={handleError}
      unoptimized
    />
  );
}
