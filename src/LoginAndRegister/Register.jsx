import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  FaTint,
  FaMapMarkerAlt,
  FaImage,
  FaHeart,
  FaSearch,
  FaChevronDown,
  FaCheck,
  FaTimes,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { AuthContext } from "../Providers/AuthProvider";
import useAxiosPublic from "../Share/useAxiosPublic";

const imageHostingKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const imageHostingApi = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

const REGISTER_STEPS = [
  {
    id: 1,
    title: "Uploading photo",
    description: "Preparing your profile image...",
  },
  {
    id: 2,
    title: "Creating account",
    description: "Setting up your secure account...",
  },
  {
    id: 3,
    title: "Saving profile",
    description: "Saving your information...",
  },
  {
    id: 4,
    title: "Almost done",
    description: "Finishing your registration...",
  },
];

const Register = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const { createUser, updateUserProfile } = useContext(AuthContext);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");

  const [districtSearch, setDistrictSearch] = useState("");
  const [upazilaSearch, setUpazilaSearch] = useState("");

  const [districtOpen, setDistrictOpen] = useState(false);
  const [upazilaOpen, setUpazilaOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerStep, setRegisterStep] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const districtRef = useRef(null);
  const upazilaRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const password = watch("password");

  /* ---------------------------------
Load districts
---------------------------------- */

  const {
    data: districts = [],
    isLoading: districtsLoading,
    isError: districtsError,
  } = useQuery({
    queryKey: ["districts"],
    queryFn: async () => {
      const response = await fetch("/districts.json");

      if (!response.ok) {
        throw new Error("Failed to load districts.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid district data.");
      }

      return data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  /* ---------------------------------
Load upazilas
---------------------------------- */

  const {
    data: upazilas = [],
    isLoading: upazilasLoading,
    isError: upazilasError,
  } = useQuery({
    queryKey: ["upazilas"],
    queryFn: async () => {
      const response = await fetch("/upazilas.json");

      if (!response.ok) {
        throw new Error("Failed to load upazilas.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid upazila data.");
      }

      return data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  /* ---------------------------------
Close dropdown on outside click
---------------------------------- */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (districtRef.current && !districtRef.current.contains(event.target)) {
        setDistrictOpen(false);
      }

      if (upazilaRef.current && !upazilaRef.current.contains(event.target)) {
        setUpazilaOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /* ---------------------------------
Find selected district
---------------------------------- */

  const selectedDistrictObject = useMemo(() => {
    return districts.find(
      (district) =>
        String(district.name || "").toLowerCase() ===
        String(selectedDistrict || "").toLowerCase(),
    );
  }, [districts, selectedDistrict]);

  const selectedDistrictId =
    selectedDistrictObject?.id ??
    selectedDistrictObject?._id ??
    selectedDistrictObject?.district_id;

  /* ---------------------------------
Filter districts
---------------------------------- */

  const filteredDistricts = useMemo(() => {
    const search = districtSearch.trim().toLowerCase();

    if (!search) {
      return districts;
    }

    return districts.filter((district) =>
      String(district.name || "")
        .toLowerCase()
        .includes(search),
    );
  }, [districts, districtSearch]);

  /* ---------------------------------
Filter upazilas
---------------------------------- */

  const filteredUpazilas = useMemo(() => {
    if (!selectedDistrict) {
      return [];
    }

    const search = upazilaSearch.trim().toLowerCase();

    return upazilas.filter((upazila) => {
      const upazilaName = String(
        upazila.name || upazila.upazila_name || upazila.upazilaName || "",
      ).toLowerCase();

      const upazilaDistrictId =
        upazila.district_id ?? upazila.districtId ?? upazila.districtID;

      const upazilaDistrictName = String(
        upazila.district || upazila.district_name || upazila.districtName || "",
      ).toLowerCase();

      const matchesDistrict =
        selectedDistrictId !== undefined && selectedDistrictId !== null
          ? String(upazilaDistrictId) === String(selectedDistrictId)
          : upazilaDistrictName === String(selectedDistrict).toLowerCase();

      const matchesSearch = !search || upazilaName.includes(search);

      return matchesDistrict && matchesSearch;
    });
  }, [upazilas, selectedDistrict, selectedDistrictId, upazilaSearch]);

  /* ---------------------------------
District selection
---------------------------------- */

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district.name);
    setSelectedUpazila("");

    setDistrictSearch("");
    setUpazilaSearch("");

    setDistrictOpen(false);
    setUpazilaOpen(false);

    setValue("District", district.name, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("Upazila", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  /* ---------------------------------
Upazila selection
---------------------------------- */

  const handleUpazilaSelect = (upazila) => {
    const upazilaName =
      upazila.name || upazila.upazila_name || upazila.upazilaName || "";

    setSelectedUpazila(upazilaName);
    setUpazilaSearch("");

    setUpazilaOpen(false);

    setValue("Upazila", upazilaName, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  /* ---------------------------------
Compress image before upload
---------------------------------- */

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);

      image.onload = () => {
        URL.revokeObjectURL(objectUrl);

        const maxWidth = 1200;
        const maxHeight = 1200;

        let width = image.width;
        let height = image.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);

          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Image processing failed."));
          return;
        }

        context.drawImage(image, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Image compression failed."));
              return;
            }

            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, "") + ".jpg",
              {
                type: "image/jpeg",
                lastModified: Date.now(),
              },
            );

            resolve(compressedFile);
          },
          "image/jpeg",
          0.82,
        );
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Unable to process selected image."));
      };

      image.src = objectUrl;
    });
  };

  /* ---------------------------------
Registration submit
---------------------------------- */

  const onSubmit = async (data) => {
    if (isSubmitting) {
      return;
    }

    if (!selectedDistrict) {
      await Swal.fire({
        icon: "warning",
        title: "District Required",
        text: "Please select your district.",
        confirmButtonColor: "#991b1b",
      });

      return;
    }

    if (!selectedUpazila) {
      await Swal.fire({
        icon: "warning",
        title: "Upazila Required",
        text: "Please select your upazila.",
        confirmButtonColor: "#991b1b",
      });

      return;
    }

    if (!data.image?.[0]) {
      await Swal.fire({
        icon: "warning",
        title: "Profile Image Required",
        text: "Please select a profile image.",
        confirmButtonColor: "#991b1b",
      });

      return;
    }

    const imageFile = data.image[0];

    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedImageTypes.includes(imageFile.type)) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid Image",
        text: "Please select a JPG, JPEG, PNG or WEBP image.",
        confirmButtonColor: "#991b1b",
      });

      return;
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      await Swal.fire({
        icon: "warning",
        title: "Image Too Large",
        text: "Please select an image smaller than 5 MB.",
        confirmButtonColor: "#991b1b",
      });

      return;
    }

    if (!imageHostingKey) {
      await Swal.fire({
        icon: "error",
        title: "Configuration Error",
        text: "Image hosting configuration is missing.",
        confirmButtonColor: "#991b1b",
      });

      return;
    }

    try {
      setIsSubmitting(true);
      setRegisterStep(1);

      /* -------------------------------
     Step 1: Upload photo
  -------------------------------- */

      const compressedImage = await compressImage(imageFile);

      const imageFormData = new FormData();
      imageFormData.append("image", compressedImage);

      const imageResponse = await axios.post(imageHostingApi, imageFormData, {
        timeout: 30000,
      });

      if (!imageResponse.data?.success || !imageResponse.data?.data?.url) {
        throw new Error("Profile image upload failed.");
      }

      const imageUrl = imageResponse.data.data.url;

      /* -------------------------------
     Step 2: Create Firebase account
  -------------------------------- */

      setRegisterStep(2);

      const email = data.email.trim().toLowerCase();
      const name = data.name.trim();

      const userCredential = await createUser(email, data.password);

      if (!userCredential?.user) {
        throw new Error("Unable to create user account.");
      }

      /* -------------------------------
     Step 3: Update Firebase profile
  -------------------------------- */

      await updateUserProfile(name, imageUrl);

      setRegisterStep(3);

      /* -------------------------------
     Save MongoDB profile
  -------------------------------- */

      const userInfo = {
        name,
        email,
        photoURL: imageUrl,
        bloodGroup: data.Blood,
        district: selectedDistrict,
        upazila: selectedUpazila,
        status: "Active",
        role: "Donor",
      };

      const userResponse = await axiosPublic.post("/users", userInfo);

      if (!userResponse.data?.insertedId) {
        throw new Error(
          "Account created, but user information could not be saved.",
        );
      }

      /* -------------------------------
     Step 4: Almost done
  -------------------------------- */

      setRegisterStep(4);

      await new Promise((resolve) => setTimeout(resolve, 700));

      /* -------------------------------
     Reset
  -------------------------------- */

      reset();

      setSelectedDistrict("");
      setSelectedUpazila("");

      setDistrictSearch("");
      setUpazilaSearch("");

      setDistrictOpen(false);
      setUpazilaOpen(false);

      setValue("District", "");
      setValue("Upazila", "");

      setRegisterStep(0);

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Registration Successful",
        text: "Welcome to Blood Donation!",
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
      });

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error("Registration Error:", error);

      setRegisterStep(0);

      let errorMessage = "Something went wrong. Please try again.";

      if (error?.code === "auth/email-already-in-use") {
        errorMessage = "An account already exists with this email address.";
      } else if (error?.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error?.code === "auth/weak-password") {
        errorMessage =
          "Password is too weak. Please use at least 8 characters.";
      } else if (error?.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error?.code === "auth/operation-not-allowed") {
        errorMessage = "Email/password registration is currently disabled.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      await Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
        confirmButtonColor: "#991b1b",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLocationLoading = districtsLoading || upazilasLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-100 flex items-center justify-center px-4 py-8">
      {" "}
      <div className="w-full max-w-6xl">
        {" "}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {" "}
          <div className="grid lg:grid-cols-2">
            {/* =========================
LEFT SIDE
========================== */}

            <div className="hidden lg:flex relative bg-gradient-to-br from-red-800 via-red-700 to-red-950 items-center justify-center p-12 overflow-hidden">
              <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white/10" />
              <div className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-white/10" />
              <div className="absolute top-1/3 -right-16 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute bottom-1/4 -left-10 w-32 h-32 rounded-full bg-white/5" />

              <div className="relative z-10 text-center text-white">
                <Link to="/" className="inline-block mb-8">
                  <img
                    src="https://i.ibb.co.com/2Yc4sXv/register-here-en-no-sign-260nw-160430507-webp-260-280-01-14-2025-04-01-PM-removebg-preview.png"
                    alt="Blood Donation Registration"
                    className="w-64 h-64 object-contain mx-auto brightness-0 invert"
                  />
                </Link>

                <h1 className="text-4xl font-extrabold leading-tight">
                  Join Our Community
                </h1>

                <p className="mt-4 text-red-100 text-sm leading-7 max-w-sm mx-auto">
                  Create your account and become part of a community that helps
                  connect blood donors with people in need.
                </p>

                <div className="grid grid-cols-3 gap-3 mt-8 max-w-md mx-auto">
                  <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm p-4">
                    <FaTint className="mx-auto text-xl mb-2" />
                    <p className="text-xs font-semibold">Donate</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm p-4">
                    <FaUser className="mx-auto text-xl mb-2" />
                    <p className="text-xs font-semibold">Connect</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm p-4">
                    <FaHeart className="mx-auto text-xl mb-2" />
                    <p className="text-xs font-semibold">Save Lives</p>
                  </div>
                </div>
              </div>
            </div>

            {/* =========================
            RIGHT SIDE
        ========================== */}

            <div className="p-5 sm:p-8 lg:p-10">
              {/* Mobile Logo */}

              <div className="lg:hidden text-center mb-6">
                <Link to="/">
                  <img
                    src="https://i.ibb.co.com/2Yc4sXv/register-here-en-no-sign-260nw-160430507-webp-260-280-01-14-2025-04-01-PM-removebg-preview.png"
                    alt="Blood Donation"
                    className="w-36 sm:w-44 h-auto mx-auto object-contain"
                  />
                </Link>
              </div>

              {/* Heading */}

              <div className="mb-7">
                <p className="text-red-700 font-semibold text-sm mb-2">
                  Get started
                </p>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  Create your account
                </h2>

                <p className="text-gray-500 mt-3 text-sm leading-6">
                  Fill in your information to join our blood donation community.
                </p>
              </div>

              {/* =========================
              FORM
          ========================== */}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name + Email */}

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Name */}

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Full Name
                    </label>

                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

                      <input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        autoComplete="name"
                        disabled={isSubmitting}
                        {...register("name", {
                          required: "Name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters",
                          },
                          validate: (value) =>
                            value.trim().length >= 2 ||
                            "Name must be at least 2 characters",
                        })}
                        className={`w-full h-12 pl-11 pr-4 rounded-xl border ${
                          errors.name
                            ? "border-red-500 ring-4 ring-red-50"
                            : "border-gray-200"
                        } bg-gray-50 text-gray-900 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-100 placeholder:text-gray-400 disabled:opacity-60`}
                      />
                    </div>

                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1.5">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        disabled={isSubmitting}
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Please enter a valid email address",
                          },
                        })}
                        className={`w-full h-12 pl-11 pr-4 rounded-xl border ${
                          errors.email
                            ? "border-red-500 ring-4 ring-red-50"
                            : "border-gray-200"
                        } bg-gray-50 text-gray-900 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-100 placeholder:text-gray-400 disabled:opacity-60`}
                      />
                    </div>

                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1.5">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Image + Blood */}

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Image */}

                  <div>
                    <label
                      htmlFor="image"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Profile Image
                    </label>

                    <div className="relative">
                      <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm z-10" />

                      <input
                        id="image"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        disabled={isSubmitting}
                        {...register("image", {
                          required: "Profile image is required",
                        })}
                        className={`w-full h-12 pl-11 pr-2 py-2 rounded-xl border ${
                          errors.image
                            ? "border-red-500 ring-4 ring-red-50"
                            : "border-gray-200"
                        } bg-gray-50 text-gray-600 text-xs outline-none transition-all file:mr-2 file:border-0 file:rounded-lg file:bg-red-50 file:text-red-700 file:px-2 file:py-1.5 file:text-xs file:font-semibold disabled:opacity-60`}
                      />
                    </div>

                    {errors.image ? (
                      <p className="text-red-500 text-xs mt-1.5">
                        {errors.image.message}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-[11px] mt-1.5">
                        JPG, PNG or WEBP • Max 5 MB
                      </p>
                    )}
                  </div>

                  {/* Blood */}

                  <div>
                    <label
                      htmlFor="Blood"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Blood Group
                    </label>

                    <div className="relative">
                      <FaTint className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 text-sm z-10" />

                      <select
                        id="Blood"
                        defaultValue=""
                        disabled={isSubmitting}
                        {...register("Blood", {
                          required: "Blood group is required",
                        })}
                        className={`w-full h-12 pl-11 pr-4 rounded-xl border ${
                          errors.Blood
                            ? "border-red-500 ring-4 ring-red-50"
                            : "border-gray-200"
                        } bg-gray-50 text-gray-700 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-100 disabled:opacity-60`}
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

                    {errors.Blood && (
                      <p className="text-red-500 text-xs mt-1.5">
                        {errors.Blood.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* =========================
                DISTRICT + UPAZILA
            ========================== */}

                <div className="grid md:grid-cols-2 gap-5">
                  {/* District */}

                  <div ref={districtRef}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      District
                    </label>

                    <div className="relative">
                      <div
                        onClick={() => {
                          if (
                            !districtsLoading &&
                            !districtsError &&
                            !isSubmitting
                          ) {
                            setDistrictOpen((previous) => !previous);

                            setUpazilaOpen(false);
                          }
                        }}
                        className={`min-h-12 w-full rounded-xl border ${
                          errors.District
                            ? "border-red-500 ring-4 ring-red-50"
                            : districtOpen
                              ? "border-red-600 ring-4 ring-red-100"
                              : "border-gray-200"
                        } bg-gray-50 hover:bg-white transition-all duration-200 cursor-pointer`}
                      >
                        <div className="flex items-center min-h-12 px-4">
                          <FaMapMarkerAlt className="text-red-500 text-sm mr-3 shrink-0" />

                          <div className="flex-1 min-w-0">
                            {selectedDistrict ? (
                              <span className="text-sm text-gray-800 font-medium truncate block">
                                {selectedDistrict}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">
                                Select District
                              </span>
                            )}
                          </div>

                          <FaChevronDown
                            className={`text-xs text-gray-400 transition-transform duration-200 ${
                              districtOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>

                      {districtOpen && (
                        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.15s_ease-out]">
                          <div className="p-3 border-b border-gray-100 bg-white">
                            <div className="relative">
                              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

                              <input
                                autoFocus
                                type="text"
                                value={districtSearch}
                                onChange={(event) =>
                                  setDistrictSearch(event.target.value)
                                }
                                onClick={(event) => event.stopPropagation()}
                                placeholder="Search district..."
                                className="w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-50 transition-all"
                              />
                            </div>

                            <div className="flex items-center justify-between mt-2 px-1">
                              <span className="text-[11px] text-gray-400">
                                {filteredDistricts.length} districts found
                              </span>

                              {districtSearch && (
                                <button
                                  type="button"
                                  onClick={() => setDistrictSearch("")}
                                  className="text-gray-400 hover:text-red-600 text-xs"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="max-h-60 overflow-y-auto p-2">
                            {districtsLoading ? (
                              <div className="py-8 text-center">
                                <span className="loading loading-spinner loading-sm text-red-700" />
                                <p className="text-xs text-gray-400 mt-2">
                                  Loading districts...
                                </p>
                              </div>
                            ) : districtsError ? (
                              <div className="py-8 text-center px-4">
                                <FaTimes className="mx-auto text-red-500 mb-2" />
                                <p className="text-sm font-semibold text-gray-600">
                                  Failed to load districts
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Please refresh the page and try again.
                                </p>
                              </div>
                            ) : filteredDistricts.length === 0 ? (
                              <div className="py-8 text-center px-4">
                                <FaSearch className="mx-auto text-gray-300 text-lg mb-2" />
                                <p className="text-sm font-semibold text-gray-600">
                                  No district found
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Try a different search.
                                </p>
                              </div>
                            ) : (
                              filteredDistricts.map((district) => {
                                const isSelected =
                                  String(selectedDistrict).toLowerCase() ===
                                  String(district.name).toLowerCase();

                                return (
                                  <button
                                    key={
                                      district.id ??
                                      district._id ??
                                      district.name
                                    }
                                    type="button"
                                    onClick={() =>
                                      handleDistrictSelect(district)
                                    }
                                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150 ${
                                      isSelected
                                        ? "bg-red-50 text-red-700"
                                        : "hover:bg-gray-50 text-gray-700"
                                    }`}
                                  >
                                    <span
                                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                        isSelected
                                          ? "bg-red-100 text-red-600"
                                          : "bg-gray-100 text-gray-400"
                                      }`}
                                    >
                                      <FaMapMarkerAlt className="text-xs" />
                                    </span>

                                    <span className="flex-1 text-sm font-medium">
                                      {district.name}
                                    </span>

                                    {isSelected && (
                                      <FaCheck className="text-red-600 text-xs" />
                                    )}
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {errors.District && (
                      <p className="text-red-500 text-xs mt-1.5">
                        {errors.District.message}
                      </p>
                    )}

                    <input
                      type="hidden"
                      {...register("District", {
                        required: "District is required",
                      })}
                    />
                  </div>

                  {/* Upazila */}

                  <div ref={upazilaRef}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upazila
                    </label>

                    <div className="relative">
                      <div
                        onClick={() => {
                          if (
                            selectedDistrict &&
                            !upazilasLoading &&
                            !upazilasError &&
                            !isSubmitting
                          ) {
                            setUpazilaOpen((previous) => !previous);

                            setDistrictOpen(false);
                          }
                        }}
                        className={`min-h-12 w-full rounded-xl border ${
                          errors.Upazila
                            ? "border-red-500 ring-4 ring-red-50"
                            : upazilaOpen
                              ? "border-red-600 ring-4 ring-red-100"
                              : "border-gray-200"
                        } ${
                          !selectedDistrict
                            ? "bg-gray-100 cursor-not-allowed"
                            : "bg-gray-50 hover:bg-white cursor-pointer"
                        } transition-all duration-200`}
                      >
                        <div className="flex items-center min-h-12 px-4">
                          <FaMapMarkerAlt
                            className={`text-sm mr-3 shrink-0 ${
                              selectedDistrict
                                ? "text-red-500"
                                : "text-gray-300"
                            }`}
                          />

                          <div className="flex-1 min-w-0">
                            {selectedUpazila ? (
                              <span className="text-sm text-gray-800 font-medium truncate block">
                                {selectedUpazila}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">
                                {selectedDistrict
                                  ? "Select Upazila"
                                  : "Select district first"}
                              </span>
                            )}
                          </div>

                          <FaChevronDown
                            className={`text-xs text-gray-400 transition-transform duration-200 ${
                              upazilaOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>

                      {upazilaOpen && selectedDistrict && (
                        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden">
                          <div className="p-3 border-b border-gray-100 bg-white">
                            <div className="relative">
                              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

                              <input
                                autoFocus
                                type="text"
                                value={upazilaSearch}
                                onChange={(event) =>
                                  setUpazilaSearch(event.target.value)
                                }
                                onClick={(event) => event.stopPropagation()}
                                placeholder="Search upazila..."
                                className="w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-50 transition-all"
                              />
                            </div>

                            <div className="flex items-center justify-between mt-2 px-1">
                              <span className="text-[11px] text-gray-400">
                                {filteredUpazilas.length} upazilas found
                              </span>

                              {upazilaSearch && (
                                <button
                                  type="button"
                                  onClick={() => setUpazilaSearch("")}
                                  className="text-gray-400 hover:text-red-600 text-xs"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="max-h-60 overflow-y-auto p-2">
                            {upazilasLoading ? (
                              <div className="py-8 text-center">
                                <span className="loading loading-spinner loading-sm text-red-700" />
                                <p className="text-xs text-gray-400 mt-2">
                                  Loading upazilas...
                                </p>
                              </div>
                            ) : upazilasError ? (
                              <div className="py-8 text-center px-4">
                                <FaTimes className="mx-auto text-red-500 mb-2" />
                                <p className="text-sm font-semibold text-gray-600">
                                  Failed to load upazilas
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Please refresh the page and try again.
                                </p>
                              </div>
                            ) : filteredUpazilas.length === 0 ? (
                              <div className="py-8 text-center px-4">
                                <FaSearch className="mx-auto text-gray-300 text-lg mb-2" />
                                <p className="text-sm font-semibold text-gray-600">
                                  No upazila found
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Try a different search.
                                </p>
                              </div>
                            ) : (
                              filteredUpazilas.map((upazila) => {
                                const upazilaName =
                                  upazila.name ||
                                  upazila.upazila_name ||
                                  upazila.upazilaName ||
                                  "";

                                const isSelected =
                                  String(selectedUpazila).toLowerCase() ===
                                  String(upazilaName).toLowerCase();

                                return (
                                  <button
                                    key={
                                      upazila.id ?? upazila._id ?? upazilaName
                                    }
                                    type="button"
                                    onClick={() => handleUpazilaSelect(upazila)}
                                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150 ${
                                      isSelected
                                        ? "bg-red-50 text-red-700"
                                        : "hover:bg-gray-50 text-gray-700"
                                    }`}
                                  >
                                    <span
                                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                        isSelected
                                          ? "bg-red-100 text-red-600"
                                          : "bg-gray-100 text-gray-400"
                                      }`}
                                    >
                                      <FaMapMarkerAlt className="text-xs" />
                                    </span>

                                    <span className="flex-1 text-sm font-medium">
                                      {upazilaName}
                                    </span>

                                    {isSelected && (
                                      <FaCheck className="text-red-600 text-xs" />
                                    )}
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {errors.Upazila && (
                      <p className="text-red-500 text-xs mt-1.5">
                        {errors.Upazila.message}
                      </p>
                    )}

                    <input
                      type="hidden"
                      {...register("Upazila", {
                        required: "Upazila is required",
                      })}
                    />
                  </div>
                </div>

                {/* Password */}

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Password */}

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        disabled={isSubmitting}
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                        })}
                        className={`w-full h-12 pl-11 pr-11 rounded-xl border ${
                          errors.password
                            ? "border-red-500 ring-4 ring-red-50"
                            : "border-gray-200"
                        } bg-gray-50 text-gray-900 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-100 placeholder:text-gray-400 disabled:opacity-60`}
                      />

                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setShowPassword((previous) => !previous)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-700 transition-colors disabled:opacity-50"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    {errors.password ? (
                      <p className="text-red-500 text-xs mt-1.5">
                        {errors.password.message}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-[11px] mt-1.5">
                        Minimum 8 characters
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Confirm Password
                    </label>

                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        disabled={isSubmitting}
                        {...register("confirmPassword", {
                          required: "Confirm password is required",
                          validate: (value) =>
                            value === password || "Passwords do not match",
                        })}
                        className={`w-full h-12 pl-11 pr-11 rounded-xl border ${
                          errors.confirmPassword
                            ? "border-red-500 ring-4 ring-red-50"
                            : "border-gray-200"
                        } bg-gray-50 text-gray-900 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-100 placeholder:text-gray-400 disabled:opacity-60`}
                      />

                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() =>
                          setShowConfirmPassword((previous) => !previous)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-700 transition-colors disabled:opacity-50"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1.5">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* =========================
                REGISTRATION PROGRESS
            ========================== */}

                {isSubmitting && (
                  <div className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50/80 to-white px-4 sm:px-6 py-5">
                    <div className="flex flex-col items-center text-center">
                      {/* Animated Heart */}

                      <div className="relative w-12 h-12 flex items-center justify-center mb-2">
                        <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-30" />

                        <div className="relative w-11 h-11 rounded-full bg-red-100 flex items-center justify-center">
                          <FaHeart className="text-red-700 text-lg animate-pulse" />
                        </div>
                      </div>

                      {/* Current title */}

                      <h3 className="text-sm sm:text-base font-bold text-gray-800">
                        {REGISTER_STEPS[Math.max(registerStep - 1, 0)]?.title ||
                          "Creating your account"}
                      </h3>

                      <p className="text-[11px] sm:text-xs text-gray-400 mt-1">
                        {REGISTER_STEPS[Math.max(registerStep - 1, 0)]
                          ?.description || "Setting things up for you..."}
                      </p>

                      {/* Progress line */}

                      <div className="w-full max-w-md mt-5">
                        <div className="flex items-center">
                          {[1, 2, 3, 4].map((step, index) => {
                            const completed = registerStep > step;

                            const active = registerStep === step;

                            return (
                              <div
                                key={step}
                                className="flex items-center flex-1 last:flex-none"
                              >
                                <div
                                  className={`relative w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all duration-500 ${
                                    completed
                                      ? "bg-red-700 text-white"
                                      : active
                                        ? "bg-red-100 text-red-700 ring-4 ring-red-100"
                                        : "bg-gray-100 text-gray-400"
                                  }`}
                                >
                                  {completed ? (
                                    <FaCheck className="text-[10px]" />
                                  ) : active ? (
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-700 animate-pulse" />
                                  ) : (
                                    step
                                  )}
                                </div>

                                {index < 3 && (
                                  <div className="flex-1 h-1 mx-2 rounded-full bg-gray-100 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full bg-red-700 transition-all duration-700 ${
                                        registerStep > step ? "w-full" : "w-0"
                                      }`}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex justify-between mt-2 text-[9px] text-gray-400 font-medium px-0.5">
                          <span>Photo</span>
                          <span>Account</span>
                          <span>Profile</span>
                          <span>Done</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Info */}

                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                  <p className="text-xs text-gray-600 leading-5">
                    By creating an account, you agree to provide accurate
                    information so donors and recipients can connect safely.
                  </p>
                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    isLocationLoading ||
                    districtsError ||
                    upazilasError
                  }
                  className="w-full h-13 rounded-xl bg-red-800 hover:bg-red-900 active:scale-[0.98] text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-red-100 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaCloudUploadAlt className="text-sm animate-pulse" />
                      Please wait...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Login */}

                <p className="text-center text-sm text-gray-500 pt-1">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-red-700 hover:text-red-900 transition-colors"
                  >
                    Login now
                  </Link>
                </p>

                {/* Home */}

                <div className="text-center">
                  <Link
                    to="/"
                    className="text-xs font-medium text-gray-400 hover:text-red-700 transition-colors"
                  >
                    ← Back to Home
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-5">
          Together, we can help save lives.
        </p>
      </div>
    </div>
  );
};

export default Register;
