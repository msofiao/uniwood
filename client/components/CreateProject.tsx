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
import React, { MutableRefObject, useContext, useRef, useState } from "react";
import { useSubmit } from "react-router-dom";
import { TokenContext } from "../providers/TokenProvider";
import axiosClient from "../utils/axios";

export default function CreateProject({
  setPostModalView,
}: {
  setPostModalView: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const theme = useTheme();
  return (
    <Paper elevation={1} className="poster">
      <div className="pane1">
        <Avatar
          className="avatar"
          src={`${process.env.SERVER_PUBLIC}/${localStorage.getItem(
            "user_pfp"
          )}`}
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
export function CreateProjectModal({
  postModalView,
  setPostModalView,
}: {
  postModalView: boolean;
  setPostModalView: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [textFieldFocus, setTextFieldFocus] = useState(false);
  const [imageData, setImageData] = useState([
    { id: "", imgSrc: "", caption: "" },
  ]);
  const imageFileData = useRef<{ id: string; fileSrc: File }[]>([]);

  const postFormData = useRef(new FormData());
  const { accessToken } = useContext(TokenContext)!;

  const handlePostSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (imageData !== null) {
      console.log(imageFileData);
      imageData.forEach((image, index) => {
        const imgFile = imageFileData.current?.find(
          (imageFile) => imageFile.id === image.id
        );
        postFormData.current.append(`image-${index}`, imgFile?.fileSrc as File);
        if (image.caption !== "")
          postFormData.current.append(`caption-${index}`, image.caption);
      });
    }
    postFormData.current.append("accessToken", accessToken as string);
    axiosClient
      .post("/projects", postFormData.current, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((e) => {
        if (e?.data?.status === "success") setPostModalView(false);
      });
  };

  return (
    <Modal
      className="root-modals"
      open={postModalView}
      onClose={() => setPostModalView(!postModalView)}
    >
      <Paper className="post-modal">
        <div className="header-container">
          <Typography className="header" variant="h4">
            Create Project
          </Typography>
          <MenuItem
            className="icon-container"
            onClick={() => setPostModalView(!postModalView)}
          >
            <CloseRounded className="icon" />
          </MenuItem>
        </div>
        <div className="user-info">
          <Avatar src={`${process.env.SERVER_PUBLIC}/assets/logo_label.svg`} />
          <Typography className="name">Bryan Gonzales</Typography>
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
              // outline: textFieldFocus ? "1px solid #333371" : "none",
            },
          }}
        >
          <TextField
            className="textField"
            rows={7}
            placeholder="Share your knowledge or idea"
            sx={{
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
            multiline
            fullWidth
            onFocus={() => setTextFieldFocus(true)}
            onBlur={(e) => {
              setTextFieldFocus(false);
              postFormData.current.append("context", e.target.value);
            }}
          />
        </Paper>
        <label htmlFor="post-image-input" className="image-icon-container">
          <Tooltip title="Attach Image">
            <AddPhotoAlternateRounded className="icon" />
          </Tooltip>
        </label>
        <input
          type="file"
          accept="images/*"
          hidden
          id="post-image-input"
          multiple
          onChange={(e) => {
            console.log("fileChanged");
            handlePostImage(e, {
              imageData,
              setImageData,
              imageFileData,
            });
            // setImageData(parseImageData);
          }}
        />
        <div className="image-input-container">
          <ImagePostSet imageData={imageData} setImageData={setImageData} />
        </div>

        <Button
          className="button"
          variant="contained"
          sx={{ textTransform: "none", fontWeight: "bold", color: "#fff" }}
          onClick={handlePostSubmit}
        >
          Post
        </Button>
      </Paper>
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
  console.log("post triggered");
  if (imageData === null) {
    return [];
  }

  let imageElementSet: React.JSX.Element[] = [];
  console.log(imageData);
  imageData.forEach((image) => {
    if (image.imgSrc === "") return;
    imageElementSet.push(
      <div className="image-group">
        <img src={image.imgSrc} className="image" />
        <IconButton
          className="icon-container"
          onClick={(e) => {
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

function handleImageInput(
  e: React.ChangeEvent<HTMLInputElement>,
  imageData: { imgSrc: string; caption: string; id: string }[],
  setImageData: React.Dispatch<
    React.SetStateAction<{ id: string; imgSrc: string; caption: string }[]>
  >
) {
  console.log(imageData);
  if (e.target.files === null) return;
  Array.from(e.target.files).forEach((file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      imageData.push({
        id: Math.random().toString(36),
        imgSrc: reader.result as string,
        caption: "",
      });
    };
  });
  if (imageData !== null) setImageData([...imageData]);
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

  setImageData([...imageData, ...newImageData]);
}
