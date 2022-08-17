import React, { useEffect, useState,useContext } from 'react';
import {Link,Redirect,useHistory} from 'react-router-dom'
import styles from './MyParkings.module.css';
import placeholderImg from '../../resources/images/placeholder.png'
import axios from 'axios'
import { userContext } from "../../contexts/userContext";
import Loader from '../Loader';
import { locationContext } from '../../contexts/locationContext';

export default (props)=>{
    let count=0;
    const [parkings,setParkings]=useState([]);
    const [isLoading,setIsLoading]=useState(true);
    const { user,setAlertMsg,userLoaded} = useContext(userContext);
    const { currentLocation,setCurrentLocation} = useContext(locationContext);
    const [parkingDistances,setParkingDistances]=useState({});
    const [parkingDurations,setParkingDurations]=useState({});
    // const [currentLocation,setCurrentLocation]=useState([]);
    const [searchRadius,setSearchRadius]=useState(15000);
    const history=useHistory();
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
    useEffect(()=>{
        if(user){
            setIsLoading(true)
            let url;
            user.isAdmin?url=`/api/parkings`:url=`/api/parkings/find/all/by-owner-id/${user.id}`;
            axios.get(url)
            .then(res=>{
                setParkings(res.data.result.parkings)
                setIsLoading(false);
            })
            .catch(err=>console.log(err));
        }
    },[user]);
    useEffect(()=>{
        const calculateTime=(destination,index)=>{
          //  https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${currentLocation[0]},${currentLocation[1]};${destination[0]},${destination[1]}?sources=0&destinations=1&annotations=distance,duration&access_token=pk.eyJ1IjoicHJhdGVla3Nvb2QxMjMiLCJhIjoiY2s2MGttZTI2MDg5eTNscGtzYzhhaDhzMSJ9.79PJAfp5iIp7FVeHhT-YSQ
           return axios.get(`https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${currentLocation[0]},${currentLocation[1]};${destination[0]},${destination[1]}?roundtrip=false&source=first&destination=last&access_token=pk.eyJ1IjoicHJhdGVla3Nvb2QxMjMiLCJhIjoiY2s2MGttZTI2MDg5eTNscGtzYzhhaDhzMSJ9.79PJAfp5iIp7FVeHhT-YSQ`)
        }
        
        if(parkings.length>0&&currentLocation.length>0){
            setIsLoading(true)
            parkings.forEach((parking,index)=>{
                calculateTime([parking.lon,parking.lat],index)
                .then(res=> {
                    setParkingDurations(prev=>({...prev,[index]:(res.data.trips[0].distance)/7.77778}))//28km/h=7.77778m/s
                    setParkingDistances(prev=>({...prev,[index]:res.data.trips[0].distance}))
                    setIsLoading(false)
                })
                .catch(err=>{console.log(err);setIsLoading(false)})
            })
        }
    },[parkings,currentLocation])
    const increaseCount=()=>{
        count++;
    }
    const showAvgRating=(parking)=>{
        let rating=0;
        let length;
        let {reviews}=parking;
        for(let i=0;i<reviews.length;i++){
            rating+=reviews[i].rating;
        }
        if(reviews.length<=0){
            length=1;
            rating=NaN;
            return(rating);
        }else{
            length=reviews.length;
            rating/=length;
            rating=rating.toFixed(1);
            return(rating);
        }
        
    }

    if(userLoaded){
        if (!user) {
            setAlertMsg({heading:'Login Required',lead:`Kindly login to proceed.`});
            return <Redirect to='/login' />
        }
        else if(!isLoading){
            return(
                <div className="container">
                <section className={styles.bookSectionOne}>
                    <div className={styles.ordersHeading}>
                        <span onClick={()=>history.goBack()}><i className="fas fa-arrow-left"></i></span>
                        <div >{user.isAdmin?'All Parkings':'Your Parkings'}</div>
                    </div>
                        <div className={styles.cardContainer}>
                        {
                            (parkings.length>0)?
                            (
                                parkings.map((parking,index)=>(
                                    <React.Fragment key={index}>
                                        <Link
                                            to={{
                                              pathname: `/book/${parking.id}`,
                                              state: { duration: parkingDurations[index] }
                                            }}
                                        >
                                            {increaseCount()}
                                            <div className={styles.card}>
                                                <div className={styles.imgHolder}>
                                                    <img src={parking.images[0]?(`/api/images/${parking.images[0].url}`):placeholderImg} alt="parking"/>
                                                </div>
                                                <div className={styles.title}>{`${parking.title.slice(0,12)}`}{parking.title.length>13&& ' . . .'}</div>
                                                <div className={styles.location}>{parking.city}</div>
                                                <div className={styles.otherDetails}>
                                                    <div className={styles.rating}>{isNaN(showAvgRating(parking))?'__':showAvgRating(parking)}<i className="fas fa-star"></i></div>
                                                    <div className={styles.seperation}></div>
                                                    <div className={styles.active}>{parking.isActive?<span style={{color:'green'}}>Active</span>:<span style={{color:'red'}}>Inactive</span>}</div>
                                                    <div className={styles.seperation}></div>
                                                    <div className={styles.price}>&#8377;{parking.cost} per hour</div>
                                                </div>
                                            </div>
                                        </Link>
                                    </React.Fragment>  
                                ))
                            ):(
                                <div className={styles.notFoundMsg}>You currently don't own any Parkings.</div>
                            )
                        }
                        {count<=0&&<div className={styles.notFoundMsg}>You currently don't own any Parkings.</div>}
                        </div>
                </section>
                
            </div>
            )
        }else{
            return(
                <div><Loader message={'Getting your results ready'}/></div>
            )
        }
    }else{
        return(
            <div><Loader message={'Getting your location'}/></div>
        )
    }
    
    
}