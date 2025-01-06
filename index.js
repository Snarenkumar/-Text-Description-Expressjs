import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({ path: './.env.local' });

const apiKey = process.env.API_KEY; // Access API key from .env


const app = express();
const port = 3010;

// Example password for hashing
// const pass = "hello_@1234";

// Function to hash a value
// const createHash = async (value) => {
//     try {
//         const hash = await bcrypt.hash(value, 10); // Use 10 salt rounds
//         console.log(`Hashed Value: ${hash}`);
//     } catch (err) {
//         console.error("Error hashing value:", err);
//     }
// };

// Example usage
// createHash(pass);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Template engine setup
app.set("view engine", "ejs");
app.set("views", "./views");

// Routes
app.post("/submit", (req, res) => {
    const data = req.body;
    console.log(data);
    res.send("Sent successfully");
});

app.get("/", (req, res) => {
    res.render("index.ejs");
});

// Start server
app.listen(port, () => {
    console.log(`Server is hosted on port: ${port}`);
});
