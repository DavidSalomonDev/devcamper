import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middleware/async.js";
import Course from "../models/Course.js";
import Bootcamp from "../models/Bootcamp.js";

// @desc    Get courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
export const getCourses = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampId) {
		const courses = await Course.find({ bootcamp: req.params.bootcampId });
		return res
			.status(200)
			.json({ succes: true, count: courses.length, data: courses });
	} else {
		// Relation with the Bootcamp model
		res.status(200).json(res.advancedResults);
	}

	const courses = await query;

	res.status(200).json({
		success: true,
		count: courses.length,
		data: courses,
	});
});

// @desc    Get a single course
// @route   GET /api/v1/courses/:id
// @access  Public
export const getCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id).populate({
		path: "bootcamp",
		select: "name description",
	});

	if (!course) {
		return next(
			new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({
		success: true,
		data: course,
	});
});

// @desc    Add a course
// @route   POST /api/v1/courses/
// @access  Private
export const addCourse = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;

	req.body.user = req.user.id;

	const bootcamp = await Bootcamp.findById(req.params.bootcampId).populate({
		path: "bootcamp",
		select: "name description",
	});

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`No course with the id of ${req.params.bootcampId}`,
				404
			)
		);
	}

	// Make sure user is the owner
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorized to add a course to the ${bootcamp._id}`,
				401
			)
		);
	}

	const course = await Course.create(req.body);

	res.status(201).json({
		success: true,
		data: course,
	});
});

// @desc    Update a course
// @route   PUT /api/v1/courses/:id
// @access  Private
export const updateCourse = asyncHandler(async (req, res, next) => {
	let course = await Course.findById(req.params.id);

	if (!course) {
		return next(
			new ErrorResponse(
				`No course with the id of ${req.params.bootcampId}`,
				404
			)
		);
	}

	// Make sure user is the owner
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorized to update a course to the ${bootcamp._id}`,
				401
			)
		);
	}

	course = await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(201).json({
		success: true,
		data: course,
	});
});

// @desc    Delete a course
// @route   DELETE /api/v1/courses/:id
// @access  Private
export const deleteCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id);

	if (!course) {
		return next(
			new ErrorResponse(
				`No course with the id of ${req.params.bootcampId}`,
				404
			)
		);
	}

	// Make sure user is the owner
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorized to delete a course to the ${bootcamp._id}`,
				401
			)
		);
	}

	await course.remove();

	res.status(201).json({
		success: true,
		data: {},
	});
});
