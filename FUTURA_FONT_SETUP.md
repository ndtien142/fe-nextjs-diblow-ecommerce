# FuturaSTD Font Setup - COMPLETE ✅

## Available Font Files

The following FuturaSTD font files are already installed in `public/fonts/`:

### Normal Weights:

- `FuturaStdLight.otf` (font-weight: 300)
- `FuturaStdBook.otf` (font-weight: 400) - Default
- `FuturaStdMedium.otf` (font-weight: 500)
- `FuturaStdBold.otf` (font-weight: 600)
- `FuturaStdExtraBold.otf` (font-weight: 700)
- `FuturaStdHeavy.otf` (font-weight: 800)

### Italic (Oblique) Weights:

- `FuturaStdLightOblique.otf` (font-weight: 300, font-style: italic)
- `FuturaStdBookOblique.otf` (font-weight: 400, font-style: italic)
- `FuturaStdMediumOblique.otf` (font-weight: 500, font-style: italic)
- `FuturaStdBoldOblique.otf` (font-weight: 600, font-style: italic)
- `FuturaStdExtraBoldOblique.otf` (font-weight: 700, font-style: italic)
- `FuturaStdHeavyOblique.otf` (font-weight: 800, font-style: italic)

## Font Configuration

The fonts are fully configured in `globals.css` and applied site-wide. The font stack includes:

```css
font-family: "FuturaSTD", "Futura", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, "Helvetica Neue", Arial, sans-serif;
```

## Usage Examples

### Custom CSS Classes:

```jsx
<h1 className="font-futura-light">Light Text</h1>
<h2 className="font-futura-book">Book Text (Default)</h2>
<h3 className="font-futura-medium">Medium Text</h3>
<h4 className="font-futura-bold">Bold Text</h4>
<h5 className="font-futura-extrabold">ExtraBold Text</h5>
<h6 className="font-futura-heavy">Heavy Text</h6>

// Italic variants
<p className="font-futura-light-italic">Light Italic</p>
<p className="font-futura-book-italic">Book Italic</p>
<p className="font-futura-medium-italic">Medium Italic</p>
<p className="font-futura-bold-italic">Bold Italic</p>
<p className="font-futura-extrabold-italic">ExtraBold Italic</p>
<p className="font-futura-heavy-italic">Heavy Italic</p>
```

### Standard Tailwind Classes:

```jsx
<div className="font-light">Light (300)</div>
<div className="font-normal">Normal/Book (400)</div>
<div className="font-medium">Medium (500)</div>
<div className="font-semibold">Semibold/Bold (600)</div>
<div className="font-bold">Bold/ExtraBold (700)</div>
<div className="font-extrabold">ExtraBold/Heavy (800)</div>

// With italic
<div className="font-light italic">Light Italic</div>
<div className="font-medium italic">Medium Italic</div>
```

## Font Test Component

A `FontTestComponent` has been created at `src/components/FontTestComponent.tsx` to preview all font weights and styles.

## Performance Notes

- Currently using OTF format (works in all modern browsers)
- For optimal performance, consider converting to WOFF2/WOFF formats
- All fonts use `font-display: swap` for better loading performance
- Fonts will fallback gracefully if not loaded

## Status: ✅ READY TO USE

The FuturaSTD font family is now fully configured and ready to use throughout your application!
