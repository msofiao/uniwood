import {
  CallEndRounded,
  MicOffRounded,
  MicRounded,
  VideocamOffRounded,
  VideocamRounded,
} from "@mui/icons-material";
import { Avatar, Button, IconButton } from "@mui/material";
import Peer from "peerjs";
import { useContext, useEffect, useRef, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { UserInfoContext } from "../providers/UserInfoProvider";
import { TokenContext } from "../providers/TokenProvider";
import axiosClient from "../utils/axios";
import { PeerContext } from "../providers/PeerProvider";

export default function VideoCall() {
  const { userInfoResponse, refreshTokenResponse } = useLoaderData() as {
    userInfoResponse: UserInfoResponseData;
    refreshTokenResponse: RefreshTokenResponseData;
  };
  const { userInfo, setUserInfo } = useContext(UserInfoContext)!;
  const { accessToken, setAccessToken } = useContext(TokenContext)!;
  const { peer, incomingCall, setIncomingCall, mediaConnection } =
    useContext(PeerContext)!;
  const params = useParams<{ recipientId: string }>();

  const [inStream, setInStream] = useState<MediaStream | null>(null);
  const [outStream, setOutStream] = useState<MediaStream | null>(null);

  const [callMedia, setCallMedia] = useState({ audio: true, video: true });
  const [recipientInfo, setRecipientInfo] = useState<Author | null>(null);

  const outVideoRef = useRef<HTMLVideoElement | null>(null);
  const inVideoRef = useRef<HTMLVideoElement | null>(null);

  const [callState, setCallState] = useState<
    "idle" | "outCall" | "inCall" | "onCall"
  >("idle");

  const initializeUserIdentity = () => {
    setAccessToken(refreshTokenResponse.accessToken);
    // setCallMedia({ audio: true, video: true });
  };
  const initializeRecipientInfo = () => {
    if (!accessToken || !params.recipientId) return;
    getUserInfo({ userId: params.recipientId, accessToken }).then((res) => {
      setRecipientInfo(res.data.data);
    });
  };
  const openVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        setInStream(stream);
        if (inVideoRef.current) {
          inVideoRef.current.srcObject = stream;
        }
      });
  };
  const displayInStream = () => {
    if (!inVideoRef.current) return;
    inVideoRef.current.srcObject = inStream;
  };

  const displayOutStream = () => {
    if (!outVideoRef.current) return;
    outVideoRef.current.srcObject = outStream;
  };

  const callUser = () => {
    if (!peer || incomingCall || !inStream) return;

    if (!params.recipientId) return;
    const mediaConnection = peer.call(params.recipientId, inStream);

    mediaConnection.on("stream", (stream) => {
      console.log("Stream received");
      setOutStream(stream);
    });
  };

  const anwerCall = () => {
    console.log({ inStream, mediaConnection, incomingCall });
    if (incomingCall || !mediaConnection || !inStream) return;
    console.log(`Answered call by ${userInfo.id}`);

    mediaConnection.answer(inStream);
    mediaConnection.on("stream", (stream) => {
      console.log("Stream received");
    });
    setIncomingCall(false);
  };

  const tester = () => {
    console.log("tester ", { mediaConnection });
  };

  useEffect(initializeUserIdentity, []);
  useEffect(initializeRecipientInfo, [accessToken, params.recipientId]);
  useEffect(openVideo, []);
  useEffect(displayInStream, [inStream]);
  useEffect(displayOutStream, [outStream]);

  useEffect(anwerCall, [incomingCall, inStream, mediaConnection]);
  useEffect(tester, [mediaConnection]);

  return (
    <div className="grid h-screen w-screen grid-rows-[auto_1fr_auto] bg-primary-50">
      <Button variant="contained" onClick={callUser}>
        Call User
      </Button>
      <Header recipientInfo={recipientInfo} />
      <OutCall
        callMedia={callMedia}
        recipientInfo={recipientInfo}
        videoRef={outVideoRef}
      />
      <InCall userInfo={userInfo} videoRef={inVideoRef} callMedia={callMedia} />
      <Controls
        inStream={inStream}
        callMedia={callMedia}
        setCallMedia={setCallMedia}
      />
    </div>
  );
}

