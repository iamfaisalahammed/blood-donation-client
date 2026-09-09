
import { useContext, useEffect, useState } from "react";
import { FaUser, FaTint } from "react-icons/fa";
import { FaHandHoldingDroplet } from "react-icons/fa6";
import { AuthContext } from "../../Providers/AuthProvider";

const VolunteerHome = () => {
  const [donners, setDonner] = useState([]);
  const [bloodreq, setBloodReq] = useState([]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Fetch donors
    fetch("https://blood-donation-server-eta-eight.vercel.app/donor")
      .then((res) => res.json())
      .then((data) => setDonner(data))
      .catch((error) => console.error("Donor fetch error:", error));

    // Fetch blood requests
    fetch("https://blood-donation-server-eta-eight.vercel.app/DonationRequrests")
      .then((res) => res.json())
      .then((data) => setBloodReq(data))
      .catch((error) =>
        console.error("Blood request fetch error:", error)
      );
  }, []);

  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <FaTint className="text-3xl text-red-600" />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">
          Welcome,{" "}
          <span className="text-red-600">
            {user?.displayName || "Volunteer"}
          </span>
        </h2>

        <p className="mt-2 text-gray-500">
          Welcome to your Volunteer Dashboard
        </p>
      </div>

      {/* Statistics */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Donors Card */}
        <div className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
                Total Donors
              </p>

              <h3 className="text-4xl font-bold text-gray-800">
                {donners.length}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Registered blood donors
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 transition-colors duration-300 group-hover:bg-red-600">
              <FaUser className="text-3xl text-red-600 group-hover:text-white" />
            </div>
          </div>
        </div>

        {/* Blood Requests Card */}
        <div className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
                Blood Requests
              </p>

              <h3 className="text-4xl font-bold text-gray-800">
                {bloodreq.length}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Total blood donation requests
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 transition-colors duration-300 group-hover:bg-red-600">
              <FaHandHoldingDroplet className="text-3xl text-red-600 group-hover:text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Welcome Section */}
      <div className="mx-auto mt-8 max-w-5xl rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
        <h3 className="text-xl font-bold text-gray-800">
          Make a Difference ❤️
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Your contribution as a volunteer can help connect blood donors with
          people who urgently need blood.
        </p>
      </div>
    </div>
  );
};

export default VolunteerHome;

