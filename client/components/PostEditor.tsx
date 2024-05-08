import { CloseRounded, AddPhotoAlternateRounded } from "@mui/icons-material";
import { Modal, Avatar, Tooltip, IconButton, Chip } from "@mui/material";
import React, {
  Dispatch,
  FormEvent,
  MutableRefObject,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import { Input as TextField, Button } from "@mui/base";
import { useFetcher } from "react-router-dom";
import { UserInfoContext } from "../providers/UserInfoProvider";
import axiosClient from "../utils/axios";
import { AlertContext } from "../providers/AlertProvider";
import { PostContext } from "./Post";
import { TokenContext } from "../providers/TokenProvider";

const EditPostContext = React.createContext<EditPostContextProps | null>(null);

export function PostEditor({
  postModalView,
  setPostModalView,
  post,
  setPost,
}: {
  postModalView: boolean;
  setPostModalView: React.Dispatch<React.SetStateAction<boolean>>;
  post: Post;
  setPost: React.Dispatch<React.SetStateAction<Post | null>>;
}) {
  const { accessToken } = useContext(TokenContext)!;
  const [mediaData, setMediaData] = useState<MediaDataProps[]>([]);
  const imageFileData = useRef<{ fileSrc: File; id: string }[]>([]);
  const postFormData = useRef(new FormData());
  const postFetcher = useFetcher();
  const { setAlert } = useContext(AlertContext);

  const [postTmp, setPostTmp] = useState<Post>(post);

  const handlePostSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Attach data to form
    postFormData.current.append("context", postTmp.context);
    postFormData.current.append("title", postTmp.title);
    postFormData.current.append("tags", postTmp.tags.toString());
    postFormData.current.append("savedMedia", JSON.stringify(postTmp.media));
    postFormData.current.append("postId", postTmp.id);
    mediaData.forEach((media, index) => {
      const file = imageFileData.current.find(
        (fileData) => fileData.id === media.id,
      );
      if (!file) return;

      if (media.type.match(/image/))
        postFormData.current.append(`image-${index}`, file.fileSrc);

      if (media.type.match(/video/))
        postFormData.current.append(`video-${index}`, file.fileSrc);
    });

    axiosClient
      .put("/posts", postFormData.current, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setPostModalView(!postModalView);
        setAlert({
          severity: "success",
          message: "Updated Succesfully",
          visible: true,
        });
        setMediaData([]);
        console.log(res.data.data);
        setPost({ ...postTmp, media: res.data.data.updatedMedia });
        postFormData.current = new FormData();
      })
      .catch(() => {
        setPostModalView(!postModalView);
        setAlert({
          severity: "error",
          message: "Failed to update post",
          visible: true,
        });
      });
  };

  return (
    postModalView && (
      <Modal
        open={postModalView}
        onClose={() => setPostModalView(!postModalView)}
      >
        <EditPostContext.Provider value={{ post }}>
          <postFetcher.Form
            className="absolute left-1/2 top-1/2 flex  max-h-[85%] w-[525px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg bg-white  shadow-lg"
            method="POST"
            action="/posts"
            onSubmit={handlePostSubmit}
            encType="multipart/form-data"
          >
            <ModalHeader setModalView={setPostModalView} />
            <UserInfo />
            <div className="w-full overflow-y-auto pb-5">
              <PostForm
                postFormDataRef={postFormData}
                postTmp={postTmp}
                setPostTmp={setPostTmp}
              />
              <ImageInputSet
                mediaData={mediaData}
                imageFileData={imageFileData}
                setMediaData={setMediaData}
                postTmp={postTmp}
                setPosTmp={setPostTmp}
              />
            </div>

            <div className="sticky bottom-0 w-full border-t-2 border-solid border-secondary-100 bg-white px-5 py-2 backdrop-blur-sm">
              <Button
                className="ml-auto block rounded-md bg-secondary-300 px-5 py-2 font-bold normal-case text-white hover:bg-secondary-400 active:bg-secondary-500 "
                type="submit"
              >
                Update Post
              </Button>
            </div>
          </postFetcher.Form>
        </EditPostContext.Provider>
      </Modal>
    )
  );
}

