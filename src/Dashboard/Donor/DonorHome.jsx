import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import Swal from "sweetalert2";

const DonorHome = () => {
  const [donners, setDonner] = useState([]);
  const { user } = useContext(AuthContext);
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
          `http://localhost:5173.app/donationDelete/${id}`,
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
          `http://localhost:5173.app/upDonationStatus/${id}`,
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
        `http://localhost:5173.app/myDonor?email=${user.email}`
      )
        .then((res) => res.json())
        .then((donner) => setDonner(donner));
    }
  }, [user]);
  return (
    <>
      <div>
        <h2 className="text-2xl text-center bg-gray-50 shadow-xl glass text-black py-2 rounded-lg ">
          Information of Donors & Requesters
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
              <th className="font-bold text-red-500">Donor Number</th>
            </tr>
          </thead>

          <tbody>
            {/* row  */}
            {donners.map((donner, i) => (
              <tr key={donner._id}>
                <td>{i + 1}</td>
                <td>{donner?.RecipientName}</td>
                <td>{donner?.HospitalName}</td>
                <td>{donner?.date}</td>
                <td>{donner?.time}</td>
                <td>{donner?.Blood}</td>
                <td className="font-bold text-red-800">{donner?.number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DonorHome;
