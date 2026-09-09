import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import Swal from "sweetalert2";
import {
  FaTint,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaPhoneAlt,
  FaUsers,
} from "react-icons/fa";

const DonorHome = () => {
  const [donners, setDonner] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const url = `https://blood-donation-server-eta-eight.vercel.app/myDonor?email=${encodeURIComponent(
      user.email
    )}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP Error: ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        console.log("myDonor API Response:", data);

        setDonner(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Fetch Error:", error);

        setDonner([]);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load donor information",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.email]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-red-100 p-4 rounded-2xl">
            <FaUsers className="text-2xl text-red-700" />
          </div>

          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
              Donor & Request Information
            </h1>

            <p className="text-gray-500 mt-2">
              View all donation requests where you volunteered as a donor.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
          <span className="loading loading-spinner loading-lg text-red-700"></span>

          <p className="mt-4 text-gray-500">
            Loading donor information...
          </p>
        </div>
      ) : donners.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
          <FaTint className="mx-auto text-5xl text-red-300 mb-4" />

          <h2 className="text-2xl font-bold text-gray-700">
            No Donations Found
          </h2>

          <p className="text-gray-500 mt-2">
            You have not responded to any blood requests yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-red-700 text-white px-6 py-5">
            <h2 className="text-xl font-bold">
              Donation Request Records
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-gray-100 text-black">
                <tr>
                  <th>#</th>
                  <th>Recipient</th>
                  <th>Hospital</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Blood Group</th>
                  <th>Contact Number</th>
                </tr>
              </thead>

              <tbody>
                {donners.map((donner, index) => (
                  <tr
                    key={donner?._id || index}
                    className="hover:bg-red-50 transition-all"
                  >
                    <td className="font-semibold">{index + 1}</td>

                    <td>
                      <div className="flex text-black items-center gap-2">
                        <FaUsers className="text-red-600" />
                        {donner?.recipientName || "N/A"}
                      </div>
                    </td>

                    <td>
                      <div className="flex text-black items-center gap-2">
                        <FaMapMarkerAlt className="text-red-600" />
                        {donner?.hospitalName || "N/A"}
                      </div>
                    </td>

                    <td>
                      <div className="flex text-black items-center gap-2">
                        <FaCalendarAlt className="text-red-600" />
                        {donner?.date || "N/A"}
                      </div>
                    </td>

                    <td>
                      <div className="flex text-black items-center gap-2">
                        <FaClock className="text-red-600" />
                        {donner?.time || "N/A"}
                      </div>
                    </td>

                    <td>
                      <span className="badge text-black badge-error badge-outline font-semibold gap-1">
                        <FaTint />
                        {donner?.Blood || "N/A"}
                      </span>
                    </td>

                    <td>
                      <span className="flex text-black items-center gap-2 font-bold text-red-700">
                        <FaPhoneAlt />
                        {donner?.number || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t bg-gray-50 px-6 py-4">
            <p className="text-sm text-gray-500">
              Total Donation Responses:{" "}
              <span className="font-bold  text-red-700">
                {donners.length}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorHome;