import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { connect, set } from "mongoose";
import dotenv from "dotenv";
import colors from "colors";

// Load models
import Bootcamp from "./models/Bootcamp.js";
import Course from "./models/Course.js";
import User from "./models/User.js";

const __fileURLToPatch = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileURLToPatch);
dotenv.config({ path: `${__dirname}/config/config.env` });

set("strictQuery", true);

connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Read JSON files
const bootcamps = JSON.parse(
	fs.readFileSync(`${__dirname}/resources/_data/bootcamps.json`, "utf-8")
);
const courses = JSON.parse(
	fs.readFileSync(`${__dirname}/resources/_data/courses.json`, "utf-8")
);

const users = JSON.parse(
	fs.readFileSync(`${__dirname}/resources/_data/users.json`, "utf-8")
);

const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		await Course.create(courses);
		await User.create(users);
		console.log("Data Imported".green.inverse);
		process.exit();
	} catch (error) {
		console.error(error);
	}
};

const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		await Course.deleteMany();
		await User.deleteMany();
		console.log("Data Destroyed".red.inverse);
		process.exit();
	} catch (error) {
		console.error(error);
	}
};

if (process.argv[2] === "-i") {
	importData();
} else if (process.argv[2] === "-d") {
	deleteData();
}
