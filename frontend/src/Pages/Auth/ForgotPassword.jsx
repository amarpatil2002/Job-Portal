import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { object, string } from "yup";
import { Link } from "react-router-dom";

const otpRequestSchema = object({
  email: string().email("Invalid email").required("Email is required"),
});

function ForgotPassword() {

  const { forgotPassword } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    try {
      await otpRequestSchema.validate({ email }, { abortEarly: false });

      const res = await forgotPassword({ email });

      setMessage(
        res?.message || "OTP has been sent to your registered email."
      );

      //navigate to OTP page later:
      navigate("/set-new-password", { state: { email } });

    } catch (error) {
      // yup validation errors
      const validationErrors = {};
      error.inner?.forEach((e) => {
        validationErrors[e.path] = e.message;
      });
      setErrors(validationErrors);

      // backend error message support
      if (!error.inner)
        setMessage(error?.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-600 text-center">
          Enter your registered email to receive OTP.
        </p>

        {/* EMAIL */}
        <div>
          <label className="block font-medium mb-1">Email</label>

          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({});
            }}
            placeholder="Enter your email"
            className="w-full border rounded-lg p-2"
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* SERVER MESSAGE */}
        {message && (
          <p className="text-green-600 text-sm text-center">{message}</p>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
        >
          Send OTP
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
  );
}

export default ForgotPassword;
