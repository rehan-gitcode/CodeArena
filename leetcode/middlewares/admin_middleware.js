const express = require("express")
const jwt = require("jsonwebtoken")

const User=require("../models/user.model")
// const redisClient=require("./redis")

async function userauth(req, res, next) {
    const { token } = req.cookies
    if (!token) {
        res.send("token is not present")
    }

    const check = jwt.verify(token, "hhhhhdgd")
    const { email } = check
    if (!email) {
        res.send("invalid token email not found")
    }


    if (check.role != "admin") {
        throw new Error("invalid token role does't match")
    }

    const result = User.findOne({ email })


    if (!result) {
        throw new Error("user does not exist")

    }
    // const isBlock = await redisClient.exists(`token:${token}`)
    // if (isBlock) {
    //     throw new Error("token is blocked")

    // }


    req.result = result
    next()


}

module.exports = userauth