import React, { useContext, useEffect, useState } from "react";
import {Redirect} from 'react-router-dom';
import useForm from "../../hooks/useForm";
import validate from "../validationRules/SignupFormValidation";
import styles from "./SignupForm.module.css";
import manImg from "../../resources/images/man.png";
import axios from "axios";
import { userContext } from "../../contexts/userContext";
export default () => {
  const {setUser,setAlertMsg,userLoaded } = useContext(userContext);
  const [signupError,setSignupError]=useState(null);
  const[signupSuccess,setSignupSuccess]=useState(false);
  useEffect(()=>{
    if(userLoaded){
      localStorage.removeItem('token');
      setUser(null);
    }
  },[userLoaded]);
  const signupHandler = () => {
    const data = {
      name: values.fullName,
      email: values.email,
      password: values.password,
      contactNumber: values.contactNumber
    };
    axios.post("/api/register", data).then(res => {
      if (!res.data.error) {
        localStorage.setItem("token", res.data.result.token);
        setUser(res.data.result.user);
        setSignupError(null);
        setAlertMsg({heading:'Signup Successful',lead:`Welcome ${res.data.result.user.fullname}`});
        setSignupSuccess(true);
      } else {
        localStorage.removeItem("token");
        setUser(null);
        setSignupError(res.data.error);
      }
    });
  };
  const { values, errors, handleChange, handleSubmit } = useForm(
    signupHandler,
    validate
  );
  if(signupSuccess){
    return <Redirect to='/' />
  }else{
  const hideAlertMsg=()=>{
    setSignupError(null);
  }
  return (
    <div className={styles.container}>
      <div className={styles.bgImg}></div>
      <section className={styles.formHolder}>
        <form onSubmit={handleSubmit}>
        {signupError&&<div className={styles.alertMsg}><span>{signupError}</span><i className="fas fa-times" onClick={hideAlertMsg}></i></div>}
          <div className={styles.inputholder}>
            <input
              type="text"
              className={`
              ${styles.inputBox} 
              ${errors.fullName && styles.validationError}`}
              name="fullName"
              id="full-name"
              placeholder="Full Name"
              value={values.fullName || ""}
              onChange={handleChange}
              autoFocus
            />
            {errors.fullName && (
              <div className={styles.errorMsg}>
                !<span>{errors.fullName}</span>
              </div>
            )}
          </div>
          <div className={styles.inputholder}>
            <input
              type="text"
              className={`
              ${styles.inputBox} 
              ${errors.contactNumber && styles.validationError}`}
              name="contactNumber"
              id="contact-number"
              placeholder="Contact Number"
              value={values.contactNumber || ""}
              onChange={handleChange}
            />
            {errors.contactNumber && (
              <div className={styles.errorMsg}>
                !<span>{errors.contactNumber}</span>
              </div>
            )}
          </div>

          <div className={styles.inputholder}>
            <input
              type="text"
              className={`${styles.inputBox} ${errors.email &&
                styles.validationError}`}
              name="email"
              id="email"
              placeholder="Email"
              value={values.email || ""}
              onChange={handleChange}
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

          <div className={styles.inputholder}>
            <input
              type="password"
              className={`${styles.inputBox} ${errors.confirmPassword &&
                styles.validationError}`}
              name="confirmPassword"
              id="confirm-password"
              placeholder="Confirm Password"
              value={values.confirmPassword || ""}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <div className={styles.errorMsg}>
                !<span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>

          <input type="submit" value="Sign Up" />
        </form>
        <div className={styles.topIcon}>
          <img src={manImg} alt="login-png" height="150vw" width="150vw" />
        </div>
      </section>
    </div>
  );
}
};
