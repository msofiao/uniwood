import {
  Alert,
  Avatar,
  Button,
  Chip,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Slide,
  Step,
  StepLabel,
  Stepper,
  TextField as TextFieldMUI,
  Typography,
} from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  CloseRounded,
  EditRounded,
  PersonAddAltRounded,
  PersonRemoveAlt1Rounded,
} from "@mui/icons-material";
import {
  Form,
  Link,
  useActionData,
  useFetcher,
  useNavigate,
} from "react-router-dom";
import { TokenContext } from "../providers/TokenProvider";
import shareProjectsSvg from "../assets/images/share-projects.svg";
import React from "react";
import { LoadingButton, TabContext, TabPanel } from "@mui/lab";
import axiosClient from "../utils/axios";
import { login } from "../api/login";

const RFormDataContext = createContext<RegisterFDataProps | null>(null);
const ModalAlertContext = createContext<ModalAlertContextProps | null>(null);
const steps = [
  "Personal Infortmation",
  "User Credential",
  "Interest and Recommendation",
];

const TextField = styled(TextFieldMUI)(() => ({
  "& .MuiFormHelperText-root": {
    textAlign: "right",
  },
}));

export default function Login() {
  const theme = useTheme();
  const [registerModalView, setRegisterModalView] = useState(false);

  const handleRegisterModalView = (
    _e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setRegisterModalView(true);
  };

  return (
    <div className="login bg-white">
      <nav>
        <div className="logo-container">
          <img
            className="logo"
            src={`${process.env.SERVER_PUBLIC}/assets/logo.svg`}
            alt=""
          />
          <Typography className="logo-text " variant="h3" fontFamily={"Nunito"}>
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
            className="register-button normal-case"
            variant="text"
            color={"primary"}
            onClick={handleRegisterModalView}
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
        <LoginForm setRegisterModalView={setRegisterModalView} />
        <RegisterModal
          registerModalView={registerModalView}
          setRegisterModalView={setRegisterModalView}
        />
      </main>
    </div>
  );
}

function RegisterModal({
  registerModalView,
  setRegisterModalView,
}: RegisterModalProps) {
  const navigate = useNavigate();
  const { accessToken } = useContext(TokenContext)!;
  const [stepValue, dispatchStepValue] = useReducer(stepReducer, 0);
  const [recommendations, setRecommendations] = useState<string[]>([
    "workout",
    "singing",
    "coding",
    "dancing",
    "gaming",
    "reading",
    "writing",
    "drawing",
    "painting",
    "woodworking",
    "gardening",
    "biking",
    "hiking",
    "swimming",
    "running",
    "cooking",
    "baking",
  ]);
  const [pickedRecs, setPickedRecs] = useState<string[]>([]);
  const [alertState, setAlertState] = useState<AlertStateProps>({
    severity: "success",
    message: "Account Created",
    visible: true,
  });
  const formDataRef = useRef<FormData>(new FormData());

  const autoAlertRemoval = () => {
    setTimeout(() => {
      setAlertState({ ...alertState, visible: false });
    }, 4000);
  };
  const addInterests = () =>
    axiosClient.patch(
      "/users/addInterest",
      { interests: pickedRecs },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

  const goToHomePage = () => {
    addInterests();
    navigate("/");
  };

  useEffect(autoAlertRemoval, [alertState.visible]);

  return (
    <Modal
      className="login-modal flex items-center justify-center"
      open={registerModalView}
      onClose={() => setRegisterModalView(false)}
    >
      <RFormDataContext.Provider value={formDataRef}>
        <ModalAlertContext.Provider value={{ setAlert: setAlertState }}>
          <div className="signup-modal relative flex h-[90%] max-h-[750px] w-[500px] flex-col   rounded-xl bg-white pb-0 shadow-md ">
            <ModalHeader setRegisterModalView={setRegisterModalView} />
            <RegisterStepper step={stepValue} />
            <div className="overflow-y-auto">
              <TabContext value={stepValue.toString()}>
                <TabPanel className="p-0" value="0">
                  <ImageForm />
                  <PersonalInfoForm
                    stepValue={stepValue}
                    dispatchStepValue={dispatchStepValue}
                  />
                </TabPanel>
                <TabPanel className="h-full p-0" value="1">
                  <CredentialForm
                    dispatchStepValue={dispatchStepValue}
                    setAlert={setAlertState}
                  />
                </TabPanel>
                <TabPanel className="p-8" value="2">
                  <RecommendedAccounts />
                  <RecommendedSelect
                    recommendations={recommendations}
                    pickedRecs={pickedRecs}
                    setPickedRecs={setPickedRecs}
                  />
                  <Button
                    className="ml-auto mt-2 block w-fit rounded-md bg-primary-400 px-3 py-2 text-base font-semibold normal-case text-white hover:bg-primary-500"
                    variant="contained"
                    onClick={goToHomePage}
                  >
                    Go to Home Page
                  </Button>
                </TabPanel>
              </TabContext>
            </div>
          </div>

          <Fade in={alertState.visible}>
            <Alert
              className="absolute bottom-6 left-14 z-50 w-[250px]"
              severity={alertState.severity}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setAlertState({ ...alertState, visible: false });
                  }}
                >
                  <CloseRounded fontSize="inherit" />
                </IconButton>
              }
            >
              {alertState.message}
            </Alert>
          </Fade>
        </ModalAlertContext.Provider>
      </RFormDataContext.Provider>
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
          },
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
        className="textfield mb-[10px]"
        InputLabelProps={{ shrink: true }}
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
        className="textfield mb-[20px]"
        required
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
        className="login-button mb-[15px] block font-bold normal-case text-white"
        variant="contained"
        color={"primary"}
        fullWidth
      >
        Login
      </Button>
      <div className="or-container mb-[15px]">
        <span className="line"></span>
        <Typography fontFamily={"Roboto"}>OR</Typography>
        <span className="line"></span>
      </div>
      <Button
        className="login-button mb-[15px] block font-bold normal-case text-white"
        variant="contained"
        color={"secondary"}
        fullWidth
        onClick={() => setRegisterModalView(true)}
      >
        Register
      </Button>
    </Form>
  );
}

