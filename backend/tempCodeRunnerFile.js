const express = require("express");
const { exec } = require("child_process");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "../public")));

// Parse incoming JSON
app.use(bodyParser.json());

// Endpoint to handle autocomplete search
app.post("/autocomplete", (req, res) => {
    const query = req.body.query;
    if (!query) return res.json([]);

    // Call compiled C++ Trie executable with query
    exec(`./backend/trie ${query}`, (err, stdout, stderr) => {
        if (err) {
            console.error("C++ Error:", err.message);
            return res.status(500).json([]);
        }

        // Split stdout into lines and remove empty ones
        const suggestions = stdout.split("\n").filter(Boolean);
        res.json(suggestions);
    });
});

// Fallback route to serve index.html on unknown routes (for SPAs)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
