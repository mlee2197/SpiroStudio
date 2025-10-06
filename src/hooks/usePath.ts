// --- usePath: Responsible for path creation, editing, and drawing ---

import { generatePresetPath } from "@/helpers/CanvasUtils";
import { GridType, PathPreset, Point } from "@/types";
import { useEffect, useState } from "react";

interface UsePathProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  controls: {
    showPath: boolean;
    gridSize: number;
    snapToGrid: boolean;
    gridType: GridType;
  };
}

export function usePath({ canvasRef, controls }: UsePathProps) {
  const [pathPoints, setPathPoints] = useState<Point[]>([]);
  const { showPath, gridSize, snapToGrid, gridType } = controls;

  // Draw the user-defined path (polygon, etc)
  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!showPath || pathPoints.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    };

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();

    // Draw lines between consecutive points
    if (pathPoints.length > 1) {
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
      for (let i = 1; i < pathPoints.length; i++) {
        ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
      }
      // Only connect the last point to the first point (close the path) if there are at least 3 points
      if (pathPoints.length > 2) {
        ctx.lineTo(pathPoints[0].x, pathPoints[0].y);
      }
    } else if (pathPoints.length === 1) {
      // If only one point, just move to it (no line)
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
    }

    ctx.stroke();
    ctx.setLineDash([]);
    // Draw path points
    pathPoints.forEach((point, i) => {
      ctx.fillStyle = i === 0 ? "#22c55e" : "#888";
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }, [canvasRef, pathPoints, showPath]);

  // Handle canvas click to add points to the path
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef?.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (snapToGrid) {
      if (gridType === "grid") {
        x = Math.round(x / gridSize) * gridSize;
        y = Math.round(y / gridSize) * gridSize;
      } else if (gridType === "columns") {
        x = Math.round(x / gridSize) * gridSize;
      } else if (gridType === "rows") {
        y = Math.round(y / gridSize) * gridSize;
      }
    }

    setPathPoints((prev) => [...prev, { x, y }]);
  };

  // Set a preset path
  const setPresetPath = (preset: PathPreset) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const points = generatePresetPath({
      preset,
      centerX,
      centerY,
      width: rect.width,
      height: rect.height,
    });
    setPathPoints(points);
  };

  // Reset the path
  const resetPath = () => {
    setPathPoints([]);
    canvasRef.current
      ?.getContext("2d")
      ?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return {
    pathPoints,
    setPathPoints,
    handleCanvasClick,
    setPresetPath,
    resetPath,
  };
}
