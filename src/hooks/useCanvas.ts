import { useRef, useEffect } from "react";

/**
 * useCanvas - React hook for working with a canvas element.
 * Returns a ref to be attached to a <canvas> and a context ref.
 */
export function useCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pathCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // handle dynamic canvas size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const displayWidth = Math.floor(width);
        const displayHeight = Math.floor(height);
        const pixelWidth = Math.floor(width * devicePixelRatio);
        const pixelHeight = Math.floor(height * devicePixelRatio);

        // Update main canvas
        if (canvasRef.current) {
          if (
            canvasRef.current.width !== pixelWidth ||
            canvasRef.current.height !== pixelHeight
          ) {
            canvasRef.current.width = pixelWidth;
            canvasRef.current.height = pixelHeight;
          }
          canvasRef.current.style.width = `${displayWidth}px`;
          canvasRef.current.style.height = `${displayHeight}px`;

          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(devicePixelRatio, devicePixelRatio);
          }
        }

        // Update path canvas
        if (pathCanvasRef.current) {
          if (
            pathCanvasRef.current.width !== pixelWidth ||
            pathCanvasRef.current.height !== pixelHeight
          ) {
            pathCanvasRef.current.width = pixelWidth;
            pathCanvasRef.current.height = pixelHeight;
          }
          pathCanvasRef.current.style.width = `${displayWidth}px`;
          pathCanvasRef.current.style.height = `${displayHeight}px`;

          const ctxPath = pathCanvasRef.current.getContext("2d");
          if (ctxPath) {
            ctxPath.setTransform(1, 0, 0, 1, 0, 0);
            ctxPath.scale(devicePixelRatio, devicePixelRatio);
          }
        }
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [canvasRef, pathCanvasRef]);

  return { canvasRef, containerRef, pathCanvasRef };
}
