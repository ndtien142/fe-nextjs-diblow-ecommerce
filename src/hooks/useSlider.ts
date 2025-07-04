"use client";
import { useState, useEffect } from "react";
import { SliderBanner, BannerSlide } from "@/types/slider.interface";

interface UseSliderOptions {
  autoFetch?: boolean;
  per_page?: number;
}

interface UseSliderResult {
  sliders: SliderBanner[];
  slides: BannerSlide[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useSlider = (options: UseSliderOptions = {}): UseSliderResult => {
  const { autoFetch = true, per_page = 10 } = options;

  const [sliders, setSliders] = useState<SliderBanner[]>([]);
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  // Transform API data to UI-friendly format
  const transformSlidersToSlides = (
    apiSliders: SliderBanner[]
  ): BannerSlide[] => {
    return apiSliders.map((slider) => ({
      id: slider.id,
      title: slider.acf?.title || slider.title?.rendered || "",
      description: slider.acf?.description || "",
      offer: slider.acf?.offer,
      image: {
        url: slider.acf?.image?.url || slider.acf?.image?.sizes?.large || "",
        alt:
          slider.acf?.image?.alt ||
          slider.acf?.title ||
          slider.title?.rendered ||
          "Banner",
        width: slider.acf?.image?.width || 1920,
        height: slider.acf?.image?.height || 1080,
      },
      buttons: {
        primary: slider.acf?.buttontext1
          ? {
              label: slider.acf.buttontext1.label,
              url: slider.acf.buttontext1.url,
              target: slider.acf.buttontext1.target,
            }
          : undefined,
        secondary: slider.acf?.buttontext2
          ? {
              label: slider.acf.buttontext2.label,
              url: slider.acf.buttontext2.url,
              target: slider.acf.buttontext2.target,
            }
          : undefined,
      },
      status: slider.status === "publish" ? "active" : "inactive",
    }));
  };

  const fetchSliders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the specific API URL provided
      const url = new URL("https://ndtien142.xyz/wp-json/wp/v2/home-slider");
      url.searchParams.append("acf_format", "standard");
      url.searchParams.append("per_page", per_page.toString());
      url.searchParams.append("status", "publish");
      url.searchParams.append("_embed", "true");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        cache: "no-store", // Ensure fresh data
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} - ${response.statusText}`
        );
      }

      const data: SliderBanner[] = await response.json();

      // Transform data for UI components
      const transformedSlides = transformSlidersToSlides(data);

      setSliders(data);
      setSlides(transformedSlides);
    } catch (err) {
      console.error("Error fetching sliders:", err);
      setError(err instanceof Error ? err.message : "Không thể tải banner");
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchSliders();
  };

  useEffect(() => {
    if (autoFetch) {
      fetchSliders();
    }
  }, [autoFetch, per_page]);

  return {
    sliders,
    slides,
    loading,
    error,
    refetch,
  };
};
