import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function RoleRoute({ role }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default RoleRoute;
