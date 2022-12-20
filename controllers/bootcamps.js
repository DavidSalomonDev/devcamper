import Bootcamp from "../models/Bootcamp.js";

// @description         Get all bootcamps
// @route               GET /api/v1/bootcamps
// @access              Public
export const getBootcamps = async (req, res, next) => {
	try {
		const bootcamps = await Bootcamp.find();
		res.status(200).json({
			success: "true",
			message: "Show all bootcamps",
			count: bootcamps.length,
			data: bootcamps,
		});
	} catch (error) {
		res.status(400).json({
			success: "false",
			message: error.message,
		});
	}
};

// @description         Get a single bootcamp
// @route               GET /api/v1/bootcamps/:id
// @access              Public
export const getBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findById(req.params.id);

		if (!bootcamp) {
			return res.status(404).json({ success: false });
		}

		res.status(200).json({
			success: "true",
			message: `Show bootcamp ${req.params.id}`,
			data: bootcamp,
		});
	} catch (error) {
		res.status(400).json({
			success: "false",
			message: error.message,
		});
	}
};

// @description         Create a bootcamp
// @route               POST /api/v1/bootcamps/:id
// @access              Private
export const createBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.create(req.body);
		res.status(201).json({
			success: "true",
			message: "Create new bootcamp",
			data: bootcamp,
		});
	} catch (error) {
		res.status(400).json({
			success: "false",
			message: error.message,
		});
	}
};

// @description         Update a bootcamp
// @route               PUT /api/v1/bootcamps/:id
// @access              Private
export const updateBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);

		if (!bootcamp) {
			return res.status(404).json({ success: false });
		}
		res.status(200).json({
			success: "true",
			message: `Update bootcamp ${req.params.id}`,
			data: bootcamp,
		});
	} catch (error) {}
};

// @description         Delete bootcamp
// @route               DELETE /api/v1/bootcamps/:id
// @access              Private
export const deleteBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
		if (!bootcamp) {
			return res.status(404).json({ success: false });
		}
		res.status(200).json({
			success: "true",
			message: `Delete bootcamp ${req.params.id}`,
			data: {},
		});
	} catch (error) {}
};
