import { AppShell } from "../../../components/layout/AppShell";
import { UserTableList } from "../../../components/pages/users/UserTableList";

export default function UsersPage() {
  return (
    <AppShell>
      <UserTableList />
    </AppShell>
  );
}