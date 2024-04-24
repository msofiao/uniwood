import { useContext, useEffect, useState } from "react";
import axiosClient from "../utils/axios";
import {
  Avatar,
  Box,
  MenuItem,
  Tab,
  TextField,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Nav from "../components/Nav";
import { NavigateFunction, useLoaderData, useNavigate } from "react-router-dom";
import { SearchRounded } from "@mui/icons-material";
import { UserInfoContext } from "../providers/UserInfoProvider";
import { TokenContext } from "../providers/TokenProvider";
import { socketClient } from "../utils/socketIO";
import { convoDateFormat } from "../utils/dateTools";
import dateUtil from "date-and-time";

export default function Notification() {
  const theme = useTheme();
  const { userInfoResponse, refreshTokenResponse } = useLoaderData() as {
    userInfoResponse: UserInfoResponseData;
    refreshTokenResponse: RefreshTokenResponseData;
  };
  const { setUserInfo } = useContext(UserInfoContext)!;
  const { accessToken, setAccessToken } = useContext(TokenContext)!;

  const initializeUserIdentity = () => {
    setUserInfo(userInfoResponse);
    setAccessToken(refreshTokenResponse.accessToken);
    localStorage.setItem("accessToken", refreshTokenResponse.accessToken);
    localStorage.setItem("id", refreshTokenResponse.id);
  };

  useEffect(initializeUserIdentity, [
    userInfoResponse,
    refreshTokenResponse,
    accessToken,
  ]);
  return (
    <NotificationLayout>
      <Nav />
      <div className="border-x-solid w-full border-2 border-slate-200">
        <Header />
        <NotifTab />
      </div>
      <RightSection theme={theme} />
    </NotificationLayout>
  );
}

function Header() {
  return (
    <p className="mb-3 ml-4  mt-5 font-header text-2xl text-slate-800">
      Notifications
    </p>
  );
}

function NotifTab() {
  const { accessToken } = useContext(TokenContext)!;
  const { userInfo } = useContext(UserInfoContext)!;
  const [tabIndex, setTabIndex] = useState("1");
  const [notifications, setNotifications] = useState<INotifSocketPayload[]>([]);

  const navigate = useNavigate();
  const handleTabChange = (e: React.SyntheticEvent, newValue: string) => {
    setTabIndex(newValue);
  };

  const listenToNotification = () => {
    socketClient.on(
      `notification/${userInfo.id}`,
      (payload: INotifSocketPayload) => {
        setNotifications([payload, ...notifications]);
      },
    );
  };
  const initializeNotifications = () => {
    if (!accessToken) return;
    axiosClient
      .get("/notifications", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setNotifications(res.data.data);
      });
  };

  let latestDate: Date;
  let dateReference: "TODAY" | "THIS WEEK" | "EARLIER" | null = null;

  const DateReferencer = ({ notifDate }: { notifDate: string }) => {
    if (dateReference === null) {
      latestDate = new Date(notifDate);
    }

    const dateDiffByHours = dateUtil
      .subtract(new Date(notifDate), latestDate)
      .toHours();

    if (dateDiffByHours < 24 && dateReference !== "TODAY") {
      dateReference = "TODAY";
      return (
        <p className="text-header test-slate-800 mb-2 ml-6 mt-4 text-2xl">
          Today
        </p>
      );
    } else if (dateDiffByHours > 24 && dateReference !== "THIS WEEK") {
      dateReference = "THIS WEEK";
      return (
        <p className="text-header test-slate-800 mb-2 ml-6 mt-4 text-2xl">
          This Week
        </p>
      );
    } else if (dateDiffByHours > 24 * 7 && dateReference !== "EARLIER") {
      dateReference = "EARLIER";
      return (
        <p className="text-header test-slate-800 mb-2 ml-6 mt-4 text-2xl">
          Earlier
        </p>
      );
    } else return <></>;
  };
  const NotifElemeGenerator = (notif: INotifSocketPayload) => {
    if (notif.type === "POST_REACT") {
      return (
        <>
          <DateReferencer
            key={`date/${notif.id}`}
            notifDate={notif.createdAt}
          />
          <LikedPost
            key={`notif/${notif.id}`}
            notif={notif}
            navigate={navigate}
          />
        </>
      );
    } else if (notif.type === "POST_COMMENT") {
      return (
        <>
          <DateReferencer
            key={`date/${notif.id}`}
            notifDate={notif.createdAt}
          />
          <CommentedPost
            key={`notif/${notif.id}`}
            notif={notif}
            navigate={navigate}
          />
        </>
      );
    }
  };

  useEffect(initializeNotifications, [accessToken]);
  useEffect(listenToNotification, [accessToken]);

  return (
    <TabContext value={tabIndex}>
      <TabList onChange={handleTabChange}>
        <Tab className="w-1/2 font-bold normal-case" label="All" value="1" />
        <Tab
          className="w-1/2 font-bold normal-case"
          label="Following"
          value="2"
        />
      </TabList>
      <TabPanel value="1" className="flex flex-col px-0 pt-0">
        {notifications.map(NotifElemeGenerator)}
      </TabPanel>
      <TabPanel value="2">Following</TabPanel>
    </TabContext>
  );
  4;
}

