export interface MenuItem {
  label: string;
  icon?: string;
  href?: string;
  permission?: string[];
  role?: string[];
  children?: MenuItem[];
}

export const mainMenu: MenuItem[] = [
  {
    label: "Students",
    icon: "users",
    href: "/students",
    role: ["admin"],
  },
  {
    label: "Trial Class",
    icon: "users",
    href: "/trial_class-admin",
    role: ["admin"],
  },
  {
    label: "Trial Class",
    icon: "users",
    href: "/trial_class-parent",
    role: ["parent"],
  },
  {
    label: "Payments",
    icon: "moneybag",
    href: "/payments-admin",
    role: ["admin"],
  },
  {
    label: "Payments",
    icon: "moneybag",
    href: "/payments-parent",
    role: ["parent"],
  },
  {
    label: "Kelola User",
    icon: "users",
    href: "/users",
    role: ["admin"],
  },
];