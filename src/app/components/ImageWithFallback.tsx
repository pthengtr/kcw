"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
const fallbackImage = "/notfound.png";

type ImageFallbackProps = {
  fallback?: string;
  alt: string;
  src: string;
};

export default function ImageWithFallback({
  fallback = fallbackImage,
  alt,
  src,
}: ImageFallbackProps) {
  const [error, setError] = useState(false);

  useEffect(() => setError(false), [src]);
  return (
    <div className="relative max-w-full min-w-fit h-full rounded-lg overflow-hidden grid place-content-center mt-8">
      <Image
        alt={alt}
        onError={() => setError(true)}
        src={error ? fallback : src}
        width={300}
        height={300}
        className="rounded-lg h-auto w-auto"
      />
    </div>
  );
}
