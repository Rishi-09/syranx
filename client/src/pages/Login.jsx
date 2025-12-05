import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import api from "../api.js";
import { Mycontext } from "../components/Mycontext.jsx";

function Login() {
  let { setUser } = useContext(Mycontext);
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const login = async () => {
    try {
      let res = await api.post("/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user)
      // console.log(res.data);
      alert("Logged in!");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="main w-screen h-screen flex bg-neutral-900 justify-center items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
          className="w-90 grid bg-amber-50/30 rounded-2xl p-10"
        >
           <div className="relative" >
            <button
              className="absolute -right-5 -top-5 hover:bg-neutral-900/40 pl-1 pr-1  rounded-4xl"
              onClick={() => navigate("/")}
            >
              X{" "}
            </button>
          </div>
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
          <p
            className="hover:underline justify-self-center "
            onClick={() => navigate("/signup")}
          >
            new user?, register instead
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;
