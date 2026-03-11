const mongoose=require("mongoose")

async function top() {
    await mongoose.connect("mongodb+srv://royalrehan143:royalrehan786@rehandbms.ydrrpsn.mongodb.net/database2")
    
}

module.exports=top 