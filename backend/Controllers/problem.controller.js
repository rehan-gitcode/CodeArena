 const problems = require("../models/problem.model")
const User=require("../models/user.model")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const {getLanguageId,submitBatch,submitToken}=require("./getLanguage")
// const { Tokens } = require("@google/genai/node")





async function problemCreate(req,res){
    const{title,description,diificulty,tags,visibleTestCases,hiddenTestCases,startCode,
        referenceSolution,problemCreator
    }=req.body

  

    try{
    
    for(const {language,code} of referenceSolution){
     
     //format to send judge0:-
        //source code 
        //language id
        //stdin from visibletestcases
        //expectedOutput same from stdin 
 
        const languageId=getLanguageId(language) ;       
       
        
  
        //creating batch submission with diff test cases to send     
        const submissions= visibleTestCases.map((testcase)=>({    
            source_code:code,
            language_id:languageId,
            stdin:testcase.input,
            expected_output:testcase.output 

        }))
        

      const submitResult= await submitBatch(submissions)
    
   
    
    const resultToken=submitResult.map((value)=>value.token)
   
     const testResult= await submitToken(resultToken)

     for(const test of testResult){
        if(test.status_id!==3){
          return res.status(400).send(test)
        }
     }

     const userProblem=await problems.create({
        ...req.body,
        problemCreator:req.result._id
        
     })

     res.status(201).send("problem saved")
       
    }
}catch(err){
 res.status(400).send("error"+err.message)
}
}

async function updateProblem(req,res) {

   const{title,description,diificulty,tags,visibleTestCases,hiddenTestCases,startCode,
        referenceSolution,problemCreator
    }=req.body

    const{id}=req.params


  try{

for(const {language,code} of referenceSolution){
     
//format to send judge0
        //source code 
        //language id
        //stdin from visibletestcases
        //expectedOutput same from stdin

        const languageId=getLanguageId(language) ; 
      
        

        //creating batch submission with diff test cases to send 
        const submissions= visibleTestCases.map((testcase)=>({
            source_code:code,
            language_id:languageId,
            stdin:testcase.input,
            expected_output:testcase.output

        }))
        

      const submitResult= await submitBatch(submissions)
    
   
    
    const resultToken=submitResult.map((value)=>value.token)
   
     const testResult= await submitToken(resultToken)

     for(const test of testResult){
        if(test.status_id!==3){
          return res.status(400).send(test)
        }
     }


    await problems.findByIdAndUpdate(id,{...req.body},{runValidators:true})
  
}
}
catch(err){
  res.status(400).send(err.message)
}
}



async function deleteProblem(req,res) { 

  const{id}=req.params

  try{
  if(!id){
    res.status(401).send("id is missing")
  }

  const problem=await problems.findByIdAndDelete(id)
  res.send(problem)
}
catch(err){
  res.send(err.message)
}
  
}


async function getProblemById(req,res) {

  const{id}=req.params

  try{

   if(!id){
    res.status(401).send("id is missing")
  }

  const problem=await problems.findById(id).select("id title description difficulty tags visibleTestCases startCode referenceSolution")
  if(!problem){
    res.send("no problem found ")
  }
  
  res.send(problem)

}
catch(err){
  res.send(err.message)
}


  
}



async function getAllProblem(req,res) {

  try{

  const problem=await problems.find({}).select("id title description difficulty tags visibleTestCases startCode referenceSolution")
  if(problem.length==0){
    res.send("no problem found ")
  }

  res.send(problem)

}
catch(err){
  res.send(err.message)
}

}
  
async function solvedAllProblemsbyUser(req,res) {
  try{


    const user_id=req.result._id 
   const user= await User.findById(user_id).populate({
    path:"problemSolved",
    select:"_id title difficulty tags "
   })
    // const count =req.result.problemSolved.length;
    res.send(user.problemSolved) 

  }catch(err){
    res.status(500).send("server error")

  }

  
}


module.exports={problemCreate,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblemsbyUser}