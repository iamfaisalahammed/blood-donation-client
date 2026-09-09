import { useContext, useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaTint,
  FaCalendarAlt,
  FaClock,
  FaHospital,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProvider";
import ReactPaginate from "react-paginate";

const MyDonation = () => {
  const [donners, setDonner] = useState([]);
  const [currentDonners, setCurrentDonners] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);

  const itemsPerPage = 6;

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "inprogress":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "done":
        return "bg-green-100 text-green-700 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // Delete Donation
  const handleUserDelete = (id) => {
    Swal.fire({
      title: "Delete Request?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://blood-donation-server-eta-eight.vercel.app/donationDelete/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire({
                icon: "success",
                title: "Deleted Successfully",
                timer: 1500,
                showConfirmButton: false,
              });

              const remaining = donners.filter(
                (item) => item._id !== id
              );
              setDonner(remaining);
            }
          });
      }
    });
  };

  // Update Status
  const handleStatusUp = (id, newStatus) => {
    Swal.fire({
      title: `Mark as ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://blood-donation-server-eta-eight.vercel.app/upDonationStatus/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.modifiedCount > 0) {
              Swal.fire({
                icon: "success",
                title: "Status Updated",
                timer: 1500,
                showConfirmButton: false,
              });

              const updated = donners.map((item) =>
                item._id === id
                  ? { ...item, status: newStatus }
                  : item
              );

              setDonner(updated);
            }
          });
      }
    });
  };

  // Load Donations
  useEffect(() => {
    if (user?.email) {
      setLoading(true);

      fetch(
        `https://blood-donation-server-eta-eight.vercel.app/MyDonations?email=${user.email}`
      )
        .then((res) => res.json())
        .then((data) => {
          setDonner(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  // Pagination
  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    const offset = selectedPage * itemsPerPage;

    setCurrentDonners(
      donners.slice(offset, offset + itemsPerPage)
    );
  };

  useEffect(() => {
    setCurrentDonners(donners.slice(0, itemsPerPage));
  }, [donners]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold">
            My Blood Requests
          </h2>

          <p className="mt-2 text-red-100">
            Manage and track all your blood donation requests.
          </p>

          <div className="mt-5">
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              Total Requests: {donners.length}
            </span>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {donners.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
          <FaTint className="mx-auto text-6xl text-red-500 mb-4" />

          <h3 className="text-2xl font-bold text-gray-800">
            No Blood Requests Found
          </h3>

          <p className="text-gray-500 mt-2">
            You haven't created any blood requests yet.
          </p>
        </div>
      ) : (
        <>
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentDonners.map((donner) => (
              <div
                key={donner._id}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
              >
                {/* Top */}
                <div className="bg-red-50 p-5 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">
                      {donner?.recipientName}
                    </h3>

                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusClass(
                        donner?.status
                      )}`}
                    >
                      {donner?.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaHospital className="text-red-600" />
                    <span>{donner?.hospitalName}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCalendarAlt className="text-red-600" />
                    <span>{donner?.date}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <FaClock className="text-red-600" />
                    <span>{donner?.time}</span>
                  </div>

                  <div className="pt-2">
                    <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold">
                      {donner?.Blood}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t p-4 flex flex-wrap gap-2">
                  {donner?.status === "pending" && (
                    <Link
                      to={`/dashboard/update/${donner._id}`}
                      className="btn btn-sm bg-blue-600 hover:bg-blue-700 border-none text-white"
                    >
                      <FaEdit />
                      Edit
                    </Link>
                  )}

                  {donner?.status === "inprogress" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusUp(
                            donner._id,
                            "done"
                          )
                        }
                        className="btn btn-sm bg-green-600 hover:bg-green-700 border-none text-white"
                      >
                        <FaCheckCircle />
                        Done
                      </button>

                      <button
                        onClick={() =>
                          handleStatusUp(
                            donner._id,
                            "cancelled"
                          )
                        }
                        className="btn btn-sm bg-gray-600 hover:bg-gray-700 border-none text-white"
                      >
                        <FaTimesCircle />
                        Cancel
                      </button>
                    </>
                  )}

                  <button
                    onClick={() =>
                      handleUserDelete(donner._id)
                    }
                    className="btn btn-sm bg-red-600 hover:bg-red-700 border-none text-white"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex justify-center">
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              pageCount={Math.ceil(
                donners.length / itemsPerPage
              )}
              onPageChange={handlePageClick}
              breakLabel={"..."}
              containerClassName="flex flex-wrap gap-2"
              pageClassName="border rounded-lg overflow-hidden"
              pageLinkClassName="px-4 py-2 block"
              previousClassName="border rounded-lg overflow-hidden"
              previousLinkClassName="px-4 py-2 block"
              nextClassName="border rounded-lg overflow-hidden"
              nextLinkClassName="px-4 py-2 block"
              activeClassName="bg-red-600 text-white border-red-600"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MyDonation;