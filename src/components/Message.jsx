import React from "react";

//This component is the conversation component exchange by the other user and the owner
// has two categories to specify the owner and other user
const Message = () => {
  return (
    <>
      <div className="chattime">
        <span>Feb 13, 2024 10:30 AM </span>
      </div>
      <div className="message">
        <div className="messageInfo">
          <img
            src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
          />
        </div>
        <div className="messageContent">
          <p>Hello</p>
          <img
            src="https://images.pexels.com/photos/17543635/pexels-photo-17543635/free-photo-of-silhouetted-palm-trees-with-sun-shining-between-the-leaves.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
          />
        </div>
      </div>
      <div className="chattime">
        <span>Feb 13, 2024 10:30 AM </span>
      </div>
      <div className="message owner">
        <div className="messageInfo">
          <img
            src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
          />
        </div>
        <div className="messageContent">
          <p>Hello</p>
          <img
            src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default Message;
