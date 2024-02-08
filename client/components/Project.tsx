import {
  FavoriteRounded,
  ChatRounded,
  FavoriteBorderRounded,
  ChatBubbleOutlineRounded,
  CloseRounded,
  SendRounded,
} from "@mui/icons-material";
import {
  Paper,
  Avatar,
  Typography,
  Button,
  Box,
  MenuItem,
  useTheme,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router-dom";
import { TokenContext } from "../providers/TokenProvider";
import { dateWhenFormat } from "../utils/dateTools";
import axiosClient from "../utils/axios";

export default function Project({
  postData,
}: {
  postData: {
    id: string;
    context: string;
    title: string | null;
    tags: string[] | null;
    liked_by_users_id: string[];
    createdAt: Date;
    media: {
      filename: string;
      caption?: string;
    }[];
    author: {
      id: string;
      firstname: string;
      lastname: string;
      proffeciency: string;
      affiliation: string;
      user_image: {
        pfp_name: string;
        cover_name: string;
      };
    };
    comments?: {
      content: string;
      createdAt: string;
      up_voted_by_users_id: string[];
      author: {
        firstname: string;
        lastname: string;
        proffeciency: string;
        affilitation: string;
        user_image: { pfp_name: string; cover_name: string };
      };
    }[];
  };
}) {
  const [textVisible, setTextVisibility] = useState(false);

  return (
    <>
      <Paper className="post">
        <div className="user-profile">
          <Avatar
            className="avatar"
            src={`${process.env.SERVER_PUBLIC}/${postData.author.user_image.pfp_name}`}
          />
          <div className="post-details">
            <Typography className="name" variant="body1">
              {`${postData.author.firstname[0].toUpperCase()}${postData.author.firstname.slice(
                1
              )} ${postData.author.lastname[0].toUpperCase()}${postData.author.lastname.slice(
                1
              )}`}
            </Typography>
            <Typography
              // className="post-date"
              variant="subtitle2"
              sx={{ color: "#536471" }}
            >
              {dateWhenFormat(new Date(postData.createdAt))}
            </Typography>
          </div>
        </div>
        <div className="line line__1"></div>
        <Typography variant="h5" fontWeight="bold">
          {postData.title}
        </Typography>
        {postData.context.length < 200 ? (
          <Typography variant="body1">{postData.context}</Typography>
        ) : (
          <>
            <Typography variant="body1">
              {textVisible
                ? postData.context
                : postData.context.slice(0, 200) + "..."}
              <Button
                variant="text"
                color="secondary"
                sx={{
                  textTransform: "none",
                  textDecoration: "underline",
                  display: "inline-block",
                }}
                onClick={() => setTextVisibility(!textVisible)}
              >
                {textVisible ? "Show Less" : "Show More"}
              </Button>
            </Typography>
          </>
        )}
        <ImageList medias={postData.media} />
        <PostActions
          postId={postData.id}
          userLiked={postData.liked_by_users_id.includes(postData.author.id)}
          likeByUserCount={postData.liked_by_users_id.length ?? 0}
          commentCount={postData.comments?.length ?? 0}
          commentData={postData.comments ?? undefined}
        />
      </Paper>
    </>
  );
}
function ImageList({
  medias,
}: {
  medias: { filename: string; caption?: string }[];
}) {
  let gridCols = "";
  let gridRows = "";
  let gridBluePrint: { gridCol: string; gridRow: string }[] = [{}] as {
    gridCol: string;
    gridRow: string;
  }[];

  switch (medias.length) {
    case 1:
      gridCols = "1fr";
      gridRows = "1fr";
      gridBluePrint[0] = { gridCol: "1", gridRow: "1" };
      break;
    case 2:
      gridCols = "1fr";
      gridRows = "1fr 1fr";
      gridBluePrint[0] = { gridCol: "1/2", gridRow: "1/2" };
      gridBluePrint[1] = { gridCol: "1/2", gridRow: "2/3" };
      break;
    case 3:
      gridCols = "1fr 1fr";
      gridCols = "1fr 1fr";
      gridBluePrint[0] = { gridCol: "1/1", gridRow: "1/1" };
      gridBluePrint[1] = { gridCol: "2/3", gridRow: "1/1" };
      gridBluePrint[2] = { gridCol: "1/3 ", gridRow: "2/2" };
      break;
    case 4:
      gridCols = "1fr 1fr";
      gridRows = "1fr 1fr";
      gridBluePrint[0] = { gridCol: "1/2", gridRow: "1/2" };
      gridBluePrint[1] = { gridCol: "2/3", gridRow: "1/2" };
      gridBluePrint[2] = { gridCol: "1/2", gridRow: "2/3" };
      gridBluePrint[3] = { gridCol: "2/3", gridRow: "2/3" };
      break;
    default:
      gridRows = "1fr 1fr";
      gridCols = "1fr 1fr 1fr 1fr 1fr 1fr";
      gridBluePrint[0] = { gridCol: "1/3", gridRow: "1/2" };
      gridBluePrint[1] = { gridCol: "3/5", gridRow: "1/2" };
      gridBluePrint[2] = { gridCol: "5/7", gridRow: "1/2" };
      gridBluePrint[3] = { gridCol: "1/4", gridRow: "2/3" };
      gridBluePrint[4] = { gridCol: "4/7", gridRow: "2/3" };
  }
  const imgageSet = medias.map((media, index) => {
    return (
      <img
        key={index}
        src={`${process.env.SERVER_PUBLIC}/${media.filename}`}
        style={{
          gridRow: gridBluePrint[index].gridRow,
          gridColumn: gridBluePrint[index].gridCol,
          objectFit: "cover",
          display: "block",
        }}
        width="100%"
        height="100%"
        alt="post"
        className="image"
        z-index={-1}
      />
    );
  });
  return (
    <Box
      className="image-list"
      sx={{
        display: "grid",
        gridGap: "2px",
        gridTemplateRows: gridRows,
        gridTemplateColumns: gridCols,
        justifyContent: "center",
        alignItems: "center",
        // maxHeight: "500px",
        overflow: "hidden",
      }}
    >
      {...imgageSet}
    </Box>
  );
}

function PostActions({
  userLiked,
  postId,
  likeByUserCount,
  commentCount,
  commentData,
}: {
  userLiked: boolean;
  postId: string;
  likeByUserCount: number;
  commentCount: number;
  commentData?: {
    content: string;
    createdAt: string;
    up_voted_by_users_id: string[];
    author: {
      firstname: string;
      lastname: string;
      proffeciency: string;
      affilitation: string;
      user_image: { pfp_name: string; cover_name: string };
    };
  }[];
}) {
  const theme = useTheme();
  const [fillHeart, setFillHeart] = useState(userLiked);
  const [commentModalView, setCommentModalView] = useState(false);
  const [likeCountState, setLikeCountState] = useState(likeByUserCount);
  return (
    <>
      <div className="post-interactions">
        <MenuItem className="interaction-group">
          <FavoriteRounded className="icon" />
          <Typography
            className="context"
            variant="subtitle2"
            color={theme.palette.text.secondary}
          >
            {likeCountState === 0 ? "" : likeCountState}
          </Typography>
        </MenuItem>
        <MenuItem className="interaction-group">
          <ChatRounded className="icon" />
          <Typography
            className="context"
            variant="subtitle2"
            color={theme.palette.text.secondary}
          >
            {commentCount === 0 ? "" : commentCount}
          </Typography>
        </MenuItem>
      </div>
      <div className="line line__2"></div>
      <div className="post-actions">
        <MenuItem
          className="action-container"
          color="primary"
          onClick={(e) => {
            axiosClient.patch(
              "/project/likeToggle",
              {
                postId: postId,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            );
            setLikeCountState(likeCountState + (fillHeart ? -1 : 1));
            setFillHeart(!fillHeart);
          }}
        >
          {fillHeart ? (
            <FavoriteRounded />
          ) : (
            <FavoriteBorderRounded className="icon" />
          )}
          <Typography className="context">Like</Typography>
        </MenuItem>
        <MenuItem
          className="action-container"
          onClick={() => setCommentModalView(!commentModalView)}
          color="primary"
        >
          <ChatBubbleOutlineRounded className="icon" />
          <Typography className="context">Comment</Typography>
        </MenuItem>
        <CommentModal
          postId={postId}
          commentData={commentData ?? undefined}
          commentModalView={commentModalView}
          setCommentModalView={setCommentModalView}
        />
      </div>
    </>
  );
}

function CommentModal({
  postId,
  commentData,
  commentModalView,
  setCommentModalView,
}: {
  postId: string;
  commentModalView: boolean;
  setCommentModalView: React.Dispatch<React.SetStateAction<boolean>>;
  commentData?: {
    content: string;
    createdAt: string;
    up_voted_by_users_id: string[];
    author: {
      firstname: string;
      lastname: string;
      proffeciency: string;
      affilitation: string;
      user_image: { pfp_name: string; cover_name: string };
    };
  }[];
}) {
  const commentRef = useRef<HTMLInputElement>(null);
  const [newComment, setNewComment] = useState<
    {
      content: string;
      createdAt: string;
      up_voted_by_users_id: string[];
      author: {
        firstname: string;
        lastname: string;
        proffeciency: string;
        affilitation: string;
        user_image: { pfp_name: string; cover_name: string };
      };
    }[]
  >([]);
  console.log({ newComment });
  return (
    <Modal
      className="root-modals"
      open={commentModalView}
      onClose={() => setCommentModalView(!commentModalView)}
    >
      <Paper className="comment-modal" elevation={12}>
        <Box style={{ position: "relative", width: "100%", height: "100%" }}>
          <div className="header-container">
            <Typography className="header" variant="h4">
              Bryan's Post
            </Typography>
            <MenuItem
              className="close-modal-group"
              onClick={() => setCommentModalView(!commentModalView)}
            >
              <CloseRounded className="icon" />
            </MenuItem>
          </div>
          <div className="comment-list">
            {newComment?.map((comment, index) => (
              <CommentData key={index} commentData={comment} />
            ))}
            {commentData?.map((comment, index) => (
              <CommentData key={index} commentData={comment} />
            )) ?? (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              ></Box>
            )}
          </div>
          <Paper className="user-comment" elevation={2}>
            <Avatar
              className="avatar"
              src={`${process.env.SERVER_PUBLIC}/${localStorage.getItem(
                "user_pfp"
              )}`}
            />
            <form style={{ width: "100%" }}>
              <TextField
                className="input"
                placeholder="Write a comment"
                multiline
                rows={2}
                sx={{
                  "& .MuiInputBase-input::placeholder": {
                    color: "#838489",
                    opacity: 1,
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "none",
                      // This removes the border
                    },
                    "&:hover fieldset": {
                      borderColor: "none", // This removes the hover effect
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "none", // This removes the focus effect
                    },
                  },
                }}
                inputProps={{ ref: commentRef }}
                fullWidth
                required
              />
              <IconButton
                type="submit"
                className="icon-container"
                onClick={(e) => {
                  e.preventDefault();
                  axiosClient.post(
                    "/comments",
                    {
                      comment: commentRef.current?.value,
                      postId: postId,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "accessToken"
                        )}`,
                      },
                    }
                  );
                  newComment.push({
                    author: {
                      firstname: localStorage.getItem("user_fullname") || "",
                      lastname: "",
                      proffeciency: "something",
                      affilitation: "something",
                      user_image: {
                        pfp_name: localStorage.getItem("user_pfp") ?? "",
                        cover_name: "",
                      },
                    },
                    content: commentRef.current?.value ?? "",
                    createdAt: new Date().toISOString(),
                    up_voted_by_users_id: [],
                  });
                  e.currentTarget.value = "";
                  setNewComment([...newComment]);
                }}
              >
                <SendRounded className="icon" />
              </IconButton>
            </form>
          </Paper>
        </Box>
      </Paper>
    </Modal>
  );
  function CommentData({
    commentData,
  }: {
    commentData: {
      content: string;
      createdAt: string;
      up_voted_by_users_id: string[];
      author: {
        firstname: string;
        lastname: string;
        proffeciency: string;
        affilitation: string;
        user_image: { pfp_name: string; cover_name: string };
      };
    };
  }) {
    return (
      <div className="comment">
        <Avatar
          className="avatar"
          src={`${process.env.SERVER_PUBLIC}/assets/sample-profile-pic.png`}
        />
        <div className="comment-details">
          <Typography className="username">
            {commentData.author.firstname + commentData.author.lastname}
          </Typography>
          <Typography className="context">{commentData.content}</Typography>
          <Typography className="date">
            {dateWhenFormat(new Date(commentData.createdAt))}
          </Typography>
        </div>
      </div>
    );
  }
}
