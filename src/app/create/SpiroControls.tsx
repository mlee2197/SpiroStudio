import { Button } from "@/components/Button";
import IconButton from "@/components/IconButton";
import CustomPopover from "@/components/Popover";
import CustomSlider from "@/components/Slider";
import CustomSwitch from "@/components/Switch";
import { generatePresetPath } from "@/helpers/CanvasUtils";
import { PathPreset, PenStyle } from "@/types";
import {
  CircleIcon,
  EllipseIcon,
  PolygonIcon,
  SineIcon,
  SpiralIcon,
  SquareIcon,
  StarIcon,
} from "./PresetIcons";

export const PRESET_BUTTONS: {
  preset: PathPreset;
  label: string;
  icon: React.FC;
}[] = [
  { preset: "circle", label: "Circle", icon: CircleIcon },
  { preset: "ellipse", label: "Ellipse", icon: EllipseIcon },
  { preset: "square", label: "Square", icon: SquareIcon },
  { preset: "polygon", label: "Polygon", icon: PolygonIcon },
  { preset: "star", label: "Star", icon: StarIcon },
  { preset: "sine", label: "Sine Wave", icon: SineIcon },
  { preset: "spiral", label: "Spiral", icon: SpiralIcon },
];

const INSTRUCTIONS = [
  "Use path presets or click canvas to draw custom path",
  "Adjust outer circle size and pen position",
  "Toggle inner circle for nested spirograph effect",
  "Customize colors and pen styles",
  "Click 'Start Animation' to see the magic",
  "Export your creation as PNG",
];

interface SpiroControlsProps {
  showCircle: boolean;
  showPath: boolean;
  instantDraw: boolean;
  speed: number;
  outerCircleRadius: number;
  outerPenDistance: number;
  outerPenStyle: string;
  outerPenSize: number;
  innerCircleEnabled: boolean;
  innerCircleRadius: number;
  innerPenDistance: number;
  lineColor: string;
  backgroundColor: string;
  setPathPoints: (points: { x: number; y: number }[]) => void;
  setLineColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setShowCircle: (show: boolean) => void;
  setShowPath: (show: boolean) => void;
  setInstantDraw: (instant: boolean) => void;
  setSpeed: (speed: number) => void;
  setOuterCircleRadius: (radius: number) => void;
  setOuterPenDistance: (distance: number) => void;
  setOuterPenStyle: (style: PenStyle) => void;
  setOuterPenSize: (size: number) => void;
  setInnerCircleEnabled: (enabled: boolean) => void;
  setInnerCircleRadius: (radius: number) => void;
  setInnerPenDistance: (distance: number) => void;
}

export default function SpiroControls({
  showCircle,
  showPath,
  instantDraw,
  speed,
  outerCircleRadius,
  outerPenDistance,
  outerPenStyle,
  outerPenSize,
  innerCircleEnabled,
  innerCircleRadius,
  innerPenDistance,
  lineColor,
  backgroundColor,
  setPathPoints,
  setLineColor,
  setBackgroundColor,
  setShowCircle,
  setShowPath,
  setInstantDraw,
  setSpeed,
  setOuterCircleRadius,
  setOuterPenDistance,
  setOuterPenStyle,
  setOuterPenSize,
  setInnerCircleEnabled,
  setInnerCircleRadius,
  setInnerPenDistance,
}: SpiroControlsProps) {
  const setPresetPath = (preset: PathPreset) => {
    const points = generatePresetPath(preset);
    setPathPoints(points);
  };

  return (
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
        <div className="grid grid-cols-2 gap-2 overflow-hidden">
          <h3 className="col-span-2 text-base font-semibold">Path Presets</h3>
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
          <label htmlFor="instant-draw" className="text-sm font-medium">
            Instant Draw
          </label>
          <CustomSwitch
            id="instant-draw"
            checked={instantDraw}
            onCheckedChange={setInstantDraw}
          />

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

        <hr className="my-8" />

        {/* Circle Config */}
        <div className="grid grid-cols-[27%_13%_60%] items-center gap-4 overflow-hidden">
          <h3 className="col-span-3 text-base font-semibold">
            Circle Configuration
          </h3>

          <div className="col-span-3 text-sm font-medium">Outer Circle</div>

          <label htmlFor="outer-radius-slider" className="text-sm font-medium">
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

          <label htmlFor="inner-circle-switch" className="text-sm font-medium">
            Inner Circle
          </label>
          <CustomSwitch
            id="inner-circle-switch"
            checked={innerCircleEnabled}
            onCheckedChange={setInnerCircleEnabled}
          />
          <div />

          <label htmlFor="inner-radius-slider" className="text-sm font-medium">
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
        </div>

        <hr className="my-8" />

        {/* Draw Styles */}
        <div className="grid grid-cols-2 gap-4 items-center overflow-hidden">
          <h3 className="col-span-2 text-base font-semibold">Draw Styles</h3>

          {/* Pen Color */}
          <label htmlFor="pen-color" className="text-sm font-medium">
            Pen Color
          </label>
          <input
            id="pen-color"
            type="color"
            value={lineColor}
            onChange={(e) => setLineColor(e.target.value)}
            className="w-8 h-8 border rounded"
          />

          {/* Line Style */}
          <label htmlFor="line-style" className="text-sm font-medium">
            Line Style
          </label>
          <select
            id="line-style"
            className="max-w-32 border rounded px-2 py-1 text-sm"
            value={outerPenStyle}
            onChange={(e) => setOuterPenStyle(e.target.value as PenStyle)}
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
              value={[outerPenSize]}
              onValueChange={(value) => setOuterPenSize((value as number[])[0])}
              style={{ width: 100 }}
            />
            <span className="border border-gray-300 rounded-sm text-xs p-1">
              {outerPenSize}px
            </span>
          </div>

          {/* Background */}
          <label htmlFor="background-color" className="text-sm font-medium">
            Background
          </label>
          <input
            id="background-color"
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-8 h-8 border rounded"
          />
        </div>
      </div>
    </div>
  );
}
