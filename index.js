import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
let dotenv = require('dotenv').config()
const app = express();
const port = 3010;
const pass = dotenv;

const createHash = async () => {
    const hash = await bcrypt.hash(pass, 10); // Use 10 salt rounds
    console.log(hash);
};
createHash();

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
