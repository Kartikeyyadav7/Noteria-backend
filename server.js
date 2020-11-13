const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const user = require("./routes/user");
const note = require("./routes/note");
const connectWithDB = require("./config/dbconnection");

connectWithDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api/user", user);
app.use("/api/note", note);

app.get("/", (req, res) => {
	res.send("Welcome to the backend of Noteria");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
});
