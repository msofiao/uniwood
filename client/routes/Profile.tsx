import {
  Avatar,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  SelectChangeEvent,
  Tab,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useState,
} from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Post from "../components/Post.tsx";
import Poster, { PosterModal } from "../components/Poster";
import {
  CloseRounded,
  EditRounded,
  EmailRounded,
  LocationOnOutlined,
  LocationOnRounded,
} from "@mui/icons-material";
import axiosClient from "../utils/axios";
import {
  Form,
  NavigateFunction,
  useActionData,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import { stringToConstant } from "../utils/stringFormatters.ts";
import { UserInfoContext } from "../providers/UserInfoProvider.tsx";
import { AlertContext } from "../providers/AlertProvider.tsx";
import { TokenContext } from "../providers/TokenProvider.tsx";

const ProfileContext = createContext<null | ProfileContext>(null);
export default function Profile() {
  const [userProfileInfo, setUserProfileInfo] =
    useState<UserProfileInfo | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  const loaderData = useLoaderData() as any;

  const initializeContextdata = () => {
    setUserProfileInfo(loaderData.userProfileInfo);
    setUserPosts(loaderData.userPosts);
  };
  useEffect(initializeContextdata, [loaderData]);

  return (
    <ProfileContext.Provider
      value={{ userProfileInfo, setUserProfileInfo, userPosts, setUserPosts }}
    >
      <div className="profile">
        <UserProfileContent />
        <Section />
      </div>
    </ProfileContext.Provider>
  );
}
function Section() {
  const { userPosts, userProfileInfo } = useContext(ProfileContext)!;
  const [tabIndex, setTabIndex] = useState("3");
  const [postModalView, setPostModalView] = useState(false);
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabIndex(newValue);
  };

  const loading = userPosts === null || userProfileInfo === null;

  return loading ? (
    <p>Loading...</p>
  ) : (
    <section className="main-content">
      <TabContext value={tabIndex}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList className="tab-list" onChange={handleTabChange}>
            <Tab label="Posts" value="1" />
            <Tab label="Details" value="2" />
            <Tab label="Followers" value="3" />
            <Tab label="Following" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Poster setPostModalView={setPostModalView} />
          {userPosts.map((post) => {
            return <Post postParam={post} />;
          })}
        </TabPanel>
        <TabPanel value="2">
          <UserDetail />
        </TabPanel>
        <TabPanel className="min-h-100%" value="3">
          <FollowerList />
        </TabPanel>
        <TabPanel value="4">
          <FollowingList />
        </TabPanel>
      </TabContext>
      <PosterModal
        postModalView={postModalView}
        setPostModalView={setPostModalView}
      />
    </section>
  );
}

