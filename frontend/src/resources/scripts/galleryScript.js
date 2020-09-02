// document.addEventListener('DOMContentLoaded',()=>{
//     let gallery=document.querySelector('.gallery');
//     let displayImg=document.querySelector('.display-img');
//     let galleryImgs= document.querySelectorAll('.single-img');
//     let thumbImgs= document.querySelectorAll('.single-thumb');
//     let cross= document.querySelector('.cross');
//     let leftArrow= document.querySelector('.left-arrow');
//     let rightArrow= document.querySelector('.right-arrow');
//     let index=0;

//     galleryImgs.forEach(img=>{
//         img.addEventListener('click',()=>{
//             gallery.style.display="block";
//             index=img.children[0].getAttribute('data-index');
//             changeImg(index);
//          });
//     })
//     thumbImgs.forEach(img=>{
//         img.addEventListener('click',()=>{
//             index=img.children[0].getAttribute('data-index');
//             changeImg(index);
//          });
//     });
//     cross.addEventListener('click',()=>{
//         gallery.style.display="none";
//      })
//      rightArrow.addEventListener('click',()=>{
//             if(index<(thumbImgs.length-1)){
//                 changeImg(++index);
//             }else{
//                 index=0;
//                 changeImg(index);
//             }
//      })
//      leftArrow.addEventListener('click',()=>{
//         if(index<=0){
//             index=(thumbImgs.length-1);
//             changeImg(index);
//         }else{
//             changeImg(--index);
//         }
//  })

//      let changeImg=(index)=>{

        
//         thumbImgs.forEach((currentImg)=>{
//             currentImg.style.filter="grayscale(100%)";
//             currentImg.style.transform="scale(0.9)";
//         })
//         thumbImgs[index].style.filter="grayscale(0)";
//         thumbImgs[index].style.transform="scale(1)";
//         displayImg.children[0].setAttribute('src',thumbImgs[index].children[0].getAttribute('src'));
//      }
// })