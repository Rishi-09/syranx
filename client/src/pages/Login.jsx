import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import api from "../api.js";
import { Mycontext } from "../components/Mycontext.jsx";
import "./Login.css";

function Login() {
  const [error, setError] = useState(false);
  const { setUser } = useContext(Mycontext);
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

      setUser(res.data.user);
      navigate("/");
    } catch {
      setError(true);
    }
  };

  return (
    <div className="login-wrapper">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
        className="login-card"
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className="close-btn"
        >
          ✕
        </button>

        <h2 className="login-title">Login</h2>

        {error && (
          <p className="error-text text-center">
            Invalid email or password
          </p>
        )}

        <input
          type="email"
          placeholder="email"
          className="login-input"
          onChange={(e) =>
            setformData({ ...formData, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="password"
          className="login-input"
          onChange={(e) =>
            setformData({ ...formData, password: e.target.value })
          }
        />

        <button className="login-btn">Login</button>

        <p
          onClick={() => navigate("/signup")}
          className="login-link"
        >
          new user? register instead
        </p>
      </form>
    </div>
  );
}

export default Login;