function ImageInputSet({
  mediaData,
  imageFileData,
  setMediaData,
  postTmp,
  setPosTmp,
}: {
  mediaData: MediaDataProps[];
  imageFileData: ImageFileDataProps;
  setMediaData: SetMediaDataType;
  postTmp: Post;
  setPosTmp: Dispatch<SetStateAction<Post>>;
}) {
  const handlePostImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    const processMedia = (file: File) => {
      const id = Math.random().toString(36);
      if (file.type.match(/image/)) {
        return new Promise<MediaDataProps>((resolve) => {
          imageFileData.current?.push({ id, fileSrc: file });
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            resolve({
              id,
              src: reader.result as string,
              caption: "",
              type: file.type,
            });
          };
        });
      } else {
        return new Promise<MediaDataProps>((resolve) => {
          imageFileData.current?.push({ id, fileSrc: file });
          resolve({
            id,
            src: URL.createObjectURL(file),
            caption: "",
            type: file.type,
          });
        });
      }
    };

    const newImageData = await Promise.all(
      Array.from(files || []).map(processMedia),
    );

    setMediaData([...mediaData, ...newImageData]);
  };

  return (
    <div className="mt-4 flex flex-wrap gap-3 px-5 [&*]:w-full">
      <input
        type="file"
        hidden
        id="post-image-input"
        multiple
        onChange={handlePostImage}
        accept="image/*, video/*"
      />
      <label
        htmlFor="post-image-input"
        className="group flex size-[100px] items-center justify-center rounded-lg bg-secondary-200 hover:cursor-pointer hover:bg-secondary-300"
      >
        <Tooltip
          title="Attach Image"
          className="text-gray-700 group-hover:text-gray-100"
        >
          <AddPhotoAlternateRounded />
        </Tooltip>
      </label>
      <ImageUrlPostSet postTmp={postTmp} setPosTmp={setPosTmp} />
      <ImagePostSet mediaData={mediaData} setMediaData={setMediaData} />
    </div>
  );
}

function PostForm({ postTmp, setPostTmp }: PostFormProps) {
  const updateValues = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPostTmp({ ...postTmp, [e.target.name]: e.target.value });
  };

  return (
    <div className="scroll-y-auto mt-5 flex w-full flex-col gap-5 px-5 text-slate-800">
      <TextField
        onChange={updateValues}
        slotProps={{
          input: {
            className:
              "bg-slate-100 w-full rounded-lg p-3 border focus-visible:outline-none hover:border-secondary-300 focus-visible:border-secondary-400 border-2 border-secondary-200",
          },
        }}
        value={postTmp.title}
        placeholder="Title (Optional)"
        name="title"
      />
      <TextField
        slotProps={{
          input: {
            className:
              "bg-slate-100 w-full rounded-lg p-3 border hover:border-secondary-300 focus-visible:outline-none focus-visible:border-secondary-400 border-2 border-secondary-200 resize-none",
          },
        }}
        value={postTmp.context}
        rows={5}
        onChange={updateValues}
        placeholder="Share your knowledge or idea"
        name="context"
        required
        multiline
      />
      <InputTag postTmp={postTmp} setPostTmp={setPostTmp} />
    </div>
  );
}

function ImageUrlPostSet({
  postTmp,
  setPosTmp,
}: {
  postTmp: Post;
  setPosTmp: Dispatch<SetStateAction<Post>>;
}) {
  const { post } = useContext(PostContext)!;
  const processMediaDataToElement = (media: {
    filename: string;
    caption?: string;
  }) => {
    if (media.filename.match(/.(jpg|png|gif|avif|webp|heic|heif)/)) {
      return (
        <div className="relative" key={media.filename.slice(0, 10)}>
          <img
            src={`${process.env.SERVER_PUBLIC}/${media.filename}`}
            className="size-[100px] rounded-lg"
          />
          <IconButton
            title="Remove Image"
            className="absolute -right-3 -top-3 size-8 border-2 border-solid border-gray-400 bg-gray-100 hover:bg-gray-200"
            onClick={() => {
              if (post) {
                setPosTmp({
                  ...postTmp,
                  media: postTmp.media.filter(
                    (subMedia) => subMedia.filename !== media.filename,
                  ),
                });
              }
            }}
          >
            <CloseRounded className="icon" />
          </IconButton>
        </div>
      );
    } else {
      return (
        <div className="relative">
          <video
            src={`${process.env.SERVER_PUBLIC}/${media.filename}`}
            className="size-[100px] rounded-lg"
          />
          <IconButton
            title="Remove Image"
            className="absolute -right-3 -top-3 size-8 border-2 border-solid border-gray-400 bg-gray-100 hover:bg-gray-200"
            onClick={() => {
              if (post) {
                setPosTmp({
                  ...postTmp,
                  media: postTmp.media.filter(
                    (subMedia) => subMedia.filename !== media.filename,
                  ),
                });
              }
            }}
          >
            <CloseRounded className="icon" />
          </IconButton>
        </div>
      );
    }
  };

  return <>{postTmp.media.map(processMediaDataToElement)}</>;
}

