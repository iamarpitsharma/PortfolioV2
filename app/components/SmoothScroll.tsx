"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode, useEffect, useState } from "react";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only enable Lenis silk-smooth scrolling for desktop devices with fine pointer (mouse/trackpad)
    // and viewport width >= 768px. Mobile/touch screens use pure native scroll with CSS smooth-scroll.
    const checkIsDesktop = () => {
      const isWide = window.innerWidth >= 768;
      const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      setIsDesktop(isWide && hasFinePointer);
    };

    checkIsDesktop();

    const mediaFine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const handleMediaChange = () => checkIsDesktop();

    window.addEventListener("resize", checkIsDesktop);
    if (mediaFine.addEventListener) {
      mediaFine.addEventListener("change", handleMediaChange);
    }

    return () => {
      window.removeEventListener("resize", checkIsDesktop);
      if (mediaFine.removeEventListener) {
        mediaFine.removeEventListener("change", handleMediaChange);
      }
    };
  }, []);

  // On mobile / touch devices: Render pure native scroll with zero touch-hijacking
  if (!isDesktop) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08, // Buttery smooth linear interpolation for desktop mouse wheel
        smoothWheel: true,
        wheelMultiplier: 1.0,
        syncTouch: false, // Absolutely never hijack touch events
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
