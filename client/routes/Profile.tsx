import {
  Alert,
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
  Typography,
} from "@mui/material";
import React, { createContext, useContext, useEffect, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Post from "../components/Post.tsx";
import Poster, { PosterModal } from "../components/Poster";
import { CloseRounded, EditRounded } from "@mui/icons-material";
import axiosClient from "../utils/axios";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import { stringToConstant } from "../utils/stringFormatters.ts";
import { UserInfoContext } from "../providers/UserInfoProvider.tsx";
import { AlertContext } from "../providers/AlertProvider.tsx";

const ProfileContext = createContext<null | ProfileContext>(null);
export default function Profile() {
  const [userProfileInfo, setUserProfileInfo] =
    useState<UserProfileInfo | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  const loaderData = useLoaderData() as any;

  const initializeContextdata = () => {
    console.log({ loaderData });
    setUserProfileInfo(loaderData.userProfileInfo);
    setUserPosts(loaderData.userPosts);
  };
  useEffect(initializeContextdata, [loaderData]);

  console.log("Profile Rendered");

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
  const [tabIndex, setTabIndex] = useState("1");
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
            <Tab label="Details" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Poster setPostModalView={setPostModalView} />
          {userPosts.map((post) => {
            return <Post postParam={post} />;
          })}
          Post
        </TabPanel>
        <TabPanel value="3">
          <UserDetail />
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
        <Typography className="label">Proffeciency: </Typography>
        <Typography className="value">
          {userProfileInfo?.proffeciency}
        </Typography>
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
  const [editProfileModalView, setEditProfileModalView] = useState(false);
  const { userProfileInfo } = useContext(ProfileContext)!;

  console.log({ userProfileInfo });

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
        {localStorage.getItem("id") === userProfileInfo?.id && (
          <Button
            className="edit-profile"
            color={"secondary"}
            variant="contained"
            sx={{ textTransform: "none", color: "#fff" }}
            onClick={() => setEditProfileModalView(true)}
          >
            Edit profile
          </Button>
        )}
      </div>
      <div className="user-details">
        <Typography className="name" variant="h5">
          {userProfileInfo?.fullname}
          <Typography className="woodwork-type" variant="subtitle2">
            {userProfileInfo?.affiliation}
          </Typography>
        </Typography>

        <Typography className="username" variant="subtitle2">
          @{userProfileInfo?.username}
        </Typography>
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
      | SelectChangeEvent<string>
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
        hidden: false,
      });
    } else if (actionData?.status === "fail") {
      setAlert({
        severity: "error",
        message: "Profile Update Failed",
        hidden: false,
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
