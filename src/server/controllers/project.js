// jshint esversion: 6
// jshint node: true
"use strict";

const multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "projects");
  },
  filename: function (req, file, cb) {
    let values = JSON.parse(req.query.values);
    cb(null, values.name + ".tif");
  },
});
var upload = multer({ storage: storage }).single("file");

const Project = require("../models/project.js");

exports.saveFile = (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
};

exports.saveProject = (req, res) => {
  let values = JSON.parse(req.query.values);
  Project.findOne({
    name: values.name,
  }).then((project) => {
    if (project) {
      return res.status(400).json({
        name: "Projectname already exists",
      });
    } else {
      let centerpoint = JSON.parse(values.centerpoint);
      let categories = JSON.parse(values.categories);
      let owner = req.query.owner;
      new Project({
        name: values.name,
        categories: categories,
        centerpoint: centerpoint,
        owner: owner,
      })
        .save()
        .then(() => {
          this.saveFile(req, res);
        });
    }
  });
};

exports.findProjectByID = (req, res) => {
  Project.findOne({
    _id: req.query.id,
  }).then((project) => {
    res.json(project);
  });
};
