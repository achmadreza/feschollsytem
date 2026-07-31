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
  },
  {
    label: "Payments",
    icon: "moneybag",
    href: "/payments-admin",
  },
  {
    label: "Payments",
    icon: "moneybag",
    href: "/payments-parent",
  },
  {
    label: "Kelola User",
    icon: "users",
    href: "/users",
  },
];