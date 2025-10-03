"use client";

import { PenStyle } from "@/types";
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
    snapToGrid,
    backgroundColor,
    setBackgroundColor,
  } = useControls();

  const { containerRef, canvasRef } = useCanvas();

  const {
    clearSpirograph,
    exportImage,
    handleCanvasClick,
    reset,
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
      <div className="flex flex-col-reverse items-center justify-center h-[calc(100%-57px)] w-full md:pr-4 md:flex-row">
        {/* Controls */}
        <div className="grid grid-rows-[40px_1fr] gap-4 w-full max-w-[360px] h-full p-4">
          {/* Top Buttons */}
          <div className="w-full flex items-center justify-between mb-4">
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
          <div className="overflow-auto pb-6">
            {/* Path Presets */}
            <div className="grid grid-cols-2 gap-2 p-1 overflow-hidden">
              <h3 className="col-span-2 text-base font-semibold">
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

            <hr className="my-8" />

            {/* Playback Options */}
            <div className="grid grid-cols-[40%_60%] items-center gap-4 overflow-hidden">
              <h3 className="col-span-2 text-base font-semibold">
                Playback Options
              </h3>
              <Button
                className="col-span-2 text-sm flex items-center gap-2"
                type="button"
                onClick={() => {
                  const allOn =
                    showCircle && showPath && showGrid && snapToGrid;
                  setShowCircle(!allOn);
                  setShowPath(!allOn);
                  setShowGrid(!allOn);
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
              {/* <label htmlFor="show-grid" className="text-sm font-medium">
                Show Grid
              </label>
              <CustomSwitch
                id="show-grid"
                checked={showGrid}
                onCheckedChange={setShowGrid}
              />
              <label htmlFor="snap-to-grid" className="text-sm font-medium">
                Snap to Grid
              </label>
              <CustomSwitch
                id="snap-to-grid"
                checked={snapToGrid}
                onCheckedChange={setSnapToGrid}
              /> */}
            </div>

            <hr className="my-8" />

            {/* Circle Config */}
            <div className="grid grid-cols-[27%_13%_60%] items-center gap-4 overflow-hidden">
              <h3 className="col-span-3 text-base font-semibold">
                Circle Configuration
              </h3>

              <div className="col-span-3 text-sm font-medium">Outer Circle</div>

              <label
                htmlFor="outer-radius-slider"
                className="text-sm font-medium"
              >
                Radius
              </label>
              <span className="border border-gray-300 rounded-sm text-xs p-1">
                {outerCircleRadius}px
              </span>
              <CustomSlider
                id="outer-radius-slider"
                min={20}
                max={120}
                step={5}
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
              <span className="border border-gray-300 rounded-sm text-xs p-1">
                {outerPenDistance}px
              </span>
              <CustomSlider
                id="inner-distance-slider"
                min={10}
                max={outerCircleRadius}
                step={5}
                value={[outerPenDistance]}
                onValueChange={(value) =>
                  setOuterPenDistance((value as number[])[0])
                }
              />
              <div className="col-span-3" />

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
                  <span className="border border-gray-300 rounded-sm text-xs p-1">
                    {innerCircleRadius}px
                  </span>
                  <CustomSlider
                    id="inner-radius-slider"
                    min={15}
                    max={outerCircleRadius / 2}
                    step={5}
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
                  <span className="border border-gray-300 rounded-sm text-xs p-1">
                    {innerPenDistance}px
                  </span>
                  <CustomSlider
                    id="inner-distance-slider"
                    min={10}
                    max={innerCircleRadius}
                    step={5}
                    value={[innerPenDistance]}
                    onValueChange={(value) =>
                      setInnerPenDistance((value as number[])[0])
                    }
                  />
                </>
              )}
            </div>

            <hr className="my-8" />

            {/* Draw Styles */}
            <div className="grid grid-cols-2 gap-4 items-center overflow-hidden">
              <h3 className="col-span-2 text-base font-semibold">
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
              <div className="flex items-center gap-2">
                <span className="text-xs">{speed}x</span>
                <CustomSlider
                  id="speed-slider"
                  min={0.5}
                  max={3}
                  step={0.5}
                  value={[speed]}
                  onValueChange={(value) => setSpeed((value as number[])[0])}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div ref={containerRef} className="relative w-full flex-grow">
          <div className="absolute top-4 left-4">
            <Collapsible defaultOpen>
              <div className="flex gap-2">
                <IconButton
                  icon={"SkipForward"}
                  tooltip={"Instant Draw"}
                  onClick={instantDrawSpirograph}
                />
                <IconButton
                  icon={isAnimating ? "Pause" : "Play"}
                  tooltip={isAnimating ? "Pause" : "Play"}
                  onClick={toggleAnimation}
                />
                <IconButton
                  icon="Eraser"
                  tooltip="Clear Drawing"
                  onClick={clearSpirograph}
                />
                <IconButton
                  icon="RefreshCcw"
                  tooltip="Reset all"
                  bgColor="#ecc1c1"
                  onClick={reset}
                />
                <IconButton
                  icon="Download"
                  tooltip="Export PNG"
                  onClick={exportImage}
                />
              </div>
            </Collapsible>
          </div>
          <canvas
            ref={canvasRef}
            // width={800}
            // height={600}
            className="w-full border border-border rounded-lg cursor-crosshair"
            style={{ backgroundColor }}
            onClick={handleCanvasClick}
          />
        </div>
      </div>
    </div>
  );
}
