import { useLoaderData, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaHeart,
  FaShareAlt,
  FaTint,
  FaRegClock,
} from "react-icons/fa";

const Seemore = () => {
  const data = useLoaderData();
  const navigate = useNavigate();

  const { title, content, image } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-gray-50">
      {/* Back Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-all duration-300"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-sm group-hover:bg-red-50 group-hover:shadow-md transition-all">
            <FaArrowLeft className="text-sm" />
          </span>
          Back to Articles
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <article className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          {/* Hero Image */}
         <div className="relative mx-auto w-8/12 overflow-hidden rounded-[22px] bg-gray-50">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Category Badge */}
            <div className="absolute top-5 left-5">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold shadow-lg">
                <FaTint />
                Blood Donation
              </span>
            </div>

            {/* Image Bottom Text */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
              <div className="flex items-center gap-4 text-white/90 text-sm mb-3">
                <span className="flex items-center gap-2">
                  <FaRegClock />
                  Health & Awareness
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight max-w-3xl">
                {title}
              </h1>
            </div>
          </div>

          {/* Article Body */}
          <div className="p-5 sm:p-8 md:p-12">
            {/* Top Actions */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <FaTint className="text-red-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Blood Donation
                  </p>
                  <p className="text-xs text-gray-500">
                    Read & share awareness
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all"
                  title="Like"
                >
                  <FaHeart />
                </button>

                <button
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all"
                  title="Share"
                >
                  <FaShareAlt />
                </button>
              </div>
            </div>

            {/* Content */}
            <div
              className="
                prose prose-lg max-w-none
                prose-headings:text-gray-900
                prose-headings:font-bold
                prose-p:text-gray-600
                prose-p:leading-8
                prose-p:mb-5
                prose-a:text-red-600
                prose-a:no-underline
                hover:prose-a:underline
                prose-strong:text-gray-800
                prose-li:text-gray-600
                prose-blockquote:border-red-500
                prose-blockquote:bg-red-50
                prose-blockquote:rounded-xl
                prose-blockquote:px-5
                prose-blockquote:py-2
              "
            >
              {/<\/?[a-z][\s\S]*>/i.test(content) ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <p>{content}</p>
              )}
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 p-6 sm:p-8 text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">
                    Every drop can save a life
                  </h3>
                  <p className="text-red-100 mt-1 text-sm sm:text-base">
                    Become a blood donor and make a difference today.
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate("/", {
                      state: { openDonorModal: true },
                    })
                  }
                  className="whitespace-nowrap bg-white text-red-600 px-5 py-3 rounded-xl font-semibold hover:bg-red-50 transition-all duration-300 shadow-md"
                >
                  Become a Donor
                </button>
              </div>
            </div>

            {/* Back Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-red-200"
              >
                <FaArrowLeft />
                Back to Articles
              </button>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default Seemore;
