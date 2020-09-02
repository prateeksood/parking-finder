import React, { useContext,useEffect, useState, Fragment } from "react";
import {Redirect, useHistory} from 'react-router-dom';
import axios from "axios";
import useForm from "../../hooks/useForm";
import validate from "../validationRules/LoginFormValidation";
import styles from "./LoginForm.module.css";
import boyImg from "../../resources/images/boy.png";
import { userContext } from "../../contexts/userContext";
export default (props) => {
  const {setUser,setAlertMsg,userLoaded } = useContext(userContext);
  const[loginError,setLoginError]=useState(null);
  const[loginSuccess,setLoginSuccess]=useState(false);
  useEffect(()=>{
    if(userLoaded){
      localStorage.removeItem('token');
      setUser(null);
    }
    
  },[userLoaded]);
  let history=useHistory();
  const loginHandler = () => {
    const data = {
      email: values.email,
      password: values.password
    };
    axios.post("http://localhost:2800/auth/login", data)
    .then(res => {
      if (!res.data.isError) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        setLoginError(null);
        setAlertMsg({heading:'Login Successful',lead:`Welcome back ${res.data.user.fullname}`});
        setLoginSuccess(true);
      } else {
        localStorage.removeItem("token");
        setUser(null);
        setLoginError(res.data.message);
      }
    })
    .catch(err=>console.log(err));
  };
  const { values, errors, handleChange, handleSubmit } = useForm(
    loginHandler,
    validate
  );
  if(loginSuccess){
     return(<Redirect to='/'/>)
  }else{  
    const hideAlertMsg=()=>{
      setLoginError(null);
    }
    return (
      <div className={styles.container}>
        <div className={styles.bgImg}></div>
        <section className={styles.formHolder}>
          <form autoComplete="off" onSubmit={handleSubmit}>
          {loginError&&<div className={styles.alertMsg}><span>{loginError}</span><i className="fas fa-times" onClick={hideAlertMsg}></i></div>}
            <div className={styles.inputholder}>
              <input
                type="text"
                className={`
                ${styles.inputBox} 
                ${errors.email && styles.validationError}`}
                name="email"
                id="email"
                placeholder="Email"
                value={values.email || ""}
                onChange={handleChange}
                autoFocus
              />
              {errors.email && (
                <div className={styles.errorMsg}>
                  !<span>{errors.email}</span>
                </div>
              )}
            </div>
            <div className={styles.inputholder}>
              <input
                type="password"
                className={`${styles.inputBox} ${errors.password &&
                  styles.validationError}`}
                name="password"
                id="password"
                placeholder="Password"
                value={values.password || ""}
                onChange={handleChange}
              />
              {errors.password && (
                <div className={styles.errorMsg}>
                  !<span>{errors.password}</span>
                </div>
              )}
            </div>
            <input type="submit" value="Login" />
          </form>
          <div className={styles.topIcon}>
            <img src={boyImg} alt="login-png" height="150vw" width="150vw" />
          </div>
        </section>
      </div>
    );
  }
};
