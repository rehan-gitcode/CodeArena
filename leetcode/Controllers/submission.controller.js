const mongoose = require("mongoose")
const submit = require("../models/submission.model")
const problems = require("../models/problem.model")
const user=require("../models/user.model")
const { getLanguageId, submitBatch, submitToken } = require("./getLanguage")  



async function submitProblem(req, res) {
    const userId = req.result._id
    const problemId = req.params.id
    const { code, language } = req.body 

    try {



     
       

        if (!(userId||problemId||code||language)) {
            res.status(500).send("field is misssing")

        }

        // just save the problem with panding states without solving

        const problem = await problems.findById(problemId)

        const submitresult = await submit.create({
            userId,
            problemId,
            code,
            language,
            testCasePassed: 0,
            status: "panding",
            testCaseTotal: problem.HiddenTestCases.length
        })

        // now send the problem to judge0 to solve it and updete it into DB

        const languageId = getLanguageId(language);

        const submissions = problem.HiddenTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output

        }))

        const submitResult = await submitBatch(submissions)

        const resultToken = submitResult.map((value) => value.token)

        const testResult = await submitToken(resultToken)

        //update submitresult

let testCasePassed=0
let runtime=0
let memory=0
let status="accepted"
let errorMessage=null

        for(const test of testResult){
            if (test.status_id==3){
                testCasePassed++
                runtime=runtime+parseFloat(test.time)
                memory=Math.max(memory,test.memory)
            }else{
                 if (test.status_id==4){
                    status="error"
                    errorMessage=test.stderr
                 }
                 else{
                    status="wrong result"
                    errorMessage=test.stderr
                 }

            }
        }

        //store the result in database and update the submitresult

        submitresult.status=status
        submitresult.testCasePassed=testCasePassed
        submitresult.memory=memory
        submitresult.runtime=runtime
        submitresult.errorMessage=errorMessage

        await submitresult.save()

        res.status(201).send(submitresult)

        if(!req.result.problemSolved.includes(problemId)){
            req.result.problemSolved.push(problemId)
            await req.result.save()
        }

        // res.status(201).send(submitresult)  


    }
   


 catch(err) {
        res.status(401).send(err.message)
    }
}

async function runcode(req,res) {

     const userId = req.result._id
    const problemId = req.params.id
    const { code, language } = req.body

    try {

          if (!(userId||problemId||code||language)) {
            res.status(500).send("field is misssing")

        }

        // if (userId || problemId || code || language) {
        //     res.status(500).send("field is misssing")

        // }

        // just save the problem with panding states without solving

        const problem = await problems.findById(problemId)

      

        // now send the problem to judge0 to solve it and updete it into DB

        const languageId = getLanguageId(language);

        const submissions = problem.visibleTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output

        }))

        const submitResult = await submitBatch(submissions)

        const resultToken = submitResult.map((value) => value.token)

        const testResult = await submitToken(resultToken)

       res.status(201).send("run succesfully");


        
       



    }
    catch (err) {
        res.status(401).send(err.message)
    }


    
}

async function allusersubmissions(req,res) {   
    const userId=req.result._id
    const problemId=req.params.pid

    const ans=await submit.find({userId,problemId})
    res.status(200).send(ans)
    
    
}

module.exports={submitProblem,runcode,allusersubmissions} 