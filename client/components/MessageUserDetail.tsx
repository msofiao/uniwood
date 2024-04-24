import { MarkEmailRead, Person2Rounded } from "@mui/icons-material";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MessageComponentContext } from "../context/mesComContext";
import { useNavigate, useParams } from "react-router-dom";
import { TokenContext } from "../providers/TokenProvider";
import { getConverseMedia } from "../api/converse";
import { socketClient } from "../utils/socketIO";

export default function MessageUserDetail() {
  return (
    <div className="grid max-h-screen grid-rows-[auto_1fr] overflow-y-auto">
      <UserIndentity />
      <SharedMedia />
    </div>
  );
}

function Header() {
  return (
    <p className="mx-2 mb-3 font-header text-2xl font-medium text-slate-800">
      Details
    </p>
  );
}

function UserIndentity() {
  const { recipientInfo } = useContext(MessageComponentContext)!;
  const navigate = useNavigate();

  const visitProfile = () => {
    navigate(`/profile/${recipientInfo?.username}`);
  };

  return (
    <div className="sticky top-0 flex flex-col items-center justify-center gap-2 border-b-2 border-solid border-slate-300 bg-gray-100 px-4 pb-2 pt-6">
      <Avatar
        src={`${process.env.SERVER_PUBLIC}/${recipientInfo?.pfp}`}
        className="size-16"
      />
      <div className="flex flex-col text-center">
        <p className="font-body text-base text-slate-800 ">
          {recipientInfo?.fullname}
        </p>
        <p className="font-body text-xs text-slate-500 ">
          {recipientInfo?.username}
        </p>
      </div>
      <Tooltip title="Visit Proflie" placement="bottom">
        <IconButton
          className="bg-slate-200 text-primary-400  hover:bg-slate-300"
          onClick={visitProfile}
        >
          <Person2Rounded />
        </IconButton>
      </Tooltip>
    </div>
  );
}

function SharedMedia() {
  return (
    <div className="max-h-100% grid grid-rows-[auto_1fr]  px-3 py-5 text-slate-800">
      <p className="mb-3 font-header text-lg font-medium">Shared Media</p>
      <MediaContents />
    </div>
  );
}

function MediaContents() {
  const [mediaList, setMediaList] = useState<SharedMediaProps[]>([]);
  const { accessToken } = useContext(TokenContext)!;
  const { recipientInfo } = useContext(MessageComponentContext)!;
  const params = useParams<{ converseId?: string }>();

  const initializeImage = () => {
    if (!params.converseId || !recipientInfo || !accessToken) return;

    getConverseMedia({
      accessToken,
      converseId: params.converseId,
      recipientId: recipientInfo.id,
    }).then((res) => {
      setMediaList(res.data.data);
    });
  };

  const listenToSentMedia = () => {
    if (!params.converseId) return;
    socketClient.on(`message/${params.converseId}`, (message: IMessage) => {
      console.log({ mediaPayload: message });

      if (message.type === "VIDEO" || message.type === "IMAGE") {
        setMediaList((prev) => {
          let mediaUnit: SharedMediaProps = {
            type: message.type,
            media: message.media,
          };
          return [mediaUnit, ...prev];
        });
      }
    });
    return () => {
      socketClient.off(`message/${params.converseId}`);
    };
  };

  useEffect(listenToSentMedia, [params.converseId, accessToken]);
  useEffect(initializeImage, [params.converseId, accessToken, recipientInfo]);

  const mediaElementGenerator = (mediaUnit: SharedMediaProps) => {
    if (mediaUnit.type === "IMAGE" && mediaUnit.media) {
      return mediaUnit.media.map((image) => {
        if (!image) return <></>;
        return (
          <img
            className="aspect-[1] size-full rounded-lg object-cover"
            src={`${process.env.SERVER_PUBLIC}/${image.filename}`}
            alt={image?.caption || ""}
          />
        );
      });
    } else if (mediaUnit.type === "VIDEO" && mediaUnit.media) {
      return mediaUnit.media.map((video) => {
        if (!video) return <></>;
        return (
          <video
            className="aspect-[1] size-full rounded-lg object-cover"
            src={`${process.env.SERVER_PUBLIC}/${video.filename}`}
          />
        );
      });
    } else return <></>;
  };

  return (
    <div className="h-full max-h-full overflow-y-auto ">
      <div className="grid  grid-cols-[repeat(3,1fr)] items-center justify-center gap-[2px]">
        {mediaList.map(mediaElementGenerator)}
      </div>
    </div>
  );
}

interface SharedMediaProps {
  media: IMessage["media"];
  type: IMessage["type"];
}
