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
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const BlogManagment = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
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
      height: 450,
      toolbarAdaptive: false,
      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "fontsize",
        "paragraph",
        "|",
        "align",
        "|",
        "link",
        "image",
        "|",
        "undo",
        "redo",
        "|",
        "source",
      ],
    }),
    []
  );

  const onSubmit = async (data) => {
    if (!data.image?.[0]) {
      Swal.fire({
        icon: "warning",
        title: "Image Required",
        text: "Please select a blog image.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    if (!content || content.replace(/<[^>]*>/g, "").trim().length < 10) {
      Swal.fire({
        icon: "warning",
        title: "Content Required",
        text: "Please write at least a few words for your blog.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    try {
      setLoading(true);

      // -------------------------------
      // Upload Image
      // -------------------------------
      const formData = new FormData();
      formData.append("image", data.image[0]);

      const imageUploadResponse = await axios.post(
        image_hosting_api,
        formData
      );

      if (!imageUploadResponse.data.success) {
        throw new Error("Image upload failed");
      }

      const imageUrl = imageUploadResponse.data.data.url;

      // -------------------------------
      // Create Blog
      // -------------------------------
      const blogData = {
        title: data.title.trim(),
        image: imageUrl,
        content,
        status: "draft",
      };

      const res = await axios.post(
        "http://localhost:5000/blog",
        blogData
      );

      if (res.data.insertedId) {
        reset();
        setContent("");

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Blog Added Successfully!",
          text: "Your blog has been saved as a draft.",
          showConfirmButton: false,
          timer: 1800,
        });
      }
    } catch (error) {
      console.error("Blog creation error:", error);

      Swal.fire({
        icon: "error",
        title: "Something Went Wrong",
        text:
          error?.response?.data?.message ||
          "Failed to create blog. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center">
                  <FaBlog className="text-red-700 text-xl" />
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Create New Blog
                  </h1>

                  <p className="text-sm text-gray-500 mt-1">
                    Share useful information with your community
                  </p>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm w-fit">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span className="text-sm font-medium text-gray-600">
                Draft Mode
              </span>
            </div>

          </div>
        </div>

        {/* ================= FORM CARD ================= */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

          {/* Card Header */}
          <div className="px-6 sm:px-8 py-5 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <FaPaperPlane className="text-red-700" />

              <div>
                <h2 className="font-semibold text-gray-900">
                  Blog Information
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Add a title, cover image and content for your blog
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 sm:p-8 space-y-7"
          >

            {/* ================= TITLE ================= */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FaHeading className="text-red-600" />
                Blog Title
              </label>

              <input
                {...register("title", {
                  required: "Blog title is required",
                  minLength: {
                    value: 5,
                    message: "Title must be at least 5 characters",
                  },
                })}
                type="text"
                placeholder="Enter your blog title..."
                className={`w-full h-12 px-4 rounded-xl border bg-white outline-none transition-all
                  ${
                    errors.title
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  }`}
              />

              {errors.title && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* ================= IMAGE ================= */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FaImage className="text-red-600" />
                Cover Image
              </label>

              <div
                className={`border-2 border-dashed rounded-xl p-5 transition-all
                  ${
                    errors.image
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 hover:border-red-400 hover:bg-red-50/30"
                  }`}
              >
                <input
                  {...register("image", {
                    required: "Blog image is required",
                  })}
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                />

                <p className="text-xs text-gray-500 mt-2">
                  Recommended: JPG, PNG or WEBP. Choose a high-quality image
                  for your blog cover.
                </p>
              </div>

              {errors.image && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* ================= CONTENT ================= */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FaBlog className="text-red-600" />
                Blog Content
              </label>

              <div className="rounded-xl overflow-hidden border border-gray-200">
                <JoditEditor
                  ref={editor}
                  value={content}
                  config={config}
                  tabIndex={1}
                  onBlur={(newContent) => setContent(newContent)}
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Write informative and engaging content for your readers.
              </p>
            </div>

            {/* ================= INFO ================= */}
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
              <FaCheckCircle className="text-red-600 mt-0.5 shrink-0" />

              <div>
                <p className="text-sm font-semibold text-red-900">
                  Your blog will be saved as a draft
                </p>

                <p className="text-xs text-red-700 mt-1">
                  You can review and publish it later from the blog management
                  section.
                </p>
              </div>
            </div>

            {/* ================= BUTTON ================= */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto min-w-[180px] h-12 px-7 rounded-xl bg-red-700 hover:bg-red-800 text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Creating Blog...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Create Blog
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* ================= FOOTER NOTE ================= */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            Make sure your blog contains accurate and helpful information.
          </p>
        </div>

      </div>
    </div>
  );
};

export default BlogManagment;