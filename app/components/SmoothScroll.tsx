"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08, // Buttery smooth linear interpolation for mouse wheel
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.0, // Precise 1:1 finger tracking without jumping
        syncTouch: true, // Seamless inertial smoothing on touch / mobile screens
        syncTouchLerp: 0.075, // Natural, silk-like deceleration when flicking
        touchInertiaExponent: 1.7, // High-fidelity momentum physics
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
