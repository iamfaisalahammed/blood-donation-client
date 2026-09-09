import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import Swal from "sweetalert2";
import {
  FaTint,
  FaUser,
  FaEnvelope,
  FaUserFriends,
  FaMapMarkerAlt,
  FaHospital,
  FaCalendarAlt,
  FaClock,
  FaPaperPlane,
  FaLocationArrow,
  FaExclamationCircle,
} from "react-icons/fa";

const Create = () => {
  const { user } = useContext(AuthContext);

  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch Upazilas
  const { data: upazilas = [], isLoading: upazilaLoading } = useQuery({
    queryKey: ["upazilas"],
    queryFn: async () => {
      const res = await axios.get("/upazilas.json");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // Fetch Districts
  const { data: districts = [], isLoading: districtLoading } = useQuery({
    queryKey: ["districts"],
    queryFn: async () => {
      const res = await axios.get("/districts.json");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.email) {
        setUsers([]);
        setUsersLoading(false);
        return;
      }

      try {
        const res = await axios.get("https://blood-donation-server-eta-eight.vercel.app/user/Block");

        // Make sure users is always an array
        const userData = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.users)
            ? res.data.users
            : Array.isArray(res.data?.data)
              ? res.data.data
              : [];

        setUsers(userData);
      } catch (error) {
        console.error("User Status Fetch Error:", error);
        console.error("Request URL:", error?.config?.url);
        console.error("Status:", error?.response?.status);
        console.error("Response:", error?.response?.data);

        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [user?.email]);

  // Find logged-in user safely
  const loggedInUser = useMemo(() => {
    if (!Array.isArray(users)) {
      return {};
    }

    return users.find((item) => item?.email === user?.email) || {};
  }, [users, user?.email]);

  // Filter Upazilas according to selected district
  const filteredUpazilas = useMemo(() => {
    if (!selectedDistrict) {
      return upazilas;
    }

    const filtered = upazilas.filter(
      (upazila) =>
        upazila?.district === selectedDistrict ||
        upazila?.district_name === selectedDistrict ||
        upazila?.districtName === selectedDistrict,
    );

    return filtered.length > 0 ? filtered : upazilas;
  }, [upazilas, selectedDistrict]);

  // District change
  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
    setSelectedUpazila("");
  };

  // Submit donation request
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const donationRequest = {
      ...data,
      status: "pending",
      name: user?.displayName || data.name,
      email: user?.email || data.email,
    };

    try {
      const response = await axios.post(
        "https://blood-donation-server-eta-eight.vercel.app/recipient",
        donationRequest,
      );

      if (response.data?.insertedId) {
        reset({
          name: user?.displayName || "",
          email: user?.email || "",
          recipientName: "",
          address: "",
          hospitalName: "",
          Blood: "",
          District: "",
          Upazila: "",
          date: "",
          time: "",
          message: "",
        });

        setSelectedDistrict("");
        setSelectedUpazila("");

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Donation Request Created",
          text: "Your blood donation request has been published successfully.",
          showConfirmButton: false,
          timer: 1800,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Create Donation Request Error:", error);
      console.error("Request URL:", error?.config?.url);
      console.error("Request Data:", error?.config?.data);
      console.error("Status:", error?.response?.status);
      console.error("Response:", error?.response?.data);
      console.error("Message:", error?.message);

      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Something went wrong. Please try again.",
        confirmButtonColor: "#991b1b",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError = false) =>
    `w-full h-12 px-4 rounded-xl border ${
      hasError ? "border-red-500" : "border-gray-200"
    } bg-white text-gray-800 outline-none transition-all duration-200 focus:border-red-700 focus:ring-2 focus:ring-red-100`;

  const labelClass =
    "flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700";

  // Loading user status
  if (usersLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-100 border-t-red-700 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-600 font-medium">
            Checking your account status...
          </p>
        </div>
      </div>
    );
  }

  // Blocked account
  if (loggedInUser?.status === "Blocked") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl bg-white border border-red-100 rounded-3xl shadow-xl p-8 md:p-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-6">
            <FaExclamationCircle className="text-4xl text-red-700" />
          </div>

          <p className="text-xs uppercase tracking-[0.25em] font-bold text-red-700 mb-3">
            Account Restricted
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Account Is Blocked
          </h2>

          <p className="text-gray-500 leading-7">
            Your account is currently blocked, so you are not allowed to create
            a blood donation request. Please contact the administrator if you
            believe this was a mistake.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <FaTint className="text-red-700 text-lg" />
            </div>

            <p className="text-sm uppercase tracking-[0.2em] font-bold text-red-700">
              Blood Donation
            </p>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Create a Blood Request
          </h1>

          <p className="mt-3 text-gray-500 max-w-2xl leading-7">
            Share the details of the patient and help connect them with a
            suitable blood donor from the community.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Top Bar */}
          <div className="bg-gray-950 px-6 md:px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                Donation Request Details
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                Please provide accurate information about the blood request.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              All required fields must be completed
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 md:p-8 lg:p-10"
          >
            {/* Requester Information */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                  <FaUser className="text-red-700 text-sm" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Requester Information
                  </h3>

                  <p className="text-xs text-gray-500">
                    Your account information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>
                    <FaUser className="text-red-700" />
                    Your Name
                  </label>

                  <input
                    {...register("name", {
                      required: "Name is required",
                    })}
                    type="text"
                    defaultValue={user?.displayName || ""}
                    placeholder="Your name"
                    readOnly
                    className={`${inputClass(
                      errors.name,
                    )} bg-gray-50 cursor-not-allowed`}
                  />

                  {errors.name && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>
                    <FaEnvelope className="text-red-700" />
                    Email Address
                  </label>

                  <input
                    {...register("email", {
                      required: "Email is required",
                    })}
                    type="email"
                    defaultValue={user?.email || ""}
                    placeholder="Your email"
                    readOnly
                    className={`${inputClass(
                      errors.email,
                    )} bg-gray-50 cursor-not-allowed`}
                  />

                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                  <FaUserFriends className="text-red-700 text-sm" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Patient Information
                  </h3>

                  <p className="text-xs text-gray-500">
                    Information about the person who needs blood
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>
                    <FaUserFriends className="text-red-700" />
                    Recipient Name
                  </label>

                  <input
                    {...register("recipientName", {
                      required: "Recipient name is required",
                    })}
                    type="text"
                    placeholder="Enter recipient name"
                    className={inputClass(errors.recipientName)}
                  />

                  {errors.recipientName && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.recipientName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>
                    <FaHospital className="text-red-700" />
                    Hospital Name
                  </label>

                  <input
                    {...register("hospitalName", {
                      required: "Hospital name is required",
                    })}
                    type="text"
                    placeholder="Enter hospital name"
                    className={inputClass(errors.hospitalName)}
                  />

                  {errors.hospitalName && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.hospitalName.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>
                    <FaMapMarkerAlt className="text-red-700" />
                    Full Address
                  </label>

                  <input
                    {...register("address", {
                      required: "Address is required",
                    })}
                    type="text"
                    placeholder="Enter complete address"
                    className={inputClass(errors.address)}
                  />

                  {errors.address && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Blood & Location */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                  <FaLocationArrow className="text-red-700 text-sm" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">Blood & Location</h3>

                  <p className="text-xs text-gray-500">
                    Specify the required blood group and location
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>
                    <FaTint className="text-red-700" />
                    Blood Group
                  </label>

                  <select
                    {...register("Blood", {
                      required: "Please select a blood group",
                    })}
                    defaultValue=""
                    className={inputClass(errors.Blood)}
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

                  {errors.Blood && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.Blood.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>
                    <FaMapMarkerAlt className="text-red-700" />
                    Recipient District
                  </label>

                  <select
                    {...register("District", {
                      required: "Please select a district",
                    })}
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    className={inputClass(errors.District)}
                  >
                    <option value="" disabled>
                      {districtLoading
                        ? "Loading districts..."
                        : "Select District"}
                    </option>

                    {districts.map((district) => (
                      <option key={district.id} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </select>

                  {errors.District && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.District.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>
                    <FaMapMarkerAlt className="text-red-700" />
                    Recipient Upazila
                  </label>

                  <select
                    {...register("Upazila", {
                      required: "Please select an upazila",
                    })}
                    value={selectedUpazila}
                    onChange={(e) => setSelectedUpazila(e.target.value)}
                    className={inputClass(errors.Upazila)}
                  >
                    <option value="" disabled>
                      {upazilaLoading
                        ? "Loading upazilas..."
                        : "Select Upazila"}
                    </option>

                    {filteredUpazilas.map((upazila) => (
                      <option key={upazila.id} value={upazila.name}>
                        {upazila.name}
                      </option>
                    ))}
                  </select>

                  {errors.Upazila && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.Upazila.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Donation Schedule */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                  <FaCalendarAlt className="text-red-700 text-sm" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">Donation Schedule</h3>

                  <p className="text-xs text-gray-500">
                    When the donation is needed
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>
                    <FaCalendarAlt className="text-red-700" />
                    Donation Date
                  </label>

                  <input
                    {...register("date", {
                      required: "Donation date is required",
                    })}
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className={inputClass(errors.date)}
                  />

                  {errors.date && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>
                    <FaClock className="text-red-700" />
                    Donation Time
                  </label>

                  <input
                    {...register("time", {
                      required: "Donation time is required",
                    })}
                    type="time"
                    className={inputClass(errors.time)}
                  />

                  {errors.time && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.time.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mb-10">
              <label className={labelClass}>
                <FaPaperPlane className="text-red-700" />
                Request Message
              </label>

              <textarea
                {...register("message", {
                  required: "Request message is required",
                })}
                rows="5"
                placeholder="Write a short message about why blood is needed..."
                className={`${inputClass(
                  errors.message,
                )} h-auto py-3 resize-none`}
              />

              {errors.message && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="border-t border-gray-100 pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-xl bg-red-700 hover:bg-red-800 disabled:bg-red-400 text-white font-bold flex items-center justify-center gap-3 transition-all duration-200 shadow-lg shadow-red-100"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publishing Request...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Submit Blood Request
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                Your request will be published with a pending status and can
                help connect you with potential donors.
              </p>
            </div>
          </form>
        </div>

        {/* Bottom Note */}
        <div className="mt-6 flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-5">
          <FaTint className="text-red-700 mt-1 shrink-0" />

          <p className="text-sm text-gray-600 leading-6">
            <span className="font-semibold text-gray-800">
              Every request matters.
            </span>{" "}
            Please make sure the information you provide is accurate so donors
            can respond quickly and reach the right location.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Create;
