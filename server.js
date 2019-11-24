const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt-nodejs");

const app = express();

app.use(bodyParser.json());
app.use(cors);

const database = {
    users: [
        {
            id: "123",
            name: "John",
            email: "john@gmail.com",
            password: "cookies",
            entries: 0,
            joined: new Date()
        },
        {
            id: "124",
            name: "Sally",
            email: "sally@gmail.com",
            password: "bananas",
            entries: 0,
            joined: new Date()
        }
    ]
};
app.get("/", (req, res) => {
    res.send("this is working");
});

app.get("/users", (req, res) => {
    res.json(database.users);
});

app.post("/signin", (req, res) => {
    //console.log(req.body.email + "," + database.users[0].email);
    if (
        req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password
    ) {
        res.json("success");
    } else {
        res.status(400).json("failure");
    }
});

app.post("/register", (req, res) => {
    const { email, name, password } = req.body;

    database.users.push({
        id: "125",
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length - 1]);
});

function findUser(id) {
    database.users.forEach(user => {
        if (user.id === id) {
            return database.users[id];
        }
    });

    return false;
}

app.get("/profile/:id", (req, res) => {
    database.users.forEach(user => {
        if (user.id === req.params.id) {
            res.json(user);
        }
    });

    res.status(400).json("User not found");
});

app.post("/image", (req, res) => {
    database.users.forEach(user => {
        if (user.id === req.body.id) {
            user.entries++;
            return res.json(user.entries);
        }
    });

    res.status(400).json("User not found");
});

app.listen(3000, () => {
    console.log("app is running");
});
