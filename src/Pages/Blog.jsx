import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5173/AllBlog")
      .then((res) => {
        const publishedBlogs = res.data.filter(
          (blog) => blog.status === "published"
        );
        setBlogs(publishedBlogs);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-red-700 mb-6">
        Latest Blogs
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white shadow-lg rounded-2xl overflow-hidden transform transition duration-500 hover:scale-105 border border-gray-200"
          >
            <figure className="w-full h-56 overflow-hidden">
              <img
                src={blog.image}
                alt="Blog"
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {blog.title}
              </h3>
              <p className="text-gray-700 text-sm">
                {blog.content.length > 120
                  ? blog.content.slice(0, 120) + "..."
                  : blog.content}
              </p>
              <div className="mt-4">
                <Link
                  to={`/seeMore/${blog._id}`}
                  className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
