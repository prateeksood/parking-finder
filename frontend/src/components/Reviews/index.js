import React, { useState, useContext } from 'react';
import axios from 'axios'
import styles from './Reviews.module.css';
import useForm from '../../hooks/useForm';
import validate from "../validationRules/reviewFormValidation";
import { userContext } from '../../contexts/userContext';

export default(props)=>{
    const [ratingError,setRatingError]=useState(null);
    const { user,setAlertMsg} = useContext(userContext);
    let {parking}=props;
    const [rating, setRating]=useState(0);
    const [reviews,setReviews]=useState(parking.reviews)
    const reviewHandler = () => {
        if(parking.ownerId!==user.id){
            if(rating!==0){
                setRatingError(null);
                let {reviewHead,reviewBody}=values;
                const data = {review:{reviewHead,reviewBody,rating,authorId:user.id,authorName:user.fullname}};
                axios.post(`http://localhost:2800/review/${parking.id}`, data,{headers:{'x-auth-token':localStorage.getItem("token")}})
                .then(res => {
                  if (!res.data.isError) {
                    setReviews(prev=>[...prev,res.data.review]);
                    setAlertMsg({heading:'Review added',lead:`Your review was successfully added`});
                    setRating(0);
                    clearValues();
                  } else {
                  }
                })
                .catch(err=>console.log(err));
            }else{
                setRatingError('Rating is required !')
            }
        }else{
            setRatingError('You cannot post a review On your own Parking!')
        }
        
      };
    const { values, errors, handleChange, handleSubmit,clearValues } = useForm(
        reviewHandler,
        validate
      );
    const starClick=(index)=>{
        setRatingError(null);
        let starHolder=document.getElementById('inputStars');
        for(let i=0;i<5;i++){
            starHolder.children[i].style.color='#5c5a58';
        }
        for(let i=0;i<=index;i++){
            starHolder.children[i].style.color='#FFA500';
        }
        setRating(index+1);
    }
    const ratingInput=()=>{
        let stars=[];
        for(let i=0;i<rating;i++){
            stars.push(<i key={i} className="fas fa-star" style={{color:'#FFA500'}} onClick={()=>{starClick(i)}}></i>);
        }
        for(let i=rating;i<5;i++){
            stars.push(<i key={i} className="fas fa-star" style={{color:'#5c5a58'}} onClick={()=>{starClick(i)}}></i>);
        }
        return(stars)
    }
    const showSingleRating=(rating)=>{
        let stars=[];
        for(let i=0;i<rating;i++){
            stars.push(<i key={i} className="fas fa-star" style={{color:'#D11C21'}}></i>);
        }
        for(let i=rating;i<5;i++){
            stars.push(<i key={i} className="fas fa-star" style={{color:'grey'}}></i>);
        }
        return(stars)
    }
    const showAvgRating=()=>{
        let stars=[];
        let rating=0;
        let length;
        for(let i=0;i<reviews.length;i++){
            rating+=reviews[i].rating;
        }
        if(reviews.length<=0){
            length=1;
        }else{
            length=reviews.length;
        }
            
        rating/=length;
        rating=Math.round(rating);
        for(let i=0;i<rating;i++){
            stars.push(<i key={i} className="fas fa-star" style={{color:'#FFA500'}}></i>);
        }
        for(let i=rating;i<5;i++){
            stars.push(<i key={i} className="fas fa-star" style={{color:'grey'}}></i>);
        }
        return(stars)
    }
    const deleteReview=(id,index)=>{
        let confirmed=window.confirm("Are you sure? Pressing Ok will parmanently delete your review. ")
        if(confirmed){
            axios.delete(`http://localhost:2800/review/${id}`,{headers:{'x-auth-token':localStorage.getItem("token")}})
            .then(reviews.splice(index,1))
        }
    }
    return(
        <div className={styles.reviewContainer}>
            <div className={styles.avgRating}>
                <div className={styles.avgStars}>
                    {showAvgRating()}
                </div>
                <div className={styles.reviewerCount}>({reviews.length})</div>
            </div>
            {parking.isActive?(
                <div className={styles.leaveAReview}>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="reviewHead" placeholder="Review Title" value={values.reviewHead || ""} onChange={handleChange}/>
                        {errors.reviewHead&&<div className={styles.errorMsg}>{errors.reviewHead}</div>}
                        <textarea name="reviewBody" placeholder="Your Review" value={values.reviewBody || ""} onChange={handleChange}></textarea>
                        {errors.reviewBody&&<div className={styles.errorMsg}>{errors.reviewBody}</div>}
                        <div className={styles.inputStars} id="inputStars">
                            {ratingInput()}
                        </div>
                        {ratingError&&<div className={styles.errorMsg}>{ratingError}</div>}
                        <div className={styles.submitReviewButton}>
                            <button disabled={!parking.isActive}>Submit</button>
                        </div>
                    </form>
                </div>
            ):''}
            <div className={styles.reviews}>
                {reviews.map((review,index)=>(
                
                <div key={index} className={styles.reviewSingle}>
                    <div className={styles.reviewHead}>
                        <div className={styles.title}>{review.reviewHead}</div>
                        <div className={styles.stars}>
                            {showSingleRating(review.rating)}
                        </div>
                    </div>
                <div className={styles.reviewContent}>{review.reviewBody}</div>
                   <div className={styles.bottomBar}>
                       <div className={styles.reviewerName}>{review.authorName||"PS"}</div>
                       {(review.authorId===user.id||user.isAdmin)?(
                        <div className={styles.reviewEditDelBtn}>
                           <button onClick={()=>deleteReview(review.id,index)}>{console.log(reviews)}<i className='fas fa-trash-alt'></i></button>
                        </div>
                       ):''}
                    </div>
                </div>

                ))}
            </div>
        </div>
    )
    
}