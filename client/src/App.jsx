import React, { useState } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Chatwindow from "./components/Chatwindow";
import { Mycontext } from "./components/Mycontext";
import {v1 as uuid} from 'uuid';
const App = () => {
  // axios
  //   .get("http://localhost:8080/api/thread", { withCredentials: true })
  //   .then((data) => console.log(data))
  //   .catch((err) => console.log(err));

  let [prompt,setPrompt] = useState("");
  let [reply,setReply] = useState(null);
  let [currThreadId,setcurrThreadId] = useState(uuid);
  const providerValues = {
    prompt,setPrompt,
    reply,setReply,
    currThreadId,setcurrThreadId
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
