import React,{useEffect} from 'react'
import {TimelineMax}from 'gsap'
import styles from './LendFormInput.module.css'
export default (props)=>{
    useEffect(()=>{
        const LoadTl=new TimelineMax();
        LoadTl
        .from('#input-box',0.5,{
            autoAlpha:0,
            y:-50
        })
    },[])
    if(props.currentStep!==5)
    {
        return (null);
    }
    return(
        <React.Fragment>
            <label  id="input-box" className={styles.addImgBtn} htmlFor="img-upload">Choose multiple images by holding alt
                <input type="file" className={styles.input} name="photos" id="img-upload" accept="image/*" multiple="multiple" placeholder="images" onChange={props.handleChange} />
            </label>
            <div className={styles.addImg}>
                {props.thumb.map((img,i)=>(
                    <img key={i} className={styles.thumb} src={img} alt="uploaded parking"/>
                ))}
            </div>
        </React.Fragment>
    )
}