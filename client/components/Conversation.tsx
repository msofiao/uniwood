import {
  ClearRounded,
  EmojiEmotionsRounded,
  ImageRounded,
  InfoRounded,
  SendRounded,
  VideocamRounded,
} from "@mui/icons-material";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Avatar,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import React, {
  Dispatch,
  forwardRef,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import genId from "../utils/genId";
import { MessageComponentContext } from "../context/mesComContext";
import axiosClient from "../utils/axios";
import { TokenContext } from "../providers/TokenProvider";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { convoDateFormat } from "../utils/dateTools";
import { UserInfoContext } from "../providers/UserInfoProvider";
import { socketClient } from "../utils/socketIO";
import { messageSender } from "../api/converse";
import dateTool from "date-and-time";

export default function Conversation() {
  const params = useParams<{
    recipientId: string | undefined;
    converseId: string | undefined;
  }>();
  const { accessToken } = useContext(TokenContext)!;
  const { searchNewUserFocus } = useContext(MessageComponentContext)!;
  const convoDivRef = useRef<HTMLDivElement>(null);
  const [convo, setConvo] = useState<IConvo | null>(null);

  const getConversation = () => {
    if (params.converseId && accessToken) {
      axiosClient
        .get(`/converse?converseId=${params.converseId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          if (res.status === 200) setConvo(res.data.data);
        });
      console.log("get conversation");
    } else if (params.recipientId) {
      console.log("new conversation");
      setConvo(null);
    }
  };
  const listenToCovo = () => {
    if (!params.converseId) return;

    socketClient.on(`message/${params.converseId}`, (message: IMessage) => {
      setConvo((prev) => {
        if (prev === null) return prev;
        return { ...prev, messages: [...prev.messages, message] };
      });
    });

    return () => {
      socketClient.off(`message/${params.converseId}`);
    };
  };

  const scrollDown = () => {
    if (!convoDivRef.current) return;

    convoDivRef.current.scrollTop = convoDivRef.current.scrollHeight;
  };

  useEffect(getConversation, [
    params.converseId,
    params.recipientId,
    accessToken,
  ]);
  useEffect(listenToCovo, [params.converseId, accessToken]);
  useEffect(scrollDown, [convo]);

  return (
    <div className="border-r-solid grid-col grid max-h-screen grid-rows-[auto_1fr_auto] border-r-2 border-r-slate-300">
      <Header setConvo={setConvo} />
      <ConversationLayout ref={convoDivRef}>
        {!searchNewUserFocus && convo && (
          <ConvoContent messages={convo.messages} />
        )}
      </ConversationLayout>

      {searchNewUserFocus || <SendInput />}
    </div>
  );
}

function Header({
  setConvo,
}: {
  setConvo: Dispatch<SetStateAction<IConvo | null>>;
}) {
  const navigate = useNavigate();
  const { searchNewUserFocus, setSearchNewUserFocus, recipientInfo } =
    useContext(MessageComponentContext)!;
  const [searchNewUser, setSearchNewUser] = useState("");
  const [searchUserResult, setSearchUserResult] = useState<UserProfileInfo[]>(
    [],
  );
  const { accessToken } = useContext(TokenContext)!;

  const handleSearchUserBlur = () => {
    setSearchNewUserFocus(false);
  };
  const requestSearchedUser = () => {
    if (searchNewUser === "") {
      setSearchUserResult([]);
      return;
    }
    axiosClient
      .get(`/users/search?q=${searchNewUser}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setSearchUserResult(res.data.data);
      });
  };

  const handleSearchUserChange = (
    e: React.SyntheticEvent<Element, Event>,
    value: string,
  ) => {
    setSearchNewUser(value);
  };

  useEffect(requestSearchedUser, [searchNewUser]);
  return (
    <div className="flex border-b-2 border-b-slate-300 px-4 py-[8px]">
      <div className="flex w-full items-center gap-3">
        {searchNewUserFocus ? (
          <Autocomplete
            className="min-w-[250px] rounded-lg border-2 border-secondary-400 px-2 focus-within:border-primary-400"
            options={searchUserResult}
            renderInput={AutoCompleteInput(
              searchNewUserFocus,
              handleSearchUserBlur,
            )}
            renderOption={AutocompleteOptions({
              accessToken,
              navigate,
              handleSearchUserBlur,
              setConvo,
            })}
            noOptionsText="No users found"
            componentsProps={{
              paper: {
                className: `${searchNewUser === "" ? "hidden" : "absolute"} w-full rounded-b-lg mt-[2px] rounded-t-none shadow-lg`,
              },
            }}
            popupIcon={null}
            getOptionLabel={(option) => option.fullname}
            onInputChange={handleSearchUserChange}
            inputValue={searchNewUser}
          />
        ) : (
          <>
            <Avatar
              className="size-[40px] gap-4"
              src={`${process.env.SERVER_PUBLIC}/${recipientInfo?.pfp}`}
            />
            <p className="items-center font-body text-base font-bold text-slate-800">
              {recipientInfo?.fullname}
            </p>
          </>
        )}
      </div>
      <div className="ml-auto flex items-center gap-1 text-primary-400">
        <IconButton className="text-primary-400" disabled={searchNewUserFocus}>
          <VideocamRounded className="size-7" />
        </IconButton>
        <IconButton className="text-primary-400" disabled={searchNewUserFocus}>
          <InfoRounded className="size-7" />
        </IconButton>
      </div>
    </div>
  );
}

const ConversationLayout = forwardRef<HTMLDivElement, ConversastionLayoutProps>(
  ({ children }, ref) => (
    <div
      className="flex max-h-full flex-col gap-2 overflow-y-auto px-6 py-6"
      ref={ref}
    >
      {children}
    </div>
  ),
);

function SendInput() {
  const navigate = useNavigate();
  const params = useParams<{ conversationId: string; recipientId: string }>();
  const { recipientInfo } = useContext(MessageComponentContext)!;
  const { accessToken } = useContext(TokenContext)!;
  const [message, setMessage] = useState("");
  const [media, setMedia] = useState<MediaProps[]>([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiContainerRef = useRef<HTMLDivElement>(null);

  const handleEmojiVisibility = () => setShowEmoji(!showEmoji);
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };
  const handlePickedEmoji = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };
  const handleFocusEmojiContainer = () => {
    if (showEmoji) emojiContainerRef.current?.focus();
  };
  const sendMessage = () => {
    if (!recipientInfo || !accessToken) return;
    if (message.length !== 0) {
      messageSender({
        recipientId: recipientInfo.id,
        type: "TEXT",
        chat: message,
        accessToken,
      })
        .then((res) => {
          if (res.status === 201 && params.recipientId) {
            navigate(`/message/${res.data.converseId}`);
          }
        })
        .finally(() => {
          setMessage("");
        });
    }
    if (media.length !== 0) {
      const imageMediaPayload = media
        .filter((mediaUnit) => mediaUnit.file.type.includes("image"))
        .map((mediaUnit, index) => {
          return {
            [`image-` + index]: mediaUnit.file,
          };
        });

      const videoMediaPayload = media
        .filter((mediaUnit) => mediaUnit.file.type.includes("video"))
        .map((mediaUnit, index) => {
          return {
            [`video-` + index]: mediaUnit.file,
          };
        });

      if (imageMediaPayload.length > 0)
        messageSender({
          recipientId: recipientInfo.id,
          accessToken,
          type: "IMAGE",
          media: imageMediaPayload,
        })
          .then((res) => {
            if (res.status === 201 && params.recipientId) {
              navigate(`/message/${res.data.converseId}`);
            }
          })
          .finally(() => setMedia([]));

      if (videoMediaPayload.length > 0)
        messageSender({
          recipientId: recipientInfo.id,
          accessToken,
          type: "VIDEO",
          media: videoMediaPayload,
        })
          .then((res) => {
            if (res.status === 201 && params.recipientId) {
              navigate(`/message/${res.data.converseId}`);
            }
          })
          .finally(() => setMedia([]));
    }
  };
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files === null) return;
    const parseFile = (file: File) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (result) => {
        setMedia((prev) => [
          ...prev,
          { id: genId(), string: result.target?.result as string, file },
        ]);
      };
    };

    for (const file of files) {
      parseFile(file);
    }
  };
  const handleInputKeyChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(handleFocusEmojiContainer, [showEmoji]);

  return (
    <div className="relative flex items-center  gap-1 px-3 py-4 text-base text-slate-800">
      <div className=" relative flex h-10 items-center self-end">
        <label
          className="flex items-center justify-center rounded-full p-2 text-primary-400  hover:cursor-pointer hover:bg-gray-200 hover:shadow-md"
          htmlFor="conversation-image-input"
        >
          <ImageRounded className="size-5" />
        </label>
        <label
          className="flex items-center justify-center rounded-full  p-2 text-primary-400 hover:cursor-pointer hover:bg-gray-200 hover:shadow-md"
          onClick={handleEmojiVisibility}
        >
          <EmojiEmotionsRounded className="size-5" />
        </label>
        <EmojiPicker
          className="absolute bottom-full z-50 mb-3"
          previewConfig={{ showPreview: false }}
          skinTonesDisabled
          open={showEmoji}
          lazyLoadEmojis
          onEmojiClick={handlePickedEmoji}
          emojiStyle={EmojiStyle.NATIVE}
        />
      </div>

      <div className="w-full rounded-lg border-2 border-solid border-secondary-400 p-0 px-4 py-2">
        {media.length > 0 && (
          <MediaContainer>
            <MediaList media={media} setMedia={setMedia} />
          </MediaContainer>
        )}

        <CustomTextField
          maxRows={4}
          className="w-full"
          multiline
          onChange={handleTextChange}
          value={message || ""}
          onKeyDown={handleInputKeyChange}
        />
      </div>
      <div className="flex h-10 items-center justify-center self-end">
        <IconButton className=" text-primary-400" onClick={sendMessage}>
          <SendRounded className="size-7" />
        </IconButton>
      </div>

      <input
        className="absolute"
        id="conversation-image-input"
        hidden
        type="file"
        accept="image/*, video/*"
        multiple
        onChange={handleMediaChange}
      />
    </div>
  );
}

