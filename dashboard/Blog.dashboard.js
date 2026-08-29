import { Router } from "express";
import BlogModels from "../models/Blog.models.js";
import { Authentication } from "../middleware/auth.middleware.js";
import multer from "multer";

import path from "path"


 const router =  Router();



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images')
  },
  filename: function (req, file, cb) {
       const ext = path.extname(file.originalname);
    const filename = Date.now() + '-' +  file.fieldname + ext
    cb(null,   filename)
  }
})

const upload = multer({ storage: storage, limits:{fileSize: 5  * 1024 * 1024} })









router.post("/add-blog" ,upload.single("thumbnail") , Authentication , async(req,res)=>{

    const {title , subTitle , description , published , category} = req.body;

   const blog =   await BlogModels.create(
        {title , subTitle , description  , category ,
             published:published== true , author:req.user.id , 
            thumbnail:req.file?.filename
            
            })

            await blog.save();


return res.status(201).json({message:"Blog created Successfully" , success:true, blog})

})


router.get("/blogs-count" , Authentication ,async (req,res)=>{

try {
    
    const count = await BlogModels.countDocuments({
        author:req.user.id
    })
    console.log("USER:", req.user);



return res.status(200).json({message:"Blog fetched counted Successfully" , success:true, count})

    
} catch (error) {
     res.status(500).json({
      success: false,
      message: error.message

     })
}


})


router.get("/all-Blogs" , Authentication  , async(req,res)=>{


 const blogs = await BlogModels.find({ author: req.user.id })
      .populate("author", "name email")
      .sort({ createdAt: -1 });


return res.status(201).json({message:"Blogs fetched Successfully" 
    , success:true,
     blogs , count:blogs.length
    
    
    })

})



router.delete("/delete-blog/:id" , Authentication , async(req,res)=>{

const {id} = req.params

   const blog = await BlogModels.findById(id);

 if(!blog){

return res.status(404).json({message:"Blog not found" , success:false})

 }

   await BlogModels.findByIdAndDelete(id)



return res.status(201).json({message:"Blog deleted Successfully" , success:true})

})






 export default router;






 