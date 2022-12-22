import express from "express";
import {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsInRadius,
} from "../controllers/bootcamps.js";

// Include other resource routers
import { router as courseRouter } from "./courses.js";

export const router = express.Router();

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/").get(getBootcamps).post(createBootcamp);

router
	.route("/:id")
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);
