"use client";

import { useEffect } from "react";

export function TablerScripts() {
  useEffect(() => {
    import("@tabler/core/dist/js/tabler.min.js").catch((err) => {
      console.error("Failed to load Tabler JS", err);
    });
  }, []);

  return null;
}
