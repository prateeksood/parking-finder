import React, { useEffect, useState,useContext} from 'react';
import {Redirect, useHistory,useParams} from 'react-router-dom'
import styles from './RecentOrders.module.css';
import axios from 'axios'
import { userContext } from "../../contexts/userContext";
import Loader from '../Loader';

export default (props)=>{
    const [orders,setOrders]=useState([]);
    const [parkings,setParkings]=useState([]);
    const[isLoading,setIsLoading]=useState(true);
    const { user,setAlertMsg,userLoaded} = useContext(userContext);
    const monthName = ['January','February','March','April','May','June','July','August','September','October','November','December']
    
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
                axios.get(`http://localhost:2800/parkings/owner/${user.id}`)
                .then(allParkings=>{
                    allParkings.data.forEach(parking => {
                        user.isAdmin?url=`http://localhost:2800/order`:url=`http://localhost:2800/order/parking/${parking.id}`;
                        axios.get(url)
                        .then(foundOrder=>{
                            setOrders(prev=>[...prev,foundOrder.data]);
                            foundOrder.data.forEach(order => {
                                axios.get(`http://localhost:2800/parkings/${order.parkingId}`)
                                .then(foundParking=>{
                                    let parking=foundParking.data;
                                    axios.get(`http://localhost:2800/auth/user/${order.tenantId}`)
                                    .then(foundUser=>{
                                        parking={...parking,tenant:foundUser.data.user,date:new Date(order.date),total:order.totalCost,bookingSpots:order.bookingSpots,bookingTime:order.bookingTime,orderId:order.id}
                                        setParkings(prev=>[...prev,parking]);
                                    })
                                    .catch(err=>console.log(err));
                                    
                                })
                                .catch(err=>console.log(err));
                            });
                        })
                        .catch(err=>console.log(err)); 
                    });
                })
                .catch(err=>console.log(err))
                
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
                    <div >Recieved Orders</div>
                </div>
                {parkings.map((parking,index)=>(
                    <div key={index} className={styles.invoiceHolder}>
                        <div className={styles.companyName}><div><b>Order Id: #{parking.orderId}</b></div></div>
                        <div className={styles.topDeatails}>
                            <div className={styles.orderDetail}><b>Name:</b> {parking.tenant.fullname}</div>
                            <div className={styles.orderDetail}><b>Email:</b> {parking.tenant.email}</div>
                            <div className={styles.orderDetail}><b>Contact Number:</b> {parking.tenant.contactNumber}</div>
                            <div className={styles.orderDetail}>
                                <b>Date:</b> {`${new Date(parking.date).getDate()} 
                                ${monthName[new Date(parking.date).getMonth()]}, 
                                ${new Date(parking.date).getFullYear()}`}
                            </div>
                            <div className={styles.orderDetail}>
                                <b>Time:</b> {`${new Date(parking.date).getHours()}:
                                ${new Date(parking.date).getMinutes()}`}
                            </div>
                            <div>
                                {(((Date.now() )-parking.date)/3600000)<parking.bookingTime?<span style={{color:'#34a341'}}> (Active)</span>:''}
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
                                    <td>{parking.title}</td>
                                    <td>{parking.city}</td>
                                    <td>&#8377;{parking.cost}/h</td>
                                    <td>{parking.bookingSpots}</td>
                                    <td>{parking.bookingTime>24?`${parking.bookingTime/24} days`:`${parking.bookingTime} hours`}</td>
                                    <td>&#8377;{parking.total}</td>
                                </tr>
                            </tbody>
                        </table>
                        {/* <div className={styles.paymentMethod}><b>Payment:</b> {parking.isPaid?'Paid':'Unpaid'}</div> */}
                        <hr/>
                    </div>  
                ))}
                
            </section>
        </div>
        )
    }else{
        return(
            <div><Loader/></div>
        )
    }
    
    
}