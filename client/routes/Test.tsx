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

const remotePeerId = "testCall";

export default function Test() {
  const peer = new Peer("id2");

  return (
    <div className="flex h-screen w-screen gap-10">
      <div className="h-[450px] w-[600px] bg-gray-300">
        <UserSendVideoStream peer={peer} remotePeerId={remotePeerId} />
      </div>
      <div className="h-[450px] w-[600px] bg-gray-300">
        <UserSendVideoStream peer={peer} remotePeerId={remotePeerId} />
      </div>
    </div>
  );
}
function UserSendVideoStream({
  peer,
  remotePeerId,
}: {
  peer: Peer;
  remotePeerId: string;
}) {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const initializeCall = () => {
    const peer = new Peer("sampleId");

    try {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((userStream) => {
          setStream(userStream);
          const call = peer.call(remotePeerId, userStream);
          call.on("stream", setStream); // Update state with remote stream
          return () => call.close(); // Cleanup function for call on unmount
        });
    } catch (err) {
      console.error("Failed to get local stream", err);
    }
  };

  useEffect(() => {
    const getStream = async () => {};

    getStream();

    // Cleanup function to stop the stream and call when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [peer, remotePeerId]);

  if (!stream) return <p>Loading</p>;

  return <video></video>;
}

function CallerVideoVideo() {
  return (
    <div>
      <video></video>
    </div>
  );
}
