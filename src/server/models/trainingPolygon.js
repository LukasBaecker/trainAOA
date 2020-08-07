const mongoose = require("mongoose");

const polygonSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Polygon"],
    required: true,
  },
  coordinates: {
    type: [[[Number]]],
    required: true,
  },
});

const trainingPol = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Feature"],
    required: true,
  },
  geometry: polygonSchema,
  properties: {
    date: {
      type: Date,
      default: Date.now,
    },
    class: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    placeholderId: {
      type: Number,
      required: true,
    },
    project: {
      type: String,
      required: true,
    },
  },
});

const trainingPolygonModel = mongoose.model("polygons", trainingPol);

module.exports = trainingPolygonModel;
