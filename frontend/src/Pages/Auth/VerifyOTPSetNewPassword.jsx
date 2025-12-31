import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { object, ref, string } from "yup";
import { AuthContext } from "../../context/AuthContext";

const schema = object({
  password: string()
    .required("Password is required")
    .min(5, "Password must be at least 5 characters"),

  confirmPassword: string().oneOf(
    [ref("password"), null],
    "Passwords must match"
  ),
});

function VerifyOTPSetNewPassword() {
  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState({});

  const { setNewPassword } = useContext(AuthContext);

  const location = useLocation();
  const email = location.state?.email || "";

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});

    try {
      await schema.validate(formData, { abortEarly: false });

      const payload = {
        ...formData,
        email,
      };

      console.log(payload);
      await setNewPassword(payload);
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setError(validationErrors);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Set New Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* OTP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OTP
            </label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full border rounded-lg px-3 py-2 pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-2 text-gray-600"
              >
                {showPassword ? "🙈" : "👁️"}
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
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full border rounded-lg px-3 py-2 pr-10"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-3 top-2 text-gray-600"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {error.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {error.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Set Password
          </button>
          {/* BACK TO LOGIN */}
          <p className="text-center text-sm mt-2">
            Remember password?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default VerifyOTPSetNewPassword;
