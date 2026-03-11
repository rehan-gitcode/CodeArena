const express=require("express")
const authRouter=express.Router()
const { user_register, admin_register, login,logout,deleteuserprofile,checkAuthuser } = require("../Controllers/user.controller")
const admin_middleware = require("../middlewares/admin_middleware")
const user2auth=require("../middlewares/user_middleware")
const validate=require("../middlewares/validate")


authRouter.post("/register", user_register)
authRouter.post("/login", login)
authRouter.post("/register/admin",validate, admin_register)
authRouter.post("/logout",user2auth,logout)
authRouter.delete("/deleteprofile",deleteuserprofile)    

authRouter.get("/check",user2auth,checkAuthuser)

//         const reply={
//         firstname:req.result.firstname,
//         emailid:req.result.email,
//         _id:req.result._id
//     }

//     req.status(200).send({
//         user:reply,
//         message:"valid user"
//     })


// })


module.exports=authRouter