// import { TweenMax,TimelineMax,Power2} from "gsap/all";
// import ScrollMagic from "scrollmagic";
// import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";
// document.addEventListener('DOMContentLoaded',()=>{
//     ScrollMagicPluginGsap(ScrollMagic, TimelineMax,TweenMax);
//     let Controller= new ScrollMagic.Controller();
    
//    // =================gsap==================
//     let loadTl=new TimelineMax();
//     loadTl
//     .from('header',2,{
//         y:'-300'
//     })
//     .to('.bubble',2,{
//         scale:2
//     },'-=2')
//     .from('nav',4,{
//         autoAlpha:'0',
//     })
//     .from('.left-sec',4,{
//         height:'.1',
//         autoAlpha:'0'
//     },'-=2')
//     .from('.main-img',2,{
//         y:'800',
//         autoAlpha:'0'
//     },'-=2')
//  //=========================================================== 
    
//  let timeline1=new TimelineMax();
//     timeline1
//     .from('.card1',1,{
//         scale:0.1
//     })
//     .to('body',4,{
//         backgroundColor:"#000000",
//         backgroundImage:" linear-gradient(315deg, #000000 0%, #7f8c8d 74%)"
//     })
//     .to('.section-two',0.1,{
//         backgroundColor:"transparent"
//     },'-=4')
//     .to('.card1',4,{
//         delay:3,
//         x:1200,
//         scale:0.1,
//         autoAlpha:0
//     })
//     .from('.card2',4,{
//         x:-1200,
//         scale:0.1,
//         autoAlpha:0
//     })
//     .to('.card2',4,{
//         delay:3,
//         x:1200,
//         scale:0.1,
//         autoAlpha:0
//     })
//     .from('.card3',4,{
//         x:-1200,
//         scale:0.1,
//         autoAlpha:0
//     })
//     .to('.card3',4,{
//         delay:3,
//         x:1200,
//         scale:0.1,
//         autoAlpha:0
//     })
//     .from('.card4',4,{
//         x:-1200,
//         scale:0.1,
//         autoAlpha:0
//     })
//     .to('.card4',4,{
//         x:0,
//     })
//     let scene1=new ScrollMagic.Scene({
//         triggerElement:'.section-two',
//         duration:'200%',
//         triggerHook:0
//     })
//     .setTween(timeline1)
//     .setPin('.section-two')
//     .addTo(Controller);
// // =================================

// let timeline2=new TimelineMax();
// timeline2
// .to('.left-sec',3,{
//     x:'-600',
//     autoAlpha:0,
//     scale:0.5
// })
// .to('.right-sec',3,{
//     x:'600',
//     autoAlpha:0,
//     scale:0.5
// },'-=3')
// .to('.bg-style1',3,{
//     y:'-100'
// },'-=3')
// .to('.bg-style2',3,{
//     y:'-150'
// },'-=3')
// .to('.bg-style3',3,{
//     y:'-250'
// },'-=3')
// .to('.bg-style4',3,{
//     y:'-200'
// },'-=3')
// let scene2=new ScrollMagic.Scene({
//     triggerElement:'.container',
//     duration:'100%',
//     triggerHook:0
// })
// .setTween(timeline2)
// .setPin('.setion-one',{pushFollowers: false})
// .addTo(Controller);

// // ====================================
//     // new ScrollMagic.Scene({
//     //     triggerElement: '.section-two',
//     //     triggerHook: 'onCenter',
//     //     offset: 300
//     // })
//     //     .setClassToggle('.fixed-nav', 'fixed')
//     //     .setTween('.fixed-nav', 0.5, {top: 0, ease: Power2.EaseIn})
//     //     .addTo(Controller);
// })
