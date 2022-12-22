import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { connect, set } from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import Bootcamp from "./models/Bootcamp.js";

const __fileURLToPatch = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileURLToPatch);
dotenv.config({ path: `${__dirname}/config/config.env` });

set("strictQuery", true);

connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const bootcamps = JSON.parse(
	fs.readFileSync(`${__dirname}/resources/_data/bootcamps.json`, "utf-8")
);

const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		console.log("Data Imported".green.inverse);
		process.exit();
	} catch (error) {
		console.error(error);
	}
};

const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
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
