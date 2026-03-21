import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { Mycontext } from "./Mycontext";
import { v1 as uuid } from "uuid";

export default function Dropdown() {
  const {
    user,
    setUser,
    setNewChat,
    setReply,
    setPrompt,
    setPrevChats,
    setCurrThreadId,
  } = useContext(Mycontext);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [showDropDown, setShowDropDown] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const signup = () => {
    navigate("/signup");
  };

  const login = () => {
    navigate("/login");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    setNewChat(true);
    setReply(null);
    setPrompt("");
    setPrevChats([]);
    setCurrThreadId(uuid());

    setShowConfirmLogout(false);
    navigate("/login");
  };

  useEffect(() => {
    const close = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropDown(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <>
      <style>{`
        .dropdown-arrow {
          position: absolute;
          top: -8px;
          right: 16px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 10px solid rgba(20,20,20,0.55);
          filter: drop-shadow(0 -2px 3px rgba(0,0,0,0.3));
        }
        .slide-dropdown {
          animation: slideDown 0.2s ease forwards;
        }
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-10px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .syranx-hover:hover {
          background: linear-gradient(135deg,rgba(248,196,113,0.22),rgba(243,156,18,0.22));
          padding-left: 26px;
          border-left: 3px solid rgba(248,196,113,0.85);
        }
        .animate-fadeScale {
          animation: fadeScale 0.3s ease forwards;
        }
        @keyframes fadeScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      <div className="relative select-none" ref={dropdownRef}>
        <div
          className="cursor-pointer p-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl transition-all duration-200 hover:scale-110 hover:bg-white/20"
          onClick={() => {
            setShowDropDown(!showDropDown);
          }}
        >
          {user ? (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f8c471] to-[#f39c12] flex justify-center items-center font-bold text-black text-sm">
              {user.userName?.charAt(0).toUpperCase()}
            </div>
          ) : (
            <i className="fa-solid fa-user text-2xl text-gray-200"></i>
          )}
        </div>

        {showDropDown && (
          <div className="slide-dropdown absolute right-0 mt-3.5 w-64 bg-black/55 backdrop-blur-2xl rounded-2xl pt-3.5 border border-white/12 shadow-2xl z-9999">
            <div className="dropdown-arrow"></div>

            {user && (
              <div className="flex items-center px-4.5 mb-2.5 gap-3.5 pb-3 border-b border-white/12">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f8c471] to-[#f39c12] flex justify-center items-center font-bold text-black">
                  {user.userName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{user.userName}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
            )}

            <ul className="divide-y divide-white/12">
              {!user ? (
                <>
                  <li
                    className="px-4.5 py-2.5 cursor-pointer rounded-md text-gray-200 transition-all syranx-hover"
                    onClick={signup}
                  >
                    Sign Up
                  </li>
                  <li
                    className="px-4.5 py-2.5 cursor-pointer rounded-md text-gray-200 transition-all syranx-hover"
                    onClick={login}
                  >
                    Login
                  </li>
                </>
              ) : (
                <li
                  className="px-4.5 py-2.5 cursor-pointer rounded-md text-gray-200 transition-all syranx-hover"
                  onClick={() => setShowConfirmLogout(true)}
                >
                  Log Out
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50000">
          <div className="animate-fadeScale bg-black/65 px-8 py-8 rounded-2xl w-80 border border-white/15 backdrop-blur-3xl text-center">
            <p className="text-white text-lg mb-5 font-semibold">Log out of Syranx?</p>

            <div className="flex justify-between gap-3">
              <button
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/15 text-gray-300 font-semibold cursor-pointer transition-all duration-200 hover:bg-white/20"
                onClick={() => setShowConfirmLogout(false)}
              >
                Cancel
              </button>
              <button 
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-br from-[#f8c471] to-[#f39c12] text-black font-semibold cursor-pointer transition-all duration-200 hover:shadow-lg"
                onClick={logout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