function LikedPost({ notif, navigate }: NotifElemProps) {
  const navToPost = () => {
    navigate(`/post/${notif.post_id!}`);
  };

  return (
    <div
      onClick={navToPost}
      className="flex items-center gap-4 px-10 py-4 hover:cursor-pointer hover:bg-gray-200"
    >
      <Avatar src={notif.notifBy.fullname} className="size-12" />
      <div className="flex flex-col justify-center gap-1">
        <p className="gap-1 font-body text-base text-slate-800">
          <span className="font-bold">{notif.notifBy.fullname} </span>
          liked your post
        </p>
        <p className="font-body text-xs text-slate-600">
          {convoDateFormat(notif.createdAt)}
        </p>
      </div>
    </div>
  );
}

function CommentedPost({ notif, navigate }: NotifElemProps) {
  const navToToPost = () => {
    navigate(`/post/${notif.post_id!}?commentId=${notif.comment_id!}`);
  };
  return (
    <div
      onClick={navToToPost}
      className="flex items-center gap-4 px-10 py-4 hover:cursor-pointer hover:bg-gray-200"
    >
      <Avatar src={notif.notifBy.fullname} className="size-12 " />
      <div className="flex flex-col justify-center gap-1 ">
        <p className="h font-body text-base text-slate-800">
          <span className="font-bold">{notif.notifBy.fullname} </span>
          commented on your post
        </p>
        <p className="font-body text-xs text-slate-600">
          {convoDateFormat(notif.createdAt)}
        </p>
      </div>
    </div>
  );
}

function FollowedYou({ notif, navigate }: NotifElemProps) {
  const navToFollower = () => {
    navigate(`/user/${notif.notifFrom_id}`);
  };
  return (
    <div
      onClick={navToFollower}
      className="flex items-center gap-4 px-10 py-4 hover:cursor-pointer hover:bg-gray-200"
    >
      <Avatar src={notif.notifBy.pfp} className="size-12 " />
      <div className="flex flex-col justify-center gap-1">
        <p className="font-body text-base text-slate-800">
          <span className="font-bold">{notif.notifBy.fullname}</span>
          Started folllowing you
        </p>
        <p className="font-body text-xs text-slate-600">
          {convoDateFormat(notif.createdAt)}
        </p>
      </div>
    </div>
  );
}

function NotificationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid w-[1150px] grid-cols-[350px_1fr_350px]">
      {children}
    </div>
  );
}

function RightSection({ theme: theme }: { theme: Theme }) {
  const [, setSearch] = useState("");
  const navigate = useNavigate();
  return (
    <section className="relative flex flex-col justify-center gap-7 px-5">
      <TextField
        className="justify-start rounded-full bg-white"
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
    <div className="rounded-xl border-2 border-solid border-slate-200 bg-white pb-4">
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
    <div className="rounded-lg border-2 border-solid border-slate-200 bg-white">
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

interface NotifElemProps {
  notif: INotifSocketPayload;
  navigate: NavigateFunction;
}
