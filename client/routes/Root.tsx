import {
  Avatar,
  Box,
  Button,
  ListItemIcon,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  HomeOutlined,
  PersonOutline,
  HomeRounded,
  NotificationsRounded,
  MessageOutlined,
  SearchRounded,
  MessageRounded,
  NotificationsOutlined,
  PersonRounded,
  LogoutRounded,
} from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import {
  Outlet,
  redirect,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { PosterModal } from "../components/Poster";
import Cookie from "js-cookie";
import { TokenContext } from "../providers/TokenProvider";
import { sendRefreshTokenRequest, sendUserInfoRequest } from "../utils";
import { UserInfoContext } from "../providers/UserInfoProvider";
import axiosClient from "../utils/axios";

export async function loader() {
  const refreshTokenResponse = await sendRefreshTokenRequest();
  const userInfoResponse = await sendUserInfoRequest(
    localStorage.getItem("id") as string,
  );

  if (
    refreshTokenResponse?.status === "success" &&
    userInfoResponse?.status === "success" &&
    userInfoResponse?.data.id === localStorage.getItem("id")
  ) {
    localStorage.setItem("accessToken", refreshTokenResponse.accessToken);
  } else {
    console.error({ userInfoResponse, refreshTokenResponse });
    return redirect("/login");
  }
  return { userInfoResponse: userInfoResponse.data, refreshTokenResponse };
}

export default function Root() {
  const theme = useTheme();
  const { setUserInfo } = useContext(UserInfoContext) as UserInfoContextProps;
  const { userInfoResponse, refreshTokenResponse } = useLoaderData() as {
    userInfoResponse: UserInfoResponseData;
    refreshTokenResponse: RefreshTokenResponseData;
  };
  const { setAccessToken } = useContext(TokenContext) as TokenContextProps;
  // const match = useRouteMatch()

  // Utilities
  const handleUserAuthentication = () => {
    setUserInfo({
      fullname: userInfoResponse.fullname,
      pfp: userInfoResponse.pfp,
      username: userInfoResponse.username,
      address: userInfoResponse.address,
      bio: userInfoResponse.bio,
      id: userInfoResponse.id,
      cover: userInfoResponse.cover,
      affiliation: userInfoResponse.affiliation,
    });
    setAccessToken(refreshTokenResponse.accessToken);
    localStorage.setItem("accessToken", refreshTokenResponse.accessToken);
  };

  useEffect(handleUserAuthentication, [userInfoResponse, refreshTokenResponse]);
  return (
    <div className="root">
      <main>
        <Outlet />
      </main>
      <Nav />
      <RightSection theme={theme} />
    </div>
  );
}

function Nav() {
  const [focusState, setFocusState] = useState({
    home: true,
    messages: false,
    notifications: false,
    profile: false,
  });
  const [posterModalView, setPosterModalView] = useState(false);
  const { userInfo } = useContext(UserInfoContext)!;
  const navigate = useNavigate();
  const location = useLocation();

  const handleUrlParamsChange = () => {
    if (location.pathname.startsWith("/message")) {
      handleFocus("messages");
    } else if (location.pathname.startsWith("/notification")) {
      handleFocus("notifications");
    } else if (location.pathname.startsWith("/profile")) {
      handleFocus("profile");
    } else if (location.pathname === "/") {
      handleFocus("home");
    } else {
      setFocusState({
        home: false,
        messages: false,
        notifications: false,
        profile: false,
      });
    }
  };
  console.log("Root Rendered");
  useEffect(handleUrlParamsChange, [location]);

  // utilities
  const handleFocus = (buttonName: string) => {
    let newFocusState: any = {};
    for (let key in focusState) {
      if (key === buttonName) {
        newFocusState[key] = true;
      } else {
        newFocusState[key] = false;
      }
    }
    setFocusState(newFocusState);
  };

  return (
    <nav>
      <img
        className="logo"
        src={`${process.env.SERVER_PUBLIC}/assets/logo_label.svg`}
        alt="logo"
      />
      <div className="nav-container">
        <MenuItem
          className="nav-item"
          onClick={() => {
            navigate("/");
          }}
          selected={focusState.home ? true : false}
        >
          <ListItemIcon className="icon">
            {focusState.home ? <HomeRounded /> : <HomeOutlined />}
          </ListItemIcon>
          <Typography
            fontWeight={focusState.home ? "900" : "normal"}
            variant="body1"
          >
            Home
          </Typography>
        </MenuItem>
        <MenuItem
          className="nav-item"
          onClick={() => {
            navigate("/message");
          }}
          selected={focusState.messages ? true : false}
        >
          <ListItemIcon className="icon">
            {focusState.messages ? <MessageRounded /> : <MessageOutlined />}
          </ListItemIcon>
          <Typography
            variant="body1"
            fontWeight={focusState.messages ? "900" : "normal"}
          >
            Messages
          </Typography>
        </MenuItem>
        <MenuItem
          className="nav-item"
          onClick={() => {
            navigate("/notification");
          }}
          selected={focusState.notifications ? true : false}
        >
          <ListItemIcon className="icon">
            {focusState.notifications ? (
              <NotificationsRounded />
            ) : (
              <NotificationsOutlined />
            )}
          </ListItemIcon>
          <Typography
            variant="body1"
            fontWeight={focusState.notifications ? "900" : "normal"}
          >
            Notifications
          </Typography>
        </MenuItem>
        <MenuItem
          className="nav-item"
          onClick={() => {
            navigate(`/profile/${userInfo.username}`);
          }}
          selected={focusState.profile ? true : false}
        >
          <ListItemIcon className="icon">
            {focusState.profile ? <PersonRounded /> : <PersonOutline />}
          </ListItemIcon>
          <Typography
            variant="body1"
            fontWeight={focusState.profile ? "900" : "normal"}
          >
            Profile
          </Typography>
        </MenuItem>
      </div>
      <Button
        className="button"
        variant="contained"
        fullWidth
        onClick={() => setPosterModalView(true)}
      >
        Post
      </Button>
      <AvatarNav />
      <PosterModal
        postModalView={posterModalView}
        setPostModalView={setPosterModalView}
      />
    </nav>
  );
}
function RightSection({ theme: theme }: { theme: Theme }) {
  const [, setSearch] = useState("");
  const navigate = useNavigate();
  return (
    <section>
      <TextField
        className="search-bar"
        placeholder="Search"
        fullWidth
        InputProps={{
          startAdornment: <SearchRounded sx={{ marginRight: "15px" }} />,
          sx: { borderRadius: "25px", height: "45px", paddingLeft: "20px" },
          onKeyDown: (e) => {
            if (e.key === "Enter") {
              navigate(`/search?q=${e.currentTarget.value}`);
            }
          },
        }}
        onChange={(e) => setSearch(e.target.value)}
        variant="outlined"
        name="search"
      />
      <SuggestedAccount theme={theme} />
      <Trends theme={theme} />
    </section>
  );
}
function Trends({ theme: theme }: { theme: Theme }) {
  const [tags, setTags] = useState<Record<string, number> | null>(null);
  const loaderData = useLoaderData();
  const navigate = useNavigate();

  const handleDataInitialization = () => {
    axiosClient
      .get("/posts/topTags?count=5", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => setTags(res.data.data));
  };
  const handleNavigate = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    return navigate(`/search?q=${e.currentTarget.id}`);
  };
  useEffect(handleDataInitialization, [loaderData]);

  return (
    <div className="trends-container">
      <Typography
        variant="h5"
        fontFamily={"Montserrat"}
        fontWeight={"900"}
        color={theme.palette.text.primary}
        paddingTop={"18px"}
        paddingLeft={"18px"}
        marginBottom={"10px"}
      >
        Top Trends
      </Typography>

      {tags &&
        Object.entries(tags).map(([tag, count]) => (
          <MenuItem
            id={tag}
            className="trends"
            onClick={handleNavigate}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography className="header" variant="body1">
              #{tag}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              {count} posts
            </Typography>
          </MenuItem>
        ))}
    </div>
  );
}
function SuggestedAccount({ theme: theme }: { theme: Theme }) {
  const loaderData = useLoaderData();
  const [newUsers, setNewUses] = useState<Author[] | null>(null);
  const navigate = useNavigate();

  const handleDataInitialization = () => {
    axiosClient
      .get("/users/newUsers?count=3", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setNewUses(res.data.data);
      });
  };
  const handleNavigate = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) =>
    navigate(`/profile/${e.currentTarget.id}`);

  useEffect(handleDataInitialization, [loaderData]);
  return (
    <div className="suggested-account-container">
      <Typography
        variant="h5"
        fontFamily={"Montserrat"}
        fontWeight={"900"}
        color={theme.palette.text.primary}
        paddingTop={"18px"}
        paddingLeft={"18px"}
        marginBottom={"10px"}
      >
        New Users
      </Typography>

      {newUsers &&
        newUsers.map((user) => (
          <MenuItem
            className="suggested-account"
            id={user.id}
            onClick={handleNavigate}
          >
            <Avatar
              className="avatar"
              src={`${process.env.SERVER_PUBLIC}/${user.pfp}`}
              sx={{ display: "inline-block", marginRight: "10px" }}
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography className="body1" variant="body1" fontSize={"15px"}>
                {user.fullname}
              </Typography>
              <Typography
                className="subtitle1"
                sx={{ color: theme.palette.text.secondary }}
              >
                @{user.username}
              </Typography>
            </Box>
          </MenuItem>
        ))}
    </div>
  );
}
function AvatarNav() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { userInfo } = useContext(UserInfoContext)!;

  // utilities
  const handleToggleOpen = () => {
    setOpen(!open);
  };
  return (
    <MenuItem
      className="avatar-nav-container"
      selected={open}
      onClick={handleToggleOpen}
    >
      <Avatar
        className="avatar"
        src={`${process.env.SERVER_PUBLIC}/${userInfo.pfp}`}
        sx={{
          display: "inline-block",
          marginRight: "10px",
          border: "2px solid red ",
        }}
      />
      <div className="avatar-details">
        <Typography
          color={theme.palette.text.primary}
          fontSize="14px"
          fontWeight="bold"
          className="name"
        >
          {userInfo.fullname}
        </Typography>
        <Typography
          fontSize="16px"
          color={theme.palette.text.secondary}
          className="username"
          variant="body2"
        >
          {userInfo.username}
        </Typography>
      </div>
      {open ? (
        <MenuItem
          className="pop-up"
          sx={{ borderRadius: "15px" }}
          onClick={() => {
            Cookie.remove("refresh_token");
            localStorage.clear();
            navigate("/login");
          }}
        >
          <Paper
            elevation={5}
            className="paper-shadow"
            sx={{
              ":hover": {
                backgroundColor: theme.palette.action.hover,
                cursor: "pointer",
              },
            }}
          >
            <Typography>Logout</Typography>
          </Paper>
          <LogoutRounded
            className="logout-icon"
            sx={{ color: theme.palette.text.primary }}
          />
        </MenuItem>
      ) : null}
    </MenuItem>
  );
}
