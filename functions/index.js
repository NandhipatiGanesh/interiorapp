// require("dotenv").config();
// const functions = require("firebase-functions");
// const fetch = require("node-fetch");

// exports.sendCompletionEmail = functions.https.onCall(async (data, context) => {
//   const { name, email, projectName } = data;

//   try {
//     const res = await fetch("https://api.resend.com/emails", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, // from .env
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         from: "no-reply@noreply.capitalflasher.com", // verified domain
//         to: [email], // send only to user
//         subject: `Project Completed: ${projectName}`,
//         html: `
//           <h2>Project Completed</h2>
//           <p><b>Name:</b> ${name}</p>
//           <p><b>Email:</b> ${email}</p>
//           <p><b>Project:</b> ${projectName}</p>
//         `
//       })
//     });

//     const result = await res.json();
//     return { success: true, result };
//   } catch (err) {
//     console.error("Email send failed:", err);
//     return { success: false, error: err.message };
//   }
// });
