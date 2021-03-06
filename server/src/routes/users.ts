import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import Users from "../models/users.model";

const router = Router();

// User registeration

router.post("/", (req, res) => {
  const {
    username,
    email,
    password,
    admin,
    profilePicture,
  }: {
    username: string;
    email: string;
    password: string;
    admin: boolean;
    profilePicture: string;
  } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  Users.findOne({ email }).then((user) => {
    if (user) return res.status(400).json({ msg: "User already exists." });

    const newUser = new Users({
      username,
      email,
      password,
      admin,
      profilePicture,
    });

    newUser.email = email.toLowerCase();

    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((user) => {
            jwt.sign(
              { id: user._id },
              process.env.JWT_SECRET,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.json({
                  token,
                  user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    admin: user.admin,
                    profilePicture: user.profilePicture,
                  },
                });
                console.log(user);
              }
            );
          })
          .catch((err) => res.status(400).json(`Error: ${err}`));
      });
    });
  });
});

router.get("/profile/:id", (req, res) => {
  const id = req.params.id;

  Users.findById(id)
    .select("-password")
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(() => res.status(404).json("User not found"));
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  Users.findById(id)
    .select("-password -registerDate -__v -email")
    .exec()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(404).json(err));
});

export default router;
