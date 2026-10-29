"use client";

import React from "react";
import { Asterisk } from "lucide-react";

export default function InfiniteMarquee() {
  const items = Array.from({ length: 12 });

  return (
    <div className="w-full overflow-hidden bg-[#FFD23F] border-[3px] border-black dark:border-[#27272A] shadow-[4px_4px_0_0_#000] py-2.5 select-none">
      <div className="marquee-track-ltr">
        {/* Set 1 */}
        <div className="flex items-center shrink-0 whitespace-nowrap text-black font-mono font-black text-sm sm:text-base tracking-widest uppercase">
          {items.map((_, i) => (
            <div key={`a-${i}`} className="flex items-center gap-5 px-4 shrink-0">
              <Asterisk className="w-5 h-5 text-black stroke-[3]" />
              <span className="tracking-wider">ARPIT SHARMA</span>
            </div>
          ))}
        </div>
        {/* Set 2 for seamless loop */}
        <div className="flex items-center shrink-0 whitespace-nowrap text-black font-mono font-black text-sm sm:text-base tracking-widest uppercase">
          {items.map((_, i) => (
            <div key={`b-${i}`} className="flex items-center gap-5 px-4 shrink-0">
              <Asterisk className="w-5 h-5 text-black stroke-[3]" />
              <span className="tracking-wider">ARPIT SHARMA</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
