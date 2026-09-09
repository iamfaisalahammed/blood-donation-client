import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { FaHeart, FaXmark } from "react-icons/fa6";
import banner from "../../assets/banner.jpg";

const Banner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    district: "",
    upazila: "",
    location: "",
    bloodGroup: "",
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      district: "",
      upazila: "",
      location: "",
      bloodGroup: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:5000/donors", formData);

      handleCloseModal();
      resetForm();

      await Swal.fire({
        icon: "success",
        title: "Thank You!",
        text: "Your donor information has been submitted successfully.",
        confirmButtonText: "Done",
        confirmButtonColor: "#dc2626",
        background: "#ffffff",
        color: "#111827",
      });
    } catch (error) {
      console.error("Donor submission error:", error);

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#dc2626",
        background: "#ffffff",
        color: "#111827",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-white px-5 py-16 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {/* Very subtle background decoration */}
        <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-red-50/70 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-red-50/60 blur-3xl" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-160px)] max-w-7xl items-center">
          <div className="grid w-full items-center gap-14 lg:grid-cols-2 lg:gap-20">
            {/* ================= LEFT ================= */}
            <div className="order-2 lg:order-1">
              {/* Small Label */}
              <div className="mb-7">
                <span className="border-l-[3px] border-red-600 pl-3 text-xs font-bold uppercase tracking-[0.22em] text-red-600">
                  Blood Donation Campaign
                </span>
              </div>

              {/* Heading */}
              <h1 className="max-w-2xl text-center text-5xl font-black leading-[1.05] tracking-tight text-gray-950 sm:text-6xl md:text-7xl lg:text-left lg:text-[64px] xl:text-[76px]">
                <span className="block font-serif italic">
                  Donate Blood,
                </span>

                <span className="mt-2 block font-serif italic text-red-600">
                  Save Lives.
                </span>
              </h1>

              {/* Underline */}
              <div className="mx-auto mt-5 h-[3px] w-16 rounded-full bg-red-600 lg:mx-0" />

              {/* Description */}
              <p className="mx-auto mt-7 max-w-xl text-center text-base font-medium leading-8 text-gray-600 sm:text-lg lg:mx-0 lg:text-left">
                A small act of kindness can give someone another chance at
                life. Become a donor and help build a stronger, healthier
                community.
              </p>

              {/* CTA */}
              <div className="mt-9 flex justify-center lg:justify-start">
                <button
                  onClick={handleOpenModal}
                  className="group flex items-center gap-3 rounded-xl bg-red-600 px-7 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-red-100 transition-all duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-xl hover:shadow-red-200"
                >
                  <FaHeart className="text-sm transition-transform duration-300 group-hover:scale-110" />

                  <span>Become a Donor</span>
                </button>
              </div>

              {/* Simple Bottom Text */}
              <div className="mt-8 flex justify-center lg:justify-start">
                <p className="text-sm font-medium text-gray-400">
                  Your donation can make a lasting difference.
                </p>
              </div>
            </div>

            {/* ================= RIGHT IMAGE ================= */}
            <div className="order-1 flex justify-center lg:order-2">
              <div className="relative w-full max-w-[520px]">
                {/* Thin decorative frame */}
                <div className="absolute -inset-3 rounded-[32px] border border-red-100" />

                {/* Image Card */}
                <div className="relative rounded-[28px] border border-gray-100 bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.09)]">
                  <div className="overflow-hidden rounded-[22px]">
                    <img
                      src={banner}
                      alt="Blood Donation"
                      className="h-[360px] w-full object-cover transition-transform duration-700 hover:scale-[1.03] sm:h-[440px] md:h-[500px]"
                    />
                  </div>
                </div>

                {/* Minimal bottom information */}
                <div className="absolute -bottom-5 left-1/2 w-[85%] -translate-x-1/2 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-lg">
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-red-600" />

                    <p className="text-center text-sm font-semibold text-gray-700">
                      One donation can help save lives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className="relative max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl sm:p-7 md:p-9"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
              aria-label="Close"
            >
              <FaXmark />
            </button>

            {/* Modal Header */}
            <div className="mb-7 pr-12">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-red-600">
                Join Our Community
              </p>

              <h2 className="font-serif text-3xl font-black italic text-gray-950 md:text-4xl">
                Become a Donor
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-gray-500">
                Please provide your information to register as a blood donor.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium text-black outline-none transition-all placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium text-black outline-none transition-all placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    required
                    placeholder="01XXXXXXXXX"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium text-black outline-none transition-all placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>

                {/* Blood Group */}
                <div>
                  <label
                    htmlFor="bloodGroup"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Blood Group
                  </label>

                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    required
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium text-black outline-none transition-all focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                {/* District */}
                <div>
                  <label
                    htmlFor="district"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    District
                  </label>

                  <input
                    id="district"
                    type="text"
                    name="district"
                    required
                    placeholder="Your district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium text-black outline-none transition-all placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>

                {/* Upazila */}
                <div>
                  <label
                    htmlFor="upazila"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Upazila
                  </label>

                  <input
                    id="upazila"
                    type="text"
                    name="upazila"
                    required
                    placeholder="Your upazila"
                    value={formData.upazila}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium text-black outline-none transition-all placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Full Location
                  </label>

                  <input
                    id="location"
                    type="text"
                    name="location"
                    required
                    placeholder="Village, area or detailed location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium text-black outline-none transition-all placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-xl border border-gray-200 px-6 py-3.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-red-100 transition-all duration-300 hover:bg-red-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaHeart />
                      Submit Registration
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Banner;