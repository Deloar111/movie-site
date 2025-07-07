const mongoose = require("mongoose");
const path = require("path");
const Movie = require("./models/Movie");
const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public")); // Optional for CSS

// Routes
app.get("/", async(req, res) => {
    try {
        const movies = await Movie.find();
        res.render("index", { movies });
    } catch (err) {
        console.error("❌ Failed to fetch movies:", err);
        res.send("Error loading movies");
    }
});

app.get("/add", (req, res) => {
    res.render("add");
});

app.post("/add", async(req, res) => {
    try {
        await Movie.create(req.body);
        res.redirect("/");
    } catch (err) {
        console.error("❌ Failed to add movie:", err);
        res.send("Error adding movie");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});