import Swal from "sweetalert2";
import UseUser from "../../Hooks/UseUser";
import axios from "axios";
import { useState } from "react";

const AdminUsers = () => {
  const [users, loading, refetch] = UseUser();
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalOpen(false);
  };

  const handleMakeAdmin = (user) => {
    Swal.fire({
      title: `Are you sure you want to make ${user.name} an Admin?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Make Admin!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(
            `http://localhost:5000/users/admin/${user._id}`
          )
          .then((res) => {
            if (res.data.modifiedCount > 0) {
              refetch();
              closeModal();
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${user.name} is now an Admin!`,
                showConfirmButton: false,
                timer: 1500,
              });
            }
          });
      }
    });
  };

  const handleMakeVolunteer = (user) => {
    Swal.fire({
      title: `Are you sure you want to make ${user.name} a Volunteer?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Make Volunteer!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(
            `http://localhost:5000/users/volunteer/${user._id}`
          )
          .then((res) => {
            if (res.data.modifiedCount > 0) {
              refetch();
              closeModal();
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${user.name} is now a Volunteer!`,
                showConfirmButton: false,
                timer: 1500,
              });
            }
          });
      }
    });
  };

  const handleStatusUpdate = (id, newStatus) => {
    Swal.fire({
      title: `Are you sure you want to mark this user as ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${newStatus}!`,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `http://localhost:5000/userStatus/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.modifiedCount > 0) {
              refetch();
              closeModal();
              Swal.fire({
                title: "Updated!",
                text: `The status has been changed to ${newStatus}`,
                icon: "success",
              });
            }
          });
      }
    });
  };

  if (loading) {
    return <h2 className="text-center text-xl font-semibold">Loading...</h2>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Manage Users</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4">Avatar</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="py-2 px-4 flex justify-center">
                  <img
                    src={user?.photoURL}
                    alt="Avatar"
                    className="h-12 w-12 rounded-full border"
                  />
                </td>
                <td className="py-2 px-4">{user?.email}</td>
                <td className="py-2 px-4">{user?.name}</td>
                <td className="py-2 px-4 font-semibold">{user?.role}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      user?.status === "Active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {user?.status}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => openModal(user)}
                    className="px-3 py-1 0 text-white rounded-md text-2xl"
                  >
                    ⚙
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h3 className="text-lg font-semibold">
              Manage {selectedUser.name}
            </h3>
            <button
              onClick={() => handleMakeVolunteer(selectedUser)}
              className="block w-full text-left px-4 py-2 mt-2 bg-gray-200 hover:bg-gray-300"
            >
              🏅 Make Volunteer
            </button>
            <button
              onClick={() => handleMakeAdmin(selectedUser)}
              className="block w-full text-left px-4 py-2 mt-2 bg-gray-200 hover:bg-gray-300"
            >
              🏆 Make Admin
            </button>
            {selectedUser?.status === "Active" ? (
              <button
                onClick={() => handleStatusUpdate(selectedUser._id, "Blocked")}
                className="block w-full text-left px-4 py-2 mt-2 bg-red-500 text-white hover:bg-red-600"
              >
                🔒 Block User
              </button>
            ) : (
              <button
                onClick={() => handleStatusUpdate(selectedUser._id, "Active")}
                className="block w-full text-left px-4 py-2 mt-2 bg-green-500 text-white hover:bg-green-600"
              >
                🔓 Unblock User
              </button>
            )}
            <button
              onClick={closeModal}
              className="block w-full text-left px-4 py-2 mt-2 bg-gray-300 hover:bg-gray-400"
            >
              ❌ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
