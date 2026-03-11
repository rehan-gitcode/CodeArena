const express=require("express")
const submitRouter=express.Router()
const {submitProblem,runcode,allusersubmissions}=require("../Controllers/submission.controller")
  
const userauth= require("../middlewares/admin_middleware")
const user2auth=require("../middlewares/user_middleware")
 
submitRouter.post("/sub/:id",user2auth,submitProblem)  
submitRouter.post("/runcode/:id",user2auth,runcode)  
submitRouter.get("/Allusersubmission/:pid",user2auth,allusersubmissions)    



module.exports=submitRouter