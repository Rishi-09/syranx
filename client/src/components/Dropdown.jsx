import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { Mycontext } from "./Mycontext";
import { v1 as uuid } from "uuid";
import "./Dropdown.css";

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
  // const [theme, setTheme] = useState(
  //   localStorage.getItem("theme") || "dark"
  // );


  // useEffect(() => {
  //   document.documentElement.setAttribute("data-theme", theme);
  //   localStorage.setItem("theme", theme);
  // }, [theme]);

  // const toggleTheme = () =>
  //   setTheme((t) => (t === "dark" ? "light" : "dark"));

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
      <div className="relative select-none" ref={dropdownRef}>
        <div
          className="cursor-pointer p-2 rounded-full syranx-avatar-btn"
          onClick={() => {
            
            setShowDropDown(!showDropDown);
          }}
        >
          {user ? (
            <div className="avatar-circle-small">
              {user.userName?.charAt(0).toUpperCase()}
            </div>
          ) : (
            <i className="fa-solid fa-user text-2xl text-gray-200"></i>
          )}
        </div>

        {showDropDown && (
          <div className="syranx-dropdown-panel slide-dropdown">
            
            <div className="dropdown-arrow"></div>

            {user && (
              <div className="dropdown-user-header">
                <div className="avatar-circle">
                  {user.userName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="dropdown-username">{user.userName}</p>
                  <p className="dropdown-email">{user.email}</p>
                </div>
              </div>
            )}

            <ul className="dropdown-list">
              {!user ? (
                <>
                  <li
                    className="dropdown-item syranx-hover"
                    onClick={signup}
                  >
                    Sign Up
                  </li>
                  <li
                    className="dropdown-item syranx-hover"
                    onClick={login}
                  >
                    Login
                  </li>
                </>
              ) : (
                <li
                  className="dropdown-item syranx-hover"
                  onClick={() => setShowConfirmLogout(true)}
                >
                  Log Out
                </li>
              )}

              <hr className="dropdown-divider" />

              {/* <li
                className="dropdown-item syranx-hover"
                onClick={toggleTheme}
                onMouseEnter
              >
                Toggle Theme
              </li>

              <li
                className="dropdown-item syranx-hover"
                onMouseEnter
              >
                Help Center
              </li> */}
            </ul>
          </div>
        )}
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showConfirmLogout && (
        <div className="logout-overlay">
          <div className="logout-modal animate-fadeScale">
            <p className="logout-title">Log out of Syranx?</p>

            <div className="logout-buttons">
              <button
                className="modal-btn cancel-btn"
                onClick={() => setShowConfirmLogout(false)}
              >
                Cancel
              </button>
              <button className="modal-btn logout-btn" onClick={logout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
