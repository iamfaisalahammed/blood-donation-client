import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaTint,
  FaLocationArrow,
  FaTimes,
  FaCheckCircle,
  FaChevronDown,
  FaCheck,
} from "react-icons/fa";

const SearchPage = () => {
  const [donners, setDonner] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

 
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");

  const [districtSearch, setDistrictSearch] = useState("");
  const [upazilaSearch, setUpazilaSearch] = useState("");

  const [districtOpen, setDistrictOpen] = useState(false);
  const [upazilaOpen, setUpazilaOpen] = useState(false);

  const districtRef = useRef(null);
  const upazilaRef = useRef(null);


  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

 
  // Get Districts
 
  const { data: districts = [] } = useQuery({
    queryKey: ["districts"],
    queryFn: async () => {
      const res = await fetch("/districts.json");
      return res.json();
    },
  });


  // Get Upazilas
 
  const { data: upazilas = [] } = useQuery({
    queryKey: ["upazilas"],
    queryFn: async () => {
      const res = await fetch("/upazilas.json");
      return res.json();
    },
  });

  
  // Close Dropdown Outside
  
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


  // Selected District Object
 
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

  // Filter Districts

  const filteredDistricts = useMemo(() => {
    const search = districtSearch.toLowerCase().trim();

    if (!search) return districts;

    return districts.filter((district) =>
      district.name?.toLowerCase().includes(search),
    );
  }, [districts, districtSearch]);

  
  // Filter Upazilas

  const filteredUpazilas = useMemo(() => {
    if (!selectedDistrict) return [];

    const search = upazilaSearch.toLowerCase().trim();

    return upazilas.filter((upazila) => {
      const districtId =
        upazila.district_id ?? upazila.districtId ?? upazila.districtID;

      const matchesDistrict = String(districtId) === String(selectedDistrictId);

      const matchesSearch =
        !search || upazila.name?.toLowerCase().includes(search);

      return matchesDistrict && matchesSearch;
    });
  }, [upazilas, selectedDistrict, selectedDistrictId, upazilaSearch]);

 
  // District Select

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district.name);
    setSelectedUpazila("");

    setDistrictSearch("");
    setUpazilaSearch("");

    setDistrictOpen(false);
    setUpazilaOpen(false);

    setValue("district", district.name, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("upazila", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };


  // Upazila Select

  const handleUpazilaSelect = (upazila) => {
    const upazilaName = upazila.name;

    setSelectedUpazila(upazilaName);

    setUpazilaOpen(false);
    setUpazilaSearch("");

    setValue("upazila", upazilaName, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };


  // Search Donor

  const handleSearch = async (data) => {
    setLoading(true);
    setError("");
    setIsSubmitted(true);
    setDonner([]);

    try {
      const params = new URLSearchParams();

      if (data.bloodGroup) {
        params.append("bloodGroup", data.bloodGroup);
      }

      if (data.district) {
        params.append("district", data.district);
      }

      if (data.upazila) {
        params.append("upazila", data.upazila);
      }

      const response = await axios.get(
        `http://localhost:5000/searchDonor?${params.toString()}`,
      );

      setDonner(response.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to search donors. Please try again.",
      );

      setDonner([]);
    } finally {
      setLoading(false);
    }
  };

  
  const handleClear = () => {
    reset();

    setSelectedDistrict("");
    setSelectedUpazila("");

    setDistrictSearch("");
    setUpazilaSearch("");

    setDistrictOpen(false);
    setUpazilaOpen(false);

    setDonner([]);
    setError("");
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-red-600">
            Find a Donor
          </p>

          <h1 className="font-serif text-4xl font-black italic leading-tight text-gray-950 sm:text-5xl md:text-6xl">
            Search Blood
            <span className="text-red-600"> Donors</span>
          </h1>

          <div className="mx-auto mt-5 flex items-center justify-center gap-2">
            <span className="h-[2px] w-8 bg-gray-200" />
            <span className="h-[3px] w-12 rounded-full bg-red-600" />
            <span className="h-[2px] w-8 bg-gray-200" />
          </div>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-gray-500 sm:text-base">
            Find the right blood donor by selecting a blood group and entering
            the recipient's location.
          </p>
        </div>

        
        <div className="overflow-visible rounded-2xl bg-white shadow-xl">
          <form onSubmit={handleSubmit(handleSearch)} className="p-6 sm:p-8">
            {/* Search Card Header */}
            <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <FaSearch className="text-lg" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Find a Blood Donor
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Select blood group and location to find available donors.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
             
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Blood Group
                </label>

                <div className="relative">
                  <FaTint className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" />

                  <select
                    defaultValue=""
                    {...register("bloodGroup", {
                      required: "Blood group is required",
                    })}
                    className={`w-full appearance-none rounded-xl border bg-gray-50 py-3.5 pl-11 pr-10 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 ${
                      errors.bloodGroup ? "border-red-500" : "border-gray-200"
                    }`}
                  >
                    <option value="" disabled>
                      Select blood group
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

                  <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>

                {errors.bloodGroup && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.bloodGroup.message}
                  </p>
                )}
              </div>

             
              <div ref={districtRef} className="relative">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  District
                </label>

                {/* Selected District */}
                <button
                  type="button"
                  onClick={() => {
                    setDistrictOpen(!districtOpen);
                    setUpazilaOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border bg-gray-50 px-4 py-3.5 text-left outline-none transition hover:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 ${
                    errors.district ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-red-500" />

                    <span
                      className={
                        selectedDistrict ? "text-gray-800" : "text-gray-400"
                      }
                    >
                      {selectedDistrict || "Select district"}
                    </span>
                  </div>

                  <FaChevronDown
                    className={`text-gray-400 transition-transform ${
                      districtOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* District Dropdown */}
                {districtOpen && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
                    {/* Search District */}
                    <div className="border-b border-gray-100 p-3">
                      <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                          type="text"
                          value={districtSearch}
                          onChange={(e) => setDistrictSearch(e.target.value)}
                          placeholder="Search district..."
                          autoFocus
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-red-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* District List */}
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
                            onClick={() => handleDistrictSelect(district)}
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

                <input
                  type="hidden"
                  {...register("district", {
                    required: "District is required",
                  })}
                />

                {errors.district && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.district.message}
                  </p>
                )}
              </div>

              
              <div ref={upazilaRef} className="relative">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Upazila
                </label>

                {/* Selected Upazila */}
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
                      : errors.upazila
                        ? "border-red-500 bg-gray-50 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 bg-gray-50 hover:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FaLocationArrow
                      className={
                        selectedDistrict ? "text-red-500" : "text-gray-400"
                      }
                    />

                    <span
                      className={
                        selectedUpazila ? "text-gray-800" : "text-gray-400"
                      }
                    >
                      {selectedUpazila ||
                        (selectedDistrict
                          ? "Select upazila"
                          : "Select district first")}
                    </span>
                  </div>

                  <FaChevronDown
                    className={`text-gray-400 transition-transform ${
                      upazilaOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Upazila Dropdown */}
                {upazilaOpen && selectedDistrict && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
                    {/* Search Upazila */}
                    <div className="border-b border-gray-100 p-3">
                      <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                          type="text"
                          value={upazilaSearch}
                          onChange={(e) => setUpazilaSearch(e.target.value)}
                          placeholder="Search upazila..."
                          autoFocus
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-red-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Upazila List */}
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
                            onClick={() => handleUpazilaSelect(upazila)}
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

                <input
                  type="hidden"
                  {...register("upazila", {
                    required: "Upazila is required",
                  })}
                />

                {errors.upazila && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.upazila.message}
                  </p>
                )}
              </div>
            </div>

           
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-red-100 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Searching...
                  </>
                ) : (
                  <>
                    <FaSearch />
                    Search Donors
                  </>
                )}
              </button>

              {(isSubmitted || selectedDistrict || selectedUpazila) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-6 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-200"
                >
                  <FaTimes />
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-600">
            {error}
          </div>
        )}

        
        {isSubmitted && !loading && !error && (
          <div className="mt-8">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Search Completed
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {donners.length} donor
                  {donners.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-600">
                <FaCheckCircle />
                Search completed
              </div>
            </div>

          
            {donners.length > 0 ? (
              <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50 text-left text-sm text-gray-600">
                        <th className="px-6 py-4 font-semibold">Donor</th>

                        <th className="px-6 py-4 font-semibold">Blood Group</th>

                        <th className="px-6 py-4 font-semibold">Location</th>

                        <th className="px-6 py-4 font-semibold">Contact</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {donners.map((donner) => (
                        <tr
                          key={donner._id}
                          className="transition hover:bg-red-50/40"
                        >
                          {/* Donor */}
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
                                {donner.name?.charAt(0)?.toUpperCase() || "D"}
                              </div>

                              <div>
                                <p className="font-semibold text-gray-800">
                                  {donner.name ||
                                    donner.displayName ||
                                    "Anonymous Donor"}
                                </p>

                                {donner.email && (
                                  <p className="text-xs text-gray-400">
                                    {donner.email}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Blood */}
                          <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1.5 text-sm font-bold text-red-600">
                              <FaTint />
                              {donner.bloodGroup || "N/A"}
                            </span>
                          </td>

                          {/* Location */}
                          <td className="px-6 py-5">
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2 text-gray-700">
                                <FaMapMarkerAlt className="text-red-500" />
                                <span>{donner.district || "N/A"}</span>
                              </div>

                              <div className="pl-5 text-gray-500">
                                {donner.upazila || "N/A"}
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="px-6 py-5">
                            <div className="space-y-2">
                              {donner.phone && (
                                <a
                                  href={`tel:${donner.phone}`}
                                  className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-red-600"
                                >
                                  <FaPhone className="text-red-500" />
                                  {donner.phone}
                                </a>
                              )}

                              {donner.email && (
                                <a
                                  href={`mailto:${donner.email}`}
                                  className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-red-600"
                                >
                                  <FaEnvelope className="text-red-500" />
                                  <span className="max-w-[180px] truncate">
                                    {donner.email}
                                  </span>
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
         
              <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-lg">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                  <FaTint className="text-4xl text-red-300" />
                </div>

                <h3 className="text-xl font-bold text-gray-800">
                  No Donor Found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                  We couldn't find any donor matching your selected blood group
                  and location.
                </p>

                <button
                  type="button"
                  onClick={handleClear}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  <FaSearch />
                  Search Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
