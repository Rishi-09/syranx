import React from "react";


const Sidebar = () => {
  return (
    <>
      <section className="h-screen w-60 bg-neutral-800 rounded-tr-2xl rounded-br-2xl" >
        {/*new chat section */}
        <img src="https://www.vecteezy.com/free-vector/complex-logo" alt="" /> 

        <button className="p" >
        {/* <i class="fa-regular fa-pen-to-square" style="color: #ffffff;"></i> */}
        New Chat
        </button>

        <ul>
          <li>history1</li>
          <li>history2</li>
          <li>history3</li>
          <li>history4</li>
        </ul>

        <div>upgrade plan</div>
      </section>
    </>
  );
};

export default Sidebar;
