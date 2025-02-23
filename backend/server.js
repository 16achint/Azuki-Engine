// import express from "express";
// import { exec } from "child_process";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import cors from "cors";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// const port = 3000;

// const apiKey = process.env.GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//   model: "gemini-2.0-flash",
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

// async function getCommand(input) {
//   const chatSession = model.startChat({
//     generationConfig,
//     history: [],
//   });

//   const result = await chatSession.sendMessage(
//     // `Convert the following natural language instruction into a macOS terminal command: "${input}"`
//     `Convert the following natural language instruction into a macOS terminal command, but return only the command without any formatting, code blocks, or explanations: "${input}`
//   );

//   return result.response.text().trim();
// }

// app.use(express.json());
// app.use(cors());

// app.post("/execute", async (req, res) => {
//   console.log("req.body", req.body);
//   console.log("helo");
//   const userInput = req.body.command;
//   try {
//     const systemCommand = await getCommand(userInput);
//     console.log("systemCommand", systemCommand);
//     console.log("Generated Command:", systemCommand);

//     exec(`zsh -c '${systemCommand}'`, (error, stdout, stderr) => {
//       if (error) return res.status(500).json({ error: error.message });
//       if (stderr) return res.json({ output: stderr });
//       res.json({ output: stdout });
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to generate command" });
//   }
// });

// app.listen(port, () =>
//   console.log(`Server running on http://localhost:${port}`)
// );

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
//   open: [".*"],
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
// // app.post("/confirm", async (req, res) => {
// //   const { command } = req.body;
// //   if (!command) {
// //     return res.status(400).json({ error: "❌ No command provided." });
// //   }

// //   console.log("final command =>", `sudo -u ${systemUser} zsh -c '${command}'`);

// //   exec(
// //     `sudo -u ${systemUser} '${command}'`,
// //     { timeout: 5000 },
// //     (error, stdout, stderr) => {
// //       if (error) return res.status(500).json({ error: error.message });
// //       if (stderr) return res.json({ output: stderr });
// //       res.json({ output: stdout });
// //     }
// //   );
// //   // console.log("final command", `sudo -u ${systemUser} zsh -c '${command}'`);
// // });

// app.post("/confirm", async (req, res) => {
//   const { command } = req.body;
//   if (!command) {
//     return res.status(400).json({ error: "❌ No command provided." });
//   }

//   console.log("final command =>", command);

//   // If command is GUI-related, remove "sudo -u"
//   const isGuiCommand = command.startsWith("open ");
//   const finalCommand = isGuiCommand
//     ? `zsh -c '${command}'` // Run normally
//     : `sudo -u ${systemUser} zsh -c '${command}'`; // Run as specific user

//   exec(finalCommand, { timeout: 5000 }, (error, stdout, stderr) => {
//     if (error) return res.status(500).json({ error: error.message });
//     if (stderr) return res.json({ output: stderr });
//     res.json({ output: stdout || "✅ Command executed!" });
//   });
// });

// app.listen(port, () =>
//   console.log(`🚀 Server running on http://localhost:${port}`)
// );

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
//   open: [".*"], // Allow GUI commands
//   cmatrix: [".*"],
//   code: [".*"],
//   // && : [".*"],
// };

// // Function to generate terminal commands from natural language
// async function getCommand(input) {
//   const chatSession = model.startChat({ generationConfig, history: [] });

//   const result = await chatSession.sendMessage(
//     `Convert the following natural language instruction into a macOS terminal command, if asking for show any matrix in case run open -a Terminal "which cmatrix" which cmatrix should be in backtick. but return only the command without any formatting, code blocks, or explanations: "${input}" also never use osascript`
//   );

//   return result.response.text().trim();
// }

// app.use(express.json());
// app.use(cors());

// // ✅ Middleware for API key authentication
// app.use((req, res, next) => {
//   const providedKey = req.headers["x-api-key"];
//   if (!providedKey || !API_KEYS.has(providedKey)) {
//     return res.status(403).json({ error: "❌ Unauthorized API key." });
//   }
//   next();
// });

// // ✅ Route to generate and return the command
// app.post("/execute", async (req, res) => {
//   console.log("📥 Received input:", req.body);

//   const userInput = req.body.command;
//   if (!userInput) {
//     return res.status(400).json({ error: "❌ No command provided." });
//   }

//   try {
//     const systemCommand = await getCommand(userInput);
//     console.log("⚡ Generated Command:", systemCommand);

//     // const [command, ...args] = systemCommand.split(" ");
//     console.log("point 1");
//     // if (
//     //   !allowedCommands[command] ||
//     //   !args.every((arg) =>
//     //     allowedCommands[command].some((regex) => new RegExp(regex).test(arg))
//     //   )
//     // ) {
//     //   return res
//     //     .status(403)
//     //     .json({ error: "❌ Unauthorized command or arguments." });
//     // }

