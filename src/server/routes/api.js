// jshint esversion: 6
// jshint node: true
"use strict";

//Import modules
const express = require("express"); //Express

//Import controllers
//const APIController = require('../controllers/api.js')
const PolygonController = require("../controllers/polygons.js");
const AOAController = require("../controllers/aoa.js");
const UserController = require("../controllers/user.js");
const ProjectController = require("../controllers/project.js");
const passport = require("passport");
//Define Variables
const router = express.Router();

//Version 1
router.get("/v1/polygon", PolygonController.getPolygon);
router.post("/v1/polygon", PolygonController.createPolygon);
router.delete("/v1/polygon", PolygonController.deletePolygon);

router.get("/v1/featureclass", PolygonController.getFeatureClass);

router.post("/v1/aoa", AOAController.startAoa);
router.post("/v1/tiles", AOAController.tiles);

router.get("/v1/project", ProjectController.findProjectByID);
router.post("/v1/project", ProjectController.saveProject);
router.post("/v1/uploadfile", ProjectController.saveFile);

router.post("/v1/user/register", UserController.register);
router.post("/v1/user/login", UserController.login);
router.post("/v1/user/project", UserController.addUserProject);
router.get(
  "/v1/user/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      projects: req.user.projects,
      ownproject: req.user.ownprojects,
    });
  }
);
module.exports = router;
