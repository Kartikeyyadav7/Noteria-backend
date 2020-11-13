const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Note = require("../models/Note");
const auth = require("../middlewares/auth");

router.post(
	"/",
	auth,
	[check("text", "Note is required").not().isEmpty()],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const textNote = {
				text: req.body.text,
			};
			const newNote = await Note.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: textNote },
				{ new: true, upsert: true } // upsert is used to make a new document if not found and new true gives updated document after saving
			);

			res.json(newNote);
		} catch (error) {
			console.log(error);
			res.status(500).json({ Error: "Internal server error" });
		}
	}
);

router.get("/:id", auth, async (req, res) => {
	try {
		const getNote = await Note.findById(req.params.id);

		if (!getNote) {
			return res.status(404).json({ Msg: "Note not found" });
		}

		res.json(getNote);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.delete("/:id", auth, async (req, res) => {
	try {
		const note = await Note.findById(req.params.id);

		if (!note) {
			return res.status(404).json({ error: "Note not found" });
		}

		if (note.user.toString() !== req.user.id) {
			return res.status(401).json({ error: "Not Authorized" });
		}

		await note.remove();
		res.json({ msg: "Note deleted" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error });
	}
});

module.exports = router;
