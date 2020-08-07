// jshint esversion: 6
// jshint node: true
"use strict";

const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Project = require("../models/project.js");
const User = require("../models/user.js");

exports.register = (req, res) => {
  let values = JSON.parse(req.query.values);
  User.findOne({
    email: values.email,
  }).then((user) => {
    if (user) {
      return res.status(400).json({
        email: "Email already exists",
      });
    } else {
      const avatar = gravatar.url(values.email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      const newUser = new User({
        name: values.name,
        email: values.email,
        password: values.password,
        avatar,
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) console.error("There was an error", err);
        else {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.error("There was an error", err);
            else {
              newUser.password = hash;
              newUser.save().then((user) => {
                res.json(user);
              });
            }
          });
        }
      });
    }
  });
};

exports.login = (req, res) => {
  let values = JSON.parse(req.query.values);

  let email = values.email;
  let password = values.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      let errors = { email: "User not found" };
      return res.status(404).json(errors);
    } else {
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          };
          jwt.sign(
            payload,
            "secret",
            {
              expiresIn: 3600,
            },
            (err, token) => {
              if (err) console.error("There is some error in token", err);
              else {
                res.json({
                  success: true,
                  token: `Bearer ${token}`,
                });
              }
            }
          );
        } else {
          let errors = { password: "incorrect Password" };
          return res.status(400).json(errors);
        }
      });
    }
  });
};

exports.addUserProject = (req, res) => {
  Project.findOne({
    name: req.query.projectname,
  })
    .exec()
    .then((project) => {
      if (project == null || project == undefined || project === null) {
        return res.status(400).send("This project does not exist");
      } else {
        addProject(req, res, project.id);
      }
    });
};

function addProject(req, res, projectid) {
  if (req.query.own == "true") {
    User.updateOne(
      {
        _id: req.query.userid,
      },
      {
        $addToSet: {
          ownprojects: {
            projectid: projectid,
            projectname: req.query.projectname,
          },
        },
      }
    )
      .exec()
      .then(() => {
        res.send("You are now owner of this project");
      })
      .catch((err) => {
        res.json(err);
      });
  } else {
    User.updateOne(
      {
        _id: req.query.userid,
      },
      {
        $addToSet: {
          projects: {
            projectid: projectid,
            projectname: req.query.projectname,
          },
        },
      }
    )
      .exec()
      .then(() => {
        res.send("You where added to the project as a co-worker");
      })
      .catch((err) => {
        res.json(err);
      });
  }
}
