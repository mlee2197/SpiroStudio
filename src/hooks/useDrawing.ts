import { useRef, useState, useEffect } from "react";
import type { PathPreset, Point } from "@/types";
import { generatePresetPath, getPointOnPath } from "@/helpers/CanvasUtils";

interface UseDrawingProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  controls: {
    showCircle: boolean;
    showPath: boolean;
    instantDraw: boolean;
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
}

export function useDrawing({ canvasRef, controls }: UseDrawingProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [pathPoints, setPathPoints] = useState<Point[]>([]);
  const animationRef = useRef<number>(null);

  // Refs for spirograph state
  const spirographPointsRef = useRef<Point[]>([]);
  const pathProgressRef = useRef(0);
  const outerAngleRef = useRef(0);
  const innerAngleRef = useRef(0);

  const {
    showCircle,
    showPath,
    instantDraw,
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

  /**
   * This useEffect is responsible for rendering the entire canvas whenever any relevant state changes.
   * It:
   *  - Clears and fills the canvas with the background color.
   *  - Draws the user-defined path (if showPath is true).
   *  - Draws the spirograph trail (the animated or instant-drawn pattern).
   *  - Draws the current animation state: outer circle, outer pen, and (if enabled) inner circle and pen.
   */
  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx = context;

    // Helper: Draw the user path (polygon, etc)
    function drawPath() {
      if (pathPoints.length === 0 || !showPath) return;
      ctx.save();
      ctx.strokeStyle = "#888";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
      for (let i = 1; i < pathPoints.length; i++) {
        ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
      }
      if (pathPoints.length > 1) {
        ctx.lineTo(pathPoints[0].x, pathPoints[0].y);
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
    }

    // Helper: Draw the spirograph trail
    function drawSpirographTrail() {
      const points = spirographPointsRef.current;
      if (!points || points.length === 0) return;
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

    // Helper: Draw the current animation state (outer/inner circles and pens)
    function drawAnimationState() {
      if (!isAnimating || pathPoints.length <= 1 || !showCircle) return;
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

    // --- Main drawing routine ---
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawPath();
    drawSpirographTrail();
    drawAnimationState();
  }, [
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
    backgroundColor,
    showCircle,
    showPath,
  ]);
  /**
   * This effect handles the animation of the spirograph drawing.
   *
   * - If `instantDraw` is true, it draws the entire spirograph in one go (for preview or instant rendering).
   * - Otherwise, it animates the drawing step by step using requestAnimationFrame.
   * - It updates the spirograph points, angles, and path progress, and triggers a re-render by updating pathPoints.
   * - It also ensures that the animation frame is properly cleaned up when the effect is re-run or the component unmounts.
   */
  useEffect(() => {
    if (!isAnimating || pathPoints.length < 2) return;

    let isCancelled = false;

    const animate = () => {
      if (isCancelled) return;

      if (instantDraw) {
        const totalSteps = 1000;
        // Reset spirograph points for instant draw
        spirographPointsRef.current = [];
        // Reset angles and progress for a clean instant draw
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
        // Update refs to match the last state for consistency
        pathProgressRef.current = 1;
        outerAngleRef.current = localOuterAngle;
        innerAngleRef.current = localInnerAngle;

        setIsAnimating(false);
        setPathPoints([...pathPoints]);
        return;
      }

      // Normal animation mode
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

      setPathPoints([...pathPoints]);

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
    instantDraw,
  ]);

  const reset = () => {
    setIsAnimating(false);
    setPathPoints([]);
    spirographPointsRef.current = [];
    pathProgressRef.current = 0;
    outerAngleRef.current = 0;
    innerAngleRef.current = 0;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

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

  const clearSpirograph = () => {
    spirographPointsRef.current = [];
    setPathPoints([...pathPoints]);
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `spirograph-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isAnimating || !canvasRef?.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPathPoints([...pathPoints, { x, y }]);
  };

  return {
    reset,
    setPresetPath,
    toggleAnimation,
    clearSpirograph,
    exportImage,
    handleCanvasClick,
    isAnimating,
  };
}
