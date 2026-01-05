import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { object, ref, string } from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, EyeOff, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

const schema = object({
    role: string().required('Select user type'),
    email: string().email('Invalid email').required('Email is required'),
    password: string()
        .min(5, 'Password must be at least 5 characters')
        .required('Password is required'),
    confirmPassword: string()
        .oneOf([ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    companyName: string().when('role', {
        is: 'company',
        then: (schema) => schema.required('Company name is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
});

function Register() {
    const { register } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        role: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
            // If user changes role And role is NOT company Then companyName is cleared
            ...(name === 'role' && value !== 'company' ? { companyName: '' } : {}),
        }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setErrors({});

        try {
            await schema.validate(formData, { abortEarly: false });

            setLoading(true);
            const data = await register(formData);
            // console.log(data);
            if (data.success) {
                toast.success(data.message);
                navigate('/verify-user', { state: { email: formData.email.toLowerCase().trim() } });
            }
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = {};
                error.inner.forEach((e) => {
                    validationErrors[e.path] = e.message;
                });
                setErrors(validationErrors);
            } // API OR Network errors
            else {
                // console.log(error);
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="relative bg-white shadow-xl rounded-2xl p-6 w-full max-w-md space-y-4"
            >
                {/* Back Button */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                    className="absolute top-4 left-4 rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-semibold text-center text-gray-900">Register</h2>

                {/* ROLE */}
                <div>
                    <label className="block font-medium mb-1 text-gray-700">Select Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select</option>
                        <option value="candidate">Candidate</option>
                        <option value="company">Company</option>
                    </select>
                    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                </div>

                {/* COMPANY NAME (only for company role) */}
                {formData.role === 'company' && (
                    <div>
                        <label className="block font-medium mb-1 text-gray-700">Company Name</label>

                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="Enter company name"
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        {errors.companyName && (
                            <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                        )}
                    </div>
                )}

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
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                    <label className="block font-medium mb-1 text-gray-700">Confirm Password</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            className="w-full border rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((p) => !p)}
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            className="absolute right-3 top-2.5 text-gray-600 hover:text-indigo-600 focus:outline-none"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                </div>

                {/* SUBMIT */}
                <button
                    disabled={loading || !formData.email}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>

                {/* LOGIN REDIRECT */}
                <p className="text-center text-sm mt-2 text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Register;
