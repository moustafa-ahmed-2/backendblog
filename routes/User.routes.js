import { Router } from "express";
import UserModels from "../models/User.models.js";
import jwt from "jsonwebtoken"


import bcryptjs from "bcryptjs"
import { Authentication } from "../middleware/auth.middleware.js";


 const router =  Router()


function setAuthCookie(res , token){


    res.cookie("token" , token , {

 httpOnly:true,
 secure:process.env.NODE_ENV == "production",
 sameSite:process.env.NODE_ENV == "production"? "none" : "lax",
maxAge:30*24*60*60*1000    // 1 week

    })




}



router.post("/register" , async(req , res)=>{

try {
const {name  ,email , password} = req.body;

const existemail = await UserModels.findOne({email})

if(existemail){
    return res.status(409).json({message:"email alredy exists" , success:false})
}


const hashedPass = await bcryptjs.hash(password , 12)

const user = await UserModels.create({
    name  ,email , password:hashedPass
})



const token = await jwt.sign({id:user._id} , process.env.JWT_SECRET ,{ expiresIn:'1y' })
setAuthCookie(res , token)


return res.status(201).json({message:"user created Successfully" , success:true,
user:{
    id:user._id , email:user.email  , name:user.name
},
token


})
    
} catch (error) {
console.log("Error" , error);
    
}




})




router.post("/login" , async(req , res)=>{


try {

    
    const { email , password} = req.body;

    const user = await UserModels.findOne({email})

    if(!user){
        return res.status(404).json({message:"user not found" , success:false})
    }



    const isMatch = await bcryptjs.compare(password , user.password)

    if(!isMatch){
    return res.status(404).json({message:"Invalid credentials" , success:false})   
    }


const token = await jwt.sign({id:user._id} , process.env.JWT_SECRET ,{ expiresIn:'7d' })
setAuthCookie(res , token)



    return res.status(200).json({message:"user login Successfully" , success:true,

    user:{
        id:user._id , email:user.email  , name:user.name , password:user.password
    },
    token


})


} catch (error) {
    console.log("Error" , error);
    
}
})


router.get("/me" , Authentication  , async(req,res)=>{

const user = await UserModels.findById(req.user.id);

if(!user){
        return res.status(404).json({message:"user Not found" , success:false})

}
    return res.status(200).json({message:"user fetched Successfully" , success:true ,user})

})





router.post("/logout"  , async(req,res)=>{


    res.clearCookie("token"  , {

 httpOnly:true,
 secure:process.env.NODE_ENV == "production",
 samesite:process.env.NODE_ENV == "production"? "none" : "lax",
maxAge:7*24*60*60*1000    // 1 week

    })




    return res.status(200).json({message:"logout Successfully" , success:true,

})

})











router.get("/:id" , async(req,res)=>{

const {id} = req.params;

const user = await UserModels.findById(id).select("-password")

if(!user){
    
    return res.status(404).json({message:"user not found" , success:false,

})


}

    return res.status(200).json({message:"user fetched Successfully" , success:true,

})



})






export default router;
