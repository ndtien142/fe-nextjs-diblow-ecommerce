"use client";

import React from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";

interface MobileSidebarToggleProps {
  onClick: () => void;
}

const MobileSidebarToggle: React.FC<MobileSidebarToggleProps> = ({
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="md:hidden fixed top-20 left-4 z-40 bg-white border border-gray-300 rounded-lg p-2 shadow-lg hover:shadow-xl transition-shadow duration-200"
    >
      <Bars3Icon className="w-5 h-5" />
    </button>
  );
};

export default MobileSidebarToggle;
