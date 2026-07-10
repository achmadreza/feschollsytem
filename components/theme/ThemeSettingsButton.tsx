"use client";

import { IconSettings } from "@tabler/icons-react";
import { useTheme } from "./ThemeProvider";

export function ThemeSettingsButton() {
  const { toggleTheme } = useTheme();

  // return (
  //   <button
  //     type="button"
  //     className="btn btn-light d-flex align-items-center position-relative"
  //     onClick={toggleTheme}
  //   >
  //     <IconSettings size={18} className="me-2" />
  //     <span>Theme Settings</span>
  //     <span className="badge bg-red text-white position-absolute top-0 start-100 translate-middle">
  //       New
  //     </span>
  //   </button>
  // );
}
