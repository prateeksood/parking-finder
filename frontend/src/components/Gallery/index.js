import React,{useState} from 'react';
import styles from './Gallery.module.css';
import { TimelineMax } from "gsap";

export default(props)=>{
    let {parking}=props;

    const [index,setIndex]=useState(0);
    
    const changeImg=(index)=>{
        let displayImg=document.querySelector('#display-img');
        let thumbImgs= document.querySelectorAll('.thumbnail');
            
        thumbImgs.forEach((currentImg)=>{
            currentImg.style.filter="grayscale(100%)";
            currentImg.style.transform="scale(0.9)";
        })
        thumbImgs[index].style.filter="grayscale(0)";
        thumbImgs[index].style.transform="scale(1)";

        displayImg.children[0].setAttribute('src',thumbImgs[index].children[0].getAttribute('src'));
    }

    const thumbClick=(tempIndex)=>{
        let gallery=document.querySelector('#gallery');
        gallery.style.display="block";
        changeImg(tempIndex);
        setIndex(tempIndex);
    }
  
    const leftClick=()=>{
        let tempIndex=index;
        let thumbImgs= document.querySelectorAll('.thumbnail');
        if(tempIndex<=0){
            tempIndex=(thumbImgs.length-1);
        }else{
            tempIndex=index-1;
        }
        const Timeline = new TimelineMax();
        Timeline
        .from("#display-img", .1, {
            autoAlpha:0,
            x: 0
        })
        .to(
            "#display-img",
            0.1,
            {
                x:"-1000",
                autoAlpha:0
            }
        )
        .to(
            "#display-img",
            0.2,
            {
                x: 0,
                autoAlpha:1
            }
        )
        changeImg(tempIndex);
        setIndex(tempIndex);
    }

    const rightClick=()=>{
        let tempIndex=index;
        let thumbImgs= document.querySelectorAll('.thumbnail');
        if(index<(thumbImgs.length-1)){
            tempIndex=index+1;
        }else{
            tempIndex=0;
        }
        const Timeline = new TimelineMax();
        Timeline
        .from("#display-img", .1, {
            autoAlpha:0,
            x: 0
        })
        .to(
            "#display-img",
            0.1,
            {
                x:"1000",
                autoAlpha:0
            }
        )
        .to(
            "#display-img",
            0.2,
            {
                x: 0,
                autoAlpha:1
            }
        )
        changeImg(tempIndex);
        setIndex(tempIndex);
    }

    const crossClick=()=>{
        let gallery=document.querySelector('#gallery');
        gallery.style.display="none";
    }
    return(
        <React.Fragment>
        <div className={styles.imageGallery}>
            { parking.images&&(parking.images.map((img,index)=>(
                    <div key={index} className={styles.singleImg} onClick={()=>thumbClick(index)}><img src={`/api/images/${img.url}`} data-index="0" alt="parking img"/></div>
                )))
            }
        </div>
        <div className={styles.gallery} id="gallery">
            <div className={styles.imgContainer}>
                <div className={styles.displayImg} id="display-img"><img src="images/login-bg-2.jpg" alt="selected Parking"/></div>
                <div className={styles.thumbs}>

                    {
                        parking.images.map((img,index)=>(
                            <div key={index} className={`${styles.singleThumb} thumbnail`} onClick={()=>thumbClick(index)}><img src={`/api/images/${img.url}`}alt="parking"/></div>
                        ))
                    }
                </div>
            </div>
            <div className={styles.cross} onClick={crossClick}>X</div>
            <div className={`${styles.leftArrow} ${styles.arrow}`} onClick={leftClick}><i className="fas fa-chevron-left"></i></div>
            <div className={`${styles.rightArrow} ${styles.arrow}`} onClick={rightClick}><i className="fa-chevron-right fas"></i></div>
        </div>
        </React.Fragment>
        
    )
}