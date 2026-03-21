import React, { useContext, useState, useEffect } from "react";
import { Mycontext } from "./Mycontext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const Chat = () => {
  let { prevChats, reply } = useContext(Mycontext);
  let [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }
    if (!prevChats?.length) return;
    const content = reply.split(" ");
    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));

      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [reply, prevChats]);

  return (
    <>
      <div className="w-5/6 mx-auto flex-1 overflow-y-auto p-4 custom-chat">
        {prevChats?.slice(0, -1).map((chat, idx) => (
          <div
            className={
              chat.role === "user" ? "flex justify-end" : "flex justify-start"
            }
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="prompt m-4 p-4 bg-amber-50/10 rounded-full max-w-5/6 custom-prompt">
                {chat.content}
              </p>
            ) : (
              <div className="message reply m-4 max-w-5/6 p-4 rounded-2xl custom-width">
                <div className="justify-start">
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {chat.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}
        {prevChats.length > 0 && latestReply !== null && (
          <div className="reply m-4 max-w-5/6 p-4 rounded-2xl custom-width" key={"typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {latestReply}
            </ReactMarkdown>
          </div>
        )}
        {prevChats.length > 0 && latestReply === null && (
          <div className="reply m-4 max-w-5/6 p-4 rounded-2xl custom-width" key={"typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {prevChats[prevChats.length - 1].content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
