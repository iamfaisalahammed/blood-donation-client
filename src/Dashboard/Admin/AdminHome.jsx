import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import { FaMoneyBill, FaUser } from "react-icons/fa";
import { FaHandHoldingDroplet } from "react-icons/fa6";

const AdminHome = () => {
  const [donors, setDonors] = useState([]);
  const [funds, setFunds] = useState([]);
  const [bloodReq, setBloodReq] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donorRes = await fetch(
          "http://localhost:5173.app/donor"
        );
        const donorData = await donorRes.json();
        setDonors(donorData);

        const fundRes = await fetch(
          "http://localhost:5173.app/fund"
        );
        const fundData = await fundRes.json();
        setFunds(fundData);

        const bloodReqRes = await fetch(
          "http://localhost:5173.app/DonationRequests"
        );
        const bloodReqData = await bloodReqRes.json();
        setBloodReq(bloodReqData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const { user } = useContext(AuthContext);

  return (
    <div className="px-4 md:px-12 lg:px-20 py-10">
      <h2 className="text-center text-4xl font-semibold text-gray-800 mb-10">
        <span className="text-red-600">{user?.displayName}</span> Sir, Welcome
        to Admin Panel
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Donors Card */}
        <div className="bg-gradient-to-r from-red-500 to-red-700 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex flex-col items-center">
            <FaUser className="text-6xl" />
            <h2 className="text-2xl mt-4">Donors</h2>
            <h3 className="text-5xl font-bold mt-2">{donors.length}</h3>
          </div>
        </div>
        {/* Funding Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex flex-col items-center">
            <FaMoneyBill className="text-6xl" />
            <h2 className="text-2xl mt-4">Funding</h2>
            <h3 className="text-5xl font-bold mt-2">{funds.length}</h3>
          </div>
        </div>
        {/* Blood Requests Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex flex-col items-center">
            <FaHandHoldingDroplet className="text-6xl" />
            <h2 className="text-2xl mt-4">Blood Requests</h2>
            <h3 className="text-5xl font-bold mt-2">{bloodReq.length}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
