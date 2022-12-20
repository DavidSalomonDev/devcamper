import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import colors from "colors";
import { connectDB } from "./config/database.js";
// Route files
import { router as bootcamps } from "./routes/bootcamps.js";

const app = express();

// Body Parser
app.use(express.json());

// Load env vars
config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;

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
