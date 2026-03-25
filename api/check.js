import axios from "axios";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).send("Use POST");
    }

    // 🔥 Safe body parsing
    let body = req.body;

    // If body is a string (happens sometimes in Vercel)
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = Object.fromEntries(new URLSearchParams(body));
      }
    }

    const regid = body?.regid;
    const semester = body?.semester;

    if (!regid || !semester) {
      console.log("INVALID INPUT:", body);
      return res.status(400).send("Missing regid or semester");
    }

    const ip =
      req.headers["x-forwarded-for"] || req.socket?.remoteAddress;

    const time = new Date().toISOString();

    console.log("DATA:", { regid, semester, ip, time });

    // ✅ Google script
    await axios.post(
      "https://script.google.com/macros/s/AKfycbxgZYxAlGxt4eOuGeshSzgQNPVxpIm-5ngbNX7NbVVnFrxMvLJOHNjlb_725kiVAc8O/exec",
      { regid, semester, ip, time }
    );

    // ✅ Target request
    const response = await axios.post(
      "https://www.swarnandhra.ac.in/campusattendance/admin2/view_attendance.php",
      new URLSearchParams({ regid, semester }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 10000, // 🔥 prevents hanging crash
      }
    );

    return res.send(response.data);
  } catch (err) {
    console.error("FULL ERROR:", err);

    return res.status(500).json({
      error: "proxy failed",
      message: err.message,
    });
  }
}
