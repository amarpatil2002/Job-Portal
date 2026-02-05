import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Menu, X } from 'lucide-react';
import images from '../../assets/allImages';
import { toast } from 'react-toastify';
import { CandidateProfileContext } from '../../context/candidate/CandidateProfileContext';

function CandidateSideBar() {
    const [open, setOpen] = useState(false); // profile dropdown
    const [mobileOpen, setMobileOpen] = useState(false); // sidebar drawer

    const { user, logout } = useContext(AuthContext);
    const { resetCandidateProfile } = useContext(CandidateProfileContext);

    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        toast.success('Logged out');
        resetCandidateProfile();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* ================= MOBILE HEADER ================= */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-indigo-700 text-white flex items-center justify-between px-4 py-3">
                <button onClick={() => setMobileOpen(true)}>
                    <Menu className="w-6 h-6" />
                </button>

                <img src={images.jobPortalLogo} alt="Logo" className="h-8 object-contain" />

                <Bell className="w-5 h-5" />
            </header>

            {/* ================= OVERLAY ================= */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ================= SIDEBAR ================= */}
            <aside
                className={`
    fixed top-0 left-0 z-50
    w-72 bg-indigo-700 text-white flex flex-col p-5
    h-screen
    transform transition-transform duration-300
    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0
  `}
            >
                {/* Close button (mobile) */}
                <div className="md:hidden flex justify-end mb-4">
                    <button onClick={() => setMobileOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>
                {/* Logo */}
                <div className="flex flex-col items-center my-5">
                    <img
                        src={images.jobPortalLogo}
                        alt="Job Portal Logo"
                        className="h-14 w-auto object-contain"
                    />
                    <span className="text-xs text-indigo-200 mt-1">Your Next Job Starts Here</span>
                </div>
                {/* Role */}
                <div className="flex items-center justify-between mb-6 px-1">
                    <h2 className="text-sm font-semibold uppercase">{user.role}</h2>
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
                                    setMobileOpen(false);
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
                    <SidebarLink to="" label="Dashboard" onClick={() => setMobileOpen(false)} />
                    <SidebarLink
                        to="search-jobs"
                        label="Search Job"
                        onClick={() => setMobileOpen(false)}
                    />
                    <SidebarLink
                        to="applications"
                        label="Applied Job"
                        onClick={() => setMobileOpen(false)}
                    />
                    <SidebarLink
                        to="subscription"
                        label="Subscription Plan"
                        onClick={() => setMobileOpen(false)}
                    />
                    <SidebarLink
                        to="transactions"
                        label="Transaction"
                        onClick={() => setMobileOpen(false)}
                    />
                    <SidebarLink
                        to="support"
                        label="Support"
                        onClick={() => setMobileOpen(false)}
                    />
                </nav>
            </aside>

            {/* ================= MAIN ================= */}
            <main className="flex-1 p-4 sm:p-6 mt-14 md:mt-0 md:ml-72 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default CandidateSideBar;

const SidebarLink = ({ to, label, onClick }) => (
    <NavLink
        to={to}
        end={to === ''}
        onClick={onClick}
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
