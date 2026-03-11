// const { Language } = require("@google/genai")
const mongoose = require("mongoose")

const { Schema } = mongoose


const problem_schema = new Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    difficulty: {

        type: String,
        required: true,
        enum: ["easy", "medium", "hard"]
    },

    tags: {
        type: String,
        required: true,
        enum: ["array", "linkedlist", "graph", "dp"]
    },

    visibleTestCases: [{

        input: {
            type: String,
            required: true 
        },

        output: {
            type: String,
            required: true
        },
        explanation: {
            type: String,
            required: true
        }
    }],

    HiddenTestCases: [{

        input: {
            type: String,
            required: true
        },

        output: {
            type: String,
            required: true
        },

    }],

    startCode: [{

        language: {
            type: String,
            enum: ["javascript", "c++", "python"],
            required: true
        },

        initialCode: {
            type: String,
            required: true

        },
    }],

    problemCreator: {

        // type: Schema.Types.ObjectId,
        // ref: 'user',
        // required: true
        type: String,
        // required: true

    },

    referenceSolution: [
{
        language: {
            type: String,
            required: true

        },

        code: {
            type: String,
            required: true


        }
    }
    ]
},
    { timestamps: true }
)

const problems = mongoose.model("user2", problem_schema)
module.exports = problems

















