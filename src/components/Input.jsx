import React from "react";
import Img from "../assets/img.svg";
import Send from "../assets/send.svg";

//This component is for the user to start new message
const Input = () => {
  return (
      <div className="input">
        <img src={Img} alt="" />
        <input type="text" placeholder="Start a new message" />
        <div className="send">
          <img src={Send} alt="" />
        </div>
      </div>
  );
};

export default Input;
