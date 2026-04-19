"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { getRandomCowImage, DEFAULT_COW_IMAGE } from "@/lib/image-utils";

interface SafeImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string | null | undefined;
  alt: string;
  fallbackType?: "cow" | "meat" | "general";
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
}: SafeImageProps & { fallbackSrc?: string }) {
  const [imgSrc, setImgSrc] = useState<string>(DEFAULT_COW_IMAGE);
  const [isFallback, setIsFallback] = useState(false);

  const handleError = () => {
    if (!isFallback) {
      let finalFallback = fallbackSrc;
      if (!finalFallback) {
        if (fallbackType === "meat") {
          const { getRandomMeatImage } = require("@/lib/image-utils");
          finalFallback = getRandomMeatImage(id);
        } else {
          finalFallback = getRandomCowImage(id);
        }
      }
      setImgSrc(finalFallback);
      setIsFallback(true);
    }
  };

  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setIsFallback(false);
    } else {
      let finalFallback = fallbackSrc;
      if (!finalFallback) {
        if (fallbackType === "meat") {
          const { getRandomMeatImage } = require("@/lib/image-utils");
          finalFallback = getRandomMeatImage(id);
        } else {
          finalFallback = getRandomCowImage(id);
        }
      }
      setImgSrc(finalFallback);
      setIsFallback(true);
    }
  }, [src, id, fallbackSrc, fallbackType]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      className={`${className} ${isFallback ? "opacity-90 grayscale-[10%]" : ""}`}
      onError={handleError}
      unoptimized
    />
  );
}