function UserDetail() {
  const { userProfileInfo } = useContext(ProfileContext)!;
  return (
    <Paper className="detail-section">
      <div className="field-container">
        <Typography className="label">Name: </Typography>
        <Typography className="value">{userProfileInfo?.fullname}</Typography>
      </div>
      <div className="field-container">
        <Typography className="label">Username: </Typography>
        <Typography className="value">@{userProfileInfo?.username}</Typography>
      </div>
      <div className="field-container">
        <Typography className="label">Bio: </Typography>
        <Typography className="value">{userProfileInfo?.bio}</Typography>
      </div>
      <div className="field-container">
        <Typography className="label">Gender: </Typography>
        <Typography className="value">{userProfileInfo?.gender}</Typography>
      </div>
      <div className="field-container">
        <Typography className="label">Address: </Typography>
        <Typography className="value">{userProfileInfo?.address}</Typography>
      </div>
      <div className="field-container">
        <Typography className="label">Affiliation: </Typography>
        <Typography className="value">
          {userProfileInfo?.affiliation}
        </Typography>
      </div>
      <div className="field-container">
        <Typography className="label">Birth date: </Typography>
        <Typography className="value">
          {
            new Date(userProfileInfo?.dateOfBirth as string)
              .toISOString()
              .split("T")[0]
          }
        </Typography>
      </div>
    </Paper>
  );
}
function UserProfileContent() {
  const navigate = useNavigate();
  const [followed, setFollowed] = useState<boolean | null>(null);
  const [editProfileModalView, setEditProfileModalView] = useState(false);

  const { userProfileInfo, setUserProfileInfo } = useContext(ProfileContext)!;
  const { accessToken } = useContext(TokenContext)!;

  const checkIfUserIsFollowed = () => {
    if (!accessToken || !userProfileInfo) return;
    axiosClient
      .get(`/users/verifyIfFollowed?targetUser=${userProfileInfo.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setFollowed(res.data.data.isFollowed);
      })
      .catch((err) => {
        if (err.response.status === 404) setFollowed(false);
      });
    console.log({ followed });
  };
  const followToggle = () => {
    if (!userProfileInfo || !accessToken) return;
    if (followed) {
      axiosClient
        .patch(
          `/users/unfollow?userId=${userProfileInfo.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .then((res) => {
          if (res.status === 200) {
            setFollowed(false);
            setUserProfileInfo({
              ...userProfileInfo,
              followersCount: Number(userProfileInfo.followersCount) - 1,
            });
          }
        });
    } else {
      axiosClient
        .patch(
          `/users/follow?userId=${userProfileInfo?.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .then((res) => {
          console.log({ userProfileInfo });
          if (res.status === 200) {
            setFollowed(true);
            setUserProfileInfo({
              ...userProfileInfo,
              followersCount: Number(userProfileInfo?.followersCount + 1),
            });
          }
        });
    }
  };
  const navToMessage = () => {
    if (!accessToken) return;
    axiosClient
      .get(`/converse/search?recipientId=${userProfileInfo?.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        navigate(`/message/${res.data.data.converseId}`); //
      })
      .catch((err) => {
        console.log(err.response);

        navigate(`/message/new/${userProfileInfo?.id}`); //
      });
  };

  const FollowtoggleBtn = () => {
    if (localStorage.getItem("id") !== userProfileInfo?.id) {
      return (
        <Button
          className="  rounded-full px-9 py-2 font-semibold normal-case text-white"
          color={"secondary"}
          variant="contained"
          onClick={followToggle}
        >
          {followed ? "Unfollow" : "Follow"}
        </Button>
      );
    } else return <></>;
  };

  const ProfileEditBtn = () => {
    if (localStorage.getItem("id") === userProfileInfo?.id) {
      return (
        <Button
          color={"secondary"}
          variant="contained"
          sx={{ textTransform: "none", color: "#fff" }}
          onClick={() => setEditProfileModalView(true)}
        >
          Edit profile
        </Button>
      );
    } else return <></>;
  };

  useEffect(checkIfUserIsFollowed, [accessToken]);
  return (
    <div className="user-profile-container">
      <div className="user-images">
        <img
          className="profile-cover"
          src={`${process.env.SERVER_PUBLIC}/${userProfileInfo?.cover}`}
        />
        <Avatar
          className="avatar"
          src={`${process.env.SERVER_PUBLIC}/${userProfileInfo?.pfp}`}
        />
        <div className="absolute right-6 mt-6 flex gap-2">
          {localStorage.getItem("id") !== userProfileInfo?.id && (
            <Tooltip title="Send Message" placement="top">
              <IconButton className="text-secondary-400" onClick={navToMessage}>
                <EmailRounded />
              </IconButton>
            </Tooltip>
          )}
          <FollowtoggleBtn />
          <ProfileEditBtn />
        </div>
      </div>
      <div className="px-4">
        <p className="font-body text-lg font-bold text-slate-800">
          {userProfileInfo?.fullname}
        </p>
        <p className="text-base text-slate-500">@{userProfileInfo?.username}</p>
        <p className="mt-1 text-base text-slate-800">{userProfileInfo?.bio}</p>
        <div></div>
        <div className="mt-2 flex gap-3">
          <p className="text-base text-slate-600 hover:cursor-pointer hover:underline">
            <span className="text-base font-bold text-slate-800">
              {userProfileInfo?.followersCount}
            </span>{" "}
            Followers
          </p>
          <p className="font-bodt text-base text-slate-600 hover:cursor-pointer hover:underline">
            <span className="text-base font-bold text-slate-800">
              {userProfileInfo?.followingCount}
            </span>{" "}
            Following
          </p>
        </div>
      </div>
      <EditProfileModal
        editProfileModalView={editProfileModalView}
        setEditProfileModalView={setEditProfileModalView}
      />
    </div>
  );
}
function EditProfileModal({
  editProfileModalView,
  setEditProfileModalView,
}: {
  editProfileModalView: boolean;
  setEditProfileModalView: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [userImageInfo, setUserImageInfo] = useState<{
    cover: {
      id: null | string;
      imageString: null | string;
      imageFile: null | File;
    };
    pfp: {
      id: null | string;
      imageString: null | string;
      imageFile: null | File;
    };
  }>({
    cover: {
      id: null,
      imageString: null,
      imageFile: null,
    },
    pfp: {
      id: null,
      imageString: null,
      imageFile: null,
    },
  });

  const [userRawInfo, setUserRawInfo] = useState<UserRawInfo | null>(null);
  const navigate = useNavigate();
  const { usernameOrId } = useParams();
  const { userInfo } = useContext(UserInfoContext)!;
  const actionData = useActionData() as any;
  const { setAlert } = useContext(AlertContext);
  const initializeFields = () => {
    axiosClient
      .get(`/users/raw/${usernameOrId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => setUserRawInfo(res.data.data))
      .catch(console.error);
  };
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>,
  ) => {
    setUserRawInfo({ ...userRawInfo!, [e.target.name]: e.target.value });
  };
  const handleEditProfileModalView = (value: "close" | "open") => {
    return (_e: any) => setEditProfileModalView(value === "open");
  };
  const handleUpdatStatusAlert = () => {
    if (actionData?.status === "success") {
      setAlert({
        severity: "success",
        message: "Profile Updated",
        visible: false,
      });
    } else if (actionData?.status === "fail") {
      setAlert({
        severity: "error",
        message: "Profile Update Failed",
        visible: false,
      });
    }
    setEditProfileModalView(false);
  };

  useEffect(initializeFields, []);
  useEffect(handleUpdatStatusAlert, [actionData]);
  return (
    userRawInfo && (
      <Modal
        className="profile-modals"
        open={editProfileModalView}
        onClose={handleEditProfileModalView("close")}
      >
        <Form
          className="edit-profile-modal"
          action={`/profile/${usernameOrId}`}
          method="PUT"
          encType="multipart/form-data"
        >
          <div className="header-container">
            <IconButton
              className="icon-container"
              onClick={handleEditProfileModalView("close")}
            >
              <CloseRounded className="icon" />
            </IconButton>
            <Typography className="name" variant="h5">
              {userInfo.fullname}
            </Typography>
            {userRawInfo.id === localStorage.getItem("id") && (
              <Button
                type="submit"
                className="button"
                variant="contained"
                color="secondary"
                sx={{ color: "#ffffff" }}
              >
                Save
              </Button>
            )}
          </div>
          <div className="images-container">
            <IconButton
              className="cover-icon-container"
              sx={{
                borderRadius: 0,
                "&:hover": { backgroundColor: "rgba(0,0,0, .4)" },
              }}
            >
              <label htmlFor="edit-profile-cover" className="cover-label">
                <EditRounded className="icon" sx={{ color: "#fff" }} />
              </label>
              <input
                id="edit-profile-cover"
                type="file"
                hidden
                accept="image/*"
                name="cover"
                onChange={(e) => {
                  if (
                    e.target.files === null ||
                    !(e.target.files[0] instanceof File)
                  )
                    return;

                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onload = () => {
                    setUserImageInfo({
                      ...userImageInfo,
                      cover: {
                        id: "cover",
                        imageString: reader.result as string,
                        imageFile: file,
                      },
                    });
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </IconButton>
            <img
              className="cover"
              src={
                userImageInfo.cover.imageString ??
                `${process.env.SERVER_PUBLIC}/${userRawInfo.cover}`
              }
            />
            <div className="avatar-container">
              <Avatar
                className="avatar"
                src={
                  userImageInfo.pfp.imageString ??
                  `${process.env.SERVER_PUBLIC}/${userRawInfo.pfp}`
                }
              />
              <IconButton
                className="icon-container"
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                  },
                }}
              >
                <label htmlFor="edit-profile-pfp" className="pfp-label">
                  <EditRounded className="icon" sx={{ color: "#fff" }} />
                </label>
                <input
                  id="edit-profile-pfp"
                  type="file"
                  hidden
                  accept="image/*"
                  name="pfp"
                  onChange={(e) => {
                    if (
                      e.target.files === null ||
                      !(e.target.files[0] instanceof File)
                    )
                      return;

                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = () => {
                      setUserImageInfo({
                        ...userImageInfo,
                        pfp: {
                          id: "pfp",
                          imageString: reader.result as string,
                          imageFile: file,
                        },
                      });
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </IconButton>
            </div>
          </div>
          <div className="input-container">
            <input hidden name="id" defaultValue={userRawInfo.id} />
            <TextField
              name="firstname"
              label="First Name"
              required
              value={userRawInfo.firstname}
              onChange={handleInputChange}
            />
            <TextField
              name="midlename"
              label="Middle Name"
              required
              value={userRawInfo.middlename}
              onChange={handleInputChange}
            />
            <TextField
              name="lastname"
              label="Last Name"
              required
              value={userRawInfo.lastname}
              onChange={handleInputChange}
            />
            <TextField
              name="bio"
              label="Bio"
              required
              value={userRawInfo.bio}
              onChange={handleInputChange}
            />
            <TextField
              name="dateOfBirth"
              label="Date of Birth"
              type="date"
              required
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleInputChange}
              defaultValue={userRawInfo.dateOfBirth?.split("T")[0]}
            />
            <TextField
              name="barangay"
              label="Municipality"
              required
              value={userRawInfo.barangay}
              onChange={handleInputChange}
            />
            <TextField
              name="municipality"
              label="Municipality"
              required
              value={userRawInfo.municipality}
              onChange={handleInputChange}
            />
            <TextField
              name="Province"
              label="province"
              required
              value={userRawInfo.province}
              onChange={handleInputChange}
            />
            {/* <FormControl fullWidth>
              <InputLabel id="edit-profile-proffeciency">
                Proffeciency
              </InputLabel>
              <Select
                labelId="edit-profile-proffeciency"
                label="Proffecienct"
                value={userRawInfo}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, proffeciency: e.target.value })
                }
              >
                <MenuItem
                  selected={userInfo.proffeciency === "NEWBIE"}
                  value="NEWBIE"
                >
                  Newbie
                </MenuItem>
                <MenuItem
                  selected={userInfo.proffeciency === "NOVICE"}
                  value="NOVICE"
                >
                  Novice
                </MenuItem>
                <MenuItem
                  selected={userInfo.proffeciency === "EXPERT"}
                  value="EXPERT"
                >
                  Expert
                </MenuItem>
              </Select>
            </FormControl> */}
            <FormControl fullWidth>
              <InputLabel id="edit-profile-affiliation">Affiliation</InputLabel>
              <Select
                defaultValue={stringToConstant(userRawInfo.affiliation)}
                labelId="edit-profile-affiliation"
                label="Affiliation"
                // value={userRawInfo.affiliation}
                onChange={handleInputChange}
                name="affiliation"
              >
                <MenuItem value="WOOD_ENTHUSIAST">Wood Ethusiast</MenuItem>
                <MenuItem
                  // selected={userInfo.affiliation === "WOOD_WORKER"}
                  value="WOOD_WORKER"
                >
                  Woodworker
                </MenuItem>
                <MenuItem
                  // selected={userInfo.affiliation === "WOOD_CRAFTER"}
                  value="WOOD_CRAFTER"
                >
                  Wood Crafter
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="edit-profile-gender">Gender</InputLabel>
              <Select
                defaultValue={stringToConstant(userRawInfo.gender)}
                labelId="edit-profile-gender"
                label="Gender"
                name="gender"
              >
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Form>
      </Modal>
    )
  );
}

// function FollwerListTab({ modalView, setModalView }: ModalViewProps) {
//   const [followers, setFollowers] = useState<PostAuthor[]>([]);
//   const { userProfileInfo } = useContext(ProfileContext)!;
//   const { accessToken } = useContext(TokenContext)!;

//   const initializeFollowersData = () => {
//     if (!accessToken || !userProfileInfo) return;
//     axiosClient
//       .get(`/users/followers?targetUserId=${userProfileInfo}`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       })
//       .then((res) => {
//         console.log(res.data);
//         setFollowers(res.data.data);
//       });
//   };

//   useEffect(initializeFollowersData, [accessToken]);
//   return <div></div>;
// }

function FollowerElement({
  follow,
  navigate,
}: {
  follow: FollowProps;
  navigate: NavigateFunction;
}) {
  const navigateToProfile = () => {
    navigate(`/profile/${follow.id}`);
  };
  return (
    <Paper className="flex items-center gap-4 px-5 py-2">
      <Avatar className="size-[50px]" src={`${follow.pfp}`} />
      <div className="">
        <p
          className="font-body font-bold text-slate-800 hover:cursor-pointer hover:underline"
          onClick={navigateToProfile}
        >
          {follow.fullname}
        </p>
        <p className="text small font-body text-sm text-slate-600">
          {follow.username}
        </p>
        <div className="mt-1 flex items-center">
          <LocationOnOutlined className="text-sm font-thin text-slate-500" />
          <p className=" small font-body text-sm text-slate-500">
            {follow.address}
          </p>
        </div>
      </div>
      <Button variant="contained" className=" ml-auto normal-case text-white ">
        {follow.followedByTheUser ? "Unfollow" : "Follow"}
      </Button>
    </Paper>
  );
}

function FollowerList() {
  const [followers, setFollowers] = useState<FollowProps[]>([]);
  const { accessToken } = useContext(TokenContext)!;
  const { userProfileInfo } = useContext(ProfileContext)!;
  const navigate = useNavigate();
  const params = useParams<{ usernameOrId: string }>();

  const getFollowers = () => {
    if (!accessToken || !userProfileInfo) return;
    axiosClient
      .get(`/users/followers?targetUserId=${params.usernameOrId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setFollowers(res.data.data);
      });
  };

  useEffect(getFollowers, [accessToken, params.usernameOrId]);

  return (
    <>
      {followers.map((follower) => {
        return <FollowerElement follow={follower} navigate={navigate} />;
      })}
      {!followers.length && (
        <p className="italic text-slate-600">No followers</p>
      )}
    </>
  );
}

function FollowingList() {
  const [followers, setFollowers] = useState<FollowProps[]>([]);
  const { accessToken } = useContext(TokenContext)!;
  const { userProfileInfo } = useContext(ProfileContext)!;
  const navigate = useNavigate();
  const params = useParams<{ usernameOrId: string }>();

  const getFollowers = () => {
    if (!accessToken || !userProfileInfo) return;
    axiosClient
      .get(`/users/following?targetUserId=${params.usernameOrId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setFollowers(res.data.data);
      });
  };

  useEffect(getFollowers, [accessToken, params.usernameOrId]);

  return (
    <>
      {followers.map((follower) => {
        return <FollowerElement follow={follower} navigate={navigate} />;
      })}
      {!followers.length && (
        <p className="italic text-slate-600">No Following</p>
      )}
    </>
  );
}

// Type Defs
interface UserRawInfo {
  id: string;
  username: string;
  firstname: string;
  middlename: string;
  lastname: string;
  bio: string;
  dateOfBirth: string;
  pfp: string;
  cover: string;
  affiliation: string;
  gender: string;
  barangay: string;
  municipality: string;
  province: string;
}

interface ModalViewProps {
  modalView: boolean;
  setModalView: Dispatch<React.SetStateAction<boolean>>;
}

interface FollowProps extends PostAuthor {
  followedByTheUser: boolean;
}
