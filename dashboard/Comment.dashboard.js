import { Router } from "express";
import { Authentication } from "../middleware/auth.middleware.js";
import CommentModels from "../models/Comment.models.js";
import BlogModels from "../models/Blog.models.js";



const router =   Router()




router.get("/all-comments"  ,Authentication , async(req,res)=>{


const blogs = await BlogModels.find({author:req.user.id});
const blogIds = blogs.map(b=>b._id)

 const comments =   await CommentModels.countDocuments({blog:{$in:blogIds}      })


return res.status(200).json({message:"Blogs fetched Successfully" ,
     success:true,
    comments,
    count
    
    })





})






router.get("/user-comments", Authentication , async(req,res)=>{


const blogs = await BlogModels.find({author:req.user.id})
const blogIds = blogs.map(b=>b._id)

const comments =    await CommentModels.find({blog:{$in:blogIds}}).populate("blog","title category")
.sort({createdAt:-1})


return res.status(200).json({message:"user comments fetched Successfully" ,
     success:true,
    comments,
    count:comments.length
    
    })




} )











export default router