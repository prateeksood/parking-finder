import React, { useState, useContext, useEffect } from "react";
import styles from "./LendForm.module.css";
import parkingsvg from "../../resources/images/parking.svg";
import axios from "axios";
import {Redirect,useLocation} from 'react-router-dom'
import StepOne from "./LendFormStep1";
import StepTwo from "./LendFormStep2";
import StepThree from "./LendFormStep3";
import StepFour from "./LendFormStep4";
import StepFive from "./LendFormStep5";
import useForm from "../../hooks/useForm";
import validate from "../validationRules/LendFormValidation";
import { userContext } from '../../contexts/userContext';
import Loader from "../Loader";
export default props => {
  const { user,setAlertMsg,userLoaded} = useContext(userContext);
  const [saveSuccess,setSaveSuccess]=useState(false);
  const[isLoading,setIsLoading]=useState(false);
  const [currentStep, setCurrentStep,uselocation] = useState(1);
  const [images, setImages] = useState([]);
  const [thumb, setThumb] = useState([]);
  const [location, setLocation] = useState({
    lat: 31.1242,
    lng: 77.1751,
    zoom: 15
  });
  let loc=useLocation();
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
    if(loc.pathname==='/updateParking'){
      let prevParking=loc.state.parking;
      setValues(prev=>({
        ...prev,
        parkingName:prevParking.title,
        id:prevParking.id,
        lng:prevParking.lon,
        lat:prevParking.lat,
        placeName:prevParking.city,
        totalSpots:prevParking.totalSpots,
        cost:prevParking.cost
      }));
      setLocation(prev=>({...prev,lat:prevParking.lat,lng:prevParking.lon}))
    }
  },[])
  const submitHandler = () => {
    setIsLoading(true);
    axios.get(`https://eu1.locationiq.com/v1/reverse.php?key=703dcce5586a29&lon=${location.lng}&lat=${location.lat}&format=json`)
    .then(res=>{
        let {address}=res.data;
        // address.neighbourhood||
        return (`${address.village||address.town||address.suburb||address.hamlet||address.locality||address.county||address.city}, ${address.state_district}`);
    })
    .then(placeName=>{
      let lng = location.lng;
      let lat = location.lat;
      const data ={
        title: values.parkingName,
        location: {lng, lat,placeName},
        totalSpots: values.totalSpots,
        cost: values.cost,
        images: images,
        owner: user.id
      };
      if(loc.pathname==='/updateParking'){
        axios.put(`/api/parkings/update/${values.id}`, data,{headers:{'x-auth-token':localStorage.getItem("token")}})
        .then(res => {
          if (res.status === 200) {
            setTimeout(()=>{
              setSaveSuccess(true);
              setIsLoading(false);
          },3000)
          }
        })
        .catch(err => {
          alert(`unknown error ${err}`);
        });
      }else{
        axios.post(`/api/parkings`, data,{headers:{'x-auth-token':localStorage.getItem("token")}})
        .then(res => {
          if (res.status === 200) {
            setTimeout(()=>{
              setSaveSuccess(true);
              setIsLoading(false);
          },3000)
          }
        })
        .catch(err => {
          alert(`unknown error ${err}`);
        });
      }
      
    })
    .catch(err=>console.log(err));
  };
  const { values, errors, handleChange, handleSubmit, markTouched,setValues } = useForm(
    submitHandler,
    validate
  );
  const onImgChange = e => {
    const formData = new FormData();
    for (const file of e.target.files) {
      formData.append("photos", file);
    }

    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    axios
      .post("/api/uploadImg", formData, config)
      .then(response => {
        setImages(response.data.location);
        alert("Images successfully uploaded");
      })
      .catch(err => {console.log(err)});
    let imgUrl = [];
    for (const file of e.target.files) {
      imgUrl.push(URL.createObjectURL(file));
    }
    setThumb(imgUrl);
  };

  const setPage = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            currentStep={currentStep}
            values={values}
            onChange={handleChange}
            errors={errors}
            markTouched={markTouched}
          ></StepOne>
        );
      case 2:
        return (
          <StepTwo
            currentStep={currentStep}
            values={values}
            onChange={handleChange}
            errors={errors}
            markTouched={markTouched}
          ></StepTwo>
        );
      case 3:
        return (
          <StepThree
            currentStep={currentStep}
            values={values}
            onChange={handleChange}
            errors={errors}
            markTouched={markTouched}
          ></StepThree>
        );
      case 4:
        return (
          <StepFour
            currentStep={currentStep}
            values={values}
            viewport={location}
            setViewport={setLocation}
            onChange={handleChange}
            errors={errors}
          ></StepFour>
        );
      case 5:
        return (
          <StepFive
            thumb={thumb}
            handleChange={onImgChange}
            currentStep={currentStep}
            errors={errors}
          ></StepFive>
        );
      default:
        return (
          <StepOne
            currentStep={currentStep}
            values={values}
            onChange={handleChange}
            errors={errors}
            markTouched={markTouched}
          ></StepOne>
        );
    }
  };
  const showButtons = () => {
    if (currentStep === 1) {
      return (
        <div className={styles.prevNextButtons}>
          <button
            className="fas fa-arrow-right"
            disabled={Object.keys(errors).length !== 0 ? true : false}
            onClick={nextStep}
          ></button>
        </div>
      );
    } else if ((currentStep === 5)||(loc.pathname==='/updateParking'&&currentStep === 4)) {
      return (
        <div className={styles.prevNextButtons}>
          <button
            className="fas fa-arrow-left"
            disabled={Object.keys(errors).length !== 0 ? true : false}
            onClick={prevStep}
          ></button>
          <button
            className="fas fa-check"
            disabled={Object.keys(errors).length !== 0 ? true : false}
          ></button>
        </div>
      );
    } else {
      return (
        <div className={styles.prevNextButtons}>
          <button
            className="fas fa-arrow-left"
            disabled={Object.keys(errors).length !== 0 ? true : false}
            onClick={prevStep}
          ></button>
          <button
            className="fas fa-arrow-right"
            disabled={Object.keys(errors).length !== 0 ? true : false}
            onClick={nextStep}
          ></button>
        </div>
      );
    }
  };
  const nextStep = e => {
    e.preventDefault();
    setCurrentStep(step => step + 1);
  };

  const prevStep = e => {
    e.preventDefault();
    setCurrentStep(step => step - 1);
  };
  if(userLoaded){
    if(saveSuccess&&loc.pathname==='/updateParking'){
      setAlertMsg({heading:'Updated Successfully',lead:`Your parking was successfully updated and saved.`});
      return <Redirect to={`/book`}/>
    }
    else if(saveSuccess&&loc.pathname!=='/updateParking'){
      setAlertMsg({heading:'Saved Successfully',lead:`Your parking was successfully saved.`});
      return <Redirect to={`/book`}/>
    }
    if (!user) {
      setAlertMsg({heading:'Login Required',lead:`Kindly login to proceed.`});
      return <Redirect to='/login' />
    }
    if(isLoading){
      return <div><Loader message={'Almost done'}/></div>
    }
    return (
      <React.Fragment>
        <div className={styles.stepFormContainer}>
          <div className={styles.card}>
            <div className={styles.title}>
              <h1>Fill this form</h1>
            </div>
            <div className={styles.steps}>
              <div className={styles.currentStep}>1</div>
              <div
                className={
                  currentStep === 2 ||
                  currentStep === 3 ||
                  currentStep === 4 ||
                  currentStep === 5
                    ? styles.currentStep
                    : undefined
                }
              >
                2
              </div>
              <div
                className={
                  currentStep === 3 || currentStep === 4 || currentStep === 5
                    ? styles.currentStep
                    : undefined
                }
              >
                3
              </div>
              <div
                className={
                  currentStep === 4 || currentStep === 5
                    ? styles.currentStep
                    : undefined
                }
              >
                4
              </div>
              <div className={currentStep === 5 ? styles.currentStep : undefined}>
                5
              </div>
            </div>
            <div className={styles.stepFormHolder}>
              <div className={styles.graphicHolder}>
                <img src={parkingsvg} alt="parking" />
              </div>
              <form encType="multipart/form-data" onSubmit={handleSubmit}>
                {setPage()}
                {showButtons()}
              </form>
            </div>
          </div>
        </div>
        <div id="step-form-bg"></div>
      </React.Fragment>
    );
  }else{
    return(
      <Loader/>
    )
  }
  
};
