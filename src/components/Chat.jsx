import Videocall from "../assets/videocall.svg";
import More from "../assets/more.svg";
import Conversation from "./Conversation";
import Input from "./Input";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  

  return (
    <div className="chat">
      <div className="chatheading">
        <div className="chatUser">
          <img
            className="profile"
            src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
          />
          <span>Username</span>
        </div>
        <div className="icons">
          <img src={Videocall} alt="" />
          <img
            src={More}
            onClick={() => {
              navigate("/info");
            }}
            alt=""
          />
        </div>
      </div>

      <Conversation />
      <Input />
    </div>
  );
};

export default Chat;
