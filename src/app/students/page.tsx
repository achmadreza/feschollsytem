import { AppShell } from "../../../components/layout/AppShell";
import { StudentTableList } from "../../../components/pages/students/StudentTableList";

export default function StudentPage() {
  return (
    <AppShell>
      <StudentTableList />
    </AppShell>
  );
}