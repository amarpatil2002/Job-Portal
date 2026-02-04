import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function PublicRoutes() {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user) {
        return user.role === 'candidate' ? (
            <Navigate to="/candidate" replace />
        ) : (
            <Navigate to="/company" replace />
        );
    }

    return <Outlet />;
}

export default PublicRoutes;
