  import React, { useContext, useEffect, useRef, useState } from "react";
  import api from "../api.js";
  import { Mycontext } from "./Mycontext";
  import { PuffLoader } from "react-spinners";
  import Chat from "./Chat";
  import Dropdown from "./Dropdown";
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
    useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem("user");
      if (!stored) navigate("/login");
    }
  }, [user]);


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
      <section className="relative w-full h-screen flex flex-col items-center text-white bg-neutral-900 overflow-hidden" style={{backgroundImage: `radial-gradient(circle at 20% 30%, rgba(248,196,113,0.08), transparent 40%), radial-gradient(circle at 80% 60%, rgba(243,156,18,0.06), transparent 40%)`, backgroundAttachment: "fixed"}}>
        <style>{`
          .send-btn {
            transition: all 0.2s ease;
          }
          .send-btn:hover {
            transform: scale(1.08);
            box-shadow: 0 0 22px rgba(243,156,18,0.6);
          }
          .send-btn:active {
            transform: scale(0.92);
          }
        `}</style>
        <div className="absolute right-5 top-5 z-40">
          <Dropdown />
        </div>

        {showScrollButton && (
          <button onClick={scrollToBottom} className="fixed bottom-32 right-7 bg-neutral-800 p-3 rounded-full border border-gray-600 z-50 hover:bg-neutral-700 transition-colors">
            <i className="fa-solid fa-chevron-down text-white"></i>
          </button>
        )}

        {newChat && (
          <div className="flex justify-center items-center h-full">
            <h1 className="font-bold text-2xl opacity-70 custom-text">
              Start a New Chat
            </h1>
          </div>
        )}

        <div ref={chatContainerRef} className="w-full max-w-full h-[calc(100vh-150px)] mt-24 overflow-y-scroll p-4 scrollbar-hide">
          <Chat />
          <div className="relative pl-24 custom-loader">
            <PuffLoader color="#f8c471" className="" loading={loading} />
          </div>
        </div>

        {
          user?(
            <div className="fixed bottom-6 w-full flex justify-center px-4 z-50">
              <textarea
                placeholder="share anything..."
                className="w-full max-w-[750px] bg-[#1a1a1a] text-[#f6f2e9] border border-[#3e3e3e] rounded-xl px-4 py-3 resize-none outline-none leading-[1.4rem] transition-all duration-200 shadow-[0_0_20px_rgba(249,178,51,0.12)] min-h-[60px] max-h-[200px] overflow-y-auto custom-scrollbar"
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
                  className="ml-3 px-4 rounded-lg bg-gradient-to-br from-[#f8c471] to-[#f39c12] text-black text-xl send-btn shadow-[0_0_12px_rgba(243,156,18,0.35)] hover:shadow-[0_0_18px_rgba(243,156,18,0.55)] transition-all duration-200 hover:scale-110"
                >
                  <i
                    className="fa-regular fa-paper-plane"
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
                  <i className="fa-solid fa-square"></i>
                </button>
              )}
            </div>
          ): <h3 className="text-center text-gray-300">Please login click the dropdown (upper right corner)</h3>
        }

        <p className="fixed bottom-0 w-full text-center opacity-50 text-xs py-2">Syranx may produce inaccurate responses.</p>
      </section>
    );
  };

  export default Chatwindow;
