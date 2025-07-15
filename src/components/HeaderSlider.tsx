"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { BannerSlide } from "@/types/slider.interface";

interface HeaderSliderProps {
  slides?: BannerSlide[];
  loading?: boolean;
  error?: string | null;
  autoPlayInterval?: number;
}

const HeaderSlider: React.FC<HeaderSliderProps> = ({
  slides = [],
  loading = false,
  error = null,
  autoPlayInterval = 5000,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentSlide, slides.length, isAutoPlaying, autoPlayInterval]);

  // Navigation functions
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000); // Resume auto-play after 3 seconds
  };

  const goToPrevious = () => {
    const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    goToSlide(prevIndex);
  };

  const goToNext = () => {
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] bg-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <span className="text-gray-600 font-helvetica-book">
            Đang tải banner...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 font-helvetica-medium mb-2">
            Lỗi khi tải banner
          </div>
          <div className="text-gray-500 font-helvetica-book text-sm">
            {error}
          </div>
        </div>
      </div>
    );
  }

  // No slides available
  if (!slides || slides.length === 0) {
    return (
      <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 font-helvetica-book">
            Không có banner để hiển thị
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 md:h-[500px] lg:h-[700px] overflow-hidden bg-black">
      {/* Main slider container */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="min-w-full h-full relative">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image.url}
                alt={slide.image.alt}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity duration-200 z-20"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity duration-200 z-20"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderSlider;
