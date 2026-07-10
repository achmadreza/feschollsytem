"use client";
import { useTranslation } from "../../../components/i18n/LanguageProvider";
import { Toaster } from 'react-hot-toast';

export function DashboardAdmin() {
  const { t } = useTranslation();
  const dashboardUrl = "test";

  return (
    <div className="flex flex-col w-full h-full min-h-screen p-4 bg-gray-50">
      <Toaster position="top-right" />

      <div className="flex-grow w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <iframe
          src={dashboardUrl}
          frameBorder="0"
          width="100%"
          height="800"
          allowTransparency
          className="w-full h-[80vh]"
          style={{ border: 'none' }}
        />
      </div>
    </div>
  );
}