import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middleware/async.js";
import Bootcamp from "../models/Bootcamp.js";
import geocoder from "../utils/geocoder.js";

// @description         Get all bootcamps
// @route               GET /api/v1/bootcamps
// @access              Public
export const getBootcamps = asyncHandler(async (req, res, next) => {
	let query;

	let queryStr = JSON.stringify(req.query);

	// Using $ as the MongoDB syntax for queries
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	query = Bootcamp.find(JSON.parse(queryStr));

	const bootcamps = await query;

	res.status(200).json({
		success: "true",
		message: "Show all bootcamps",
		count: bootcamps.length,
		data: bootcamps,
	});
});

// @description         Get a single bootcamp
// @route               GET /api/v1/bootcamps/:id
// @access              Public
export const getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Resource not found with id of ${req.params.id}`,
				404
			)
		);
	}

	res.status(200).json({
		success: "true",
		message: `Show bootcamp ${req.params.id}`,
		data: bootcamp,
	});
});

// @description         Create a bootcamp
// @route               POST /api/v1/bootcamps/:id
// @access              Private
export const createBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body);
	res.status(201).json({
		success: "true",
		message: "Create new bootcamp",
		data: bootcamp,
	});
});

// @description         Update a bootcamp
// @route               PUT /api/v1/bootcamps/:id
// @access              Private
export const updateBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Resource not found with id of ${req.params.id}`,
				404
			)
		);
	}
	res.status(200).json({
		success: "true",
		message: `Update bootcamp ${req.params.id}`,
		data: bootcamp,
	});
});

// @description         Delete bootcamp
// @route               DELETE /api/v1/bootcamps/:id
// @access              Private
export const deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Resource not found with id of ${req.params.id}`,
				404
			)
		);
	}
	res.status(200).json({
		success: "true",
		message: `Delete bootcamp ${req.params.id}`,
		data: {},
	});
});

// @description         Get bootcamps within a radius
// @route               GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access              Public
export const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	// Get lat/lng from geocoder
	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	// Cal radius using radians
	// Dive distance by radius of Earth: 6378 km
	const radius = distance / 6378;

	const bootcamps = await Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	});
});
