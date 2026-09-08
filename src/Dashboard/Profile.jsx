import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { AuthContext } from "../Providers/AuthProvider";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Profile = () => {
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const { user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // -------------------------------------UPAZILAS____DISTRICTS------------------------------------------------------------

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
  // --------------------------------------------------------------------------------------
  const handleUpProfile = async (data) => {
    const updatedData = {
      name: data.name,
      email: user?.email,
      image: data.image[0],
      bloodGroup: data.Blood,
      district: selectedDistricts,
      upazila: selectedUpazila,
    };

    let imageUrl = user?.photoURL;

    if (data.image[0]) {
      const formData = new FormData();
      formData.append("image", data.image[0]);
      const imgResponse = await axios.post(image_hosting_api, formData);
      imageUrl = imgResponse.data.data.display_url;
    }

    updatedData.image = imageUrl;

    const response = await axios.patch(
      `http://localhost:5173/users/profile/${user?.email}`,
      updatedData
    );
    if (response.data.modifiedCount > 0) {
      await updateProfile(user, { displayName: data.name, photoURL: imageUrl });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "User Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      setIsEditable(false);
    }
  };

  return (
    <div className="lg:w-3/4 mx-auto">
      <div>
        <h2 className="text-2xl text-center bg-black glass text-white py-2 rounded-lg ">
          {" "}
          Welcome {user?.displayName}
        </h2>
        <div className="divider "></div>
      </div>
      <div className="text-center p-10">
        <img
          className="size-40  border-4 mx-auto  border-black"
          src={user?.photoURL}
        />
      </div>
      <div className="card bg-base-100 w-full shrink-0 shadow-2xl">
        <form onSubmit={handleSubmit(handleUpProfile)} className="card-body">
          {/* form first row */}
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="form-control flex-1">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                {...register("name", { required: true })}
                type="text"
                name="name"
                disabled={!isEditable}
                placeholder="Name"
                className="input input-bordered"
                defaultValue={user?.displayName}
                required
              />
            </div>
            <div className="form-control flex-1">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                name="email"
                disabled={!isEditable}
                defaultValue={user?.email}
                placeholder="Email"
                readOnly
                className="input input-bordered"
                required
              />
            </div>
          </div>
          {/* form second row */}
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="form-control flex-1">
              <label className="label">
                <span className="label-text">Avatar</span>
              </label>
              <input
                {...register("image", { required: true })}
                type="file"
                name="image"
                disabled={!isEditable}
                placeholder="Avatar"
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
                disabled={!isEditable}
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
                <span className="label-text">District</span>
              </label>
              <select
                {...register("District", { required: true })}
                className="select select-bordered"
                name="District"
                value={selectedDistricts}
                disabled={!isEditable}
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
                <span className="label-text">Upazila</span>
              </label>
              <select
                {...register("Upazila", { required: true })}
                className="select select-bordered"
                name="Upazila"
                disabled={!isEditable}
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

          <div className="flex justify-center mt-6">
            {isEditable ? (
              <button
                type="submit"
                className="btn btn-outline text-white font-bold bg-red-800 hover:bg-red-950"
              >
                Save
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditable(true)}
                className="btn btn-outline text-white font-bold bg-blue-800 hover:bg-blue-950"
              >
                <FaEdit className="mr-2" /> Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
