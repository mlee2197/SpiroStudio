import * as React from "react";
import { Slider } from "@base-ui-components/react/slider";
import styles from "./Slider.module.css";

export default function CustomSlider(
  props: React.ComponentProps<typeof Slider.Root> & {
    value: [number];
    unit: string;
  }
) {
  return (
    <div className="flex items-center space-x-4">
      <span className="border border-gray-300 rounded-sm text-xs p-1">
        {props.value[0]}
        {props.unit}
      </span>
      <Slider.Root {...props} className={`w-full ${props.className}`}>
        <Slider.Control className={styles.Control}>
          <Slider.Track className={styles.Track}>
            <Slider.Indicator className={styles.Indicator} />
            <Slider.Thumb className={styles.Thumb} />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  );
}
