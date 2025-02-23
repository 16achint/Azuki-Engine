import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// import express from "express";
// import { exec } from "child_process";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import cors from "cors";
// import dotenv from "dotenv";
// // import rateLimit from "express-rate-limit";

// dotenv.config();

// const app = express();
// const port = 3000;
// const apiKey = process.env.GEMINI_API_KEY;
// const authKey = process.env.API_KEY; // Custom API key for authentication
// const systemUser = process.env.SYSTEM_USER || "sandbox_user"; // Default user

// // Debugging Logs
// console.log("🔹 API Key Loaded:", authKey ? "✅ Loaded" : "❌ Missing");
// console.log("🔹 Gemini API Key:", apiKey ? "✅ Loaded" : "❌ Missing");

// if (!authKey || !apiKey) {
//   console.error("❌ Missing required API keys! Please check your .env file.");
//   process.exit(1); // Exit if keys are missing
// }

// const API_KEYS = new Set([authKey]);

// const genAI = new GoogleGenerativeAI(apiKey);
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

// // Allowed commands and argument validation
// const allowedCommands = {
//   ls: [],
//   pwd: [],
//   whoami: [],
//   echo: [".*"],
//   cat: ["^[a-zA-Z0-9_.-/]+$"],
//   date: [],
//   uptime: [],
//   df: [],
//   top: [],
//   ps: [],
//   mkdir: ["^[a-zA-Z0-9_./~-]+$"],
//   touch: ["^[a-zA-Z0-9_.-]+$"],
// };

// // Rate Limiting (5 requests per minute)
// // const limiter = rateLimit({
// //   windowMs: 60 * 1000,
// //   max: 5,
// //   message: { error: "Too many requests, please try again later." },
// // });

// async function getCommand(input) {
//   const chatSession = model.startChat({ generationConfig, history: [] });

//   const result = await chatSession.sendMessage(
//     `Convert the following natural language instruction into a macOS terminal command, but return only the command without any formatting, code blocks, or explanations: "${input}"`
//   );

//   return result.response.text().trim();
// }

// app.use(express.json());
// app.use(cors());
// // app.use(limiter);

// // ✅ Middleware for API key authentication
// app.use((req, res, next) => {
//   const providedKey = req.headers["x-api-key"];
//   if (!providedKey || !API_KEYS.has(providedKey)) {
//     return res.status(403).json({ error: "❌ Unauthorized API key." });
//   }
//   next();
// });

// // ✅ Route to get command from AI
// app.post("/execute", async (req, res) => {
//   console.log("📥 Received input:", req.body);

//   const userInput = req.body.command;
//   if (!userInput) {
//     return res.status(400).json({ error: "❌ No command provided." });
//   }

//   try {
//     const systemCommand = await getCommand(userInput);
//     console.log("⚡ Generated Command:", systemCommand);

//     const [command, ...args] = systemCommand.split(" ");
//     if (
//       !allowedCommands[command] ||
//       !args.every((arg) =>
//         allowedCommands[command].some((regex) => new RegExp(regex).test(arg))
//       )
//     ) {
//       return res
//         .status(403)
//         .json({ error: "❌ Unauthorized command or arguments." });
//     }

//     // Confirm execution
//     return res.json({
//       confirmation: `✅ Execute: ${systemCommand}?`,
//       command: systemCommand,
//     });
//   } catch (err) {
//     res.status(500).json({ error: "❌ Failed to generate command" });
//   }
// });

// // ✅ Route to execute confirmed command
// app.post("/confirm", async (req, res) => {
//   const { command } = req.body;
//   if (!command) {
//     return res.status(400).json({ error: "❌ No command provided." });
//   }

//   exec(
//     `sudo -u ${systemUser} zsh -c '${command}'`,
//     { timeout: 5000 },
//     (error, stdout, stderr) => {
//       if (error) return res.status(500).json({ error: error.message });
//       if (stderr) return res.json({ output: stderr });
//       res.json({ output: stdout });
//     }
//   );
// });

// app.listen(port, () =>
//   console.log(`🚀 Server running on http://localhost:${port}`)
// );
