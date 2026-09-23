import { Outlet } from 'react-router-dom'
import { RequireAuth } from '@/features/auth/RequireAuth'

export default function AppLayout() {
  return (
    <RequireAuth step="app">
      <div className="flex min-h-svh flex-col bg-canvas">
        <Outlet />
      </div>
    </RequireAuth>
  )
}
