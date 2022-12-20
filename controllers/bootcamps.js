// @description         Get all bootcamps
// @route               GET /api/v1/bootcamps
// @access              Public
export const getBootcamps = (req, res, next) => {
	res.status(200).json({
		success: "true",
		message: "Show all bootcamps",
		data: {
			name: "David",
		},
	});
};

// @description         Get a single bootcamp
// @route               GET /api/v1/bootcamps/:id
// @access              Public
export const getBootcamp = (req, res, next) => {
	res.status(200).json({
		success: "true",
		message: `Show bootcamp ${req.params.id}`,
		data: {
			name: "David",
		},
	});
};

// @description         Create a bootcamp
// @route               POST /api/v1/bootcamps/:id
// @access              Private
export const createBootcamp = (req, res, next) => {
	res.status(200).json({
		success: "true",
		message: "Create new bootcamp",
		data: {
			name: "David",
		},
	});
};

// @description         Update a bootcamp
// @route               PUT /api/v1/bootcamps/:id
// @access              Private
export const updateBootcamp = (req, res, next) => {
	res.status(200).json({
		success: "true",
		message: `Update bootcamp ${req.params.id}`,
		data: {
			name: "David",
		},
	});
};

// @description         Delete bootcamp
// @route               DELETE /api/v1/bootcamps/:id
// @access              Private
export const deleteBootcamp = (req, res, next) => {
	res.status(200).json({
		success: "true",
		message: `Delete bootcamp ${req.params.id}`,
		data: {
			name: "David",
		},
	});
};
