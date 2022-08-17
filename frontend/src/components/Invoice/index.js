import React, { useEffect, useState,useContext} from 'react';
import {Redirect, useHistory,useParams} from 'react-router-dom'
import styles from './Invoice.module.css';
import axios from 'axios'
import { userContext } from "../../contexts/userContext";
import Loader from '../Loader';

export default (props)=>{
    const [order,setOrder]=useState([]);
    const [recipient,setRecipient]=useState([]);
    const [parkings,setParkings]=useState([]);
    const { user,setAlertMsg,userLoaded} = useContext(userContext);
    const id=useParams().id;
    let history=useHistory();
    const monthName = ['January','February','March','April','May','June','July','August','September','October','November','December']
    useEffect(()=>{
        if(user){
                axios.get(`/api/order/find/all/by-order-id/${id}`)
                .then(foundOrder=>{
                    foundOrder=foundOrder.data.result.orders[0];
                    setOrder(foundOrder);
                    axios.get(`/api/parkings/find/all/by-parking-id/${foundOrder.parkingId}`)
                    .then(foundParking=>{
                        let parking=foundParking.data.result.parking;
                        setParkings(parking);
                    })
                    .catch(err=>console.log(err));
                    axios.get(`/api/auth/user/${foundOrder.tenantId}`)
                    .then(foundUser=>{
                        setRecipient(foundUser.data.result.user);
                    })
                    .catch(err=>console.log(err));
                })
                .catch(err=>console.log(err)); 
        }
    },[user]);
    
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
                    <div >Order Invoice</div>
                </div>
                <div className={styles.invoiceHolder}>
                        <div className={styles.invoiceHeader}>Invoice</div>
                        <div className={styles.companyName}><div><span>Parking</span>Finder</div></div>
                        <div className={styles.topDeatails}>
                            <div className={styles.orderDetail}><b>Order Id:</b> #{order.id}</div>
                            <div className={styles.orderDetail}><b>Name:</b> {recipient.fullname}</div>
                            <div className={styles.orderDetail}><b>Email:</b> {recipient.email}</div>
                            <div className={styles.orderDetail}><b>Contact Number:</b> {recipient.contactNumber}</div>
                            <div className={styles.orderDetail}>
                                <b>Date:</b> {`${new Date(order.date).getDate()} 
                                ${monthName[new Date(order.date).getMonth()]}, 
                                ${new Date(order.date).getFullYear()}`}
                            </div>
                            <div className={styles.orderDetail}>
                                <b>Time:</b> {`${new Date(order.date).getHours()}:
                                ${new Date(order.date).getMinutes()}`}
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Parking Name</th>
                                    <th>location</th>
                                    <th>Rate</th>
                                    <th>Spots</th>
                                    <th>Time</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{parkings.title}</td>
                                    <td>{parkings.city}</td>
                                    <td>&#8377;{parkings.cost}/h</td>
                                    <td>{order.bookingSpots}</td>
                                    <td>{order.bookingTime>24?`${order.bookingTime/24} days`:`${order.bookingTime} hours`}</td>
                                    <td>&#8377;{order.totalCost}</td>
                                </tr>
                            </tbody>
                        </table>
        <div className={styles.paymentMethod}><b>Payment:</b> {order.isPaid?'Paid':'Unpaid'}</div>
                        <hr/>
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