function ModalHeader({ setRegisterModalView }: ModalHeaderProps) {
  return (
    <div className="header-container sticky top-0 z-50 flex items-center bg-white px-2 py-3">
      <IconButton
        className="/  absolute left-2 hover:bg-gray-500 hover:bg-opacity-40"
        onClick={() => setRegisterModalView(false)}
      >
        <CloseRounded className="icon" />
      </IconButton>
      <p className="name block w-full text-center font-header text-lg font-semibold">
        Create Account
      </p>
      <Button
        type="submit"
        className="bg-primary-400D absolute right-3 rounded-full px-4 py-1 font-bold normal-case text-white"
        variant="contained"
      >
        Skip
      </Button>
    </div>
  );
}

function RecommendedSelect({
  recommendations,
  pickedRecs,
  setPickedRecs,
}: RecommendedSelectProps) {
  const togglePickRecommendation = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    const recommendation = e.currentTarget.id;
    if (pickedRecs.find((e) => e === recommendation)) {
      setPickedRecs(pickedRecs.filter((e) => e !== recommendation));
    } else {
      setPickedRecs([...pickedRecs, recommendation]);
    }
  };

  return (
    <div className={`mx-aut mt-4 rounded-lg p-2 hover:cursor-text`}>
      <p className="font-body text-lg">Interests:</p>

      <div className="mt-3 flex min-h-[163.2px] flex-wrap justify-center">
        {recommendations.map((recommend) => {
          const selected = pickedRecs.find((e) => e === recommend)
            ? "border-primary-300 bg-primary-300 hover:border-primary-400 text-white"
            : "border-primary-200 bg-primary-100 hover:border-primary-300 text-slate-700";
          return (
            <Chip
              id={recommend}
              className={`max-w flex-gow mb-1 ml-1 min-w-[10px] border-2  border-solid  text-slate-700 ${selected} hover:cursor-pointer focus-visible:border-none`}
              key={recommend}
              label={recommend}
              onClick={togglePickRecommendation}
            />
          );
        })}
      </div>
    </div>
  );
}

