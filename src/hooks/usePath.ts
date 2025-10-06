// --- usePath: Responsible for path creation, editing, and drawing ---

import { generatePresetPath } from "@/helpers/CanvasUtils";
import { GridType, PathPreset, Point } from "@/types";
import { useCallback, useEffect, useState } from "react";

const RADIUS = 6; // Radius for detecting point clicks
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
  const [undoStack, setUndoStack] = useState<Point[][]>([]);
  const [redoStack, setRedoStack] = useState<Point[][]>([]);
  const { showPath, gridSize, snapToGrid, gridType } = controls;

  // Drag state
  const [draggingPoint, setDraggingPoint] = useState<number | null>(null);

  // Hover state for highlighting points
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Helper: get mouse position relative to canvas
  const getMousePos = useCallback((e: MouseEvent | React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef?.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e as MouseEvent).clientX - rect.left,
      y: (e as MouseEvent).clientY - rect.top,
    };
  }, [canvasRef]);

  // Helper: returns the index of a nearby point, or -1 if none found
  const getNearbyPointIndex = (x: number, y: number, points: Point[], radius: number = RADIUS) => {
    for (let i = 0; i < points.length; i++) {
      const dx = x - points[i].x;
      const dy = y - points[i].y;
      if (Math.sqrt(dx * dx + dy * dy) < radius) {
        return i;
      }
    }
    return -1;
  };

  // Add/remove event listeners for mousemove/mouseup on window for smooth drag
  useEffect(() => {
    if (!canvasRef?.current) return;
    const canvas = canvasRef.current;
    const handleMove = (e: MouseEvent) => {
      const { x, y } = getMousePos(e);

      // Update hovered point for highlight
      const idx = getNearbyPointIndex(x, y, pathPoints);
      setHoveredPoint(idx);

      setPathPoints((prev) => {
        if (draggingPoint === null) return prev;
        const newPoints = prev.map((p, idx) =>
          idx === draggingPoint ? { ...p, x, y } : p
        );
        return newPoints;
      });
    };
    const handleUp = () => {
      setDraggingPoint(null);
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (!canvasRef?.current) return;
      const { x, y } = getMousePos(e);
      // find nearest point
      const idx = getNearbyPointIndex(x, y, pathPoints);
      if (idx !== -1) {
        setDraggingPoint(idx);
      }
    };
    const handleMouseLeave = () => setHoveredPoint(null);
    
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseup", handleUp);
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseup", handleUp);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [draggingPoint, canvasRef, pathPoints, getMousePos]);

  // Draw the user-defined path (polygon, etc)
  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!showPath || pathPoints.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#999";
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
      let fillStyle = "#999";
      if (i === 0) fillStyle = "#22c55e";
      if (i === hoveredPoint) fillStyle = "#2563eb"; // blue-600
      ctx.fillStyle = fillStyle;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }, [canvasRef, pathPoints, showPath, hoveredPoint]);

  // Handle canvas click to add points to the path
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef?.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Prevent adding a new point if the click is close to an existing point (to avoid conflict with dragging)
    if (getNearbyPointIndex(x, y, pathPoints) !== -1) {
      return;
    }

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

    setUndoStack((prev) => [...prev, pathPoints]);
    setRedoStack([]); // Clear redo stack on new action
    setPathPoints((prev) => [...prev, { x, y }]);
  };

  // Undo the last action
  const undo = useCallback(() => {
    setUndoStack((prevUndoStack) => {
      if (prevUndoStack.length === 0) return prevUndoStack;
      const last = prevUndoStack[prevUndoStack.length - 1];
      // Only push to redoStack if the last pathPoints is not the same as the last redoStack entry
      setRedoStack((prevRedoStack) => {
        if (
          prevRedoStack.length > 0 &&
          prevRedoStack[prevRedoStack.length - 1] === pathPoints
        ) {
          return prevRedoStack;
        }
        return [...prevRedoStack, pathPoints];
      });
      setPathPoints(last);
      return prevUndoStack.slice(0, -1);
    });
  }, [pathPoints]);

  // Redo the last undone action
  const redo = useCallback(() => {
    setRedoStack((prevRedoStack) => {
      if (prevRedoStack.length === 0) return prevRedoStack;
      const last = prevRedoStack[prevRedoStack.length - 1];
      // Only push to undoStack if the last pathPoints is not the same as the last undoStack entry
      setUndoStack((prevUndoStack) => {
        if (
          prevUndoStack.length > 0 &&
          prevUndoStack[prevUndoStack.length - 1] === pathPoints
        ) {
          return prevUndoStack;
        }
        return [...prevUndoStack, pathPoints];
      });
      setPathPoints(last);
      return prevRedoStack.slice(0, -1);
    });
  }, [pathPoints]);

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = /Mac/i.test(navigator.userAgent);
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Ctrl+Z or Cmd+Z (without Shift)
      if (ctrlOrCmd && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
        return;
      }
      // Redo: Ctrl+Y or Cmd+Y, or Ctrl+Shift+Z or Cmd+Shift+Z
      if (
        ctrlOrCmd &&
        (e.key.toLowerCase() === "y" ||
          (e.key.toLowerCase() === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        if (canRedo) redo();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canUndo, canRedo, undo, redo]);

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
    setUndoStack((prev) => [...prev, pathPoints]);
    setRedoStack([]); // Clear redo stack on new action
    setPathPoints(points);
  };

  // Reset the path
  const resetPath = () => {
    setUndoStack((prev) => [...prev, pathPoints]);
    setRedoStack([]); // Clear redo stack on new action
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
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
