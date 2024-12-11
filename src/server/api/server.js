import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import cors from "cors";
import User from "../models/user.js";
import dotenv from 'dotenv'
dotenv.config()

const app = express();
app.use(bodyParser.json());

var cors_opt = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "https://nat-go.vercel.app");
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
    next();
}

app.use(cors_opt);

mongoose.connect(process.env.REACT_APP_mongo_connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "email not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "incorrect password" });
    }

	res.cookie("session_id", user._id, {
		httpOnly: true,
		secure: true,
		sameSite: "None",
	});

    res.status(200).json({ userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "email is already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashed,
    });

    await newUser.save();
    res.status(200).json({ userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

app.put("/parks/:id", async (req, res) => {
  const { userId, parkId, newChecked } = req.body;
  try {
    const user = await User.findById(userId);

    if (!Array.isArray(user.collectedParks)) {
      user.collectedParks = [];
    }

    if (newChecked) {
      user.collectedParks.push(parkId);
    } else {
      user.collectedParks = user.collectedParks.filter((id) => id !== parkId);
    }

    await user.save();
    res.status(200).json({ parkId: parkId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

app.get("/users/:id/collectedParks", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    res.status(200).json({ collectedParks: user.collectedParks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

app.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    res.status(200).json({ username: user.username });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

const PORT = 1000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
