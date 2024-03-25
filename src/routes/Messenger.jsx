import React from "react";
import Sidebar from "../components/Sidebar";
import Convolist from "../components/Convolist";
import Chat from "../components/Chat";
import More from "../components/More";
import "../messenger.scss";

const Messenger = () => {
  return (
    <div className="messenger">
      <Sidebar />
      <Convolist />
      <Chat />
      <More />
    </div>
  );
};

export default Messenger;
