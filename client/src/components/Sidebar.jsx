import React from "react";
import { useEffect, useState, useContext } from "react";
import { Mycontext } from "./Mycontext";

function Sidebar() {
  let { allThreads, setAllThreads, currThreadId } = useContext(Mycontext);

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
  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);
  console.log(allThreads);
  return (
    <>
      <section className=" w-60 bg-neutral-800  ">
        {/*new chat section */}
        <div className=" flex border border-zinc-400/30 mt-2 m-1 rounded-md">
          <i className="fa-solid fa-chess-queen mt-2.5 ml-4  mb-1  "></i>
          <p className="inline  mt-1 ml-16  text-xl mb-1 ">Syranx</p>
        </div>
        <div className="mt-6 mb-3">
          <a
            className="hover:bg-amber-100/10   pt-2 m-3 pr-10  pl-3 pb-2  rounded-md transition-all duration-200 "
            href="#"
          >
            <i className="fa-regular fa-pen-to-square mr-5"></i>
            New Chat
          </a>
        </div>
        <hr className="opacity-10 " />
        <div className="" >
          <ul>
          {allThreads?.map((thread) => (
            <li className="w-full ml-1 mt-2 mb-2" key={thread.threadId}>
              <a
                href="#"
                className="hover:bg-amber-100/10  w-11/12 pt-2 m-3 pr-22 pl-3 pb-2  rounded-md transition-all duration-200 "
              >
              {thread.title}
              </a>
            </li>
          ))}
        </ul>
        </div>

        <hr className="opacity-10 mt-5" />
        <div className="absolute bottom-0">
          <p className="relative left-10 m-4 ">By Rishi</p>
        </div>
      </section>
    </>
  );
}

export default Sidebar;
