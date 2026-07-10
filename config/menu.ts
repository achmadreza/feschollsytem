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
    label: "Dashboard Admin",
    icon: "dashboard",
    href: "/dashboard-admin",
  },
  {
    label: "User Management",
    icon: "users",
    href: "/users",
  },
];