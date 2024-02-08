import { CloseRounded, AddPhotoAlternateRounded } from "@mui/icons-material";
import {
  Modal,
  Paper,
  Typography,
  MenuItem,
  Avatar,
  TextField,
  Tooltip,
  Button,
  useTheme,
  IconButton,
} from "@mui/material";
import React, {
  FormEvent,
  MutableRefObject,
  useContext,
  useRef,
  useState,
} from "react";
import { useFetcher } from "react-router-dom";
import { UserInfoContext } from "../providers/UserInfoProvider";
import axiosClient from "../utils/axios";
import { AlertContext } from "../providers/AlertProvider";

export default function Poster({
  setPostModalView,
}: {
  setPostModalView: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const theme = useTheme();
  const { userInfo } = useContext(UserInfoContext)!;

  return (
    <Paper elevation={1} className="poster">
      <div className="pane1">
        <Avatar
          className="avatar"
          src={`${process.env.SERVER_PUBLIC}/${userInfo.pfp}`}
        />
        <Typography
          className="context"
          variant="body1"
          color={theme.palette.text.secondary}
          sx={{
            ":hover": {
              cursor: "pointer",
              backgroundColor: "#d7dbdc",
              transition: "background-color 0.3s ease",
            },
            background: "#eff3f4",
          }}
          onClick={() => setPostModalView(true)}
        >
          Share your Knowlge or Idea
        </Typography>
      </div>
      <Button
        fullWidth
        className="button"
        color={"secondary"}
        variant="contained"
        onClick={() => setPostModalView(true)}
      >
        Post
      </Button>
    </Paper>
  );
}
export function PosterModal({
  postModalView,
  setPostModalView,
}: {
  postModalView: boolean;
  setPostModalView: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // const [textFieldFocus, setTextFieldFocus] = useState(false);
  const [textFieldFocus, setTextFieldFocus] = useState({
    title: false,
    context: false,
  });
  const [imageData, setImageData] = useState([
    { id: "", imgSrc: "", caption: "" },
  ]);
  const imageFileData = useRef<{ id: string; fileSrc: File }[]>([]);
  const postFormData = useRef(new FormData());
  const { userInfo } = useContext(UserInfoContext)!;
  const postFetcher = useFetcher();
  const [fields, setFields] = useState({ title: "", context: "", tags: "" });
  const { setAlert } = useContext(AlertContext);
  const rootFetcher = useFetcher();

  const handlePostSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ imageData });
    if (imageData !== null) {
      imageData.forEach((image, index) => {
        console.log("Inside the looop");
        const imgFile = imageFileData.current?.find(
          (imageFile) => imageFile.id === image.id
        );
        postFetcher.formData?.append(
          `image-${index}`,
          imgFile?.fileSrc as File
        );
        if (image.caption !== "")
          postFetcher.formData?.append(`caption-${index}`, image.caption);
        postFormData.current.append(`image-${index}`, imgFile?.fileSrc as File);
      });
      rootFetcher.submit({idle: true}, {method: "POST", action: "/posts"})
    }
    axiosClient
      .post("/posts", postFormData.current, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setPostModalView(!postModalView);
        setAlert({
          severity: "success",
          message: "Posted Succesfully",
          hidden: false,
        });
        setFields({ title: "", context: "", tags: "" });
        setImageData([{ id: "", imgSrc: "", caption: "" }]);
        postFormData.current = new FormData();
      });
  };
  const handleInputBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
  ) => {
    setTextFieldFocus({ ...textFieldFocus, [e.target.name]: false });
    postFormData.current.append(e.target.name, e.target.value);
  };
  const handleInputFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
  ) => {
    setTextFieldFocus({ ...textFieldFocus, [e.target.name]: true });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };
  return (
    <Modal
      className="root-modals"
      open={postModalView}
      onClose={() => setPostModalView(!postModalView)}
    >
      <postFetcher.Form
        className="post-modal"
        method="POST"
        action="/posts"
        onSubmit={handlePostSubmit}
        encType="multipart/form-data"
      >
        <div className="header-container">
          <Typography className="header" variant="h4">
            Create Post
          </Typography>
          <MenuItem
            className="icon-container"
            onClick={() => setPostModalView(!postModalView)}
          >
            <CloseRounded className="icon" />
          </MenuItem>
        </div>
        <div className="user-info">
          <Avatar src={`${process.env.SERVER_PUBLIC}/${userInfo.pfp}`} />
          <Typography className="name">{userInfo.fullname}</Typography>
        </div>
        <Paper
          className="textField-container"
          elevation={textFieldFocus ? 1 : 0}
          sx={{
            border: "1px solid #cfd9de",
            ":hover": {
              border: textFieldFocus
                ? "1px solid #0000004d"
                : "1px solid #cfd9de",
            },
          }}
        >
          <TextField
            className="textField"
            placeholder="Title (Optional)"
            name="title"
            onChange={handleInputChange}
            sx={{
              width: "100%",
              border: "none",
              "& .MuiInputBase-input::placeholder": {
                color: "#838489",
                opacity: 1,
              },
              "& .MuiOutlinedInput-root": {
                border: "none",
                outline: "none",
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                  outline: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
            }}
            InputProps={{ fullWidth: true }}
            fullWidth
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </Paper>
        <Paper
          className="textField-container"
          elevation={textFieldFocus ? 1 : 0}
          sx={{
            border: "1px solid #cfd9de",
            ":hover": {
              border: textFieldFocus
                ? "1px solid #0000004d"
                : "1px solid #cfd9de",
            },
            marginTop: "18px !important",
          }}
        >
          <TextField
            className="textField"
            rows={5}
            onChange={handleInputChange}
            placeholder="Share your knowledge or idea"
            name="context"
            required
            sx={{
              width: "100%",
              border: "none",
              "& .MuiInputBase-input::placeholder": {
                color: "#838489",
                opacity: 1,
              },
              "& .MuiOutlinedInput-root": {
                border: "none",
                outline: "none",
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                  outline: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
            }}
            InputProps={{ fullWidth: true }}
            multiline
            fullWidth
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </Paper>
        <Paper
          className="textField-container"
          elevation={textFieldFocus ? 1 : 0}
          sx={{
            height: "fit-content",
            border: "1px solid #cfd9de",
            ":hover": {
              border: textFieldFocus
                ? "1px solid #0000004d"
                : "1px solid #cfd9de",
            },
            width: "260px !important",
            marginTop: "18px !important",
          }}
        >
          <TextField
            name="tags"
            onChange={handleInputChange}
            className="textField"
            size="small"
            rows={5}
            placeholder="tags (optional) ie. #woodword #trend"
            sx={{
              width: "100%",
              border: "none",
              "& .MuiInputBase-input::placeholder": {
                color: "#838489",
                opacity: 1,
              },
              "& .MuiOutlinedInput-root": {
                border: "none",
                outline: "none",
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                  outline: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
            }}
            InputProps={{
              fullWidth: true,
              style: { padding: "14px 8px !important", fontSize: "14px" },
            }}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </Paper>

        <input
          type="file"
          accept="images/*"
          hidden
          id="post-image-input"
          multiple
          onChange={(e) => {
            handlePostImage(e, {
              imageData,
              setImageData,
              imageFileData,
            });
            // setImageData(parseImageData);
          }}
        />
        <div className="image-input-container">
          <label htmlFor="post-image-input" className="image-attach">
            <Tooltip title="Attach Image" className="tooltip">
              <AddPhotoAlternateRounded className="add-image" />
            </Tooltip>
          </label>
          <ImagePostSet imageData={imageData} setImageData={setImageData} />
        </div>

        <Button
          className="button"
          variant="contained"
          sx={{ textTransform: "none", fontWeight: "bold", color: "#fff" }}
          type="submit"
        >
          Post
        </Button>
      </postFetcher.Form>
    </Modal>
  );
}

function ImagePostSet({
  imageData,
  setImageData,
}: {
  imageData: { imgSrc: string; caption: string; id: string }[];
  setImageData: React.Dispatch<
    React.SetStateAction<{ id: string; imgSrc: string; caption: string }[]>
  >;
}) {
  if (imageData === null) {
    return [];
  }

  let imageElementSet: React.JSX.Element[] = [];
  imageData.forEach((image) => {
    if (image.imgSrc === "") return;
    imageElementSet.push(
      <div className="image-group">
        <img src={image.imgSrc} className="image" />
        <IconButton
          className="icon-container"
          onClick={() => {
            setImageData(
              imageData.filter((innerImage) => innerImage.id !== image.id)
            );
          }}
        >
          <CloseRounded className="icon" />
        </IconButton>
      </div>
    );
  });

  return imageElementSet;
}

async function handlePostImage(
  e: React.ChangeEvent<HTMLInputElement>,
  {
    imageData,
    setImageData,
    imageFileData,
  }: {
    imageData: { imgSrc: string; caption: string; id: string }[];
    setImageData: React.Dispatch<
      React.SetStateAction<{ id: string; imgSrc: string; caption: string }[]>
    >;
    imageFileData: MutableRefObject<
      { id: string; fileSrc: File }[] | undefined
    >;
  }
) {
  const files = e.target.files;

  const newImageData = await Promise.all(
    Array.from(files || []).map((file) => {
      const id = Math.random().toString(36);
      return new Promise<{ imgSrc: string; caption: string; id: string }>(
        (resolve) => {
          imageFileData.current?.push({ id, fileSrc: file });
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            resolve({
              id,
              imgSrc: reader.result as string,
              caption: "",
            });
          };
        }
      );
    })
  );
  // if (imageFileData !== null) setImageFileData([...imageFileData]);

  setImageData([...imageData, ...newImageData]);
}
