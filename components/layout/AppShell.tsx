"use client";

import { HeaderTop } from "./HeaderTop";
import { HeaderNav } from "./HeaderNav";
import { useTranslation } from "../i18n/LanguageProvider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear().toString();
  const footerText = t("footer.text").replace("{year}", currentYear);

  return (
    <div className="page d-flex flex-column flex-lg-row">
      <HeaderNav />
      <div className="page-wrapper flex-fill d-flex flex-column bg-light" style={{ minHeight: "100vh" }}>
        <HeaderTop />
        <div className="page-body">
          <div className="container-xl">{children}</div>
        </div>
        <footer className="footer footer-transparent d-print-none py-3 mt-auto border-top">
          <div className="container-xl">
            <div className="row text-center align-items-center flex-row-reverse">
              <div className="col-12 col-lg-auto mt-3 mt-lg-0">
                <ul className="list-inline list-inline-dots mb-0">
                  <li className="list-inline-item">{footerText}</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}