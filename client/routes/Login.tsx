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
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTheme } from "@mui/material/styles";
import { CloseRounded, EditRounded } from "@mui/icons-material";
import axiosClient from "../utils/axios";
import { Form, useActionData, useFetcher, useNavigate } from "react-router-dom";
import { TokenContext } from "../providers/TokenProvider";
import shareProjectsSvg from "../assets/images/share-projects.svg";
import logo from "../assets/images/logo.svg";
import { AlertContext } from "../providers/AlertProvider";

export default function Login() {
  const theme = useTheme();
  const [registerModalView, setregisterModalView] = useState(false);
  return (
    <div className="login" style={{ background: "#fff" }}>
      {/* <Box
        className="alert-master"
        sx={{ display: alerts.error.visible ? "block" : "none" }}
      >
        <Alert severity="error" onClose={handleAlertClose("error")}>
          <Typography variant="body1">{alerts.error.message}</Typography>
        </Alert>
      </Box> */}

      <nav>
        <div className="logo-container">
          <img className="logo" src={logo} alt="" />
          <Typography className="logo-text" variant="h3" fontFamily={"Nunito"}>
            Uniwood
          </Typography>
        </div>
        <div className="register-nav">
          <Typography
            className="register-text"
            variant="h6"
            color={theme.palette.text.primary}
          >
            No account registered ?
          </Typography>
          <Button
            className="register-button"
            variant="text"
            sx={{ textTransform: "none" }}
            color={"primary"}
            onClick={() => setregisterModalView(true)}
          >
            Register
          </Button>
        </div>
      </nav>
      <main>
        <div className="pane1">
          <div className="content-container">
            <img className="content-svg" src={shareProjectsSvg} alt="" />
            <Typography
              className="content-title"
              fontFamily={"Nunito"}
              fontWeight={"bold"}
              color={theme.palette.text.primary}
              variant="h4"
            >
              Share your project
            </Typography>
            <Typography
              className="content-subtitle"
              fontFamily={"Roboto"}
              variant="subtitle1"
            >
              Exhibit creation, seek advice on a challenging project, or simply
              revel in the camaraderie of fellow artisans, UniWood's "Share
              Projects" is your portal to a collaborative woodworking experience
              like never before. Let the journey of craftsmanship and connection
              begin!
            </Typography>
          </div>
        </div>
        <LoginForm setRegisterModalView={setregisterModalView} />
        <RegisterModal
          registerModalView={registerModalView}
          setregisterModalView={setregisterModalView}
        />
      </main>
    </div>
  );
}
function RegisterModal({
  registerModalView,
  setregisterModalView,
}: {
  registerModalView: boolean;
  setregisterModalView: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [inputError, setInputError] = useState({} as any);
  const userFetcher = useFetcher();
  const fetcherFormRef = useRef<HTMLFormElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passowrdRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [inputInfo, setInputInfo] = useState({
    password: "",
    confirmPassword: "",
  });
  const coverImgRef = useRef<HTMLInputElement>(null);
  const pfpImgRef = useRef<HTMLInputElement>(null);
  const [userImage, setUserImage] = useState<{
    cover: {
      imgString: string | null;
      imgFile: File | null;
    };
    pfp: {
      imgString: string | null;
      imgFile: File | null;
    };
  }>({
    cover: {
      imgString: null,
      imgFile: null,
    },
    pfp: {
      imgString: null,
      imgFile: null,
    },
  });
  const [genderSelect, setGenderSelect] = useState("");
  const [affiliationSelect, setAffiliationSelect] = useState("");
  const [proffeciencySelect, setProffeciencySelect] = useState("");
  const { setAlert } = useContext(AlertContext);

  // utilitiies handle select change
  const handleSelectGenderChange = (e: SelectChangeEvent<string>) => {
    setGenderSelect(e.target.value);
  };
  const handleSelectAffiliationChange = (e: SelectChangeEvent<string>) => {
    setAffiliationSelect(e.target.value);
  };
  const handleSelectProffeciencyChange = (e: SelectChangeEvent<string>) => {
    setProffeciencySelect(e.target.value);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null || !(e.target.files[0] instanceof File)) return;

    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (f) => {
      setUserImage({
        ...userImage,
        [e.target.name]: {
          imgString: f.target?.result?.toString() ?? null,
          imgFile: file,
        },
      });
    };
    reader.readAsDataURL(file);
  };
  const handleDefaultImage = () => {
    axiosClient
      .get(`${process.env.SERVER_PUBLIC}/default-pfp.jpg`, {
        responseType: "blob",
      })
      .then((res) => {
        setUserImage({
          ...userImage,
          pfp: {
            imgString: URL.createObjectURL(res.data),
            imgFile: new File([res.data], "default-pfp.jpg", {
              type: res.headers["content-type"],
            }),
          },
        });
      });
    axiosClient
      .get(`${process.env.SERVER_PUBLIC}/default-cover.jpg`, {
        responseType: "blob",
      })
      .then((res) => {
        setUserImage({
          ...userImage,
          cover: {
            imgString: URL.createObjectURL(res.data),
            imgFile: new File([res.data], "default-cover.jpg", {
              type: res.headers["content-type"],
            }),
          },
        });
      });
  };
  const handleRegisterStatusAlert = () => {
    if (userFetcher.data?.status === "success") {
      setAlert({
        severity: "success",
        message: "Account Created",
        hidden: false,
      });
      setregisterModalView(false);
    } else if (userFetcher.data?.status === "fail") {
      setAlert({
        severity: "error",
        message: "Account not created",
        hidden: false,
      });
    }
    // setregisterModalView(false);
  };
  const handleInputError = () => {
    console.log({ inputError });
    if (userFetcher.data?.status !== "fail") return;
    if (userFetcher.data?.error === "ValidationError") {
      userFetcher.data?.errorFields?.forEach(
        (errorFields: { field: string; message: string }) => {
          setInputError({
            ...inputError,
            [errorFields.field]: errorFields.message,
          });
        }
      );
    }
  };
  const handleFocusInputError = () => {
    const lastErrorField = Object.entries(inputError).filter(
      (elem) => elem[1] !== null
    );
    const lastErrorFieldKey = lastErrorField[lastErrorField.length - 1]?.[0];

    console.log({ lastErrorFieldKey });

    if (!lastErrorFieldKey) return;
    if (lastErrorFieldKey === "email")
      emailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    else if (lastErrorFieldKey === "username")
      usernameRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    else if (lastErrorFieldKey === "password")
      passowrdRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    else if (lastErrorFieldKey === "confirmPassword")
      confirmPasswordRef.current?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
  };

  useEffect(handleDefaultImage, []);
  useEffect(handleRegisterStatusAlert, [userFetcher.data]);
  useEffect(handleInputError, [userFetcher.data]);
  useEffect(handleFocusInputError, [inputError, userFetcher.data]);

  return (
    <Modal
      className="login-modals"
      open={registerModalView}
      onClose={() => setregisterModalView(false)}
    >
      <userFetcher.Form
        className="signup-modal"
        ref={fetcherFormRef}
        action="/users"
        method="POST"
        encType="multipart/form-data"
      >
        <div className="header-container">
          <IconButton
            className="icon-container"
            onClick={() => setregisterModalView(false)}
          >
            <CloseRounded className="icon" />
          </IconButton>
          <Typography className="name" variant="h5">
            Create Account
          </Typography>
          <Button
            type="submit"
            className="button"
            variant="contained"
            color="secondary"
            sx={{ color: "#ffffff" }}
          >
            Signup
          </Button>
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
              ref={coverImgRef}
              id="edit-profile-cover"
              type="file"
              name="cover"
              hidden
              accept="*/image"
              onChange={handleImageChange}
            />
          </IconButton>
          <img
            className="cover"
            src={
              userImage.cover.imgString ??
              `${process.env.SERVER_PUBLIC}/default-cover.jpg`
            }
          />
          <div className="avatar-container">
            <Avatar
              className="avatar"
              src={
                userImage.pfp.imgString ??
                `${process.env.SERVER_PUBLIC}/default-pfp.jpg`
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
                ref={pfpImgRef}
                id="edit-profile-pfp"
                type="file"
                name="pfp"
                hidden
                accept="*/image"
                onChange={handleImageChange}
              />
            </IconButton>
          </div>
        </div>
        <Box className="input-container">
          <Button
            ref={submitRef}
            type="submit"
            sx={{ display: "none" }}
          ></Button>
          <TextField
            name="firstname"
            label="First Name"
            error={inputError.firstname ? true : false}
            onChange={() => {
              setInputError({ ...inputError, firstname: null });
            }}
            required
            helperText=" "
          />
          <TextField
            name="middlename"
            label="Middle Name"
            required
            helperText=" "
          />
          <TextField
            name="lastname"
            label="Last Name"
            required
            helperText=" "
          />
          <TextField
            ref={emailRef}
            name="email"
            label="Email"
            required
            type="email"
            helperText={inputError.email ?? " "}
            error={inputError.email ? true : false}
            onChange={() => setInputError({ ...inputError, email: null })}
          />
          <TextField
            ref={usernameRef}
            name="username"
            label="Username"
            required
            error={inputError.username ? true : false}
            helperText={inputError.username ?? " "}
            autoFocus={inputError.username ? true : false}
            onChange={() => setInputError({ ...inputError, username: null })}
          />
          <TextField
            ref={passowrdRef}
            name="password"
            label="Password"
            required
            helperText={inputError.password ?? " "}
            error={inputError.password ? true : false}
            onChange={(e) => {
              setInputError({ ...inputError, password: null });
              setInputInfo({ ...inputInfo, password: e.target.value });
            }}
          />
          <TextField
            ref={confirmPasswordRef}
            name="confirmPassword"
            label="Confirm Password"
            required
            helperText={inputError.password ?? " "}
            error={inputError.password ? true : false}
            onChange={(e) => {
              setInputError({ ...inputError, confirmPassword: null });
              setInputInfo({ ...inputInfo, confirmPassword: e.target.value });
            }}
          />
          <TextField name="bio" label="Bio" required />
          <TextField
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            required
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ margin: "25px 0" }}
          />
          <TextField name="barangay" label="barangay" required helperText=" " />
          <TextField
            name="municipality"
            label="municipality"
            required
            helperText=" "
          />
          <TextField name="province" label="province" required helperText=" " />
          <FormControl fullWidth>
            <InputLabel id="edit-profile-proffeciency">
              Proffeciency{" "}
            </InputLabel>
            <Select
              name="proffeciency"
              labelId="edit-profile-proffeciency"
              label="Proffeciency"
              value={proffeciencySelect}
              onChange={handleSelectProffeciencyChange}
            >
              <MenuItem value="newbie">Newbie</MenuItem>
              <MenuItem value="novice">Novice</MenuItem>
              <MenuItem value="expert">Expert</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="edit-profile-affiliation">Affiliation</InputLabel>
            <Select
              name="affiliation"
              labelId="edit-profile-affiliation"
              label="Affiliation"
              value={affiliationSelect}
              onChange={handleSelectAffiliationChange}
            >
              <MenuItem value="WOOD_ENTHUSIAST">Wood Ethusiast</MenuItem>
              <MenuItem value="WOOD_WORKER">Woodworker</MenuItem>
              <MenuItem value="WOOD_CRAFTER">Wood Crafter</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="edit-profile-gender">Gender</InputLabel>
            <Select
              value={genderSelect}
              labelId="edit-profile-gender"
              name="gender"
              label="Gender"
              onChange={handleSelectGenderChange}
            >
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </userFetcher.Form>
    </Modal>
  );
}

