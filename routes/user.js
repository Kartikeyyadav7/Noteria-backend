const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/test", (req, res) => {
	res.json({ msg: "Hello Dude" });
});

router.post(
	"/signup",
	[
		check("name", "Please Enter Your Name").not().isEmpty(),
		check("email", "Please enter a valid Email Address").isEmail(),
		check(
			"password",
			"Please enter a password with 6 charactors or more"
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const { name, lastName, email, password } = req.body;
		try {
			let user = await User.findOne({ email });

			if (user) {
				return res.status(400).json({ error: "Email already exists" });
			}
			user = new User({
				name,
				lastName,
				email,
				password,
			});
			user.password = await encrytpingPasswordUsingBcrypt(
				user.Password,
				password
			);
			await user.save();

			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				process.env.SECRET,
				{ expiresIn: "5 days" },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			res.status(500).json(err);
		}
	}
);

const encrytpingPasswordUsingBcrypt = async (userPassword, enteredPassword) => {
	const salt = await bcrypt.genSalt(10);
	userPassword = await bcrypt.hash(enteredPassword, salt);
	return userPassword;
};

router.post(
	"/login",
	[
		check("email", "Please enter a valid email").isEmail(),
		check("password", "Please enter a password").exists(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		const { email, password } = req.body;
		try {
			const user = await User.findOne({ email });

			if (!user) {
				return res
					.status(400)
					.json({ error: "Please enter valid credentials" });
			}

			const checkPassword = await bcrypt.compare(password, user.password);

			if (!checkPassword) {
				return res.status(422).json({ error: "Please enter valid password" });
			}

			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				process.env.SECRET,
				{
					expiresIn: "5 days",
				},
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (error) {
			console.error(error);
		}
	}
);

module.exports = router;
