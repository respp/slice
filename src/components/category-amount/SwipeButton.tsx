import React, { useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

interface SwipeButtonProps {
  onSwipeComplete: () => void;
  children?: React.ReactNode;
}

export const SwipeButton: React.FC<SwipeButtonProps> = ({
  onSwipeComplete,
  children,
}) => {
  const [x, setX] = useState(0);
  const containerRef = useRef<HTMLButtonElement>(null);
  const maxWidth = 156; // Button width (192) minus handle width (36)
  const threshold = 120; // Trigger point (~80% of maxWidth)

  const bind = useDrag(
    ({ down, movement: [mx], cancel }) => {
      // 1. Constrain movement
      const newX = clamp(mx, 0, maxWidth);
      setX(down ? newX : 0); // Reset on release if not confirmed

      // 2. Trigger Complete
      if (newX > threshold) {
        onSwipeComplete();
        cancel(); // Stop gesture
        setX(0); // Reset position
      }
    },
    {
      axis: "x", // Lock to horizontal axis
      filterTaps: true,
    },
  );

  // Calculate percentage for CSS styling
  const progress = (x / maxWidth) * 100;

  return (
    <button
      ref={containerRef}
      className="w-[192px] h-10 fixed bottom-20 left-1/2 -translate-x-1/2 bg-white border-2 border-[#8c8fff] rounded-[14px] shadow-[0px_0px_10px_0px_rgba(140,143,255,0.5)] cursor-pointer overflow-hidden flex items-center justify-center p-0 box-border select-none touch-none z-10"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-white rounded-xl" />

      {/* Border (Overlay to keep sharp on top of progress) */}
      <div className="absolute inset-0 border-2 border-[#8c8fff] rounded-[14px] pointer-events-none z-[3]" />

      {/* Progress Bar */}
      <div
        className="absolute left-0 top-0 h-full bg-gradient-to-b from-[#8c8fff] to-[#7eb5fd] rounded-l-xl transition-[width] duration-100 ease-out z-[1] pointer-events-none min-w-[36px]"
        style={{ width: `calc(${progress}% + 18px)` }}
      />

      {/* Swipe Handle */}
      <div
        {...bind()}
        className="absolute top-2 w-9 h-6 rounded-lg flex items-center justify-center z-[2] cursor-grab active:cursor-grabbing touch-none"
        style={{ left: `${progress}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#8c8fff] to-[#7eb5fd] rounded-lg" />
        <img
          src="/images/category-amount/subtract-icon.svg"
          alt="Arrow"
          className="w-3.5 h-3.5 relative z-[1] block pointer-events-none"
        />
      </div>

      <span className="font-manrope font-semibold text-[#1b1c23] tracking-[-0.24px] leading-[1.25] relative z-[2] pointer-events-none whitespace-nowrap">
        {children || "Swipe to confirm"}
      </span>
    </button>
  );
};
