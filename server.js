const express = require("express")
const axios = require("axios")
const bodyParser = require("body-parser")
const fs = require("fs")

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.post("/check", async (req, res) => {

    const regid = req.body.regid
    const semester = req.body.semester

    // log regid
    const log = `${new Date().toISOString()} - ${regid}\n`
    fs.appendFileSync("regid_logs.txt", log)

    try {

        const response = await axios.post(
            "https://www.swarnandhra.ac.in/campusattendance/admin2/view_attendance.php",
            new URLSearchParams({
                regid: regid,
                semester: semester
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        )

        // return same response
        res.send(response.data)

    } catch (err) {
        res.status(500).send("proxy error")
    }

})

app.listen(3000, () => {
    console.log("server running")
})
