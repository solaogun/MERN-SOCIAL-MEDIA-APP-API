const mongoose = require("mongoose")
// const connectDB = require("./DB/connection")

// const URI = 'mongodb+srv://solaogun: Adebule@7@cluster0.aes4b.mongodb.net/socialMedia?retryWrites=true&w=majority'

// const connectDB = async () => {
//     await mongoose.connect(URI, { useUnifiedTopology: true, useNewUrlParser: true })
//     console.log('db connected')
// }

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            // useCreateIndex: true
        })
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit()
    }
}

module.exports = connectDB