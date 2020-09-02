const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const db=require('../db')

router.post("/signup", (req, res) => {
  const { name, email, password, contactNumber } = req.body;

  let query=`SELECT * FROM users WHERE email="${email}"`;
    db.query(query,(err, foundUser)=> {
      if(err) throw err
      if (foundUser.length===0) {
        bcrypt
          .hash(password, 10)
          .then(hash => {

            query=`INSERT INTO users (fullname,email,password,contactNumber) VALUES ("${name}","${email}","${hash}",${contactNumber})`;
            db.query(query,(err, savedUser)=> {
              if(err) throw err;
              let query=`SELECT * FROM users WHERE id="${savedUser.insertId}"`;
              db.query(query,(err, savedUser)=> {
                savedUser=savedUser[0];
                jwt.sign(
                  { id: savedUser.id },
                  "my_jwt_secret_123",
                  { expiresIn: 31536000 },
                  (err, token) => {
                    if (err) res.status(400).json({ message: err.message });
                    res.status(200).json({
                      message: "Account successfully created",
                      token,
                      user: {
                        fullname: savedUser.fullname,
                        email: savedUser.email,
                        contactNumber: savedUser.contactNumber,
                        id: savedUser.id
                      },
                      isError: false
                    });
                  }
                );
              })
            });
          })
          .catch(err=>console.log(err));
      } else {
        res
          .status(200)
          .json({ message: "Email address already in use!", isError: true });
      }
      });
});

router.post("/login", (req, res) => {

  const { email, password } = req.body;
  let query=`SELECT * FROM users WHERE email="${email}" LIMIT 1`;
  db.query(query,(err, foundUser)=> {
    if(err) throw err;
    if (foundUser.length>0) {
      bcrypt
        .compare(password, foundUser[0].password)
        .then(isMatched => {
          if (isMatched) {
            jwt.sign(
              { id: foundUser[0].id },
              "my_jwt_secret_123",
              { expiresIn: 31536000 },
              (err, token) => {
                if (err) res.status(400).json({ message: err.message });
                res.status(200).json({
                  message: "Login successful",
                  token,
                  user: {
                    fullname: foundUser[0].fullname,
                    email: foundUser[0].email,
                    contactNumber: foundUser[0].contactNumber,
                    id: foundUser[0].id,
                    isAdmin:foundUser[0].isAdmin
                  },
                  isError: false
                });
              }
            );
          } else {
            res
              .status(200)
              .send({ message: "Invalid password", isError: true });
          }
        })
        .catch(err =>
          res.status(400).send({ message: err.message, isError: true })
        );
    } else {
      res
        .status(200)
        .send({ message: "No user with given details found", isError: true });
    }
  })
});

router.get("/user", auth, (req, res) => {
  let query=`SELECT * FROM users WHERE id=${req.user.id}`;
  db.query(query,(err, foundUser)=> {
    if(err) throw err;
    res.json({ user:foundUser[0], isError: false })
  })
});
router.get("/user/:id",(req, res) => {
  let query=`SELECT * FROM users WHERE id=${req.params.id}`;
  db.query(query,(err, foundUser)=> {
    if(err) throw err;
    res.json({ user:foundUser[0], isError: false })
  })
});
module.exports = router;
