import { ColorType, GridType } from "@/types";
import React, { useRef, useEffect, useState } from "react";

interface GridCanvasProps {
  showGrid: boolean;
  showSnap: boolean;
  type: GridType;
  gridSize: number; // renamed from 'size' to 'gridSize'
  containerRef: React.RefObject<HTMLDivElement | null>;
  backgroundColor: ColorType;
}

function GridCanvas({
  showGrid,
  showSnap,
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
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

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

  // Mouse move handler for showing snap dot
  useEffect(() => {
    if (!showSnap) {
      setMousePos(null);
      return;
    }
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
    };
    const handleMouseLeave = () => setMousePos(null);

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [containerRef, showSnap]);

  useEffect(() => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor.hex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (showGrid) {
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
    }

    // Draw snap dot if enabled and mouse is over canvas
    if (showSnap && mousePos) {
      const gridSpacing = gridSize;

      let snappedX = mousePos.x;
      let snappedY = mousePos.y;
      let shouldDraw = false;

      if (type === "grid") {
        // Snap to nearest grid intersection (both axes)
        snappedX = Math.round(mousePos.x / gridSpacing) * gridSpacing;
        snappedY = Math.round(mousePos.y / gridSpacing) * gridSpacing;
        shouldDraw =
          snappedX >= 0 &&
          snappedX <= size.width &&
          snappedY >= 0 &&
          snappedY <= size.height;
      } else if (type === "columns") {
        // Snap only X to nearest vertical grid line, Y stays as is
        snappedX = Math.round(mousePos.x / gridSpacing) * gridSpacing;
        snappedY = mousePos.y;
        shouldDraw =
          snappedX >= 0 &&
          snappedX <= size.width &&
          snappedY >= 0 &&
          snappedY <= size.height;
      } else if (type === "rows") {
        // Snap only Y to nearest horizontal grid line, X stays as is
        snappedX = mousePos.x;
        snappedY = Math.round(mousePos.y / gridSpacing) * gridSpacing;
        shouldDraw =
          snappedX >= 0 &&
          snappedX <= size.width &&
          snappedY >= 0 &&
          snappedY <= size.height;
      }

      if (shouldDraw) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(snappedX, snappedY, 6, 0, 2 * Math.PI);
        ctx.fillStyle = "#BB9F06";
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(snappedX, snappedY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 1;
        ctx.fill();
        ctx.restore();
      }
    }
  }, [showGrid, size, gridSize, type, backgroundColor, showSnap, mousePos]);

  return (
    <canvas
      ref={gridCanvasRef}
      width={size.width}
      height={size.height}
      className="w-full h-full pointer-events-none rounded-lg [grid-area:1/1]"
      aria-hidden="true"
    />
  );
}

export default GridCanvas;
