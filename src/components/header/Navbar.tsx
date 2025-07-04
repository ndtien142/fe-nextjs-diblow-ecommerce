"use client";
import React from "react";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import NavigationLinks from "./NavigationLinks";
import UserActions from "./UserActions";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const { router } = useAppContext();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-300 text-gray-700 transition-all duration-300 ease-in-out shadow-sm backdrop-blur-sm container-fluid sm:h-[70px]">
      <div className="flex items-center justify-between px-6 md:px-6 lg:px-32">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            className="cursor-pointer transition-transform duration-200 hover:scale-105"
            onClick={() => router.push("/")}
            src={assets.logo}
            alt="Diblow Logo"
            width={70}
            height={40}
            priority
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 h-min-[70px]">
          <NavigationLinks className="flex items-center gap-4 lg:gap-8" />
        </div>

        {/* Desktop User Actions */}
        <UserActions />

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    </header>
  );
};

export default Navbar;
