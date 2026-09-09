import { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  FaEdit,
  FaUser,
  FaEnvelope,
  FaTint,
  FaMapMarkerAlt,
  FaLocationArrow,
  FaCamera,
  FaCheck,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import { AuthContext } from "../Providers/AuthProvider";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";

const API_URL = "https://blood-donation-server-eta-eight.vercel.app";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [isEditable, setIsEditable] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      Blood: "",
      District: "",
      Upazila: "",
      image: null,
    },
  });

  const selectedImage = watch("image");

  // ==============================
  // Load Districts
  // ==============================
  const {
    data: districts = [],
    isLoading: districtsLoading,
  } = useQuery({
    queryKey: ["districts"],
    queryFn: async () => {
      const res = await axios.get("/districts.json");
      return res.data;
    },
  });

  // ==============================
  // Load Upazilas
  // ==============================
  const {
    data: upazilas = [],
    isLoading: upazilasLoading,
  } = useQuery({
    queryKey: ["upazilas"],
    queryFn: async () => {
      const res = await axios.get("/upazilas.json");
      return res.data;
    },
  });

  // ==============================
  // Set User Data
  // ==============================
  useEffect(() => {
    if (!user) return;

    const userName = user?.displayName || "";
    const userEmail = user?.email || "";
    const bloodGroup = user?.bloodGroup || "";
    const district = user?.district || "";
    const upazila = user?.upazila || "";
    const photo = user?.photoURL || "";

    reset({
      name: userName,
      email: userEmail,
      Blood: bloodGroup,
      District: district,
      Upazila: upazila,
      image: null,
    });

    setPreviewImage(photo);
  }, [user, reset]);

  // ==============================
  // Image Preview
  // ==============================
  useEffect(() => {
    if (!selectedImage || selectedImage.length === 0) {
      return;
    }

    const file = selectedImage[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setPreviewImage(imageUrl);

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [selectedImage]);

  // ==============================
  // Update Profile
  // ==============================
  const handleUpdateProfile = async (data) => {
    if (!user?.email) {
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "User email not found. Please login again.",
        confirmButtonColor: "#dc2626",
      });

      return;
    }

    try {
      setSaving(true);

      // =====================================
      // Upload New Image Only If Selected
      // =====================================
      let imageUrl = user?.photoURL || "";

      if (data?.image && data.image.length > 0) {
        if (!image_hosting_key) {
          throw new Error(
            "Image hosting key is missing. Please check your .env file."
          );
        }

        const formData = new FormData();
        formData.append("image", data.image[0]);

        const imgResponse = await axios.post(
          image_hosting_api,
          formData
        );

        imageUrl = imgResponse?.data?.data?.display_url;

        if (!imageUrl) {
          throw new Error("Image upload failed.");
        }
      }

      // =====================================
      // Prepare Updated Data
      // =====================================
      const updatedData = {
        name: data?.name?.trim() || "",
        email: user.email,
        image: imageUrl,
        bloodGroup: data?.Blood || "",
        district: data?.District || "",
        upazila: data?.Upazila || "",
      };

      console.log("Updating profile with:", updatedData);

      // =====================================
      // Update MongoDB
      // =====================================
      const response = await axios.patch(
        `${API_URL}/users/profile/${encodeURIComponent(user.email)}`,
        updatedData
      );

      console.log("Profile update response:", response.data);

      // =====================================
      // Check Backend Response
      // =====================================
      const isUpdated =
        response?.data?.modifiedCount > 0 ||
        response?.data?.matchedCount > 0 ||
        response?.data?.acknowledged === true;

      if (!isUpdated) {
        throw new Error(
          response?.data?.message || "Profile could not be updated."
        );
      }

      // =====================================
      // Update Firebase Profile
      // =====================================
      await updateProfile(user, {
        displayName: updatedData.name,
        photoURL: imageUrl,
      });

      // =====================================
      // Update Local Preview
      // =====================================
      setPreviewImage(imageUrl);

      // =====================================
      // Reset Form With New Values
      // =====================================
      reset({
        name: updatedData.name,
        email: user.email,
        Blood: updatedData.bloodGroup,
        District: updatedData.district,
        Upazila: updatedData.upazila,
        image: null,
      });

      // Exit Edit Mode
      setIsEditable(false);

      // =====================================
      // Success Message
      // =====================================
      await Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully.",
        showConfirmButton: false,
        timer: 1800,
        customClass: {
          popup: "rounded-2xl",
        },
      });

    } catch (error) {
      console.error("Profile Update Error:", error);

      let errorMessage = "Something went wrong. Please try again.";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Update Failed",
        text: errorMessage,
        confirmButtonColor: "#dc2626",
        customClass: {
          popup: "rounded-2xl",
        },
      });
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // Cancel Edit
  // ==============================
  const handleCancel = () => {
    reset({
      name: user?.displayName || "",
      email: user?.email || "",
      Blood: user?.bloodGroup || "",
      District: user?.district || "",
      Upazila: user?.upazila || "",
      image: null,
    });

    setPreviewImage(user?.photoURL || "");

    setIsEditable(false);
  };

  // ==============================
  // Edit Mode
  // ==============================
  const handleEdit = () => {
    setIsEditable(true);

    reset({
      name: user?.displayName || "",
      email: user?.email || "",
      Blood: user?.bloodGroup || "",
      District: user?.district || "",
      Upazila: user?.upazila || "",
      image: null,
    });
  };

  // ==============================
  // Input Classes
  // ==============================
  const inputClass =
    "h-13 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500";

  const selectClass =
    "h-13 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-800 outline-none transition-all focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500";

  return (
    <section className="min-h-screen bg-white px-5 py-10 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <div className="mx-auto max-w-6xl">

        {/* =========================
            Header
        ========================== */}
        <div className="mx-auto max-w-3xl text-center">

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">
            My Profile
          </p>

          <h1 className="mt-4 font-serif text-4xl font-black italic leading-tight text-gray-950 sm:text-5xl">
            Manage Your
            <span className="text-red-600"> Profile</span>
          </h1>

          <div className="mx-auto mt-5 flex items-center justify-center gap-2">
            <span className="h-[2px] w-8 bg-gray-200" />
            <span className="h-[3px] w-12 rounded-full bg-red-600" />
            <span className="h-[2px] w-8 bg-gray-200" />
          </div>

          <p className="mx-auto mt-5 max-w-xl text-sm font-medium leading-7 text-gray-500">
            Keep your personal information updated so donors and recipients
            can connect with you easily.
          </p>

        </div>

        {/* =========================
            Profile Card
        ========================== */}
        <div className="mx-auto mt-12 overflow-hidden rounded-[30px] border border-gray-100 bg-white shadow-[0_15px_60px_rgba(0,0,0,0.06)]">

          {/* =========================
              Top Profile Area
          ========================== */}
          <div className="relative overflow-hidden bg-gray-950 px-6 py-10 sm:px-10 sm:py-12">

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600/10" />

            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/5" />

            <div className="relative z-10 flex flex-col items-center gap-7 md:flex-row">

              {/* Avatar */}
              <div className="relative">

                <div className="h-32 w-32 overflow-hidden rounded-[28px] border-4 border-white/10 bg-white/10 shadow-2xl sm:h-36 sm:w-36">

                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt={user?.displayName || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-500">
                      <FaUser className="text-5xl" />
                    </div>
                  )}

                </div>

                {isEditable && (
                  <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg">
                    <FaCamera className="text-sm" />
                  </div>
                )}

              </div>

              {/* User Info */}
              <div className="text-center md:text-left">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                  Welcome Back
                </p>

                <h2 className="mt-2 font-serif text-3xl font-black italic text-white sm:text-4xl">
                  {user?.displayName || "User"}
                </h2>

                <div className="mt-3 flex flex-col items-center gap-2 text-sm font-medium text-gray-400 sm:flex-row md:items-start">

                  <span className="flex items-center gap-2">
                    <FaEnvelope className="text-red-500" />
                    {user?.email}
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* =========================
              Form
          ========================== */}
          <form
            onSubmit={handleSubmit(handleUpdateProfile)}
            className="p-6 sm:p-9 lg:p-10"
          >

            {/* Form Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                  Personal Information
                </p>

                <h3 className="mt-2 text-2xl font-black text-gray-900">
                  Profile Details
                </h3>

              </div>

              {!isEditable && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="group flex h-11 items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 text-sm font-bold text-white transition-all duration-300 hover:bg-red-600"
                >
                  <FaEdit className="text-xs transition-transform duration-300 group-hover:rotate-12" />
                  Edit Profile
                </button>
              )}

            </div>

            {/* =========================
                Fields
            ========================== */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* Name */}
              <div>

                <label className="mb-2.5 flex items-center gap-2 text-sm font-bold text-gray-700">
                  <FaUser className="text-red-600" />
                  Full Name
                </label>

                <input
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  type="text"
                  placeholder="Enter your name"
                  disabled={!isEditable}
                  className={inputClass}
                />

                {errors.name && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.name.message}
                  </p>
                )}

              </div>

              {/* Email */}
              <div>

                <label className="mb-2.5 flex items-center gap-2 text-sm font-bold text-gray-700">
                  <FaEnvelope className="text-red-600" />
                  Email Address
                </label>

                <input
                  {...register("email")}
                  type="email"
                  disabled
                  readOnly
                  className={inputClass}
                />

                <p className="mt-1.5 text-[11px] font-medium text-gray-400">
                  Email address cannot be changed.
                </p>

              </div>

              {/* Blood Group */}
              <div>

                <label className="mb-2.5 flex items-center gap-2 text-sm font-bold text-gray-700">
                  <FaTint className="text-red-600" />
                  Blood Group
                </label>

                <select
                  {...register("Blood", {
                    required: "Please select your blood group",
                  })}
                  disabled={!isEditable}
                  className={selectClass}
                >

                  <option value="">
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
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.Blood.message}
                  </p>
                )}

              </div>

              {/* Image */}
              <div>

                <label className="mb-2.5 flex items-center gap-2 text-sm font-bold text-gray-700">
                  <FaCamera className="text-red-600" />
                  Profile Photo
                </label>

                <input
                  {...register("image")}
                  type="file"
                  accept="image/*"
                  disabled={!isEditable}
                  className="block h-13 w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-600 file:mr-4 file:h-full file:border-0 file:bg-red-50 file:px-4 file:text-sm file:font-bold file:text-red-600 hover:file:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-1.5 text-[11px] font-medium text-gray-400">
                  Optional. Choose a new photo only if you want to change it.
                </p>

              </div>

              {/* District */}
              <div>

                <label className="mb-2.5 flex items-center gap-2 text-sm font-bold text-gray-700">
                  <FaMapMarkerAlt className="text-red-600" />
                  District
                </label>

                <select
                  {...register("District", {
                    required: "Please select your district",
                  })}
                  disabled={!isEditable || districtsLoading}
                  className={selectClass}
                >

                  <option value="">
                    {districtsLoading
                      ? "Loading Districts..."
                      : "Select District"}
                  </option>

                  {districts.map((district) => (
                    <option
                      key={district.id}
                      value={district.name}
                    >
                      {district.name}
                    </option>
                  ))}

                </select>

                {errors.District && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.District.message}
                  </p>
                )}

              </div>

              {/* Upazila */}
              <div>

                <label className="mb-2.5 flex items-center gap-2 text-sm font-bold text-gray-700">
                  <FaLocationArrow className="text-red-600" />
                  Upazila
                </label>

                <select
                  {...register("Upazila", {
                    required: "Please select your upazila",
                  })}
                  disabled={!isEditable || upazilasLoading}
                  className={selectClass}
                >

                  <option value="">
                    {upazilasLoading
                      ? "Loading Upazilas..."
                      : "Select Upazila"}
                  </option>

                  {upazilas.map((upazila) => (
                    <option
                      key={upazila.id}
                      value={upazila.name}
                    >
                      {upazila.name}
                    </option>
                  ))}

                </select>

                {errors.Upazila && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.Upazila.message}
                  </p>
                )}

              </div>

            </div>

            {/* =========================
                Action Buttons
            ========================== */}
            {isEditable && (
              <div className="mt-9 flex flex-col-reverse gap-3 border-t border-gray-100 pt-7 sm:flex-row sm:justify-end">

                {/* Cancel */}
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaTimes className="text-xs" />
                  Cancel
                </button>

                {/* Save */}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-7 text-sm font-bold text-white shadow-lg shadow-red-100 transition-all duration-300 hover:bg-red-700 hover:shadow-red-200 disabled:cursor-not-allowed disabled:opacity-70"
                >

                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <FaSave className="text-xs" />
                      Save Changes
                    </>
                  )}

                </button>

              </div>
            )}

          </form>

        </div>

        {/* =========================
            Bottom Message
        ========================== */}
        <div className="mx-auto mt-10 max-w-2xl text-center">

          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <FaCheck className="text-sm" />
          </div>

          <p className="mt-4 font-serif text-xl font-black italic text-gray-900">
            Keep your information ready to make a difference.
          </p>

          <p className="mt-2 text-sm font-medium text-gray-400">
            Accurate profile information helps our community connect faster.
          </p>

        </div>

      </div>
    </section>
  );
};

export default Profile;