import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Messenger from "./routes/Messenger";
import MessengerInfo from "./routes/MessageInfo"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Messenger />,
  },

  {
    path: "/info",
    element: <MessengerInfo />,
  },
  
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);