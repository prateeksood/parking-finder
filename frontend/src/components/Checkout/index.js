import React, { useState, useContext,useEffect } from 'react';
import {useParams, Redirect, Link,useHistory} from 'react-router-dom'
import axios from 'axios'
import placeholderImg from '../../resources/images/placeholder.png'
import styles from './Checkout.module.css'
import { userContext } from '../../contexts/userContext';
import Loader from '../Loader';
export default(props)=>{
    const id=useParams().id;
    const[isLoading,setIsLoading]=useState(true);
    const [parking,setParking]=useState(null);
    const [area,setArea]=useState('');
    const { user,setAlertMsg,userLoaded} = useContext(userContext);
    const [bookingSpots,setBookingSpots]=useState(1);
    const [bookingTime,setBookingTime]=useState(6);
    const [orderSuccess,setOrderSuccess]=useState(false);


    useEffect(()=>{
        if(user){
            axios.delete(`http://localhost:2800/cleanup`,{headers:{'x-auth-token':localStorage.getItem("token")}})
            .then(console.log('Cleanup done'))
            .catch(err=>console.log(err));
        }
    },[user])

    useEffect(()=>{
        if(userLoaded){
            axios.get(`http://localhost:2800/parkings/${id}`)
            .then(res=>{
                if(user){
                setParking(res.data);
                axios.get(`http://localhost:2800/order/parking/active/${id}`)
                .then(orders=>{
                    let count=0;
                    orders.data.forEach(order => {
                        count+=(order.bookingSpots); 
                    });
                    setParking(prev=>({...prev,activeOrders:count}));
                })
                }
                setIsLoading(false);
            })
            .catch(err=>console.log(err));
        }
    },[id,userLoaded]);
    useEffect(()=>{
        if(user&&parking){
            axios.get(`https://eu1.locationiq.com/v1/reverse.php?key=703dcce5586a29&lon=${parking.lon}&lat=${parking.lat}&format=json`)
            .then(res=>{
                let {address}=res.data;
                setArea(`${address.neighbourhood||address.village||address.town||address.suburb||address.hamlet||address.locality||address.city}, ${address.state_district}`);
            })
            .catch(err=>console.log(err));
        }
    },[user,parking]);
    let history=useHistory();
    const updateSpots=(e)=>{
        e.persist();
        setBookingSpots(e.target.value);
    }
    const updateTime=(e)=>{
        e.persist();
        setBookingTime(e.target.value);
    }
    const placeOrder=()=>{
        // setIsLoading(true)
        const data={
            tenant:user.id,
            parking:parking.id,
            bookingTime,
            bookingSpots,
            total:bookingTime*bookingSpots*parking.cost
        }
        if(data.total>500000){
            alert('Your order total cannot exceed 5,00,000')
        }else{
            axios.post(`http://localhost:2800/order`,data,{headers:{'x-auth-token':localStorage.getItem("token")}})
            .then(res=>{
                let options = {
                    "key_id": "rzp_test_Je0UKuTNU3Tl5d",
                    "key_secret": 'm6pQy50jytgyl2WwPFls1myo',
                    "amount": data.total*100,
                    "currency": "INR",
                    "name": `${parking.title}`,
                    "description": `${parking.city}`,
                    "image": parking.images[0]?`http://localhost:2800/images/${parking.images[0].url}`:'',
                    "order_id": res.data.id,
                    "handler": function (response){
                        let body=document.querySelector('body');
                        body.style={overflow:'scroll'};
                        axios.put(`http://localhost:2800/order`,
                            {...data,ownerId:parking.ownerId,parking,orderId:response.razorpay_order_id,paymentId:response.razorpay_payment_id},
                            {headers:{'x-auth-token':localStorage.getItem("token")}}
                        )
                        .then(res=>{
                            setIsLoading(true);
                            setTimeout(()=>{
                                setIsLoading(false);
                                setOrderSuccess(true);
                            },1000)
                        })
                        .catch(err=>console.log(err))
                    },
                    "prefill": {
                        "name": `${user.fullname}`,
                        "email": `${user.email}`,
                        "contact": `${user.contactNumber}`
                    },
                    "notes": {
                        "address": "note value"
                    },
                    "theme": {
                        "color": "#d11c21"
                    },
                    "modal": {
                        "ondismiss": function(){
                            let body=document.querySelector('body');
                            body.style={overflow:'scroll'};
                        }
                    }
                };
                let rzp1 = new window.Razorpay(options).open();
                rzp1.open();
            })
            .catch(err=>console.log(err))
        }
        
    }
    const spotsDropdown=()=>{
        let options=[];
        for(let i=1;i<=(parking.totalSpots-parking.activeOrders);i++){
           options.push(<option key={i} value={i}>{i} spots</option>)
        }
        return(options)
    }
    if(!isLoading&&userLoaded){
        if (!user) {
            setAlertMsg({heading:'Login Required',lead:`Kindly login to proceed.`});
            return <Redirect to='/login' />
        }
        if(orderSuccess){
            setAlertMsg({heading:'Order Success',lead:`Your order was successfully placed.`})
            return <Redirect to='/orders'/>
        }
        return(
            <section className={styles.container}>
                <div className={styles.heading}>
                    <span onClick={()=>history.goBack()}><i className="fas fa-arrow-left"></i></span>
                    <div >Order Summary</div>
                </div>
            <div className={styles.mainSection}>
                <div className={styles.leftSection}>
                    <img src={parking.images[0]?`http://localhost:2800/images/${parking.images[0].url}`:placeholderImg} width="100px" height="100px"alt="parking"/>
                    <div className={styles.detailsContainer}>
                        <div className={styles.parkingTitle}>{parking.title}</div>
                        <div className={styles.parkingLocation}>{area}</div>
                    </div>
                </div>
                <div className={styles.rightSection}>
                    <table>
                        <thead>
                            <tr>
                                <th>Price</th>
                                <th>Time</th>
                                <th>Spots</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>&#8377;{` ${parking.cost}/hr`}</th>
                                <th>
                                    <select onChange={updateTime} value={bookingTime}>
                                        <option value="1">1 hours</option>
                                        <option value="2">2 hours</option>
                                        <option value="3">3 hours</option>
                                        <option value="4">4 hours</option>
                                        <option value="5">5 hours</option>
                                        <option value="6">6 hours</option>
                                        <option value="12">12 hours</option>
                                        <option value="24">1 day</option>
                                        <option value="48">2 day</option>
                                        <option value="72">3 day</option>
                                        <option value="96">4 day</option>
                                        <option value="120">5 day</option>
                                        <option value="144">6 day</option>
                                        <option value="168">1 week</option>
                                        <option value="336">2 week</option>
                                        <option value="504">3 week</option>
                                        <option value="720">1 month</option>
                                    </select>
                                </th>
                                <th>
                                    <select onChange={updateSpots} value={bookingSpots}>
                                    {
                                    (parking.totalSpots-parking.activeOrders)<=0?
                                            <option value='0'>All Spots Booked!</option>
                                        :
                                        spotsDropdown()
                                    }
                                    </select>
                                </th>
                                <th>&#8377; {bookingSpots*bookingTime*parking.cost}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={styles.proceedBtnHolder}>
                <button onClick={placeOrder} disabled={(parking.totalSpots-parking.activeOrders)<=0}>Proceed</button>
                <div id="payment-div"></div>
            </div>
        </section>
        )}else{
            return(
                <div><Loader message={'Preparing your order'}/></div>
            )
        }
    
}
