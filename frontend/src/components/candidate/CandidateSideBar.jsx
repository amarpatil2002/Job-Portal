import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown } from 'lucide-react';
import images from '../../assets/allImages';

function CandidateSideBar() {
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
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-72 bg-indigo-700 text-white flex flex-col p-5">
                {/* Logo */}
                <div className="flex flex-col items-center my-7">
                    <img
                        src={images.jobPortalLogo}
                        alt="Job Portal Logo"
                        className="h-16 w-auto object-contain"
                    />
                    <span className="text-xs text-indigo-200 mt-1">Your Next Job Starts Here</span>
                </div>

                {/* Role + Notification */}
                <div className="flex items-center justify-between mb-6 px-1">
                    <h2 className="text-sm font-semibold uppercase tracking-wide">{user.role}</h2>
                    <Bell className="w-5 h-5 cursor-pointer hover:text-indigo-200" />
                </div>

                {/* Profile Dropdown */}
                <div className="relative mb-6">
                    <button
                        onClick={() => setOpen(!open)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition"
                    >
                        <span className="font-medium truncate">{user.name || 'Profile'}</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {open && (
                        <div className="absolute left-0 mt-2 w-full bg-white text-gray-800 rounded-lg shadow-lg z-50">
                            <button
                                onClick={() => {
                                    navigate('profile-details');
                                    setOpen(false);
                                }}
                                className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                            >
                                Edit Profile
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                    <SidebarLink to="" label="Dashboard" />
                    <SidebarLink to="search-jobs" label="Search Job" />
                    <SidebarLink to="applications" label="Applied Job" />
                    <SidebarLink to="subscription" label="Subscription Plan" />
                    <SidebarLink to="transactions" label="Transaction" />
                    <SidebarLink to="support" label="Support" />
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default CandidateSideBar;

const SidebarLink = ({ to, label }) => (
    <NavLink
        to={to}
        end={to === ''}
        className={({ isActive }) =>
            `
      flex items-center px-4 py-2 rounded-lg text-sm font-medium transition
      ${
          isActive
              ? 'bg-indigo-900 text-white'
              : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
      }
      `
        }
    >
        {label}
    </NavLink>
);