function PersonalInfoForm({
  stepValue,
  dispatchStepValue,
}: PersonalInfoFormProp) {
  const submitRef = useRef<HTMLButtonElement>(null);
  const rFormData = useContext(RFormDataContext)!;
  const [genderSelect, setGenderSelect] = useState("");
  const [affiliationSelect, setAffiliationSelect] = useState("");

  const handleSelectGenderChange = (e: SelectChangeEvent<string>) => {
    setGenderSelect(e.target.value);
  };
  const handleSelectAffiliationChange = (e: SelectChangeEvent<string>) => {
    setAffiliationSelect(e.target.value);
  };
  const attachFormToRForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formIteratable = formData.entries();

    let formDataEntry = formIteratable.next();

    while (!formDataEntry.done) {
      const [key, value] = formDataEntry.value;
      rFormData.current.append(key, value);
      formDataEntry = formIteratable.next();
    }
    dispatchStepValue("next");
  };

  const hiddenStatus = stepValue === 0 ? "block" : "hidden";

  // TODO Needed For Email and Password Validation

  return (
    <Slide direction="right" in={stepValue === 0}>
      <form
        className={`input-container mb-4 flex flex-col gap-0 px-6 ${hiddenStatus}`}
        onSubmit={attachFormToRForm}
      >
        <Button className="hidden" ref={submitRef} type="submit" />
        <TextField
          className="w-full"
          margin="none"
          name="firstname"
          label="Firstname"
          required
          helperText=" "
          value={rFormData.current.get("firstname")}
        />
        <TextField
          margin="none"
          name="middlename"
          label="Middle Name"
          required
          helperText=" "
          value={rFormData.current.get("middlename")}
        />
        <TextField
          name="lastname"
          label="Last Name"
          required
          helperText=" "
          value={rFormData.current.get("lastname")}
        />

        <TextField
          name="bio"
          label="Bio"
          required
          helperText=" "
          value={rFormData.current.get("bio")}
        />
        <TextField
          name="dateOfBirth"
          label="Date of Birth"
          type="date"
          helperText=" "
          required
          InputLabelProps={{
            shrink: true,
          }}
          value={rFormData.current.get("dateOfBirth")}
        />
        <FormControl fullWidth className="mb-[20px]">
          <InputLabel id="edit-profile-affiliation">Affiliation</InputLabel>
          <Select
            name="affiliation"
            labelId="edit-profile-affiliation"
            label="Affiliation"
            value={
              affiliationSelect ||
              (rFormData.current.get("affiliation") as string)
            }
            onChange={handleSelectAffiliationChange}
          >
            <MenuItem value="WOOD_ENTHUSIAST">Wood Ethusiast</MenuItem>
            <MenuItem value="WOOD_WORKER">Woodworker</MenuItem>
            <MenuItem value="WOOD_CRAFTER">Wood Crafter</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth className="mb-[20px]">
          <InputLabel id="edit-profile-gender">Gender</InputLabel>
          <Select
            labelId="edit-profile-gender"
            name="gender"
            label="Gender"
            value={genderSelect || (rFormData.current.get("gender") as string)}
            onChange={handleSelectGenderChange}
          >
            <MenuItem value="MALE">Male</MenuItem>
            <MenuItem value="FEMALE">Female</MenuItem>
          </Select>
        </FormControl>
        <TextField
          name="barangay"
          label="barangay"
          required
          helperText=" "
          value={rFormData.current.get("barangay")}
        />
        <TextField
          name="municipality"
          label="municipality"
          required
          helperText=" "
          value={rFormData.current.get("municipality")}
        />
        <TextField
          name="province"
          label="province"
          required
          helperText=" "
          value={rFormData.current.get("province")}
        />

        <Button
          className="w-12 self-end bg-primary-400 p-2 font-semibold normal-case text-white"
          type="submit"
          variant="contained"
        >
          Next
        </Button>
      </form>
    </Slide>
  );
}

