import { useLoaderData } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProvider";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Details = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { user } = useContext(AuthContext);
  const data = useLoaderData();

  const {
    Blood,
    address,
    date,
    time,
    _id,
    message,
    Upazila,
    District,
    recipientName,
    hospitalName,
  } = data;

  useEffect(() => {
    if (!_id) return;
    axios.put(
      `http://localhost:5173/DonationUpStatus/${_id}`,
      {
        status: "inprogress",
      }
    );
  }, [_id]);

  const [isConfirm, setConfirm] = useState(false);

  const onSubmit = (formData) => {
    if (isConfirm) return;
    setConfirm(true);
    formData.status = "pending";

    axios
      .post(
        "http://localhost:5173/donor",
        formData
      )
      .then((res) => {
        if (res.data.insertedId) {
          reset();
          toast.success(
            "Your blood donation request has been successfully submitted! Thank you for your generosity."
          );
        }
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <ToastContainer />
      <div className="card bg-base-100 shadow-xl p-6">
        <h2 className="text-xl font-bold text-center mb-4">
          Recipient Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <strong>Recipient Name:</strong> {recipientName}
          </p>
          <p>
            <strong>Blood Group:</strong> {Blood}
          </p>
          <p>
            <strong>Hospital Name:</strong> {hospitalName}
          </p>
          <p>
            <strong>Address:</strong> {address}
          </p>
          <p>
            <strong>District:</strong> {District}
          </p>
          <p>
            <strong>Upazila:</strong> {Upazila}
          </p>
          <p>
            <strong>Date:</strong> {date}
          </p>
          <p>
            <strong>Time:</strong> {time}
          </p>
          <p>
            <strong>Message:</strong> {message}
          </p>
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="btn btn-neutral bg-black glass text-white"
            onClick={() =>
              document.getElementById("donation_modal").showModal()
            }
          >
            Share Number
          </button>
        </div>
      </div>

      {/* Modal Section */}
      <dialog id="donation_modal" className="modal">
        <form onSubmit={handleSubmit(onSubmit)} className="modal-box">
          <h2 className="text-lg font-bold text-center mb-4">
            Donor Information
          </h2>

          <div className="form-control col-span-2">
            <label className="label">
              <span className="label-text text-red-800">
                Donor Contact Number
              </span>
            </label>
            <input
              {...register("number", {
                required: "Contact number is required",
                pattern: {
                  value: /^[0-9]{11}$/,
                  message: "Contact number must be exactly 11 digits",
                },
              })}
              type="text"
              placeholder="Enter contact number"
              className="input input-bordered"
            />
            {errors.number && (
              <p className="text-red-600">{errors.number.message}</p>
            )}
          </div>

          <div className="modal-action flex justify-between mt-4">
            <button
              type="submit"
              disabled={isConfirm}
              className="btn btn-neutral bg-black glass text-white mx-auto"
            >
              {isConfirm ? "Processing..." : "Confirm"}
            </button>
            <button
              type="button"
              className="btn btn-circle"
              onClick={() => document.getElementById("donation_modal").close()}
            >
              ❌
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default Details;
