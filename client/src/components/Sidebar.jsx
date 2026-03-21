import React, { useEffect, useContext, useState } from "react";
import { Mycontext } from "./Mycontext";
import { v1 as uuid } from "uuid";
import api from "../api";

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
      <style>{`
        .sidebar-mobile {
          transform: translateX(-100%);
          transition: transform 0.28s ease;
        }
        .sidebar-mobile.show {
          transform: translateX(0);
        }
        .syranx-hover:hover {
          background: linear-gradient(135deg,rgba(248,196,113,0.22),rgba(243,156,18,0.22));
          padding-left: 26px;
          border-left: 3px solid rgba(248,196,113,0.85);
        }
        .active-thread {
          background: rgba(255, 255, 255, 0.08);
          padding-left: 14px;
          border-radius: 10px;
          font-weight: 600;
          position: relative;
          overflow: hidden;
          animation: syranx-active-glow 2.8s ease-in-out infinite;
        }
        .active-thread::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, #f8c471, #f39c12, #df8d10);
        }
        .active-thread .thread-title {
          color: #ffffff !important;
          font-weight: 600;
        }
        .delete-icon {
          opacity: 0;
          transform: scale(0.7);
          transition: 0.25s ease;
        }
        .thread-item:hover .delete-icon {
          opacity: 1;
          transform: scale(1);
        }
        .delete-icon:hover {
          color: #ff5252;
          transform: scale(1.15);
        }
        @keyframes syranx-active-glow {
          0% { box-shadow: 0 0 10px rgba(243,156,18,0.25); }
          50% { box-shadow: 0 0 18px rgba(243,156,18,0.45); }
          100% { box-shadow: 0 0 10px rgba(243,156,18,0.25); }
        }
      `}</style>
      <button
        className="absolute top-8 left-10 z-9999 text-white"
        onClick={() => setShowSidebar(true)}
      >
        <i className="fa-solid fa-bars text-xl"></i>
      </button>

      {showSidebar && (
        <div className="fixed inset-0 bg-neutral-950/55 backdrop-blur-sm z-9990" onClick={() => setShowSidebar(false)} />
      )}

      <aside className={`sidebar-mobile ${showSidebar ? "show" : ""} fixed top-0 left-0 w-64 h-screen bg-neutral-900 backdrop-blur-2xl py-3.5 px-4 z-9999 border-r border-white/12 shadow-lg`}>
        <div className="flex justify-between items-center relative top-5 pb-4">
          <h2 className="text-white text-xl font-semibold">Syranx</h2>

          <button className="text-2xl text-gray-300 bg-none" onClick={() => setShowSidebar(false)}>
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
        </div>

        <button className="w-full mt-4 px-4 py-2.5 rounded-lg bg-neutral-700 text-white text-left transition-all hover:bg-gradient-to-br hover:from-[#f7b456] hover:to-[#df8d10] syranx-hover" onClick={createNewChat}>
          <i className="fa-regular fa-pen-to-square mr-2"></i>
          New Chat
        </button>

        <hr className="border-white/15 my-1.5" />

        <div className="thread-list mt-4 h-[70vh] overflow-y-auto">
          {!user ? (
            <p className="text-gray-400 text-center mt-4 text-sm">Login to view chats</p>
          ) : (
            allThreads?.map((thread) => {
              const isActive = currThreadId === thread.threadId;

              return (
                <div
                  key={thread.threadId}
                  className={`thread-item px-2 py-1.5 mb-1 flex justify-between rounded-lg transition-all cursor-pointer ${
                    isActive ? "active-thread" : "hover:bg-neutral-700"
                  } syranx-hover`}
                  onClick={() => changeThread(thread.threadId)}
                >
                  <span className="thread-title text-gray-300 w-4/5 whitespace-nowrap overflow-hidden text-ellipsis">
                    {thread.title.length < 35 ? thread.title : thread.title.slice(0, 34) + "…"}
                  </span>

                  <i
                    className="fa-solid fa-trash delete-icon text-gray-500"
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

        <div className="absolute bottom-2.5 text-center font-normal text-gray-500 w-56">
          <p className="text-sm">By Rishi</p>
        </div>
      </aside>
    </>
  );
}
