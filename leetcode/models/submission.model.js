const mongoose = require("mongoose")
const { Schema } = mongoose

const submission = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref:"user",
        required: true
    },

    problemId: {
        type: Schema.Types.ObjectId,
        ref:"user2",
        required: true
    },

    code: {
        type: String,
        required: true
    },

    language: {
        type: String,
        enum: ["javascript", "c++", "python"],
        required: true
    },

    status: {
        type: String,
        enum: ["panding", "accepted", "wrong", "error"],
        default: "panding"
    },

    runtime: {
        type: Number,
        default: 0
    },

    memory: {
        type: Number,
        default: 0
    },

    errorMessage: {
        type: String,
        default: ""
    },

    testCasePassed: {
        type: String,
        default: 0
    },

    testCaseTotal: {
        type: Number,
        default: 0

    }
},
    { timestamps: true }
)

const submit = mongoose.model("user3", submission)
module.exports = submit