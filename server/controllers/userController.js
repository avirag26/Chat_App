
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudnary.js";

//Signup new user

export const signup = async (req,res)=>{
   const {fullName , email , password , bio} = req.body;

   try{
    if(!fullName || !email || !password || !bio){
        return res.json({success:false,message:"Missing detailes"})
    } 
   
    const user = await User.findOne({email});
    if(user){
    return res.status(404).json({message:"User already exist"})
    }
     
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = await User.create({
        fullName,
        email,
        password:hashedPassword,
        bio
    })

    const token = generateToken(newUser._id)

    res.status(200).json({success:true , userData:newUser,token,message:"Account created successfully"})

   } catch (error){
      console.log(error.message)
      res.status(500).json({success:false,message: error.message})
    }

}

 // User signin

 export const login  = async (req,res) =>{
    try{
    const {email , password} = req.body;

    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    const isPasswordCorrect = await bcrypt.compare(password,user.password)

    if(!isPasswordCorrect){
        return res.status(404).json({success:false,message:"Invalid credential"});
    }
    const token = generateToken(user._id)

    res.json({success:true , userData: user , token, message:"Login Successfull"})
   } catch (error){
    console.log(error.message)
    return res.status(500).json({success:false, message:error.message})
   }
 }

 // controller to check if user is authenticated

 export const checkAuth = (req,res)=>{
    res.json({success:true , user: req.user});
 }

 //To update profile

 export const updateProfile = async (req,res) =>{
    
     try {
        const {profilePic , bio , fullName} =req.body

        const userId = req.user._id;

        let updatedUser;

        if(!profilePic){
         updatedUser =  await User.findByIdAndUpdate(userId , {bio,fullName} , {new:true});
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, {profilePic:upload.secure_url , bio , fullName},{new:true})
        }

        return res.status(200).json({success:true , user:updatedUser})
     } catch (error) {
        console.log(error.message)
        res.status(500).json({success:false,message:error.message})
     }

 }