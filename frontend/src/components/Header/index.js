import React, { useContext,useState, useEffect} from "react";
import { NavLink,Link } from "react-router-dom";
import { userContext } from "../../contexts/userContext";
import {TimelineMax} from 'gsap'
import styles from "./Header.module.css";
import profilePicture from '../../resources/images/boy.png'
export default () => {
  const { user, setUser,setAlertMsg } = useContext(userContext);
  const [isMenuOpen,setIsMenuOpen]=useState(false);
  useEffect(()=>{
    window.addEventListener("resize", ()=>{
      let phnMenu=document.querySelector('#phoneMenu')
      phnMenu.classList.remove(styles.showPhoneMenu);
    });
  },[])
  const closePhnMenu=()=>{
    let phnMenu=document.querySelector('#phoneMenu')
    phnMenu.classList.remove(styles.showPhoneMenu);
  }
  const logout=()=>{
    setUser(null);
    localStorage.removeItem('token')
    setIsMenuOpen(false);
    setAlertMsg({heading:'Logged Out Successfully',lead:`Goodbye see you soon.`});
    closePhnMenu();
  }
  const showOptions=()=>{
    if(isMenuOpen){
        const LoadTl = new TimelineMax();
        LoadTl.to("#profileOptions",0.5,{
            autoAlpha: 0,
        })
        .to("#profileOptionsHolder", 0.5, {
            height: 0,
            autoAlpha: 0,
            display:'none',
            borderColor:'#DBDBDC'
          })
        setIsMenuOpen(false);
    }else{
        const LoadT2 = new TimelineMax();
        LoadT2
        .from("#profileOptionsHolder", 0.5, {
            height: 0,
            autoAlpha: 0,
            display:'none'
        })
        .to("#profileOptionsHolder", 0.5, {
            height: '172px',
            autoAlpha: 1,
            display:'block',
            borderColor:'#D11C21',
        },'-=.5')
        .to("#profileOptions",0.5,{
            autoAlpha: 1,
        })
        setIsMenuOpen(true);
    }      
  }
  return (
    <React.Fragment>
      <header>
        <div className={styles.logo}>
          <NavLink exact to="/">
            <span className={styles.highlight}>Parking</span>Finder
          </NavLink>
        </div>
        <nav className={styles.topRightNav}>
          <ul className={styles.navItems}>

            {!user? (

              <React.Fragment>
                <li className={styles.navButtons}>
                  <NavLink to="/login" activeStyle={{color: "#D11C21",border: "#D11C21 solid 2px"}}>Login</NavLink>
                </li>
                <li className={styles.navButtons}>
                  <NavLink to="/signup" activeStyle={{color: "#D11C21",border: "#D11C21 solid 2px"}}>Signup</NavLink>
                </li>
              </React.Fragment>

            ) : (
              
              <li className={styles.navButtons}>
                <div className={styles.profileDropdown}> 
                  <div onClick={showOptions} className={isMenuOpen? styles.toggleMenuOpen:styles.toggleMenuClose}><img src={profilePicture}/><div className={styles.title}>{user.fullname} </div> <span className={isMenuOpen?"fas fa-caret-up":"fas fa-caret-down"}></span></div>
                  <div className={styles.profileOptionsHolder} id="profileOptionsHolder">
                      <ul className={styles.profileOptions} id="profileOptions">
                          {/* <li>Profile</li> */}
                          <li><NavLink to={`/orders`} activeStyle={{color: "#D11C21" }}>{user.isAdmin?'All Orders':'My Orders'}</NavLink></li>
                          <li><NavLink to={`/parkings`} activeStyle={{color: "#D11C21" }}>{user.isAdmin?'All Parkings':'My Parkings'}</NavLink></li>
                          <li><NavLink to={`/recent-orders`} activeStyle={{color: "#D11C21" }}>Orders Recieved</NavLink></li>
                          <li onClick={logout}>Logout</li>
                      </ul>
                  </div>
                </div>
              </li>
            )}

            <li className={styles.burgerMenu} onClick={()=>{
              let phnMenu=document.querySelector('#phoneMenu')
              phnMenu.classList.toggle(styles.showPhoneMenu);
            }
            }>
              <div></div>
              <div></div>
              <div></div>
            </li>
          </ul>
        </nav>
      </header>
      <ul className={styles.phoneMenu} id="phoneMenu"> 
      {!user? 
        (
          <React.Fragment>
            <li>
              <NavLink to="/login" activeStyle={{color: "#D11C21"}}>Login</NavLink>
            </li>
            <li>
              <NavLink to="/signup" activeStyle={{color: "#D11C21" }}>Signup</NavLink>
            </li>
          </React.Fragment>

        ) : (
            <React.Fragment>
                {/* <li>Profile</li> */}
                <li onClick={closePhnMenu}><NavLink activeStyle={{color: "#D11C21" }} to={`/orders`}>{user.isAdmin?'All Orders':'My Orders'}</NavLink></li>
                <li onClick={closePhnMenu}><NavLink activeStyle={{color: "#D11C21" }} to={`/parkings`}>{user.isAdmin?'All Parkings':'My Parkings'}</NavLink></li>
                <li onClick={closePhnMenu}><NavLink to={`/recent-orders`} activeStyle={{color: "#D11C21" }}>Orders Recieved</NavLink></li>
                <li onClick={logout}>Logout</li>
            </React.Fragment>         
        )}
      </ul>
    </React.Fragment>
    
  );
};
