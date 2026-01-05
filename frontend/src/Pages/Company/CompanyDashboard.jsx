import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function CompanyDashboard() {
    const [loading, setLoading] = useState(false);

    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        setLoading(true);
        await logout();
        toast.success('Logged out successfully');
        setLoading(false);
        navigate('/login');
    };

    return (
        <div>
            <h2>CompanyDashboard {user.email}</h2>
            <button disabled={loading} className="border-2" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default CompanyDashboard;
