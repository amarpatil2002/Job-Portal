import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { object, ref, string } from 'yup';
import { AuthContext } from '../../context/AuthContext';
import { Eye, EyeOff, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import api from '../../api/axios';

const schema = object({
    otp: string().required('OTP is required').trim().min(6, 'OTP must be at least 6 digit'),
    password: string()
        .required('Password is required')
        .min(5, 'Password must be at least 5 characters'),

    confirmPassword: string().oneOf([ref('password'), null], 'Passwords must match'),
});

function VerifyOTPSetNewPassword() {
    let RESEND_TIME = 59;

    const [formData, setFormData] = useState({
        otp: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(RESEND_TIME);

    const isResendDisabled = timer > 0 || loading;

    const { setNewPassword } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            toast.success('Session expired , Please try again');
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const handleChange = (e) => {
        const { value, name } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await schema.validate(formData, { abortEarly: false });
            setLoading(true);
            const payload = {
                ...formData,
                email,
            };
            // console.log(payload);
            const data = await setNewPassword(payload);
            if (data.success) {
                toast.success(data.message);
                navigate('/login');
            }
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = {};
                error.inner.forEach((e) => {
                    validationErrors[e.path] = e.message;
                });
                setError(validationErrors);
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const resndOTPHandler = async () => {
        setLoading(true);
        if (timer > 0) return;
        try {
            const res = await api.post(
                '/auth/resend-reset-otp',
                { email },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                setTimer(RESEND_TIME);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="relative w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 right-4 p-2 rounded-full
               text-gray-600 hover:bg-gray-100 hover:text-indigo-600
               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl mt-4 font-semibold text-gray-800 mb-4">Set New Password</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* OTP */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
                        <input
                            maxLength={6}
                            type="text"
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            placeholder="Enter 6 digit OTP"
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>
                    {error.otp && <p className="text-red-500 text-sm mt-1">{error.otp}</p>}
                    {/*Resend OTP */}

                    <div className="flex items-center justify-between text-sm">
                        <button
                            type="button"
                            disabled={isResendDisabled}
                            onClick={resndOTPHandler}
                            className={`font-medium ${
                                isResendDisabled
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-indigo-600 hover:underline'
                            }`}
                        >
                            Resend OTP
                        </button>
                        <span className="text-gray-600">
                            00:{timer.toString().padStart(2, '0')}
                        </span>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

                        {error.password && (
                            <p className="text-red-500 text-sm mt-1">{error.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm password"
                                className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

                        {error.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        disabled={loading || !formData.otp || !formData.password}
                        type="submit"
                        className="w-full cursor-pointer bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing' : 'Set New Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default VerifyOTPSetNewPassword;
