import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { AuthContext } from "../Providers/AuthProvider";

const Login = () => {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please enter your email and password.",
        confirmButtonColor: "#991b1b",
      });
      return;
    }

    try {
      setLoading(true);

      await signIn(email, password);

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login Error:", error);

      let errorMessage =
        "Invalid email or password. Please try again.";

      switch (error?.code) {
        case "auth/user-not-found":
          errorMessage = "No account was found with this email.";
          break;

        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          break;

        case "auth/invalid-credential":
          errorMessage =
            "Invalid email or password. Please check your information.";
          break;

        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;

        case "auth/too-many-requests":
          errorMessage =
            "Too many login attempts. Please try again later.";
          break;

        case "auth/user-disabled":
          errorMessage =
            "This account has been disabled. Please contact support.";
          break;

        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection.";
          break;

        default:
          errorMessage =
            error?.message || "Something went wrong. Please try again.";
      }

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
        confirmButtonColor: "#991b1b",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid lg:grid-cols-2 min-h-[600px]">

            {/* Left Side */}
            <div className="hidden lg:flex relative bg-gradient-to-br from-red-800 via-red-700 to-red-950 items-center justify-center p-12 overflow-hidden">
              {/* Background decoration */}
              <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white/10" />
              <div className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-white/10" />
              <div className="absolute top-1/2 -right-20 w-40 h-40 rounded-full bg-white/5" />

              <div className="relative z-10 text-center text-white">
                <Link to="/" className="inline-block mb-8">
                  <img
                    src="https://i.ibb.co.com/xCyjZ6C/download-3-removebg-preview.png"
                    alt="Blood Donation"
                    className="w-64 h-auto mx-auto object-contain brightness-0 invert"
                  />
                </Link>

                <h1 className="text-4xl font-extrabold leading-tight">
                  Welcome Back
                </h1>

                <p className="mt-4 text-red-100 text-sm leading-7 max-w-sm mx-auto">
                  Sign in to continue your journey and help make
                  a difference through blood donation.
                </p>

                <div className="mt-8 flex justify-center gap-3">
                  <div className="px-5 py-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
                    <p className="text-2xl font-bold">Donate</p>
                    <p className="text-xs text-red-100">Blood</p>
                  </div>

                  <div className="px-5 py-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
                    <p className="text-2xl font-bold">Save</p>
                    <p className="text-xs text-red-100">Lives</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
              <div className="w-full max-w-md">

                {/* Mobile Logo */}
                <div className="lg:hidden text-center mb-6">
                  <Link to="/">
                    <img
                      src="https://i.ibb.co.com/xCyjZ6C/download-3-removebg-preview.png"
                      alt="Blood Donation"
                      className="w-40 sm:w-48 h-auto mx-auto object-contain"
                    />
                  </Link>
                </div>

                {/* Heading */}
                <div className="mb-8">
                  <p className="text-red-700 font-semibold text-sm mb-2">
                    Welcome back
                  </p>

                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    Login to your account
                  </h2>

                  <p className="text-gray-500 mt-3 text-sm leading-6">
                    Enter your details below to access your account.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Enter your email"
                        className="w-full h-13 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-100 placeholder:text-gray-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        Password
                      </label>

                      <button
                        type="button"
                        className="text-xs font-semibold text-red-700 hover:text-red-900 transition-colors"
                        onClick={() => {
                          Swal.fire({
                            icon: "info",
                            title: "Forgot Password?",
                            text: "Please use your registered email to reset your password.",
                            confirmButtonColor: "#991b1b",
                          });
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        className="w-full h-13 pl-11 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-100 placeholder:text-gray-400"
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((previous) => !previous)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-700 transition-colors"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-13 rounded-xl bg-red-800 hover:bg-red-900 active:scale-[0.98] text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-red-100 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-7">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs text-gray-400">
                    OR
                  </span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                {/* Signup */}
                <p className="text-center text-sm text-gray-500">
                  Don't have an account?{" "}
                  <Link
                    to="/singUp"
                    className="font-bold text-red-700 hover:text-red-900 transition-colors"
                  >
                    Create an account
                  </Link>
                </p>

                {/* Back Home */}
                <div className="text-center mt-5">
                  <Link
                    to="/"
                    className="text-xs font-medium text-gray-400 hover:text-red-700 transition-colors"
                  >
                    ← Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-5">
          Your journey can help save a life.
        </p>
      </div>
    </div>
  );
};

export default Login;