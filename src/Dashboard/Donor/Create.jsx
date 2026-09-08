import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import Swal from "sweetalert2";

const Create = () => {
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState("");
  const { user } = useContext(AuthContext);
  const [Users, setUsers] = useState([]);

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm();
  const { data: upazilas = [], isLoading } = useQuery({
    queryKey: ["Upazilas"],
    queryFn: async () => {
      const res = await axios.get("/upazilas.json");
      return res.data;
    },
  });
  const { data: districts = [] } = useQuery({
    queryKey: ["districts"],
    queryFn: async () => {
      const res = await axios.get("/districts.json");
      return res.data;
    },
  });
  //   --------------------------------------------------------------------------------------
  const onSubmit = (data) => {
    data.status = "pending";
    axios
      .post(
        "http://localhost:5173.app/recipient",
        data
      )
      .then((res) => {
        if (res.data.insertedId) {
          reset();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: " Created Donation Request Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };
  useEffect(() => {
    fetch(`http://localhost:5173.app/user/Block`)
      .then((res) => res.json())
      .then((Users) => setUsers(Users));
  }, []);
  const Login = Users.find((u) => u.email === user?.email) || {};

  return (
    <>
      <div>
        <h2 className="text-2xl text-center bg-gray-50 shadow-xl glass text-black py-2 rounded-lg ">
          Create and Publish a New Blood Request
        </h2>
        <div className="divider "></div>
      </div>
      {Login?.status === "Active" && (
        <div className="lg:w-3/4 mx-auto">
          <div className="card bg-base-100 w-full shrink-0 shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="card-body">
              <div className="flex flex-col lg:flex-row gap-5">
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text text-red-800">Name</span>
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    name="name"
                    defaultValue={user?.displayName}
                    placeholder="Name"
                    className="input input-bordered"
                    readOnly
                  />
                </div>
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text text-red-800">Email</span>
                  </label>
                  <input
                    {...register("email", { required: true })}
                    type="email"
                    name="email"
                    defaultValue={user?.email}
                    placeholder="Email"
                    className="input input-bordered"
                    required
                    readOnly
                  />
                </div>
              </div>
              {/* form first row */}
              <div className="flex flex-col lg:flex-row gap-5">
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text">Recipient-Name</span>
                  </label>
                  <input
                    {...register("recipientName", { required: true })}
                    type="text"
                    name="recipientName"
                    placeholder="Recipient-Name"
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text">Full-Address</span>
                  </label>
                  <input
                    {...register("address", { required: true })}
                    type="text"
                    name="address"
                    placeholder="Address"
                    className="input input-bordered"
                    required
                  />
                </div>
              </div>
              {/* form second row */}
              <div className="flex flex-col lg:flex-row gap-5">
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text">Hospital-Name</span>
                  </label>
                  <input
                    {...register("hospitalName", { required: true })}
                    type="text"
                    name="hospitalName"
                    placeholder="Hospital-Name"
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text">Blood Group</span>
                  </label>
                  <select
                    defaultValue="default"
                    {...register("Blood", { required: true })}
                    name="Blood"
                    required
                    className="select select-bordered w-full "
                  >
                    <option disabled value="default">
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
              </div>
              {/* form third row */}
              <div className="flex flex-col lg:flex-row gap-5">
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text">Recipient-District</span>
                  </label>
                  <select
                    {...register("District", { required: true })}
                    className="select select-bordered"
                    name="District"
                    value={selectedDistricts}
                    onChange={(e) => setSelectedDistricts(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select District
                    </option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/*------------------------------//-------------------------------------------- */}
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text">Recipient-Upazila</span>
                  </label>
                  <select
                    {...register("Upazila", { required: true })}
                    className="select select-bordered"
                    name="Upazila"
                    value={selectedUpazila}
                    onChange={(e) => setSelectedUpazila(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select Upazila
                    </option>
                    {upazilas.map((upazila) => (
                      <option key={upazila.id} value={upazila.name}>
                        {upazila.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* form four row */}
              <div className="flex flex-col lg:flex-row gap-5">
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text">Donation-Date</span>
                  </label>
                  <input
                    {...register("date", { required: true })}
                    type="date"
                    name="date"
                    placeholder="date"
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text">Donation-Time</span>
                  </label>
                  <input
                    {...register("time", { required: true })}
                    type="time"
                    name="time"
                    placeholder="time"
                    className="input input-bordered"
                    required
                  />
                </div>
              </div>
              {/* requestMessage */}
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Request-Message</span>
                </label>
                <input
                  {...register("message", { required: true })}
                  type="text"
                  name="message"
                  placeholder="Request-Message"
                  className="input input-bordered"
                />
              </div>

              <div className="form-control mt-6">
                <button className="btn btn-outline text-white font-bold bg-red-800 hover:bg-red-950">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {Login?.status === "Blocked" && (
        <h2 className="text-center text-red-800 text-2xl font-bold">
          Your account is currently blocked. You are not allowed to create a
          donation request
        </h2>
      )}
    </>
  );
};

export default Create;
