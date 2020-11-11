const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		maxlength: 32,
		minlength: 3,
		required: true,
		trim: true,
	},
	lastName: {
		type: String,
		maxlength: 16,
		minlength: 3,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	profilepic: {
		type: String,
	},
});

module.exports = mongoose.model("User", userSchema);
