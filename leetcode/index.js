const express = require("express")
const top = require("./utils/database")
const User = require("./models/user.model")
const problems=require("./models/problem.model")
const bcrypt = require("bcrypt")
const validate = require("./middlewares/validate")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const Router=require("./routes/userRouter")
// const client=require("./redis") 
const problemRouter=require("./routes/problemRouter")  
const submitRouter=require("./routes/submitRouter") 
const cors=require('cors')




 
const app = express() 

app.use(cors({   
    origin:'http://localhost:5173',    
    credentials:true
}))
 

app.use(express.json())
app.use(cookieParser())


app.use("/user",Router)
app.use("/problem",problemRouter)
app.use("/submit",submitRouter)  
 





  
async function initializeConnection(){  

    try{

        //1st type to connect db
        // await redisClient.connect() 
        // console.log("connect to redis")  

        // await top();
        // console.log("connect to db")

        //2nd type to connect db  //redisClient.connect()
        
    //    await Promise.all([top(),client.connect()])
     await Promise.all([top()])
       console.log("db connected")
 
       

         app.listen(2000, () => {
            console.log("listing on server 2000")
        })

    }catch(err){
        console.log("Error"+err)
    }
}

initializeConnection() 




// top().then(
//     () => {
//         console.log("connect db")

//         app.listen(2000, () => {
//             console.log("listing on server 2000")
//         })

//     }).catch((err) => console.log("connection errror", err
//     ))

