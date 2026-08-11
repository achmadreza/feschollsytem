import { AppShell } from "../../../components/layout/AppShell";
import { TrialTableList } from "../../../components/pages/trial_class-admin/TrialTableList";

export default function TrialPage() {
  return (
    <AppShell>
      <TrialTableList />
    </AppShell>
  );
}