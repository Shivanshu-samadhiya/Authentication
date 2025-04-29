const bcrypt = require('bcrypt');
const User = require("../models/User")
const jwt = require("jsonwebtoken")
require("dotenv").config();
// Signup route Handler

exports.signup = async (req, res) => {
    try {
        // Get data
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists",
            });
        }

        // Secure the password
        let hashedPassword = null;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error in Hashing Password",
            });
        }

        // Create a new user entry
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        return res.status(201).json({
            success: true,
            message: "User Created Successfully",
            user, // Optional: Return user details (excluding password)
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User Cannot be Registered, Please Try Again Later",
        });
    }
};


// login

exports.login = async(req,res)=>{
    try {
        // data fetch
        const {email,password} = req.body
       // validation on email and password
       if(!email || !password){
        return res.status(400).json({
        success: false,
        message: "Please fill all the details carefully"
        })
        // check for the register user   
       }
       // check for the resgister user
       let user = await User.findOne({email})
    // if user is not registered  

       if(!user){
          return res.status(401).json({
            success:false,
            message:"User is not registered"
          })
       }

       // verify password & genrate a jwt token
          const payload = {
            email:user.email,
            id:user._id,
            role:user.role
          }

       if(await bcrypt.compare(password,user.password)){
           // password matched
         let token = jwt.sign(payload,
            process.env.JWT_SECRET,{
                expiresIn:"2h"
            })
             user = user.toObject();
            user.token=token
            console.log(user);
            
            user.password = undefined
            
            const options = {
              expries:new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
              httpOnly:true,
            }

            // res.cookie('token',token,options).status(200).json({
            //     success:true,
            //     token,
            //     user,
            //     message:"User Logged in Sucessfully"
            // })

            res.status(200).json({
                success: true,
                token,
                user,
                message: "User Logged in Successfully"
            });
            
       }
       else{
        // password do not match
        return res.status(403).json({
            success:false,
            message:"Password is Incorrect"
        })

       }

    } catch (error) {
        
        console.log(error);

        return res.status(500).json({
            success:false,
            message:"Logged In Failure"
        })
        
    }
}