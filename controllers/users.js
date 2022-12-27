import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middleware/async.js";
import User from "../models/User.js";

// @description         Get all users
// @route               GET /api/v1/auth/users
// @access              Private/Admin
export const getUsers = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

// @description         Get a single user
// @route               GET /api/v1/auth/users/:id
// @access              Private/Admin
export const getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	res.status(200).json({ success: true, data: user });
});

// @description         Create a user
// @route               POST /api/v1/auth/users/
// @access              Private/Admin
export const createUser = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body);
	res.status(201).json({ success: true, data: user });
});

// @description         Update a user
// @route               PUT /api/v1/auth/users/:id
// @access              Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	res.status(200).json({ success: true, data: user });
});

// @description         Delete a user
// @route               DELETE /api/v1/auth/users/:id
// @access              Private/Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
	await User.findOneAndDelete(req.params.id);
	res.status(201).json({ success: true, data: {} });
});
