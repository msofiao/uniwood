import { Button, ImageList, ImageListItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router-dom";

const imageSrcSet = [
  "https://wallpapers.com/images/hd/kimetsu-no-yaiba-hashira-shinobu-close-up-b6vissjhw28rh3b1.jpg",
  "https://wallpapers.com/images/hd/kimetsu-no-yaiba-hashira-shinobu-close-up-b6vissjhw28rh3b1.jpg",
  "https://wallpapers.com/images/hd/kimetsu-no-yaiba-hashira-shinobu-close-up-b6vissjhw28rh3b1.jpg",
  "https://wallpapers.com/images/hd/kimetsu-no-yaiba-hashira-shinobu-close-up-b6vissjhw28rh3b1.jpg",
  "https://wallpapers.com/images/hd/kimetsu-no-yaiba-hashira-shinobu-close-up-b6vissjhw28rh3b1.jpg",
  "https://wallpapers.com/images/hd/kimetsu-no-yaiba-hashira-shinobu-close-up-b6vissjhw28rh3b1.jpg",
  "https://wallpapers.com/images/hd/kimetsu-no-yaiba-hashira-shinobu-close-up-b6vissjhw28rh3b1.jpg",
  "https://wallpapers.com/images/hd/kimetsu-no-yaiba-hashira-shinobu-close-up-b6vissjhw28rh3b1.jpg",
  "https://wallpapers.com/images/hd/kimetsu-no-yaiba-hashira-shinobu-close-up-b6vissjhw28rh3b1.jpg",
];

import { Peer } from "peerjs";
import React from "react";

const remotePeerId = "testCall";

export default function Test() {
  const peer = new Peer("id2");

  return (
    <div className="flex h-screen w-screen items-center justify-center gap-10">
      <div className="h-[450px] w-[600px] bg-gray-300">
        <VideoStream peer={peer} remotePeerId={remotePeerId} />
      </div>
      <div className="h-[450px] w-[600px] bg-red-300"></div>
    </div>
  );
}
function VideoStream({
  peer,
  remotePeerId,
}: {
  peer: Peer;
  remotePeerId: string;
}) {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const getStream = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(userStream);
        const call = peer.call(remotePeerId, userStream);
        call.on("stream", setStream); // Update state with remote stream
        return () => call.close(); // Cleanup function for call on unmount
      } catch (err) {
        console.error("Failed to get local stream", err);
      }
    };

    getStream();

    // Cleanup function to stop the stream and call when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [peer, remotePeerId]); // Re-run on peer or remotePeerId changes

  if (!stream) {
    return <div>Loading...</div>;
  }

  return (
    <video autoPlay muted playsInline ref={videoRef}>
      Your browser does not support the video tag.
    </video>
  );
}
const videoRef = React.createRef<HTMLVideoElement>();
