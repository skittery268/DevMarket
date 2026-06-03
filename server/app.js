// Injected envairoment variabels in env section
require("dotenv").config();

// Modules
const express = require("express");
const passport = require("passport");

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
require("./configs/passport.config");

// Routers
const authRouter = require("./routers/auth.router");
const categoryRouter = require("./routers/category.router");
const productRouter = require("./routers/product.router");

// ---------------------------------------IMPORTS---------------------------------------

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(passport.initialize());

// Security
app.use(mongoSanitizeMiddleware);
app.use(hpp());
app.use(helmet());

// Global rate limiter
app.use(globalLimiter);

// Controllers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);

// Global Error handler
app.use(globalErrorHandler);

// Running server for listen requests and connect to database 
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);

    connectDB();
});