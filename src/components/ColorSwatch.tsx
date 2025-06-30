import React from "react";
import { getColorInfo, isLightColor, ColorInfo } from "@/utils/colorUtils";

interface ColorSwatchProps {
  colorName: string;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  disabled?: boolean;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({
  colorName,
  selected = false,
  onClick,
  size = "md",
  showTooltip = true,
  disabled = false,
}) => {
  const colorInfo: ColorInfo = getColorInfo(colorName);
  const isLight = isLightColor(colorInfo.hex);

  // Size configurations
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const checkmarkSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          ${sizeClasses[size]} 
          rounded-full border-2 transition-all duration-200 relative overflow-hidden
          ${
            selected
              ? "border-orange-500 shadow-md scale-110"
              : "border-gray-300 hover:border-gray-400 hover:scale-105"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${colorInfo.hex === "#FFFFFF" ? "shadow-inner" : ""}
        `}
        style={{ backgroundColor: colorInfo.hex }}
        title={showTooltip ? colorName : undefined}
      >
        {/* Checkmark for selected state */}
        {selected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className={`${checkmarkSizes[size]} ${
                isLight ? "text-gray-800" : "text-white"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}

        {/* Special pattern for unknown colors */}
        {!colorInfo.isKnownColor && (
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-transparent via-white to-transparent"></div>
          </div>
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {colorName}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

export default ColorSwatch;
