import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import cors from "cors";
import secrets from "../secrets.js"
import User from "../models/user.js"

const app = express();
app.use(bodyParser.json());
app.use(cors({
	origin: "http://localhost:3000",
}));

mongoose.connect(secrets.mongo_connection, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

app.post("/", async (req, res) => { // TODO: this is actually signin and is currently functioning as signup, fix this later
	const { username, email, password } = req.body;
	try {
		if (!email || !password) {
			return res.status(400).json({message: "all fields are required"});
		}

		const existing = await User.findOne({email});
		if (existing) {
			return res.status(400).json({message: "email is already in use"});
		}

		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt);

		const newUser = new User({
			username,
			email,
			password: hashed
		});

		await newUser.save();
		res.status(200).json({message: "user has been created"})
	} catch (error) {
		res.status(500).json({message: "server error"});
	}
})

const PORT = 1000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});