function RecommendedAccounts() {
  const [accountsInfo, stetAccountsInfo] = useState<UserProfileInfo[]>([]);

  const getRecommendedAccounts = () => {
    axiosClient
      .get("users/register/recommendedAccounts", {
        params: { limit: 5 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        stetAccountsInfo(res.data.recommendedAccounts);
      });
  };

  useEffect(getRecommendedAccounts, []);
  return (
    <div className="rounded-md border-2 border-solid border-primary-300 py-4">
      <p className="mb-5 ml-5 font-header text-base font-semibold text-slate-700">
        Suggested Accounts:
      </p>
      {accountsInfo.map((account) => (
        <Account account={account} />
      ))}
    </div>
  );
}

function Account({ account }: { account: UserProfileInfo }) {
  const { setAccessToken } = useContext(TokenContext)!;
  const { setAlert } = useContext(ModalAlertContext)!;

  const followUser = () =>
    axiosClient.patch(
      "/users/follow",
      {},
      {
        params: { userId: account.id },
        headers: {
          Authorization: `Bearrer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
  const unfollowUser = () =>
    axiosClient.patch(
      "/users/unfollow",
      {},
      {
        params: { userId: account.id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
  const refreshToken = () => {
    axiosClient
      .post("/refresh_token", {}, { withCredentials: true })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        localStorage.setItem("accessToken", res.data.accessToken);
      });
  };
  const [isFollowing, setIsFollowing] = useState(false);
  const follow = () => {
    followUser().then(() => {
      setAlert({ message: "Followed", severity: "success", visible: true });
      setIsFollowing(true);
    });
  };
  const unFollow = () => {
    setIsFollowing(false);
    unfollowUser().then(() => {
      setAlert({ message: "Unfollowed", severity: "success", visible: true });
      setIsFollowing(false);
    });
  };

  useEffect(refreshToken, []);
  return (
    <div className="mb-4 flex items-center gap-3 px-3">
      <Avatar
        className="size-14"
        src={`${process.env.SERVER_PUBLIC}/${account.pfp}`}
      />
      <div>
        <p className="font-body2 text-base font-medium text-slate-700 hover:underline">
          {account.fullname}
        </p>
        <p className="font-body text-sm text-slate-500">
          {account.affiliation}
        </p>
        <p className="font-body2 text-sm text-slate-500"></p>
        <p className="font-body2  text-sm text-slate-500">{account.address}</p>
      </div>
      {!isFollowing ? (
        <IconButton className="ml-auto" onClick={follow}>
          <PersonAddAltRounded className="text-primary-400" />
        </IconButton>
      ) : (
        <IconButton className="ml-auto">
          <PersonRemoveAlt1Rounded
            className="text-primary-400"
            onClick={unFollow}
          />
        </IconButton>
      )}
    </div>
  );
}

function ImageForm() {
  const rFormData = useContext(RFormDataContext)!;
  const [userImg, setUserImg] = useState<UserImageState>({
    cover: null,
    pfp: null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null || !(e.target.files[0] instanceof File)) return;
    const file = e.target.files[0];

    rFormData.current.append(e.currentTarget.name, file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setUserImg({
        ...userImg,
        [e.target.name]: reader.result?.toString() ?? null,
      });
    };
  };
  const displaySelectedImage = () => {
    if (rFormData.current.get("pfp") !== null) {
      const reader = new FileReader();
      reader.readAsDataURL(rFormData.current.get("pfp") as File);
      reader.onload = () => {
        setUserImg((prev) => ({
          ...prev,
          pfp: reader.result?.toString() ?? null,
        }));
      };
    }
    if (rFormData.current.get("cover") !== null) {
      const reader = new FileReader();
      reader.readAsDataURL(rFormData.current.get("cover") as File);
      reader.onload = () => {
        setUserImg((prev) => ({
          ...prev,
          cover: reader.result?.toString() ?? null,
        }));
      };
    }
  };

  useEffect(displaySelectedImage, []);

  return (
    <div className="relative mb-[65px] flex w-full items-center justify-center ">
      <IconButton
        title="Set cover image"
        className="cover-icon-container absolute aspect-square h-full w-full rounded-none hover:bg-black hover:bg-opacity-40 "
      >
        <label htmlFor="edit-profile-cover" className="cover-label">
          <EditRounded className="icon text-white hover:cursor-pointer" />
        </label>
        <input
          id="edit-profile-cover"
          type="file"
          name="cover"
          hidden
          accept="*/image"
          onChange={handleImageChange}
        />
      </IconButton>
      <img
        className="h-[25vh] max-h-[250px] w-full bg-cover"
        src={
          userImg.cover ??
          `${process.env.SERVER_PUBLIC}/assets/default-cover.jpg`
        }
      />
      <div className="avatar-container absolute bottom-[-60px] left-[30px] flex h-[120px] w-[120px] items-center justify-center rounded-full border-4 border-solid border-white">
        <Avatar
          className="avatar h-full w-full "
          src={
            userImg.pfp ?? `${process.env.SERVER_PUBLIC}/assets/default-pfp.jpg`
          }
        />
        <IconButton
          title="Set avatar"
          className="icon-container absolute  h-full w-full  hover:bg-black hover:bg-opacity-40 "
        >
          <label htmlFor="edit-profile-pfp" className="pfp-label">
            <EditRounded className="icon text-white hover:cursor-pointer" />
          </label>
          <input
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
  );
}

function CredentialForm({ dispatchStepValue }: CredentialFormProps) {
  const { setAlert } = useContext(ModalAlertContext)!;
  const { setAccessToken } = useContext(TokenContext)!;
  const userFetcher = useFetcher();
  const rFormData = useContext(RFormDataContext)!;
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passowrdRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [tfErrors, setTfErrors] = useState<tfErrorsState>({
    email: null,
    username: null,
    password: null,
  });
  const [pMatcher, setPMatcher] = useState<PMathcherState>({
    password: null,
    confirmPassword: null,
  });

  const handleRegisterStatusAlert = () => {
    if (userFetcher.data?.status === "success") {
      setAlert({
        severity: "success",
        message: "Account Created",
        visible: true,
      });
    } else if (userFetcher.data?.status === "fail") {
      setAlert({
        severity: "error",
        message: "Account not created",
        visible: true,
      });
    }
  };
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (rFormData.current) {
      rFormData.current.append("email", formData.get("email") as string);
      rFormData.current.append("username", formData.get("username") as string);
      rFormData.current.append("password", formData.get("password") as string);
    }

    userFetcher.submit(rFormData.current, {
      method: "POST",
      action: "/users",
      encType: "multipart/form-data",
    });
  };

  const handleTfErrors = () => {
    if (userFetcher.data?.status !== "fail") return;
    if (userFetcher.data?.error === "ValidationError") {
      userFetcher.data?.errorFields?.forEach(
        (errorFields: { field: string; message: string }) => {
          setTfErrors({
            ...tfErrors,
            [errorFields.field]: errorFields.message,
          });
        },
      );
    }
  };

  const handleFocusTfErrors = () => {
    const lastErrorField = Object.entries(tfErrors).filter(
      (elem) => elem[1] !== null,
    );
    const lastErrorFieldKey = lastErrorField[lastErrorField.length - 1]?.[0];

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
  const matchPassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPMatcher({
      ...pMatcher,
      [e.target.name]: e.target.value,
    });

  const removeTfError = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTfErrors({
      ...tfErrors,
      [e.target.name]: null,
    });
  const initializeToken = () => {
    console.log("initializeTokenfnc triggered");
    console.log({ fetcherData: userFetcher.data?.status });
    if (userFetcher.data?.status === "success") {
      localStorage.setItem("accessToken", userFetcher.data.data.accessToken);
      setAccessToken(userFetcher.data.data.accessToken);
      localStorage.setItem("id", userFetcher.data.data.id);
      dispatchStepValue("next");
    }
  };
  // const handleLogin = () => {
  //   login({
  //     emailOrUsername: rFormData.current.get("email") as string,
  //     password: rFormData.current.get("password") as string,
  //   });
  // };

  const previousStep = () => dispatchStepValue("back");
  const isSubmitting = userFetcher.state === "submitting";

  // useEffect(handleLogin, [userFetcher.data]);
  useEffect(handleTfErrors, [userFetcher.data]);
  useEffect(handleFocusTfErrors, [tfErrors, userFetcher.data]);
  useEffect(initializeToken, [userFetcher.data]);
  useEffect(handleRegisterStatusAlert, [userFetcher.data]);

  return (
    <>
      <form
        className="relative flex h-full flex-col justify-center  px-6 "
        onSubmit={handleFormSubmit}
      >
        <p className="mb-5 font-body text-xl font-bold tracking-wide text-slate-800">
          Setup Credential
        </p>
        <TextField
          className="mb-[8px]"
          ref={emailRef}
          name="email"
          label="Email"
          required
          type="email"
          helperText={tfErrors.email ?? " "}
          error={tfErrors.email ? true : false}
          onChange={removeTfError}
          fullWidth
          disabled={isSubmitting}
        />
        <TextField
          className="mb-[8px]"
          ref={usernameRef}
          name="username"
          label="Username"
          type="text"
          required
          error={tfErrors.username ? true : false}
          helperText={tfErrors.username ?? " "}
          autoFocus={tfErrors.username ? true : false}
          onChange={removeTfError}
          fullWidth
          disabled={isSubmitting}
        />
        <TextField
          className="mb-[8px]"
          ref={passowrdRef}
          name="password"
          label="Password"
          type="password"
          required
          helperText={tfErrors.password ?? " "}
          error={tfErrors.password ? true : false}
          fullWidth
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            removeTfError(e);
            matchPassword(e);
          }}
          disabled={isSubmitting}
        />

        <TextField
          className="mb-[8px]"
          ref={confirmPasswordRef}
          name="confirmPassword"
          label="Confirm Password"
          required
          type="password"
          helperText={tfErrors.password ?? " "}
          error={tfErrors.password ? true : false}
          fullWidth
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            removeTfError(e);
            matchPassword(e);
          }}
          disabled={isSubmitting}
        />
        <div className="flex justify-between">
          <Button
            className="font-body font-semibold normal-case text-white "
            variant="contained"
            onClick={previousStep}
          >
            Back
          </Button>
          <LoadingButton
            loading={userFetcher.state === "submitting"}
            className="font-body font-semibold normal-case text-white "
            variant="contained"
            type="submit"
          >
            <span>Create Account</span>
          </LoadingButton>
        </div>
      </form>
      {isSubmitting && (
        <LinearProgress
          className="absolute bottom-0 z-10 w-full"
          variant="indeterminate"
        />
      )}
    </>
  );
}

function RegisterStepper({ step }: RegisterStepperProps) {
  return (
    <div className="sticky top-[52px] z-10 w-full border-b-4  border-solid  border-primary-300 bg-primary-50 py-2">
      <Stepper activeStep={step} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}

function stepReducer(state: number, action: "next" | "back") {
  switch (action) {
    case "next":
      return state + 1;
    case "back":
      return state - 1;
    default:
      return state;
  }
}

// Types
type RegisterFDataProps = React.MutableRefObject<FormData>;

interface PMathcherState {
  password: string | null;
  confirmPassword: string | null;
}
interface tfErrorsState {
  email: string | null;
  username: string | null;
  password: string | null;
}
interface CredentialFormProps {
  dispatchStepValue: Dispatch<"next" | "back">;
  setAlert: Dispatch<SetStateAction<AlertStateProps>>;
}

interface RegisterStepperProps {
  step: number;
}

interface RegisterModalProps {
  registerModalView: boolean;
  setRegisterModalView: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PersonalInfoFormProp {
  stepValue: number;
  dispatchStepValue: Dispatch<"next" | "back">;
}

interface ModalHeaderProps {
  setRegisterModalView: Dispatch<SetStateAction<boolean>>;
}

interface AlertStateProps {
  severity: "success" | "error" | "warning" | "info";
  message: string;
  visible: boolean;
}
interface UserImageState {
  cover: string | null;
  pfp: string | null;
}

interface ModalAlertContextProps {
  setAlert: Dispatch<SetStateAction<AlertStateProps>>;
}

interface RecommendedSelectProps {
  recommendations: string[];
  pickedRecs: string[];
  setPickedRecs: React.Dispatch<React.SetStateAction<string[]>>;
}
