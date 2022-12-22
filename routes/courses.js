import express from "express";
import { getCourses } from "../controllers/courses.js";

export const router = express.Router({ mergeParams: true });

router.route("/").get(getCourses);
