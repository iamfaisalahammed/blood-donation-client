import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBlog,
  FaPlus,
  FaEye,
  FaSpinner,
  FaFileAlt,
} from "react-icons/fa";

const VolunteerManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://blood-donation-server-eta-eight.vercel.app/blogs")
      .then((res) => {
        setBlogs(res.data);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <div className="flex items-center gap-3 mb-2">

                <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center">
                  <FaBlog className="text-red-700 text-xl" />
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Blog Posts
                  </h1>

                  <p className="text-sm text-gray-500 mt-1">
                    Manage and view all your community blog posts
                  </p>
                </div>

              </div>
            </div>

            <Link
              to="blogManagements"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-w-[150px] h-12 px-6 rounded-xl bg-red-700 hover:bg-red-800 text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FaPlus />
              Add Blog
            </Link>

          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

          <div className="px-6 sm:px-8 py-5 border-b border-gray-100 bg-gray-50">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div className="flex items-center gap-3">
                <FaFileAlt className="text-red-700" />

                <div>
                  <h2 className="font-semibold text-gray-900">
                    All Blog Posts
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Browse and manage your published blog content
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm w-fit">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>

                <span className="text-sm font-medium text-gray-600">
                  {blogs.length} {blogs.length === 1 ? "Blog" : "Blogs"}
                </span>
              </div>

            </div>

          </div>

          <div className="p-6 sm:p-8">

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">

                <FaSpinner className="text-red-700 text-3xl animate-spin mb-4" />

                <p className="text-sm text-gray-500">
                  Loading blog posts...
                </p>

              </div>
            ) : blogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20">

                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                  <FaBlog className="text-red-600 text-2xl" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  No Blog Posts Found
                </h3>

                <p className="text-sm text-gray-500 mt-1 max-w-md">
                  You haven't created any blog posts yet. Start sharing useful
                  information with your community.
                </p>

                <Link
                  to="blogManagements"
                  className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-semibold transition-all duration-200 shadow-md"
                >
                  <FaPlus />
                  Create Your First Blog
                </Link>

              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  >

                    <div className="relative overflow-hidden">

                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-52 object-cover hover:scale-105 transition-transform duration-300"
                      />

                      <div className="absolute top-3 right-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/95 rounded-full shadow-sm">

                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>

                          <span className="text-xs font-medium text-gray-700">
                            {blog.status || "Published"}
                          </span>

                        </div>
                      </div>

                    </div>

                    <div className="p-5">

                      <h3 className="text-lg font-bold text-gray-900 leading-7 line-clamp-2 min-h-[56px]">
                        {blog.title}
                      </h3>

                      {blog.description && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {blog.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">

                        <span className="text-xs text-gray-400">
                          Community Blog
                        </span>

                        <Link
                          to={`/seeMore/${blog._id}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800 transition-colors"
                        >
                          <FaEye />
                          Read More
                        </Link>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            Share accurate, helpful and meaningful information with your community.
          </p>
        </div>

      </div>
    </div>
  );
};

export default VolunteerManagement;