import { Outlet } from 'react-router-dom'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { AppShell } from '@/components/app/AppShell'

export default function AppLayout() {
  return (
    <RequireAuth step="app">
      <AppShell>
        <Outlet />
      </AppShell>
    </RequireAuth>
  )
}
