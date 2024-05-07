import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { PeerProviderContext } from "../types/providers";
import Peer, { MediaConnection } from "peerjs";
import { CallRounded, CallEndRounded } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import CallAlert from "../components/CallAlert";
import { UserInfoContext } from "./UserInfoProvider";

export const PeerContext = createContext<PeerProviderContext | null>(null);

// ! Dummy Data
const anyData = "anyData" as any;

export default function PeerProvider({ children }: PeerProviderProps) {
  const { userInfo } = useContext(UserInfoContext)!;
  const [mediaConnection, setMediaConnection] =
    useState<MediaConnection | null>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [incomingCall, setIncomingCall] = useState(false);

  const listenToCalls = () => {
    if (!peer) return;
    peer.on("call", (call) => {
      console.log("Someone is calling you");
      setIncomingCall(true);
      setMediaConnection(call);
    });

    peer.on("connection", (conn) => {
      setIncomingCall(false);
    });
  };

  const initiatePeer = () => {
    if (!userInfo) return;
    const peer = new Peer(userInfo.id);
    setPeer(peer);
    peer.on("open", (id) => {
      console.log("Connected to a peer", id);
    });
  };

  useEffect(initiatePeer, [userInfo]);
  useEffect(listenToCalls, [peer]);

  return (
    <PeerContext.Provider
      value={{ peer, incomingCall, setIncomingCall, mediaConnection }}
    >
      {children}
      {mediaConnection && (
        <CallAlert
          mediaConnection={mediaConnection}
          callerInfo={anyData}
          setMediaConnection={setMediaConnection}
        />
      )}
    </PeerContext.Provider>
  );
}

interface PeerProviderProps {
  children: React.ReactNode;
}
