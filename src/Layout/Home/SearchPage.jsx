import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaTint,
  FaLocationArrow,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

const SearchPage = () => {
  const [donners, setDonner] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Search donor
  const handleSearch = async (data) => {
    setIsSubmitted(true);
    setLoading(true);
    setError("");
    setDonner([]);

    const queryParams = new URLSearchParams(data).toString();

    try {
      const res = await axios.get(
        `http://localhost:5000/searchDonor?${queryParams}`
      );

      setDonner(res.data);
    } catch (error) {
      console.error("Search Error:", error);
      setError("Failed to fetch donors. Please try again.");
      setDonner([]);
    } finally {
      setLoading(false);
    }
  };

  // Clear search
  const handleClear = () => {
    reset();
    setIsSubmitted(false);
    setDonner([]);
    setError("");
  };

  return (
    <section className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-red-600">
            Find a Donor
          </p>

          <h1 className="font-serif text-4xl font-black italic leading-tight text-gray-950 sm:text-5xl md:text-6xl">
            Search Blood
            <span className="text-red-600"> Donors</span>
          </h1>

          <div className="mx-auto mt-5 flex items-center justify-center gap-2">
            <span className="h-[2px] w-8 bg-gray-200" />
            <span className="h-[3px] w-12 rounded-full bg-red-600" />
            <span className="h-[2px] w-8 bg-gray-200" />
          </div>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-gray-500 sm:text-base">
            Find the right blood donor by selecting a blood group and entering
            the recipient's location.
          </p>
        </div>

        {/* Search form */}
        <div className="mx-auto mt-12 max-w-5xl">
          <div className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-[0_15px_50px_rgba(0,0,0,0.06)]">
            <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <FaSearch className="text-lg" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Find a Blood Donor
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    Enter the details below to search
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(handleSearch)}
              className="p-6 sm:p-8"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Blood Group */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Blood Group
                  </label>

                  <div className="relative">
                    <FaTint className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" />

                    <select
                      defaultValue=""
                      {...register("bloodGroup", {
                        required: "Blood group is required",
                      })}
                      className="h-14 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-medium text-gray-800 outline-none transition-all focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                    >
                      <option value="" disabled>
                        Select Blood Group
                      </option>

                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  {errors.bloodGroup && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.bloodGroup.message}
                    </p>
                  )}
                </div>

                {/* District */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Recipient District
                  </label>

                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" />

                    <input
                      {...register("district", {
                        required: "District is required",
                      })}
                      type="text"
                      placeholder="Enter district"
                      className="h-14 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-medium text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                    />
                  </div>

                  {errors.district && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.district.message}
                    </p>
                  )}
                </div>

                {/* Upazila */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Recipient Upazila
                  </label>

                  <div className="relative">
                    <FaLocationArrow className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" />

                    <input
                      {...register("upazila", {
                        required: "Upazila is required",
                      })}
                      type="text"
                      placeholder="Enter upazila"
                      className="h-14 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-medium text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                    />
                  </div>

                  {errors.upazila && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.upazila.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-100 transition-all duration-300 hover:bg-red-700 hover:shadow-red-200 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Searching Donors...
                    </>
                  ) : (
                    <>
                      <FaSearch />
                      Search Donors
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="flex h-13 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3 text-sm font-bold text-gray-600 transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <FaTimes />
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Search status and results */}
        {isSubmitted && (
          <div className="mx-auto mt-8 max-w-6xl">
            {loading ? (
              <div className="overflow-hidden rounded-2xl border border-red-100 bg-red-50">
                <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-red-600 shadow-sm">
                    <FaSearch className="animate-pulse text-xl" />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-gray-900">
                    Searching for donors
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Please wait while we find available blood donors for you.
                  </p>

                  <div className="mt-5 h-1.5 w-48 overflow-hidden rounded-full bg-red-100">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-red-600" />
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="overflow-hidden rounded-2xl border border-red-100 bg-red-50">
                <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-red-600 shadow-sm">
                    <FaTimes />
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-gray-900">
                    Search Failed
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">{error}</p>
                </div>
              </div>
            ) : (
              <>
                {/* Result summary */}
                <div className="mb-5 overflow-hidden rounded-2xl border border-green-100 bg-green-50">
                  <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-green-600 shadow-sm">
                        <FaCheckCircle className="text-xl" />
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                          Search Completed
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          {donners.length > 0
                            ? "We found donors matching your search criteria."
                            : "No donor matched your selected criteria."}
                        </p>
                      </div>
                    </div>

                    <div className="w-fit rounded-xl bg-white px-5 py-3 shadow-sm">
                      <p className="text-center text-2xl font-black text-red-600">
                        {donners.length}
                      </p>

                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        {donners.length === 1 ? "Donor Found" : "Donors Found"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Donor data */}
                {donners.length > 0 ? (
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
                      <h2 className="text-xl font-bold text-gray-900">
                        Available Donors
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Contact a donor below if you need blood assistance.
                      </p>
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full min-w-[900px] border-collapse">
                          <thead>
                            <tr className="bg-gray-900 text-white">
                              <th className="px-5 py-4 text-left text-sm font-semibold">
                                #
                              </th>

                              <th className="px-5 py-4 text-left text-sm font-semibold">
                                Donor Name
                              </th>

                              <th className="px-5 py-4 text-left text-sm font-semibold">
                                Blood Group
                              </th>

                              <th className="px-5 py-4 text-left text-sm font-semibold">
                                Location
                              </th>

                              <th className="px-5 py-4 text-left text-sm font-semibold">
                                Email
                              </th>

                              <th className="px-5 py-4 text-left text-sm font-semibold">
                                Phone
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {donners.map((donner, index) => (
                              <tr
                                key={donner._id}
                                className={`border-b border-gray-200 transition-colors hover:bg-red-50 ${
                                  index % 2 === 0
                                    ? "bg-white"
                                    : "bg-gray-50/70"
                                }`}
                              >
                                <td className="px-5 py-5 text-sm font-semibold text-gray-500">
                                  {index + 1}
                                </td>

                                <td className="px-5 py-5">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold uppercase text-red-600">
                                      {donner?.name?.charAt(0) || "D"}
                                    </div>

                                    <span className="whitespace-nowrap text-base font-bold text-gray-900">
                                      {donner?.name || "N/A"}
                                    </span>
                                  </div>
                                </td>

                                <td className="px-5 py-5">
                                  <span className="inline-flex min-w-[60px] items-center justify-center rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white">
                                    {donner?.bloodGroup || "N/A"}
                                  </span>
                                </td>

                                <td className="px-5 py-5">
                                  <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="shrink-0 text-red-500" />

                                    <span className="max-w-[180px] text-sm font-medium text-gray-700">
                                      {donner?.location || "N/A"}
                                    </span>
                                  </div>
                                </td>

                                <td className="px-5 py-5">
                                  <div className="flex items-center gap-2">
                                    <FaEnvelope className="shrink-0 text-gray-400" />

                                    <span className="whitespace-nowrap text-sm text-gray-600">
                                      {donner?.email || "N/A"}
                                    </span>
                                  </div>
                                </td>

                                <td className="px-5 py-5">
                                  {donner?.phone ? (
                                    <a
                                      href={`tel:${donner.phone}`}
                                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-red-500 hover:bg-red-600 hover:text-white"
                                    >
                                      <FaPhone className="text-xs" />
                                      {donner.phone}
                                    </a>
                                  ) : (
                                    <span className="text-sm text-gray-400">
                                      N/A
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                        <FaSearch className="text-2xl" />
                      </div>

                      <h3 className="mt-5 text-xl font-bold text-gray-900">
                        No Donor Found
                      </h3>

                      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                        No donor was found for the selected blood group and
                        location. Please try another search.
                      </p>

                      <button
                        type="button"
                        onClick={handleClear}
                        className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                      >
                        Search Again
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchPage;