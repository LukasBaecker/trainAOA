// jshint esversion: 6
// jshint node: true
"use strict";

const axios = require("axios");
var trainingPolygon = require("../models/trainingPolygon.js"); //MongoDB Schema definition to save polygon
/*
 * @description this is the function to start the aoa R-script
 * @param {JSON} req
 * req.query could depend of:
 * ...
 * ...
 * @param {JSON} res
 */
exports.startAoa = async (req, res) => {
  trainingPolygon
    .find({ "properties.project": req.query.projectid })
    .exec()
    .then((response) => {
      if (response.length < 2) {
        res.status(406).send("There must be at least two trainingdatasets");
      } else {
        let counter = 1;
        var forEachAwait = new Promise((resolve, reject) => {
          response.forEach((e) => {
            e.properties.placeholderId = counter;

            if (counter === response.length) {
              resolve();
            }
            counter++;
          });
        });

        forEachAwait
          .then(() => {
            let featureClass = {
              type: "FeatureCollection",
              features: response,
            };
            axios
              .get("http://localhost:3002/aoa", {
                params: { features: featureClass, name: req.query.name },
              })
              .then(() => {
                res.send("done");
              })
              .catch((err) => {
                console.log("err", err);
                res
                  .status(500)
                  .send(
                    "Couldn't update the AOA-layer. Try again later or contact the server-host"
                  );
              });
          })
          .catch(() => {
            res.send("An error has occured");
          });
      }
    });
};

exports.tiles = async (req, res) => {
  axios
    .get("http://localhost:3002/tiles", {
      params: { projectname: req.query.name },
    })
    .then(() => {
      return res.status(200).send("Tiles have been build.");
    })
    .catch((err) => {
      console.log("err", err);
      res
        .status(500)
        .send(
          "Couldn't get the projectarea tiles. Try again later or contact the server-host"
        );
    });
};