function UserMessage({ message }: { message: IMessage }) {
  return (
    <Tooltip
      className="ml-4"
      title={convoDateFormat(message.createdAt)}
      placement="left"
    >
      <div className="relative inline-block max-w-[75%] self-end rounded-xl  bg-primary-400 py-2 font-body text-white">
        <p className="text-wrap break-all px-4 text-base">{message.chat}</p>
      </div>
    </Tooltip>
  );
}

function OtherMessage({ message }: { message: IMessage }) {
  return (
    <Tooltip title={convoDateFormat(message.createdAt)} placement="right">
      <div className="relative flex max-w-[75%] self-start rounded-xl  bg-secondary-400  py-2 font-body text-white">
        <p className="px-4 text-base">{message.chat}</p>
      </div>
    </Tooltip>
  );
}

function MediaContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mb-3 flex max-h-[128px] w-full flex-row flex-wrap items-center justify-start gap-2 overflow-y-auto">
      {children}
    </div>
  );
}

function MediaList({ media, setMedia }: MediaListProps) {
  return (
    <>
      {media.map((media) => {
        if (media.file.type.includes("image")) {
          return (
            <TinyImgage
              id={media.id}
              key={`${media.id}`}
              src={media.string}
              setMedia={setMedia}
            />
          );
        } else if (media.file.type.includes("video")) {
          return (
            <TinyVideo
              key={media.id}
              id={media.id}
              src={media.string}
              setMedia={setMedia}
            />
          );
        }
      })}
    </>
  );
}

