import { Router } from "express";
import CommentModels from "../models/Comment.models.js";
import BlogModels from "../models/Blog.models.js";


const router =  Router()



router.post("/add-comment" , async(req,res)=>{

const { blogId ,name , comment } = req.body;
// const blogId = req.params;
                                           
const newComment = await CommentModels.create({ blog:blogId , name , comment });


return res.status(201).json({message:"Comment created Successfully" 
    , success:true,
    comment:newComment , blog:blogId
    
    
    })

})




router.get("/blog-comment/:blogId" , async(req,res)=>{


const {blogId} = req.params;

 const comments = await CommentModels.find({blog:blogId}).populate(
    "blog" , "title category"
 ).sort({createdAt:-1})

return res.status(200).json({message:"Blogs fetched Successfully" ,
     success:true,
    comments,
    count:comments.length
    
    })

})











router.get("/all-comments" , async(req,res)=>{


const blogs = await BlogModels.find({author:req.user.id});
const blogIds = blogs.map(b=>b._id)

 const comments =   await CommentModels.countDocuments({blog:{$in:blogIds}      })


return res.status(200).json({message:"Blogs fetched Successfully" ,
     success:true,
    comments,
    count:comments.length
    
    })





})





export default router;

