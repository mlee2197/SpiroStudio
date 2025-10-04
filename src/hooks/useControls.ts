import { useState } from "react";
import { ColorType, GridType, PenStyle } from "@/types";
import { RGBColor } from "react-color";

export function useControls() {
  // Path and drawing controls
  const [showCircle, setShowCircle] = useState(true);
  const [showPath, setShowPath] = useState(true);
  const [showGrid, setShowGrid] = useState({
    enabled: false,
    type: "grid" as GridType,
  });
  const [gridSize, setGridSize] = useState(32);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Outer circle controls
  const [outerCircleRadius, setOuterCircleRadius] = useState(80);
  const [outerPenDistance, setOuterPenDistance] = useState(40);

  // Inner circle controls
  const [innerCircleEnabled, setInnerCircleEnabled] = useState(false);
  const [innerCircleRadius, setInnerCircleRadius] = useState(40);
  const [innerPenDistance, setInnerPenDistance] = useState(20);

  // Pen and style controls
  const [penStyle, setPenStyle] = useState<PenStyle>("line");
  const [penSize, setPenSize] = useState(2);
  const [lineColor, setLineColor] = useState("#000000");

  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  return {
    showCircle,
    setShowCircle,
    showPath,
    setShowPath,
    speed,
    setSpeed,
    outerCircleRadius,
    setOuterCircleRadius,
    outerPenDistance,
    setOuterPenDistance,
    innerCircleEnabled,
    setInnerCircleEnabled,
    innerCircleRadius,
    setInnerCircleRadius,
    innerPenDistance,
    setInnerPenDistance,
    penStyle,
    setPenStyle,
    penSize,
    setPenSize,
    lineColor,
    setLineColor,
    showGrid,
    setShowGrid,
    gridSize,
    setGridSize,
    snapToGrid,
    setSnapToGrid,
    backgroundColor,
    setBackgroundColor,
  };
}