function TinyImgage({ src, id, setMedia }: TinyMediaProps) {
  const removeMedia = () => {
    setMedia((prev) => prev.filter((media) => media.id !== id));
  };
  return (
    <div className="relative">
      <img
        src={src}
        className="size-[60px] rounded-lg border-2 border-solid border-slate-400 object-cover"
      />
      <IconButton
        className="absolute right-[-8px] top-[-8px] bg-slate-200 p-1 hover:bg-slate-300"
        onClick={removeMedia}
      >
        <ClearRounded className="size-4" />
      </IconButton>
    </div>
  );
}

function TinyVideo({ id, src, setMedia }: TinyMediaProps) {
  const removeMedia = () => {
    setMedia((prev) => prev.filter((media) => media.id !== id));
  };
  return (
    <div className="relative">
      <video
        src={src}
        className="size-[60px] rounded-lg border-2 border-solid border-slate-400"
      />
      <IconButton
        className="absolute right-[-8px] top-[-8px] bg-slate-200 p-1 hover:bg-slate-300"
        onClick={removeMedia}
      >
        <ClearRounded className="size-4" />
      </IconButton>
    </div>
  );
}

// Subcomponents
const CustomTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    width: "100%",
    height: "auto",

    paddingRight: "0 !important",
    paddingLeft: "0 !important",
    padding: 0,
    // borderRadius: "0.5rem",
    // backgroundColor: "rgb(243 244 246)",
  },
  "& .MuiInputBase-input": {
    // paddingTop: "0.5rem",
    // paddingBottom: "0.5rem",
    // paddingLeft: "0.75rem",
    // paddingRight: "0.75rem",
    height: "24px",
    fontSize: "1rem",
    lineHeight: "1.5rem",
    color: "rgb(30, 41, 59)",
    // outline: "2px solid #73ACBA ",
    // borderRadius: "0.5rem",

    "&:hover": {
      // outline: "2px solid rgb(68, 133, 150)",
    },
    // width: "1000px",

    "&:focus-visible": {
      // outline: "2px solid #f17f69",
      // width: "1000px",
      height: "auto",
    },
  },
  "& .MuiFormControl-root": {
    width: "100%",
  },
  "& .MuiOutlinedInput-notchedOutline ": {
    border: "none",
    outline: "none",
  },
});

