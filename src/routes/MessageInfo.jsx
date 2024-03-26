import React from "react";
import Sidebar from "../components/Sidebar";
import Convolist from "../components/Convolist";
import Chat from "../components/Chat";
import Info from "../components/Info";
import "../messenger.scss";

const MessageInfo = () => {
  return (
    <div className="messenger">
      <Sidebar />
      <Convolist />
      <Chat />
      <Info />
    </div>
  );
};

export default MessageInfo;
