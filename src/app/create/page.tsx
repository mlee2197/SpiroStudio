"use client";

import { useRef, useState } from "react";
import SpiroControls from "./SpiroControls";
import { PenStyle, Point } from "@/types";
import SpiroCanvas from "./SpiroCanvas";
import Link from "next/link";

export default function CreatePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [pathPoints, setPathPoints] = useState<Point[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const [outerCircleRadius, setOuterCircleRadius] = useState(50);
  const [outerPenDistance, setOuterPenDistance] = useState(30);
  const [outerPenStyle, setOuterPenStyle] = useState<PenStyle>("line");
  const [outerPenSize, setOuterPenSize] = useState(2);

  const [innerCircleEnabled, setInnerCircleEnabled] = useState(false);
  const [innerCircleRadius, setInnerCircleRadius] = useState(30);
  const [innerPenDistance, setInnerPenDistance] = useState(20);

  const [speed, setSpeed] = useState(2);

  const [lineColor, setLineColor] = useState("#3b82f6");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const [instantDraw, setInstantDraw] = useState(false);
  const [showCircle, setShowCircle] = useState(true);
  const [showPath, setShowPath] = useState(true);

  const animationRef = useRef<number>(null);
  const spirographPointsRef = useRef<Point[]>([]);
  const pathProgressRef = useRef(0);
  const outerAngleRef = useRef(0);
  const innerAngleRef = useRef(0);

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

  const clearSpirograph = () => {
    spirographPointsRef.current = [];
    setPathPoints([...pathPoints]);
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary canvas to export only the spirograph (without UI elements)
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext("2d");
    if (!exportCtx) return;

    exportCtx.fillStyle = backgroundColor;
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Draw the spirograph pattern
    if (spirographPointsRef.current.length > 0) {
      const points = spirographPointsRef.current;
      const penStyle = outerPenStyle;
      const penSize = outerPenSize;

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

    // Download the image
    const link = document.createElement("a");
    link.download = `spirograph-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full px-4 py-3 border-b border-border">
        <Link
          href="/"
          className="text-2xl font-bold text-primary hover:underline transition-colors"
          style={{ cursor: "pointer" }}
        >
          SpiroStudio
        </Link>
      </div>
      <div className="flex flex-col-reverse items-center justify-center h-[calc(100%-57px)] w-full md:pr-4 md:flex-row">
        <SpiroControls
          showCircle={showCircle}
          showPath={showPath}
          instantDraw={instantDraw}
          speed={speed}
          outerCircleRadius={outerCircleRadius}
          outerPenDistance={outerPenDistance}
          outerPenStyle={outerPenStyle}
          outerPenSize={outerPenSize}
          innerCircleEnabled={innerCircleEnabled}
          innerCircleRadius={innerCircleRadius}
          innerPenDistance={innerPenDistance}
          lineColor={lineColor}
          backgroundColor={backgroundColor}
          setPathPoints={setPathPoints}
          setLineColor={setLineColor}
          setBackgroundColor={setBackgroundColor}
          setShowCircle={setShowCircle}
          setShowPath={setShowPath}
          setInstantDraw={setInstantDraw}
          setSpeed={setSpeed}
          setOuterCircleRadius={setOuterCircleRadius}
          setOuterPenDistance={setOuterPenDistance}
          setOuterPenStyle={setOuterPenStyle}
          setOuterPenSize={setOuterPenSize}
          setInnerCircleEnabled={setInnerCircleEnabled}
          setInnerCircleRadius={setInnerCircleRadius}
          setInnerPenDistance={setInnerPenDistance}

        />

        <SpiroCanvas
          canvasRef={canvasRef}
          pathPoints={pathPoints}
          setPathPoints={setPathPoints}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          speed={speed}
          instantDraw={instantDraw}
          showCircle={showCircle}
          showPath={showPath}
          outerCircleRadius={outerCircleRadius}
          outerPenDistance={outerPenDistance}
          outerPenStyle={outerPenStyle}
          outerPenSize={outerPenSize}
          innerCircleEnabled={innerCircleEnabled}
          innerCircleRadius={innerCircleRadius}
          innerPenDistance={innerPenDistance}
          lineColor={lineColor}
          backgroundColor={backgroundColor}
          spirographPointsRef={spirographPointsRef}
          pathProgressRef={pathProgressRef}
          outerAngleRef={outerAngleRef}
          innerAngleRef={innerAngleRef}
          animationRef={animationRef}
          toggleAnimation={toggleAnimation}
          onErase={clearSpirograph}
          onRefresh={reset}
          onExport={exportImage}
        />
      </div>
    </div>
  );
}
