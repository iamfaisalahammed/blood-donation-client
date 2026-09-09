
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHome } from "react-icons/fa";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-5 py-16">
      <div className="w-full max-w-2xl text-center">
        {/* 404 */}
        <div className="relative mx-auto w-fit">
          <p className="select-none font-serif text-[120px] font-black italic leading-none tracking-tight text-gray-100 sm:text-[170px]">
            404
          </p>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-7xl font-black italic text-red-600 sm:text-9xl">
              404
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-red-600">
            Page Not Found
          </p>

          <h1 className="font-serif text-4xl font-black italic leading-tight text-gray-950 sm:text-5xl">
            Oops! This page
            <span className="text-red-600"> doesn't exist.</span>
          </h1>

          <div className="mx-auto mt-5 flex items-center justify-center gap-2">
            <span className="h-[2px] w-8 bg-gray-200" />
            <span className="h-[3px] w-12 rounded-full bg-red-600" />
            <span className="h-[2px] w-8 bg-gray-200" />
          </div>

          <p className="mx-auto mt-6 max-w-md text-sm font-medium leading-7 text-gray-500 sm:text-base">
            The page you're looking for may have been moved, removed, or the
            link might be incorrect.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={() => navigate(-1)}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 text-sm font-bold text-gray-700 transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 sm:w-auto"
          >
            <FaArrowLeft className="text-xs transition-transform duration-300 group-hover:-translate-x-1" />
            Go Back
          </button>

          <button
            onClick={handleHome}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-7 text-sm font-bold text-white shadow-lg shadow-red-100 transition-all duration-300 hover:bg-red-700 hover:shadow-red-200 sm:w-auto"
          >
            <FaHome className="text-sm" />
            Go Home
          </button>
        </div>

        {/* Bottom message */}
        <div className="mx-auto mt-14 max-w-md border-t border-gray-100 pt-6">
          <p className="font-serif text-lg font-black italic text-gray-900">
            Let's get you back on track.
          </p>

          <p className="mt-1 text-xs font-medium text-gray-400">
            Return to the homepage and continue exploring.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;

