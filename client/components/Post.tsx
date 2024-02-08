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
import React, {
  MouseEvent,
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { dateWhenFormat } from "../utils/dateTools";
import { UserInfoContext } from "../providers/UserInfoProvider";
import axiosClient from "../utils/axios";
import { useNavigate } from "react-router-dom";

const PostProvider = createContext<PostContext | null>(null);

export default function Post({ postParam }: { postParam: Post }) {
  const [post, setPost] = useState<(Post & { author: PostAuthor }) | null>(
    null
  );
  const [textVisible, setTextVisibility] = useState<boolean>(false);
  const initializeContextData = () => {
    setPost(postParam);
  };
  const loading = post === null;
  const navigate = useNavigate();

  const handleTagSearch = (
    e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>
  ) => {
    navigate(`/search?q=${e.currentTarget.textContent!.slice(1)}`);
  };
  useEffect(() => {
    initializeContextData();
  }, []);

  const tags = post?.tags.map((tag) => {
    if (tag === "") return <></>;
    return (
      <span
        onClick={handleTagSearch}
        className="text-blue-400 hover:text-blue-700 hover:underline hover:cursor-pointer"
      >
        #{tag}
      </span>
    );
  }) ?? [<></>];

  return loading ? (
    <p>loading...</p>
  ) : (
    <PostProvider.Provider value={{ post, setPost }}>
      <Paper className="post">
        <div className="user-profile">
          <Avatar
            className="avatar"
            src={`${process.env.SERVER_PUBLIC}/${post.author.pfp}`}
          />
          <div className="post-details">
            <Typography className="name" variant="body1">
              {post.author.fullname}
            </Typography>
            <Typography
              // className="post-date"
              variant="subtitle2"
              sx={{ color: "#536471" }}
            >
              {dateWhenFormat(new Date(post.createdAt))}
            </Typography>
          </div>
        </div>
        <div className="line line__1"></div>
        {post.title && (
          <Typography className="my-2 font-bold" variant="h5">
            {post.title}
          </Typography>
        )}
        {post.context.length < 200 ? (
          <>
            <Typography variant="body1">{post.context}</Typography>
            {tags}
          </>
        ) : (
          <>
            <Typography variant="body1">
              {textVisible ? post.context : post.context.slice(0, 200) + "..."}
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
            {tags}
          </>
        )}
        <ImageList medias={post.media} />
        <PostActions />
      </Paper>
    </PostProvider.Provider>
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
        className="image"
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

function PostActions() {
  const { post, setPost } = useContext(PostProvider)!;
  const theme = useTheme();
  const [fillHeart, setFillHeart] = useState(
    post?.liked_by_users_id.includes(
      (localStorage.getItem("id") as string) ?? false
    )
  );
  const [commentModalView, setCommentModalView] = useState(false);
  const [likeCountState, setLikeCountState] = useState(
    post?.liked_by_users_id.length ?? 0
  );
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
            {post?.comments.length === 0 ? "" : post?.comments.length}
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
              "/posts/likeToggle",
              {
                postId: post?.id,
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
          commentModalView={commentModalView}
          setCommentModalView={setCommentModalView}
        />
      </div>
    </>
  );
}

function CommentModal({
  commentModalView,
  setCommentModalView,
}: {
  setCommentModalView: React.Dispatch<React.SetStateAction<boolean>>;
  commentModalView: boolean;
}) {
  const { post } = useContext(PostProvider)!;
  const commentRef = useRef<HTMLInputElement>(null);
  const [newComment, setNewComment] = useState<CommentProps[]>([]);
  const { userInfo } = useContext(UserInfoContext)!;
  const genId = useId();
  const clearCommentBox = () => {
    commentRef.current!.value = "";
  };

  const loading = userInfo === null;
  return loading ? (
    <div>Loading...</div>
  ) : (
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
              <Comment key={index} comment={comment} />
            ))}
            {post?.comments.map((comment, index) => (
              <Comment key={index} comment={comment} />
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
              src={`${process.env.SERVER_PUBLIC}/${userInfo.pfp}`}
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
                      postId: post?.id,
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
                      id: userInfo.id,
                      fullname: userInfo.fullname,
                      affiliation: userInfo.affiliation,
                      pfp: userInfo.pfp,
                      cover: userInfo.cover,
                      address: userInfo.address,
                      username: userInfo.username,
                      bio: userInfo.bio,
                    },
                    id: genId,
                    content: commentRef.current?.value ?? "",
                    createdAt: new Date().toISOString(),
                    up_voted_by_users_id: [],
                    down_voted_by_users_id: [],
                  });
                  e.currentTarget.value = "";
                  setNewComment([...newComment]);
                  clearCommentBox();
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
}

function Comment({
  comment,
}: {
  comment: CommentProps & { author: CommentAuthor };
}) {
  return (
    <div className="comment">
      <Avatar
        className="avatar"
        src={`${process.env.SERVER_PUBLIC}/${comment.author.pfp}`}
      />
      <div className="comment-details">
        <Typography className="username">{comment.author.fullname}</Typography>
        <Typography className="context">{comment.content}</Typography>
        <Typography className="date">
          {dateWhenFormat(new Date(comment.createdAt))}
        </Typography>
      </div>
    </div>
  );
}
