import "dotenv/config";
import express, { Request, Response } from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import createHtttpError, { isHttpError } from "http-errors";
import userRoutes from "./routes/user";
import productRoutes from "./routes/products";
import packageRoutes from "./routes/package";
import orderRoutes from "./routes/order";
import MongooseStore from "connect-mongo";
import session from "express-session";
import env from "./utils/validateEnv";
import { requireAuth } from "./middleware/requireAuth";
import cors from "cors";




const  app = express();

// enabling cors for all routes
app.use(cors());

// Content-Type: application/json handling
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// creating user session using mongo-connect
// NB: change this in the future to auth0
app.use(session({
    secret: env.SESSION_SECRETY_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1500 },
    rolling: true,
    store: MongooseStore.create({ mongoUrl: env.MONGO_CONNECTION_STRING })
}));

// using morgan to log http requests into the console
app.use(morgan("dev"));



// products endpoint
app.use("/api/v1/products", productRoutes);

// user endpoint
app.use("/api/v1/users", userRoutes);

// package endpoint
app.use("/api/v1/packages", requireAuth, packageRoutes);

// order endpoint
app.use("/api/v1/orders", requireAuth, orderRoutes);

// middleware to handle an endpoint not found
app.use((req, res, next) => {
    next(createHtttpError(404, "Endpoint not found"));
});

// middleware to handle errors
app.use((error: unknown, req: Request, res: Response) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage=error.message;
    }
    res.status(statusCode).json({  error: errorMessage });
    
});

export default app;