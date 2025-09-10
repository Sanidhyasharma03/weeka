'use client';

import React, { useEffect, useRef, useState } from 'react';

const tailwindColorsMap: { [key: string]: string } = {
  "bg-gray-900": "#111827", // Dark Gray
  "bg-blue-300": "#93c5fd",
  "bg-blue-800": "#1e40af",
  "bg-green-300": "#86efad",
  "bg-teal-500": "#14b8a6",
};

const colors = [
  "bg-blue-300",   // Light Blue
  "bg-blue-800",   // Dark Blue
  "bg-green-300",  // Light Green
  "bg-teal-500"    // Teal
];

const ColorGridBackground: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [cellColors, setCellColors] = useState<string[]>([]);

  useEffect(() => {
    // Initialize cell colors on mount to dark gray
    const initialColors = Array.from({ length: 1000 }).map(() => "bg-gray-900");
    setCellColors(initialColors);
  }, []);

  useEffect(() => {
    if (gridRef.current && cellColors.length > 0) {
      gridRef.current.innerHTML = ''; // Clear existing divs if any
      for (let i = 0; i < 1000; i++) {
        const div = document.createElement("div");
        div.className = `aspect-square border border-gray-800 transition-colors duration-300`;
        div.style.backgroundColor = tailwindColorsMap["bg-gray-900"]; // Set initial color to dark gray

        const hoverColorHex = tailwindColorsMap[colors[i % colors.length]]; // This will be the color it changes to on hover

        div.onmouseenter = () => {
          div.style.backgroundColor = hoverColorHex; // Immediate change to hover color
        };

        div.onmouseleave = () => {
          setTimeout(() => {
            div.style.backgroundColor = tailwindColorsMap["bg-gray-900"]; // Revert to dark gray after a delay
          }, 300); // 300ms delay for trailing effect.
        };

        gridRef.current.appendChild(div);
      }
    }
  }, [cellColors]);

  return (
    <div
      ref={gridRef}
      className="fixed inset-0 w-full h-full grid z-0 overflow-hidden bg-black"
      style={{
        gridTemplateColumns: 'repeat(20, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, 5vw)'
      }}
    />
  );
};

export default ColorGridBackground;
