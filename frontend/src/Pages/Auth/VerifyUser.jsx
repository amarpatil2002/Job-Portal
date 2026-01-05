import { useContext } from 'react';
import { useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import api from '../../api/axios';
import { X } from 'lucide-react';
import { object, string } from 'yup';

const verifyUserSchema = object({
    otp: string().required('OTP is required').trim().min(6, 'OTP should be 6 digit'),
});

function VerifyUser() {
    const RESEND_TIME = 59;
    const [otp, setOTP] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [timer, setTimer] = useState(RESEND_TIME);

    const { verifyUser } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location?.state;

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
            // console.log(timer);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await verifyUserSchema.validate({ otp }, { abortEarly: false });
            setLoading(true);
            const data = await verifyUser({ email, otp });
            if (data.success) {
                toast.success(data.message);
                navigate('/login');
            }
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationError = {};
                error.inner.forEach((e) => (validationError[e.path] = e.message));
                setError(validationError);
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const resendOTPhandle = async () => {
        if (timer > 0) return;

        try {
            const res = await api.post(
                '/auth/resend-verify-otp',
                { email },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                setTimer(RESEND_TIME);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="relative w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 right-4 p-2 rounded-full
                             text-gray-600 hover:bg-gray-100 hover:text-indigo-600
                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-semibold text-center text-gray-900">
                    Verify Your Email
                </h2>

                <p className="text-sm text-gray-600 text-center mt-2">
                    Enter the OTP sent to <b>{email}</b>
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* OTP INPUT */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
                        <input
                            type="text"
                            value={otp}
                            maxLength={6}
                            onChange={(e) => {
                                setOTP(e.target.value);
                                setError((prev) => ({ ...prev, otp: '' }));
                            }}
                            placeholder="Enter 6-digit OTP"
                            className="w-full border rounded-lg px-4 py-2 text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {error.otp && <p className="text-red-500 text-sm mt-1">{error.otp} </p>}

                    {/* RESEND */}
                    <div className="flex items-center justify-between text-sm">
                        <button
                            type="button"
                            disabled={timer > 0}
                            onClick={resendOTPhandle}
                            className={`font-medium ${
                                timer > 0
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

                    {/* SUBMIT */}
                    <button
                        disabled={loading || !otp}
                        type="submit"
                        className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed "
                    >
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default VerifyUser;
