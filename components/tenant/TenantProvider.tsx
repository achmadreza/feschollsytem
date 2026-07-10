"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  
} from "react";
import { callApi } from "@/lib/api"; 
import { getUser } from "@/lib/auth";

type Tenant = {
  id: string;
  name: string;
};

type TenantContextValue = {
  tenant: Tenant | null;
  setTenantId: (id: string) => void;
  allTenants: Tenant[];
};

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

const STORAGE_KEY = "daf-active-tenant";

export function TenantProvider({ children }: { children: ReactNode }) {
  const [allTenants, setAllTenants] = useState<Tenant[]>([]);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const user = await getUser();
        const mapped: Tenant[] =[];
        if (mapped.length === 0 && user?.tenant) {
          mapped.push({
            id: String(user.tenant.id),
            name: user.tenant.name,
          });
        }
        setAllTenants(mapped);

        // Restore saved tenant
        const storedId = window.localStorage.getItem(STORAGE_KEY);
        if (storedId) {
          const found = mapped.find((t) => t.id === storedId);
          if (found) setTenant(found);
        }
        
        if (!tenant && mapped.length > 0) {
          setTenant(mapped[0]);
        }
      } catch (e) {
        console.error("Failed to load companies for TenantProvider", e);
      }
    };

    loadCompanies();
  }, []);

  const setTenantId = (id: string) => {
    const found = allTenants.find((t) => t.id === id);
    if (!found) return;

    setTenant(found);

    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch (e) {
      console.warn("Cannot write tenant to localStorage", e);
    }
  };

  return (
    <TenantContext.Provider
      value={{
        tenant,
        setTenantId,
        allTenants,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error("useTenant must be used within TenantProvider");
  }
  return ctx;
}
