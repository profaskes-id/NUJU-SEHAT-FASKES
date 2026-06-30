import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy } from 'react'
import { GuestRoute, ProtectedRoute } from './guards'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const AppShell = lazy(() => import('@/components/layout/AppShell'))
const DokterPage = lazy(() => import('@/pages/DokterPage'))
const DokterDetailPage = lazy(() => import('@/pages/DokterDetailPage'))
const InviteDokterPage = lazy(() => import('@/pages/InviteDokterPage'))
const RequestDokterPage = lazy(() => import('@/pages/RequestDokterPage'))
const RequestDokterDetailPage = lazy(() => import('@/pages/RequestDokterDetailPage'))
const MarginDiskonPage = lazy(() => import('@/pages/MarginDiskonPage'))
const WalletPage = lazy(() => import('@/pages/WalletPage'))
const AjukanWithdrawPage = lazy(() => import('@/pages/AjukanWithdrawPage'))
const RiwayatWithdrawPage = lazy(() => import('@/pages/RiwayatWithdrawPage'))
const MonitoringPage = lazy(() => import('@/pages/MonitoringPage'))
const MonitoringDetailPage = lazy(() => import('@/pages/MonitoringDetailPage'))
const ProfileFaskesPage = lazy(() => import('@/pages/ProfileFaskesPage'))
const PinSettingsPage = lazy(() => import('@/pages/PinSettingsPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'dokter',
        element: <DokterPage />,
      },
      {
        path: 'dokter/invite',
        element: <InviteDokterPage />,
      },
      {
        path: 'dokter/request',
        element: <RequestDokterPage />,
      },
      {
        path: 'dokter/request/:id',
        element: <RequestDokterDetailPage />,
      },
      {
        path: 'dokter/:id',
        element: <DokterDetailPage />,
      },
      {
        path: 'konsultasi/monitoring',
        element: <MonitoringPage />,
      },
      {
        path: 'konsultasi/monitoring/:id',
        element: <MonitoringDetailPage />,
      },
      {
        path: 'keuangan/wallet',
        element: <WalletPage />,
      },
      {
        path: 'keuangan/wallet/withdraw',
        element: <AjukanWithdrawPage />,
      },
      {
        path: 'keuangan/wallet/withdraw/riwayat',
        element: <RiwayatWithdrawPage />,
      },
      {
        path: 'pengaturan/profile',
        element: <ProfileFaskesPage />,
      },
      {
        path: 'pengaturan/pin',
        element: <PinSettingsPage />,
      },
      {
        path: 'keuangan/margin',
        element: <MarginDiskonPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
