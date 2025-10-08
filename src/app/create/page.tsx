"use client";

import { GridType, PenStyle } from "@/types";
import Link from "next/link";
import { useCanvas } from "@/hooks/useCanvas";
import Collapsible from "@/components/Collapsible";
import IconButton from "@/components/IconButton";
import CustomSlider from "@/components/Slider";
import CustomSwitch from "@/components/Switch";
import { INSTRUCTIONS, PRESET_BUTTONS } from "@/helpers/variables";
import { Button } from "@/components/Button";
import CustomPopover from "@/components/Popover";
import { useControls } from "@/hooks/useControls";
import { useDrawing } from "@/hooks/useDrawing";
import GridCanvas from "@/components/GridCanvas";
import CustomTabs from "@/components/Tabs";
import dynamic from "next/dynamic";
import { usePath } from "@/hooks/usePath";
import Image from "next/image";
const ColorPicker = dynamic(() => import("@/components/ColorPicker"), {
  ssr: false,
});

export default function CreatePage() {
  const {
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
    setShowGrid,
    setSnapToGrid,
    showGrid,
    gridSize,
    setGridSize,
    snapToGrid,
    backgroundColor,
    setBackgroundColor,
  } = useControls();

  const { containerRef, canvasRef, pathCanvasRef } = useCanvas();

  const {
    pathPoints,
    setPathPoints,
    handleCanvasClick,
    setPresetPath,
    resetPath,
    canRedo,
    canUndo,
    redo,
    undo,
  } = usePath({
    canvasRef: pathCanvasRef,
    controls: {
      showPath,
      gridSize,
      snapToGrid,
      gridType: showGrid.type,
    },
  });

  const {
    clearDrawing,
    exportImage,
    toggleAnimation,
    isAnimating,
    instantDrawSpirograph,
  } = useDrawing({
    containerRef,
    canvasRef,
    controls: {
      showCircle,
      speed,
      outerCircleRadius,
      outerPenDistance,
      innerCircleEnabled,
      innerCircleRadius,
      innerPenDistance,
      penStyle,
      penSize,
      lineColor,
      backgroundColor,
    },
    pathPoints,
    setPathPoints,
  });

  const resetAll = () => {
    resetPath();
    clearDrawing();
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full px-4 py-3 border-b border-border">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-primary hover:underline transition-colors"
          style={{ cursor: "pointer" }}
        >
          <Image
            src="/logo.svg"
            alt="SpiroStudio Logo"
            width={32}
            height={32}
            className="inline-block"
            />
          SpiroStudio
        </Link>
      </div>
      <div className="flex flex-col-reverse items-center justify-center h-[calc(100%-57px)] w-full md:flex-row md:pr-3 md:gap-3">
        {/* Controls */}
        <div className="grid grid-rows-[auto_1fr] w-full max-w-[360px] h-full">
          {/* Top Buttons */}
          <div className="w-full flex items-center gap-4 px-4 py-2">
            <h2 className="text-xl font-semibold">Controls</h2>
            <CustomPopover
              title="How to use"
              popupClassName="bg-white p-4 border border-gray-300 rounded shadow-lg"
              trigger={
                <div
                  className="flex items-center justify-center w-6 h-6 mr-4 mt-[2px] border rounded-full  text-sm"
                  style={{ padding: 4 }}
                >
                  ?
                </div>
              }
            >
              <ol className="list-decimal pl-5 space-y-1">
                {INSTRUCTIONS.map((item) => (
                  <li key={item} className="text-sm text-gray-700">
                    {item}
                  </li>
                ))}
              </ol>
            </CustomPopover>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 gap-2 items-center overflow-auto p-4 pb-6">
            {/* Path Presets */}
            <h3 className="control-section-header">Path Presets</h3>
            {PRESET_BUTTONS.map(({ label, icon: Icon, preset }) => (
              <Button key={preset} onClick={() => setPresetPath(preset)}>
                <span className="inline-flex items-center gap-1 text-sm">
                  <Icon />
                  {label}
                </span>
              </Button>
            ))}

            <hr className="control-divider" />

            {/* Display Options */}
            <h3 className="control-section-header">Display Options</h3>
            <Button
              className="col-span-2 text-sm flex items-center gap-2 mb-2"
              type="button"
              onClick={() => {
                const allOn = showCircle && showPath && showGrid && snapToGrid;
                setShowCircle(!allOn);
                setShowPath(!allOn);
                setShowGrid({
                  enabled: !allOn,
                  type: "grid",
                });
                setSnapToGrid(!allOn);
              }}
            >
              {showCircle && showPath && showGrid && snapToGrid ? (
                <>
                  <span className="inline-flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Toggle All Off
                  </span>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Toggle All On
                  </span>
                </>
              )}
            </Button>
            <label htmlFor="show-circle" className="control-label">
              Show Circle
            </label>
            <CustomSwitch
              id="show-circle"
              checked={showCircle}
              onCheckedChange={setShowCircle}
            />
            <label htmlFor="show-path" className="control-label">
              Show Path
            </label>
            <CustomSwitch
              id="show-path"
              checked={showPath}
              onCheckedChange={setShowPath}
            />
            <label htmlFor="show-grid" className="control-label">
              Show Grid
            </label>
            <CustomSwitch
              id="show-grid"
              checked={showGrid.enabled}
              onCheckedChange={(value) =>
                setShowGrid((prev) => ({ enabled: value, type: prev.type }))
              }
            />
            <label htmlFor="snap-to-grid" className="control-label">
              Snap to Grid
            </label>
            <CustomSwitch
              id="snap-to-grid"
              checked={snapToGrid}
              onCheckedChange={setSnapToGrid}
            />
            {(showGrid.enabled || snapToGrid) && (
              <>
                {/* Grid Type */}
                <label className="control-label">Grid Type</label>
                <CustomTabs
                  items={[
                    { label: "Grid", value: "grid" },
                    { label: "Columns", value: "columns" },
                    { label: "Rows", value: "rows" },
                  ]}
                  value={showGrid.type}
                  onChange={(value) =>
                    setShowGrid((prev) => ({
                      enabled: prev.enabled,
                      type: value as GridType,
                    }))
                  }
                />

                {/* Grid Size */}
                <label htmlFor="grid-size-slider" className="control-label">
                  Grid Size
                </label>
                <CustomSlider
                  id="grid-size-slider"
                  min={16}
                  max={64}
                  step={4}
                  value={[gridSize]}
                  unit="px"
                  onValueChange={(value) => setGridSize((value as number[])[0])}
                  style={{ flex: 1 }}
                />
              </>
            )}

            <hr className="control-divider" />

            <h3 className="control-section-header">Circle Configuration</h3>

            <div className="col-span-2 text-sm font-semibold">Outer Circle</div>

            <label htmlFor="outer-radius-slider" className="control-label">
              Radius
            </label>
            <CustomSlider
              id="outer-radius-slider"
              min={20}
              max={95}
              step={5}
              unit="px"
              value={[outerCircleRadius]}
              onValueChange={(value) =>
                setOuterCircleRadius((value as number[])[0])
              }
            />

            <label htmlFor="inner-distance-slider" className="control-label">
              Pen Distance
            </label>
            <CustomSlider
              id="inner-distance-slider"
              min={10}
              max={outerCircleRadius}
              step={5}
              unit="px"
              value={[outerPenDistance]}
              onValueChange={(value) =>
                setOuterPenDistance((value as number[])[0])
              }
            />

            <label
              htmlFor="inner-circle-switch"
              className="mt-3 text-sm font-semibold"
            >
              Inner Circle
            </label>
            <div className="mt-3">
              <CustomSwitch
                id="inner-circle-switch"
                checked={innerCircleEnabled}
                onCheckedChange={setInnerCircleEnabled}
              />
            </div>

            {innerCircleEnabled && (
              <>
                <label htmlFor="inner-radius-slider" className="control-label">
                  Radius
                </label>
                <CustomSlider
                  id="inner-radius-slider"
                  min={15}
                  max={outerCircleRadius / 2}
                  step={5}
                  unit="px"
                  value={[innerCircleRadius]}
                  onValueChange={(value) =>
                    setInnerCircleRadius((value as number[])[0])
                  }
                />

                <label
                  htmlFor="inner-distance-slider"
                  className="control-label"
                >
                  Pen Distance
                </label>
                <CustomSlider
                  id="inner-distance-slider"
                  min={10}
                  max={innerCircleRadius}
                  step={5}
                  unit="px"
                  value={[innerPenDistance]}
                  onValueChange={(value) =>
                    setInnerPenDistance((value as number[])[0])
                  }
                />
              </>
            )}

            <hr className="control-divider" />

            <h3 className="control-section-header">Draw Styles</h3>

            {/* Background */}
            <label htmlFor="background-color" className="control-label">
              Background
            </label>
            <ColorPicker
              id="background-color"
              value={backgroundColor}
              setValue={setBackgroundColor}
            />

            {/* Pen Color */}
            <label htmlFor="pen-color" className="control-label">
              Pen Color
            </label>
            <ColorPicker
              id="pen-color"
              value={lineColor}
              setValue={setLineColor}
            />

            {/* Line Style */}
            <label htmlFor="line-style" className="control-label">
              Line Style
            </label>
            <select
              id="line-style"
              className="max-w-32 border border-gray-400 rounded px-2 py-1 text-xs"
              value={penStyle}
              onChange={(e) => setPenStyle(e.target.value as PenStyle)}
            >
              <option value="line">Line</option>
              <option value="dots">Dots</option>
              <option value="dashes">Dashes</option>
              <option value="circles">Circles</option>
              <option value="squares">Squares</option>
            </select>

            {/* Pen Size */}
            <label htmlFor="pen-size" className="control-label">
              Size
            </label>
            <CustomSlider
              id="pen-size"
              min={1}
              max={10}
              step={1}
              unit="px"
              value={[penSize]}
              onValueChange={(value) => setPenSize((value as number[])[0])}
              style={{ width: 100 }}
            />

            <label htmlFor="speed-slider" className="control-label">
              Speed
            </label>
            <CustomSlider
              id="speed-slider"
              min={0.5}
              max={3}
              step={0.5}
              value={[speed]}
              unit="x"
              onValueChange={(value) => setSpeed((value as number[])[0])}
              style={{ flex: 1 }}
            />
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={containerRef}
          className="relative grid h-[calc(100%-24px)] w-full"
        >
          <GridCanvas
            showGrid={showGrid.enabled}
            showSnap={snapToGrid}
            type={showGrid.type}
            gridSize={gridSize}
            containerRef={containerRef}
            backgroundColor={backgroundColor}
          />

          <canvas
            ref={pathCanvasRef}
            className="w-full h-full [grid-area:1/1] bg-transparent"
            style={{ top: 0, left: 0 }}
            onClick={isAnimating ? undefined : handleCanvasClick}
          />
          <canvas
            ref={canvasRef}
            className="relative pointer-events-none w-full border border-border rounded-lg cursor-crosshair bg-transparent [grid-area:1/1] z-20"
          />
          <div className="absolute top-4 left-4">
            <Collapsible defaultOpen>
              <div className="relative flex gap-3 z-100 md:gap-5">
                {/* Playback Controls */}
                <div className="canvas-button-group">
                  <IconButton
                    icon={"SkipForward"}
                    tooltip={"Instant Draw"}
                    onClick={instantDrawSpirograph}
                    bgColor="white"
                  />
                  <IconButton
                    icon={isAnimating ? "Pause" : "Play"}
                    tooltip={isAnimating ? "Pause" : "Play"}
                    onClick={toggleAnimation}
                    bgColor="white"
                  />
                </div>
                {/* Editing Controls */}
                <div className="canvas-button-group">
                  <IconButton
                    icon="Undo"
                    tooltip="Undo"
                    onClick={undo}
                    bgColor="white"
                    disabled={!canUndo}
                  />
                  <IconButton
                    icon="Redo"
                    tooltip="Redo"
                    onClick={redo}
                    bgColor="white"
                    disabled={!canRedo}
                  />
                  <IconButton
                    icon="LineSquiggle"
                    tooltip="Clear Drawing"
                    onClick={clearDrawing}
                    bgColor="#ecc1c1"
                  />
                  <IconButton
                    icon="RefreshCcw"
                    tooltip="Clear All"
                    bgColor="#ecc1c1"
                    onClick={resetAll}
                  />
                </div>
                {/* Export Controls */}
                <div className="canvas-button-group">
                  <IconButton
                    icon="Download"
                    tooltip="Export PNG"
                    onClick={exportImage}
                    bgColor="white"
                  />
                </div>
              </div>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
}
