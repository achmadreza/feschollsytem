"use client";

import Link from "next/link";
import {
  IconChevronDown,
  IconUserCircle,
  IconBell,
  IconPasswordUser,
  IconLogout,
  IconSearch,
  IconMenu2,
} from "@tabler/icons-react";
import { useTenant } from "../tenant/TenantProvider";
import { useAuth } from "../auth/AuthProvider";
import { callApi } from "@/lib/api";
import { toast, Toaster } from "react-hot-toast";

export function HeaderTop() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar navbar-light bg-white border-bottom py-3 d-flex align-items-center" style={{ minHeight: "70px" }}>
      <Toaster position="top-right" />
      <div className="container-fluid d-flex justify-content-between align-items-center px-3 px-md-4">
        <div className="d-flex align-items-center gap-2 gap-md-4 flex-fill">
          <div className="input-icon d-none d-md-block flex-fill max-w-md" style={{ maxWidth: "350px" }}>
            <span className="input-icon-addon">
              <IconSearch size={18} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control bg-light border-0 py-2 ps-5 rounded-3"
              placeholder="Search students, records..."
              style={{ fontSize: "14px" }}
            />
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 gap-md-3">
          <div className="dropdown">
            <a
              href="#"
              className="nav-link px-0 me-1 me-md-2"
              data-bs-toggle="dropdown"
              onClick={(e) => e.preventDefault()}
            >
              <div className="position-relative">
                <IconBell size={22} className="text-muted" />
              </div>
            </a>

            <div className="dropdown-menu dropdown-menu-end dropdown-menu-card" style={{ width: "320px", maxWidth: "90vw" }}>
              <div className="card d-flex flex-column border-0">
                <div className="card-header d-flex justify-content-between align-items-center py-2">
                  <h3 className="card-title" style={{ fontSize: "1rem" }}>
                    Notifications
                  </h3>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="dropdown"
                    aria-label="Close"
                  />
                </div>

                <div className="card-footer d-flex gap-2 py-2">
                  <button
                    className="btn btn-outline-primary btn-sm flex-fill"
                    type="button"
                  >
                    Mark all as read
                  </button>
                  <Link href="/notifications" className="btn btn-outline-secondary btn-sm flex-fill">
                    See more
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="dropdown ms-1 border-start ps-2 ps-md-3">
            <a href="#" className="d-flex align-items-center text-decoration-none" data-bs-toggle="dropdown">
              <span className="avatar rounded-circle bg-blue-lt" style={{ width: "32px", height: "32px" }}>
                <IconUserCircle size={22} />
              </span>
              <div className="d-none d-xl-block text-start lh-1 ms-2">
                <div className="fw-bold text-dark" style={{ fontSize: "13px" }}>
                  {user?.fullName || "Loading..."}
                </div>
                <small className="text-muted" style={{ fontSize: "11px" }}>
                  {user?.role?.name || user?.email}
                </small>
              </div>
            </a>

            <div className="dropdown-menu dropdown-menu-end shadow-sm mt-2">
              <Link href="change-password" className="dropdown-item w-100 text-start text-dark py-2">
                <IconPasswordUser size={16} className="me-2 text-muted" />
                Change Password
              </Link>
              <div className="dropdown-divider my-1"></div>
              <button
                className="dropdown-item w-100 text-start text-danger py-2"
                onClick={logout}
                type="button"
              >
                <IconLogout size={16} className="me-2" />
                Logout
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}