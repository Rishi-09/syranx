import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mycontext } from "./Mycontext";

export default function Dropdown() {
  const { user, setUser } = useContext(Mycontext);
  let [showDropDown, setShowDropDown] = useState(true);
  const navigate = useNavigate();
  const signup = async () => {
    try {
        navigate("/signup");
    } catch (err) {
      console.log(err);
    }
  };

  const login = async()=>{
    try{
      navigate("/login")
    }catch(err){
      console.log(err)
    }
  }
  
    
  const logout = ()=>{
    try{
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    }catch(err){
      console.log(err);
    }
  }
  return (
    <>
      <div
        className="absolute right-5 top-10 hover:bg-amber-50/20 rounded-xl p-0 "
        onClick={() => {
          setShowDropDown(showDropDown ? false : true);
        }}
      >
        <i className="fa-solid fa-circle-user p-0  text-2xl z-9999 m-2"></i>
      </div>
      {showDropDown && (
        <ul className="dropdown-items w-38 z-9999 absolute bg-amber-50/10 rounded-2xl m-4 right-0 top-20 mask-linear-to-stone-50 ">
          {user ? (
            <li className="p-2 hover:bg-amber-50/20" onClick={() => {logout()}}>
              LogOut
            </li>
          ) : (
            <div>
              <li
                className="p-2 hover:bg-amber-50/20" onClick={() => {signup();}}
              >
                Sign Up/ Sign In
              </li>
              <li className="p-2 hover:bg-amber-50/20" onClick={() =>{ login()}}>
                Login
              </li>
            </div>
          )}
          <li className="p-2 hover:bg-amber-50/20 ">setting-soon</li>
        </ul>
      )}
    </>
  );
}