function OutCall({ videoRef, recipientInfo, callMedia }: OutCallProps) {
  return (
    <div className="relative flex items-center justify-center">
      <video
        ref={videoRef}
        className=" h-[70%] max-w-[80%] rounded-xl bg-red-400"
      ></video>
    </div>
  );
}

function InCall({ videoRef, userInfo, callMedia }: InCallProps) {
  return (
    <div className="absolute right-3 top-20 flex h-[200px] w-[150px] items-center justify-center rounded-lg bg-secondary-300 ">
      {!callMedia.audio && (
        <MicOffRounded className="absolute left-3 top-3 z-50 text-white" />
      )}

      {callMedia.video ? (
        <video
          className=" h-full w-full rounded-lg object-cover"
          ref={videoRef}
          autoPlay
          playsInline
        ></video>
      ) : (
        <Avatar
          src={`${process.env.SERVER_PUBLIC}/${userInfo.pfp}`}
          alt="user pfp"
          className="size-16 rounded-full bg-red-500 object-cover"
        />
      )}
    </div>
  );
}

function Header({ recipientInfo }: HeaderProps) {
  return (
    <div className=" flex flex-row items-center gap-3 border-b-2 border-solid border-b-primary-500 bg-primary-400 px-10 py-2">
      <Avatar
        src={`${process.env.SERVER_PUBLIC}/${recipientInfo?.pfp}`}
        className="size-[55px]"
      />
      <div className="flex flex-col items-start justify-center">
        <p className="font-body text-2xl font-bold text-white">
          {recipientInfo?.fullname}
        </p>
        <p className="text-sm font-bold text-slate-300">
          @{recipientInfo?.username}
        </p>
      </div>
    </div>
  );
}

function Controls({ callMedia, setCallMedia, inStream }: ControlsProps) {
  const toggleAudio = () => {
    if (!inStream) return;

    inStream.getAudioTracks().forEach((track) => {
      track.enabled = !callMedia.audio;
    });
    setCallMedia((prev) => ({ ...prev, audio: !prev.audio }));
  };

  const toggleVideo = () => {
    if (!inStream) return;

    inStream.getVideoTracks().forEach((track) => {
      track.enabled = !callMedia.video;
    });

    setCallMedia((prev) => ({ ...prev, video: !prev.video }));
  };

  return (
    <div className="flex w-full justify-center gap-3 bg-primary-200 py-2 text-3xl">
      <IconButton onClick={toggleVideo}>
        {callMedia.video ? (
          <VideocamRounded className="size-7" />
        ) : (
          <VideocamOffRounded className="size-7" />
        )}
      </IconButton>

      <IconButton onClick={toggleAudio}>
        {callMedia.audio ? (
          <MicRounded className="size-7" />
        ) : (
          <MicOffRounded className="size-7" />
        )}
      </IconButton>

      <IconButton>
        <CallEndRounded className="size-7" />
      </IconButton>
    </div>
  );
}

// Utilities
const getUserInfo = async ({
  userId,
  accessToken,
}: {
  userId: string;
  accessToken: string;
}) => {
  return axiosClient.get(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Types
interface ControlsProps {
  callMedia: { audio: boolean; video: boolean };
  setCallMedia: React.Dispatch<
    React.SetStateAction<{ audio: boolean; video: boolean }>
  >;
  inStream: MediaStream | null;
}
interface OutCallProps {
  recipientInfo: Author | null;
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  callMedia: { audio: boolean; video: boolean };
}
interface InCallProps {
  userInfo: {
    id: string;
    fullname: string;
    pfp: string;
    username: string;
    address: string;
    bio: string;
    cover: string;
    affiliation: string;
  };
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  callMedia: { audio: boolean; video: boolean };
}
interface HeaderProps {
  recipientInfo: Author | null;
}
