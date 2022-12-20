import express from "express";
import { config } from "dotenv";
import morgan from "morgan";

// Route files
import { router as bootcamps } from "./routes/bootcamps.js";

// Load env vars
config({ path: "./config/config.env" });

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
