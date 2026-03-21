import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import api from "../api.js";
import { Mycontext } from "../components/Mycontext.jsx";
import { toast } from "react-toastify";

function Login() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(Mycontext);
  const navigate = useNavigate();

  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const login = async () => {
    setLoading(true);
    setError(false);

    try {
      let res = await api.post("/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);

      toast.success("Logged in successfully!", { theme: "dark" });

      navigate("/");
    } catch {
      setError(true);
      toast.error("Invalid credentials!", { theme: "dark" });
    }

    setLoading(false);
  };

  return (
    <div className="w-screen h-screen bg-neutral-950 flex justify-center items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
        className="bg-white/8 backdrop-blur-2xl px-10 py-12 rounded-2xl w-96 relative border border-white/8 shadow-2xl"
      >
        <h2 className="text-center text-2xl my-6 text-white tracking-wider font-semibold">{loading ? "Logging in..." : "Login"}</h2>

        {error && (
          <p className="text-red-500 text-center underline mb-2.5 text-sm">
            Invalid email or password
          </p>
        )}

        <input
          type="email"
          placeholder="email"
          className="w-full px-3 py-2.5 my-1.5 bg-white/12 border border-white/25 rounded-2xl outline-none text-white placeholder-gray-400 text-sm transition-all focus:border-[#f8c471] focus:bg-white/16 focus:outline-none"
          onChange={(e) =>
            setformData({ ...formData, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="password"
          className="w-full px-3 py-2.5 my-1.5 bg-white/12 border border-white/25 rounded-2xl outline-none text-white placeholder-gray-400 text-sm transition-all focus:border-[#f8c471] focus:bg-white/16 focus:outline-none"
          onChange={(e) =>
            setformData({ ...formData, password: e.target.value })
          }
        />

        <button className="w-full px-4 py-3 mt-4 rounded-2xl bg-gradient-to-br from-[#f8c471] to-[#f39c12] text-neutral-950 font-bold text-base cursor-pointer transition-all hover:shadow-lg disabled:opacity-70" disabled={loading}>
          {loading ? "Please wait..." : "Login"}
        </button>

        <p onClick={() => navigate("/signup")} className="text-center mt-4 text-[#f39c12] cursor-pointer transition-all hover:underline">
          new user? register instead
        </p>
      </form>
    </div>
  );
}

export default Login;
