import React, { useContext, useEffect, useRef, useState } from "react";
import api from "../api.js";
import { Mycontext } from "./Mycontext";
import { BarLoader } from "react-spinners";
import Chat from "./Chat";
import Dropdown from "./Dropdown";
import "./Sidebar.css"; 

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

  const [loading, setLoading] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setNewChat(false);

    try {
      let response = await api.post("/chat", {
        message: prompt,
        threadId: currThreadId,
      });

      let latest = response.data.message[response.data.message.length - 1];
      setReply(latest.content);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prev) => [
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
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

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    const atBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 50;

    setShowScrollButton(!atBottom);
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
    <section className="chatgpt-chat-wrapper bg-neutral-900 text-white w-full h-screen flex flex-col items-center relative">

      <div className="absolute right-5 top-5 z-4000">
        <Dropdown />
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="scroll-btn"
        >
          <i className="fa-solid fa-chevron-down"></i>
        </button>
      )}

      {newChat && (
        <div className="flex justify-center items-center h-full pointer-events-none">
          <h1 className="font-bold text-4xl opacity-70">Start a New Chat</h1>
        </div>
      )}

      <div
        ref={chatContainerRef}
        className="chatgpt-chat-container"
      >
        <Chat />
        <BarLoader color="#fff" className="m-4" loading={loading} />
      </div>

      <div className="chatgpt-input-wrapper">
        <input
          type="text"
          placeholder="Message Syranx..."
          className="chatgpt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && getReply()}
        />

        <button className="chatgpt-send-btn" onClick={getReply}>
          <i className="fa-regular fa-paper-plane"></i>
        </button>
      </div>

      <p className="chatgpt-footer">
        Syranx may produce inaccurate responses.
      </p>
    </section>
  );
};

export default Chatwindow;
