import React, { useContext, useEffect, useRef, useState } from "react";
import api from "../api.js";
import { Mycontext } from "./Mycontext";
import { PuffLoader } from "react-spinners";
import Chat from "./Chat";
import Dropdown from "./Dropdown";
import "./Sidebar.css";
import "./Chatwindow.css";
import { useNavigate } from "react-router-dom";

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
    user
  } = useContext(Mycontext);

  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // store the current AbortController so we can abort the request
  const controllerRef = useRef(null);
  const navigate = useNavigate();

  const getReply = async () => {
    if(!user) navigate("/login");
    if (!prompt.trim()) return;

    if (controllerRef.current) {
      try {
        controllerRef.current.abort();
      } catch {
        ("");
      }
    }
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setIsGenerating(true);
    setNewChat(false);

    try {
      let response = await api.post(
        "/chat",
        {
          message: prompt,
          threadId: currThreadId,
        },
        { signal: controller.signal }
      );

      let latest = response.data.message[response.data.message.length - 1];
      setReply(latest.content);
    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError") {
        console.log("Generation aborted by user");
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
      setIsGenerating(false);
      controllerRef.current = null;
    }
  };
  const stopGeneration = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    setIsGenerating(false);
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
      container.scrollHeight - container.scrollTop - container.clientHeight <
      50;

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
        <button onClick={scrollToBottom} className="scroll-btn">
          <i className="fa-solid fa-chevron-down"></i>
        </button>
      )}

      {newChat && (
        <div className="flex justify-center items-center h-full ">
          <h1 className="font-bold text-2xl opacity-70 custom-text ">
            Start a New Chat
          </h1>
        </div>
      )}

      <div ref={chatContainerRef} className="chatgpt-chat-container">
        <Chat />
        <div className="flex w-full justify-start p-1 pl-1" >
          <PuffLoader color="#f8c471" className=" " loading={loading} />
        </div>
      </div>

      {
        user?(
          <div
        className="
          chatgpt-input-wrapper
          fixed bottom-6 w-full flex justify-center
          px-4
          "
      >
        <textarea
          placeholder="Message Syranx..."
          className="
            chatgpt-input
            w-full
            max-w-[750px]
            bg-[#1a1a1a]
            text-[#f6f2e9]
            border border-[#3e3e3e]
            rounded-xl
            px-4 py-3
            resize-none
            outline-none
            leading-[1.4rem]
            transition-all duration-200
            shadow-[0_0_20px_rgba(249,178,51,0.12)]
            min-h-[60px]
            max-h-[200px]
            overflow-y-auto
            scrollbar-thin
            scrollbar-track-[#111]
            scrollbar-thumb-[#f7b456]
            hover:scrollbar-thumb-[#df8d10]
    "
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            const el = e.target;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) return;
            if (e.key === "Enter") {
              e.preventDefault();
              if (prompt.trim().length === 0) return;
              getReply();
            }
          }}
        />

        {!isGenerating && (
          <button
            onClick={getReply}
            disabled={isGenerating}
            className="
            ml-3
            px-4
            rounded-lg
            bg-linear-to-br from-[#f8c471] to-[#f39c12]
            text-black
            text-xl
            shadow-[0_0_12px_rgba(243,156,18,0.35)]
            hover:shadow-[0_0_18px_rgba(243,156,18,0.55)]
            transition-all duration-200
            "
          >
            <i
              className="fa-regular fa-paper-plane "
              style={{ color: "black" }}
            ></i>
          </button>
        )}
        {isGenerating && (
          <button
            onClick={stopGeneration}
            className="ml-3 px-4 rounded-lg bg-[#2b2b2b] text-[#f6f2e9] border border-[#444] hover:bg-[#3a3a3a] transition-all"
            title="Stop generation"
          >
            <i className="fa-solid fa-square"></i> {/* stop icon */}
          </button>
        )}
      </div>
        ): <h3>Please login click the dropdown (upper right corner)</h3>
      }

      <p className="chatgpt-footer">Syranx may produce inaccurate responses.</p>
    </section>
  );
};

export default Chatwindow;
