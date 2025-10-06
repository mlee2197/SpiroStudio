import { useRef, useState, useEffect } from "react";
import type { Point } from "@/types";
import { getPointOnPath } from "@/helpers/CanvasUtils";

interface UseDrawingProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  controls: {
    showCircle: boolean;
    speed: number;
    outerCircleRadius: number;
    outerPenDistance: number;
    penStyle: string;
    penSize: number;
    innerCircleEnabled: boolean;
    innerCircleRadius: number;
    innerPenDistance: number;
    lineColor: string;
    backgroundColor: string;
  };
  pathPoints: Point[];
  setPathPoints: React.Dispatch<React.SetStateAction<Point[]>>;
}

export function useDrawing({
  containerRef,
  canvasRef,
  controls,
  pathPoints,
  setPathPoints,
}: UseDrawingProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number>(null);

  // Refs for spirograph state
  const spirographPointsRef = useRef<Point[]>([]);
  const pathProgressRef = useRef(0);
  const outerAngleRef = useRef(0);
  const innerAngleRef = useRef(0);

  const {
    showCircle,
    speed,
    outerCircleRadius,
    outerPenDistance,
    penStyle,
    penSize,
    innerCircleEnabled,
    innerCircleRadius,
    innerPenDistance,
    lineColor,
    backgroundColor,
  } = controls;

  // Draw the spirograph trail and animation state
  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw spirograph trail
    const points = spirographPointsRef.current;
    if (points && points.length > 0) {
      ctx.save();
      if (penStyle === "line" || penStyle === "dashes") {
        if (penStyle === "dashes") ctx.setLineDash([10, 5]);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = penSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (
        penStyle === "dots" ||
        penStyle === "circles" ||
        penStyle === "squares"
      ) {
        points.forEach((point) => {
          if (penStyle === "dots") {
            ctx.fillStyle = lineColor;
            ctx.beginPath();
            ctx.arc(point.x, point.y, penSize / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (penStyle === "circles") {
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(point.x, point.y, penSize, 0, Math.PI * 2);
            ctx.stroke();
          } else if (penStyle === "squares") {
            ctx.fillStyle = lineColor;
            ctx.fillRect(
              point.x - penSize / 2,
              point.y - penSize / 2,
              penSize,
              penSize
            );
          }
        });
      }
      ctx.restore();
    }

    // Draw animation state (outer/inner circles and pens)
    if (isAnimating && pathPoints.length > 1 && showCircle) {
      const currentPos = getPointOnPath(pathProgressRef.current, pathPoints);

      // Outer circle
      ctx.save();
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(currentPos.x, currentPos.y, outerCircleRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Outer pen
      const outerPenX =
        currentPos.x + Math.cos(outerAngleRef.current) * outerPenDistance;
      const outerPenY =
        currentPos.y + Math.sin(outerAngleRef.current) * outerPenDistance;
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(outerPenX, outerPenY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Line from center to outer pen
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(currentPos.x, currentPos.y);
      ctx.lineTo(outerPenX, outerPenY);
      ctx.stroke();

      // Inner circle and pen (if enabled)
      if (innerCircleEnabled) {
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(outerPenX, outerPenY, innerCircleRadius, 0, Math.PI * 2);
        ctx.stroke();

        const innerPenX =
          outerPenX + Math.cos(innerAngleRef.current) * innerPenDistance;
        const innerPenY =
          outerPenY + Math.sin(innerAngleRef.current) * innerPenDistance;

        // Inner pen
        ctx.fillStyle = "#3b82f6";
        ctx.beginPath();
        ctx.arc(innerPenX, innerPenY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Line from outer pen to inner pen
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(outerPenX, outerPenY);
        ctx.lineTo(innerPenX, innerPenY);
        ctx.stroke();
      }
      ctx.restore();
    }
  }, [
    canvasRef,
    pathPoints,
    isAnimating,
    outerCircleRadius,
    outerPenDistance,
    penStyle,
    penSize,
    innerCircleEnabled,
    innerCircleRadius,
    innerPenDistance,
    lineColor,
    showCircle,
  ]);

  // Animation effect for spirograph
  useEffect(() => {
    if (!isAnimating || pathPoints.length < 2) return;

    let isCancelled = false;

    const animate = () => {
      if (isCancelled) return;

      pathProgressRef.current += speed / 1000;
      if (pathProgressRef.current >= 1) {
        pathProgressRef.current = 0;
      }

      outerAngleRef.current += 0.1;
      innerAngleRef.current += 0.15;

      const currentPos = getPointOnPath(pathProgressRef.current, pathPoints);
      const outerPenX =
        currentPos.x + Math.cos(outerAngleRef.current) * outerPenDistance;
      const outerPenY =
        currentPos.y + Math.sin(outerAngleRef.current) * outerPenDistance;

      if (innerCircleEnabled) {
        const innerPenX =
          outerPenX + Math.cos(innerAngleRef.current) * innerPenDistance;
        const innerPenY =
          outerPenY + Math.sin(innerAngleRef.current) * innerPenDistance;
        spirographPointsRef.current.push({ x: innerPenX, y: innerPenY });
      } else {
        spirographPointsRef.current.push({ x: outerPenX, y: outerPenY });
      }

      // Limit the number of points to avoid memory bloat
      if (spirographPointsRef.current.length > 10000) {
        spirographPointsRef.current = spirographPointsRef.current.slice(-10000);
      }

      setPathPoints((prev) => [...prev]);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      isCancelled = true;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [
    isAnimating,
    pathPoints,
    speed,
    outerPenDistance,
    innerCircleEnabled,
    innerPenDistance,
    setPathPoints,
  ]);

  // Instant draw function for button (continues from last progress)
  const instantDrawSpirograph = () => {
    if (pathPoints.length < 2) {
      alert("Please draw a path with at least 2 points!");
      return;
    }
    const totalSteps = 1000;
    let localPathProgress = 0;
    let localOuterAngle = outerAngleRef.current;
    let localInnerAngle = innerAngleRef.current;

    for (let i = 0; i < totalSteps; i++) {
      localPathProgress = i / totalSteps;
      localOuterAngle += 0.1;
      localInnerAngle += 0.15;

      const currentPos = getPointOnPath(localPathProgress, pathPoints);
      const outerPenX =
        currentPos.x + Math.cos(localOuterAngle) * outerPenDistance;
      const outerPenY =
        currentPos.y + Math.sin(localOuterAngle) * outerPenDistance;

      if (innerCircleEnabled) {
        const innerPenX =
          outerPenX + Math.cos(localInnerAngle) * innerPenDistance;
        const innerPenY =
          outerPenY + Math.sin(localInnerAngle) * innerPenDistance;
        spirographPointsRef.current.push({ x: innerPenX, y: innerPenY });
      } else {
        spirographPointsRef.current.push({ x: outerPenX, y: outerPenY });
      }
    }
    pathProgressRef.current = 1;
    outerAngleRef.current = localOuterAngle;
    innerAngleRef.current = localInnerAngle;

    setIsAnimating(false);
    setPathPoints((prev) => [...prev]);
  };

  const resetDrawing = () => {
    setIsAnimating(false);
    spirographPointsRef.current = [];
    pathProgressRef.current = 0;
    outerAngleRef.current = 0;
    innerAngleRef.current = 0;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const clearDrawing = () => {
    spirographPointsRef.current = [];
    setPathPoints((prev) => [...prev]);
  };

  const toggleAnimation = () => {
    if (pathPoints.length < 2) {
      alert("Please draw a path with at least 2 points!");
      return;
    }

    if (isAnimating) {
      setIsAnimating(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    setIsAnimating(true);
  };

  const exportImage = () => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = width;
    exportCanvas.height = height;
    const exportCtx = exportCanvas.getContext("2d");
    if (!exportCtx) return;

    exportCtx.fillStyle = backgroundColor;
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    if (spirographPointsRef.current.length > 0) {
      const points = spirographPointsRef.current;

      if (penStyle === "line" || penStyle === "dashes") {
        if (penStyle === "dashes") {
          exportCtx.setLineDash([10, 5]);
        }

        exportCtx.strokeStyle = lineColor;
        exportCtx.lineWidth = penSize;
        exportCtx.lineCap = "round";
        exportCtx.lineJoin = "round";

        exportCtx.beginPath();
        exportCtx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          exportCtx.lineTo(points[i].x, points[i].y);
        }
        exportCtx.stroke();
      } else if (
        penStyle === "dots" ||
        penStyle === "circles" ||
        penStyle === "squares"
      ) {
        exportCtx.fillStyle = lineColor;
        points.forEach((point) => {
          if (penStyle === "dots") {
            exportCtx.beginPath();
            exportCtx.arc(point.x, point.y, penSize / 2, 0, Math.PI * 2);
            exportCtx.fill();
          } else if (penStyle === "circles") {
            exportCtx.strokeStyle = lineColor;
            exportCtx.lineWidth = 1;
            exportCtx.beginPath();
            exportCtx.arc(point.x, point.y, penSize, 0, Math.PI * 2);
            exportCtx.stroke();
          } else if (penStyle === "squares") {
            exportCtx.fillRect(
              point.x - penSize / 2,
              point.y - penSize / 2,
              penSize,
              penSize
            );
          }
        });
      }
    }

    const link = document.createElement("a");
    link.download = `spirograph-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };

  return {
    resetDrawing,
    clearDrawing,
    toggleAnimation,
    exportImage,
    isAnimating,
    instantDrawSpirograph,
    spirographPointsRef,
  };
}
