const dotenv = require("dotenv")
const express = require("express")

dotenv.config()
const app = express()

const PORT = process.env.PORT

app.use(express.static("public"))
app.use("planes/js", express.static(__dirname + "/public/js"))

app.listen(PORT, () => {
    console.log("Web server started at port " + PORT);
})