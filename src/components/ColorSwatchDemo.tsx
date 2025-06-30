import React, { useState } from "react";
import ColorSwatch from "./ColorSwatch";
import { getColorInfo, isColorAttribute } from "@/utils/colorUtils";

const ColorSwatchDemo: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string>("");

  // Sample color values to demonstrate the color detection
  const sampleColors = [
    // Basic colors
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Orange",
    "Purple",
    "Pink",
    "Black",
    "White",
    "Gray",

    // Fashion colors
    "Navy",
    "Burgundy",
    "Emerald",
    "Rose Gold",
    "Champagne",
    "Nude",
    "Cream",
    "Charcoal",

    // Color variations
    "Light Blue",
    "Dark Green",
    "Royal Blue",
    "Forest Green",
    "Sky Blue",
    "Mint Green",

    // Hex colors
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#F9CA24",
    "#6C5CE7",
    "#A0E7E5",

    // RGB colors
    "rgb(255, 107, 107)",
    "rgb(78, 205, 196)",
    "rgb(69, 183, 209)",

    // Unknown colors (will generate hash-based colors)
    "Cosmic Latte",
    "Mauvelous",
    "Periwinkle",
    "Vermillion",
    "Celadon",
  ];

  const sampleAttributeNames = [
    "Color",
    "Colour",
    "Primary Color",
    "Background Shade",
    "Theme Hue",
    "Size", // Non-color attribute for comparison
    "Material", // Non-color attribute for comparison
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Color Swatch System Demo
      </h2>

      {/* Color Detection Test */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          1. Attribute Name Detection
        </h3>
        <p className="text-sm text-gray-600">
          The system automatically detects color attributes based on attribute
          names:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sampleAttributeNames.map((name) => (
            <div key={name} className="p-3 border rounded-lg">
              <div className="font-medium text-sm">{name}</div>
              <div
                className={`text-xs mt-1 ${
                  isColorAttribute(name) ? "text-green-600" : "text-gray-500"
                }`}
              >
                {isColorAttribute(name)
                  ? "✓ Color Attribute"
                  : "✗ Regular Attribute"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Swatch Gallery */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          2. Color Swatch Gallery
        </h3>
        <p className="text-sm text-gray-600">
          Click on any color to see how the selection works. Hover for tooltips.
        </p>

        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 gap-4">
          {sampleColors.map((color, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <ColorSwatch
                colorName={color}
                selected={selectedColor === color}
                onClick={() =>
                  setSelectedColor(selectedColor === color ? "" : color)
                }
                size="lg"
                showTooltip={true}
              />
              <span className="text-xs text-gray-600 text-center max-w-16 truncate">
                {color}
              </span>
            </div>
          ))}
        </div>

        {selectedColor && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">
              Selected Color: {selectedColor}
            </h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div>
                <strong>Detected Hex:</strong> {getColorInfo(selectedColor).hex}
              </div>
              <div>
                <strong>Known Color:</strong>{" "}
                {getColorInfo(selectedColor).isKnownColor
                  ? "Yes"
                  : "No (Generated)"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Size Variations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          3. Size Variations
        </h3>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <ColorSwatch colorName="Red" size="sm" />
            <span className="text-xs text-gray-600">Small</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ColorSwatch colorName="Red" size="md" />
            <span className="text-xs text-gray-600">Medium</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ColorSwatch colorName="Red" size="lg" />
            <span className="text-xs text-gray-600">Large</span>
          </div>
        </div>
      </div>

      {/* Product Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          4. Product Example
        </h3>
        <p className="text-sm text-gray-600">
          Example of how color swatches would appear in a product with color and
          size attributes:
        </p>

        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {["Red", "Blue", "Black", "White", "Navy"].map((color) => (
                  <div key={color} className="flex flex-col items-center gap-1">
                    <ColorSwatch
                      colorName={color}
                      selected={selectedColor === color}
                      onClick={() =>
                        setSelectedColor(selectedColor === color ? "" : color)
                      }
                      size="lg"
                    />
                    <span className="text-xs text-gray-600">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Color Support Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          5. Supported Color Formats
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">
              ✅ Supported Formats
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Color names: "Red", "Blue", "Forest Green"</li>
              <li>• Hex colors: "#FF0000", "#00FF00"</li>
              <li>• RGB colors: "rgb(255, 0, 0)"</li>
              <li>• Fashion colors: "Navy", "Burgundy", "Rose Gold"</li>
              <li>• Unknown colors: Auto-generated consistent colors</li>
            </ul>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">🎨 Features</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Automatic color detection from 100+ predefined colors</li>
              <li>• Hash-based color generation for unknown colors</li>
              <li>• Smart contrast detection for checkmarks</li>
              <li>• Hover tooltips with color names</li>
              <li>• Multiple sizes (sm, md, lg)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Implementation */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">💡 Implementation</h3>
        <p className="text-sm text-gray-700 mb-2">
          In your product pages, the system automatically:
        </p>
        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
          <li>
            Detects color attributes by name (e.g., "Color", "Colour", "Shade")
          </li>
          <li>Renders color swatches instead of text buttons</li>
          <li>
            Shows regular buttons for non-color attributes (Size, Material,
            etc.)
          </li>
          <li>Provides visual feedback for selected colors</li>
          <li>Maintains accessibility with proper tooltips and contrast</li>
        </ol>
      </div>
    </div>
  );
};

export default ColorSwatchDemo;
