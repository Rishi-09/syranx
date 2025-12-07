import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mycontext } from "./Mycontext";
import './Dropdown.css'

export default function Dropdown() {
  const { user, setUser } = useContext(Mycontext);
  const [showDropDown, setShowDropDown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const signup = () => navigate("/signup");
  const login = () => navigate("/login");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropDown(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative select-none" ref={dropdownRef}>
      <div
        className="cursor-pointer p-2 rounded-full hover:bg-white/10 transition"
        onClick={() => setShowDropDown(!showDropDown)}
      >
        <i className="fa-solid fa-user text-2xl text-gray-200"></i>
      </div>

      {showDropDown && (
        <div
          className="
            absolute right-0 mt-2 w-52 
            bg-neutral-800 text-gray-200 
            border border-white/10 rounded-xl 
            shadow-lg backdrop-blur-xl 
            animate-fadeScale z-9999
          "
        >
          <ul className="py-2 mask-linear-to-stone-50">

            {user ? (
              <>
                <li
                  className="px-4 py-2 hover:bg-white/10 cursor-pointer rounded-lg transition"
                  onClick={logout}
                >
                  Log Out
                </li>
              </>
            ) : (
              <>
                <li
                  className="px-4 py-2 hover:bg-white/10 cursor-pointer rounded-lg transition"
                  onClick={signup}
                >
                  Sign Up
                </li>

                <li
                  className="px-4 py-2 hover:bg-white/10 cursor-pointer rounded-lg transition"
                  onClick={login}
                >
                  Login
                </li>
              </>
            )}

            <li className="px-4 py-2 hover:bg-white/10 cursor-pointer rounded-lg transition">
              Soon...
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
