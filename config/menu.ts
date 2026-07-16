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
    label: "Kelola User",
    icon: "users",
    href: "/users",
  },
];