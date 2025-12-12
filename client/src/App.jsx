import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Chatwindow from "./components/Chatwindow";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Mycontext } from "./components/Mycontext";
import { v1 as uuid } from "uuid";
import { AuthContext } from "./context/Authcontext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
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
      <BrowserRouter>
        <div className="main flex">
          <Sidebar />

          <Routes>
            <Route path="/" element={<Chatwindow />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>

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
      </BrowserRouter>
    </Mycontext.Provider>
  );
};

export default App;
