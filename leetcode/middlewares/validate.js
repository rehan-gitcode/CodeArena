const validator=require("validator")


function validate(data){
    const mandatory=["firstname","email","password"]
    const ishere= mandatory.every((k)=>Object.keys(data).includes(k))

    if(!ishere){
        throw new Error("field missing here")
    }

    if(!validator.isEmail){
         throw new Error("enter valid email") 
    }

    if(!validator.isStrongPassword){

         throw new Error("enter strong password")
    }

}

module.exports=validate