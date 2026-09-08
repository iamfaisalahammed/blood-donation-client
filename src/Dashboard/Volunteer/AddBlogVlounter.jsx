import axios from "axios";
import JoditEditor from "jodit-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
const AddBlogVlounter = () => {
  const [content, setContent] = useState("");
  const editor = useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your blog content here...",
    }),
    []
  );

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("image", data.image[0]);

    const imageUploadResponse = await axios.post(image_hosting_api, formData);
    if (imageUploadResponse.data.success) {
      data.image = imageUploadResponse.data.data.url;

      const res = await axios.post(
        "http://localhost:5173.app/blog",
        {
          ...data,
          content,
          status: "draft",
        }
      );

      if (res.data.insertedId) {
        reset();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Blog Add Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };
  return (
    <div className="lg:w-3/4 mx-auto">
      <div className="text-center p-10">
        <img
          className="size-36"
          src="https://i.ibb.co.com/34843vL/red-grungy-rubber-stamp-words-600nw-1231651720.webp"
          alt=""
        />
      </div>
      <div className="card bg-base-100 w-full shrink-0 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="card-body">
          <div className="form-control flex-1">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              {...register("title", { required: true })}
              type="text"
              name="title"
              placeholder="title"
              className="input input-bordered"
              required
            />
          </div>
          {/* --------------------------------- */}
          <div className="form-control flex-1">
            <label className="label">
              <span className="label-text">Image</span>
            </label>
            <input
              {...register("image", { required: true })}
              type="file"
              name="image"
              placeholder="image"
              className="input input-bordered"
              required
            />
          </div>
          {/* ------------content-------- */}
          <div className="form-control flex-1">
            <label className="label">
              <span className="label-text">Content</span>
            </label>
            <JoditEditor
              ref={editor}
              value={content}
              config={config}
              tabIndex={1}
              onBlur={(newContent) => setContent(newContent)}
            />
          </div>
          <button className="btn bg-red-950 text-white" type="submit">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBlogVlounter;
