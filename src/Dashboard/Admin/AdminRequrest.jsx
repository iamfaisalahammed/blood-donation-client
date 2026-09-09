import { useState, useEffect } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { MdManageAccounts } from "react-icons/md";

const AdminRequest = () => {
  const [donners, setDonner] = useState([]);
  const [currentDonners, setCurrentDonners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDonnerId, setCurrentDonnerId] = useState(null);
  const itemsPerPage = 8;

  const handleOpenModal = (id) => {
    setCurrentDonnerId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
          `http://localhost:5000/donationDeletee/${currentDonnerId}`,
          {
            method: "DELETE",
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount) {
              Swal.fire({
                title: "Deleted!",
                text: "Your item has been successfully deleted",
                icon: "success",
              });
              const remainingDonner = donners.filter(
                (singleDonner) => singleDonner._id !== currentDonnerId
              );
              setDonner(remainingDonner);
              handleCloseModal();
            }
          });
      }
    });
  };

  const handleStatusUp = (newStatus) => {
    if (!currentDonnerId) return;

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
          `http://localhost:5000/upDonationStatuss/${currentDonnerId}`,
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
                donner._id === currentDonnerId
                  ? { ...donner, status: newStatus }
                  : donner
              );
              setDonner(updatedDonners);
              handleCloseModal();
            }
          });
      }
    });
  };

  useEffect(() => {
    fetch(
      `http://localhost:5000/DonationRequrestAdmin`
    )
      .then((res) => res.json())
      .then((donner) => setDonner(donner));
  }, []);

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    const offset = selectedPage * itemsPerPage;
    setCurrentDonners(donners.slice(offset, offset + itemsPerPage));
  };

  useEffect(() => {
    setCurrentDonners(donners.slice(0, itemsPerPage));
  }, [donners]);

  return (
    <div className="container mx-auto my-8 p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-red-600">
          {donners.length === 0 && "---- No donations found ---- "}
        </h1>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="table-auto w-full text-gray-700">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-sm font-medium text-left">#</th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                Recipient
              </th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                Location
              </th>
              <th className="py-3 px-4 text-sm font-medium text-left">Date</th>
              <th className="py-3 px-4 text-sm font-medium text-left">Time</th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                Blood Group
              </th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                Status
              </th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentDonners.map((donner, i) => (
              <tr key={donner._id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4">{i + 1}</td>
                <td className="py-3 px-4">{donner?.recipientName}</td>
                <td className="py-3 px-4">{donner?.hospitalName}</td>
                <td className="py-3 px-4">{donner?.date}</td>
                <td className="py-3 px-4">{donner?.time}</td>
                <td className="py-3 px-4">{donner?.Blood}</td>
                <td className="py-3 px-4">{donner?.status}</td>
                <td className="py-3 px-4 flex gap-2 justify-center">
                  <button
                    onClick={() => handleOpenModal(donner._id)}
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
                  >
                    <MdManageAccounts></MdManageAccounts>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ReactPaginate
          previousLabel={"< previous"}
          nextLabel={"next >"}
          pageCount={Math.ceil(donners.length / itemsPerPage)}
          onPageChange={handlePageClick}
          containerClassName="mt-6 flex justify-center space-x-2"
          pageClassName="py-2 px-4 border rounded-lg text-sm"
          pageLinkClassName="text-gray-700"
          activeClassName="bg-red-500 text-white"
        />
      </div>

      {isModalOpen && (
        <div
          onClick={handleCloseModal}
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <h2 className="text-xl font-semibold text-center mb-4">
              Select Action
            </h2>
            <div className="flex flex-col space-y-2">
              {donners
                .filter((donner) => donner._id === currentDonnerId)
                .map((donner) => {
                  if (donner.status === "done") {
                    return (
                      <>
                        <Link
                          to={`/dashboard/details/${donner._id}`}
                          className="bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 font-bold text-center"
                        >
                          <FaEye /> View
                        </Link>
                        <button
                          onClick={handleUserDelete}
                          className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 font-bold text-center"
                        >
                          <FaTrash /> Delete
                        </button>
                      </>
                    );
                  } else if (donner.status === "inprogress") {
                    return (
                      <>
                        <button
                          onClick={() => handleStatusUp("done")}
                          className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 font-bold text-center"
                        >
                          <FaEdit /> Mark as Done
                        </button>
                        <button
                          onClick={() => handleStatusUp("cancel")}
                          className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 font-bold text-center"
                        >
                          <FaTrash /> Cancel
                        </button>
                        <Link
                          to={`/dashboard/details/${donner._id}`}
                          className="bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 font-bold text-center"
                        >
                          <FaEye /> View
                        </Link>
                        <button
                          onClick={handleUserDelete}
                          className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 font-bold text-center"
                        >
                          <FaTrash /> Delete
                        </button>
                      </>
                    );
                  } else if (donner.status === "pending") {
                    return (
                      <>
                        <Link
                          to={`/dashboard/update/${donner._id}`}
                          className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 font-bold text-center"
                        >
                          <FaEdit /> Edit
                        </Link>
                        <Link
                          to={`/dashboard/details/${donner._id}`}
                          className="bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 font-bold text-center"
                        >
                          <FaEye /> View
                        </Link>
                        <button
                          onClick={handleUserDelete}
                          className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 font-bold text-center"
                        >
                          <FaTrash /> Delete
                        </button>
                      </>
                    );
                  }
                  return null;
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequest;
