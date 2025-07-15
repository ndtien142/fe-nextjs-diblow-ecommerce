"use client";

import React, { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import NavigationLinks from "./NavigationLinks";
import UserActions from "./UserActions";

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-4 w-7 h-7"
        >
          <path
            fillRule="evenodd"
            d="M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75ZM2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Zm0 4.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-50 z-[]80"
            onClick={closeMenu}
          />
          {/* Sidebar Menu */}
          <div
            className={`fixed top-0 left-0 h-full w-80 max-w-[320px] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Header */}
            <div className="fixed top-0 right-0 h-[100vh] w-[320px] md:w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out pl-5 pr-5 pt-10">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 border-dashed">
                <h2 className="text-lg font-helvetica-bold text-gray-900">
                  Menu
                </h2>
                <button
                  onClick={closeMenu}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Menu Content */}
              <div className="flex flex-col h-full">
                {/* Navigation Categories - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 scrollbar-none">
                  <div className="space-y-6 scrollbar-none">
                    {/* Categories Section */}
                    <div>
                      <div onClick={closeMenu}>
                        <NavigationLinks
                          className="space-y-1"
                          isMobile={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <UserActions isMobile={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
