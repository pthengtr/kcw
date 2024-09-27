"use client";
import React from "react";
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

  return (
    <div className="relative max-w-full min-w-fit h-full rounded-lg overflow-hidden grid place-content-center mt-8">
      <Image
        alt={alt}
        onError={() => setError(true)}
        src={error ? fallback : src}
        priority={true}
        width={300}
        height={300}
        className="rounded-lg h-auto w-auto"
      />
    </div>
  );
}
