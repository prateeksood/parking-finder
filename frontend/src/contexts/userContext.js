import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
export const userContext = createContext();
export default props => {
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [token,setToken] = useState(localStorage.getItem("token"));
  const [alertMsg,setAlertMsg] = useState(null);
  useEffect(()=>{
    if(userLoaded){
    }
  },[userLoaded])
  useEffect(() => {
    setUserLoaded(false)
    if (token) {
      let config = {
        headers: {
          "x-auth-token": token
        }
      };
      axios.get("/api/auth/user", config)
      .then(res => {
      setUser(res.data.result.user);
      setUserLoaded(true);
    })
      .catch(err=>console.log(err));
    }else{
      setUserLoaded(true);
    }
  }, [token]);
  useEffect(()=>{
  },[user])
  return (
    <userContext.Provider value={{ user, setUser,setToken,setAlertMsg,alertMsg,userLoaded}}>
      {props.children}
    </userContext.Provider>
  );
};
