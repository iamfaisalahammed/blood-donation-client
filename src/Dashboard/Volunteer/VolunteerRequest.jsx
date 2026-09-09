import { useEffect, useState } from "react";
import { FaEye, FaCheck, FaTimes, FaTint } from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

const VolunteerRequest = () => {
  const [donners, setDonner] = useState([]);
  const [currentDonners, setCurrentDonners] = useState([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 8;

  // ================= DELETE =================
  const handleUserDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/donationDeletee/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount) {
              Swal.fire({
                title: "Deleted!",
                text: "The request has been successfully deleted.",
                icon: "success",
                confirmButtonColor: "#000000",
              });

              const remainingDonner = donners.filter(
                (singleDonner) => singleDonner._id !== id
              );

              setDonner(remainingDonner);
            }
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "Something went wrong.",
              icon: "error",
              confirmButtonColor: "#000000",
            });
          });
      }
    });
  };

  // ================= STATUS UPDATE =================
  const handleStatusUp = (id, newStatus) => {
    if (!id) return;

    Swal.fire({
      title: `Mark as ${newStatus}?`,
      text: `Are you sure you want to change this request to ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#ef4444",
      confirmButtonText: `Yes, ${newStatus}!`,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/upDonationStatuss/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.modifiedCount > 0) {
              Swal.fire({
                title: "Updated!",
                text: `The status has been changed to ${newStatus}.`,
                icon: "success",
                confirmButtonColor: "#000000",
              });

              const updatedDonners = donners.map((donner) =>
                donner._id === id
                  ? { ...donner, status: newStatus }
                  : donner
              );

              setDonner(updatedDonners);
            }
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "Unable to update the status.",
              icon: "error",
              confirmButtonColor: "#000000",
            });
          });
      }
    });
  };

  // ================= GET DATA =================
  useEffect(() => {
    setLoading(true);

    fetch(`http://localhost:5000/DonationVolunteerRequest`)
      .then((res) => res.json())
      .then((data) => {
        setDonner(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // ================= PAGINATION =================
  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    const offset = selectedPage * itemsPerPage;

    setCurrentDonners(donners.slice(offset, offset + itemsPerPage));
  };

  useEffect(() => {
    setCurrentDonners(donners.slice(0, itemsPerPage));
  }, [donners]);

  // ================= STATUS BADGE =================
  const getStatusBadge = (status) => {
    if (status === "pending") {
      return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
          Pending
        </span>
      );
    }

    if (status === "inprogress") {
      return (
        <span className="inline-flex items-center rounded-full text-black px-3 py-1 text-xs font-semibold ">
          In Progress
        </span>
      );
    }

    if (status === "done") {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          Done
        </span>
      );
    }

    if (status === "cancelled") {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
          Cancelled
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white">
              <FaTint />
            </div>

            <h1 className="text-2xl font-bold text-black">
              Volunteer Requests
            </h1>
          </div>

          <p className="text-sm text-gray-500">
            Manage and monitor all blood donation volunteer requests.
          </p>
        </div>

        {/* Total Requests */}
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-5 py-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Total Requests
            </p>
            <p className="text-xl font-bold text-black">
              {donners.length}
            </p>
          </div>
        </div>
      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Table Header */}
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-black">Donation Requests</h2>
          <p className="mt-1 text-xs text-gray-500">
            Review request information and update their current status.
          </p>
        </div>

        {/* ================= LOADING ================= */}
        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <span className="loading loading-spinner loading-lg text-black"></span>
              <p className="text-sm text-gray-500">
                Loading requests...
              </p>
            </div>
          </div>
        ) : donners.length === 0 ? (
          /* ================= EMPTY ================= */
          <div className="flex min-h-[350px] flex-col items-center justify-center px-5 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-400">
              <FaTint />
            </div>

            <h3 className="text-lg font-semibold text-black">
              No donation requests found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              There are currently no volunteer donation requests.
            </p>
          </div>
        ) : (
          <>
            {/* ================= RESPONSIVE TABLE ================= */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      #
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Recipient
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Location
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Date
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Time
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Blood Group
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentDonners.map((donner, i) => (
                    <tr
                      key={donner._id}
                      className="border-b border-gray-100 transition hover:bg-gray-50"
                    >
                      {/* Number */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-gray-500">
                          {i + 1}
                        </span>
                      </td>

                      {/* Recipient */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-black">
                          {donner?.recipientName || "N/A"}
                        </p>
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4">
                        <p className="max-w-[180px] truncate text-sm text-gray-600">
                          {donner?.hospitalName || "N/A"}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-600">
                          {donner?.date || "N/A"}
                        </span>
                      </td>

                      {/* Time */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-600">
                          {donner?.time || "N/A"}
                        </span>
                      </td>

                      {/* Blood */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-bold text-red-600">
                          <FaTint className="text-xs" />
                          {donner?.Blood || "N/A"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {getStatusBadge(donner?.status)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Pending */}
                          {donner.status === "pending" && (
                            <Link
                              to={`/dashboard/details/${donner._id}`}
                              title="View Details"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-black transition hover:bg-black hover:text-white"
                            >
                              <FaEye className="text-sm" />
                            </Link>
                          )}

                          {/* In Progress */}
                          {donner.status === "inprogress" && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusUp(donner._id, "done")
                                }
                                title="Mark as Done"
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white transition hover:bg-gray-800"
                              >
                                <FaCheck className="text-sm" />
                              </button>

                              <button
                                onClick={() =>
                                  handleStatusUp(
                                    donner._id,
                                    "cancelled"
                                  )
                                }
                                title="Cancel Request"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                              >
                                <FaTimes className="text-sm" />
                              </button>
                            </>
                          )}

                          {/* Done / Cancelled */}
                          {(donner.status === "done" ||
                            donner.status === "cancelled") && (
                            <Link
                              to={`/dashboard/details/${donner._id}`}
                              title="View Details"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-black transition hover:bg-black hover:text-white"
                            >
                              <FaEye className="text-sm" />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================= PAGINATION ================= */}
            {donners.length > itemsPerPage && (
              <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-5 py-5 sm:flex-row">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-black">
                    {Math.min(currentDonners.length, itemsPerPage)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-black">
                    {donners.length}
                  </span>{" "}
                  requests
                </p>

                <ReactPaginate
                  previousLabel="←"
                  nextLabel="→"
                  pageCount={Math.ceil(
                    donners.length / itemsPerPage
                  )}
                  onPageChange={handlePageClick}
                  containerClassName="flex items-center gap-2"
                  pageClassName="flex h-9 min-w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  pageLinkClassName="flex h-full w-full items-center justify-center px-3"
                  previousClassName="flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-black hover:text-white"
                  previousLinkClassName="px-3"
                  nextClassName="flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-black hover:text-white"
                  nextLinkClassName="px-3"
                  activeClassName="!border-black !bg-black !text-white"
                  disabledClassName="cursor-not-allowed opacity-40"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VolunteerRequest;