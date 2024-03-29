const location = require("./location")
const dotenv = require("dotenv")
const express = require("express")
const database = require("./database")
const cors = require("cors")
const https = require("https")
const fs = require("fs")

dotenv.config()

const PORT = process.env.PORT
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

const app = express()

app.use(cors({
    origin: "https://tzantchev.com",
}))

app.get("/locate", (req, res) => {

    console.log("[NEW API REQUEST] from IP: " + req.ip)

    if (req.params.location == "") {
        res.json({ success: false })
        return
    }
    location.getPlaneDataForLocation(req.query.location, GOOGLE_API_KEY)
    .then(result => {
        res.end(JSON.stringify(result))
    })
    .catch(err => {
        console.log(err);
        process.exit(-1)
    })
})

https.createServer({
    key: fs.readFileSync("privkey.pem"),
    cert: fs.readFileSync("cert.pem"),
    ca: fs.readFileSync("chain.pem")
}, app).listen(PORT, () => {
    database.createConnection({
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        database: process.env.DB,
        keepAliveInitialDelay: 1000,
        enableKeepAlive: true
    })
    .then(() => {
        console.log("The API is running 🚀");
    })
    .catch(err => {
        console.log("COULDN'T CONNECT TO DATABASE. TERMINATING PROGRAM.");
        process.exit(-1)
    })
})