"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "../api.js";
import { Mycontext } from "../components/Mycontext.jsx";
import { toast } from "react-toastify";
import AuthInput from "../components/ui/AuthInput.jsx";
import logo from "../assets/logo.png";

function Signup() {
  const { setUser } = useContext(Mycontext);
  const router = useRouter();

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
      router.push("/");
    } catch (err) {
      console.log(err);

      const message = err.response?.data?.error || "Something went wrong";

      toast.error(message, { theme: "dark" });
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
        className="glass-panel relative w-full max-w-sm rounded-2xl p-8 shadow-lg animate-rise-in"
        onSubmit={signup}
      >
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-black">
            <Image src={logo} alt="" fill sizes="40px" className="object-contain p-1.5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ink">
              {loading ? "Creating your account…" : "Create your account"}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">Start chatting with Syranx</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <AuthInput
            icon="fa-user"
            type="text"
            placeholder="Username"
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
          />

          <AuthInput
            icon="fa-envelope"
            type="email"
            placeholder="Email"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <AuthInput
            icon="fa-lock"
            type="password"
            placeholder="Password"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <button
          className="mt-5 w-full rounded-xl bg-linear-to-br from-accent-soft to-accent-strong py-2.5 text-sm font-semibold text-accent-ink shadow-accent transition-all duration-200 ease-out hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Please wait…" : "Sign up"}
        </button>

        <p
          className="mt-5 cursor-pointer text-center text-sm text-ink-muted transition-colors duration-150 hover:text-accent-soft"
          onClick={() => router.push("/login")}
        >
          Already a user? <span className="text-accent-soft">Log in instead</span>
        </p>
      </form>
    </div>
  );
}

export default Signup;