function LoginForm({
  setRegisterModalView,
}: {
  setRegisterModalView: Dispatch<SetStateAction<boolean>>;
}) {
  // States
  const { setAccessToken } = useContext(TokenContext) as TokenContextProps;
  const actionData = useActionData() as any;
  const navigate = useNavigate();
  const [inputError, setInputError] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [alerts, setAlerts] = useState({
    error: { visible: false, message: "" },
    success: { visible: false, message: "" },
  });

  //utilitiees
  const handleLoginRequestData = () => {
    if (actionData?.status === "success") {
      setAccessToken(actionData?.data?.token);
      localStorage.setItem("accessToken", actionData?.accessToken);
      localStorage.setItem("id", actionData?.id);

      navigate("/");
    } else if (actionData?.status === "fail") {
      if (actionData.error === "FieldError") {
        (actionData.error as [{ field: string; message: string }]).forEach(
          (error) => {
            if (error.field === "usernameOrEmail")
              setInputError({ ...inputError, usernameOrEmail: error.message });
            else if (error.field === "password")
              setInputError({
                ...inputError,
                password: error.message,
              });
          }
        );
      }
      if (actionData.error === "UserNotFound") {
        setInputError({
          ...inputError,
          usernameOrEmail: "User not found",
        });
      }
      if (actionData.error === "IncorrectPassword") {
        setInputError({
          ...inputError,
          password: "Incorrect Password",
        });
      }
    }
  };

  const handleAlertClose = (alertType: "error" | "success") => {
    return () => {
      setAlerts({ ...alerts, [alertType]: { visible: false, message: "" } });
    };
  };
  const handleClearInputError = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputError({ ...inputError, [e.currentTarget.name]: "" });
  };

  useEffect(handleLoginRequestData, [actionData]);

  return (
    <Form action="/login" method="POST" className="pane2">
      <Typography className="header" variant="h4" fontFamily={"Roboto"}>
        Login
      </Typography>
      <TextField
        className="textfield"
        InputLabelProps={{ shrink: true }}
        sx={{ marginBottom: "10px" }}
        type="email"
        variant="standard"
        name="usernameOrEmail"
        label="Email"
        color="secondary"
        required
        fullWidth
        helperText={inputError.usernameOrEmail || " "}
        onChange={handleClearInputError}
        error={inputError.usernameOrEmail ? true : false}
      />
      <TextField
        className="textfield"
        required
        sx={{ marginBottom: "20px;" }}
        InputLabelProps={{ shrink: true }}
        type="password"
        variant="standard"
        name="password"
        label="Password"
        helperText={inputError.password || " "}
        color="secondary"
        fullWidth
        error={inputError.password ? true : false}
        onChange={handleClearInputError}
      />
      <Button
        type="submit"
        className="login-button"
        variant="contained"
        sx={{
          display: "block",
          textTransform: "none",
          fontWeight: "bold",
          color: "#fff",
          marginBottom: "15px",
        }}
        color={"primary"}
        fullWidth
      >
        Login
      </Button>
      <div className="or-container" style={{ marginBottom: "15px" }}>
        <span className="line"></span>
        <Typography fontFamily={"Roboto"}>OR</Typography>
        <span className="line"></span>
      </div>
      <Button
        className="login-button"
        variant="contained"
        sx={{
          display: "block",
          textTransform: "none",
          fontWeight: "bold",
          color: "#fff",
        }}
        color={"secondary"}
        fullWidth
        onClick={() => setRegisterModalView(true)}
      >
        Register
      </Button>
      <Box
        className="success-alert"
        sx={{ display: alerts.success.visible ? "block" : "none" }}
      ></Box>
    </Form>
  );
}
