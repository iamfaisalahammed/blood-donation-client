import { useLoaderData } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProvider";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  FaTint,
  FaUser,
  FaHospital,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaPhoneAlt,
  FaHeart,
  FaTimes,
  FaCheckCircle,
  FaEnvelope,
  FaLocationArrow,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Details = () => {
  const { user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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
  } = data || {};

  const [isConfirm, setConfirm] = useState(false);

  const onSubmit = async (formData) => {
    if (isConfirm) return;

    try {
      setConfirm(true);

      const donorData = {
        donorName: user?.displayName || "",
        donorEmail: user?.email || "",
        donorPhoto: user?.photoURL || "",
        number: formData.number,
        donationRequestId: _id,
        recipientName,
        hospitalName,
        Blood,
        District,
        Upazila,
        address,
        date,
        time,
        status: "pending",
      };

      const res = await axios.post("http://localhost:5000/donor", donorData);
      if (res.data.insertedId) {
        // Donation Request Status Update
        await axios.put(`http://localhost:5000/DonationUpStatus/${_id}`, {
          status: "inprogress",
        });

        toast.success(
          "Your blood donation request has been successfully submitted! Thank you for your generosity.",
        );

        reset();

        document.getElementById("donation_modal")?.close();

        setConfirm(false);
      } else {
        toast.error("Failed to submit donation request.");
        setConfirm(false);
      }
    } catch (error) {
      console.error("Donation submission error:", error);
      toast.error("Something went wrong. Please try again.");
      setConfirm(false);
    }
  };

  const closeModal = () => {
    document.getElementById("donation_modal")?.close();
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 py-8 md:py-14 px-4">
      <ToastContainer
        position="top-center"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      <div className="max-w-5xl mx-auto">
        {/* Top Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4 shadow-sm">
            <FaHeart className="text-2xl animate-pulse" />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Blood Donation Request
          </h1>

          <p className="text-gray-500 mt-2 max-w-xl mx-auto">
            Your one decision can make a life-changing difference.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-red-100">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-rose-500 px-6 py-8 md:px-10 md:py-10 text-white">
            <div className="absolute -right-12 -top-16 w-44 h-44 rounded-full bg-white/10" />
            <div className="absolute -left-16 -bottom-24 w-52 h-52 rounded-full bg-white/10" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-red-100 text-sm font-medium mb-2 uppercase tracking-wider">
                  Urgent Blood Requirement
                </p>

                <h2 className="text-2xl md:text-3xl font-bold">
                  Someone Needs Your Help
                </h2>

                <p className="text-red-100 mt-2 max-w-lg">
                  Please review the request details and become a lifesaving
                  blood donor.
                </p>
              </div>

              {/* Blood Group */}
              <div className="shrink-0">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white shadow-2xl flex flex-col items-center justify-center text-red-600 border-8 border-red-400/30">
                  <FaTint className="text-2xl mb-1" />
                  <span className="text-3xl md:text-4xl font-black">
                    {Blood || "N/A"}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">
                    Blood Group
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-5 md:p-10">
            <div className="mb-7">
              <h3 className="text-xl font-bold text-gray-900">
                Recipient Information
              </h3>

              <div className="h-1 w-16 bg-red-500 rounded-full mt-2" />
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Recipient */}
              <div className="group bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-100 rounded-2xl p-5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                    <FaUser />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                      Recipient Name
                    </p>

                    <p className="font-bold text-gray-800 mt-1 break-words">
                      {recipientName || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hospital */}
              <div className="group bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-100 rounded-2xl p-5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                    <FaHospital />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                      Hospital
                    </p>

                    <p className="font-bold text-gray-800 mt-1 break-words">
                      {hospitalName || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* District */}
              <div className="group bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-100 rounded-2xl p-5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                    <FaMapMarkerAlt />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                      District
                    </p>

                    <p className="font-bold text-gray-800 mt-1 break-words">
                      {District || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Upazila */}
              <div className="group bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-100 rounded-2xl p-5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                    <FaLocationArrow />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                      Upazila
                    </p>

                    <p className="font-bold text-gray-800 mt-1 break-words">
                      {Upazila || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="group bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-100 rounded-2xl p-5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                    <FaCalendarAlt />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                      Donation Date
                    </p>

                    <p className="font-bold text-gray-800 mt-1 break-words">
                      {date || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Time */}
              <div className="group bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-100 rounded-2xl p-5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                    <FaClock />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                      Donation Time
                    </p>

                    <p className="font-bold text-gray-800 mt-1 break-words">
                      {time || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mt-5 bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-white text-red-600 flex items-center justify-center shadow-sm">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-red-400 font-semibold">
                    Full Address
                  </p>

                  <p className="font-semibold text-gray-800 mt-1 leading-relaxed">
                    {address || "No address provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mt-5 bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-2">
                Request Message
              </p>

              <p className="text-gray-700 leading-relaxed">
                {message || "No additional message provided."}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-8 bg-gradient-to-r from-red-600 to-rose-500 rounded-3xl p-6 md:p-8 text-white text-center shadow-lg">
              <div className="w-14 h-14 mx-auto rounded-full bg-white/15 flex items-center justify-center mb-4">
                <FaHeart className="text-2xl animate-pulse" />
              </div>

              <h3 className="text-xl md:text-2xl font-bold">
                Ready to Save a Life?
              </h3>

              <p className="text-red-100 mt-2 mb-6 max-w-lg mx-auto">
                Share your contact number with the recipient and take the first
                step toward helping someone in need.
              </p>

              <button
                type="button"
                onClick={() =>
                  document.getElementById("donation_modal")?.showModal()
                }
                className="group inline-flex items-center justify-center gap-3 bg-white text-red-600 hover:bg-gray-100 px-7 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <FaPhoneAlt className="group-hover:rotate-12 transition-transform" />
                Share Number & Donate
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mt-6">
          <FaCheckCircle className="text-green-500" />
          <span>Your information will be shared securely.</span>
        </div>
      </div>

      {/* Modern Donation Modal */}
      {/* Compact Responsive Donation Modal */}
      <dialog id="donation_modal" className="modal p-3">
        <div
          className="
      modal-box
      w-[calc(100%-1rem)]
      max-w-[400px]
      max-h-[90vh]
      p-0
      bg-white
      text-gray-900
      rounded-2xl
      shadow-2xl
      overflow-hidden
    "
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <FaTint className="text-red-600 text-lg" />
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Donor Information
                </h2>

                <p className="text-[11px] text-gray-500">
                  Complete your information
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeModal}
              disabled={isConfirm}
              className="
          w-8 h-8
          rounded-full
          bg-gray-100
          hover:bg-red-50
          hover:text-red-600
          text-gray-500
          flex items-center justify-center
          transition-all duration-200
        "
            >
              <FaTimes className="text-xs" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="max-h-[calc(90vh-73px)] overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-5">
              {/* Request Summary */}
              <div className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-3 mb-5">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                    Donation Request
                  </p>

                  <p className="text-sm font-bold text-gray-900 truncate mt-0.5">
                    {recipientName || "Recipient"}
                  </p>

                  <p className="text-[10px] text-gray-500 truncate mt-0.5">
                    {hospitalName || "Hospital not provided"}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-xs font-extrabold">
                    {Blood || "N/A"}
                  </span>
                </div>
              </div>

              {/* Donor Name */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Donor Name
                </label>

                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />

                  <input
                    type="text"
                    value={user?.displayName || ""}
                    readOnly
                    className="
                w-full
                h-11
                pl-9
                pr-3
                rounded-xl
                border border-gray-200
                bg-gray-50
                text-gray-700
                text-sm
                outline-none
              "
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Donor Email
                </label>

                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />

                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="
                w-full
                h-11
                pl-9
                pr-3
                rounded-xl
                border border-gray-200
                bg-gray-50
                text-gray-700
                text-sm
                outline-none
              "
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Contact Number
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <div className="relative">
                  <FaPhoneAlt
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-xs ${
                      errors.number ? "text-red-500" : "text-gray-400"
                    }`}
                  />

                  <input
                    type="text"
                    maxLength={11}
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="01XXXXXXXXX"
                    {...register("number", {
                      required: "Contact number is required",
                      pattern: {
                        value: /^01[0-9]{9}$/,
                        message: "Enter a valid 11-digit number",
                      },
                    })}
                    className={`
                w-full
                h-11
                pl-9
                pr-3
                rounded-xl
                bg-white
                text-gray-900
                text-sm
                outline-none
                border
                transition-all duration-200
                ${
                  errors.number
                    ? "border-red-500 ring-2 ring-red-50"
                    : "border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-50"
                }
              `}
                  />
                </div>

                {errors.number ? (
                  <p className="text-red-500 text-[10px] mt-1.5">
                    {errors.number.message}
                  </p>
                ) : (
                  <p className="text-gray-400 text-[10px] mt-1.5">
                    Enter your 11-digit mobile number
                  </p>
                )}
              </div>

              {/* Information */}
              <div className="flex items-start gap-2.5 mt-4 px-3 py-2.5 rounded-xl bg-green-50 border border-green-100">
                <FaCheckCircle className="text-green-500 text-xs mt-0.5 shrink-0" />

                <p className="text-[10px] leading-relaxed text-gray-500">
                  Your contact number will only be shared with the recipient for
                  this donation request.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2.5 mt-5">
                {/* Cancel */}
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isConfirm}
                  className="
              h-11
              flex-1
              rounded-xl
              border border-gray-200
              bg-white
              hover:bg-gray-50
              text-gray-700
              font-semibold
              text-xs sm:text-sm
              transition-all duration-200
            "
                >
                  Cancel
                </button>

                {/* Confirm Donation */}
                <button
                  type="submit"
                  disabled={isConfirm}
                  className="
              h-11
              flex-1
              rounded-xl
              border-0
              bg-red-600
              hover:bg-red-700
              active:scale-[0.98]
              text-white
              font-semibold
              text-xs sm:text-sm
              flex
              items-center
              justify-center
              gap-2
              shadow-md
              shadow-red-100
              transition-all duration-200
              disabled:opacity-70
              disabled:cursor-not-allowed
            "
                >
                  {isConfirm ? (
                    <>
                      <span className="loading loading-spinner loading-xs" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaHeart className="text-xs" />
                      Confirm Donation
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Backdrop */}
        <form method="dialog" className="modal-backdrop bg-black/50">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Details;
