import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function CandidateDashboard() {
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
            <h1>CandidateDashboard {user.email}</h1>
            <button disabled={loading} onClick={handleLogout} className="border-2">
                {loading ? 'Logging out' : 'Logout'}
            </button>
        </div>
    );
}

export default CandidateDashboard;
