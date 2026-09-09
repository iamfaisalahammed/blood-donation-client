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
            `https://blood-donation-server-eta-eight.vercel.app/users/admin/${user._id}`
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
            `https://blood-donation-server-eta-eight.vercel.app/users/volunteer/${user._id}`
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
          `https://blood-donation-server-eta-eight.vercel.app/userStatus/${id}`,
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
                <td className="py-2 px-4 text-black">{user?.email}</td>
                <td className="py-2 px-4 text-black">{user?.name}</td>
                <td className="py-2 px-4 font-semibold text-black">{user?.role}</td>
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="bg-white w-full max-w-md mx-4 rounded-3xl shadow-2xl overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <img
            src={
              selectedUser?.photoURL ||
              "https://i.ibb.co/4pDNDk1/avatar.png"
            }
            alt=""
            className="w-16 h-16 rounded-full border-4 border-white"
          />

          <div>
            <h2 className="text-xl font-bold">
              {selectedUser?.name}
            </h2>
            <p className="text-sm text-red-100">
              {selectedUser?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-3">
        <button
          onClick={() => handleMakeVolunteer(selectedUser)}
          className="btn w-full bg-blue-500 hover:bg-blue-600 border-none text-white"
        >
          🏅 Make Volunteer
        </button>

        <button
          onClick={() => handleMakeAdmin(selectedUser)}
          className="btn w-full bg-purple-500 hover:bg-purple-600 border-none text-white"
        >
          👑 Make Admin
        </button>

        {selectedUser?.status === "Active" ? (
          <button
            onClick={() =>
              handleStatusUpdate(
                selectedUser._id,
                "Blocked"
              )
            }
            className="btn w-full bg-red-500 hover:bg-red-600 border-none text-white"
          >
            🔒 Block User
          </button>
        ) : (
          <button
            onClick={() =>
              handleStatusUpdate(
                selectedUser._id,
                "Active"
              )
            }
            className="btn w-full bg-green-500 hover:bg-green-600 border-none text-white"
          >
            🔓 Unblock User
          </button>
        )}

        <button
          onClick={closeModal}
          className="btn w-full bg-gray-200 hover:bg-gray-300 border-none text-gray-700"
        >
          ✕ Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminUsers;