//     // if (!allowedCommands[command]) {
//     //   return res.status(403).json({ error: "❌ Unauthorized command." });
//     // }

//     return res.json({
//       confirmation: `✅ Execute: ${systemCommand}?`,
//       command: systemCommand,
//     });
//   } catch (err) {
//     res.status(500).json({ error: "❌ Failed to generate command" });
//   }
// });

// // ✅ Route to execute the confirmed command
// app.post("/confirm", async (req, res) => {
//   const { command } = req.body;
//   if (!command) {
//     return res.status(400).json({ error: "❌ No command provided." });
//   }

//   console.log("🛠 Final Command:", command);

//   // Check if it's a GUI command (e.g., "open -a Safari")
//   const isGuiCommand = command.startsWith("open ");

//   // const finalCommand = isGuiCommand// ? `osascript -e 'do shell script "${command}"'` // Run GUI apps properly
//   const finalCommand = `sudo -u ${systemUser} zsh -c '${command}'`; // Run regular terminal commands
//   console.log("🚀 Executing:", finalCommand);

//   exec(finalCommand, { timeout: 5000 }, (error, stdout, stderr) => {
//     if (error) return res.status(500).json({ error: error.message });
//     if (stderr) return res.json({ output: stderr });
//     res.json({ output: stdout || "✅ Command executed!" });
//   });
// });

// app.listen(port, () =>
//   console.log(`🚀 Server running on http://localhost:${port}`)
// );

import express from "express";
import { exec } from "child_process";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// 🔒 Allowed Commands Whitelist (Modify as needed)
const ALLOWED_COMMANDS = [
  "ls",
  "pwd",
  "echo",
  "whoami",
  "cat",
  "touch",
  "mkdir",
  "date",
  "uptime",
  "open",
  "mv",
  "df",
  "top",
  "ps",
  "find",
];

// 🔍 Function to Check if Command is Safe
function isCommandSafe(command) {
  return (
    ALLOWED_COMMANDS.some((cmd) => command.startsWith(cmd)) &&
    !/(rm -rf|sudo|kill|shutdown|osascript|curl|wget|chmod|chown|dd|nohup)/i.test(
      command
    )
  );
}

// 🧠 Function to Get Safe macOS Command from AI
async function getCommand(input) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const prompt = `Convert the following natural language instruction into a valid and safe macOS terminal command.
  Return only the command, with no explanations, code blocks, or markdown formatting also when i mention any application or browser make sure it inculde in the command. if asking for show any matrix in case run open -a Terminal "which cmatrix" which cmatrix should be in backtick.
  if i say open any application make sure to include open -a "Application Name" in the command.
  If asked to write an email \`echo "email body" | mail -s "subject" recipient@example.com\
  Do NOT include any destructive commands (e.g., rm, shutdown, sudo, kill, osascript, curl, wget, chmod, chown, dd, nohup).
  Ensure the command does not modify system settings or execute scripts: "${input}" never run command with osascript`;

  // const prompt = `Convert the following natural language instruction into a valid and safe macOS terminal command.
  // Return only the command, with no explanations, code blocks, or markdown formatting.
  // Ensure that any mentioned application or browser is explicitly included in the command.
  // If the instruction involves displaying a matrix, use \`open -a Terminal \\\`which cmatrix\\\`\`.
  // If asked to write an email, use the \`mail\` command in the format: make sure to open mail application using open -a Mail before running the command
  //   \`echo "email body" | mail -s "subject" recipient@example.com\`.  do not open calculator or any other application.
  // Do NOT include any destructive commands (e.g., rm, shutdown, sudo, kill, osascript, curl, wget, chmod, chown, dd, nohup).
  // Ensure the command does not modify system settings or execute scripts: "\${input}".
  // Never use osascript in the command.`;

  const result = await chatSession.sendMessage(prompt);
  return result.response.text().trim();
}

app.use(express.json());
app.use(cors());

app.post("/execute", async (req, res) => {
  console.log("Received Request:", req.body);

  const userInput = req.body.command;
  try {
    const systemCommand = await getCommand(userInput);
    console.log("Generated Command:", systemCommand);

    if (!isCommandSafe(systemCommand)) {
      return res
        .status(400)
        .json({ error: "Unauthorized or unsafe command detected" });
    }

    exec(`zsh -c '${systemCommand}'`, (error, stdout, stderr) => {
      if (error) return res.status(500).json({ error: error.message });
      if (stderr) return res.json({ output: stderr });
      res.json({ output: stdout });
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate command" });
  }
});

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
