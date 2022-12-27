import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
	addReview,
	deleteReview,
	getReview,
	getReviews,
	updateReview,
} from "../controllers/review.js";
import Review from "../models/Review.js";
import { advancedResults } from "../middleware/advancedResults.js";

export const router = express.Router({ mergeParams: true });

router
	.route("/")
	.get(
		advancedResults(Review, {
			path: "bootcamp",
			select: "name description",
		}),
		getReviews
	)
	.post(protect, authorize("user", "admin"), addReview);

router
	.route("/:id")
	.get(getReview)
	.put(protect, authorize("user", "admin"), updateReview)
	.delete(protect, authorize("user", "admin"), deleteReview);
