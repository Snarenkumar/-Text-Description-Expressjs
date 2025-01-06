import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: './.env.local' });

// Import Google Generative AI module
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Express app
const app = express();
const port = 3010;

// Access API key from .env.local
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.error("API_KEY is not defined. Check your .env.local file.");
    process.exit(1);
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(apiKey);

// Utility function to format AI response
const formatAIResponse = (responseText) => {
    const structuredResponse = responseText
        .split("\n") // Split by lines
        .map((line) => line.trim()) // Remove extra spaces
        .filter((line) => line.length > 0); // Remove empty lines

    return structuredResponse.join("<br>"); // Convert to HTML with line breaks
};

// Function to use Generative AI
const generateAIContent = async (prompt) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const formattedResponse = formatAIResponse(result.response.text());
        return formattedResponse;
    } catch (error) {
        console.error("Error generating AI content:", error.message);
        return "Error generating AI response.";
    }
};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Template engine setup
app.set("view engine", "ejs");
app.set("views", "./views");

// Routes
app.post("/submit", async (req, res) => {
    const { prompt, format } = req.body;

    if (!prompt || prompt.trim().length < 10) {
        return res.status(400).send("Prompt must be at least 10 characters long.");
    }

    const aiResponse = await generateAIContent(prompt);

    // Format response based on user preference
    if (format === "json") {
        res.json({ prompt, response: aiResponse });
    } else if (format === "html") {
        res.send(`<div>${aiResponse}</div>`);
    } else {
        res.send(aiResponse); // Default to plain text
    }
});

app.get("/", (req, res) => {
    res.render("index.ejs");
});

// Start server
app.listen(port, () => {
    console.log(`Server is hosted on port: ${port}`);
});
