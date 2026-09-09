import { useContext, useState } from "react";
import { FaMoneyBill, FaUser } from "react-icons/fa";
import { FaHandHoldingDroplet } from "react-icons/fa6";
import { AuthContext } from "../../Providers/AuthProvider";

const VolunteerHome = () => {
  const [donners, setDonner] = useState([]);
  const [funds, setFund] = useState([]);
  const [bloodreq, setBloodReq] = useState([]);

  // Fetch data
  fetch(`http://localhost:5000/donor`)
    .then((res) => res.json())
    .then((donner) => setDonner(donner));
  fetch(`http://localhost:5000/fund`)
    .then((res) => res.json())
    .then((funds) => setFund(funds));
  fetch(`http://localhost:5000/DonationRequrests`)
    .then((res) => res.json())
    .then((bloodreq) => setBloodReq(bloodreq));

  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white min-h-screen text-gray-800 py-8 px-4">
      <h2 className="text-center text-4xl font-bold text-gray-700 mb-10">
        Welcome, <span className="text-red-600">{user?.displayName}</span> to
        the Volunteer Panel
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Donor Card */}
        <div className="bg-black glass rounded-lg shadow-lg p-6 flex flex-col items-center justify-center transition duration-300 hover:scale-105">
          <FaUser className="text-6xl text-white mb-4" />
          <h2 className="text-xl text-white mb-2">Donors</h2>
          <h3 className="text-3xl font-semibold text-white">
            {donners.length}
          </h3>
        </div>

        {/* Funding Card */}
        <div className="bg-black glass rounded-lg shadow-lg p-6 flex flex-col items-center justify-center transition duration-300 hover:scale-105">
          <FaMoneyBill className="text-6xl text-white mb-4" />
          <h2 className="text-xl text-white mb-2">Funding</h2>
          <h3 className="text-3xl font-semibold text-white">{funds.length}</h3>
        </div>

        {/* Blood Request Card */}
        <div className="bg-black glass rounded-lg shadow-lg p-6 flex flex-col items-center justify-center transition duration-300 hover:scale-105">
          <FaHandHoldingDroplet className="text-6xl text-white mb-4" />
          <h2 className="text-xl text-white mb-2">Blood Requests</h2>
          <h3 className="text-3xl font-semibold text-white">
            {bloodreq.length}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default VolunteerHome;
