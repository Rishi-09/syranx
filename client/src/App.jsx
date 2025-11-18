import React from "react";
import axios from "axios";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Chatwindow from "./components/Chatwindow";
import { Mycontext } from "./components/Mycontext";
const App = () => {
  axios
    .get("http://localhost:8080/", { withCredentials: true })
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
  const providerValues = {};
  return (
    <div className="main flex ">
      <Mycontext.Provider values={providerValues}>
        <Sidebar />
        <Chatwindow />
      </Mycontext.Provider>
    </div>
  );
};

export default App;
