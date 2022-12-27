"use-strict";

import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import colors from "colors";
import { errorHandler } from "./middleware/error.js";
import { connectDB } from "./config/database.js";

// Route files
import { router as bootcamps } from "./routes/bootcamps.js";
import { router as courses } from "./routes/courses.js";
import { router as auth } from "./routes/auth.js";
import { router as users } from "./routes/users.js";
import { router as reviews } from "./routes/reviews.js";

// Security modules
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";

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

// Sanitize request
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent X Site Scripting attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 100 });
app.use(limiter);

// Prevent http param solution
app.use(hpp());

// Enable CORS
app.use(cors());

app.get("/", (_, res) => {
	res.sendFile(`${__dirname}/public/index.html`);
});

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

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
