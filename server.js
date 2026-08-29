
import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv"
import User from "./routes/User.routes.js"
import Blog from "./routes/Blog.routes.js"
import BlogDashboard from "./dashboard/Blog.dashboard.js"
import cors from "cors"
import cookieParser from "cookie-parser";
import Blog_Controller from "./Controller/blog.controller.js"
import commentAI_Controller from "./Controller/comment.contrlloer.js"
import Comment from "./routes/Comment.routes.js"
import CommentsDashboard from "./dashboard/Comment.dashboard.js"


dotenv.config();
await connectDB()


const app = express();
app.use(express.json())


app.use(cors({
    origin:'http://localhost:5173' , credentials:true
}))

app.use(cookieParser())

app.use( "/images" ,  express.static("images"))
app.use("/users" , User )
app.use("/blogs" , Blog )
app.use("/comments" , Comment )

app.use("/dashboard/blog" ,   BlogDashboard   )
app.use("/dashboard/comments" ,   CommentsDashboard   )

app.use("/ai", Blog_Controller )
app.use("/comment-ai" ,  commentAI_Controller )


const PORT = process.env.PORT

app.listen(PORT , ()=>{
    console.log(`app is Listening on Port ${PORT} `);
    
})



