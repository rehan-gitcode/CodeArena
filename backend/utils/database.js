const mongoose=require("mongoose")

dotenv.config()

async function top() {
    await mongoose.connect(process.env.DATABASE_URL)
}

module.exports=top 