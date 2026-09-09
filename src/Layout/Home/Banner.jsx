import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaHeart, FaXmark } from "react-icons/fa6";
import { FaChevronDown, FaCheck, FaSearch } from "react-icons/fa";
import banner from "../../assets/banner.jpg";

const Banner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");

  const [districtSearch, setDistrictSearch] = useState("");
  const [upazilaSearch, setUpazilaSearch] = useState("");

  const [districtOpen, setDistrictOpen] = useState(false);
  const [upazilaOpen, setUpazilaOpen] = useState(false);

  const districtRef = useRef(null);
  const upazilaRef = useRef(null);

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

    setDistrictOpen(false);
    setUpazilaOpen(false);
  };

  useEffect(() => {
    const loadLocationData = async () => {
      try {
        const [districtRes, upazilaRes] = await Promise.all([
          fetch("/districts.json"),
          fetch("/upazilas.json"),
        ]);

        const districtData = await districtRes.json();
        const upazilaData = await upazilaRes.json();

        setDistricts(districtData);
        setUpazilas(upazilaData);
      } catch (error) {
        console.error("Location data loading error:", error);
      }
    };

    loadLocationData();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        districtRef.current &&
        !districtRef.current.contains(event.target)
      ) {
        setDistrictOpen(false);
      }

      if (
        upazilaRef.current &&
        !upazilaRef.current.contains(event.target)
      ) {
        setUpazilaOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const selectedDistrictObject = useMemo(() => {
    return districts.find(
      (district) =>
        district.name?.toLowerCase() === selectedDistrict?.toLowerCase(),
    );
  }, [districts, selectedDistrict]);

  const selectedDistrictId =
    selectedDistrictObject?.id ??
    selectedDistrictObject?._id ??
    selectedDistrictObject?.district_id;

  const filteredDistricts = useMemo(() => {
    const search = districtSearch.toLowerCase().trim();

    if (!search) return districts;

    return districts.filter((district) =>
      district.name?.toLowerCase().includes(search),
    );
  }, [districts, districtSearch]);

  const filteredUpazilas = useMemo(() => {
    if (!selectedDistrict) return [];

    const search = upazilaSearch.toLowerCase().trim();

    return upazilas.filter((upazila) => {
      const districtId =
        upazila.district_id ??
        upazila.districtId ??
        upazila.districtID;

      const matchesDistrict =
        String(districtId) === String(selectedDistrictId);

      const matchesSearch =
        !search ||
        upazila.name?.toLowerCase().includes(search);

      return matchesDistrict && matchesSearch;
    });
  }, [
    upazilas,
    selectedDistrict,
    selectedDistrictId,
    upazilaSearch,
  ]);

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district.name);
    setSelectedUpazila("");

    setDistrictSearch("");
    setUpazilaSearch("");

    setDistrictOpen(false);
    setUpazilaOpen(false);

    setFormData((prev) => ({
      ...prev,
      district: district.name,
      upazila: "",
    }));
  };

  const handleUpazilaSelect = (upazila) => {
    setSelectedUpazila(upazila.name);

    setUpazilaSearch("");
    setUpazilaOpen(false);

    setFormData((prev) => ({
      ...prev,
      upazila: upazila.name,
    }));
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

    setSelectedDistrict("");
    setSelectedUpazila("");

    setDistrictSearch("");
    setUpazilaSearch("");

    setDistrictOpen(false);
    setUpazilaOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.district) {
      Swal.fire({
        icon: "warning",
        title: "District Required",
        text: "Please select your district.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    if (!formData.upazila) {
      Swal.fire({
        icon: "warning",
        title: "Upazila Required",
        text: "Please select your upazila.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

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
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-white px-5 py-16 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-red-50/70 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-red-50/60 blur-3xl" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-160px)] max-w-7xl items-center">
          <div className="grid w-full items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="order-2 lg:order-1">
              <div className="mb-7">
                <span className="border-l-[3px] border-red-600 pl-3 text-xs font-bold uppercase tracking-[0.22em] text-red-600">
                  Blood Donation Campaign
                </span>
              </div>

              <h1 className="max-w-2xl text-center text-5xl font-black leading-[1.05] tracking-tight text-gray-950 sm:text-6xl md:text-7xl lg:text-left lg:text-[64px] xl:text-[76px]">
                <span className="block font-serif italic">
                  Donate Blood,
                </span>

                <span className="mt-2 block font-serif italic text-red-600">
                  Save Lives.
                </span>
              </h1>

              <div className="mx-auto mt-5 h-[3px] w-16 rounded-full bg-red-600 lg:mx-0" />

              <p className="mx-auto mt-7 max-w-xl text-center text-base font-medium leading-8 text-gray-600 sm:text-lg lg:mx-0 lg:text-left">
                A small act of kindness can give someone another chance at
                life. Become a donor and help build a stronger, healthier
                community.
              </p>

              <div className="mt-9 flex justify-center lg:justify-start">
                <button
                  onClick={handleOpenModal}
                  className="group flex items-center gap-3 rounded-xl bg-red-600 px-7 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-red-100 transition-all duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-xl hover:shadow-red-200"
                >
                  <FaHeart className="text-sm transition-transform duration-300 group-hover:scale-110" />
                  <span>Become a Donor</span>
                </button>
              </div>

              <div className="mt-8 flex justify-center lg:justify-start">
                <p className="text-sm font-medium text-gray-400">
                  Your donation can make a lasting difference.
                </p>
              </div>
            </div>

            <div className="order-1 flex justify-center lg:order-2">
              <div className="relative w-full max-w-[520px]">
                <div className="relative rounded-[28px] border bg-white">
                  <div className="overflow-hidden rounded-[22px]">
                    <img
                      src={banner}
                      alt="Blood Donation"
                      className="h-[360px] w-full object-cover transition-transform duration-700 hover:scale-[1.03] sm:h-[440px] md:h-[500px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className="relative max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl sm:p-7 md:p-9"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
              aria-label="Close"
            >
              <FaXmark />
            </button>

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

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

                <div ref={districtRef} className="relative">
                  <label className="mb-2 block text-sm font-bold text-gray-800">
                    District
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setDistrictOpen(!districtOpen);
                      setUpazilaOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-left outline-none transition hover:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-50"
                  >
                    <span
                      className={
                        selectedDistrict
                          ? "text-gray-800"
                          : "text-gray-400"
                      }
                    >
                      {selectedDistrict || "Select district"}
                    </span>

                    <FaChevronDown
                      className={`text-gray-400 transition-transform ${
                        districtOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {districtOpen && (
                    <div className="absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
                      <div className="border-b border-gray-100 p-3">
                        <div className="relative">
                          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                          <input
                            type="text"
                            value={districtSearch}
                            onChange={(e) =>
                              setDistrictSearch(e.target.value)
                            }
                            placeholder="Search district..."
                            autoFocus
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-red-500 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="max-h-60 overflow-y-auto p-2">
                        {filteredDistricts.length > 0 ? (
                          filteredDistricts.map((district) => (
                            <button
                              type="button"
                              key={
                                district.id ??
                                district._id ??
                                district.district_id ??
                                district.name
                              }
                              onClick={() =>
                                handleDistrictSelect(district)
                              }
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-red-50 hover:text-red-600 ${
                                selectedDistrict === district.name
                                  ? "bg-red-50 font-semibold text-red-600"
                                  : "text-gray-700"
                              }`}
                            >
                              <span>{district.name}</span>

                              {selectedDistrict === district.name && (
                                <FaCheck className="text-red-500" />
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-6 text-center text-sm text-gray-400">
                            No district found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div ref={upazilaRef} className="relative">
                  <label className="mb-2 block text-sm font-bold text-gray-800">
                    Upazila
                  </label>

                  <button
                    type="button"
                    disabled={!selectedDistrict}
                    onClick={() => {
                      if (!selectedDistrict) return;

                      setUpazilaOpen(!upazilaOpen);
                      setDistrictOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left outline-none transition ${
                      !selectedDistrict
                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                        : "border-gray-200 bg-gray-50 hover:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-50"
                    }`}
                  >
                    <span
                      className={
                        selectedUpazila
                          ? "text-gray-800"
                          : "text-gray-400"
                      }
                    >
                      {selectedUpazila ||
                        (selectedDistrict
                          ? "Select upazila"
                          : "Select district first")}
                    </span>

                    <FaChevronDown
                      className={`text-gray-400 transition-transform ${
                        upazilaOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {upazilaOpen && selectedDistrict && (
                    <div className="absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
                      <div className="border-b border-gray-100 p-3">
                        <div className="relative">
                          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                          <input
                            type="text"
                            value={upazilaSearch}
                            onChange={(e) =>
                              setUpazilaSearch(e.target.value)
                            }
                            placeholder="Search upazila..."
                            autoFocus
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-red-500 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="max-h-60 overflow-y-auto p-2">
                        {filteredUpazilas.length > 0 ? (
                          filteredUpazilas.map((upazila) => (
                            <button
                              type="button"
                              key={
                                upazila.id ??
                                upazila._id ??
                                upazila.upazila_id ??
                                upazila.name
                              }
                              onClick={() =>
                                handleUpazilaSelect(upazila)
                              }
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-red-50 hover:text-red-600 ${
                                selectedUpazila === upazila.name
                                  ? "bg-red-50 font-semibold text-red-600"
                                  : "text-gray-700"
                              }`}
                            >
                              <span>{upazila.name}</span>

                              {selectedUpazila === upazila.name && (
                                <FaCheck className="text-red-500" />
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-6 text-center text-sm text-gray-400">
                            No upazila found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

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