const express = require("express");
const app = express();
const cors = require('cors');
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose")
const MongoClient = require('mongodb').MongoClient;
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const connectDB = require("./DB/connection")
const path = require("path");
const multer = require("multer")


dotenv.config()

// mongoose.connect('mongodb://127.0.0.1:27017/socialMedia', { useNewUrlParser: true })
// mongoose.connection.once('open', function () {
//     console.log('connection has been made')
// }).catch(error){
//     console.log(error)
// }
// connectDB()

app.use(cors());

// mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
//     console.log("connected to mongoDB")
// })

mongoose.connect('mongodb+srv://solaogun:Adebule7@cluster0.aes4b.mongodb.net/socialMediaDB?retryWrites=true&w=majority'
    ,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("MongoDB connected")).catch((err) => console.log(err));

// mongoose.connect(process.env.MONGO_URL)
// const db = mongoose.connecction

// db.on("error", (error) => console.log(error))

// db.once("open", () => console.log("db connected"))


// MongoClient.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }, (err, client) => {
//     if (err) {
//         return console.log(err);
//     }

//     // Specify database you want to access
//     const db = client.db('socialMediaDB');
//     console.log(db, "db is up")

// });
// const connection = mongoose.connection(connection)


// MongoClient.connect(url = 'mongodb://127.0.0.1:27017/socialMedia', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }, (err, client) => {
//     if (err) {
//         return console.log(err);
//     }

//     // Specify database you want to access
//     const db = client.db('socialMedia');

//     console.log(`MongoDB Connected: ${url}`);
// });



// app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/images", express.static(path.join(__dirname, "public/images")))

//Middleware

app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("testing")
        cb(null, "public/images")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
        console.log(req.file)
        // cb(null, req.body)
        // cb(null, Date.now() + path.extname(file.name))
    }
})

// const upload = multer({ storage })
const upload = multer({ dest: './public/images/' })
app.post("/api/upload", upload.single("file"), (req, res) => {

    console.log('Response', res);

    // app.post("/api/upload", (req, res) => {
    console.log('check file', upload);
    try {
        return res.status(200).json("file uploaded successfully")
    } catch (err) {
        console.log(err)
    }
})

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)

app.listen(8800, () => {
    console.log("Backend server is running")
})