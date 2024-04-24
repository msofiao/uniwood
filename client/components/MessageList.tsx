import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { Avatar } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MessageComponentContext } from "../context/mesComContext";
import axiosClient from "../utils/axios";
import { TokenContext } from "../providers/TokenProvider";
import { convoDateFormat } from "../utils/dateTools";
import { useNavigate, useParams } from "react-router-dom";
import { socketClient } from "../utils/socketIO";
import { UserInfoContext } from "../providers/UserInfoProvider";

export default function MessageList() {
  const navigate = useNavigate();
  const params = useParams<{
    recipientId?: string;
    converseId?: string;
  }>();
  const [convoUnitList, setConvoUnitList] = useState<IConvoUnit[]>([]);
  const { accessToken } = useContext(TokenContext)!;
  const { recipientInfo } = useContext(MessageComponentContext)!;
  const { userInfo } = useContext(UserInfoContext)!;

  const initializeConvoUnitList = () => {
    if (!accessToken) return;
    axiosClient
      .get("/converse/list", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setConvoUnitList(res.data.data);
      });
  };
  const updateConvoList = () => {
    socketClient.on(`converseList/${userInfo.id}`, (payload: ConvoUnit) => {
      const targetConvo = convoUnitList.find(
        (convoUnit) => convoUnit.converseId === payload.converse_id,
      );

      if (targetConvo) {
        targetConvo.message.chat = payload.chat ?? null;
        targetConvo.message.media = payload.media;
        targetConvo.message.type = payload.type;
        targetConvo.message.createdAt = payload.createdAt;
        setConvoUnitList((prev) => [
          targetConvo,
          ...prev.filter((e) => e.converseId !== payload.converse_id),
        ]);
      } else {
        let newConvo: IConvoUnit = {
          converseId: payload.converse_id,
          message: {
            chat: payload.chat,
            media: payload.media,
            type: payload.type,
            createdAt: payload.createdAt,
            author_id: payload.author_id,
            status: payload.status,
          },
          recipientInfo: {
            recipientId: payload.recipient_id,
            fullname: payload.fullname,
            pfp: payload.pfp,
          },
        };
        setConvoUnitList([newConvo, ...convoUnitList]);
      }
    });

    return () => {
      socketClient.off(`converseList/${userInfo.id}`);
    };
  };

  const navigateToConversation = (converseId: string) => () =>
    navigate(`/message/${converseId}`);

  useEffect(initializeConvoUnitList, [accessToken, params.converseId]);
  useEffect(updateConvoList, [params.converseId, accessToken]);
  return (
    <div className="border-x-solid flex max-h-screen flex-col  gap-4 border-x-2 border-x-slate-300">
      <div className="mt-5 flex flex-col gap-4 px-4">
        <Header />
        <SearchBar />
      </div>

      <div className="overflow-y-scroll">
        {convoUnitList.map((convoUnit) => (
          <Message
            key={convoUnit.converseId}
            convoUnit={convoUnit}
            navigateToConversation={navigateToConversation(
              convoUnit.converseId,
            )}
            params={params}
          />
        ))}
      </div>
    </div>
  );
}

function Message({
  convoUnit,
  navigateToConversation,
  params,
}: {
  convoUnit: IConvoUnit;
  navigateToConversation: () => void;
  params: { recipientId?: string; converseId?: string };
}) {
  return (
    <div
      className={`flex items-center gap-3   px-4 py-3 hover:cursor-pointer  hover:bg-gray-200 ${params.converseId === convoUnit.converseId && "bg-gray-200"} ${convoUnit.message.status !== "READ" && "font-bold"}`}
      onClick={navigateToConversation}
    >
      <Avatar
        className="size-[45px]"
        src={`${process.env.SERVER_PUBLIC}/${convoUnit.recipientInfo.pfp}`}
      />
      <div className="grid ">
        <p className="font-body text-base text-slate-800">
          {convoUnit.recipientInfo.fullname}
        </p>
        <p className="overflow-x-hidden text-ellipsis whitespace-nowrap font-body text-base text-slate-500">
          {convoUnit.recipientInfo.recipientId !== localStorage.getItem("id")
            ? "You: "
            : ""}{" "}
          {convoUnit.message.type === "TEXT"
            ? convoUnit.message.chat
            : "Attached a Media"}
        </p>
      </div>

      <p className="ml-auto self-start text-sm text-slate-800">
        {convoDateFormat(convoUnit.message.createdAt)}
      </p>
    </div>
  );
}

function Header() {
  const { setSearchNewUserFocus } = useContext(MessageComponentContext)!;

  const handleSearchUserInputFocus = () => {
    setSearchNewUserFocus(true);
  };
  return (
    <div className="flex items-center justify-between ">
      <p className="font-header text-2xl font-medium text-slate-800">
        Messages
      </p>
      <PencilSquareIcon
        title="New Message"
        className="size-[40px] rounded-full p-2  text-slate-800 hover:cursor-pointer hover:bg-gray-200 active:bg-gray-300 active:text-slate-900"
        onClick={handleSearchUserInputFocus}
      />
    </div>
  );
}

function SearchBar() {
  return (
    <input
      className=" w-full appearance-none rounded-full px-5 py-[8px] font-body text-slate-800 outline outline-2 outline-slate-400"
      type="text"
      placeholder="Search"
      name="convo search"
    />
  );
}

interface ConvoUnit {
  id: string;
  author_id: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE";
  media?: IPostMedia[];
  chat: string | null;
  createdAt: string;
  status: "SENT" | "DELIVERED" | "READ";
  converse_id: string;
  recipient_id: string;
  fullname: string;
  pfp: string;
}

interface IPostMedia {
  filename: string;
  caption: string | null;
}
