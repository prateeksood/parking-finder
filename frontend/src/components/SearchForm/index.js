import React, { useEffect, useState,useContext } from 'react';
import {Link,Redirect} from 'react-router-dom'
import styles from './SearchForm.module.css';
import placeholderImg from '../../resources/images/placeholder.png'
import axios from 'axios'
import { userContext } from "../../contexts/userContext";
import Loader from '../Loader';
import { locationContext } from '../../contexts/locationContext';

export default (props)=>{
    let count=0;
    const [parkings,setParkings]=useState([]);
    const [isLoading,setIsLoading]=useState(true);
    const [searchResults,setSearchResults]=useState([]);
    const { user,setAlertMsg,userLoaded} = useContext(userContext);
    const { currentLocation,setCurrentLocation} = useContext(locationContext);
    const [parkingDistances,setParkingDistances]=useState({});
    const [parkingDurations,setParkingDurations]=useState({});
    // const [currentLocation,setCurrentLocation]=useState([]);
    const [searchRadius,setSearchRadius]=useState(1000);
    useEffect(()=>{
        if(user){
            axios.delete(`http://localhost:2800/cleanup`,{headers:{'x-auth-token':localStorage.getItem("token")}})
            .then(console.log('Cleanup done'))
            .catch(err=>console.log(err));
        }
    },[user])
    useEffect(()=>{
        if(user){
            setIsLoading(true)
            axios.get('http://localhost:2800/parkings')
            .then(res=>{
                setParkings(res.data)
                setIsLoading(false);
            })
            .catch(err=>console.log(err));
        }
    },[user]);
    useEffect(()=>{
        const calculateTime=(destination,index)=>{
           return axios.get(`https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${currentLocation[0]},${currentLocation[1]};${destination[0]},${destination[1]}?roundtrip=false&source=first&destination=last&access_token=pk.eyJ1IjoicHJhdGVla3Nvb2QxMjMiLCJhIjoiY2s2MGttZTI2MDg5eTNscGtzYzhhaDhzMSJ9.79PJAfp5iIp7FVeHhT-YSQ`)
        }
        
        if(parkings.length>0&&currentLocation.length>0){
            setIsLoading(true)
            parkings.forEach((parking,index)=>{
                calculateTime([parking.lon,parking.lat],index)
                .then(res=> {
                    if(res.data.trips){
                        setParkingDurations(prev=>({...prev,[index]:(res.data.trips[0].distance)/7.77778}))//28km/h=7.77778m/s
                        setParkingDistances(prev=>({...prev,[index]:res.data.trips[0].distance}))
                    }
                    else{
                        setParkingDistances(prev=>({...prev,[index]:null}))
                    }
                    setIsLoading(false)
                })
                .catch(err=>{console.log(err);setIsLoading(false)})
            })
        }
    },[parkings,currentLocation])
    const increaseCount=()=>{
        count++;
    }
    const searchLocation=(e)=>{
        if(e.target.value!==''){
            axios.get(`https://api.locationiq.com/v1/autocomplete.php?key=703dcce5586a29&q=${e.target.value}&limit=5`)
            .then(res=>setSearchResults(res.data))
            .catch(err=>console.log(err));
        }else{
            setSearchResults([])
        }
        
    }
    // ===================================get automatic location====================================
    const getLocation=()=>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else { 
            alert("Geolocation is not supported by this browser.");
        }
    }
  
    const showPosition=(position)=> {
        axios.get(`https://eu1.locationiq.com/v1/reverse.php?key=703dcce5586a29&lon=${position.coords.longitude}&lat=${position.coords.latitude}&format=json`)
            .then(res=>{
                let {address}=res.data;
                let placeName=(`${address.neighbourhood||address.village||address.town||address.suburb||address.hamlet||address.locality||address.county||address.city}, ${address.state_district}`);
                setCurrentLocation([position.coords.longitude,position.coords.latitude,placeName]);
            })
            .catch(err=>{console.log(err)});
    }
    
    const showError=(error)=> {
        switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("You denied the request for Geolocation.")
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.")
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.")
            break;
        default:
            alert("An unknown error occurred.")
            break;
        }
    }
    // ====================================================================================
    const changeCurrentLocation=(lat,lon,name)=>{
        setCurrentLocation([lon,lat,name]);
        setSearchResults([]);
        setAlertMsg({heading:'Location Updated',lead:`Your Location is changed to ${name}`});
    }

    const changeSearchRadius=(radius)=>{
        setSearchRadius(radius);
        let filters=document.getElementById('searchFilters')
        for(let i=0;i<filters.children.length;i++){
            filters.children[i].style.borderBottom='none';
        }
        if(radius===500){
            filters.children[0].style.borderBottom='solid #D11C21';
        }else{
            filters.children[1].style.borderBottom='solid #D11C21';
        }
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
                        <div className={styles.searchBar}>
                            <span className={styles.searchIcon}><i className="fas fa-search"></i></span>
                            <input type="search" name="searchPlace" onChange={searchLocation} placeholder="Search your location" id="search-place"/>
                            <span className={styles.currentLocationIcon} onClick={getLocation} title="Get Current Location"><i className="fas fa-street-view"></i></span>
                        </div>
                        {
                            searchResults.length!==0&&
                            <div className={styles.searchSuggestionHolder}>
                                {searchResults.map((result,index)=>(
                                    <div className={styles.searchSuggestion} key={index} onClick={()=>changeCurrentLocation(result.lat,result.lon,result.display_place)}>{result.display_name}</div>
                                ))}
                            </div>
                        }
                        
                        <div className={styles.filters}>
                            <div className={styles.distance} id="searchFilters">
                                <div className={searchRadius===500? styles.selectedDistance:''} onClick={()=>changeSearchRadius(500)}>With in 500 m radius</div>
                                <div className={searchRadius===1000?styles.selectedDistance:''} onClick={()=>changeSearchRadius(1000)}>With in 1 km radius</div>
                            </div>
                            <div className={styles.sortContainer}>
                                <div className={styles.sort}>
                                    {currentLocation[2]?`${currentLocation[2]} `:(<span style={{color:'grey'}}>(Turn on location) </span>)}<i className="fas fa-map-marker-alt"></i>
                                </div>
                            </div>
                        </div>
                        <div className={styles.cardContainer}>
                        {
                            (parkings.length>0)?
                            (
                                parkings.map((parking,index)=>(
                                    <React.Fragment key={index}>
                                        {(((parkingDistances[index]<= searchRadius)&&parking.isActive)) ?(
                                            <Link
                                            to={{
                                              pathname: `/book/${parking.id}`,
                                              state: { duration: parkingDurations[index] }
                                            }}
                                          >
                                            {increaseCount()}
                                            <div className={styles.card}>
                                                <div className={styles.imgHolder}>
                                                    <img src={parking.images[0]?(`http://localhost:2800/images/${parking.images[0].url}`):placeholderImg} alt="parking"/>
                                                </div>
                                                <div className={styles.title}>{`${parking.title.slice(0,12)}`}{parking.title.length>=13&& ' . . .'}</div>
                                                <div className={styles.location}>{parking.city}</div>
                                                <div className={styles.otherDetails}>
                                                    <div className={styles.rating}>{isNaN(showAvgRating(parking))?'__':showAvgRating(parking)}<i className="fas fa-star"></i></div>
                                                    <div className={styles.seperation}></div>
                                                    <div className={styles.travelTime}>{parkingDurations[index]/3600>=1?`${(parkingDurations[index]/3600).toFixed()} h`:''}{((parkingDurations[index]%3600)/60)>0?` ${((parkingDurations[index]%3600)/60).toFixed()} min`:'0min'}</div>
                                                    <div className={styles.seperation}></div>
                                                    <div className={styles.price}>&#8377;{parking.cost} per hour</div>
                                                </div>
                                            </div>
                                            
                                            
                                        </Link>
                                        ):''}
                                    </React.Fragment>  
                                ))
                            ):(
                                <div className={styles.notFoundMsg}>No parkings Found.</div>
                            )
                        }
                        {count<=0?<div className={styles.notFoundMsg}>No parkings Found in selected area.</div>:''}
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