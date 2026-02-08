"use client";

import { useState } from "react";

export function useTabs(tabs: string[]) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return { tabs, selectedIndex, setSelectedIndex };
}
