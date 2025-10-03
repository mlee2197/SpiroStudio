import { Tabs } from "@base-ui-components/react";
import styles from "./Tabs.module.css";

interface CustomTabsProps {
  items: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

export default function CustomTabs({
  items,
  onChange,
  value,
}: CustomTabsProps) {
  return (
    <Tabs.Root className={styles.Tabs} value={value} onValueChange={onChange}>
      <Tabs.List className={styles.List}>
        {items.map((item) => (
          <Tabs.Tab key={item.value} className={styles.Tab} value={item.value}>
            {item.label}
          </Tabs.Tab>
        ))}
        <Tabs.Indicator className={styles.Indicator} />
      </Tabs.List>
    </Tabs.Root>
  );
}
