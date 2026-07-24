"use client";

import { useContext, useState } from "react";
import { v1 as uuid } from "uuid";
import { Mycontext } from "../components/Mycontext";
import { AuthContext } from "../context/Authcontext.js";
import Sidebar from "../components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }) {
  let [prompt, setPrompt] = useState("");
  let [reply, setReply] = useState(null);
  let [currThreadId, setCurrThreadId] = useState(uuid());
  let [prevChats, setPrevChats] = useState([]);
  let [newChat, setNewChat] = useState(true);
  let [allThreads, setAllThreads] = useState([]);
  let { user, setUser } = useContext(AuthContext);
  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads,
    user,
    setUser,
  };

  return (
    <Mycontext.Provider value={providerValues}>
      <div className="main flex">
        <Sidebar />

        {children}

        <ToastContainer
          position="top-right"
          autoClose={1800}
          toastClassName={() =>
            "bg-[#1a1a1a] border border-[#3e3e3e] rounded-xl shadow-[0_0_15px_rgba(249,178,51,0.35)] backdrop-blur-md flex items-center text-[#f6f2e9]"
          }
          bodyClassName={() =>
            "text-sm font-medium px-3 py-2 flex items-center"
          }
          progressClassName="bg-gradient-to-r from-[#f8c471] to-[#f39c12]"
          closeButton={false}
        />
      </div>
    </Mycontext.Provider>
  );
}
