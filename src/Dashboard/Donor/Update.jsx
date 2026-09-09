import { useLoaderData, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState } from "react";
import {
  FaTint,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaSave,
} from "react-icons/fa";

const Update = () => {
  const donation = useLoaderData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { Blood, address, date, email, name, time, _id } = donation;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    const updatedData = {
      Blood: form.Blood.value,
      date: form.date.value,
      time: form.time.value,
      address: form.address.value,
    };

    try {
      const response = await fetch(
        `https://blood-donation-server-eta-eight.vercel.app/DonationUp/${_id}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const data = await response.json();

      if (data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Request Updated",
          text: "Your blood donation request has been updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/dashboard/DonorMy");
        }, 2000);
      } else {
        Swal.fire({
          icon: "info",
          title: "No Changes Detected",
          text: "You didn't change any information.",
        });
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-3 rounded-xl">
              <FaTint className="text-red-700 text-xl" />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Update Blood Request
              </h1>
              <p className="text-gray-500 mt-1">
                Modify your donation request information.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-red-700 text-white px-8 py-5">
            <h2 className="text-xl font-bold">
              Donation Request Information
            </h2>
          </div>

          <form
            onSubmit={handleUpdate}
            className="p-8 space-y-6"
          >
            {/* User Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaUser />
                  Name
                </label>

                <input
                  defaultValue={name}
                  readOnly
                  className="input input-bordered w-full bg-gray-100"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaEnvelope />
                  Email
                </label>

                <input
                  defaultValue={email}
                  readOnly
                  className="input input-bordered w-full bg-gray-100"
                />
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <label className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaTint />
                Blood Group
              </label>

              <select
                name="Blood"
                defaultValue={Blood}
                className="select select-bordered w-full"
                required
              >
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

            {/* Date & Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaCalendarAlt />
                  Donation Date
                </label>

                <input
                  type="date"
                  name="date"
                  defaultValue={date}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaClock />
                  Donation Time
                </label>

                <input
                  type="time"
                  name="time"
                  defaultValue={time}
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaMapMarkerAlt />
                Donation Address
              </label>

              <input
                type="text"
                name="address"
                defaultValue={address}
                className="input input-bordered w-full"
                placeholder="Enter donation address"
                required
              />
            </div>

            {/* Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn bg-red-700 hover:bg-red-800 text-white w-full h-14 rounded-xl border-none"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Update Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Update;