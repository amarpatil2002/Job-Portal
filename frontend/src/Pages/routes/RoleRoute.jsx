import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function RoleRoute({ role }) {
    const { user } = useContext(AuthContext);

    if (user?.role !== role) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default RoleRoute;
