import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { connect, set } from "mongoose";
import colors from "colors";
import Bootcamp from "./models/Bootcamp.js";

set("strictQuery", true);

connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const bootcamps = JSON.parse(
	fs.readFileSync(
		`${dirname(
			fileURLToPath(import.meta.url)
		)}/resources/_data/bootcamps.json`,
		"utf-8"
	)
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
		await Bootcamp.deleteMany(bootcamps);
		console.log("Data Destroyed".green.inverse);
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
