import React, { useContext,useState } from "react";
import { Mycontext } from "./Mycontext";
import {BarLoader} from 'react-spinners';
const Chatwindow = () => {
  const { prompt, setPrompt, reply, setReply, currThreadId, setcurrThreadId } =
    useContext(Mycontext);
  let [loading,setloading] = useState(false);
  const getReply = async () => {
    setloading(true);
    console.log("message",prompt,"\nthread id:"+currThreadId)
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
      let res = await fetch("http://localhost:8080/api/chat",options);
      let reply = await res.json();
      let latest = reply.message[reply.message.length - 1];
      console.log(latest.content);
      setReply(latest.content)
    } catch (err) {
      console.log(err);
    }
    setloading(false);
  };

  return (
    <section className=" h-screen bg-neutral-900 w-screen  ">
      <div className="absolute right-0">
        <i className="fa-solid fa-circle-user text-2xl m-4"></i>
      </div>
      
      <div className="flex justify-center">
        <BarLoader color="#fff" className="" loading={loading} ></BarLoader>
        <input
          type="text"
          name=""
          id=""
          placeholder="What do you have today?"
          className="h-16 w-2/3 bg-neutral-100/10 rounded-4xl border border-amber-50/20 absolute bottom-5 p-5 outline-0 "
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e)=>e.key==='Enter'?getReply():''}
        />
        <button
          type="submit"
          onClick={getReply}
          
          className="pt-3 pb-3 pr-3.5 pl-3.5  absolute text-xl bottom-6.5 lg:right-38 md:right-20 sm:right-6 [480px]:right-1 hover:bg-neutral-50/10 rounded-4xl"
        >
          <i className="fa-regular fa-paper-plane    "></i>
        </button>
      </div>
    </section>
  );
};

export default Chatwindow;
