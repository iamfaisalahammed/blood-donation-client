import axios from "axios";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get("https://blood-donation-server-eta-eight.vercel.app/blog")
      .then((res) => setBlogs(res.data));
  }, []);

  const handleBlogDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `https://blood-donation-server-eta-eight.vercel.app/blogs/${id}`,
          { method: "DELETE" }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount) {
              Swal.fire("Deleted!", "Your blog has been removed.", "success");
              setBlogs(blogs.filter((blog) => blog._id !== id));
            }
          });
      }
    });
  };

  const handleStatusUp = (id, newStatus) => {
    if (!id) return;
    Swal.fire({
      title: `Mark this blog as ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${newStatus}!`,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `https://blood-donation-server-eta-eight.vercel.app/blogStatus/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.modifiedCount > 0) {
              Swal.fire(
                "Updated!",
                `Status changed to ${newStatus}.`,
                "success"
              );
              setBlogs(
                blogs.map((blog) =>
                  blog._id === id ? { ...blog, status: newStatus } : blog
                )
              );
            }
          });
      }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-end mb-4">
        <Link
          to="blogManagement"
          className="btn bg-red-700 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md"
        >
          Add Blog
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
          >
            <img
              src={blog.image}
              alt="Blog Cover"
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">{blog.title}</h3>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleBlogDelete(blog._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash size={18} />
                </button>
                <button>
                  <Link
                    to={`/seeMore/${blog._id}`}
                    className="  px-3 py-1 rounded-lg shadow-md  "
                  >
                    Read More
                  </Link>
                </button>
                {blog.status === "draft" ? (
                  <button
                    onClick={() => handleStatusUp(blog._id, "published")}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-blue-600 transition-all"
                  >
                    Publish
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusUp(blog._id, "draft")}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-green-600 transition-all"
                  >
                    Unpublish
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlogs;
