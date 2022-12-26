import * as path from "path";
import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middleware/async.js";
import Bootcamp from "../models/Bootcamp.js";
import geocoder from "../utils/geocoder.js";

// @description         Get all bootcamps
// @route               GET /api/v1/bootcamps
// @access              Public
export const getBootcamps = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

// @description         Get a single bootcamp
// @route               GET /api/v1/bootcamps/:id
// @access              Public
export const getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id).populate("courses");

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
	// Add user to req.body
	req.body.user = req.user.id;

	// Check for published bootcamp
	const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

	// If the user is not an admin, they can only add one bootcamp
	if (publishedBootcamp && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`The user with ID ${req.user.id} has already published a bootcamp`,
				400
			)
		);
	}

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
	let bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Resource not found with id of ${req.params.id}`,
				404
			)
		);
	}

	// Make sure user is the owner
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User ${req.params.id} is not authorized to update this bootcamp`,
				401
			)
		);
	}

	bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

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
	const bootcamp = await Bootcamp.findById(req.params.id);
	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Resource not found with id of ${req.params.id}`,
				404
			)
		);
	}

	// Make sure user is the owner
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User ${req.params.id} is not authorized to update this bootcamp`
			)
		);
	}

	// This will work when a bootcamp is deleted, courses associated with the bootcamp will cascade delete.

	bootcamp.delete();

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

// @description         Upload photo for bootcamp
// @route               POST /api/v1/bootcamps/:id/photo
// @access              Private
export const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
	let bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Resource not found with id of ${req.params.id}`,
				404
			)
		);
	}

	// Make sure user is the owner
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorized to update this bootcamp`,
				401
			)
		);
	}

	if (!req.files) {
		return next(new ErrorResponse(`Please upload a file`, 400));
	}

	const file = req.files.file;

	// Make sure the image is a photo
	if (!file.mimetype.startsWith("image")) {
		return next(new ErrorResponse(`Please upload an image file`, 400));
	}

	// Check filesize
	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(
			new ErrorResponse(
				`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
				400
			)
		);
	}

	// Create custom filename
	file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.error(err);
			return next(new ErrorResponse(`Problem with file upload`, 500));
		}

		await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

		res.status(200).json({
			success: true,
			data: file.name,
		});
	});
});
