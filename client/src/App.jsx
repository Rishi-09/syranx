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

const App = () => {
  let [prompt, setPrompt] = useState("");
  let [reply, setReply] = useState(null);
  let [currThreadId, setCurrThreadId] = useState(uuid());
  let [prevChats, setPrevChats] = useState([]);
  let [newChat, setNewChat] = useState(true);
  let [allThreads, setAllThreads] = useState([]);
  let {user,setUser} = useContext(AuthContext);
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
    setUser
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
        </div>
      </BrowserRouter>
    </Mycontext.Provider>
  );
};

export default App;
