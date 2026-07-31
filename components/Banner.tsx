"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { bannerService } from "@/services/banner-service";
import { Banner as BannerType } from "@/types/banner";
import { ArrowRight } from "lucide-react";

const Banner = () => {
  const [banner, setBanner] = useState<BannerType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await bannerService.getAllActive();
        if (res.success && res.data.length > 0) {
          // Display the first active banner (lowest sortOrder)
          setBanner(res.data[0]);
        }
      } catch {
        // Silent fail — hide the section if the API is down
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="py-14">
        <div className="h-56 animate-pulse rounded-lg bg-slate-100 md:h-64" />
      </div>
    );
  }

  // Nothing to show
  if (!banner) return null;

  return (
    <div className="py-14">
      <div className="relative flex items-center justify-between overflow-hidden rounded-lg bg-[#E6E9F2]">
        {/* Background image fills and covers the entire banner */}
        <div className="absolute inset-0">
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
          {/* Subtle gradient overlay so text stays readable over any image */}
          <div className="absolute inset-0 bg-linear-to-r from-black/40 via-black/20 to-black/10" />
        </div>

        {/* Content — positioned above the image */}
        <div className="relative z-10 flex flex-1 flex-col items-center space-y-4 px-6 py-14 text-center md:py-20">
          <h2 className="max-w-md text-2xl font-semibold text-white drop-shadow md:text-3xl">
            {banner.title}
          </h2>

          {banner.subtitle && (
            <p className="max-w-sm font-medium text-white/90 drop-shadow">
              {banner.subtitle}
            </p>
          )}

          {banner.buttonLabel && (
            <Link
              href={banner.buttonLink || "/products"}
              className="mt-2 inline-flex items-center gap-2 rounded-sm bg-indigo-500 px-8 py-2 font-medium text-white transition hover:bg-indigo-600"
            >
              {banner.buttonLabel}
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;