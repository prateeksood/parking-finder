const router=require('express').Router();
const db=require('../db')
const uploadImg=require('./uploadImg');
const auth=require('../middleware/auth')
router.get('/',(req,res)=>{
    let query="SELECT * FROM parkingDetails";
    let parkings=[],finalParkings=[],images;
    db.query(query)
    .then(foundParkings=>{
        if(!foundParkings||foundParkings.length===0){
            res.status(200).send([])
        }
        foundParkings.forEach(parking=>{
            query=`SELECT * FROM images where parkingId in (${parking.id})`;
            db.query(query)
            .then((foundImages)=>{
                images=foundImages;
                parking={...parking,images};
                parkings.push(parking);
                query=`SELECT * FROM reviews where parkingId in (${parking.id})`
                return db.query(query)
            })
            .then((foundReviews)=>{
                reviews=foundReviews;
                parking={...parking,reviews};
                finalParkings.push(parking);
                return finalParkings
            })
            .then(parkings=>{
                if(parkings.length===foundParkings.length){
                    res.status(200).send(parkings)
                }
            })
            .catch(err=>console.log(err))
            
        })
    })
    .catch(err=>console.log(err))
});
router.get('/findParkings',(req,res)=>{    
    let IDs=req.query.id.split(',')
    let query=`SELECT * FROM parkingDetails where id in (${req.query.id})`;
    db.query(query,(err, foundParkings)=> {
        if (err) throw err;
        if(!foundParkings||foundParkings.length<1){
            res.status(200).send('No parking found');
        }else{
            res.status(200).send(foundParkings);
        }
      });
});
router.get('/:id',(req,res)=>{
    let query=`SELECT * FROM parkingDetails where id in (${req.params.id})`;
    db.query(query)
    .then(parking=>{
        if(!parking||parking.length===0){
            res.status(200).send([])
        }
        
        query=`SELECT * FROM images where parkingId in (${parking[0].id})`;
        db.query(query)
        .then((foundImages)=>{
            
            images=foundImages;
            parking={...parking[0],images};
            query=`SELECT * FROM reviews where parkingId in (${parking.id})`
            return db.query(query)
        })
        .then((foundReviews)=>{
            reviews=foundReviews;
            parking={...parking,reviews};
            return parking
        })
        .then(parkings=>{
                res.status(200).send(parkings)
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
});
router.get('/owner/:id',(req,res)=>{
    let query=`SELECT * FROM parkingDetails where ownerId in (${req.params.id}) AND isActive=1 ORDER BY id`;
    let parkings=[],finalParkings=[],images;
    db.query(query)
    .then(foundParkings=>{
        if(!foundParkings||foundParkings.length===0){
            res.status(200).send([])
        }
        foundParkings.forEach(parking=>{
            query=`SELECT * FROM images where parkingId in (${parking.id})`;
            db.query(query)
            .then((foundImages)=>{
                images=foundImages;
                parking={...parking,images};
                parkings.push(parking);
                query=`SELECT * FROM reviews where parkingId in (${parking.id})`
                return db.query(query)
            })
            .then((foundReviews)=>{
                reviews=foundReviews;
                parking={...parking,reviews};
                finalParkings.push(parking);
                return finalParkings
            })
            .then(parkings=>{
                if(parkings.length===foundParkings.length){
                    res.status(200).send(parkings)
                }
            })
            .catch(err=>console.log(err))
            
        })
    })
    .catch(err=>console.log(err))
});
router.post('/',auth,(req,res)=>{
    if(req.user){
        const {title,location,totalSpots,cost,owner,images}=req.body;
        let query=`INSERT INTO parkingdetails (title,lat,lon,city,totalSpots,cost,ownerId) values ( "${title}",${location.lat},${location.lng},"${location.placeName}",${totalSpots},${cost},${owner})`;
        db.query(query,(err, savedParking)=> {
            if(err) throw err;
            images.forEach(image => {
                query=`INSERT INTO images(parkingId,url) values(${savedParking.insertId},"${image}")`;
                db.query(query,(err, savedParking)=> {
                    if(err) throw err;
                })
            });
            res.status(200).send(savedParking)
        })
    }
});

router.put('/:id',auth,(req,res)=>{
    const{title,location,totalSpots,cost,owner}=req.body;
    let query=`UPDATE parkingdetails SET title="${title}",lat=${location.lat},lon=${location.lng},city="${location.placeName}",totalSpots=${totalSpots},cost=${cost} WHERE id=${req.params.id};`;
    db.query(query,(err, updatedParking)=> {
        if(err) throw err;
        res.status(200).send(updatedParking)
    })
});
router.put('/disable/:id',auth,(req,res)=>{
    let query=`UPDATE parkingdetails SET isActive=0 WHERE id=${req.params.id};`;

    db.query(query,(err, updatedParking)=> {
        if(err) throw err;
        res.status(200).send(updatedParking)
    })
});

// router.delete('/:id',auth,(req,res)=>{
//     let query=`DELETE FROM parkingdetails WHERE id=${req.params.id}`;
//     db.query(query,(err, deletedParking)=> {
//         if(err)throw err;
//         if(!deletedParking||deletedParking.length<1){
//             res.status(200).send('No parking deleted');
//         }else{
//             res.status(200).send(`successfully deleted ${deletedParking}`);
//         }
//     });
// });

module.exports=router;