
// is Auths ,isStudent ,isAdmin
const jwt = require("jsonwebtoken");
require('dotenv').config()

exports.auth = (req,res,next)=>{
    try {
        // extract JWT Token
        // PENDING:Other ways to fetch token
        console.log("cookie",req.cookies.token);
        console.log("Body",req.body.token);
        console.log("header",req.header("Authorization"));

        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","") ;

        if (!token || token === undefined) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        // verify the token
        try {
            const payload = jwt.verify(token,process.env.JWT_SECRET)
            console.log(payload);
            // why this ?
            req.user = payload;
            
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Token is invalid"
            })
        }
          next()
    } 
    catch (error) {

        return res.status(401).json({
            success:false,
            message:"Something went wrong, while verifying  the token "
        })
    }
}


exports.isStudent = (req,res,next)=>{
    try {
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a Protected Route for the Student"
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'User role is Not Matching'
        })
    }
}

exports.isAdmin = (req,res,next)=>{
    try {
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a Protected Route for the Admin"
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'User role is Not Matching'
        })
    }
}