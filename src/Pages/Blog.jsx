import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaBookOpen } from "react-icons/fa";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/AllBlog")
      .then((res) => {
        const publishedBlogs = res.data.filter(
          (blog) => blog.status === "published"
        );

        setBlogs(publishedBlogs);
      })
      .catch((error) => {
        console.error("Failed to load blogs:", error);
      });
  }, []);

  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}
        <div className="mx-auto mb-12 max-w-2xl text-center">

          <div className="mb-4 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-600">
              <FaBookOpen />
              Blood Donation Blog
            </span>
          </div>

          <h2 className="font-serif text-4xl font-black italic text-gray-950 sm:text-5xl">
            Latest <span className="text-red-600">Articles</span>
          </h2>

          <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-red-600" />

          <p className="mt-5 text-sm leading-7 text-gray-500 sm:text-base">
            Discover helpful information, awareness stories, and important
            tips about blood donation and saving lives.
          </p>

        </div>

        {/* ================= BLOG GRID ================= */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">

            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-gray-200/70"
              >

                {/* ================= IMAGE ================= */}
                <div className="relative overflow-hidden">

                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Category */}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-red-600 shadow-sm backdrop-blur-sm">
                      Blood Awareness
                    </span>
                  </div>

                </div>

                {/* ================= CONTENT ================= */}
                <div className="p-5 sm:p-6">

                  {/* Title */}
                  <h3 className="line-clamp-2 min-h-[56px] text-xl font-bold leading-7 text-gray-900 transition-colors duration-300 group-hover:text-red-600">
                    {blog.title}
                  </h3>

                  {/* Divider */}
                  <div className="my-4 h-px bg-gray-100" />

                  {/* Content */}
                  <p className="line-clamp-3 min-h-[72px] text-sm leading-6 text-gray-500">
                    {blog.content
                      ?.replace(/<[^>]*>/g, "")
                      .replace(/&nbsp;/g, " ")
                      .trim()
                      .slice(0, 150)}
                    ...
                  </p>

                  {/* Read More */}
                  <div className="mt-6">

                    <Link
                      to={`/seeMore/${blog._id}`}
                      className="group/button inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-red-700 hover:shadow-md"
                    >
                      Read More

                      <FaArrowRight className="text-xs transition-transform duration-300 group-hover/button:translate-x-1" />
                    </Link>

                  </div>

                </div>
              </article>
            ))}

          </div>
        ) : (
          /* ================= EMPTY STATE ================= */
          <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center shadow-sm">

            <FaBookOpen className="mx-auto mb-4 text-4xl text-gray-300" />

            <h3 className="text-xl font-bold text-gray-800">
              No Articles Available
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              New blood donation articles will appear here soon.
            </p>

          </div>
        )}

      </div>
    </section>
  );
};

export default Blog;