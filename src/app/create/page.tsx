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

  const { containerRef, canvasRef } = useCanvas();

  const {
    clearDrawing,
    exportImage,
    handleCanvasClick,
    resetAll,
    setPresetPath,
    toggleAnimation,
    isAnimating,
    instantDrawSpirograph,
  } = useDrawing({
    canvasRef,
    controls: {
      showCircle,
      showPath,
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
      snapToGrid,
      gridSize,
      gridType: showGrid.type,
    },
  });

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
      <div className="flex flex-col-reverse items-center justify-center h-[calc(100%-57px)] w-full md:flex-row">
        {/* Controls */}
        <div className="grid grid-rows-[40px_1fr] gap-4 w-full max-w-[360px] h-full">
          {/* Top Buttons */}
          <div className="w-full flex items-center justify-between p-2 pt-6">
            <h2 className="text-xl font-semibold">Controls</h2>
            <CustomPopover
              title="How to use"
              trigger={
                <div
                  className="mr-4 border rounded-full min-w-8 mt-[2px]"
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
          <div className="overflow-auto p-2 pb-6">
            {/* Path Presets */}
            <div className="grid grid-cols-2 gap-2 p-1 overflow-hidden">
              <h3 className="col-span-2 text-base text-secondary">
                Path Presets
              </h3>
              {PRESET_BUTTONS.map(({ label, icon: Icon, preset }) => (
                <Button key={preset} onClick={() => setPresetPath(preset)}>
                  <span className="inline-flex items-center gap-1">
                    <Icon />
                    {label}
                  </span>
                </Button>
              ))}
            </div>

            <hr className="my-4" />

            {/* Display Options */}
            <div className="grid grid-cols-[40%_60%] items-center gap-4 p-4 overflow-hidden">
              <h3 className="col-span-2 text-base text-secondary">
                Display Options
              </h3>
              <Button
                className="col-span-2 text-sm flex items-center gap-2"
                type="button"
                onClick={() => {
                  const allOn =
                    showCircle && showPath && showGrid && snapToGrid;
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
              <label htmlFor="show-circle" className="text-sm font-medium">
                Show Circle
              </label>
              <CustomSwitch
                id="show-circle"
                checked={showCircle}
                onCheckedChange={setShowCircle}
              />
              <label htmlFor="show-path" className="text-sm font-medium">
                Show Path
              </label>
              <CustomSwitch
                id="show-path"
                checked={showPath}
                onCheckedChange={setShowPath}
              />
              <label htmlFor="show-grid" className="text-sm font-medium">
                Show Grid
              </label>
              <CustomSwitch
                id="show-grid"
                checked={showGrid.enabled}
                onCheckedChange={(value) =>
                  setShowGrid((prev) => ({ enabled: value, type: prev.type }))
                }
              />
              <label htmlFor="snap-to-grid" className="text-sm font-medium">
                Snap to Grid
              </label>
              <CustomSwitch
                id="snap-to-grid"
                checked={snapToGrid}
                onCheckedChange={setSnapToGrid}
              />
              {showGrid.enabled && (
                <>
                  {/* Grid Type */}
                  <label htmlFor="show-grid" className="text-sm font-medium">
                    Grid Type
                  </label>
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
                  <label
                    htmlFor="grid-size-slider"
                    className="text-sm font-medium"
                  >
                    Grid Size
                  </label>
                  <CustomSlider
                    id="grid-size-slider"
                    min={16}
                    max={64}
                    step={4}
                    value={[gridSize]}
                    unit="px"
                    onValueChange={(value) =>
                      setGridSize((value as number[])[0])
                    }
                    style={{ flex: 1 }}
                  />
                </>
              )}
            </div>

            <hr className="my-4" />

            {/* Circle Config */}
            <div className="grid grid-cols-2 items-center gap-4 p-4 overflow-hidden">
              <h3 className="col-span-2 text-base text-secondary">
                Circle Configuration
              </h3>

              <div className="col-span-2 text-sm font-medium">Outer Circle</div>

              <label
                htmlFor="outer-radius-slider"
                className="text-sm font-medium"
              >
                Radius
              </label>
              <CustomSlider
                id="outer-radius-slider"
                min={20}
                max={120}
                step={5}
                unit="px"
                value={[outerCircleRadius]}
                onValueChange={(value) =>
                  setOuterCircleRadius((value as number[])[0])
                }
              />

              <label
                htmlFor="inner-distance-slider"
                className="text-sm font-medium"
              >
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
                className="text-sm font-medium"
              >
                Inner Circle
              </label>
              <CustomSwitch
                id="inner-circle-switch"
                checked={innerCircleEnabled}
                onCheckedChange={setInnerCircleEnabled}
              />
              <div />

              {innerCircleEnabled && (
                <>
                  <label
                    htmlFor="inner-radius-slider"
                    className="text-sm font-medium"
                  >
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
                    className="text-sm font-medium"
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
            </div>

            <hr className="my-4" />

            {/* Draw Styles */}
            <div className="grid grid-cols-2 gap-4 items-center p-4 overflow-hidden">
              <h3 className="col-span-2 text-base text-secondary">
                Draw Styles
              </h3>

              {/* Background */}
              <label htmlFor="background-color" className="text-sm font-medium">
                Background
              </label>
              <input
                id="background-color"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-full h-8 border rounded"
              />

              {/* Pen Color */}
              <label htmlFor="pen-color" className="text-sm font-medium">
                Pen Color
              </label>
              <input
                id="pen-color"
                type="color"
                value={lineColor}
                onChange={(e) => setLineColor(e.target.value)}
                className="w-full h-8 border rounded"
              />

              {/* Line Style */}
              <label htmlFor="line-style" className="text-sm font-medium">
                Line Style
              </label>
              <select
                id="line-style"
                className="max-w-32 border rounded px-2 py-1 text-sm"
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
              <label htmlFor="pen-size" className="text-sm font-medium">
                Size
              </label>
              <div className="flex items-center gap-2">
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
                <span className="border border-gray-300 rounded-sm text-xs p-1">
                  {penSize}px
                </span>
              </div>

              <label htmlFor="speed-slider" className="text-sm font-medium">
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
        </div>

        {/* Canvas */}
        <div ref={containerRef} className="relative w-full flex-grow">
          <GridCanvas
            show={showGrid.enabled}
            type={showGrid.type}
            gridSize={gridSize}
            containerRef={containerRef}
            backgroundColor={backgroundColor}
          />
          <canvas
            ref={canvasRef}
            // width={800}
            // height={600}
            className="relative w-full border border-border rounded-lg cursor-crosshair bg-transparent"
            onClick={handleCanvasClick}
          />
          <div className="absolute top-4 left-4">
            <Collapsible defaultOpen>
              <div className="flex gap-2">
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
                <IconButton
                  icon="Download"
                  tooltip="Export PNG"
                  onClick={exportImage}
                  bgColor="white"
                />
              </div>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
}
