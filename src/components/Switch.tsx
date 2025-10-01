import * as React from 'react';
import { Switch } from '@base-ui-components/react/switch';
import styles from './Switch.module.css';

interface CustomSwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  id?: string;
}

export default function CustomSwitch({
  checked,
  onCheckedChange,
  className,
  id,
}: CustomSwitchProps) {
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={`${styles.Switch}${className ? ` ${className}` : ''}`}
      id={id}
    >
      <Switch.Thumb className={styles.Thumb} />
    </Switch.Root>
  );
}
