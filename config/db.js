import mongoose from "mongoose"



export const connectDB = async()=>{


try {
    
    await mongoose.connect(process.env.DB_URL);
    console.log("DB connected Successfully");

} catch (error) {
       console.log("DB Failed connected " , error);
}    







}

