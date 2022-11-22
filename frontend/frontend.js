const dotenv = require("dotenv")
const express = require("express")
const https = require("https")
const fs = require("fs")

dotenv.config()
    const app = express()

const PORT = process.env.PORT

app.use(express.static("public"))
app.use("planes/js", express.static(__dirname + "/public/js"))

https.createServer({
    key: fs.readFileSync("privkey.pem"),
    cert: fs.readFileSync("cert.pem"),
    ca: fs.readFileSync("chain.pem")
}, app).listen(PORT, () => {
    console.log("Web server started at port " + PORT);
})
