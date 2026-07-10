import { AppShell } from "../../components/layout/AppShell";
import { TenantBanner } from "../../components/tenant/TenantBanner";
import { AuthProvider } from "../../components/auth/AuthProvider";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("daf-token");
  if (!token) {
    redirect("/login");
  }

  return (
    <AppShell>
      <AuthProvider>
        <TenantBanner />
      </AuthProvider>
    </AppShell>
  );
}