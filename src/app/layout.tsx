// app/layout.tsx
import type { Metadata } from "next";
import "@tabler/core/dist/css/tabler.min.css";
import "@tabler/core/dist/css/tabler-flags.min.css";
import "@tabler/core/dist/css/tabler-payments.min.css";
import "@tabler/core/dist/css/tabler-vendors.min.css";
import "../../styles/globals.css";
import { AppProviders } from "../../components/layout/AppProviders";

export const metadata: Metadata = {
  title: "Student Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="d-flex flex-column">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
