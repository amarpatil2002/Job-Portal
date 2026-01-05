import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { object, string } from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

const loginSchema = object({
    email: string().email('Invalid email').required('Email is required'),
    password: string()
        .min(5, 'Password must be at least 5 characters ')
        .required('Password is required'),
});

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        if (loading) return;
        e.preventDefault();
        setErrors({});

        try {
            await loginSchema.validate(formData, { abortEarly: false });
            setLoading(true);
            const data = await login(formData);
            if (data.success) {
                toast.success(data.message);
                navigate('candidate/dashboard');
            }
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = {};
                error.inner?.forEach((e) => {
                    validationErrors[e.path] = e.message;
                });
                setErrors(validationErrors);
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="relative bg-white shadow-xl rounded-2xl p-6 w-full max-w-md space-y-4"
            >
                {/* Back Button */}
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    aria-label="Go back"
                    className="absolute top-4 left-4 rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-semibold text-center text-gray-900">Login</h2>

                {/* EMAIL */}
                <div>
                    <label className="block font-medium mb-1 text-gray-700">Email</label>

                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* PASSWORD */}
                <div>
                    <label className="block font-medium mb-1 text-gray-700">Password</label>

                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            className="w-full border rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            className="absolute right-3 top-2.5 text-gray-600 hover:text-indigo-600 focus:outline-none"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}

                    {/* FORGOT PASSWORD LINK */}
                    <div className="text-right mt-1">
                        <Link
                            to="/forgot-password"
                            className="text-indigo-600 text-sm hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                </div>

                {/* SUBMIT */}
                <button
                    disabled={loading}
                    className={`w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        loading ? 'hover:bg-gray-300 cursor-not-allowed' : 'hover:bg-indigo-700'
                    }`}
                >
                    {loading ? 'Logging' : 'Login'}
                </button>

                {/* SWITCH TO REGISTER */}
                <p className="text-center text-sm mt-2 text-gray-600">
                    Don’t have an account?{' '}
                    <Link to="/register" className="text-indigo-600 font-medium hover:underline">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
