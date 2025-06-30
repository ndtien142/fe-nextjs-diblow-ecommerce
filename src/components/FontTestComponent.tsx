import React from "react";

const FontTestComponent = () => {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-futura-light">FuturaSTD Light (300)</h1>
      <h2 className="text-2xl font-futura-book">FuturaSTD Book (400)</h2>
      <h3 className="text-xl font-futura-medium">FuturaSTD Medium (500)</h3>
      <h4 className="text-lg font-futura-bold">FuturaSTD Bold (600)</h4>
      <h5 className="text-base font-futura-extrabold">
        FuturaSTD ExtraBold (700)
      </h5>
      <h6 className="text-sm font-futura-heavy">FuturaSTD Heavy (800)</h6>

      <div className="mt-8 space-y-2">
        <p className="font-futura-light-italic">FuturaSTD Light Italic</p>
        <p className="font-futura-book-italic">FuturaSTD Book Italic</p>
        <p className="font-futura-medium-italic">FuturaSTD Medium Italic</p>
        <p className="font-futura-bold-italic">FuturaSTD Bold Italic</p>
        <p className="font-futura-extrabold-italic">
          FuturaSTD ExtraBold Italic
        </p>
        <p className="font-futura-heavy-italic">FuturaSTD Heavy Italic</p>
      </div>

      <div className="mt-8">
        <p className="text-base">
          This is a paragraph using the default FuturaSTD font. It should
          automatically use the Book weight (400) as the default.
        </p>
      </div>
    </div>
  );
};

export default FontTestComponent;
