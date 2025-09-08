
'use client';

import SettingsTable from "../settings-table";

export default function AdminSettingsPage() {

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
                Manage core operational settings for your application.
            </p>
        </div>
        <SettingsTable />
    </div>
  );
}
