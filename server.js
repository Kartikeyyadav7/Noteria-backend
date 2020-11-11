const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

//Connecting to the Database
mongoose
	.connect(
		`mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@noteria-dev.nqoya.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true,
		}
	)
	.then(() => {
		console.log("DB Connected");
	})
	.catch((err) => {
		console.log(err);
	});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//Get request to check the connection
app.get("/", (req, res) => {
	res.send("Welcome to the backend of Noteria");
});

const PORT = process.env.PORT || 5000;

// App start
app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
});
