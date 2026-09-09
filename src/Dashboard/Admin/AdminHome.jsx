
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import { FaUsers } from "react-icons/fa";
import { FaHandHoldingDroplet } from "react-icons/fa6";

const AdminHome = () => {
  const { user } = useContext(AuthContext);

  const [donors, setDonors] = useState([]);
  const [bloodReq, setBloodReq] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donorRes = await fetch(
          "https://blood-donation-server-eta-eight.vercel.app/donor"
        );
        const donorData = await donorRes.json();
        setDonors(donorData);

        const bloodReqRes = await fetch(
          "https://blood-donation-server-eta-eight.vercel.app/DonationRequests"
        );
        const bloodReqData = await bloodReqRes.json();
        setBloodReq(bloodReqData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      title: "Total Donors",
      value: donors.length,
      icon: <FaUsers />,
      gradient: "from-red-500 via-rose-500 to-pink-500",
    },
    {
      title: "Blood Requests",
      value: bloodReq.length,
      icon: <FaHandHoldingDroplet />,
      gradient: "from-blue-500 via-cyan-500 to-sky-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
              Welcome Back,
            </h1>

            <h2 className="text-2xl md:text-4xl font-bold text-red-600 mt-2">
              {user?.displayName || "Admin"}
            </h2>

            <p className="text-gray-500 mt-4 text-lg">
              Manage donors and blood donation requests
              from one powerful dashboard.
            </p>
          </div>

          <div className="hidden md:flex">
            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold shadow-xl">
              {user?.displayName?.charAt(0) || "A"}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${card.gradient}
            rounded-3xl p-8 text-white shadow-xl
            hover:scale-[1.03] hover:-translate-y-1
            duration-300 cursor-pointer`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-medium text-white/90">
                  {card.title}
                </h3>

                <h2 className="text-6xl font-bold mt-4">
                  {card.value}
                </h2>
              </div>

              <div className="text-8xl opacity-20">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="mt-8 bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Dashboard Overview
        </h2>

        <p className="text-gray-600 leading-relaxed">
          This dashboard provides a quick overview of your
          blood donation platform. You can monitor the
          total number of registered donors and blood
          donation requests from here.
        </p>
      </div>
    </div>
  );
};

export default AdminHome;

