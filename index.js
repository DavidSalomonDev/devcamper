"use-strict";

import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import express from "express";
import cookieParser from "cookie-parser";
import fileupload from "express-fileupload";
import morgan from "morgan";
import colors from "colors";
import { errorHandler } from "./middleware/error.js";
import { connectDB } from "./config/database.js";

// Route files
import { router as bootcamps } from "./routes/bootcamps.js";
import { router as courses } from "./routes/courses.js";
import { router as auth } from "./routes/auth.js";
import fileUpload from "express-fileupload";

const app = express();

// Body Parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Load env vars
const __fileURLToPatch = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileURLToPatch);
dotenv.config({ path: `${__dirname}/config/config.env` });

// Connect to database
connectDB();

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// File uploading
app.use(fileUpload());

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

const PORT = process.env.PORT || 5000;

// Error handler
app.use(errorHandler);

const server = app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
	)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (error, promise) => {
	console.log(`Error: ${error.message}`.red);
	server.close(() => process.exit(1));
});
