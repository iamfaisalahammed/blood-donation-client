import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaYoutube,
  FaTwitter,
  FaHeart,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-red-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 text-white p-2 rounded-full">
              <FaHeart size={18} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-black">
                Blood Donation
              </h2>
              <p className="text-xs text-gray-500">
                Save lives, donate blood
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/share/g/1Bj7LHgthC/"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
            >
              <FaFacebookF size={16} />
            </a>

            <a
              href="https://www.x.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
            >
              <FaTwitter size={16} />
            </a>

            <a
              href="https://youtu.be/MU8CrgctkWM?si=uqoBcXeu40voIHtd"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
            >
              <FaYoutube size={16} />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-5 pt-4 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Blood Donation. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;