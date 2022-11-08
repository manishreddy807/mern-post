const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const header_midleware = require('./middleware/header')
const colors = require('colors')
const dbConnect = require('./config/db')
const profileRoutes = require('./routes/profileRoutes')
const postRoutes = require('./routes/postRoutes')
const userRoutes = require('./routes/userRoutes')

dotenv.config()
const port = process.env.PORT;
dbConnect();

const app = express();
app.use(express.json())
// app.use(bodyParser.urlencoded({extended: true}));
app.use(header_midleware)
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes)


async function sleep (millis){
    return new Promise((resolve) => setTimeout(resolve, millis))
}

app.get("/", async(req, res) => {
    await sleep(5000);
    res.send('server says hello')
})

app.listen(port, () => console.log(`Listening on port ${port}`))