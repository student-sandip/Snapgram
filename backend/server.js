const express = require("express");
const OpenAI = require("openai");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config(); // Load .env file

const app = express();
const port = 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure API Key is in .env
});

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Home Route
app.get("/", (req, res) => {
  res.render("index");
});

// API Route to handle user input
app.post("/ask", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
      max_tokens: 100,
    });

    const aiReply = response.choices[0].message.content;
    res.json({ reply: aiReply });

  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to process request." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
