import { useState } from "react";
import banner from "../../assets/banner.jpg";
import Swal from "sweetalert2";
import axios from "axios";

const Banner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5173.app/donors",
        formData
      );

      Swal.fire({
        icon: "success",
        title: "Thank you for your interest!",
        text: "You have successfully submitted your details to become a donor.",
        confirmButtonText: "Close",
      });
      handleCloseModal();

      setFormData({
        name: "",
        email: "",
        phone: "",
        district: "",
        upazila: "",
        location: "",
        bloodGroup: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again.",
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <div className="relative hero min-h-screen bg-white text-white overflow-hidden flex items-center justify-center px-4 md:px-12">
      <div className="absolute top-10 left-10 w-5 h-5 bg-red-600 rounded-full shadow-lg animate-float"></div>
      <div className="absolute top-20 right-20 w-4 h-4 bg-red-500 rounded-full shadow-md animate-float2"></div>
      <div className="absolute bottom-16 left-1/4 w-6 h-6 bg-red-700 rounded-full shadow-lg animate-float3"></div>

      <div className="hero-content flex flex-col lg:flex-row-reverse gap-10 lg:gap-16">
        <div className="relative">
          <img
            src={banner}
            alt="Blood Donation"
            className="rounded-lg w-full max-w-xs md:max-w-md lg:max-w-lg border-4 border-white transform transition-transform duration-500 hover:scale-105"
          />
        </div>

        <div className="max-w-lg text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-700">
              Donate Blood,
            </span>
            <br />
            <span className="text-red-500">Save Lives</span>
            <span className="absolute -top-2 -left-3 w-2 h-2 bg-red-500 rounded-full animate-bounce"></span>
          </h1>

          <p className="py-6 text-black md:text-lg leading-relaxed opacity-90">
            Your blood donation can make a difference. Join us in our mission to
            save lives and support those in need.
          </p>

          <button
            onClick={handleOpenModal}
            className="relative px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-bold uppercase tracking-wider text-white transition-all duration-300 bg-gradient-to-r from-red-700 to-red-900 rounded-lg shadow-xl hover:shadow-red-500/50 transform hover:scale-105 hover:-translate-y-1"
          >
            <span className="relative z-10">Become a Donor</span>

            <span className="absolute -bottom-2 left-1/2 w-3 h-3 bg-red-600 rounded-full animate-drip"></span>
            <span className="absolute -bottom-4 right-1/3 w-2 h-2 bg-red-500 rounded-full animate-drip2"></span>
            <span className="absolute -bottom-3 left-1/4 w-2 h-2 bg-red-700 rounded-full animate-drip3"></span>

            <span className="absolute top-0 left-0 w-full h-full bg-red-500 opacity-10 rounded-lg blur-lg animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-8 rounded-lg max-w-lg w-full shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-semibold text-center text-red-600 mb-4">
              Become a Donor
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your Name"
                  className="p-3 rounded-lg border-2 text-black border-gray-300 focus:border-red-500"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Your Email"
                  className="p-3 rounded-lg border-2 text-black border-gray-300 focus:border-red-500"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  required
                  name="phone"
                  placeholder="Your Phone Number"
                  className="p-3 rounded-lg border-2 text-black border-gray-300 focus:border-red-500"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  required
                  name="district"
                  placeholder="Your District"
                  className="p-3 rounded-lg border-2 text-black border-gray-300 focus:border-red-500"
                  value={formData.district}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  required
                  name="upazila"
                  placeholder="Your Upazila"
                  className="p-3 rounded-lg border-2 text-black border-gray-300 focus:border-red-500"
                  value={formData.upazila}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  required
                  name="location"
                  placeholder="Your Location"
                  className="p-3 rounded-lg border-2 text-black border-gray-300 focus:border-red-500"
                  value={formData.location}
                  onChange={handleInputChange}
                />

                {/* Blood Group Select Input */}
                <select
                  name="bloodGroup"
                  required
                  className="p-3 rounded-lg border-2 text-black border-gray-300 focus:border-red-500"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                >
                  <option value="">Select Blood Group</option>
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
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r  from-red-700 to-red-900 text-white font-semibold rounded-lg transform hover:scale-105"
                >
                  Submit
                </button>
              </div>
            </form>
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-red-600 font-bold text-xl"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
