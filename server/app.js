// Injected envairoment variabels in env section
require("dotenv").config();

// Modules
const express = require("express");

// Security
const cookieParser = require("cookie-parser");
const cors = require("cors");
const hpp = require("hpp");
const helmet = require("helmet");
const globalLimiter = require("./middlewares/ratelimiters/global.limiter");
const mongoSanitizeMiddleware = require("./middlewares/security.middleware");

// Controllers
const globalErrorHandler = require("./controllers/error.controller");

// Configs
const connectDB = require("./configs/mongo.config");

// Routers
const authRouter = require("./routers/auth.router");
const categoryRouter = require("./routers/category.router");

// -----------------------------IMPORTS---------------------------------------

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

// Security
app.use(mongoSanitizeMiddleware);
app.use(hpp());
app.use(helmet());

// Global rate limiter
app.use(globalLimiter);

// Controllers
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);

// Global Error handler
app.use(globalErrorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);

    connectDB();
});