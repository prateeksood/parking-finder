import React, { useEffect,useContext} from "react";
import { TimelineMax } from "gsap";
import styles from './alertBox.module.css'
import { userContext } from "../../contexts/userContext";
export default (props) => {
  const {alertMsg,setAlertMsg } = useContext(userContext);
  useEffect(() => {
    const LoadTl = new TimelineMax();
    LoadTl
    .from("#customAlert", 1, {
      x: "600"
    })
    
    let timer=setTimeout(()=>{
      LoadTl
      .to("#customAlert", 1, {
        x: "600"
      },)
      .eventCallback("onComplete", setAlertMsg,[null]);
    },6000);
    return () => clearTimeout(timer);
  }, [alertMsg]);
  return (
    <div className={styles.customAlert} id="customAlert">
      <h1>{props.heading}</h1>
        <p>{props.lead}</p>
    </div>
  );
};