const AutoCompleteInput =
  (searchNewUserFocus: boolean, handleSearchUserBlur: () => void) =>
  (params: AutocompleteRenderInputParams) => {
    return (
      <CustomTextField
        className="w-full "
        placeholder="Search User"
        {...params}
        autoFocus={searchNewUserFocus}
        onBlur={handleSearchUserBlur}
      />
    );
  };
const AutocompleteOptions = ({
  accessToken,
  navigate,
  handleSearchUserBlur,
  setConvo,
}: {
  accessToken: string | null;
  navigate: NavigateFunction;
  handleSearchUserBlur: () => void;
  setConvo: Dispatch<SetStateAction<IConvo | null>>;
}) => {
  return (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: UserProfileInfo,
  ) => {
    const seaechUserConversation = () => {
      if (!accessToken) return;
      axiosClient
        .get(`/converse/search?recipientId=${option.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          if (res.status === 200) navigate(`/message/${res.data.converseId}`);
        })
        .catch((err) => {
          if (err.response.status === 404) {
            setConvo(null);
            navigate(`/message/new/${option.id}`);
          }
        })
        .finally(handleSearchUserBlur);
    };
    return (
      <li
        key={`opts${option.id.slice(5, 10)}`}
        {...props}
        className="flex items-center gap-2 px-3 py-2 hover:cursor-pointer hover:bg-gray-200"
        onClick={seaechUserConversation}
      >
        <Avatar src={`${process.env.SERVER_PUBLIC}/${option.pfp}`} />
        <p>{option.fullname}</p>
      </li>
    );
  };
};

function ConvoContent({ messages }: { messages: IMessage[] }) {
  const { userInfo } = useContext(UserInfoContext)!;
  let lastDateTime: Date;
  const AddDateRefference = ({ date }: { date: string }) => {
    if (lastDateTime === undefined) {
      lastDateTime = new Date(date);
      return (
        <p className="mb-4 mt-6 self-center text-xs text-slate-400">
          {convoDateFormat(date)}
        </p>
      );
    }
    const messageDate = new Date(date);

    if (dateTool.subtract(messageDate, lastDateTime).toMinutes() > 30) {
      lastDateTime = messageDate;
      return (
        <p className="mb-4 mt-6 self-center text-xs text-slate-400">
          {convoDateFormat(date)}
        </p>
      );
    } else return <></>;
  };

  return (
    <>
      {messages.map((message) => {
        if (message.type === "TEXT") {
          if (message.author_id === userInfo.id) {
            return (
              <>
                <AddDateRefference
                  key={`${(Math.random() * 540).toString()}`}
                  date={message.createdAt}
                />
                <UserMessage key={`usrMsg${message.id}`} message={message} />
              </>
            );
          } else if (message.author_id !== userInfo.id) {
            return (
              <>
                <AddDateRefference date={message.createdAt} />
                <OtherMessage key={`usrMsg${message.id}`} message={message} />
              </>
            );
          }
        } else if (message.type === "IMAGE") {
          if (message.author_id === userInfo.id) {
            return (
              <>
                <AddDateRefference
                  key={`${(Math.random() * 540).toString()}`}
                  date={message.createdAt}
                />
                <UserImageMedia
                  key={`userMd${message.id.slice(0, 10)}`}
                  message={message}
                />
              </>
            );
          } else {
            return (
              <>
                <AddDateRefference
                  key={`${(Math.random() * 540).toString()}`}
                  date={message.createdAt}
                />
                <OtherImageMedia
                  key={`userMd${message.id.slice(0, 10)}`}
                  message={message}
                />
              </>
            );
          }
        } else if (message.type === "VIDEO") {
          if (message.author_id === userInfo.id) {
            return (
              <>
                <AddDateRefference
                  key={`${(Math.random() * 540).toString()}`}
                  date={message.createdAt}
                />
                <UserVideoMedia
                  key={`userMd${message.id.slice(0, 10)}`}
                  message={message}
                />
              </>
            );
          } else {
            return (
              <>
                <AddDateRefference
                  key={`${(Math.random() * 540).toString()}`}
                  date={message.createdAt}
                />
                <OtherVideoMedia
                  key={`userMd${message.id.slice(0, 10)}`}
                  message={message}
                />
              </>
            );
          }
        }
      })}
    </>
  );
}

function UserImageMedia({ message }: { message: IMessage }) {
  let containerClass = "";
  let imageClass = "";

  if (message.media === undefined) return <></>;

  if (message.media.length === 1) {
    imageClass = "aspect-[2/3] max-w-[250px] ml-auto";
  } else if (message.media.length === 2 || message.media.length === 4) {
    containerClass = "grid grid-cols-[repeat(2,1fr)] justfiy-end   align-end";
    imageClass = "aspect-[1]";
  } else {
    containerClass = "grid grid-cols-[repeat(3,1fr)] justify-end";
    imageClass = "aspect-[1]";
  }

  return (
    <Tooltip title={convoDateFormat(message.createdAt)} placement="left">
      <div
        className={`${containerClass} w-[75%] items-end justify-end gap-[3px] self-end rounded-lg `}
      >
        {message.media.map((media) => (
          <img
            className={`${imageClass} size-full rounded-lg object-cover`}
            key={`usrMdImg${media.filename.slice(0, 10)}`}
            src={`${process.env.SERVER_PUBLIC}/${media.filename} `}
          />
        ))}
      </div>
    </Tooltip>
  );
}

function OtherImageMedia({ message }: { message: IMessage }) {
  let containerClass = "";
  let imageClass = "";

  if (message.media === undefined) return <></>;

  if (message.media.length === 1) {
    imageClass = "aspect-[2/3] max-w-[250px] mr-auto";
  } else if (message.media.length === 2 || message.media.length === 4) {
    containerClass = "grid grid-cols-[repeat(2,1fr)] justfiy-start align-start";
    imageClass = "aspect-[1]";
  } else {
    containerClass = "grid grid-cols-[repeat(3,1fr)] justify-start align-start";
    imageClass = "aspect-[1]";
  }

  return (
    <Tooltip title={convoDateFormat(message.createdAt)} placement="left">
      <div
        className={`${containerClass} w-[75%]  gap-[3px] self-start rounded-lg `}
      >
        {message.media.map((media) => (
          <img
            className={`${imageClass} size-full rounded-lg object-cover`}
            key={`usrMdImg${media.filename.slice(0, 10)}`}
            src={`${process.env.SERVER_PUBLIC}/${media.filename} `}
          />
        ))}
      </div>
    </Tooltip>
  );
}

function UserVideoMedia({ message }: { message: IMessage }) {
  if (message.media === undefined) return <></>;
  return (
    <>
      {message.media.map((mediaUnit) => (
        <Tooltip title={convoDateFormat(message.createdAt)} placement="left">
          <video
            className="aspect-video max-w-[75%] self-end rounded-lg"
            src={`${process.env.SERVER_PUBLIC}/${mediaUnit.filename}`}
            controls
          ></video>
        </Tooltip>
      ))}
    </>
  );
}

function OtherVideoMedia({ message }: { message: IMessage }) {
  if (message.media === undefined) return <></>;
  return (
    <>
      {message.media.map((mediaUnit) => (
        <Tooltip title={convoDateFormat(message.createdAt)} placement="right">
          <video
            className="aspect-video max-w-[75%] self-start rounded-lg"
            src={`${process.env.SERVER_PUBLIC}/${mediaUnit.filename}`}
            controls
          ></video>
        </Tooltip>
      ))}
    </>
  );
}

// Types
interface ConversastionLayoutProps {
  children: React.ReactNode;
}

interface MediaProps {
  id: string;
  string: string;
  file: File;
}

interface TinyMediaProps {
  src: string;
  id: string;
  setMedia: React.Dispatch<React.SetStateAction<MediaProps[]>>;
}

interface MediaListProps {
  media: MediaProps[];
  setMedia: React.Dispatch<React.SetStateAction<MediaProps[]>>;
}
