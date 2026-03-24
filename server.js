const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>You can't open this API directly</h1>");
});
app.get("/check", (req, res) => {
  res.send("<h1>You can't open this API directly</h1>");
});

app.post("/check", async (req, res) => {
  const regid = req.body.regid;
  const semester = req.body.semester;

  const ip =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const time = new Date().toISOString();

  try {
    await axios.post("https://script.google.com/macros/s/AKfycbxgZYxAlGxt4eOuGeshSzgQNPVxpIm-5ngbNX7NbVVnFrxMvLJOHNjlb_725kiVAc8O/exec", {
      regid,
      semester,
      ip,
      time,
    });

    const response = await axios.post(
      "https://www.swarnandhra.ac.in/campusattendance/admin2/view_attendance.php",
      new URLSearchParams({
        regid: regid,
        semester: semester,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.send(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("proxy error");
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("server running on port 3000");
  });
}

module.exports = app;
