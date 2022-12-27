import express from "express";
import User from "../models/User.js";
import {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
} from "../controllers/users.js";
import { advancedResults } from "../middleware/advancedResults.js";
import { protect, authorize } from "../middleware/auth.js";

export const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
