import React, { useContext, useEffect, useState } from "react";
import { Mycontext } from "./Mycontext";
import { BarLoader } from "react-spinners";
import Chat from "./Chat";

const Chatwindow = () => {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat
  } = useContext(Mycontext);
  let [loading, setloading] = useState(false);
  const getReply = async () => {
    setloading(true);
    console.log("message", prompt, "\nthread id:" + currThreadId);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };
    try {
      let response = await fetch("http://localhost:8080/api/chat", options);
      let result = await response.json();
      let latest = result.message[result.message.length - 1];
      console.log("reply:" + latest.content);
      console.log("type of reply:" + typeof latest.content);
      setReply(latest.content);
    } catch (err) {
      console.log(err);
    }
    setloading(false);
    setNewChat(false);
  };
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }
    setPrompt("");
  }, [reply]);
  useEffect(() => {
    const container = document.querySelector(".chat");
    container?.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [prevChats]);

  return (
    <section className=" h-screen bg-neutral-900 w-full flex justify-center items-center custom-scrollbar">
      {
        newChat ?
        <div>
          <h1 className="font-bold text" >Start New Chat</h1>
        </div>:""
      }
      <div className="absolute right-0 top-0">
        <i className="fa-solid fa-circle-user text-2xl m-4"></i>
      </div>
      <div className="absolute w-2/3 h-11/12 bottom-0 rounded-4xl overflow-y-scroll  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Chat />
        <BarLoader color="#fff" className="m-4 " loading={loading}></BarLoader>
          <input onSubmit={getReply}
          type="text"
          name=""
          id=""
          placeholder="What do you have today?"
          className="h-16 w-full bg-neutral-100/10 rounded-4xl border border-amber-50/20 absolute bottom-8 p-5 outline-0 "
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
        />
        <button
          type="submit"
          onClick={getReply}
          className="pt-3 pb-3 pr-3.5 pl-3.5  absolute text-xl bottom-9 lg:right-3 md:right-2 sm:right-0 [480px]:right-1 hover:bg-neutral-50/10 rounded-4xl"
        >
          <i className="fa-regular fa-paper-plane    "></i>
        </button>
        
      </div>
    </section>
  );
};

export default Chatwindow;
