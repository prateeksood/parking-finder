import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
export const locationContext = createContext();
export default props => {
  const [currentLocation,setCurrentLocation] = useState([]);

  useEffect(() => {
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
    getLocation();
  }, []);
  return (
    <locationContext.Provider value={{ currentLocation,setCurrentLocation}}>
      {props.children}
    </locationContext.Provider>
  );
};
