import { useContext, useEffect, useState } from "react";

import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProvider";
import ReactPaginate from "react-paginate";

const MyDonation = () => {
  const [donners, setDonner] = useState([]);
  const [currentDonners, setCurrentDonners] = useState([]);
  const { user } = useContext(AuthContext);
  const itemsPerPage = 8;
  //! -------------delete---------------------------------

  const handleUserDelete = (id) => {
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
        //   ----------Delete from the database--------
        fetch(
          `http://localhost:5173/donationDelete/${id}`,
          {
            method: "DELETE",
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount) {
              Swal.fire({
                title: "Deleted!",
                text: "Your request has been successfully deleted",
                icon: "success",
              });

              const remainingDonner = donners.filter(
                (singleDonner) => singleDonner._id !== id
              );
              setDonner(remainingDonner);
            }
          });
      }
    });
  };
  // --------------------------------------------------------------------------------------------
  const handleStatusUp = (id, newStatus) => {
    if (!id) return;

    Swal.fire({
      title: `Are you sure you want to mark this as ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${newStatus}!`,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `http://localhost:5173/upDonationStatus/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.modifiedCount > 0) {
              Swal.fire({
                title: "Updated!",
                text: `The status has been changed to ${newStatus}`,
                icon: "success",
              });

              const updatedDonners = donners.map((donner) =>
                donner._id === id ? { ...donner, status: newStatus } : donner
              );
              setDonner(updatedDonners);
            }
          });
      }
    });
  };
  // ----------------------------------------------------------------------------------------------

  useEffect(() => {
    if (user?.email) {
      fetch(
        `http://localhost:5173/MyDonations?email=${user.email}`
      )
        .then((res) => res.json())
        .then((donner) => setDonner(donner));
    }
  }, [user]);
  // -----------------------------Pagination-----------------------------------
  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    const offset = selectedPage * itemsPerPage;
    setCurrentDonners(donners.slice(offset, offset + itemsPerPage));
  };

  useEffect(() => {
    setCurrentDonners(donners.slice(0, itemsPerPage));
  }, [donners]);
  return (
    <>
      <div>
        <h2 className="text-2xl text-center bg-gray-50 shadow-xl glass text-black py-2 rounded-lg ">
          List of All My Blood Requests
        </h2>
        <div className="divider "></div>
      </div>
      {/* -------------------------------Table----------------------- */}
      <h1 className="text-xl font-bold text-center my-4 text-red-900">
        {donners.length === 0 && "---- No donations found ---- "}
      </h1>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Recipient</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>Blood Group</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* row  */}
            {currentDonners.map((donner, i) => (
              <tr key={donner._id}>
                <td>{i + 1}</td>
                <td>{donner?.recipientName}</td>
                <td>{donner?.hospitalName}</td>
                <td>{donner?.date}</td>
                <td>{donner?.time}</td>
                <td>{donner?.Blood}</td>
                <td>{donner?.status}</td>
                <td className=" px-4 py-2 flex gap-2">
                  {donner.status === "pending" && (
                    <>
                      <Link
                        to={`/dashboard/update/${donner._id}`}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        <FaEdit></FaEdit>
                      </Link>
                    </>
                  )}
                  {donner.status === "inprogress" && (
                    <>
                      <button
                        onClick={() => handleStatusUp(donner._id, "done")}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Done
                      </button>
                      <button
                        onClick={() => handleStatusUp(donner._id, "cancelled")}
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleUserDelete(donner._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    <FaTrash></FaTrash>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* --------------Pagination------------------------------------ */}

        <ReactPaginate
          previousLabel={"< previous"}
          nextLabel={"next >"}
          pageCount={Math.ceil(donners.length / itemsPerPage)}
          onPageChange={handlePageClick}
          containerClassName=" mt-8 flex justify-center space-x-2"
          pageClassName="py-2 px-4 border rounded"
          pageLinkClassName="text-gray-700"
          activeClassName="bg-red-500 text-white"
        />
      </div>
    </>
  );
};

export default MyDonation;
