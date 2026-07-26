"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import api from "../api.js";
import { Mycontext } from "./Mycontext";
import Chat from "./Chat";
import Dropdown from "./Dropdown";
import IconButton from "./ui/IconButton";
import TypingIndicator from "./ui/TypingIndicator";
import "./Sidebar.css";
import "./Chatwindow.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
    user,
  } = useContext(Mycontext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem("user");
      if (!stored) router.push("/login");
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [compacting, setCompacting] = useState(false);

  // store the current AbortController so we can abort the request
  const controllerRef = useRef(null);

  const getReply = async () => {
    if (!user) router.push("/login");
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
      } else if (err.response?.data?.code === "token_limit_exceeded") {
        toast.error(
          "Token limit reached. Start a new chat, or compact this conversation.",
          { theme: "dark", autoClose: 5000 }
        );
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

  const compactChat = async () => {
    if (!user || compacting || isGenerating || prevChats.length === 0) return;

    setCompacting(true);
    try {
      const res = await api.post(`/thread/${currThreadId}/compact`);
      setPrevChats(res.data.message || []);
      toast.success("Conversation compacted", { theme: "dark" });
    } catch (err) {
      const message = err.response?.data?.error || "Failed to compact chat";
      toast.error(message, { theme: "dark" });
    } finally {
      setCompacting(false);
    }
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
    <section className="chatgpt-chat-wrapper relative flex h-screen w-full flex-col items-center bg-canvas text-ink">
      <div className="absolute right-5 top-5 z-4000">
        <Dropdown />
      </div>

      {!user ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center animate-rise-in">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface-2 text-accent">
            <i className="fa-solid fa-lock text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink">Sign in to start chatting</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Your conversations are saved to your account.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/login")}
              className="rounded-xl bg-linear-to-br from-accent-soft to-accent-strong px-4 py-2 text-sm font-semibold text-accent-ink shadow-accent transition-all duration-200 ease-out hover:brightness-105 active:scale-95"
            >
              Log in
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="rounded-xl border border-border bg-surface-3/60 px-4 py-2 text-sm font-medium text-ink transition-all duration-200 ease-out hover:border-border-strong hover:bg-surface-3 active:scale-95"
            >
              Sign up
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            ref={chatContainerRef}
            className="chatgpt-chat-container custom-scrollbar relative w-full flex-1 overflow-y-auto"
          >
            {newChat ? (
              <div className="flex min-h-full flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-2 text-accent">
                  <i className="fa-solid fa-wand-magic-sparkles text-xl" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-ink">
                  What's on your mind?
                </h1>
                <p className="max-w-sm text-sm text-ink-muted">
                  Ask anything — Syranx remembers context across your conversation.
                </p>
              </div>
            ) : (
              <>
                <Chat />
                {loading && (
                  <div className="mx-auto w-full max-w-3xl px-4 pb-6 pl-10">
                    <TypingIndicator />
                  </div>
                )}
              </>
            )}
          </div>

          {showScrollButton && (
            <IconButton
              variant="ghost"
              size="md"
              onClick={scrollToBottom}
              title="Scroll to latest"
              className="scroll-btn glass-panel shadow-md animate-fade-in"
            >
              <i className="fa-solid fa-chevron-down text-sm" />
            </IconButton>
          )}

          <div className="flex w-full flex-col items-center px-4 pb-5 pt-2">
            <div className="composer glass-panel flex w-full max-w-3xl items-end gap-2 rounded-2xl p-2 shadow-md transition-all duration-200 ease-out focus-within:border-accent/40 focus-within:shadow-accent">
              <textarea
                placeholder="Message Syranx…"
                className="chatgpt-input custom-scrollbar flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] leading-6 text-ink placeholder:text-ink-faint outline-none"
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

              <IconButton
                variant="ghost"
                size="md"
                onClick={compactChat}
                disabled={compacting || isGenerating || prevChats.length === 0}
                title="Compact conversation history"
              >
                <i
                  className={`fa-solid ${compacting ? "fa-spinner fa-spin" : "fa-compress"}`}
                />
              </IconButton>

              {!isGenerating ? (
                <IconButton
                  variant="solid"
                  size="md"
                  onClick={getReply}
                  disabled={isGenerating || !prompt.trim()}
                  title="Send message"
                >
                  <i className="fa-solid fa-arrow-up" />
                </IconButton>
              ) : (
                <IconButton
                  variant="danger"
                  size="md"
                  onClick={stopGeneration}
                  title="Stop generation"
                >
                  <i className="fa-solid fa-square text-xs" />
                </IconButton>
              )}
            </div>

            <p className="mt-2.5 text-center text-[11px] text-ink-faint">
              Syranx may produce inaccurate responses.
            </p>
          </div>
        </>
      )}
    </section>
  );
};

export default Chatwindow;
