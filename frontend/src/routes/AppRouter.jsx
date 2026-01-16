import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from '../Pages/LandingPage';
import Login from '../Pages/Auth/Login';
import Register from '../Pages/Auth/Register';
import VerifyUser from '../Pages/Auth/VerifyUser';
import ForgotPassword from '../Pages/Auth/ForgotPassword';
import VerifyOTPSetNewPassword from '../Pages/Auth/VerifyOTPSetNewPassword';
import CandidateDashboard from '../Pages/Candidate/CandidateDashboard';
import CandidateProfileDetails from '../Pages/Candidate/Profile/CandidateProfileDetails';
import ApplyJob from '../Pages/Candidate/ApplyJob';
import Applications from '../Pages/Candidate/Applications';
import CompanyDashboard from '../Pages/Company/CompanyDashboard';
import PageNotFound from '../Pages/PageNotFound';
import PublicRoutes from './PublicRoutes';
import ProtectedRoutes from './ProtectedRoutes';
import RoleRoute from './RoleRoute';
import CompanyLayout from '../layout/CompanyLayout';
import CandidateSideBar from '../components/candidate/CandidateSideBar';

function AppRouter() {
    const router = createBrowserRouter([
        // public route
        {
            element: <PublicRoutes />,
            children: [
                { path: '/', element: <LandingPage /> },
                { path: 'login', element: <Login /> },
                { path: 'register', element: <Register /> },
                { path: 'verify-user', element: <VerifyUser /> },
                { path: 'forgot-password', element: <ForgotPassword /> },
                { path: 'set-new-password', element: <VerifyOTPSetNewPassword /> },
            ],
        },

        //protected routed
        {
            element: <ProtectedRoutes />,
            children: [
                {
                    element: <RoleRoute role="candidate" />,
                    children: [
                        {
                            path: 'candidate',
                            element: <CandidateSideBar />,
                            children: [
                                { index: true, element: <CandidateDashboard /> },
                                { path: 'profile-details', element: <CandidateProfileDetails /> },
                                { path: 'apply-job/:id', element: <ApplyJob /> },
                                { path: 'applications', element: <Applications /> },
                            ],
                        },
                    ],
                },
                {
                    element: <RoleRoute role="company" />,
                    children: [
                        {
                            path: 'company',
                            element: <CompanyLayout />,
                            children: [
                                { index: true, element: <CompanyDashboard /> },
                                { path: 'dashboard', element: <CompanyDashboard /> },
                            ],
                        },
                    ],
                },
            ],
        },

        // 404 page
        {
            path: '*',
            element: <PageNotFound />,
        },
    ]);

    return <RouterProvider router={router} />;
}

export default AppRouter;
