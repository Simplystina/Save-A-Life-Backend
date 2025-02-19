const UserModel = require("../Model/user")
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require("bcryptjs");
const DonorModel = require("../Model/donor");
const { ErrorResponse } = require("../core");

const httpStatus = require("http-status");
const {sendVerificationEmail} = require("../services/email.service")
require("dotenv").config()
// Generate a verification token
function generateVerificationOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }


exports.register = async(req,res,next)=>{
    try {
        const {
          firstName,
          lastName,
          email,
          password,
          bloodType,
          stateOfResidence,
          location,
          dateOfBirth,
          lastDonationDate
        } = (data = req.body);
        
      
        //check if user already exist
        const oldUser = await UserModel.findOne({email})
        if (oldUser) {
            return res.status(409).json({ success: false, message:"User Already exist. Please Login"})
        }

        const verificationOtp = generateVerificationOTP();

        //create user in our database
        const userData = {
          ...data,
         verificationOTP : verificationOtp,
         verificationTokenExpiresAt : Date.now() + 60 * 60 * 1000
        }
        
        const user = await UserModel.create(userData)
        const donor = await DonorModel.create({
          lastDonationDate: lastDonationDate
        });
         const otp = `${verificationOtp}`
        // Send verification email to the user
        await sendVerificationEmail(user, otp);

        const userWithoutPassword = {
          ...user._doc,
          password: undefined,
       };

        return res.status(201).json({
            message: "Registration successful. Please check your email for the OTP",
            data: userWithoutPassword,
            success:true
        })
    
    } catch (error) {
        next(new ErrorResponse(error, httpStatus.BAD_REQUEST))
  }
}

exports.login = async(req,res,next)=>{
    try {
          
        //Get user input
        const {email, password}=data = req.body
         //Validate if user exist in our database
        const user = await UserModel.findOne({ email })
       console.log("We got here")
        if(!user){
           return next(
             new ErrorResponse("User doesn't exist", httpStatus.status[404])
           );
        } 
        

        //validate user password
        const validate = await user.isValidPassword(password)
        const isValidPassword = await bcrypt.compare(password, user?.password);
        if(!validate)
        return next(
          new ErrorResponse("Wrong password entered", httpStatus.status[404])
        );

        //create token
        const token = jwt.sign(
            { userid: user._id, email},
            process.env.JWT_TOKEN,
            {
                expiresIn: "5h"
            }
        )
        //save user token
        userData = user.toObject();
        userData.token = token 
      
        //Delete the password from the object so as not to display the hash to the user
        delete userData.password;
       
        return  res.status(200).json({success:true, message:"Logged in successfully", data:userData})
    } catch (error) {
       next(new ErrorResponse(error, httpStatus.status.INTERNAL_SERVER_ERROR));
    }

}

// API endpoint for verifying the user's email
exports.verify = async(req, res) => {
    const { otp, email } = req.query;
        
    try {

      // Find the user with the provided verification token
    const userToken = await UserModel.findOne({
      verificationOTP: otp,
      verificationTokenExpiresAt: { $gt: new Date() } 
    });
    const userEmail = await UserModel.findOne({email})
    if(userEmail?.verified === true){
      return res.status(200).json({success: true, message: "User is already verified"})
    }
  
    if (userToken) {
      // Mark the user as verified
      const userUpdate = await UserModel.updateOne(
        {
          verificationOTP: otp,
          verificationTokenExpiresAt: { $gt: new Date() }
        },
        {
          $set: { verified: true },
          $unset: {
            verificationToken: '',
            verificationTokenExpiresAt: ''
          }
        }
      );
      return res.status(201).json({message: 'Email verification successful! Please go to login', success: true});
    }
    return res.status(400).json({ success: false, message:'Invalid verification token or token has expired.'});
    } catch (error) {
      next(new ErrorResponse(error, httpStatus.status[500]));
    }
    
} 


exports.resendVerification = async(req, res) => {
    const { email } = req.body;
  
    try {
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({success:false, message: 'User not found, please register'});
      }
  
      const verificationOTP = generateVerificationOTP(); 
      const verificationTokenExpiresAt = Date.now() + 3600000; 
  
      const userUpdate = await UserModel.updateOne(
        {email},
        {
          $set: { 
            verificationToken: verificationToken,
            verificationTokenExpiresAt: verificationTokenExpiresAt
          },
        
        }
      );
   
      const verificationOtp = `${verificationOTP}`;
      await sendVerificationEmail(user, verificationOtp);
  
      return res
        .status(201)
        .json({
          success: true,
          message: "Verification email resent successfully",
          data: verificationOtp,
        });
    } catch (error) {
     next(new ErrorResponse(error, httpStatus.status[500]));
    }
  }
  

  