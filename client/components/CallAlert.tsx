import { CallRounded, CallEndRounded } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import Peer, { MediaConnection } from "peerjs";
import { Dispatch, MutableRefObject, SetStateAction, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PeerContext } from "../providers/PeerProvider";
import { TokenContext } from "../providers/TokenProvider";

export default function CallAlert({
  callerInfo,
  mediaConnection,
  setMediaConnection,
}: CallAlertProps) {
  const { setIncomingCall } = useContext(PeerContext)!;
  const answerCall = () => {
    if (!mediaConnection) return;
    window.open(
      `/videoCall/${mediaConnection.peer}`,
      "_blank",
      "width=800,height=600",
    );

    setIncomingCall(false);
  };

  const declineCall = () => {
    console.log("In Decline fUNCTION", { mediaConnection });

    if (!mediaConnection) return;
    mediaConnection.close();
    setMediaConnection(null);
  };
  return (
    <div className="fixed bottom-7 right-10 flex  w-96 items-center gap-4 rounded-xl border-2 border-solid border-primary-300  bg-primary-50 px-3 py-5 shadow-lg">
      <Avatar src={""} className="size-14" />
      <div className="-center ml flex flex-col justify-center">
        <p className="font-header text-xs text-slate-700">Incoming Call</p>
        <p className="font-body text-lg font-bold text-slate-700">
          Bryan Gonzales
        </p>
        <p className="text-sm italic text-slate-500">@brynrgnzls</p>
      </div>
      <IconButton
        className="ml-auto size-12 bg-green-300 hover:bg-green-400"
        onClick={answerCall}
      >
        <CallRounded />
      </IconButton>
      <IconButton
        className=" size-12 bg-red-300 hover:bg-red-400"
        onClick={declineCall}
      >
        <CallEndRounded />
      </IconButton>
    </div>
  );
}

interface CallAlertProps {
  mediaConnection: MediaConnection | null;
  setMediaConnection: Dispatch<SetStateAction<MediaConnection | null>>;
  callerInfo: Author;
}
function useState(arg0: boolean): [any, any] {
  throw new Error("Function not implemented.");
}

function useEffect(listenToCalls: () => void, arg1: any[]) {
  throw new Error("Function not implemented.");
}
