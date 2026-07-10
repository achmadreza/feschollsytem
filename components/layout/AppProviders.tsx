"use client";

import { ReactNode } from "react";
import { TablerScripts } from "./TablerScripts";
import { TenantProvider } from "../tenant/TenantProvider";
import { LanguageProvider } from "../i18n/LanguageProvider";
import { ThemeProvider } from "../theme/ThemeProvider";
import { AuthProvider } from "../auth/AuthProvider"; 

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <TablerScripts />
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider> 
            <TenantProvider>{children}</TenantProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </>
  );
}