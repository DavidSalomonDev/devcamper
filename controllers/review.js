import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middleware/async.js";
import Review from "../models/Review.js";
import Bootcamp from "../models/Bootcamp.js";

// @desc    Get reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
export const getReviews = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampId) {
		const reviews = await Review.find({ bootcamp: req.params.bootcampId });
		return res
			.status(200)
			.json({ succes: true, count: reviews.length, data: reviews });
	} else {
		// Relation with the Bootcamp model
		res.status(200).json(res.advancedResults);
	}
});

// @desc    Get a single review
// @route   GET /api/v1/reviews/:id
// @access  Public
export const getReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id).populate({
		path: "bootcamp",
		select: "name description",
	});

	if (!review) {
		return next(
			new ErrorResponse(
				`No review found with the id of ${req.params.id}`,
				404
			)
		);
	}

	res.status(200).json({ succes: true, data: review });
});

// @desc    Add a review
// @route   POST /api/v1/bootcamps/:bootcampId/reviews
// @access  Private
export const addReview = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;
	req.body.user = req.user.id;

	const bootcamp = await Bootcamp.findById(req.params.bootcampId);

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`No bootcamp with the id of ${req.params.bootcampId}`,
				404
			)
		);
	}

	const review = await Review.create(req.body);

	res.status(201).json({ succes: true, data: review });
});

// @desc    Update a review
// @route   PUT /api/v1/reviews/:id
// @access  Private
export const updateReview = asyncHandler(async (req, res, next) => {
	let review = await Review.findById(req.params.id);

	if (!review) {
		return next(
			new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
		);
	}
	// Make sure belongs to user or user is admin
	if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(new ErrorResponse(`Not authorized to update review`, 401));
	}

	review = await Review.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(201).json({ succes: true, data: review });
});

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id);

	if (!review) {
		return next(
			new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
		);
	}
	// Make sure belongs to user or user is admin
	if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(new ErrorResponse(`Not authorized to update review`, 401));
	}

	await review.remove();

	res.status(200).json({ succes: true, data: {} });
});
