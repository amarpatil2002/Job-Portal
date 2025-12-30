import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoutes() {

    const token = false
    if(!token){
        return <Navigate to='/login' replace/>
    }
  return <Outlet />
}

export default ProtectedRoutes