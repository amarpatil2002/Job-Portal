import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ApplyJob from './Pages/Candidate/ApplyJob';
import Applications from './Pages/Candidate/Applications';
import PageNotFound from './Pages/PageNotFound';
import AuthContextProvider from './context/AuthContext';
import LandingPage from './Pages/LandingPage';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import VerifyOTPSetNewPassword from './Pages/Auth/VerifyOTPSetNewPassword';
import VerifyUser from './Pages/Auth/VerifyUser';
import { ToastContainer } from 'react-toastify';
import CompanyDashboard from './Pages/Company/CompanyDashboard';
import CandidateDashboard from './Pages/Candidate/CandidateDashboard';
import PublicRoutes from './Pages/routes/PublicRoutes';
import RoleRoute from './Pages/routes/RoleRoute';
import ProtectedRoutes from './Pages/routes/ProtectedRoutes';

function App() {
    const router = createBrowserRouter([
        // public route
        {
            element: <PublicRoutes />,
            children: [
                {
                    path: '/',
                    element: <LandingPage />,
                },
                {
                    path: 'login',
                    element: <Login />,
                },
                {
                    path: 'register',
                    element: <Register />,
                },
                {
                    path: 'verify-user',
                    element: <VerifyUser />,
                },
                {
                    path: 'forgot-password',
                    element: <ForgotPassword />,
                },
                {
                    path: 'set-new-password',
                    element: <VerifyOTPSetNewPassword />,
                },
            ],
        },

        // Candidate Routes
        {
            element: <ProtectedRoutes />,
            children: [
                {
                    element: <RoleRoute role="candidate" />,
                    children: [
                        {
                            path: 'candidate/dashboard',
                            element: <CandidateDashboard />,
                        },
                        {
                            path: 'apply-job/:id',
                            element: <ApplyJob />,
                        },
                        {
                            path: 'applications',
                            element: <Applications />,
                        },
                    ],
                },
            ],
        },

        // Company Routes
        {
            element: <ProtectedRoutes />,
            children: [
                {
                    element: <RoleRoute role="company" />,
                    children: [
                        {
                            path: 'company/dashboard',
                            element: <CompanyDashboard />,
                        },
                    ],
                },
            ],
        },

        //page not found
        {
            path: '*',
            element: <PageNotFound />,
        },
    ]);

    return (
        <AuthContextProvider>
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                theme="light" // or "light"
            />
            <RouterProvider router={router} />
        </AuthContextProvider>
    );
}

export default App;
