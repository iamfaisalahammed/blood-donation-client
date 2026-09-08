import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";

const Update = () => {
  const data = useLoaderData();

  const { Blood, address, date, email, name, time, _id } = data;

  const handleUpdate = (e) => {
    e.preventDefault();

    const Blood = e.target.Blood.value;
    const date = e.target.date.value;
    const time = e.target.time.value;
    const address = e.target.address.value;

    const newData = {
      time,
      date,
      Blood,
      address,
    };

    // send data to the server and database
    fetch(
      `http://localhost:5173/DonationUp/${_id}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(newData),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data.modifiedCount) {
          // console.log("successfully updated");
          Swal.fire({
            title: "Success!",
            text: "updated successfully",
            icon: "success",
            confirmButtonText: "Ok",
          });
          e.target.reset();
        }
      });
  };
  return (
    <div className="lg:w-3/4 mx-auto">
      <div className="text-center p-10">
        <h1 className="text-5xl font-bold">
          Edit & Manage Your Donation Request
        </h1>
        <p className="py-6">
          Need to change donation details? Update your request easily, adjust
          the date, location, or other relevant information before confirming
          your donation.
        </p>
      </div>
      <div className="card bg-base-100 w-full shrink-0 shadow-2xl">
        <form onSubmit={handleUpdate} className="card-body">
          {/* Name-Email */}
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="form-control flex-1">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                defaultValue={name}
                readOnly
                className="input input-bordered text-red-800"
                required
              />
            </div>
            <div className="form-control flex-1">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                defaultValue={email}
                type="text"
                readOnly
                className="input input-bordered"
                required
              />
            </div>
          </div>
          {/* form first row */}
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="form-control flex-1">
              <select
                name="Blood"
                defaultValue={Blood}
                required
                className="select select-info w-full max-w-xs mt-10"
              >
                <option value="" disabled>
                  Select Blood Group
                </option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="form-control flex-1">
              <label className="label">
                <span className="label-text">Date</span>
              </label>
              <input
                type="date"
                defaultValue={date}
                name="date"
                placeholder="e.g., pets, documents, gadgets"
                className="input input-bordered"
                required
              />
            </div>
          </div>
          {/* form second row */}
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="form-control flex-1">
              <label className="label">
                <span className="label-text">Time</span>
              </label>
              <input
                defaultValue={time}
                type="time"
                name="time"
                placeholder="time"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control flex-1">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <input
                defaultValue={address}
                type="text"
                name="address"
                placeholder="Title"
                className="input input-bordered"
                required
              />
            </div>
          </div>

          <div className="form-control mt-6">
            <button className="btn btn-outline text-white font-bold bg-red-800">
              Update Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Update;
