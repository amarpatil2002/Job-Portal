import { Link } from "react-router-dom";
import images from '../assets/allImages'

function LandingPage() {
return (
  <div className="min-h-screen flex flex-col bg-gray-50">
    {/* HEADER + HERO WRAPPER (100vh) */}
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="bg-white shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">
            JobPortal
          </h1>

          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* HERO (takes remaining height) */}
      <section
        className="flex-1 flex items-center justify-center relative bg-cover bg-center"
        style={{ backgroundImage: `url(${images.landingImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-4xl text-center px-6">
          <h2 className="text-5xl font-bold text-white leading-tight">
            Find your next opportunity with confidence
          </h2>

          <p className="mt-6 text-lg text-gray-200">
            A single platform for candidates and companies to connect,
            evaluate, and grow using AI-powered insights.
          </p>

          {/* EXTRA CONTENT */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-6 text-gray-200">
            <span>✔ Smart job matching</span>
            <span>✔ Trusted companies</span>
            <span>✔ Faster hiring decisions</span>
          </div>

          {/* CTA */}
          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="px-6 py-3 rounded-lg border border-white text-white hover:bg-white/10 transition"
            >
              Explore Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>

    {/* ENQUIRY FORM SECTION */}
    <section className="bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-3xl font-semibold text-gray-900 text-center">
          Fill the Enquiry Form
        </h3>

        <p className="mt-3 text-gray-600 text-center">
          Whether you're a candidate or a company, we’d love to hear from you.
        </p>

        <form className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="First Name *"
            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Last Name *"
            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Work Email *"
            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Phone Number (with country code) *"
            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <textarea
            rows="4"
            placeholder="Your Message"
            className="md:col-span-2 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          ></textarea>

          <button
            type="submit"
            className="md:col-span-2 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Submit Enquiry
          </button>
        </form>
      </div>
    </section>

    {/* FOOTER (unchanged) */}
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-xl font-bold text-indigo-400">
            JobPortal
          </h4>
          <p className="mt-3 text-sm text-gray-400">
            Your trusted platform to connect talent with opportunity.
          </p>
        </div>

        <div>
          <h5 className="text-sm font-semibold text-white mb-3">
            Contact
          </h5>
          <p className="text-sm">📞 +91 1234567890</p>
          <p className="text-sm">📧 example@example.com</p>
        </div>

        <div>
          <h5 className="text-sm font-semibold text-white mb-3">
            Address
          </h5>
          <p className="text-sm leading-relaxed">
            Unit 4, Tower 1, xxxxxxxxxxx,<br />
            xxxxxxxxxxxxxxxxxxxxxxxxxxxx,<br />
            xxxxxxxx, Pune – xxxxx
          </p>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center text-sm py-4 text-gray-400">
        © {new Date().getFullYear()} JobPortal. All rights reserved.
      </div>
    </footer>
  </div>
);




}

export default LandingPage;
