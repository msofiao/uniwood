import React from "react";
import Logo from "../assets/logo.svg";
import Home from "../assets/home.svg";
import Message from "../assets/message.svg";
import Notification from "../assets/notification.svg";
import Profile from "../assets/profile.svg";
import Marketplace from "../assets/marketplace.svg";
import { useNavigate } from "react-router-dom";

//contains the menu bar of the website on the left side
const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={Logo} alt="logo" />
      </div>
      <div className="menu">
        <div className="menu-bar" onClick={() => {
            navigate("/");
          }}>
          <img src={Home} alt="home" />
          <div className="menu-name">Home</div>
        </div>

        <div
          className="menu-bar"
          onClick={() => {
            navigate("/conversation");
          }}
        >
          <img src={Message} alt="message" />
          <div className="menu-name">Messages</div>
        </div>

        <div className="menu-bar">
          <img src={Notification} alt="notification" />
          <div className="menu-name">Notification</div>
        </div>

        <div className="menu-bar">
          <img src={Profile} alt="profile" />
          <div className="menu-name">Profile</div>
        </div>

        <div className="menu-bar">
          <img src={Marketplace} alt="marketplace" />
          <div className="menu-name">Marketplace</div>
        </div>
        <div className="post">Post</div>
      </div>
      <div className="user">
        <img
          src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt=""
        />
        <div className="user-name">
          <span>Name</span>
          <p>username</p>
        </div>
        <button>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
