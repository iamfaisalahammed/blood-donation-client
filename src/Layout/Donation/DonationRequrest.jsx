import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaHospital,
  FaMapMarkerAlt,
  FaTint,
  FaArrowRight,
  FaHeartbeat,
  FaExclamationCircle,
} from "react-icons/fa";

const DonationRequest = () => {
  const [donners, setDonner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDonationRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/DonationRequrest");

        if (!response.ok) {
          throw new Error("Failed to load donation requests.");
        }

        const data = await response.json();
        setDonner(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Donation Request Error:", err);
        setError("Unable to load donation requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonationRequests();
  }, []);

  const pendingRequests = donners.filter(
    (donner) => donner.status === "pending",
  );

  if (loading) {
    return (
      <section className="min-h-screen bg-white px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
              <span className="h-7 w-7 animate-spin rounded-full border-3 border-red-100 border-t-red-600" />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-red-600">
              Donation Requests
            </p>

            <h1 className="mt-3 font-serif text-4xl font-black italic text-gray-950 sm:text-5xl">
              Finding <span className="text-red-600">Requests...</span>
            </h1>

            <p className="mt-4 text-sm font-medium leading-7 text-gray-500">
              Please wait while we load the latest blood donation requests.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-white px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <FaExclamationCircle className="text-2xl" />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-red-600">
            Something Went Wrong
          </p>

          <h1 className="mt-3 font-serif text-4xl font-black italic text-gray-950">
            Unable to Load
          </h1>

          <p className="mt-4 text-sm font-medium leading-7 text-gray-500">
            {error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white px-5 py-16 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">
            Donation Requests
          </p>

          <h1 className="mt-4 font-serif text-4xl font-black italic leading-tight text-gray-950 sm:text-5xl md:text-6xl">
            People Who Need
            <span className="text-red-600"> Your Help</span>
          </h1>

          <div className="mx-auto mt-5 flex items-center justify-center gap-2">
            <span className="h-[2px] w-8 bg-gray-200" />
            <span className="h-[3px] w-12 rounded-full bg-red-600" />
            <span className="h-[2px] w-8 bg-gray-200" />
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-sm font-medium leading-7 text-gray-500 sm:text-base">
            Browse active blood donation requests and help someone in need. Your
            donation could make a life-saving difference.
          </p>
        </div>

        {/* Request Summary */}
        <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-100">
              <FaHeartbeat className="text-lg" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Active Requests
              </p>

              <h2 className="mt-1 text-xl font-black text-gray-900">
                {pendingRequests.length}{" "}
                {pendingRequests.length === 1 ? "Request" : "Requests"}
              </h2>
            </div>
          </div>

          <p className="text-sm font-medium text-gray-500 sm:max-w-sm sm:text-right">
            Every request represents someone waiting for a helping hand.
          </p>
        </div>

        {/* Empty State */}
        {pendingRequests.length === 0 ? (
          <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-gray-100 bg-gray-50 px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm">
              <FaHeartbeat className="text-2xl" />
            </div>

            <h2 className="mt-6 font-serif text-3xl font-black italic text-gray-900">
              No Active Requests
            </h2>

            <p className="mt-3 text-sm font-medium leading-7 text-gray-500">
              There are currently no pending blood donation requests. Please
              check again later.
            </p>
          </div>
        ) : (
          /* Cards */
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pendingRequests.map((donner) => (
              <article
                key={donner._id}
                className="group relative overflow-hidden rounded-[26px] border border-gray-100 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(0,0,0,0.09)]"
              >
                {/* Top Accent */}
                <div className="h-1.5 w-full bg-red-600" />

                <div className="p-6 sm:p-7">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <FaHeartbeat className="text-lg" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Recipient
                        </p>

                        <h2 className="mt-1 truncate text-lg font-black text-gray-900">
                          {donner?.recipientName || "Unknown Recipient"}
                        </h2>
                      </div>
                    </div>

                    {/* Blood Group */}
                    <div className="flex shrink-0 items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-red-600">
                      <FaTint className="text-xs" />

                      <span className="text-sm font-black">
                        {donner?.Blood || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-6 h-px bg-gray-100" />

                  {/* Information */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                        <FaHospital className="text-sm" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                          Hospital
                        </p>

                        <p className="mt-1 truncate text-sm font-bold text-gray-800">
                          {donner?.hospitalName || "Hospital not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                        <FaMapMarkerAlt className="text-sm" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                          Location
                        </p>

                        <p className="mt-1 truncate text-sm font-bold text-gray-800">
                          {donner?.location ||
                            donner?.hospitalName ||
                            "Location not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-gray-50 p-3">
                        <div className="flex items-center gap-2 text-gray-400">
                          <FaCalendarAlt className="text-xs" />

                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Date
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-bold text-gray-800">
                          {donner?.date || "Not specified"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-gray-50 p-3">
                        <div className="flex items-center gap-2 text-gray-400">
                          <FaClock className="text-xs" />

                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Time
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-bold text-gray-800">
                          {donner?.time || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    to={`/dashboard/details/${donner._id}`}
                    className="group/button mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white shadow-lg shadow-red-100 transition-all duration-300 hover:bg-red-700 hover:shadow-red-200"
                  >
                    Donate Now
                    <FaArrowRight className="text-xs transition-transform duration-300 group-hover/button:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom Message */}
        {pendingRequests.length > 0 && (
          <div className="mx-auto mt-14 max-w-3xl border-t border-gray-100 pt-8 text-center">
            <p className="font-serif text-xl font-black italic text-gray-900 sm:text-2xl">
              One donation can become someone's second chance.
            </p>

            <p className="mt-2 text-sm font-medium text-gray-400">
              Find a request. Donate blood. Make a difference.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DonationRequest;
