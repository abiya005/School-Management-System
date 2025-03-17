const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Routes = require("./routes/route.js");

dotenv.config(); // Load environment variables at the beginning

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(cors());

// Debugging: Check if MONGO_URI is loaded correctly
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not defined. Check your .env file.");
    process.exit(1); // Exit if MONGO_URI is missing
}

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ NOT CONNECTED TO NETWORK", err));

app.use("/", Routes);

app.listen(PORT, () => {
    console.log(`🚀 Server started at port no. ${PORT}`);
});
