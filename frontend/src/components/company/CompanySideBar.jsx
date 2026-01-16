import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';

function CompanySideBar() {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

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
            <h2>
                {user.role}
                <span>
                    <Bell />{' '}
                </span>
            </h2>
            <button className="border-2" onClick={() => setOpen(!open)}>
                <>Amarjit Patil</>
            </button>
            {open && (
                <div>
                    <h2>Your Account</h2>
                    <button
                        onClick={() => {
                            navigate('profile-details');
                        }}
                    >
                        Profile
                    </button>
                    <br />
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
}

export default CompanySideBar;
