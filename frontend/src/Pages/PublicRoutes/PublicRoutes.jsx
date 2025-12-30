import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

function PublicRoutes() {

    const token = false

    if(token){
        return <Navigate to='/dashboard' replace />
    }

    return <Outlet />
}

export default PublicRoutes