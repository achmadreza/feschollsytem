"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainMenu } from "../../config/menu";
import * as TablerIcons from "@tabler/icons-react";
import { useEffect, useState } from "react";

function IconResolver(name?: string) {
  if (!name) return null;
  const iconName = "Icon" + name.charAt(0).toUpperCase() + name.slice(1);
  const IconComponent = (TablerIcons as Record<string, any>)[iconName];

  if (!IconComponent) return null;
  return <IconComponent size={22} className="me-3 ms-1 flex-shrink-0" />;
}

export function HeaderNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <aside 
        className="navbar navbar-vertical navbar-expand-lg" 
        style={{ backgroundColor: "#232933" }}
      />
    );
  }

  return (
    <aside 
      className="navbar navbar-vertical navbar-expand-lg navbar-dark" 
      style={{ 
        backgroundColor: "#232933",
        borderRight: "none"
      }}
    >
      <div className="container-fluid flex-column align-items-stretch">
        <div className="d-none d-lg-block py-4 px-2 w-100">
          <Link href="/" className="text-decoration-none">
            <h2 className="text-white mb-1 fw-bold" style={{ letterSpacing: "0.5px", fontSize: "1.5rem" }}>
              Lumina Learn
            </h2>
            <small className="text-uppercase fw-bold" style={{ fontSize: "11px", color: "#6c7a91", letterSpacing: "1px" }}>
              Admin Portal
            </small>
          </Link>
        </div>
        <div 
          className="collapse navbar-collapse w-100" 
          id="sidebar-menu"
          style={{
            maxHeight: "calc(100vh - 80px)",
            overflowY: "auto",
          }}
        >
          <div className="d-flex flex-column align-items-stretch flex-fill mt-lg-3 w-100 py-2 py-lg-0">
            <ul className="navbar-nav flex-column gap-1">
              {mainMenu.map((menu) => {
                const isActive =
                  menu.href &&
                  (pathname === menu.href || pathname.startsWith(menu.href + "/"));
                if (!menu.children || menu.children.length === 0) {
                  return (
                    <li key={menu.label} className="nav-item">
                      <Link
                        href={menu.href ?? "#"}
                        className="nav-link d-flex align-items-center justify-content-start py-2.5 px-3 rounded-3"
                        style={{
                          backgroundColor: isActive ? "#7A5CFA" : "transparent",
                          color: isActive ? "#ffffff" : "#b9c5d6",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {IconResolver(menu.icon)}
                        <span className="fw-medium" style={{ fontSize: "14px" }}>{menu.label}</span>
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={menu.label} className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle d-flex align-items-center justify-content-start py-2.5 px-3 rounded-3"
                      href="#"
                      data-bs-toggle="dropdown"
                      role="button"
                      style={{
                        color: "#b9c5d6",
                        fontSize: "14px"
                      }}
                    >
                      {IconResolver(menu.icon)}
                      <span className="fw-medium flex-fill text-start">{menu.label}</span>
                    </a>
                    <div className="dropdown-menu bg-transparent border-0 ps-4 py-1">
                      {menu.children.map((child) => (
                        <Link
                          href={child.href ?? "#"}
                          key={child.href ?? child.label}
                          className={`dropdown-item py-2 rounded-2 ${
                            pathname === child.href ? "text-white font-weight-bold" : ""
                          }`}
                          style={{
                            color: pathname === child.href ? "#ffffff" : "#8a99ad",
                            fontSize: "13px"
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}