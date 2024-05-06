import { Button } from "@mui/material";
import Peer from "peerjs";
import { useContext, useEffect, useRef } from "react";
import { PeerContext } from "../providers/PeerProvider";

export function Test3() {
  const inVideoRef = useRef<HTMLVideoElement | null>(null);
  // const peerRef = useRef<Peer | null>(null);
  const { peerRef } = useContext(PeerContext)!;

  const callKeanu = () => {
    console.log({ peerRef: peerRef });

    if (!peerRef.current) return;
    console.log({ peerRef: peerRef.current });
    const call = peerRef.current
      .call("662af39e0b4db6ceda8b273a", new MediaStream())
      .on("stream", (stream) => {
        console.log({ stream });
      });

    console.log({ call });
  };

  useEffect(callKeanu, [peerRef.current]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-green-300">
      <video ref={inVideoRef} autoPlay playsInline></video>
      <Button variant="contained" onClick={callKeanu}>
        Dummy Call
      </Button>
    </div>
  );
}
