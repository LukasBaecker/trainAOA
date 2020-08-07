const express = require("express");
const path = require("path");

const port = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname);
const HTML_FILE = path.join(DIST_DIR, "index.html");
const mongoose = require("mongoose");
var cors = require("cors");
const passport = require("passport");

// connect to MongoDB
const dblocalhost = "mongodb://localhost:27017/aoa";
const dbdocker = "mongodb://mongodbservice/aoa";
connectMongoDB();

/**
 * function to get a connection to the Database
 * depending on the type of connection chooses this function the
 */

function connectMongoDB() {
  (async () => {
    // set up default ("Docker") mongoose connection
    await mongoose
      .connect(dbdocker, {
        useNewUrlParser: true,
        useCreateIndex: true,
        autoReconnect: true,
      })
      .then((db) => {
        console.log(
          'Connected to MongoDB (databasename: "' +
            db.connections[0].name +
            '") on host "' +
            db.connections[0].host +
            '" and on port "' +
            db.connections[0].port +
            '""'
        );
      })
      .catch(async (err) => {
        console.log(
          "Connection to " +
            dbdocker +
            " failed, try to connect to " +
            dblocalhost
        );
        // set up "local" mongoose connection
        await mongoose
          .connect(dblocalhost, {
            useNewUrlParser: true,
            useCreateIndex: true,
            autoReconnect: true,
          })
          .then((db) => {
            console.log(
              'Connected to MongoDB (databasename: "' +
                db.connections[0].name +
                '") on host "' +
                db.connections[0].host +
                '" and on port "' +
                db.connections[0].port +
                '""'
            );
          })
          .catch((err2) => {
            console.log("Error at MongoDB-connection with Docker: " + err);
            console.log("Error at MongoDB-connection with Localhost: " + err2);
            console.log("Retry to connect in 3 seconds");
            setTimeout(connectMongoDB, 3000); // retry until db-server is up
          });
      });
  })();
}

const app = express();
app.use(passport.initialize());
require("./passport")(passport);

app.use(cors());

if (process.env.NODE_ENV !== "production") {
  const webpack = require("webpack");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpackHotMiddleware = require("webpack-hot-middleware");
  const config = require("../../webpack.dev.js");
  const compiler = webpack(config);

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config[0].output.publicPath,
    })
  );
  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(DIST_DIR));

app.use("/api", require("./routes/api"));

app.get("*", (req, res) => {
  res.sendFile(HTML_FILE);
});

app.listen(port, function () {
  console.log("App listening on port: " + port);
});
