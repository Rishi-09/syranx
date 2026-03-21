import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { Mycontext } from "../components/Mycontext.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const { setUser } = useContext(Mycontext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const signup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/signup", formData);
      toast.success("Account created successfully!", { theme: "dark" });
      let loginRes = await api.post("/login", {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("user", JSON.stringify(loginRes.data.user));
      setUser(loginRes.data.user);
      toast.success("Welcome to Syranx ✨", { theme: "dark" });
      navigate("/");
    } catch (err) {
      console.log(err);

      const message = err.response?.data?.error || "Something went wrong";

      toast.error(message, { theme: "dark" });
    }

    setLoading(false);
  };

  return (
    <div className="w-screen h-screen bg-neutral-950 flex justify-center items-center">
      <form className="bg-white/8 backdrop-blur-2xl px-10 py-12 rounded-2xl w-96 relative border border-white/8 shadow-2xl" onSubmit={signup}>
        <h2 className="text-center text-2xl my-6 text-white tracking-wider font-semibold">
          {loading ? "Creating your account..." : "Create Account"}
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full px-3 py-2.5 my-1.5 bg-white/12 border border-white/25 rounded-2xl outline-none text-white placeholder-gray-400 text-sm transition-all focus:border-[#f8c471] focus:bg-white/16 focus:outline-none"
          onChange={(e) =>
            setFormData({ ...formData, userName: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2.5 my-1.5 bg-white/12 border border-white/25 rounded-2xl outline-none text-white placeholder-gray-400 text-sm transition-all focus:border-[#f8c471] focus:bg-white/16 focus:outline-none"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2.5 my-1.5 bg-white/12 border border-white/25 rounded-2xl outline-none text-white placeholder-gray-400 text-sm transition-all focus:border-[#f8c471] focus:bg-white/16 focus:outline-none"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <button className="w-full px-4 py-3 mt-4 rounded-2xl bg-gradient-to-br from-[#f8c471] to-[#f39c12] text-neutral-950 font-bold text-base cursor-pointer transition-all hover:shadow-lg disabled:opacity-70" disabled={loading}>
          {loading ? "Please wait..." : "Sign Up"}
        </button>

        <p className="text-center mt-4 text-[#f39c12] cursor-pointer transition-all hover:underline" onClick={() => navigate("/login")}>
          Already a user? Login instead
        </p>
      </form>
    </div>
  );
}

export default Signup;
