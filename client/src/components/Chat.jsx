import React, { useContext,useState,useEffect } from "react";
import { Mycontext } from "./Mycontext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import './Chat.css'
import "highlight.js/styles/github-dark.css";
const Chat = () => {
  let { prevChats, setPrevChats, newChat, setNewChat,reply } = useContext(Mycontext);
  let [ latestReply,setLatestReply ] = useState(null);
  useEffect(()=>{
    if(!prevChats?.length) return;
    const content = reply.split(" ");
    let idx = 0;
    const interval = setInterval(()=>{
      setLatestReply(content.slice(0,idx+1).join(" "));

      idx++;
      if(idx>=content.length) clearInterval(interval);
    },40)

    return () => clearInterval(interval);
    
  },[reply,prevChats])
  return (
    <>
      <div className="chat ">
        {prevChats?.slice(0,-1).map((chat, idx) => (
          <div
            className={
              chat.role === "user" ? "flex justify-end" : "flex justify-start"
            }
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="prompt m-4 p-4 bg-amber-50/10 rounded-4xl max-w-5/6 ">
                {chat.content}
              </p>
            ) : (
              <div className="reply m-4 max-w-5/6 p-4 rounded-4xl">
                <p className=" justify-start">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}  >
                  {chat.content}
                </ReactMarkdown>
                </p>
              </div>
              
            )}
           
          </div>
           
        ))}
        {
              prevChats.length>0 && latestReply!==null &&
              <div className="max-w-5/6  justify-start m-4" key={"typing"} >
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {latestReply}
              </ReactMarkdown>
            </div>
            }
      </div>
    </>
  );
};

export default Chat;
