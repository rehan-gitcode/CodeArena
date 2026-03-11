const mongoose=require("mongoose")
const { trim } = require("validator")
const{Schema}=mongoose

const userdata=new Schema({
    firstname:{
        type:String,
        maxLength:20,
        minLength:3,
        required:true

    },
    lastname:{
        type:String,
        maxLength:20,
        minLength:3

    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        immutable:true
        
    },
    age:{
        type:Number,
        min:10,
        max:80,

    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
 },
 problemSolved:{
    type:[{
        type:Schema.Types.ObjectId,
        ref:"user2"
    }],

    unique:true
    
 }

},
 {timestamps:true}
)

const User=mongoose.model("user",userdata)
module.exports=User