import axios from "axios";
import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import Users from "../models/users.model";

const router = Router();

const downloadImage = async (url: string) => {
  const result = await axios.get(url, {
    responseType: "arraybuffer",
  });
  const buffer = Buffer.from(result.data).toString("base64");
  const imgString = `data:${result.headers["content-type"]};base64,${buffer}`;

  return imgString;
};

// sign in and token generation

router.post("/", (req, res) => {
  const email: string = req.body.email.toLowerCase();
  const password: string = req.body.password;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  Users.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) return res.status(404).json({ msg: "User doesn't exist." });
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch)
            return res.status(400).json({ msg: "Invalid credentials" });
          jwt.sign(
            { id: user._id, admin: user.admin },
            process.env.JWT_SECRET,
            (err: jwt.VerifyErrors, token: string) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  _id: user._id,
                  email: user.email,
                  profilePicture: user.profilePicture,
                  registerDate: user.registerDate,
                  username: user.username,
                  admin: user.admin,
                },
              });
            }
          );
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.post("/facebook-login", async (req, res) => {
  if (req.body?.status !== "unknown") {
    const { email, name }: { email: string; name: string } = req.body.user;
    const { url }: { url: string } = req.body.user.picture.data;

    const updatedPicture = await downloadImage(url as string);

    Users.findOne({ email })
      .then((user) => {
        if (user) {
          jwt.sign(
            { _id: user._id, admin: user.admin },
            process.env.JWT_SECRET,
            (err: jwt.JsonWebTokenError, token: string) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  _id: user._id,
                  email: user.email,
                  profilePicture: updatedPicture,
                  registerDate: user.registerDate,
                  username: user.username,
                  admin: user.admin,
                },
              });
            }
          );
          if (updatedPicture !== user.profilePicture) {
            Users.updateOne(
              { email },
              { $set: { profilePicture: updatedPicture } },
              (err) => {
                if (err) throw err;
              }
            );
          }
        } else {
          const newUser = new Users({
            username: name,
            email: email,
            password: req.body.accessToken,
            profilePicture: updatedPicture,
          });

          bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  jwt.sign(
                    { id: user._id, admin: user.admin },
                    process.env.JWT_SECRET,
                    { expiresIn: 3600 },
                    (err, token) => {
                      if (err) throw err;
                      res.json({
                        token,
                        user: {
                          _id: user._id,
                          email: user.email,
                          profilePicture: updatedPicture,
                          registerDate: user.registerDate,
                          username: user.username,
                          admin: user.admin,
                        },
                      });
                    }
                  );
                })
                .catch((err) => res.status(400).json(err));
            });
          });
        }
      })
      .catch(() => res.status(400).json("Sign in failed!"));
  }
});

router.post("/google-login", async (req, res) => {
  const { email, name }: { email: string; name: string } = req.body.profileObj;
  const googleImgUrl: string = req.body.profileObj.imageUrl.replace(
    "s96-c",
    "s384-c",
    true
  );

  const imageUrl = await downloadImage(googleImgUrl);

  Users.findOne({ email }).then((user) => {
    if (user) {
      jwt.sign(
        { _id: user._id, admin: user.admin },
        process.env.JWT_SECRET,
        (err: jwt.JsonWebTokenError, token: string) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              _id: user._id,
              email: user.email,
              profilePicture: user.profilePicture,
              registerDate: user.registerDate,
              username: user.username,
              admin: user.admin,
            },
          });
        }
      );
    } else {
      const newUser = new Users({
        username: name,
        email: email,
        password: req.body.tokenObj.access_token,
        profilePicture: imageUrl,
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              jwt.sign(
                { id: user._id, admin: user.admin },
                process.env.JWT_SECRET,
                { expiresIn: 3600 },
                (err, token) => {
                  if (err) throw err;
                  res.json({
                    token,
                    user: {
                      _id: user._id,
                      email: user.email,
                      profilePicture: user.profilePicture,
                      registerDate: user.registerDate,
                      username: user.username,
                      admin: user.admin,
                    },
                  });
                }
              );
            })
            .catch((err) => res.status(400).json(err));
        });
      });
    }
  });
});

export default router;
