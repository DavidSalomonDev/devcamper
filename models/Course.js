import { mongoose } from "mongoose";

const CourseSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, "Please add a course title"],
	},
	description: {
		type: String,
		required: [true, "Please add a description"],
	},
	weeks: {
		type: String,
		required: [true, "Please add a number of weeks"],
	},
	tuition: {
		type: Number,
		required: [true, "Please add a tuition cost"],
	},
	minimumSkill: {
		type: String,
		required: [true, "Please add a minimum skill"],
		enum: ["beginner", "intermediate", "advaced"],
	},
	scholarshipAvailable: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	bootcamp: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Bootcamp",
		required: true,
	},
});

// Static method to get the average of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampId },
		},
		{
			$group: {
				_id: "$bootcamp",
				averageCost: { $avg: "$tuition" },
			},
		},
	]);

	try {
		await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
			averageCost: Math.ceil(obj[0].averageCost),
		});
	} catch (error) {
		console.log(error);
	}
};

// Call getAverageCost after save
CourseSchema.post("save", function () {
	this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.post("remove", function () {
	this.constructor.getAverageCost(this.bootcamp);
});

const Course = mongoose.model("Course", CourseSchema);
export default Course;
