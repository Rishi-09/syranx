"use client";

import React, { useEffect, useContext, useState } from "react";
import Image from "next/image";
import { Mycontext } from "./Mycontext";
import { v1 as uuid } from "uuid";
import api from "../api";
import logo from "../assets/logo.png";
import IconButton from "./ui/IconButton";
import "./Sidebar.css";

export default function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setCurrThreadId,
    setNewChat,
    setPrevChats,
    setPrompt,
    setReply,
    user,
  } = useContext(Mycontext);

  const [showSidebar, setShowSidebar] = useState(false);

  // Fetch threads
  const getAllThreads = async () => {
    try {
      const res = await api.get("/thread");
      setAllThreads(res.data.map((t) => ({ threadId: t.threadId, title: t.title })));
    } catch (err) {
      if (err.response?.status === 401) setAllThreads([]);
    }
  };

  const changeThread = async (id) => {
    setNewChat(false);
    setReply(null);

    try {
      const res = await api.get(`/thread/${id}`);
      setPrevChats(res.data.message || []);
      setCurrThreadId(id);
      setShowSidebar(false);
    } catch (err) {
      console.log(err);
    }
  };

  const createNewChat = () => {
    setNewChat(true);
    setReply(null);
    setPrompt("");
    setPrevChats([]);
    setCurrThreadId(uuid());
    setShowSidebar(false);
  };

  const deleteThread = async (id) => {
    try {
      await api.delete(`/thread/${id}`);
      if (id === currThreadId) createNewChat();
      setAllThreads((prev) => prev.filter((t) => t.threadId !== id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user) getAllThreads();
  }, [currThreadId, user]);

  return (
    <>
      <IconButton
        variant="ghost"
        size="md"
        className="glass-panel fixed top-5 left-5 z-9999 shadow-sm md:hidden"
        onClick={() => setShowSidebar(true)}
        title="Open sidebar"
      >
        <i className="fa-solid fa-bars text-sm" />
      </IconButton>

      {showSidebar && (
        <div
          className="chatgpt-sidebar-overlay animate-fade-in"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <aside className={`chatgpt-sidebar glass-panel ${showSidebar ? "show" : ""}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 pt-5 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-black shrink-0">
                <Image src={logo} alt="" fill sizes="32px" className="object-contain p-1" />
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-ink">
                Syranx
              </span>
            </div>

            <IconButton
              variant="subtle"
              size="sm"
              className="md:hidden"
              onClick={() => setShowSidebar(false)}
              title="Close sidebar"
            >
              <i className="fa-solid fa-xmark text-sm" />
            </IconButton>
          </div>

          <div className="px-3">
            <button
              className="w-full flex items-center gap-2.5 rounded-xl border border-border bg-surface-3/60 px-3.5 py-2.5 text-sm font-medium text-ink transition-all duration-200 ease-out hover:border-accent/40 hover:bg-surface-3 active:scale-[0.98]"
              onClick={createNewChat}
            >
              <i className="fa-regular fa-pen-to-square text-accent" />
              New chat
            </button>
          </div>

          <div className="mx-4 my-4 border-t border-border-subtle" />

          <div className="thread-list custom-scrollbar flex-1 overflow-y-auto px-3 pb-2">
            {!user ? (
              <div className="flex flex-col items-center gap-2 px-4 pt-10 text-center">
                <i className="fa-regular fa-message text-lg text-ink-faint" />
                <p className="text-sm text-ink-muted">
                  Sign in to see your conversation history
                </p>
              </div>
            ) : allThreads?.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 pt-10 text-center">
                <i className="fa-regular fa-comments text-lg text-ink-faint" />
                <p className="text-sm text-ink-muted">No conversations yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                {allThreads?.map((thread) => {
                  const isActive = currThreadId === thread.threadId;

                  return (
                    <div
                      key={thread.threadId}
                      className={`thread-item group relative flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200 ease-out cursor-pointer ${
                        isActive
                          ? "bg-surface-3 text-ink"
                          : "text-ink-muted hover:bg-surface-3/60 hover:text-ink"
                      }`}
                      onClick={() => changeThread(thread.threadId)}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-accent" />
                      )}
                      <span className="truncate">
                        {thread.title.length < 35
                          ? thread.title
                          : thread.title.slice(0, 34) + "…"}
                      </span>

                      <button
                        className="shrink-0 text-ink-faint opacity-0 transition-all duration-150 group-hover:opacity-100 hover:text-danger hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteThread(thread.threadId);
                        }}
                        title="Delete conversation"
                      >
                        <i className="fa-solid fa-trash text-xs" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-border-subtle px-4 py-3 text-center">
            <p className="text-xs text-ink-faint">Crafted by Rishi</p>
          </div>
        </div>
      </aside>
    </>
  );
}
