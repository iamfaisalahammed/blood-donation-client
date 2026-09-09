
import axios from "axios";
import JoditEditor from "jodit-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  FaBlog,
  FaImage,
  FaHeading,
  FaPaperPlane,
  FaCloudUploadAlt,
  FaPenFancy,
  FaCheckCircle,
} from "react-icons/fa";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddBlogVlounter = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageName, setImageName] = useState("");

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
      height: 400,
      toolbarAdaptive: false,
      buttons:
        "bold,italic,underline,strikethrough,|,ul,ol,|,font,fontsize,brush,paragraph,|,align,|,link,image,|,undo,redo,|,fullsize",
    }),
    []
  );

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", data.image[0]);

      const imageUploadResponse = await axios.post(
        image_hosting_api,
        formData
      );

      if (imageUploadResponse.data.success) {
        data.image = imageUploadResponse.data.data.url;

        const res = await axios.post("https://blood-donation-server-eta-eight.vercel.app/blog", {
          ...data,
          content,
          status: "draft",
        });

        if (res.data.insertedId) {
          reset();
          setContent("");
          setImageName("");

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Blog Added Successfully",
            text: "Your blog has been saved as a draft.",
            showConfirmButton: false,
            timer: 1800,
          });
        }
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "Unable to create the blog. Please try again.",
        confirmButtonColor: "#991b1b",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">
          <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-800 px-6 py-8 md:px-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl text-white backdrop-blur-sm">
                  <FaBlog />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-white md:text-3xl">
                    Create New Blog
                  </h1>
                  <p className="mt-1 text-sm text-red-100 md:text-base">
                    Share helpful information with your donor community
                  </p>
                </div>
              </div>

              <div className="hidden rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-sm sm:block">
                <div className="flex items-center gap-2 text-sm">
                  <FaPenFancy />
                  <span>Blog Management</span>
                </div>
              </div>
            </div>
          </div>

          {/* Header bottom */}
          <div className="flex items-center gap-2 px-6 py-4 text-sm text-slate-500 md:px-10">
            <FaCheckCircle className="text-green-500" />
            <span>
              Your blog will be saved as a{" "}
              <span className="font-semibold text-red-900">draft</span>
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5 md:px-8">
            <h2 className="text-lg font-bold text-slate-800">
              Blog Information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add a title, featured image and content for your blog.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 p-6 md:p-8">
            {/* Title */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FaHeading className="text-red-800" />
                Blog Title
              </label>

              <div className="relative">
                <input
                  {...register("title", {
                    required: "Blog title is required",
                  })}
                  type="text"
                  placeholder="Enter an engaging blog title..."
                  className={`h-13 w-full rounded-xl border bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
                    errors.title
                      ? "border-red-400 focus:border-red-600 focus:ring-red-100"
                      : "border-slate-200 focus:border-red-800 focus:ring-red-100"
                  }`}
                />
              </div>

              {errors.title && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Image */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FaImage className="text-red-800" />
                Featured Image
              </label>

              <label className="group flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-7 text-center transition hover:border-red-700 hover:bg-red-50/40">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-800 transition group-hover:scale-110">
                  <FaCloudUploadAlt />
                </div>

                <p className="text-sm font-semibold text-slate-700">
                  {imageName || "Click to upload your blog image"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  PNG, JPG or JPEG • Recommended for best quality
                </p>

                <input
                  {...register("image", {
                    required: "Featured image is required",
                  })}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setImageName(file ? file.name : "");
                  }}
                />
              </label>

              {errors.image && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Content */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FaPenFancy className="text-red-800" />
                  Blog Content
                </label>

                <span className="text-xs text-slate-400">
                  Write your story
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-red-700 focus-within:ring-2 focus-within:ring-red-100">
                <JoditEditor
                  ref={editor}
                  value={content}
                  config={config}
                  tabIndex={1}
                  onBlur={(newContent) => setContent(newContent)}
                />
              </div>
            </div>

            {/* Bottom Info */}
            <div className="flex flex-col gap-4 rounded-xl border border-red-100 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-red-950">
                  Ready to publish?
                </p>
                <p className="mt-1 text-xs text-red-800/70">
                  This blog will be created as a draft for review.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-red-900">
                <FaCheckCircle />
                Draft mode
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-950 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-950/10 transition hover:bg-red-900 hover:shadow-red-950/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating Blog...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Create Blog
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <p className="mt-5 text-center text-xs text-slate-400">
          Make sure your blog content is informative, accurate and helpful to
          the community.
        </p>
      </div>
    </div>
  );
};

export default AddBlogVlounter;

