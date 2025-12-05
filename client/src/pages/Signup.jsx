import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api.js'
import { useContext } from "react";
import { Mycontext } from "../components/Mycontext.jsx";

function Signup() {

  let {setUser} = useContext(Mycontext);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  

  const signup = async (e) => {
    e.preventDefault();
    try {
      let res = await api.post("/signup",formData);
      // console.log(res.data);
      setUser(res.data)
      alert("Signed In , please log in");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="main w-screen h-screen flex bg-neutral-900 justify-center items-center">
        <form
          onSubmit={signup}
          className="w-100 grid bg-amber-50/30 rounded-2xl p-10"
        >
          <div className="relative -right-5 -top-5 ">
            <button
              className="absolute right-0 top-0 hover:bg-neutral-900/40 pl-1 pr-1  rounded-4xl"
              onClick={() => navigate("/")}
            >
              X{" "}
            </button>
          </div>
          <h2 className="mt-0 m-auto">Sign Up</h2>
          <br />
          <input
            type="text"
            id="userName"
            placeholder="username"
            className=" border-zinc-300 rounded-lg  p-2 m-2 outline-1 "
            onChange={(e) =>
              setFormData({ ...formData, userName: e.target.value })
            }
          />
          <br />
          <input
            type="email"
            id="email"
            placeholder="abc@example.com"
            className=" border-zinc-300 rounded-lg  p-2 m-2 outline-1 "
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <br />
          <input
            type="password"
            id="password"
            placeholder="Password"
            className=" border-zinc-300 rounded-lg  p-2 m-2 outline-1 "
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <br />
          <button
            type="submit "
            className="bg-blue-500 pt-1 pb-1 w-30 justify-self-center rounded-lg mt-4 hover:bg-blue-600/50 "
          >
            Signup
          </button>
          <p className=" justify-self-center hover:underline " onClick={()=>navigate("/login")} >already a user ? Log in</p>
        </form>
      </div>
    </>
  );
}

export default Signup;
