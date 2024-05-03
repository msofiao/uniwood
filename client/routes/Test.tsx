import { Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { MediaConnection, Peer } from "peerjs";

export default function Test() {
  const peerRef = useRef<Peer>();
  const inVideoRef = useRef<HTMLVideoElement | null>(null);
  const outVideoRef = useRef<HTMLVideoElement | null>(null);
  const callRef = useRef<MediaConnection | null>(null);

  const [inStream, setInStream] = useState<MediaStream | null>(null);
  const [outStream, setOutStream] = useState<MediaStream | null>(null);

  const initalizePeer = () => {
    peerRef.current = new Peer("user1");
    peerRef.current.on("open", (id) => {
      console.log("peer id", id);
    });
  };

  const callUser2 = async () => {
    if (!peerRef.current) return;

    const user1MediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    console.log({ user1MediaStream });

    setInStream(user1MediaStream);

    if (inVideoRef.current) {
      inVideoRef.current.srcObject = inStream;
    }

    const call = peerRef.current.call("user2", user1MediaStream);

    call.on("stream", (stream) => {
      if (outVideoRef.current) {
        outVideoRef.current.srcObject = stream;
      }
    });
  };

  useEffect(initalizePeer, []);
  useEffect;

  return (
    <div className="flex h-screen w-screen items-center  justify-center gap-10">
      <h1 className="absolute mt-5 self-start text-center text-3xl font-bold text-slate-800">
        User1
      </h1>
      <div className="h-[400px] w-[650px] bg-green-300 ">
        <video className="h-full w-full" autoPlay playsInline></video>
        <div className="mt-4 flex w-full justify-evenly">
          <Button
            className="bg-primary-300 normal-case text-white "
            variant="contained"
            onClick={callUser2}
          >
            Call
          </Button>
          <Button
            className="bg-primary-300 normal-case text-white "
            variant="contained"
          >
            Anwer
          </Button>
        </div>
      </div>
      <video
        ref={inVideoRef}
        className="h-[300px] w-[185px] bg-blue-300"
        autoPlay
        playsInline
        muted
      ></video>
    </div>
  );
}
