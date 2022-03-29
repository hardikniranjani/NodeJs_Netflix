const express = require("express");
const cors = require('cors');
require("dotenv").config();
const userController = require("./controllers/user.controller");
const moviesController = require("./controllers/movie.controller");
const seriesController = require("./controllers/series/series.controller");
const seasonController = require("./controllers/series/season.controller");
const episodeController = require("./controllers/series/episode.controller");
const countryController = require("./controllers/country.controller");
const subscriptionController = require("./controllers/subscription.controller");
const languages = require('./controllers/spokenLanguage.controller');
const GenresController = require('./controllers/genre.controller');
const companiesController = require('./controllers/company.controller');
const certificationController = require('./controllers/certification.controller');

const mongoose = require("mongoose");
const fileupload = require("express-fileupload");
const MongoDBpath = "mongodb://localhost/netflix_localdb";
mongoose
  .connect(process.env.DB_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"));

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials : true,
    exposedHeaders: "x-access-token",
  })
);
//middleware for uploading video and images
app.use(fileupload({
  useTempFiles:true
}));

app.use("/user", userController);
app.use("/movies", moviesController);
app.use("/series", seriesController);
app.use("/season", seasonController);
app.use("/episode", episodeController);
app.use("/country", countryController);
app.use("/subscription", subscriptionController);
app.use("/languages",languages);
app.use("/genre", GenresController);
app.use("/company", companiesController);
app.use("/certification", certificationController);
app.use("/", (req, res) => {
  res.status(200).send("Home Page!");
});

app.listen(3003, () => console.log("listening on port 3003"));
