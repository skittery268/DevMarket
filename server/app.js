// Injected envairoment variabels in process.env section
require("dotenv").config();

// Modules
const express = require("express");
const passport = require("passport");
const http = require("http");
const { Server } = require("socket.io");

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
const activateSocket = require("./configs/socket.config");
require("./configs/passport.config");

// Routers
const authRouter = require("./routers/auth.router");
const categoryRouter = require("./routers/category.router");
const productRouter = require("./routers/product.router");
const searchRouter = require("./routers/search.router");
const chatRouter = require("./routers/chat.router");
const messageRouter = require("./routers/message.router");
const userRouter = require("./routers/user.router");
const paymentRouter = require("./routers/payment.router");

// ---------------------------------------IMPORTS---------------------------------------

// Servers
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
});

app.use('/api/v1/payment/webhook', express.raw({ type: "application/json" }));

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(passport.initialize());
app.use((req, res, next) => {
    req.io = io;
    next();
});

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
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/payment", paymentRouter);

// Global Error handler
app.use(globalErrorHandler);

// Socket io
activateSocket(io);

// Running server for listen requests and connect to database 
server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}!`);

    connectDB();
});