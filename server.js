const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 3000;

const db =
	process.env.NODE_ENV === "production"
		? knex({
				client: "pg",
				connection: {
					connectionString: process.env.DATABASE_URL,
					ssl: true
				}
		  })
		: knex({
				client: "pg",
				connection: {
					host: process.env.DATABASE_HOST || "127.0.0.1",
					user: process.env.DATABASE_USER || "postgres",
					password: process.env.DATABASE_PASSWORD || "postgres",
					database: process.env.DATABASE_NAME || "recognize"
				}
		  });

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.send(db.users);
});
app.post("/signin", signin.handleSignin(db, bcrypt));

app.post("/register", (req, res) => {
	register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
	profile.handleProfileGet(req, res, db);
});

app.put("/image", (req, res) => {
	image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
	image.handleApiCall(req, res);
});

app.get("/test", (req, res) => {
	res.send("It is working!");
});

app.listen(port, () => {
	console.log(`app is running on port ${port}`);
});
