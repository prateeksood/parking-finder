import React, { useEffect, useState,useContext, Fragment } from 'react';
import {Link,Redirect, useHistory} from 'react-router-dom'
import styles from './Orders.module.css';
import placeholderImg from '../../resources/images/placeholder.png'
import axios from 'axios'
import { userContext } from "../../contexts/userContext";
import Loader from '../Loader';

export default (props)=>{
    const [orders,setOrders]=useState([]);
    const [parkings,setParkings]=useState([]);
    const[isLoading,setIsLoading]=useState(true);
    const { user,setAlertMsg,userLoaded} = useContext(userContext);
    useEffect(()=>{
        if(user){
            axios.delete(`http://localhost:2800/cleanup`,{headers:{'x-auth-token':localStorage.getItem("token")}})
            .then(console.log('Cleanup done'))
            .catch(err=>console.log(err));
        }
    },[user])
    useEffect(()=>{
        setIsLoading(true)
        if(user){
                let url;
                user.isAdmin?url=`http://localhost:2800/order`:url=`http://localhost:2800/order/findOrders?id=${user.id}`;
                axios.get(url)
                .then(foundOrder=>{
                    setOrders(prev=>[...prev,foundOrder.data]);
                    foundOrder.data.forEach(order => {
                        axios.get(`http://localhost:2800/parkings/${order.parkingId}`)
                        .then(foundParking=>{
                            let parking=foundParking.data;
                            parking={...parking,date:new Date(order.date),total:order.totalCost,bookingSpots:order.bookingSpots,bookingTime:order.bookingTime,orderId:order.id}
                            setParkings(prev=>[...prev,parking]);
                            
                        })
                        .catch(err=>console.log(err));
                    });
                })
                .catch(err=>console.log(err)); 
        }
    },[user]);
    let history=useHistory();
    // if(isLoading) {
    //     return (<Loader/>)
    // }
    if(userLoaded){
        if (!user) {
            setAlertMsg({heading:'Login Required',lead:`Kindly login to proceed.`});
            return <Redirect to='/login' />
        }
        return(
            
            <div className="container">
            <section className={styles.bookSectionOne}>
                <div className={styles.ordersHeading}>
                    <span onClick={()=>history.goBack()}><i className="fas fa-arrow-left"></i></span>
                    <div >{user.isAdmin?'All Orders':'Your Orders'}</div>
                </div>
                    <div className={styles.cardContainer}>
                    {parkings.length>0 ?(
                        parkings.map((parking,index)=>(
                            <Link key={index} to={`/invoice/${parking.orderId}`}>
                                <div className={styles.card}>
                                    <div className={styles.imgHolder}>
                                        <img src={parking.images[0]?(`http://localhost:2800/images/${parking.images[0].url}`):placeholderImg} alt="parking"/>
                                    </div>
                                    <div className={styles.title}>{`${parking.title.slice(0,12)}`}{parking.title.length>13&& ' . . .'}</div>
                                    <div className={styles.location}>
                                        {(new Date(Date.now()).getDate()-parking.date.getDate())>0?`${(new Date(Date.now()).getDate()-parking.date.getDate())} days ago at`:'Today at '}{` ${parking.date.getHours()}:${parking.date.getMinutes()}`}
                                         {(((Date.now() )-parking.date)/3600000)<parking.bookingTime?<span style={{color:'#34a341'}}> (Active)</span>:''}
                                    </div>
                                    <div className={styles.otherDetails}>
                                        <div>{parking.bookingTime>24?`${parking.bookingTime/24} days`:`${parking.bookingTime} hours`}</div>
                                        <div className={styles.seperation}></div>
                                        <div className={styles.travelTime}>{parking.bookingSpots===1?`${parking.bookingSpots} Spot`:`${parking.bookingSpots} Spots`}</div>
                                        <div className={styles.seperation}></div>
                                        <div className={styles.rating}>&#8377;{`${parking.total}`}</div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ):(
                        <div className={styles.notFoundMsgHolder}>
                            <div className={styles.notFoundMsg}>You haven't placed any orders yet</div><br/>
                            <span className={styles.goBackbtn} onClick={()=>history.goBack()}>Go back</span>
                        </div> 
                    )
                    }
                    </div>
            </section>
            
        </div>
        )
    }else{
        return(
            <div><Loader/></div>
        )
    }
    
    
}