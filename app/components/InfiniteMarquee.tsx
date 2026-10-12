"use client";

import React, { useRef, useEffect } from "react";
import { Asterisk } from "lucide-react";

export default function InfiniteMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let animationFrameId: number;
    let pos = 0;
    // Movement speed in pixels per frame
    const speed = 1.2;

    const animate = () => {
      // Move left to right (increasing position)
      pos += speed;
      const halfWidth = el.scrollWidth / 2;
      if (pos >= 0) {
        // Start from -halfWidth and smoothly move to 0
        pos = -halfWidth;
      }
      el.style.transform = `translate3d(${pos}px, 0, 0)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize at -halfWidth so content is always filled
    pos = -(el.scrollWidth / 2);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const items = Array.from({ length: 24 });

  return (
    <div className="w-full overflow-hidden bg-[#FFD23F] border-[3px] border-black dark:border-zinc-700 shadow-[4px_4px_0_0_#000] py-2.5 select-none">
      <div
        ref={containerRef}
        className="flex items-center whitespace-nowrap text-black font-mono font-black text-sm sm:text-base tracking-widest uppercase will-change-transform"
      >
        {items.map((_, i) => (
          <div key={i} className="flex items-center gap-5 px-4 shrink-0">
            <Asterisk className="w-5 h-5 text-black stroke-[3]" />
            <span className="tracking-wider">ARPIT SHARMA</span>
          </div>
        ))}
      </div>
    </div>
  );
}
