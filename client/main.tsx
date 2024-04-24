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
import Search from "./routes/Search.tsx";
import Test from "./routes/Test.tsx";

// Api
import { usersAction, usersLoader } from "./api/users.ts";
import { postsAction, postsLoader } from "./api/posts.ts";
import { loginAction } from "./api/login.ts";
import { profileLoader } from "./api/loaders/profile.ts";
import { loader as messageLoader } from "./api/loaders/message.ts";
import {loader as notificationLoader} from "./api/loaders/notification.ts";

// Misc
import "./styles.scss";
import { profileAction } from "./api/actions/profile.ts";
import Conversation from "./components/Conversation.tsx";
import MessageIndex from "./components/MessageIndex.tsx";
import Post from "./routes/Post.tsx";

const router = createBrowserRouter([
  {
    path: "/test",
    element: <Test />,
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
        path: "/profile/:usernameOrId",
        element: <Profile />,
        loader: profileLoader,
        action: profileAction,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/post/:postId",
        element: <Post />
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
    action: loginAction,
    loader: postsLoader,
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
  {
    path: "/message",
    element: <Message />,
    loader: messageLoader,
  },
  {
    path: "/message/:converseId",
    element: <Message />,
    loader: messageLoader,
  },
  {
    path: "/message/new/:recipientId",
    element: <Message />,
    loader: messageLoader,
  },
  {
    path: "/notification",
    element: <Notification />,
    loader: notificationLoader,
  },
]);

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <Providers>
    <RouterProvider router={router} />
  </Providers>,
);
