import React,{useState, useEffect,useRef, useContext} from 'react'
import axios from 'axios'
import mapboxgl from 'mapbox-gl'
import {Link,useParams, Redirect,useLocation,useHistory} from 'react-router-dom'
import styles from './ParkingDetails.module.css';
import { userContext } from '../../contexts/userContext';
import Reviews from '../Reviews';
import Gallery from '../Gallery';
import Loader from '../Loader';
import { locationContext } from '../../contexts/locationContext';

export default(props)=>{
    const [parking,setParking]=useState(null);
    const [area,setArea]=useState('');
    const[isLoading,setIsLoading]=useState(true);
    const[destination,setDestination]=useState('');
    const[origin,setOrigin]=useState('');
    const[deleted,setDeleted]=useState(false);
    const { user,setAlertMsg,userLoaded} = useContext(userContext);
    const { currentLocation,setCurrentLocation} = useContext(locationContext);


    const id=useParams().id;
    let duration=NaN;
    if(useLocation().state){
        duration=useLocation().state.duration;
    }
    mapboxgl.accessToken="pk.eyJ1IjoicHJhdGVla3Nvb2QxMjMiLCJhIjoiY2s2MGttZTI2MDg5eTNscGtzYzhhaDhzMSJ9.79PJAfp5iIp7FVeHhT-YSQ";
    let mapContainer= useRef();
    let markerDiv = document.createElement('div');
    markerDiv.className = styles.marker;
    let marker= new mapboxgl.Marker(markerDiv);
    const directionBox=new window.MapboxDirections({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        unit: 'metric',
        profile: 'mapbox/driving',
        controls:{
            inputs:false,
            profileSwitcher:false}
    });
    useEffect(()=>{
        if(user){
            axios.delete(`http://localhost:2800/cleanup`,{headers:{'x-auth-token':localStorage.getItem("token")}})
            .then(console.log('Cleanup done'))
            .catch(err=>console.log(err));
        }
    },[user])
    useEffect(()=>{
        if(user&&parking){
            axios.get(`https://eu1.locationiq.com/v1/reverse.php?key=703dcce5586a29&lon=${parking.lon}&lat=${parking.lat}&format=json`)
            .then(res=>{
                let {address}=res.data;
                console.log(address);
                // address.neighbourhood||
                setArea(`${address.village||address.town||address.suburb||address.hamlet||address.locality||address.county||address.city}, ${address.state_district}`);
            })
            .catch(err=>console.log(err));
        }
    },[user,parking]);
    useEffect(()=>{
        if(userLoaded){
            axios.get(`http://localhost:2800/parkings/${id}`)
            .then(res=>{
                setParking(res.data);
                if(user){
                    axios.get(`http://localhost:2800/order/parking/active/${id}`)
                    .then(orders=>{
                        let count=0;
                        orders.data.forEach(order => {
                            count+=(order.bookingSpots); 
                        });
                        setParking(prev=>({...prev,activeOrders:count}));
                        setDestination([res.data.lon,res.data.lat]); 
                    }) 
                }
                setIsLoading(false);
            })
            .catch(err=>console.log(err));
        }
    },[id,userLoaded])
    useEffect(()=>{
        if(!isLoading&&user){
            const map = new mapboxgl.Map({
                container: mapContainer,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [parking.lon, parking.lat],
                zoom: 12
                });
                map.addControl(
                    new window.MapboxGeocoder({
                    accessToken: mapboxgl.accessToken,
                    mapboxgl:mapboxgl,
                    marker:false,
                    placeholder:'search origin point'
                    })
                    .on('result',(position)=>{
                        setOrigin(position.result.center)
                        
                    })
                    ,'top-right');
                map.addControl(new mapboxgl.FullscreenControl(),'bottom-right');
                map.addControl(new mapboxgl.NavigationControl(),'top-left');
                map.addControl(new mapboxgl.GeolocateControl({
                    positionOptions: {
                    enableHighAccuracy: true
                    }
                    })
                    .on('geolocate',(position)=>{
                        setOrigin([position.coords.longitude.toString(),position.coords.latitude.toString()])
                        map.flyTo({
                            center:[position.coords.longitude,position.coords.latitude],
                            zoom:14,
                            essential:true
                        })
                    })
                );
                directionBox.setDestination([parking.lon,parking.lat])
                map.addControl(directionBox);
                marker
                    .setLngLat([parking.lon, parking.lat])
                    .addTo(map);
        
                map.on('click', () => {
                    // map.on('move',()=>{
                        setTimeout(()=>{
                            if(directionBox.getDestination().geometry.coordinates!==destination){
                                directionBox.setDestination(destination);
                            }
                        },300)
                        
                    // }) 
                });
        }  
    },[parking,isLoading,destination,user])

    useEffect(()=>{
        directionBox.setOrigin(origin);
    },[origin])
    let history=useHistory();
    const getDirections=()=>{
        setOrigin([currentLocation[0],currentLocation[1]]);
    }
    const displayDuration=()=>{
       let returnValue= duration/3600>=1?`${(duration/3600).toFixed()} h`:''+((duration%3600)/60)>0?` ${((duration%3600)/60).toFixed()} min`:'';
        return returnValue;
    }
    const disableParking=()=>{
        let confirmed=window.confirm("Are you sure? Pressing Ok will parmanently delete this parking. ")
        if(confirmed){
            axios.put(`http://localhost:2800/parkings/disable/${id}`,{},{headers:{'x-auth-token':localStorage.getItem("token")}})
            .then(res=>res.status===200&&setDeleted(true))
        }
    }
  if(!isLoading&&userLoaded){
    if (!user) {
        setAlertMsg({heading:'Login Required',lead:`Kindly login to proceed.`});
        return <Redirect to='/login' />
    }
    if (deleted) {
        setAlertMsg({heading:'Successfully deleted',lead:`Your parking was successfullu deleted`});
        return <Redirect to='/book' />
    }
    return(
        <div className="container">
        <section className={styles.parkingSectionOne}>
            <div className={styles.topBtns}>
                <div className={styles.backArrow}>
                    <span onClick={()=>history.goBack()}><i className="fas fa-arrow-left"></i></span>
                </div>
                {parking.isActive?(
                    (parking.ownerId===user.id||user.isAdmin)?(
                        <div className={styles.deleteEditBtn}>
                            <button onClick={disableParking}><i className='fas fa-trash-alt'></i></button>
                            <Link
                                to={{
                                    pathname: `/updateParking`,
                                    state: { 
                                        parking:{
                                            id:parking.id,
                                            title:parking.title,
                                            totalSpots:parking.totalSpots,
                                            cost:parking.cost,
                                            lon:parking.lon,
                                            lat:parking.lat,
                                            city:parking.city,
                                        }
                                    }
                                }}
                            >
                            <i className='fas fa-pen'></i>
                            </Link>
                            
                            
                        </div>
                    ):''
                ):<div className={styles.deletedParkingMsg}><span>Deleted by the owner/admin</span></div>
                }
            </div>
                <div className={styles.mainContent}>
                    <div className={styles.map} id="map" ref={el=>mapContainer=el}></div>
                    <div className={styles.parkingDetailsContainer}>
                        <div className={styles.parkingDetails}>
                            <div className={styles.parkingTitle}>{parking.title}</div>
                            <div className={styles.location}>{area}</div>
                            <div className={styles.iconedFeatures}>
                                <div className={styles.driveDistance}><i className="fas fa-clock"></i><span>{isNaN(duration)?'__':displayDuration()}</span></div>
                                <div className={styles.totalSpots}><i className="fas fa-dice-six"></i><span>{parking.totalSpots} spots</span></div>
                                <div className={styles.price}><i className="fas fa-rupee-sign"></i><span>&#8377;{parking.cost}/hour</span></div>
                            </div>
                            {(parking.totalSpots-parking.activeOrders)>0?`${(parking.totalSpots-parking.activeOrders)} / ${parking.totalSpots} Spots Available`:``}
                            {(parking.isActive?<div className={styles.availability}>Active</div>:<div className={styles.availability} style={{color:'red'}}>Not Available</div>)}
                        </div>
                        {parking.isActive?(
                            <div className={styles.buttons}>
                                <a onClick={getDirections}>Get Directions</a>
                                {parking.ownerId===user.id?<span>You own this Parking</span>:((parking.totalSpots-parking.activeOrders)>0?<a href={`/checkout/${parking.id}`}>Book Now</a>:<span>All Spots Booked</span>)}
                            </div>
                        ):''}
                        
                    </div>
                </div>
                <Gallery parking={parking}/>
                <Reviews parking={parking}/>
            </section>
    </div>
    )
  }else{
      return(
          <Loader/>
      )
  }
    
}