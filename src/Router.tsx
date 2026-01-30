import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { PatientListPage } from './pages/PatientListPage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { ErrorPage } from './pages/ErrorPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Outlet />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Navigate to="/login" replace />,
            },
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'patients',
                element: <PatientListPage />,
            },
            {
                path: 'dashboard/:id',
                element: <DashboardPage />,
            },
            {
                path: 'dashboard',
                element: <DashboardPage />,
            },
        ]
    }
])
