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

// Utility function to convert markdown to HTML
const markdownToHTML = (text) => {
    // Replace **bold** with <strong>bold</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    
    // Replace *italic* with <em>italic</em>
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
    
    // Replace new lines with <br> for line breaks
    text = text.replace(/\n/g, "<br>");
    
    // You can add more replacements here for other markdown formatting
    
    return text;
};

// Function to use Generative AI
const generateAIContent = async (prompt) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const formattedResponse = markdownToHTML(result.response.text());
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
        return res.json({ prompt, response: aiResponse });
    } else if (format === "html") {
        return res.send(`<div>${aiResponse}</div>`);
    } else {
        return res.send(aiResponse); // Default to plain text
    }
});

app.get("/", (req, res) => {
    res.render("index.ejs");
});

// Start server
app.listen(port, () => {
    console.log(`Server is hosted on port: ${port}`);
});
