import { Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { MediaConnection, Peer } from "peerjs";

export default function Test2() {
  const peerRef = useRef<Peer | null>();
  const callRef = useRef<MediaConnection | null>(null);
  const inVideoRef = useRef<HTMLVideoElement | null>(null);
  const outVideoRef = useRef<HTMLVideoElement | null>(null);

  const [inStream, setInStream] = useState<MediaStream | null>(null);
  const [outStream, setOutStream] = useState<MediaStream | null>(null);
  const [incomingCall, setIncomingCall] = useState(false);

  const [calling, setCalling] = useState(false);

  const initalizePeer = () => {
    peerRef.current = new Peer("user2");
    peerRef.current.on("open", (id) => {
      console.log("peer id", id);
    });

    peerRef.current.on("call", async (call) => {
      callRef.current = call;
      console.log("Someone is calling you");
      setIncomingCall(true);
    });
    peerRef.current.on("disconnected", () => {
      if (callRef.current) {
        callRef.current.close();
        callRef.current = null;
      }
    });
  };

  const displayOutStream = () => {
    if (outVideoRef.current && callRef.current) {
      outVideoRef.current.srcObject = outStream;
    }
  };

  const displayInStream = () => {
    if (inVideoRef.current) {
      inVideoRef.current.srcObject = outStream;
    }
  };

  const answerCall = async () => {
    if (!peerRef.current || !callRef.current) return;

    const user2MediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    setInStream(user2MediaStream);

    callRef.current.answer(user2MediaStream);

    callRef.current.on("stream", (stream) => {
      setOutStream(stream);
    });
  };

  useEffect(initalizePeer, []);
  useEffect(displayOutStream, [outStream]);
  useEffect(displayInStream, [outStream]);

  return (
    <div className="flex h-screen w-screen items-center  justify-center gap-10">
      <h1 className="absolute mt-5 self-start text-center text-3xl font-bold text-slate-800">
        User2
      </h1>
      <div className="h-[400px] w-[650px] bg-orange-300 ">
        <video
          ref={outVideoRef}
          className="h-full w-full"
          autoPlay
          playsInline
        ></video>
        <div className="mt-4 flex w-full justify-evenly">
          <Button
            className="bg-primary-300 normal-case text-white "
            variant="contained"
          >
            Call
          </Button>
          {incomingCall && (
            <Button
              className="bg-primary-300 normal-case text-white "
              variant="contained"
              onClick={answerCall}
            >
              Anwer
            </Button>
          )}
        </div>
      </div>
      <video
        className="h-[300px] w-[185px] bg-violet-300"
        ref={inVideoRef}
        autoPlay
        playsInline
      ></video>
    </div>
  );
}
