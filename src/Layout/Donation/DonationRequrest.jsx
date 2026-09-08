import { useContext, useState, useEffect } from "react";
import { FaEye, FaTable, FaThLarge } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProvider";

const DonationRequest = () => {
  const [donners, setDonner] = useState([]);
  const { user } = useContext(AuthContext);
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    fetch(`http://localhost:5173.app/DonationRequrest`)
      .then((res) => res.json())
      .then((donner) => setDonner(donner));
  }, []);

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <>
      <div className="flex justify-center gap-4 my-4">
        <button
          onClick={() => handleViewChange("table")}
          className="bg-black glass text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
        >
          <FaTable /> Table View
        </button>
        <button
          onClick={() => handleViewChange("card")}
          className="bg-black glass text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
        >
          <FaThLarge /> Card View
        </button>
      </div>

      {viewMode === "table" ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Recipient</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Blood Group</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {donners
                .filter((donner) => donner.status === "pending")
                .map((donner, i) => (
                  <tr key={donner._id} className="border-t border-gray-300">
                    <td className="px-6 py-3 text-center">{i + 1}</td>
                    <td className="px-6 py-3 text-center">
                      {donner?.recipientName}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {donner?.hospitalName}
                    </td>
                    <td className="px-6 py-3 text-center">{donner?.date}</td>
                    <td className="px-6 py-3 text-center">{donner?.time}</td>
                    <td className="px-6 py-3 text-center font-bold">
                      {donner?.Blood}
                    </td>
                    <td className="px-6 py-3 text-center flex justify-center">
                      <Link
                        to={`/dashboard/details/${donner._id}`}
                        className="bg-black glass text-white px-3 py-2 rounded-lg shadow-md"
                      >
                        Donate Now
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {donners
            .filter((donner) => donner.status === "pending")
            .map((donner) => (
              <div
                key={donner._id}
                className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Recipient: {donner.recipientName}
                </h3>
                <p className="text-gray-600">Location: {donner.hospitalName}</p>
                <p className="text-gray-600">Date: {donner.date}</p>
                <p className="text-gray-600">Time: {donner.time}</p>
                <p className="text-gray-800 font-bold">
                  Blood Group: {donner.Blood}
                </p>
                <div className="mt-4">
                  <Link
                    to={`/dashboard/details/${donner._id}`}
                    className="bg-black glass text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
                  >
                    Donate Now
                  </Link>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default DonationRequest;
