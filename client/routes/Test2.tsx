import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Modal,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { MediaConnection, Peer } from "peerjs";
import {
  CallEndRounded,
  CallRounded,
  PriorityHighRounded,
} from "@mui/icons-material";

// export default function Test2() {
//   const peerRef = useRef<Peer | null>();
//   const callRef = useRef<MediaConnection | null>(null);
//   const inVideoRef = useRef<HTMLVideoElement | null>(null);
//   const outVideoRef = useRef<HTMLVideoElement | null>(null);

//   const [inStream, setInStream] = useState<MediaStream | null>(null);
//   const [outStream, setOutStream] = useState<MediaStream | null>(null);
//   const [incomingCall, setIncomingCall] = useState(false);

//   const [calling, setCalling] = useState(false);

//   const initalizePeer = () => {
//     peerRef.current = new Peer("user2");
//     peerRef.current.on("open", (id) => {
//       console.log("peer id", id);
//     });

//     peerRef.current.on("call", async (call) => {
//       callRef.current = call;
//       console.log("Someone is calling you");
//       setIncomingCall(true);
//     });
//     peerRef.current.on("disconnected", () => {
//       if (callRef.current) {
//         callRef.current.close();
//         callRef.current = null;
//       }
//     });
//   };

//   const displayOutStream = () => {
//     if (outVideoRef.current && callRef.current) {
//       outVideoRef.current.srcObject = outStream;
//     }
//   };

//   const displayInStream = () => {
//     if (inVideoRef.current) {
//       inVideoRef.current.srcObject = outStream;
//     }
//   };

//   const answerCall = async () => {
//     if (!peerRef.current || !callRef.current) return;

//     const user2MediaStream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: true,
//     });

//     setInStream(user2MediaStream);

//     callRef.current.answer(user2MediaStream);

//     callRef.current.on("stream", (stream) => {
//       setOutStream(stream);
//     });
//   };

//   useEffect(initalizePeer, []);
//   useEffect(displayOutStream, [outStream]);
//   useEffect(displayInStream, [outStream]);

//   return (
//     <div className="flex h-screen w-screen items-center  justify-center gap-10">
//       <h1 className="absolute mt-5 self-start text-center text-3xl font-bold text-slate-800">
//         User2
//       </h1>
//       <div className="h-[400px] w-[650px] bg-orange-300 ">
//         <video
//           ref={outVideoRef}
//           className="h-full w-full"
//           autoPlay
//           playsInline
//         ></video>
//         <div className="mt-4 flex w-full justify-evenly">
//           <Button
//             className="bg-primary-300 normal-case text-white "
//             variant="contained"
//           >
//             Call
//           </Button>
//           {incomingCall && (
//             <Button
//               className="bg-primary-300 normal-case text-white "
//               variant="contained"
//               onClick={answerCall}
//             >
//               Anwer
//             </Button>
//           )}
//         </div>
//       </div>
//       <video
//         className="h-[300px] w-[185px] bg-violet-300"
//         ref={inVideoRef}
//         autoPlay
//         playsInline
//       ></video>
//     </div>
//   );
// }

export default function Test2() {
  const [dialogOpen, setDialogOpen] = useState(true);
  return (
    <div className="relative h-screen w-screen">
      Hello
      <PostDeleteDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
      hello
    </div>
  );
}

function PostDeleteDialog({
  dialogOpen,
  setDialogOpen,
}: PostDeleteDialogProps) {
  const closeDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Modal open={dialogOpen} onClose={closeDialog}>
      <div className="position absolute left-[50%] top-[50%] flex h-[300px] w-[450px] translate-x-[-50%] translate-y-[-50%] flex-col items-center justify-center rounded-xl bg-white px-5 py-8 shadow-lg">
        <PriorityHighRounded className="rounded-full bg-red-200 p-2 text-[50px] text-red-400" />
        <p className="text my-3 text-lg font-bold text-slate-800">
          Are you sure ?
        </p>
        <p className="mb-7 text-center text-slate-600">
          This action cannot be undone. All values associated with the post will
          be lost
        </p>
        <button className="w-full rounded-lg bg-red-400  py-2 font-bold text-white hover:bg-red-500 ">
          Delete Post
        </button>
        <button className="font-bold font-body mt-4 w-full rounded-lg border-[3px] border-solid border-slate-300 py-2 text-slate-700 hover:text-white hover:bg-slate-300">
          Cancel
        </button>
      </div>
    </Modal>
  );
}

interface PostDeleteDialogProps {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}
