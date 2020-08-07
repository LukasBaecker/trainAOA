// jshint esversion: 6
// jshint node: true
"use strict";

var trainingPolygonModel = require("../models/trainingPolygon.js"); //MongoDB Schema definition to save polygon

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @description this is the function for getting polygons as given in the req
 * @param {JSON} req
 * req.query could depend of:
 * ...
 * ...
 * @param {JSON} res
 */
exports.getPolygon = (req, res) => {
  if (req.query.class && req.query.creator) {
    trainingPolygonModel
      .find({
        $and: [
          { "properties.class": req.query.class },
          { "properties.creator": req.query.creator },
        ],
      })
      .exec()
      .then((response) => {
        res.json(response);
      });
  } else {
    if (req.query.creator) {
      trainingPolygonModel
        .find({ "properties.creator": req.query.creator })
        .exec()
        .then((response) => {
          res.json(response);
        });
    } else {
      if (req.query.class) {
        trainingPolygonModel
          .find({ "properties.class": req.query.class })
          .exec()
          .then((response) => {
            res.json(response);
          });
      } else {
        trainingPolygonModel
          .find({})
          .exec()
          .then((response) => {
            res.json(response);
          });
      }
    }
  }
};

/**
 * @description this saves a Polygon to Database
 * @param {*} request
 */
exports.createPolygon = async (req) => {
  var position = req.query.polygon;
  var featureclass = req.query.featureclass;
  var creator = req.query.creator;
  const projectid = req.query.projectid;

  var parsedPosition = position.map((element) => {
    return JSON.parse(element);
  });

  //save the data of a photo in the Database
  var polygonsaved = new trainingPolygonModel({
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: await parsedPosition,
    },
    properties: {
      creator: creator,
      class: featureclass,
      placeholderId: 0,
      project: await projectid,
    },
  });
  var submit = await polygonsaved.save();
  console.log("New Polygon saved to database:", submit);
  return submit;
};

/**
 * @description this deletes all Polygons in Database
 * @param {*} request
 */
exports.deletePolygon = async () => {
  trainingPolygonModel.deleteMany({}).exec();
  var submit = "all Polygons have been deleted";
  console.log("all Polygons have been deleted");
  return submit;
};

/**
 *
 */
exports.getFeatureClass = async (req, res) => {
  trainingPolygonModel
    .find({ "properties.project": req.query.projectid })
    .exec()
    .then((response) => {
      let featureClass = {
        type: "FeatureCollection",
        features: [],
      };
      if (response.length < 1) {
        res.json(featureClass);
      } else {
        var forEachAwait = new Promise((resolve, reject) => {
          let counter = 1;
          response.forEach((e) => {
            e.properties.id = counter;
            featureClass.features.push(e);
            counter++;
            if (featureClass.features.length === response.length) {
              resolve();
            }
          });
        });

        forEachAwait
          .then(() => {
            res.json(featureClass);
          })
          .catch((error) => {
            console.log(error.response);
          });
      }
    });
};
