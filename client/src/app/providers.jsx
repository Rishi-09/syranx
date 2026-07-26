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
            "glass-panel rounded-xl shadow-md flex items-center text-ink"
          }
          bodyClassName={() =>
            "text-sm font-medium px-3 py-2 flex items-center"
          }
          progressClassName="bg-linear-to-r from-accent-soft to-accent-strong"
          closeButton={false}
        />
      </div>
    </Mycontext.Provider>
  );
}
