import React, { useContext } from "react";
import { Mycontext } from "./Mycontext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/github-dark.css';
const Chat = () => {
  let { prevChats, setPrevChats, newChat, setNewChat } = useContext(Mycontext);
  return (
    <>
      <div className="chat ">
        {prevChats?.map((chat, idx) => (
          <div
            className={
              chat.role === "user" ? "flex justify-end" : "flex justify-start"
            }
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="prompt m-4 p-4 bg-amber-50/10 rounded-4xl  ">
                {chat.content}
              </p>
            ) : (
              <div className="reply m-4 max-w-5/6 p-4 rounded-4xl" >
                <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                
              >
                {typeof chat.content === "string"
                  ? chat.content
                  : String(chat.content)}
              </ReactMarkdown>
              </div>
              
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Chat;
