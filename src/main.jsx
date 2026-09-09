import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./Pages/ErrorPage";
import Home from "./Layout/Home/Home";
import LayOut from "./Layout/Outlet/LayOut";
import Login from "./LoginAndRegister/Login";
import Register from "./LoginAndRegister/Register";
import Blog from "./Pages/Blog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./Providers/AuthProvider";
import Dashboard from "./Dashboard/Dashboard";
import PrivateRoute from "./Providers/PrivateRoute";
import Profile from "./Dashboard/Profile";
import Create from "./Dashboard/Donor/Create";
import DonorHome from "./Dashboard/Donor/DonorHome";
import Update from "./Dashboard/Donor/Update";
import Detailas from "./Dashboard/Donor/Detailas";
import MyDonation from "./Dashboard/Donor/MyDonation";
import DonationRequrest from "./Layout/Donation/DonationRequrest";
import SearchPage from "./Layout/Home/SearchPage";
import Fund from "./Layout/Home/Payment/Fund";
import AdminHome from "./Dashboard/Admin/AdminHome";
import AdminUsers from "./Dashboard/Admin/AdminUsers";
import AdminRequrest from "./Dashboard/Admin/AdminRequrest";
import AdminBlogs from "./Dashboard/Admin/AdminBlogs";
import VolunteerHome from "./Dashboard/Volunteer/VolunteerHome";
import VolunteerRequest from "./Dashboard/Volunteer/VolunteerRequest";
import VolunteerManagement from "./Dashboard/Volunteer/VolunteerManagement";
import AdminRoute from "./Dashboard/Admin/AdminRoute";
import VolunteerRoute from "./Dashboard/Volunteer/VolunteerRoute";
import GiveFund from "./Layout/Home/Payment/GiveFund";
import BlogManagment from "./Dashboard/Donor/BlogManagment";
import AddBlogVlounter from "./Dashboard/Volunteer/AddBlogVlounter";
import Seemore from "./Layout/Home/Seemore";
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayOut></LayOut>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/blog",
        element: <Blog></Blog>,
      },
      {
        path: "/DonationRequest",
        element: <DonationRequrest></DonationRequrest>,
      },
      {
        path: "/search",
        element: <SearchPage></SearchPage>,
      },
      {
        path: "/fund",
        element: (
          <PrivateRoute>
            <GiveFund></GiveFund>
          </PrivateRoute>
        ),
      },
      {
        path: "/fundpay",
        element: (
          <PrivateRoute>
            <Fund></Fund>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "login",
    element: <Login></Login>,
  },
  {
    path: "singUp",
    element: <Register></Register>,
  },

  {
    path: "/seeMore/:id",
    element: <Seemore></Seemore>,

    loader: ({ params }) =>
      fetch(
        `http://localhost:5000/seeMore/${params.id}`
      ),
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>
    ),
    children: [
      // By default Route
      {
        index: true,
        element: <Profile></Profile>,
      },
      {
        path: "profile",
        element: <Profile></Profile>,
      },

      {
        path: "AdminBlogs/blogManagement",
        element: <BlogManagment></BlogManagment>,
      },
      {
        path: "volunteerManagement/blogManagements",
        element: <AddBlogVlounter></AddBlogVlounter>,
      },
      // !----------------Admin----------------------
      {
        path: "adminHome",
        element: (
          <AdminRoute>
            <AdminHome></AdminHome>,
          </AdminRoute>
        ),
      },
      {
        path: "AdminUsers",
        element: (
          <AdminRoute>
            <AdminUsers></AdminUsers>,
          </AdminRoute>
        ),
      },
      {
        path: "AdminRequest",
        element: (
          <AdminRoute>
            <AdminRequrest></AdminRequrest>,
          </AdminRoute>
        ),
      },
      {
        path: "AdminBlogs",
        element: (
          <AdminRoute>
            <AdminBlogs></AdminBlogs>,
          </AdminRoute>
        ),
      },
      //! ----------------Volunteer-----------------------
      {
        path: "volunteerHome",
        element: (
          <VolunteerRoute>
            <VolunteerHome></VolunteerHome>,
          </VolunteerRoute>
        ),
      },
      {
        path: "volunteerRequest",
        element: (
          <VolunteerRoute>
            <VolunteerRequest></VolunteerRequest>,
          </VolunteerRoute>
        ),
      },
      {
        path: "volunteerManagement",
        element: (
          <VolunteerRoute>
            <VolunteerManagement></VolunteerManagement>,
          </VolunteerRoute>
        ),
      },
      //! -----------------Donor----------------------
      {
        index: true,
        element: <DonorHome></DonorHome>,
      },
      {
        path: "DonorCreate",
        element: <Create></Create>,
      },
      {
        path: "Home",
        element: <DonorHome></DonorHome>,
      },
      {
        path: "DonorMy",
        element: <MyDonation></MyDonation>,
      },
      {
        path: "/dashboard/update/:id",
        element: <Update></Update>,
        loader: ({ params }) =>
          fetch(
            `http://localhost:5000/DonationUp/${params.id}`
          ),
      },
      {
        path: "/dashboard/details/:id",
        element: (
          <PrivateRoute>
            <Detailas></Detailas>,
          </PrivateRoute>
        ),
        loader: ({ params }) =>
          fetch(
            `http://localhost:5000/details/${params.id}`
          ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
