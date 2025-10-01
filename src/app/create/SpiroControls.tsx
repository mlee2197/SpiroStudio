import { Button } from "@/components/Button";
import IconButton from "@/components/IconButton";
import CustomPopover from "@/components/Popover";
import CustomSlider from "@/components/Slider";
import CustomSwitch from "@/components/Switch";

const INSTRUCTIONS = [
  "Use path presets or click canvas to draw custom path",
  "Adjust outer circle size and pen position",
  "Toggle inner circle for nested spirograph effect",
  "Customize colors and pen styles",
  "Click 'Start Animation' to see the magic",
  "Export your creation as PNG",
];

export default function SpiroControls() {
  return (
    <div className="flex flex-col w-full max-h-full p-4">
      <div className="w-full flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Controls</h2>
        <div className="flex algn-center gap-2">
          <div>
            <CustomPopover
              title="How to use"
              trigger={
                <Button
                  className="mr-auto rounded-full min-w-8 mt-[2px]"
                  style={{ padding: 4 }}
                >
                  ?
                </Button>
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
          <IconButton icon="Play" tooltip="Play" onClick={() => {}} />
          <IconButton icon="Eraser" tooltip="Erase" onClick={() => {}} />
          <IconButton
            icon="RefreshCcw"
            tooltip="Refresh"
            bgColor="#ecc1c1"
            onClick={() => {}}
          />
          <IconButton icon="Download" tooltip="Export" onClick={() => {}} />
        </div>
      </div>

      {/* Settings */}
      <div className="flex flex-col h-full gap-8 overflow-auto">
        {/* Path Presets */}
        <div className="grid grid-cols-2 gap-2 overflow-hidden">
          <h3 className="col-span-2 text-base font-semibold">Path Presets</h3>
          <Button>
            <span className="inline-flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Circle
            </span>
          </Button>
          <Button>
            <span className="inline-flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <ellipse
                  cx="8"
                  cy="8"
                  rx="7"
                  ry="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Ellipse
            </span>
          </Button>
          <Button>
            <span className="inline-flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="10"
                  height="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Square
            </span>
          </Button>
          <Button>
            <span className="inline-flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <polygon
                  points="8,2 13,5 13,11 8,14 3,11 3,5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              Hexagon
            </span>
          </Button>
          <Button>
            <span className="inline-flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <polygon
                  points="8,2 9.76,6.48 14.56,6.48 10.88,9.04 12.64,13.52 8,10.96 3.36,13.52 5.12,9.04 1.44,6.48 6.24,6.48"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              Star
            </span>
          </Button>
          <Button>
            <span className="inline-flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M1 8
                    C2.33 2.67, 4.67 13.33, 6 8
                    C7.33 2.67, 9.67 13.33, 11 8
                    C12.33 2.67, 14.67 13.33, 15 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              Sine Wave
            </span>
          </Button>
          <Button>
            <span className="inline-flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12.5 12.5
                     Q8 16, 4.5 12.5
                     Q1 9, 4.5 5.5
                     Q8 2, 11 5.5
                     Q13 8, 10 10
                     Q7 12, 6 10
                     Q5 8, 7 7
                     Q9 6, 9.5 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              Spiral
            </span>
          </Button>
        </div>

        <hr />

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
            checked={true}
            onCheckedChange={() => {}}
          />
          <label htmlFor="show-path" className="text-sm font-medium">
            Show Path
          </label>
          <CustomSwitch
            id="show-path"
            checked={true}
            onCheckedChange={() => {}}
          />
          <label htmlFor="instant-draw" className="text-sm font-medium">
            Instant Draw
          </label>
          <CustomSwitch
            id="instant-draw"
            checked={false}
            onCheckedChange={() => {}}
          />

          <label htmlFor="speed-slider" className="text-sm font-medium">
            Speed
          </label>
          <CustomSlider
            id="speed-slider"
            min={1}
            max={10}
            step={1}
            value={[5]}
            onValueChange={() => {}}
          />
        </div>

        <hr />

        {/* Circle Config */}
        <div className="grid grid-cols-[27%_13%_60%] items-center gap-4 overflow-hidden">
          <h3 className="col-span-3 text-base font-semibold">
            Circle Configuration
          </h3>

          <div className="text-sm font-medium">Outer Circle</div>
          <div />
          <div />

          <label htmlFor="outer-radius-slider" className="text-sm font-medium">
            Radius
          </label>
          <span className="border border-gray-300 rounded-sm text-xs p-1">
            20px
          </span>
          <CustomSlider
            id="outer-radius-slider"
            min={10}
            max={200}
            step={1}
            value={[100]}
            onValueChange={() => {}}
          />

          <label
            htmlFor="inner-distance-slider"
            className="text-sm font-medium"
          >
            Distance
          </label>
          <span className="border border-gray-300 rounded-sm text-xs p-1">
            50px
          </span>
          <CustomSlider
            id="inner-distance-slider"
            min={0}
            max={100}
            step={1}
            value={[50]}
            onValueChange={() => {}}
          />
          <div className="col-span-3" />

          <label htmlFor="inner-circle-switch" className="text-sm font-medium">
            Inner Circle
          </label>
          <CustomSwitch
            id="inner-circle-switch"
            checked={true}
            onCheckedChange={() => {}}
          />
          <div />

          <label htmlFor="inner-radius-slider" className="text-sm font-medium">
            Radius
          </label>
          <span className="border border-gray-300 rounded-sm text-xs p-1">
            20px
          </span>
          <CustomSlider
            id="inner-radius-slider"
            min={10}
            max={200}
            step={1}
            value={[100]}
            onValueChange={() => {}}
          />

          <label
            htmlFor="inner-distance-slider"
            className="text-sm font-medium"
          >
            Distance
          </label>
          <span className="border border-gray-300 rounded-sm text-xs p-1">
            50px
          </span>
          <CustomSlider
            id="inner-distance-slider"
            min={0}
            max={100}
            step={1}
            value={[50]}
            onValueChange={() => {}}
          />
        </div>

        <hr />

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
            defaultValue="#000000"
            className="w-8 h-8 border rounded"
          />

          {/* Line Style */}
          <label htmlFor="line-style" className="text-sm font-medium">
            Line Style
          </label>
          <select
            id="line-style"
            className="border rounded px-2 py-1 text-sm"
            defaultValue="solid"
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>

          {/* Pen Size */}
          <label htmlFor="pen-size" className="text-sm font-medium">
            Size
          </label>
          <div className="flex items-center gap-2">
            <CustomSlider
              id="pen-size"
              min={1}
              max={20}
              step={1}
              value={[4]}
              onValueChange={() => {}}
              style={{ width: 100 }}
            />
            <span className="border border-gray-300 rounded-sm text-xs p-1">
              4px
            </span>
          </div>

          {/* Background */}
          <label htmlFor="background-color" className="text-sm font-medium">
            Background
          </label>
          <input
            id="background-color"
            type="color"
            defaultValue="#ffffff"
            className="w-8 h-8 border rounded"
          />
        </div>
      </div>
    </div>
  );
}
