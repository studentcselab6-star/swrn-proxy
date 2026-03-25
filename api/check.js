import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.send("<h1>You can't open this API directly</h1>");
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    // Handle both JSON and form-data
    const regid = req.body?.regid || req.query?.regid;
    const semester = req.body?.semester || req.query?.semester;

    if (!regid || !semester) {
      return res.status(400).send("Missing regid or semester");
    }

    const ip =
      req.headers["x-forwarded-for"] || req.socket?.remoteAddress;

    const time = new Date().toISOString();

    // Log to Google Script
    await axios.post(
      "https://script.google.com/macros/s/AKfycbxgZYxAlGxt4eOuGeshSzgQNPVxpIm-5ngbNX7NbVVnFrxMvLJOHNjlb_725kiVAc8O/exec",
      {
        regid,
        semester,
        ip,
        time,
      }
    );

    // Fetch attendance
    const response = await axios.post(
      "https://www.swarnandhra.ac.in/campusattendance/admin2/view_attendance.php",
      new URLSearchParams({
        regid,
        semester,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return res.send(response.data);
  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).send("proxy error");
  }
}
