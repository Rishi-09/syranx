import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { Mycontext } from "../components/Mycontext.jsx";
import "./Signup.css";

function Signup() {
  const { setUser } = useContext(Mycontext);
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const signup = async (e) => {
    e.preventDefault();
    try {
      let res = await api.post("/signup", formData);
      setUser(res.data);

      navigate("/login"); // go to login after signup
    } catch (err) {
      console.log(err);
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div className="signup-wrapper">
      <form className="signup-card" onSubmit={signup}>
        
        <button
          type="button"
          className="close-btn"
          onClick={() => navigate("/")}
        >
          ✕
        </button>

        <h2 className="signup-title">Create Account</h2>

        {error && <p className="signup-error">{error}</p>}

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

        <button className="signup-btn">Sign Up</button>

        <p className="signup-link" onClick={() => navigate("/login")}>
          Already a user? Login instead
        </p>
      </form>
    </div>
  );
}

export default Signup;
