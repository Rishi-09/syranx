import React, { useContext } from "react";
import { Mycontext } from "./Mycontext";

const Chat = () => {
  let { prevChats, setPrevChats, newChat, setNewChat } = useContext(Mycontext);
  const alignChat = () => {
    let userMessage = document.getElementById("userMessage");
    let aiReply = document.getElementById("aiReply");
    let i = 0;
    prevChats.map((chat) => {
      if (chat[i].role === "user") {
        userMessage.className = userMessage.className + " absolute right-0 ";
      } else {
        aiReply.className = aiReply.className + " absolute left-0 ";
      }
    });
  };
  return (
    <>
      <div className="chat ">
        <div id="userMessage" className="flex justify-end">
          <p className="prompt m-4 p-4 bg-amber-50/10 rounded-4xl  ">
            prompt
          </p>
        </div>
        <div id="aiReply" className="flex justify-start" >
          <p className="reply m-4 max-w-5/6 p-4 bg-amber-50/10 rounded-4xl " >
            aiReply Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores, error?
          </p>
        </div>
      </div>
    </>
  );
};

export default Chat;
