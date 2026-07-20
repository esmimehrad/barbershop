import { RefObject, useEffect, useState } from "react";

/**
 * Tracks the pointer position (mouse + touch). With no `containerRef` it
 * reports viewport coordinates; with one, coordinates relative to that
 * element's top-left (even while the pointer is outside it).
 */
export const useMousePosition = (
  containerRef?: RefObject<HTMLElement | SVGElement | null>,
) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const relativeX = x - rect.left;
        const relativeY = y - rect.top;

        // Calculate relative position even when outside the container
        setPosition({ x: relativeX, y: relativeY });
      } else {
        setPosition({ x, y });
      }
    };

    const handleMouseMove = (ev: MouseEvent) => {
      updatePosition(ev.clientX, ev.clientY);
    };

    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (!touch) return;
      updatePosition(touch.clientX, touch.clientY);
    };

    // Listen for both mouse and touch events
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [containerRef]);

  return position;
};
