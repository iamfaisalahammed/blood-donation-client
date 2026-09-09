import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const VolunteerManagement = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get("https://blood-donation-server-eta-eight.vercel.app/blogs")
      .then((res) => setBlogs(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">Blog Posts</h2>
          <Link
            to="blogManagements"
            className="btn px-8 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all duration-300"
          >
            Add Blog
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="card bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden"
            >
              <figure>
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="card-body p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-base">{blog.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <Link
                    to={`/seeMore/${blog._id}`}
                    className="text-red-600 hover:text-red-800"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VolunteerManagement;
