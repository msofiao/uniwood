import React from "react";
import Sidebar from "../components/Sidebar";
import Convolist from "../components/Convolist";
import Chat from "../components/Chat";
import Info from "../components/Info";
import "../messenger.scss";

const Conversation = () => {
  return (
    <div className="messenger">
      <Sidebar />
      <Convolist />
      <div className="conversation">
        conversation
      </div>
    </div>
  );
};

export default Conversation;
