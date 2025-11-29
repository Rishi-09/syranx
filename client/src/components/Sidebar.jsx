import React from "react";
import { useEffect, useContext } from "react";
import { Mycontext } from "./Mycontext";
import { v1 as uuid } from "uuid";

function Sidebar() {
  let { allThreads, setAllThreads, currThreadId,setCurrThreadId ,setNewChat,setPrevChats,setPrompt,setReply} = useContext(Mycontext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread");
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      // console.log(res);
      setAllThreads(filteredData);
    } catch (err) {
      console.log("failed fetching threads", err);
    }
  };

  const createNewChat = async () =>{
    setNewChat(true);
    setReply(null);
    setPrompt("");
    setPrevChats([]);
    setCurrThreadId(uuid());

  }

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);
  console.log(allThreads);
  return (
    <>
      <section className=" w-84 bg-neutral-800 h-screen overflow-hidden   ">
        {/*new chat section */}
        <div className=" flex justify-around border border-zinc-400/30 rounded-md">
          <i className="fa-solid fa-chess-queen mt-5"></i>
          <p>syranx</p>
        </div>


        <div className="h-5/6 overflow-y-scroll overflow-x-hidden custom-scrollbar  ">
          <div className="">
            <button
              onClick={createNewChat}
              className="hover:bg-amber-100/10 w-11/12 pt-2 mr-3 ml-3 mt-1 mb-1 pr-10  pl-3 pb-2  rounded-md transition-all duration-200  "
            >
              <i className="fa-regular fa-pen-to-square mr-5"></i>
              <p className="inline" >New Chat</p>
            </button>
          </div>


          <hr className="opacity-10 " />
          <div className="p-0.5">
            <ul>
              {allThreads?.map((thread) => (
                <li className="w-11/12 list-item p-1.5 ml-2 hover:bg-amber-100/10 rounded-lg transition-all duration-200 " key={thread.threadId}>
                  <a
                    href="#"
                    className="m-4"
                  >
                    {thread.title.length < 10 ? thread.title : "Chat"}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="opacity-10 mt-5" />
        <div className="flex justify-center items-baseline">
          <p className="">By Rishi</p>
        </div>
      </section>
    </>
  );
}

export default Sidebar;
