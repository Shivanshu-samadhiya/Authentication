// instantiate a express 
const express = require('express')

const router = express.Router()

const {login,signup} = require("../Controllers/Auth")

const { auth, isStudent, isAdmin } = require("../middlewares/auth");

router.post('/login',login)

router.post('/signup',signup)

// testing protected route for single middleware

router.get('/test',auth,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the protected route for TEST"
    })
})

// protected route

router.get('/student',auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the protected route of the students"
    })
})

router.get('/admin',auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the protected route of the Admin"
    })
})

module.exports = router;