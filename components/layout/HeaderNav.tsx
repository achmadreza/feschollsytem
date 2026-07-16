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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (!mounted) {
    return (
      <aside 
        className="navbar navbar-vertical navbar-expand-lg" 
        style={{ backgroundColor: "#232933" }}
      />
    );
  }

  return (
    <>
      <header 
        className="navbar navbar-expand-md d-lg-none py-2 px-3 justify-content-between text-white"
        style={{ backgroundColor: "#232933" }}
      >
        <Link href="/" className="text-decoration-none">
          <h2 className="text-white mb-0 fw-bold" style={{ letterSpacing: "0.5px", fontSize: "1.2rem" }}>
            Lumina Learn
          </h2>
        </Link>
        <button 
          className="navbar-toggler text-white border-0" 
          type="button" 
          onClick={() => setIsOpen(true)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
        </button>
      </header>

      {isOpen && (
        <div 
          className="d-lg-none" 
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1040,
            transition: "opacity 0.2s ease"
          }}
        />
      )}

      <aside 
        className={`navbar navbar-vertical navbar-expand-lg navbar-dark offcanvas-lg offcanvas-start ${isOpen ? "show" : ""}`} 
        id="sidebar-menu"
        style={{ 
          backgroundColor: "#232933",
          borderRight: "none",
          maxWidth: "280px",
          visibility: isOpen ? "visible" : undefined,
          zIndex: 1050
        }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          #sidebar-menu.offcanvas-lg {
            background-color: #232933 !important;
          }
          #sidebar-menu .offcanvas-body {
            background-color: #232933 !important;
          }
        `}} />

        <div 
          className="offcanvas-header d-lg-none w-100 justify-content-between align-items-center px-4 py-3 border-bottom border-secondary border-opacity-20"
          style={{ backgroundColor: "#232933" }}
        >
          <div>
            <h2 className="text-white mb-0 fw-bold" style={{ letterSpacing: "0.5px", fontSize: "1.4rem" }}>
              Lumina Learn
            </h2>
            <small className="text-uppercase fw-bold" style={{ fontSize: "10px", color: "#6c7a91", letterSpacing: "1px" }}>
              Admin Portal
            </small>
          </div>
          <button 
            type="button" 
            className="btn-close btn-close-white" 
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          ></button>
        </div>

        <div 
          className="container-fluid flex-column align-items-stretch offcanvas-body p-lg-0"
          style={{ backgroundColor: "#232933" }}
        >
          <div className="d-none d-lg-block py-4 px-3 w-100">
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
            className="w-100 mt-lg-3 px-3 py-2 py-lg-0"
            style={{
              maxHeight: "calc(100vh - 100px)",
              overflowY: "auto",
            }}
          >
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
      </aside>
    </>
  );
}