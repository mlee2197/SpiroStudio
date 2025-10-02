import { useRef, useEffect } from "react";

/**
 * useCanvas - React hook for working with a canvas element.
 * Returns a ref to be attached to a <canvas> and a context ref.
 */
export function useCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // handle dynamic canvas size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        if (canvasRef.current) {
          // Only update the canvas size if it actually changed, to avoid rescaling artifacts
          const displayWidth = Math.floor(width);
          const displayHeight = Math.floor(height);
          const pixelWidth = Math.floor(width * devicePixelRatio);
          const pixelHeight = Math.floor(height * devicePixelRatio);

          // Only reset the canvas size if it changed, to avoid rescaling the context
          if (
            canvasRef.current.width !== pixelWidth ||
            canvasRef.current.height !== pixelHeight
          ) {
            canvasRef.current.width = pixelWidth;
            canvasRef.current.height = pixelHeight;
          }
          canvasRef.current.style.width = `${displayWidth}px`;
          canvasRef.current.style.height = `${displayHeight}px`;

          // Always reset the transform before scaling to avoid compounding
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(devicePixelRatio, devicePixelRatio);
          }
        }
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [canvasRef]);

  return { canvasRef, containerRef };
}
