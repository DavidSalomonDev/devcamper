import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
	getCourses,
	getCourse,
	addCourse,
	updateCourse,
	deleteCourse,
} from "../controllers/courses.js";

export const router = express.Router({ mergeParams: true });

router
	.route("/")
	.get(getCourses)
	.post(protect, authorize("publisher", "admin"), addCourse);
router
	.route("/:id")
	.get(getCourse)
	.put(protect, authorize("publisher", "admin"), updateCourse)
	.delete(protect, authorize("publisher", "admin"), deleteCourse);
