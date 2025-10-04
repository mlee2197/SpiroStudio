"use client";
import React, { useState, useEffect } from "react";
import { SketchPicker, ColorResult } from "react-color";
import CustomPopover from "./Popover";

type ColorPickerProps = {
  id?: string;
  value: string;
  setValue: (color: string) => void;
};

const LOCAL_STORAGE_KEY = "colorPickerHistory";

const defaultPresetColors = [
  "#FF6F61", // red/coral
  "#FFB347", // orange
  "#FFD700", // yellow/gold
  "#5AAA95", // green
  "#00FFB2", // aqua green
  "#00BFFF", // blue (deep sky blue)
  "#6A4C93", // purple
  "#FF69B4", // pink
  "#BB9F06", // yellow-olive
  "#000000", // black
];

const MAX_PRESET_COLORS = 16;

const ColorPicker: React.FC<ColorPickerProps> = ({ value, setValue, id }) => {
  const [presetColors, setPresetColors] = useState<string[]>(
    defaultPresetColors.slice(0, MAX_PRESET_COLORS)
  );

  // Load color history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Combine defaults and custom, then limit to MAX_PRESET_COLORS
          const combined = [
            ...parsed.filter((c) => !defaultPresetColors.includes(c)),
          ].slice(0, MAX_PRESET_COLORS);
          setPresetColors(combined);
        }
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const handleChange = (color: ColorResult) => {
    setValue(color.hex);
  };

  // save color to history
  const handleChangeComplete = (color: ColorResult) => {
    const customColors = presetColors.filter(
      (c) => !defaultPresetColors.includes(c)
    );
    if (
      !customColors.includes(color.hex) &&
      color.hex !== "" &&
      color.rgb.a !== 0
    ) {
      setPresetColors((prev) => {
        const updatedCustom = [
          color.hex,
          ...prev.filter(
            (c) => !defaultPresetColors.includes(c) && c !== color.hex
          ),
        ].slice(0, MAX_PRESET_COLORS);
        // Save to localStorage here
        const customToSave = updatedCustom.filter(
          (c) => !defaultPresetColors.includes(c)
        );
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customToSave));
        return updatedCustom;
      });
    }
  };

  return (
    <CustomPopover
      id={id}
      trigger={
        <div
          className="w-full h-8 rounded border border-gray-300 cursor-pointer flex items-center justify-center"
          style={{ background: value }}
          aria-label="Pick color"
        />
      }
    >
      <SketchPicker
        color={value}
        onChange={handleChange}
        onChangeComplete={handleChangeComplete}
        presetColors={presetColors}
        className="border border-gray-100"
      />
    </CustomPopover>
  );
};

export default ColorPicker;
