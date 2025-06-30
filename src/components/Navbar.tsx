"use client";
import React from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

const Navbar = () => {
  const { isSeller, router } = useAppContext();

  return (
    <nav className="sticky top-0 z-50 bg-white flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 transition-all duration-300 ease-in-out shadow-sm backdrop-blur-sm">
      <div className="relative w-25">
        <Image
          className="cursor-pointer absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-105"
          onClick={() => router.push("/")}
          src={assets.logo}
          alt="Diblow Logo"
          width={70}
          height={20}
          priority
        />
      </div>
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full transition-all duration-200 hover:bg-gray-100 hover:shadow-md"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        <button className="flex items-center gap-2 hover:text-gray-900 transition-all duration-200 hover:scale-105">
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full transition-all duration-200 hover:bg-gray-100 hover:shadow-md"
          >
            Seller Dashboard
          </button>
        )}
        <button className="flex items-center gap-2 hover:text-gray-900 transition-all duration-200 hover:scale-105">
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
