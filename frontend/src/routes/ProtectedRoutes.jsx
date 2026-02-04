import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoutes() {
    const { user, loading } = useContext(AuthContext);

    // const token = localStorage.getItem('accessToken');
    if (loading) {
        return <div>Loading...</div>; // or spinner
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}

export default ProtectedRoutes;
