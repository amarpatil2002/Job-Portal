import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import ApplyJob from "./Pages/ApplyJob";
import Applications from "./Pages/Applications";
import PageNotFound from "./Pages/PageNotFound";
import AppContextProvider from "./context/AppContext";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      children: [
        // protected route
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
    {
      path:"*",
      element:<PageNotFound />
    }
  ]);

  return (
    <AppContextProvider>
      <RouterProvider router={router} />
    </AppContextProvider>
  );
}

export default App;
