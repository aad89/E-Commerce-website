const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS setup (adjust for your actual front-end URL)
app.use(cors());

// Routes
const authRoutes = require("./src/users/user.route");
const productRoutes = require('./src/products/products.route');
const reviewRoutes = require('./src/reviews/reviews.route');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);

// Main function to connect to MongoDB and start the server
async function main() {
    try {
        // MongoDB connection
        await mongoose.connect(process.env.DB_URL);

        // On successful connection, start the server
        console.log("MongoDB successfully connected");

        // Start Express server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

    } catch (err) {
        console.error("MongoDB connection failed", err);
        process.exit(1);  // Exit the process if database connection fail 
    }
}

// Call the main function to connect to MongoDB and start the server
main();
