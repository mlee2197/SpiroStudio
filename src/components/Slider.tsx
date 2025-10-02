import * as React from "react";
import { Slider } from "@base-ui-components/react/slider";
import styles from "./Slider.module.css";

export default function CustomSlider(
  props: React.ComponentProps<typeof Slider.Root>
) {
  return (
    <Slider.Root {...props} className={`max-w-[300px] ${props.className}`}>
      <Slider.Control className={styles.Control}>
        <Slider.Track className={styles.Track}>
          <Slider.Indicator className={styles.Indicator} />
          <Slider.Thumb className={styles.Thumb} />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
}
