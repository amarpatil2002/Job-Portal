import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-lg w-full text-center">
        {/* Error Code */}
        <h1 className="text-8xl font-extrabold text-indigo-600 tracking-tight">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">
          Page not found
        </h2>

        {/* Description */}
        <p className="mt-3 text-gray-600 leading-relaxed">
          Sorry, the page you’re looking for doesn’t exist, was removed,
          or the URL might be incorrect.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            Go Back
          </button>
        </div>

        {/* Help text */}
        <p className="mt-8 text-sm text-gray-500">
          If you think this is a mistake, please contact support.
        </p>
      </div>
    </div>
  );
}

export default PageNotFound;
