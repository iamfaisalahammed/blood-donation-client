import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { LuPaintbrush } from "react-icons/lu";

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

  // ------------------------- search donor-----------------
  const handleSearch = async (data) => {
    setIsSubmitted(true);
    setLoading(true);
    setError("");

    const queryParams = new URLSearchParams(data).toString(); // Dynamic query creation

    try {
      const res = await axios.get(
        `http://localhost:5173.app/searchDonor?${queryParams}`
      );
      setDonner(res.data);
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    reset();
    setIsSubmitted(false);
    setDonner([]);
  };

  return (
    <>
      <h2 className="text-center font-bold text-4xl my-3 text-black dark:text-gray-200">
        🔎 Search <span className="text-red-500">Blood</span> Donors
      </h2>

      <div className="lg:w-3/4 mx-auto">
        <div className="card bg-base-100 dark:bg-black w-full shrink-0 shadow-md">
          <form onSubmit={handleSubmit(handleSearch)} className="card-body">
            {/* form second row */}
            <div className="flex flex-col lg:flex-row gap-5">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text text-black dark:text-white">
                    🩸Blood Group
                  </span>
                </label>
                <select
                  defaultValue="default"
                  {...register("bloodGroup", { required: true })}
                  name="bloodGroup"
                  className="select select-bordered w-full bg-white dark:bg-gray-700 text-black dark:text-white"
                >
                  <option disabled value="default">
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
            </div>

            {/* form third row */}
            <div className="flex flex-col lg:flex-row gap-5">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text text-black dark:text-white">
                    Recipient-District
                  </span>
                </label>
                <input
                  {...register("district", { required: true })}
                  className="input input-bordered w-full bg-white dark:bg-gray-700 text-black dark:text-white"
                  name="district"
                />
              </div>

              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text text-black dark:text-white">
                    Recipient-Upazila
                  </span>
                </label>
                <input
                  {...register("upazila", { required: true })}
                  className="input input-bordered w-full bg-white dark:bg-gray-700 text-black dark:text-white"
                  name="upazila"
                />
              </div>
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-outline text-white font-bold bg-red-600 hover:bg-red-950"
              >
                <FaSearch /> Search
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="text-3xl mt-3"
              >
                <LuPaintbrush></LuPaintbrush>
              </button>
            </div>
          </form>
        </div>

        {/* SEARCH RESULTS */}
        {isSubmitted && (
          <div className="mt-8 mb-8 border border-black p-11 bg-white dark:bg-gray-800 text-black dark:text-white">
            <div className="mt-6">
              {loading ? (
                <h1 className="text-center text-blue-500 font-bold text-3xl">
                  Loading...
                </h1>
              ) : error ? (
                <h1 className="text-center text-red-500 font-bold text-3xl">
                  {error}
                </h1>
              ) : donners.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table text-black dark:text-white">
                    {/* head */}
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Email</th>
                        <th>Number</th>
                      </tr>
                    </thead>

                    <tbody>
                      {/* row */}
                      {donners.map((donner, i) => (
                        <tr key={donner._id}>
                          <td>{i + 1}</td>
                          <td>{donner?.name}</td>
                          <td>{donner?.location}</td>
                          <td>{donner?.email}</td>
                          <td>{donner?.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <h1 className="text-center text-red-900 font-bold text-3xl">
                  No donor Found.
                </h1>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchPage;
