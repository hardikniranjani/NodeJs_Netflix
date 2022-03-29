const express = require("express");
const MovieDomain = require("../domain/movie.domain");
const router = express.Router();
const checkRole = require('../middleware/middleware');
const verifyToken = require('../middleware/auth.middleware');
class MovieController {
  // get all Movie
  static async getAllMovie(req, res) {
    
    const movieDomain = new MovieDomain();
    movieDomain.getAllMovie(req, res);
  }

  // get specific Movie by id
  static async getMovie(req, res) {
    const movieDomain = new MovieDomain();
    movieDomain.getAnMovie(req, res);
  }

  // create Movie
  static async createMovie(req, res) {
    const movieDomain = new MovieDomain();
    movieDomain.createAnMovie(req, res);
  }

  // update Movie
  static async updateMovie(req, res) {
    const movieDomain = new MovieDomain();
    movieDomain.editAnMovie(req, res);
  }

  //soft delete Movie
  static async deleteMovie(req, res) {
    const movieDomain = new MovieDomain();
    movieDomain.deleteAnMovie(req, res);
  }

  //hard delete Movie
  static async HardDeleteMovie(req, res) {
    const movieDomain = new MovieDomain();
    movieDomain.hardDeleteMovie(req, res);
  }

  // sorting movie
  static async sortMovie(req, res) {
    const movieDomain = new MovieDomain();
    movieDomain.sortMovie(req, res);
  }

  // find and sorting series data
  static async findMovieBySort(req, res) {
    const movieDomain = new MovieDomain();
    movieDomain.findMovieBySort(req, res);
  }

  // search movie and filter results
  static async findMovieBySearch(req, res) {
    const movieDomain = new MovieDomain();
    movieDomain.findMovieBySearch(req, res);
  }

  //  uplode movie video
  static async uploadMovie(req, res) {
    const movieDomain = new MovieDomain();
    movieDomain.uploadMovie(req, res);
  }

  static async uploadMovieImage(req, res) {
    const movieDomain = new MovieDomain();
    movieDomain.uploadMovieImage(req, res);
  }

  static async uploadMovieVideo(req, res) {
    const movieDomain = new MovieDomain();
    movieDomain.uploadMovieVideo(req, res);
  }
}

// // sort movie
// router.get("/", MovieController.sortMovie);

// get all Movie
router.get("/", MovieController.getAllMovie);

// get specific Movie by id
router.get("/:id", MovieController.getMovie);

// find and filter movie data
router.get("/sorting/movie", MovieController.findMovieBySort);

// search movie and filter results
router.get("/search/movie", MovieController.findMovieBySearch);

// verify token
router.use(verifyToken);

//verify role
router.use(checkRole);

//upload movie image 
router.post("/upload/image",MovieController.uploadMovieImage);

//upload movie video 
router.post("/upload/video",MovieController.uploadMovieVideo);


// create Movie
router.post("/", MovieController.createMovie);

// upload movie
router.post("/upload", MovieController.uploadMovie);

// update Movie
router.put("/:id", MovieController.updateMovie);

//soft delete Movie
router.put("/delete/:id", MovieController.deleteMovie);

//hard delete Movie
router.delete("/:id", MovieController.HardDeleteMovie);

module.exports = router;
