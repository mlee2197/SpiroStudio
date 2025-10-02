import Collapsible from "@/components/Collapsible";
import IconButton from "@/components/IconButton";
import { getPointOnPath } from "@/helpers/CanvasUtils";
import { PenStyle, Point } from "@/types";
import React, { useEffect } from "react";

export interface SpiroCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  pathPoints: Point[];
  setPathPoints: (points: Point[]) => void;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  speed: number;
  instantDraw: boolean;
  showCircle: boolean;
  showPath: boolean;
  outerCircleRadius: number;
  outerPenDistance: number;
  outerPenStyle: PenStyle;
  outerPenSize: number;
  innerCircleEnabled: boolean;
  innerCircleRadius: number;
  innerPenDistance: number;
  lineColor: string;
  backgroundColor: string;
  spirographPointsRef: React.RefObject<Point[]>;
  pathProgressRef: React.RefObject<number>;
  outerAngleRef: React.RefObject<number>;
  innerAngleRef: React.RefObject<number>;
  animationRef: React.RefObject<number | null>;
  toggleAnimation: () => void;
  onErase: () => void;
  onRefresh: () => void;
  onExport: () => void;
}

export default function SpiroCanvas({
  canvasRef,
  pathPoints,
  setPathPoints,
  isAnimating,
  setIsAnimating,
  speed,
  instantDraw,
  showCircle,
  showPath,
  outerCircleRadius,
  outerPenDistance,
  outerPenStyle,
  outerPenSize,
  innerCircleEnabled,
  innerCircleRadius,
  innerPenDistance,
  lineColor,
  backgroundColor,
  spirographPointsRef,
  pathProgressRef,
  outerAngleRef,
  innerAngleRef,
  animationRef,
  toggleAnimation,
  onErase,
  onRefresh,
  onExport,
}: SpiroCanvasProps) {
  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw path
    if (pathPoints.length > 0 && showPath) {
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

      pathPoints.forEach((point, i) => {
        ctx.fillStyle = i === 0 ? "#22c55e" : "#888";
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw spirograph trail
    if (spirographPointsRef.current.length > 0) {
      const points = spirographPointsRef.current;
      const penStyle = outerPenStyle;
      const penSize = outerPenSize;

      if (penStyle === "line" || penStyle === "dashes") {
        if (penStyle === "dashes") {
          ctx.setLineDash([10, 5]);
        }

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
        ctx.fillStyle = lineColor;
        points.forEach((point) => {
          if (penStyle === "dots") {
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
            ctx.fillRect(
              point.x - penSize / 2,
              point.y - penSize / 2,
              penSize,
              penSize
            );
          }
        });
      }
    }

    if (isAnimating && pathPoints.length > 1 && showCircle) {
      const currentPos = getPointOnPath(pathProgressRef.current, pathPoints);

      // Draw outer circle
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(currentPos.x, currentPos.y, outerCircleRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Calculate outer pen position
      const outerPenX =
        currentPos.x + Math.cos(outerAngleRef.current) * outerPenDistance;
      const outerPenY =
        currentPos.y + Math.sin(outerAngleRef.current) * outerPenDistance;

      // Draw outer pen
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(outerPenX, outerPenY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#666";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(currentPos.x, currentPos.y);
      ctx.lineTo(outerPenX, outerPenY);
      ctx.stroke();

      if (innerCircleEnabled) {
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(outerPenX, outerPenY, innerCircleRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Calculate inner pen position (relative to outer pen position)
        const innerPenX =
          outerPenX + Math.cos(innerAngleRef.current) * innerPenDistance;
        const innerPenY =
          outerPenY + Math.sin(innerAngleRef.current) * innerPenDistance;

        // Draw inner pen
        ctx.fillStyle = "#3b82f6";
        ctx.beginPath();
        ctx.arc(innerPenX, innerPenY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#999";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(outerPenX, outerPenY);
        ctx.lineTo(innerPenX, innerPenY);
        ctx.stroke();
      }
    }
  }, [
    pathPoints,
    isAnimating,
    outerCircleRadius,
    outerPenDistance,
    outerPenStyle,
    outerPenSize,
    innerCircleEnabled,
    innerCircleRadius,
    innerPenDistance,
    lineColor,
    backgroundColor,
    showCircle,
    showPath,
  ]);

  useEffect(() => {
    if (!isAnimating || pathPoints.length < 2) return;

    const animate = () => {
      if (instantDraw) {
        const totalSteps = 1000;
        for (let i = 0; i < totalSteps; i++) {
          pathProgressRef.current = i / totalSteps;
          outerAngleRef.current += 0.1;
          innerAngleRef.current += 0.15;

          const currentPos = getPointOnPath(
            pathProgressRef.current,
            pathPoints
          );
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
        }
        setIsAnimating(false);
        setPathPoints([...pathPoints]);
        return;
      }

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

      if (spirographPointsRef.current.length > 10000) {
        spirographPointsRef.current = spirographPointsRef.current.slice(-10000);
      }

      setPathPoints([...pathPoints]);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
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

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isAnimating || !canvasRef?.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setPathPoints([...pathPoints, { x, y }]);
  };

  return (
    <div className="relative w-full flex-grow">
      <div className="absolute top-4 left-4">
        <Collapsible defaultOpen>
          <div className="flex gap-2">
            <IconButton
              icon={isAnimating ? "Pause" : "Play"}
              tooltip={isAnimating ? "Pause" : "Play"}
              onClick={toggleAnimation}
            />
            <IconButton icon="Eraser" tooltip="Erase" onClick={onErase} />
            <IconButton
              icon="RefreshCcw"
              tooltip="Refresh"
              bgColor="#ecc1c1"
              onClick={onRefresh}
            />
            <IconButton icon="Download" tooltip="Export" onClick={onExport} />
          </div>
        </Collapsible>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full border border-border rounded-lg cursor-crosshair"
        style={{ backgroundColor }}
        onClick={handleCanvasClick}
      />
    </div>
  );
}
