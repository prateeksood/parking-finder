import React, { useEffect, useContext } from "react";
import { TimelineMax } from "gsap";
import { Link } from "react-router-dom";
import landingPageImg from "../../resources/images/g2.png";
import styles from "./LandingPage.module.css";
import axios from 'axios'
import { userContext } from "../../contexts/userContext";
export default () => {
  const {user} = useContext(userContext);
  useEffect(()=>{
    if(user){
        axios.delete(`/api/cleanup/unpaid`,{headers:{'x-auth-token':localStorage.getItem("token")}})
        .then(console.log('Cleanup done'))
        .catch(err=>console.log(err.message));
        
        axios.put(`/api/cleanup/inactive`,{headers:{'x-auth-token':localStorage.getItem("token")}})
        .then(console.log('Inactive Orders marked'))
        .catch(err=>console.log(err));
    }
  },[user])
  useEffect(() => {
    const LoadTl = new TimelineMax();
    LoadTl.from("header", 0.5, {
      y: "-300"
    })
      .to(
        "#bubble",
        0.5,
        {
          scale: 2
        },
        "-=0.5"
      )
      .from("nav", 1, {
        autoAlpha: "0"
      })
      .from(
        "#left-sec",
        2,
        {
          height: ".1",
          autoAlpha: "0"
        },
        "-=0.5"
      )
      .from(
        "#main-img",
        1,
        {
          y: "800",
          autoAlpha: "0"
        },
        "-=1"
      );
  }, []);
  return (
    <div>
      <div className={styles.fixedNav}>
        <nav className={styles.fixedRightNav}>
          <ul className={styles.navItems}>
            <li className={styles.navButtons}>
              <Link to="/book">Find a space</Link>
            </li>
            <li className={styles.navButtons}>
              <Link to="/lend">Lend your space</Link>
            </li>
            <li className={`${styles.burgerMenu} ${styles.fixedBurgerMenu}`}>
              <div></div>
              <div></div>
              <div></div>
            </li>
          </ul>
        </nav>
      </div>
      <div className={styles.container}>
        <section className={styles.sectionOne}>
          <div className={styles.mainContent}>
            <div className={styles.leftSec} id="left-sec">
              <div className={styles.message}>
                Find a <span className={styles.highlight}>parking</span> space,
                without any hassle.
              </div>
              <div className={styles.buttons}>
                <Link to="/book">Find a space</Link>
                <Link to="/lend">Lend your space</Link>
              </div>
            </div>
            <div className={styles.rightSec}>
              <img
                src={landingPageImg}
                alt="car-img"
                id="main-img"
                className={styles.mainImg}
              />
            </div>
          </div>
        </section>
        
      </div>
      <div className={styles.bgStyle1} id="bubble"></div>
            <div className={styles.bgStyle2} id="bubble"></div>
            <div className={styles.bgStyle3} id="bubble"></div>
            <div className={styles.bgStyle4} id="bubble"></div>

    </div>
  );
};
