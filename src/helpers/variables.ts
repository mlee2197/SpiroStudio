import { PathPreset } from "@/types";
import {
  CircleIcon,
  EllipseIcon,
  PolygonIcon,
  SineIcon,
  SpiralIcon,
  SquareIcon,
  StarIcon,
} from "../components/PresetIcons";

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

export const INSTRUCTIONS = [
  "Use path presets or click canvas to draw custom path",
  "Adjust outer circle size and pen position",
  "Toggle inner circle for nested spirograph effect",
  "Customize colors and pen styles",
  "Click 'Start Animation' to see the magic",
  "Export your creation as PNG",
];