import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Providers from "./providers";

// Routes
import Root, { loader as rootLoader } from "./routes/Root.tsx";
import Home from "./routes/Home.tsx";
import Message from "./routes/Messsage.tsx";
import Notification from "./routes/Notification.tsx";
import Profile from "./routes/Profile.tsx";
import Login from "./routes/Login.tsx"; // loader as loginLoader, // action as loginAction,
import Signup from "./routes/Signup.tsx";
import Search from "./routes/Search.tsx";
import Test, { loader as testLoader } from "./routes/Test.tsx";

// Api
import { usersAction, usersLoader } from "./api/users.ts";
import { postsAction, postsLoader } from "./api/posts.ts";
import { loginAction } from "./api/login.ts";
import { profileLoader } from "./api/loaders/profile.ts";

// Misc
import "./styles.scss";
import { profileAction } from "./api/actions/profile.ts";

const router = createBrowserRouter([
  {
    path: "/test",
    element: <Test />,
    loader: testLoader,
  },
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/message",
        element: <Message />,
      },
      {
        path: "/notification",
        element: <Notification />,
      },
      {
        path: "/profile/:usernameOrId",
        element: <Profile />,
        loader: profileLoader,
        action: profileAction,
      },
      {
        path: "/search",
        element: <Search />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    action: loginAction,
    loader: postsLoader,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/users",
    element: <div>usersdfsdfs</div>,
    action: usersAction,
    loader: usersLoader,
  },
  {
    path: "/posts",
    action: postsAction,
  },
]);

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <Providers>
    <RouterProvider router={router} />
  </Providers>
);
