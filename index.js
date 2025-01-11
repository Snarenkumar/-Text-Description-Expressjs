import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// LoDSFad environSG`meSADnt varSDFiabJsdaHledsfs
dotenv.config({ path: './.env.local' });
const time = 180 ;
// Import Google GenerDSFSDative AI moWEFdsdfule
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

// Function to return cleaned response
const cleanResponse = (responseText) => {
    return responseText
        .replace(/\*\*|\*/g, "") // Remove markdown stars
        .replace(/^[0-9]+\.?\s*/gm, "") // Remove numbered lists
        .replace(/[!]+/g, ".") // Replace exclamation marks with periods
        .trim();
};

// Function to generate voiceover content
const generateVoiceoverContent = async (prompt) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const refinedPrompt = `Elaborate on the topic:"${prompt}" in a detailed and structured way and with a simple language and simple words, ensuring clarity and precision without conversational or unnecessary elements. Avoid numbered lists and excessive punctuation for almost ${time} seconds. Please write me a YouTube video script as if you were a copyright expert for YouTube and Instagram, but don't mention anything about that in the content. Just provide the raw script.`;

        const result = await model.generateContent(refinedPrompt);

        const rawResponse = result.response.text();
        return cleanResponse(rawResponse);
    } catch (error) {
        console.error("Error generating AI content:", error.message);
        return "Error generating AI response.";
    }
};

// Function to generate image prompts
const generateImagePrompts = (topic) => {
    const imagePrompts = [];
    for (let i = 1; i <= 12; i++) {
        imagePrompts.push(
            `Create an image visualization for the following section of the topic: "${topic}". This is image ${i} of a continuous series, designed to sync with the explanation .`
        );
    }
    return imagePrompts;
};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Template engine setup
app.set("view engine", "ejs");
app.set("views", "./views");

// Routes
app.post("/submit", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length < 10) {
        return res.status(400).send("Prompt must be at least 10 characters long.");
    }

    // Generate voiceover content
    const voiceoverResponse = await generateVoiceoverContent(prompt);

    // Generate image prompts
    const imagePrompts = generateImagePrompts(prompt);

    // Return response
    return res.json({
        voiceoverResponse,
        imagePrompts
    });
});

app.get("/", (req, res) => {
    res.render("index.ejs");
});

// Start server 
app.listen(port, () => {
    console.log(`Server is hosted on port: ${port}`);
});