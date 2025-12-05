import React, { useContext, useEffect, useRef, useState } from "react";
import api from '../api.js'
import { Mycontext } from "./Mycontext";
import { BarLoader } from "react-spinners";
import Chat from "./Chat";
import "./Sidebar.css";
import Dropdown from "./Dropdown";
const Chatwindow = () => {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    
  } = useContext(Mycontext);
 

 

  let [loading, setloading] = useState(false);
  const getReply = async () => {
    setloading(true);
    setNewChat(false);
    console.log("message", prompt, "\nthread id:" + currThreadId);

    try {
      let response = await api.post("/chat", {
        message: prompt,
        threadId: currThreadId,
      });
      console.log(response.data);
      let latest = response.data.message[response.data.message.length - 1];
      console.log("reply:" + latest.content);
      console.log("type of reply:" + typeof latest.content);
      setReply(latest.content);
    } catch (err) {
      console.log(err);
    }
    setloading(false);
  };
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }
    setPrompt("");
  }, [reply]);
  const chatContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Detect when user scrolls manually
  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      50;

    setShowScrollButton(!isAtBottom);
  };

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [prevChats, reply]);

  return (
    <section className=" h-screen bg-neutral-900 w-full flex justify-center items-center custom-scrollbar  ">
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-28 right-10 bg-neutral-800 text-white p-3 rounded-full shadow-lg border border-white/20 hover:bg-neutral-700 transition z-9999 "
        >
          <i class="fa-solid fa-chevron-down"></i>
        </button>
      )}

      {newChat ? (
        <div>
          <h1 className="font-bold text-4xl custom-size ">Start New Chat</h1>
        </div>
      ) : (
        ""
      )}
      <Dropdown />
      <div
        ref={chatContainerRef}
        className="absolute w-2/3 h-10/12 bottom-24  overflow-y-scroll  [&::-webkit-scrollbar]:hidden custom-w [-ms-overflow-style:none] [scrollbar-width:none]  "
      >
        <Chat />
        <BarLoader color="#fff" className="m-4 " loading={loading}></BarLoader>
      </div>
      <div className="absolute w-2/3  bottom-0 rounded-4xlcustom-input-section ">
        <input
          onSubmit={getReply}
          type="text"
          name=""
          id=""
          placeholder="What do you have today?"
          className="h-16 w-full bg-neutral-100/10 rounded-2xl border border-amber-50/20 absolute  bottom-8 p-5 outline-0 custom-input-section "
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
        />
        <button
          type="submit"
          onClick={getReply}
          className="pt-3 pb-3 pr-3.5 pl-3.5  absolute text-xl bottom-9 lg:right-3 md:right-2 custom-send-icon hover:bg-neutral-50/10 rounded-4xl "
        >
          <i className="fa-regular fa-paper-plane    "></i>
        </button>
        <div className="flex justify-center custom-text">
          syranx uses different models and can make mistakes.
        </div>
      </div>
    </section>
  );
};

export default Chatwindow;
