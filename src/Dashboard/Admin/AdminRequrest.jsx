
import { useEffect, useState } from "react";
import {
  FaEdit,
  FaEye,
  FaTrash,
  FaTimes,
  FaCheck,
  FaBan,
} from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

const AdminRequest = () => {
  const [donners, setDonner] = useState([]);
  const [currentDonners, setCurrentDonners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDonnerId, setCurrentDonnerId] = useState(null);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 8;

  // =========================
  // Open Modal
  // =========================
  const handleOpenModal = (id) => {
    setCurrentDonnerId(id);
    setIsModalOpen(true);
  };

  // =========================
  // Close Modal
  // =========================
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentDonnerId(null);
  };

  // =========================
  // Delete Donation Request
  // =========================
  const handleUserDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `https://blood-donation-server-eta-eight.vercel.app/donationDeletee/${currentDonnerId}`,
          {
            method: "DELETE",
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount) {
              Swal.fire({
                title: "Deleted!",
                text: "Your item has been successfully deleted.",
                icon: "success",
                confirmButtonColor: "#ef4444",
              });

              const remainingDonner = donners.filter(
                (singleDonner) =>
                  singleDonner._id !== currentDonnerId
              );

              setDonner(remainingDonner);
              handleCloseModal();
            }
          })
          .catch((error) => {
            console.error(error);

            Swal.fire({
              title: "Error!",
              text: "Something went wrong.",
              icon: "error",
            });
          });
      }
    });
  };

  // =========================
  // Update Status
  // =========================
  const handleStatusUp = (newStatus) => {
    if (!currentDonnerId) return;

    Swal.fire({
      title: `Are you sure you want to mark this as ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor:
        newStatus === "done" ? "#22c55e" : "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${newStatus}!`,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `https://blood-donation-server-eta-eight.vercel.app/upDonationStatuss/${currentDonnerId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: newStatus,
            }),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.modifiedCount > 0) {
              Swal.fire({
                title: "Updated!",
                text: `The status has been changed to ${newStatus}.`,
                icon: "success",
                confirmButtonColor:
                  newStatus === "done"
                    ? "#22c55e"
                    : "#ef4444",
              });

              const updatedDonners = donners.map((donner) =>
                donner._id === currentDonnerId
                  ? {
                      ...donner,
                      status: newStatus,
                    }
                  : donner
              );

              setDonner(updatedDonners);
              handleCloseModal();
            }
          })
          .catch((error) => {
            console.error(error);

            Swal.fire({
              title: "Error!",
              text: "Unable to update status.",
              icon: "error",
            });
          });
      }
    });
  };

  // =========================
  // Fetch Donation Requests
  // =========================
  useEffect(() => {
    setLoading(true);

    fetch("https://blood-donation-server-eta-eight.vercel.app/DonationRequrestAdmin")
      .then((res) => res.json())
      .then((donner) => {
        setDonner(donner);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  // =========================
  // Pagination
  // =========================
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

  // =========================
  // Status Badge
  // =========================
  const getStatusBadge = (status) => {
    if (status === "done") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
          Done
        </span>
      );
    }

    if (status === "inprogress") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
          <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
          In Progress
        </span>
      );
    }

    if (status === "cancel") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
          Cancelled
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
        Pending
      </span>
    );
  };

  // =========================
  // Selected Donation
  // =========================
  const selectedDonner = donners.find(
    (donner) => donner._id === currentDonnerId
  );

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-red-500"></span>
          <p className="mt-3 text-gray-500">
            Loading donation requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Donation Requests
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage all blood donation requests from here.
            </p>
          </div>

          <div className="rounded-xl bg-red-50 px-4 py-2 text-center">
            <p className="text-xs font-medium text-red-500">
              Total Requests
            </p>

            <p className="text-xl font-bold text-red-600">
              {donners.length}
            </p>
          </div>
        </div>

        {/* ================= EMPTY ================= */}
        {donners.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-md">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <MdManageAccounts className="text-3xl text-red-500" />
            </div>

            <h3 className="text-xl font-semibold text-gray-700">
              No donations found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              There are currently no donation requests available.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg">

            {/* ================= TABLE ================= */}
            <div className="overflow-x-auto">
              <table className="table-auto w-full min-w-[900px]">

                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      #
                    </th>

                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Recipient
                    </th>

                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Location
                    </th>

                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Date
                    </th>

                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Time
                    </th>

                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Blood Group
                    </th>

                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Status
                    </th>

                    <th className="px-4 py-4 text-center text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentDonners.map((donner, i) => (
                    <tr
                      key={donner._id}
                      className="border-b border-gray-200 transition hover:bg-gray-50"
                    >

                      {/* Number */}
                      <td className="px-4 py-4 text-sm font-medium text-gray-500">
                        {i + 1}
                      </td>

                      {/* Recipient */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
                            {donner?.recipientName
                              ?.charAt(0)
                              ?.toUpperCase() || "?"}
                          </div>

                          <span className="font-medium text-gray-800">
                            {donner?.recipientName}
                          </span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {donner?.hospitalName}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {donner?.date}
                      </td>

                      {/* Time */}
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {donner?.time}
                      </td>

                      {/* Blood */}
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-lg bg-red-50 px-3 py-1 font-bold text-red-600">
                          {donner?.Blood}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        {getStatusBadge(donner?.status)}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() =>
                            handleOpenModal(donner._id)
                          }
                          title="Manage Request"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-xl text-gray-700 transition-all hover:bg-red-500 hover:text-white"
                        >
                          <MdManageAccounts />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================= PAGINATION ================= */}
            {donners.length > itemsPerPage && (
              <div className="border-t border-gray-200 px-4 py-5">
                <ReactPaginate
                  previousLabel={"← Previous"}
                  nextLabel={"Next →"}
                  pageCount={Math.ceil(
                    donners.length / itemsPerPage
                  )}
                  onPageChange={handlePageClick}
                  containerClassName="flex flex-wrap justify-center items-center gap-2"
                  pageClassName="rounded-lg border border-gray-200 overflow-hidden"
                  pageLinkClassName="flex items-center justify-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition"
                  previousClassName="rounded-lg border border-gray-200 overflow-hidden"
                  previousLinkClassName="flex items-center justify-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition"
                  nextClassName="rounded-lg border border-gray-200 overflow-hidden"
                  nextLinkClassName="flex items-center justify-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition"
                  activeClassName="bg-red-500 text-white border-red-500"
                  disabledClassName="opacity-40 cursor-not-allowed"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          MODAL
      ===================================================== */}
      {isModalOpen && selectedDonner && (
        <div
          onClick={handleCloseModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >

            {/* ================= MODAL HEADER ================= */}
            <div className="relative bg-gradient-to-r from-red-500 to-rose-600 p-6 text-white">

              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
              >
                <FaTimes />
              </button>

              <div className="flex items-center gap-4">

                {/* Avatar */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-white bg-white text-2xl font-bold text-red-500 shadow-md">
                  {selectedDonner?.recipientName
                    ?.charAt(0)
                    ?.toUpperCase() || "?"}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold">
                    {selectedDonner?.recipientName}
                  </h2>

                  <p className="mt-1 text-sm text-red-100">
                    Donation Request
                  </p>

                  <p className="mt-1 text-xs text-red-100">
                    {selectedDonner?.hospitalName}
                  </p>
                </div>
              </div>
            </div>

            {/* ================= REQUEST INFO ================= */}
            <div className="border-b border-gray-100 p-6">

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">
                    Blood Group
                  </p>

                  <p className="mt-1 font-bold text-red-600">
                    {selectedDonner?.Blood}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">
                    Status
                  </p>

                  <div className="mt-1">
                    {getStatusBadge(selectedDonner?.status)}
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">
                    Date
                  </p>

                  <p className="mt-1 font-semibold text-gray-700">
                    {selectedDonner?.date}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">
                    Time
                  </p>

                  <p className="mt-1 font-semibold text-gray-700">
                    {selectedDonner?.time}
                  </p>
                </div>

              </div>
            </div>

            {/* ================= ACTIONS ================= */}
            <div className="space-y-3 p-6">

              {/* PENDING */}
              {selectedDonner.status === "pending" && (
                <>
                  <Link
                    to={`/dashboard/update/${selectedDonner._id}`}
                    onClick={handleCloseModal}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-none bg-blue-500 px-4 py-3 font-semibold text-white transition hover:bg-blue-600"
                  >
                    <FaEdit />
                    Edit Request
                  </Link>

                  <Link
                    to={`/dashboard/details/${selectedDonner._id}`}
                    onClick={handleCloseModal}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-none bg-gray-800 px-4 py-3 font-semibold text-white transition hover:bg-gray-900"
                  >
                    <FaEye />
                    View Request
                  </Link>

                  <button
                    onClick={handleUserDelete}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-none bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-600"
                  >
                    <FaTrash />
                    Delete Request
                  </button>
                </>
              )}

              {/* IN PROGRESS */}
              {selectedDonner.status === "inprogress" && (
                <>
                  <button
                    onClick={() => handleStatusUp("done")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-none bg-green-500 px-4 py-3 font-semibold text-white transition hover:bg-green-600"
                  >
                    <FaCheck />
                    Mark as Done
                  </button>

                  <button
                    onClick={() => handleStatusUp("cancel")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-none bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600"
                  >
                    <FaBan />
                    Cancel Request
                  </button>

                  <Link
                    to={`/dashboard/details/${selectedDonner._id}`}
                    onClick={handleCloseModal}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-none bg-gray-800 px-4 py-3 font-semibold text-white transition hover:bg-gray-900"
                  >
                    <FaEye />
                    View Request
                  </Link>

                  <button
                    onClick={handleUserDelete}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-none bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-600"
                  >
                    <FaTrash />
                    Delete Request
                  </button>
                </>
              )}

              {/* DONE */}
              {selectedDonner.status === "done" && (
                <>
                  <Link
                    to={`/dashboard/details/${selectedDonner._id}`}
                    onClick={handleCloseModal}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-none bg-gray-800 px-4 py-3 font-semibold text-white transition hover:bg-gray-900"
                  >
                    <FaEye />
                    View Request
                  </Link>

                  <button
                    onClick={handleUserDelete}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-none bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-600"
                  >
                    <FaTrash />
                    Delete Request
                  </button>
                </>
              )}

              {/* CANCEL */}
              {selectedDonner.status === "cancel" && (
                <>
                  <Link
                    to={`/dashboard/details/${selectedDonner._id}`}
                    onClick={handleCloseModal}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-none bg-gray-800 px-4 py-3 font-semibold text-white transition hover:bg-gray-900"
                  >
                    <FaEye />
                    View Request
                  </Link>

                  <button
                    onClick={handleUserDelete}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-none bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-600"
                  >
                    <FaTrash />
                    Delete Request
                  </button>
                </>
              )}

              {/* Close */}
              <button
                onClick={handleCloseModal}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-none bg-gray-100 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                <FaTimes />
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequest;

