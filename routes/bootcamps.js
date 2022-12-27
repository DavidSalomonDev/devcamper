import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsInRadius,
	bootcampPhotoUpload,
} from "../controllers/bootcamps.js";
import { advancedResults } from "../middleware/advancedResults.js";
import Bootcamp from "../models/Bootcamp.js";

// Include other resource routers
import { router as courseRouter } from "./courses.js";
import { router as reviewRouter } from "./reviews.js";

export const router = express.Router();

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
	.route("/:id/photo")
	.put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

router
	.route("/")
	.get(advancedResults(Bootcamp, "courses"), getBootcamps)
	.post(protect, authorize("publisher", "admin"), createBootcamp);

router
	.route("/:id")
	.get(getBootcamp)
	.put(protect, authorize("publisher", "admin"), updateBootcamp)
	.delete(protect, authorize("publisher", "admin"), deleteBootcamp);
