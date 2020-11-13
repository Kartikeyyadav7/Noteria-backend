const mongoose = require("mongoose");

const connectWithDB = async () => {
	try {
		await mongoose.connect(
			`mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@noteria-dev.nqoya.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useFindAndModify: false,
				useCreateIndex: true,
			}
		);
		console.log("DB Connected");
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
};

module.exports = connectWithDB;
