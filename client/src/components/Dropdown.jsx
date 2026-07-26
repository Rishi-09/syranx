"use client";

import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Mycontext } from "./Mycontext";
import { v1 as uuid } from "uuid";
import Avatar from "./ui/Avatar";
import Modal from "./ui/Modal";

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

  const router = useRouter();
  const dropdownRef = useRef(null);

  const [showDropDown, setShowDropDown] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const signup = () => {
    setShowDropDown(false);
    router.push("/signup");
  };

  const login = () => {
    setShowDropDown(false);
    router.push("/login");
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
    router.push("/login");
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
    <>
      <div className="relative select-none" ref={dropdownRef}>
        <button
          type="button"
          className="glass-panel flex items-center justify-center rounded-full p-0.5 transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
          onClick={() => setShowDropDown(!showDropDown)}
        >
          {user ? (
            <Avatar kind="user" name={user.userName} size="md" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted">
              <i className="fa-solid fa-user text-base" />
            </span>
          )}
        </button>

        {showDropDown && (
          <div className="glass-panel absolute right-0 mt-2.5 w-64 overflow-hidden rounded-2xl p-1.5 shadow-lg animate-scale-in">
            {user && (
              <div className="flex items-center gap-3 border-b border-border-subtle px-3 py-3 mb-1">
                <Avatar kind="user" name={user.userName} size="lg" />
                <div className="overflow-hidden">
                  <p className="truncate text-sm font-semibold text-ink">{user.userName}</p>
                  <p className="truncate text-xs text-ink-muted">{user.email}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-0.5">
              {!user ? (
                <>
                  <button
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-ink transition-colors duration-150 hover:bg-white/[0.06]"
                    onClick={signup}
                  >
                    <i className="fa-regular fa-user w-4 text-ink-muted" />
                    Sign up
                  </button>
                  <button
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-ink transition-colors duration-150 hover:bg-white/[0.06]"
                    onClick={login}
                  >
                    <i className="fa-solid fa-arrow-right-to-bracket w-4 text-ink-muted" />
                    Log in
                  </button>
                </>
              ) : (
                <button
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-danger transition-colors duration-150 hover:bg-danger-soft"
                  onClick={() => {
                    setShowDropDown(false);
                    setShowConfirmLogout(true);
                  }}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket w-4" />
                  Log out
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <Modal open={showConfirmLogout} onClose={() => setShowConfirmLogout(false)}>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-danger-soft text-danger">
            <i className="fa-solid fa-arrow-right-from-bracket" />
          </div>
          <div>
            <p className="text-base font-semibold text-ink">Log out of Syranx?</p>
            <p className="mt-1 text-sm text-ink-muted">
              You can always sign back in to pick up where you left off.
            </p>
          </div>

          <div className="mt-2 flex w-full items-center gap-3">
            <button
              className="flex-1 rounded-xl border border-border bg-surface-3/60 py-2.5 text-sm font-medium text-ink transition-colors duration-150 hover:bg-surface-3"
              onClick={() => setShowConfirmLogout(false)}
            >
              Cancel
            </button>
            <button
              className="flex-1 rounded-xl bg-linear-to-br from-accent-soft to-accent-strong py-2.5 text-sm font-semibold text-accent-ink shadow-accent transition-all duration-150 hover:brightness-105"
              onClick={logout}
            >
              Log out
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
