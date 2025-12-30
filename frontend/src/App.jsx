import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ApplyJob from "./Pages/Candidate/ApplyJob";
import Applications from "./Pages/Candidate/Applications";
import PageNotFound from "./Pages/PageNotFound";
import AppContextProvider from "./context/AppContext";
import LandingPage from "./Pages/LandingPage";
import ProtectedRoutes from "./Pages/ProtectedRoutes/ProtectedRoutes";
import PublicRoutes from "./Pages/PublicRoutes/PublicRoutes";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Dashboard from "./Pages/Dashboard/Dashboard";
import ForgotPassword from "./Pages/Auth/ForgotPassword";

function App() {
  const router = createBrowserRouter([
    // public route
    {
      element: <PublicRoutes />,
      children: [
        {
          path: "/",
          element: <LandingPage />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path:'/forgot-password',
          element:<ForgotPassword />
        }
      ],
    },

    // protected route
    {
      element: <ProtectedRoutes />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "/apply-job/:id",
          element: <ApplyJob />,
        },
        {
          path: "/applications",
          element: <Applications />,
        },
      ],
    },
    //page not found
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);

  return (
    <AppContextProvider>
      <RouterProvider router={router} />
    </AppContextProvider>
  );
}

export default App;
