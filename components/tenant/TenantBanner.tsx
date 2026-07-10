"use client";

import { useTenant } from "./TenantProvider";
import { useAuth } from "../auth/AuthProvider";

export function TenantBanner() {
  const { tenant } = useTenant();
  const { user } = useAuth(); 
  const activeTenant = tenant || user?.tenant; 
  if (!activeTenant) return null;

  // return (
  //   <div className="alert alert-info d-flex align-items-center mb-3">
  //     <div>
  //       <strong>{t("tenant.activeCompany")}: </strong>
  //       {activeTenant.name}
  //     </div>
  //   </div>
  // );
}
