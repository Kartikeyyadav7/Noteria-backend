const jwt = require("jsonwebtoken");

mddule.exports = (req, res, next) => {
	const token = req.headers("x-access-token") || req.headers("authorization");
	if (token) {
		return res.status(401).json({ error: "No token found access denied" });
	}
	try {
		jwt.verify(token, process.env.SECRET, (err, decoded) => {
			if (err) {
				return res.status(400).json({ error: "Token not valid or expired" });
			} else {
				req.user = decoded.user;
			}
			next();
		});
	} catch (error) {
		return res.status(500).json({ error: "Some error occured" });
	}
};
