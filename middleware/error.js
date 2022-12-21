import { ErrorResponse } from "../utils/errorResponse.js";

export const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;
	// Log to console for dev
	console.log(err);

	// Mongoose bad Object ID
	if (err.name === "CastError") {
		const message = `Resourse cannot be found with id of ${error.value}`;
		error = new ErrorResponse(message, 404);
	}

	// Mongoose duplicate key
	if (err.code === 11000) {
		const message = `Duplicate field value entered in ${Object.keys(
			err.keyValue
		)}`;
		error = new ErrorResponse(message, 400);
	}

	// Mongoose validation error
	if (err.name === "ValidationError") {
		const message = Object.values(err.errors).map((value) => value.message);
		error = new ErrorResponse(message, 400);
	}
	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || "Server error...",
	});
};
