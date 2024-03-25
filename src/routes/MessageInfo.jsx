import React from "react";
import Sidebar from "../components/Sidebar";
import Convolist from "../components/Convolist";
import Chat from "../components/Chat";
import Info from "../components/Info";
import "../messengerinfo.scss";

const MessageInfo = () => {
  return (
    <div className="messageinfo">
      <Sidebar />
      <Convolist />
      <Chat />
      <Info />
    </div>
  );
};

export default MessageInfo;
