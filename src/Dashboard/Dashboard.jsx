import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaTint,
  FaHome,
  FaUsers,
  FaList,
  FaBlog,
  FaPlus,
  FaChevronRight,
} from "react-icons/fa";
import { Link, Outlet, useLocation } from "react-router-dom";
import UseAdmin from "./Admin/useAdmin";
import UseVolunteer from "./Volunteer/Usevolunteer";

const Dashboard = () => {
  const [isAdmin] = UseAdmin();
  const [isVolunteer] = UseVolunteer();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    const currentPath = location.pathname.split("/").pop();
    return currentPath === path;
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const menuClass = (path) =>
    `group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
      isActive(path)
        ? "bg-white text-red-600 shadow-sm"
        : "text-white/85 hover:bg-white/10 hover:text-white"
    }`;

  const iconClass = (path) =>
    `flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 ${
      isActive(path)
        ? "bg-red-50 text-red-600"
        : "bg-white/10 text-white/80 group-hover:bg-white/15 group-hover:text-white"
    }`;

  const renderMenu = () => {
    if (isAdmin) {
      return (
        <>
          <li>
            <Link
              to="adminHome"
              onClick={closeSidebar}
              className={menuClass("adminHome")}
            >
              <span className="flex items-center gap-3">
                <span className={iconClass("adminHome")}>
                  <FaHome />
                </span>
                Admin Dashboard
              </span>

              {isActive("adminHome") && <FaChevronRight className="text-xs" />}
            </Link>
          </li>

          <li>
            <Link
              to="AdminUsers"
              onClick={closeSidebar}
              className={menuClass("AdminUsers")}
            >
              <span className="flex items-center gap-3">
                <span className={iconClass("AdminUsers")}>
                  <FaUsers />
                </span>
                Manage Users
              </span>

              {isActive("AdminUsers") && <FaChevronRight className="text-xs" />}
            </Link>
          </li>

          <li>
            <Link
              to="AdminRequest"
              onClick={closeSidebar}
              className={menuClass("AdminRequest")}
            >
              <span className="flex items-center gap-3">
                <span className={iconClass("AdminRequest")}>
                  <FaTint />
                </span>
                Blood Requests
              </span>

              {isActive("AdminRequest") && (
                <FaChevronRight className="text-xs" />
              )}
            </Link>
          </li>

          <li>
            <Link
              to="AdminBlogs"
              onClick={closeSidebar}
              className={menuClass("AdminBlogs")}
            >
              <span className="flex items-center gap-3">
                <span className={iconClass("AdminBlogs")}>
                  <FaBlog />
                </span>
                Manage Blogs
              </span>

              {isActive("AdminBlogs") && <FaChevronRight className="text-xs" />}
            </Link>
          </li>
        </>
      );
    }

    if (isVolunteer) {
      return (
        <>
          <li>
            <Link
              to="volunteerHome"
              onClick={closeSidebar}
              className={menuClass("volunteerHome")}
            >
              <span className="flex items-center gap-3">
                <span className={iconClass("volunteerHome")}>
                  <FaHome />
                </span>
                Volunteer Dashboard
              </span>

              {isActive("volunteerHome") && (
                <FaChevronRight className="text-xs" />
              )}
            </Link>
          </li>

          <li>
            <Link
              to="volunteerRequest"
              onClick={closeSidebar}
              className={menuClass("volunteerRequest")}
            >
              <span className="flex items-center gap-3">
                <span className={iconClass("volunteerRequest")}>
                  <FaTint />
                </span>
                Blood Requests
              </span>

              {isActive("volunteerRequest") && (
                <FaChevronRight className="text-xs" />
              )}
            </Link>
          </li>

          <li>
            <Link
              to="volunteerManagement"
              onClick={closeSidebar}
              className={menuClass("volunteerManagement")}
            >
              <span className="flex items-center gap-3">
                <span className={iconClass("volunteerManagement")}>
                  <FaBlog />
                </span>
                Content Management
              </span>

              {isActive("volunteerManagement") && (
                <FaChevronRight className="text-xs" />
              )}
            </Link>
          </li>
        </>
      );
    }

    return (
      <>
        <li>
          <Link to="Home" onClick={closeSidebar} className={menuClass("Home")}>
            <span className="flex items-center gap-3">
              <span className={iconClass("Home")}>
                <FaHome />
              </span>
              Donor Information
            </span>

            {isActive("Home") && <FaChevronRight className="text-xs" />}
          </Link>
        </li>

        <li>
          <Link
            to="DonorMy"
            onClick={closeSidebar}
            className={menuClass("DonorMy")}
          >
            <span className="flex items-center gap-3">
              <span className={iconClass("DonorMy")}>
                <FaList />
              </span>
              My Donation Requests
            </span>

            {isActive("DonorMy") && <FaChevronRight className="text-xs" />}
          </Link>
        </li>

        <li>
          <Link
            to="DonorCreate"
            onClick={closeSidebar}
            className={menuClass("DonorCreate")}
          >
            <span className="flex items-center gap-3">
              <span className={iconClass("DonorCreate")}>
                <FaPlus />
              </span>
              Create Donation Request
            </span>

            {isActive("DonorCreate") && <FaChevronRight className="text-xs" />}
          </Link>
        </li>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col bg-gray-950 px-4 py-5 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-2">
          <Link
            to="/"
            onClick={closeSidebar}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-900/20">
              <FaTint className="text-lg" />
            </div>

            <div>
              <h1 className="font-serif text-xl font-black italic text-white">
                Blood<span className="text-red-500">Life</span>
              </h1>

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">
                Save Lives
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={closeSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-white/10" />

        {/* Menu Label */}
        <div className="px-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
            Dashboard Menu
          </p>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex-1 overflow-y-auto">
          <ul className="space-y-1.5">{renderMenu()}</ul>

          {/* General */}
          <div className="my-6 h-px bg-white/10" />

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
            General
          </p>

          <ul className="space-y-1.5">
            <li>
              <Link
                to="/"
                onClick={closeSidebar}
                className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/85 transition-all duration-200 hover:bg-white/10 hover:text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/80 transition-all group-hover:bg-white/15 group-hover:text-white">
                  <FaHome />
                </span>
                Home
              </Link>
            </li>

            <li>
              <Link
                to="profile"
                onClick={closeSidebar}
                className={menuClass("profile")}
              >
                <span className="flex items-center gap-3">
                  <span className={iconClass("profile")}>
                    <FaUser />
                  </span>
                  Profile
                </span>

                {isActive("profile") && <FaChevronRight className="text-xs" />}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white">
              <FaHeartbeatIcon />
            </div>

            <div>
              <p className="text-xs font-bold text-white">Every Drop Matters</p>

              <p className="mt-0.5 text-[10px] text-gray-500">
                Together we save lives.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="min-h-screen lg:ml-[280px]">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-gray-100 bg-white/95 px-4 shadow-sm backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors hover:bg-red-100"
            aria-label="Open sidebar"
          >
            <FaBars />
          </button>

          <div className="ml-3">
            <h2 className="font-serif text-lg font-black italic text-gray-900">
              Blood<span className="text-red-600">Life</span>
            </h2>

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">
              Dashboard
            </p>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:min-h-screen lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

/* Small internal icon component */
const FaHeartbeatIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
    />
  </svg>
);

export default Dashboard;
