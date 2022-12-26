import mongoose from "mongoose";

export const connectDB = async () => {
	mongoose.set("strictQuery", false);
	const conn = await mongoose.connect(process.env.MONGO_URI, {
		useNewURLParser: true,
		useUnifiedTopology: true,
	});
	console.log(
		`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
	);
};
