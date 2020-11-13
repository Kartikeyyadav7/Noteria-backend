const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	text: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Notes", noteSchema);
