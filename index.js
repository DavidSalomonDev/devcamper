import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import express from "express";
import morgan from "morgan";
import colors from "colors";
import { errorHandler } from "./middleware/error.js";
import { connectDB } from "./config/database.js";

// Route files
import { router as bootcamps } from "./routes/bootcamps.js";
import { router as courses } from "./routes/courses.js";

const app = express();

// Body Parser
app.use(express.json());

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

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

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
