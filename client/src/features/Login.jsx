"use client";

import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import Image from "next/image";
import api from "../api.js";
import { Mycontext } from "../components/Mycontext.jsx";
import { toast } from "react-toastify";
import AuthInput from "../components/ui/AuthInput.jsx";
import logo from "../assets/logo.png";

function Login() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(Mycontext);
  const router = useRouter();

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

      router.push("/");
    } catch {
      setError(true);
      toast.error("Invalid credentials!", { theme: "dark" });
    }

    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-canvas px-4">
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[110px]"
        aria-hidden="true"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
        className="glass-panel relative w-full max-w-sm rounded-2xl p-8 shadow-lg animate-rise-in"
      >
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-black">
            <Image src={logo} alt="" fill sizes="40px" className="object-contain p-1.5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ink">
              {loading ? "Logging in…" : "Welcome back"}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">Log in to continue to Syranx</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
            <i className="fa-solid fa-circle-exclamation" />
            Invalid email or password
          </div>
        )}

        <div className="flex flex-col gap-3">
          <AuthInput
            icon="fa-envelope"
            type="email"
            placeholder="Email"
            onChange={(e) => setformData({ ...formData, email: e.target.value })}
          />

          <AuthInput
            icon="fa-lock"
            type="password"
            placeholder="Password"
            onChange={(e) => setformData({ ...formData, password: e.target.value })}
          />
        </div>

        <button
          className="mt-5 w-full rounded-xl bg-linear-to-br from-accent-soft to-accent-strong py-2.5 text-sm font-semibold text-accent-ink shadow-accent transition-all duration-200 ease-out hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Please wait…" : "Log in"}
        </button>

        <p
          onClick={() => router.push("/signup")}
          className="mt-5 cursor-pointer text-center text-sm text-ink-muted transition-colors duration-150 hover:text-accent-soft"
        >
          New here? <span className="text-accent-soft">Create an account</span>
        </p>
      </form>
    </div>
  );
}

export default Login;
