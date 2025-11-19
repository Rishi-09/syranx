import React from "react";

const Sidebar = () => {
  return (
    <>
      <section className="h-screen w-56 bg-neutral-800  ">
        {/*new chat section */}
        <div className="m-4">
          <i className="fa-solid fa-chess-queen "></i>
          <p className="inline p-4">Syranx</p>
        </div>
        <button className="m-4 pt-1.5 pr-3 pl-3 pb-1.5 rounded-2xl  hover:bg-amber-100/10 transition-all duration-700 ">
          {/* <i class="fa-regular fa-pen-to-square" style="color: #ffffff;"></i> */}
          New Chat
        </button>
        <hr className="opacity-10 " />
        <ul className="p-4">
          <li>
            <button className="hover:bg-amber-100/10 rounded-2xl pr-3 pl-3 pt-1 pb-1 transition-all duration-700">
              history1
            </button>
          </li>
          <li>
            <button className="hover:bg-amber-100/10 rounded-2xl pr-3 pl-3 pt-1 pb-1 transition-all duration-700">
              history2
            </button>
          </li>
          <li>
            <button className="hover:bg-amber-100/10 rounded-2xl pr-3 pl-3 pt-1 pb-1 transition-all duration-700">
              history3
            </button>
          </li>
          <li>
            <button className="hover:bg-amber-100/10 rounded-2xl pr-3 pl-3 pt-1 pb-1 transition-all duration-700">
              history4
            </button>
          </li>
        </ul>
        <hr className="opacity-10 " />
        <div className="p-5 absolute bottom-0 ">By Rishi</div>
      </section>
    </>
  );
};

export default Sidebar;
