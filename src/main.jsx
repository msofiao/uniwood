import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Home from "./routes/Home"
import Messenger from "./routes/Messenger";
import MessengerInfo from "./routes/MessageInfo"
import Conversation from "./routes/Conversation";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/conversation",
    element: <Conversation />,
  },
  {
    path: "/messenger",
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