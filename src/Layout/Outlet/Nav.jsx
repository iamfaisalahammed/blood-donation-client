import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useContext } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import { CiMenuKebab } from "react-icons/ci";
import { FaHome, FaBlog, FaHandHoldingHeart, FaTachometerAlt } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const link = (
  <>
    <NavLink
      className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-semibold uppercase"
      to="/"
    >
      <FaHome />
      Home
    </NavLink>

    <NavLink
      className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-semibold uppercase"
      to="/DonationRequest"
    >
      <FaHandHoldingHeart />
      Donation Requests
    </NavLink>

    <NavLink
      className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-semibold uppercase"
      to="/blog"
    >
      <FaBlog />
      Blog
    </NavLink>
  </>
);

const Nav = () => {
  const { user, logOut } = useContext(AuthContext);

  return (
    <div className="navbar bg-white px-2">
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label tabIndex={0}>
            <CiMenuKebab className="size-7 cursor-pointer hover:text-red-600" />
          </label>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow bg-white rounded-box w-64"
          >
            {link}

            {user && (
              <NavLink
                to="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-semibold uppercase"
              >
                <FaTachometerAlt />
                Dashboard
              </NavLink>
            )}
          </ul>
        </div>

        <Link to="/" className="flex items-center gap-2">
          <img className="w-14 h-14 object-contain" src={logo} alt="logo" />
          <h2 className="font-bold text-lg md:text-xl text-black">
            Blood Donation
          </h2>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <div className="flex items-center gap-8">
          {link}

          {user && (
            <NavLink
              to="/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-semibold uppercase"
            >
              <FaTachometerAlt />
              Dashboard
            </NavLink>
          )}
        </div>
      </div>

      <div className="navbar-end">
        {user ? (
          <div className="flex items-center gap-3">
            <img
              className="w-11 h-11 rounded-full border-2 border-red-600 object-cover"
              src={
                user?.photoURL ||
                "https://i.ibb.co/4pDNDk1/avatar.png"
              }
              alt="profile"
            />

            <button
              onClick={logOut}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        ) : (
          <Link
            className="bg-red-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-700"
            to="/login"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Nav;