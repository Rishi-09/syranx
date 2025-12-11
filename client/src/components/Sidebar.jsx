import React, { useEffect, useContext, useState } from "react";
import { Mycontext } from "./Mycontext";
import { v1 as uuid } from "uuid";
import api from "../api";
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
      <button
        className="absolute top-8 left-10 z-9999"
        onClick={() => setShowSidebar(true)}
      >
        <i className="fa-solid fa-bars text-xl"></i>
      </button>

      {showSidebar && (
        <div className="chatgpt-sidebar-overlay" onClick={() => setShowSidebar(false)} />
      )}

      <aside className={`chatgpt-sidebar ${showSidebar ? "show" : ""}`}>
        
        <div className="sidebar-header top-5">
          <h2 className="app-title">Syranx</h2>

          <button className="chatgpt-close-btn" onClick={() => setShowSidebar(false)}>
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
        </div>

        
        <button className="new-chat-btn syranx-hover" onClick={createNewChat}>
          <i className="fa-regular fa-pen-to-square mr-2"></i>
          New Chat
        </button>

        <hr className="sidebar-divider" />

        <div className="thread-list">
          {!user ? (
            <p className="text-gray-300 text-center mt-4">Login to view chats</p>
          ) : (
            allThreads?.map((thread) => {
              const isActive = currThreadId === thread.threadId;

              return (
                <div
                  key={thread.threadId}
                  className={`thread-item syranx-hover  ${
                    isActive ? "active-thread" : ""
                  }`}
                  onClick={() => changeThread(thread.threadId)}
                >
                  <span className="thread-title">
                    {thread.title.length < 35 ? thread.title : thread.title.slice(0, 34) + "…"}
                  </span>
                  

                  <i
                    className="fa-solid fa-trash delete-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteThread(thread.threadId);
                    }}
                  />
                </div>
              );
            })
          )}
        </div>

        <div className="sidebar-footer">
          <p>By Rishi</p>
        </div>
      </aside>
    </>
  );
}
