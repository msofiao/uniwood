import React from "react";
import Media from "../components/Media";

const Info = () => {
  return (
    <div className="info">
      <div className="navbar">
        <span>Details</span>
      </div>
      <div className="details">
        <div className="user">
          <img
            src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
          />
          <div className="name">
            <span>Name</span>
            <p>@username</p>
          </div>
        </div>
        <p>Report</p>
        <p>Block</p>
        <p>Delete Chat</p>
      </div>
      <p>Shared Media</p>
      <Media />
    </div>
  );
};

export default Info;
