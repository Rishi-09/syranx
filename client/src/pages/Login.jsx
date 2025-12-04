import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mycontext } from "../components/Mycontext";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(Mycontext);
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    let res = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    console.log(data);
    data ? setUser(data) : console.log("login failed");
    navigate("/");
  };

  return (
    <>
      <div className="main w-screen h-screen flex bg-neutral-900 justify-center items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="w-90 grid bg-amber-50/30 rounded-2xl p-10"
        >
          <h2 className="justify-self-center">Login</h2>
          <br />
          <input
            type="email"
            id="email"
            placeholder="email"
            className="outline-1 rounded-lg p-2 m-2"
            onChange={(e) =>
              setformData({ ...formData, email: e.target.value })
            }
          />
          <br />
          <input
            type="password"
            id="userName"
            placeholder="password"
            className="outline-1 rounded-lg p-2 m-2 "
            onChange={(e) =>
              setformData({ ...formData, password: e.target.value })
            }
          />
          <button className="bg-blue-500 pt-1 pb-1 w-30 justify-self-center rounded-lg mt-4 hover:bg-blue-600/50">
            {" "}
            Login
          </button>
          <p className="hover:underline justify-self-center " onClick={()=>navigate("/signup")} >new user?, register instead</p>
        </form>
        
      </div>
    </>
  );
}

export default Login;
