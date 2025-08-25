
'use client';

import SettingsTable, { useSettingsData } from "../settings-table";

export default function AdminSettingsPage() {
  const settingsData = useSettingsData();
  
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
                Manage core operational settings for your application.
            </p>
        </div>
        <SettingsTable {...settingsData} />
    </div>
  );
}
