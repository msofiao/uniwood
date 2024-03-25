import React from "react";
import Compose from "../assets/compose.svg";
import Chatlist from "./Chatlist";
import Search from "./Search";

const Convolist = () => {
  return (
    <div className="convo">
      <div className="navbar">
        <span>Messages</span>
        <img src={Compose} alt="" />
      </div>
      <Search />
      <Chatlist />
    </div>
  );
};

export default Convolist;
