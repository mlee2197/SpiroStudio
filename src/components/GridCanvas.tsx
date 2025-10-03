import { GridType } from "@/types";
import React, { useRef, useEffect, useState } from "react";

interface GridCanvasProps {
  show: boolean;
  type: GridType;
  gridSize: number; // renamed from 'size' to 'gridSize'
  containerRef: React.RefObject<HTMLDivElement | null>;
  backgroundColor: string;
}

function GridCanvas({
  show,
  type,
  gridSize,
  containerRef,
  backgroundColor,
}: GridCanvasProps) {
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setSize({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [containerRef]);

  useEffect(() => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!show) return;

    // Draw grid based on type
    const gridSpacing = gridSize > 0 ? gridSize : 32; // use gridSize prop, fallback to 32 if invalid
    ctx.save();
    ctx.strokeStyle = "#e5e7eb"; // Tailwind gray-200
    ctx.lineWidth = 1;
    ctx.setLineDash([]);

    if (type === "grid" || type === "columns") {
      // Draw columns (vertical lines)
      for (let x = 0; x <= size.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, size.height);
        ctx.stroke();
      }
    }
    if (type === "grid" || type === "rows") {
      // Draw only rows (horizontal lines)
      for (let y = 0; y <= size.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(size.width, y + 0.5);
        ctx.stroke();
      }
    }
    ctx.restore();
  }, [show, size, gridSize, type, backgroundColor]);

  return (
    <canvas
      ref={gridCanvasRef}
      width={size.width}
      height={size.height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}

export default GridCanvas;