function ImagePostSet({
  mediaData,
  setMediaData,
}: {
  mediaData: MediaDataProps[];
  setMediaData: Dispatch<SetStateAction<MediaDataProps[]>>;
}) {
  const processMediaDataToElement = (media: MediaDataProps, index: number) => {
    if (media.type.match(/image/)) {
      return (
        <div className="relative" key={index}>
          <img src={media.src} className="size-[100px] rounded-lg" />
          <IconButton
            title="Remove Image"
            className="absolute -right-3 -top-3 size-8 border-2 border-solid border-gray-400 bg-gray-100 hover:bg-gray-200"
            onClick={() => {
              setMediaData(
                mediaData.filter((innerImage) => innerImage.id !== media.id),
              );
            }}
          >
            <CloseRounded className="icon" />
          </IconButton>
        </div>
      );
    } else {
      return (
        <div className="relative">
          <video src={media.src} className="size-[100px] rounded-lg" />
          <IconButton
            title="Remove Image"
            className="absolute -right-3 -top-3 size-8 border-2 border-solid border-gray-400 bg-gray-100 hover:bg-gray-200"
            onClick={() => {
              setMediaData(
                mediaData.filter((innerImage) => innerImage.id !== media.id),
              );
            }}
          >
            <CloseRounded className="icon" />
          </IconButton>
        </div>
      );
    }
  };

  return <>{mediaData.map(processMediaDataToElement)}</>;
}

function UserInfo() {
  const { userInfo } = useContext(UserInfoContext)!;

  return (
    <div className=" flex items-center gap-2 rounded-sm border-b-4 border-solid border-b-secondary-400 px-5 pb-3 font-semibold text-slate-800">
      <Avatar
        className="-z-10"
        src={`${process.env.SERVER_PUBLIC}/${userInfo.pfp}`}
      />
      <p>{userInfo.fullname}</p>
    </div>
  );
}

function ModalHeader({ setModalView }: ModalHeaderProps) {
  const closeModal = () => setModalView(false);

  return (
    <div className="sticky top-0 mb-3 flex w-full items-center justify-center border-b-2 border-solid border-secondary-100 bg-white px-5 py-3 text-slate-800">
      <p className="z-50 text-xl font-extrabold text-slate-800">Update Post</p>
      <IconButton className="absolute right-3" onClick={closeModal}>
        <CloseRounded />
      </IconButton>
    </div>
  );
}

function InputTag({ postTmp, setPostTmp }: InputTagProps) {
  const { setAlert } = useContext(AlertContext)!;
  const [inputValue, setInputValue] = useState<string>("");
  const [inputFocused, setInputFocused] = useState<boolean>(false);

  const ref = useRef<HTMLInputElement>(null);
  const addInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!e.key.match(/( |Enter)/)) return;

    let tag = e.currentTarget.value;
    if ((e.key === " " && tag === "") || (e.key === "Enter" && tag === "")) {
      setInputValue("");
      e.preventDefault();
      return;
    }
    if (postTmp.tags.find((e) => tag === e)) {
      setInputValue("");
      return setAlert({
        visible: true,
        severity: "warning",
        message: "Word Already added",
      });
    }
    setInputValue("");
    setPostTmp({ ...postTmp, tags: [...postTmp.tags, tag] });
    e.preventDefault();
  };
  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
  };
  const removeChip = (word: string) => () => {
    setPostTmp({
      ...postTmp,
      tags: postTmp.tags.filter((tag) => tag !== word),
    });
  };
  const focusInput = () => {
    ref.current?.focus();
  };
  const inputFocusIn = () => setInputFocused(true);

  const focusFormStyle = inputFocused
    ? "border-secondary-400"
    : "border-secondary-200";

  return (
    <div
      className={`${focusFormStyle} ${inputFocused || "hover:border-secondary-300"} flex min-h-[55.2px] w-full flex-wrap justify-center rounded-lg border-2 border-solid bg-slate-100 p-2 hover:cursor-text `}
      onClick={focusInput}
    >
      {postTmp.tags.map((tag) => (
        <Chip
          key={tag}
          className="max-w flex-gow mb-1 ml-1 min-w-[10px] border-2 border-solid border-secondary-300  bg-secondary-200  font-body text-slate-800 hover:cursor-default focus-visible:border-none"
          label={tag}
          onDelete={removeChip(tag)}
        />
      ))}
      <input
        className="ml-1 mr-auto bg-transparent font-mono  focus-visible:outline-none"
        type="text"
        placeholder={postTmp.tags.length === 0 ? "tags" : ""}
        ref={ref}
        name="tag"
        size={inputValue === "" ? 4 : inputValue.length + 1}
        onChange={handleInputValue}
        value={inputValue}
        onFocusCapture={inputFocusIn}
        onKeyDown={addInterest}
      />
    </div>
  );
}

// Types

interface EditPostContextProps {
  post: Post;
}
interface InputTagProps {
  postTmp: Post;
  setPostTmp: Dispatch<SetStateAction<Post>>;
}

interface ModalHeaderProps {
  setModalView: Dispatch<SetStateAction<boolean>>;
}

interface PostFormProps {
  postFormDataRef: MutableRefObject<FormData>;
  postTmp: Post;
  setPostTmp: Dispatch<SetStateAction<Post>>;
}

interface MediaDataProps {
  src: string;
  caption: string;
  id: string;
  type: string;
}

type ImageFileDataProps = MutableRefObject<
  {
    fileSrc: File;
    id: string;
  }[]
>;

type SetMediaDataType = Dispatch<SetStateAction<MediaDataProps[]>>;
