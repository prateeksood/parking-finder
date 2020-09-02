const router=require('express').Router();
const multer  = require('multer');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'./images')
    },
    filename: (req, file, cb) => {
      let filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
  })
  let upload = multer({ storage: storage })
  router.post('/', upload.array('photos',5),async (req, res)=> {
    try{
      let locationArr=[];
      req.files.forEach(file=>{
        locationArr.push(file.filename);
      })
        
        res.status(200).send({location:locationArr});
    }catch(err){
      res.status(500).send(err);
    }
  })
module.exports=router;