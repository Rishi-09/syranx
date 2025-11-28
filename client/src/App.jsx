import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Chatwindow from "./components/Chatwindow";
import { Mycontext } from "./components/Mycontext";
import { v1 as uuid } from "uuid";
const App = () => {
  let [prompt, setPrompt] = useState("");
  let [reply, setReply] = useState(null);
  let [currThreadId, setcurrThreadId] = useState(uuid());
  let [prevChats, setPrevChats] = useState([]);
  let [newChat, setNewChat] = useState(true);
  let [allThreads,setAllThreads] = useState([]);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setcurrThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads
  };
  return (
    <div className="main flex ">
      <Mycontext.Provider value={providerValues}>
        <Sidebar />
        <Chatwindow />
      </Mycontext.Provider>
    </div>
  );
};

export default App;
