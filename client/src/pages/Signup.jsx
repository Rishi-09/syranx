import { useState } from "react";
import { useContext } from "react";
import { Mycontext } from "../components/Mycontext";
import { useNavigate } from "react-router-dom";

function Signup() {
  const { setUser } = useContext(Mycontext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);
      setUser(data);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="main absolute w-screen h-screen bg-neutral-900/90 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="grid bg-amber-50/20 p-10 rounded-2xl"
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
          <p className=" justify-self-center hover:underline " onClick={()=>navigate("/login")} >new user?, register instead</p>
        </form>
      </div>
    </>
  );
}

export default Signup;
