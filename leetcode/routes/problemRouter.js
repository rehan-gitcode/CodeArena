const express=require("express")
const problems = require("../models/problem.model")
const problemRouter=express.Router()
const {problemCreate,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblemsbyUser}=require("../Controllers/problem.controller")
const userauth= require("../middlewares/admin_middleware")
const user2auth=require("../middlewares/user_middleware")

//create
problemRouter.post("/create",userauth,problemCreate) 
problemRouter.patch("/problemupdate/:id",userauth,updateProblem)
problemRouter.delete("/:id",userauth,deleteProblem)
 
problemRouter.get("/getproblem/:id",user2auth,getProblemById)
problemRouter.get("/getallproblem",user2auth,getAllProblem)
problemRouter.get("/allsolvedproblem",user2auth,solvedAllProblemsbyUser)


module.exports=problemRouter  
