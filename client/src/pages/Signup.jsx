import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { Mycontext } from "../components/Mycontext.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";

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
      toast.error("Signup failed. Try again.", { theme: "dark" });
    }

    setLoading(false);
  };

  return (
    <div className="signup-wrapper">
      <form className="signup-card" onSubmit={signup}>
        <h2 className="signup-title">
          {loading ? "Creating your account..." : "Create Account"}
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="signup-input"
          onChange={(e) =>
            setFormData({ ...formData, userName: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="signup-input"
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="signup-input"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <button className="signup-btn" disabled={loading}>
          {loading ? "Please wait..." : "Sign Up"}
        </button>

        <p className="signup-link" onClick={() => navigate("/login")}>
          Already a user? Login instead
        </p>
      </form>
    </div>
  );
}

export default Signup;
