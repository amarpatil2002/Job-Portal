import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { object, string } from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const otpRequestSchema = object({
    email: string().email('Invalid email').required('Email is required'),
});

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { forgotPassword } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await otpRequestSchema.validate({ email }, { abortEarly: false });
            setLoading(true);
            const data = await forgotPassword({ email });
            if (data.success) {
                toast.success(data?.message || 'OTP has been sent to your registered email.');
                navigate('/set-new-password', { state: { email } });
            }
        } catch (error) {
            if (error.name === 'ValidationError') {
                // yup validation errors
                const validationErrors = {};
                error.inner?.forEach((e) => {
                    validationErrors[e.path] = e.message;
                });
                setErrors(validationErrors);
            } else {
                // backend error message
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
                className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md space-y-4"
            >
                <h2 className="text-2xl font-semibold text-center text-gray-900">
                    Forgot Password
                </h2>

                <p className="text-sm text-gray-600 text-center">
                    Enter your registered email to receive OTP.
                </p>

                {/* EMAIL */}
                <div>
                    <label className="block font-medium mb-1 text-gray-700">Email</label>

                    <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors((prev) => ({ ...prev, email: '' }));
                        }}
                        placeholder="Enter your email"
                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* SUBMIT */}
                <button
                    disabled={loading || !email}
                    type="submit"
                    className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? 'Sending...' : 'Send OTP'}
                </button>

                {/* BACK TO LOGIN */}
                <p className="text-center text-sm mt-2 text-gray-600">
                    Remember password?{' '}
                    <Link to="/login" className="text-indigo-600 hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default ForgotPassword;
