const express = require("express");
const EpisodeDomain = require("../../domain/Series/episode.domain");
const router = express.Router();
const verifyToken = require("../../middleware/auth.middleware");
const checkRole = require("../../middleware/middleware");

class EpisodeController {
  // get specific  episode by id
  static async getEpisode(req, res) {
    const episodeDomain = new EpisodeDomain();
    episodeDomain.getAnEpisode(req, res);
  }

  
  // create episode
  static async createEpisode(req, res) {
    const episodeDomain = new EpisodeDomain();
    episodeDomain.createAnEpisode(req, res);
  }

  // create Multiple episode
  static async createMultiEpisode(req, res) {
    const episodeDomain = new EpisodeDomain();
    episodeDomain.createBulkEpisode(req, res);
  }

  // update episode
  static async updateEpisode(req, res) {
    const episodeDomain = new EpisodeDomain();
    episodeDomain.updateAnEpisode(req, res);
  }

  // update bulk episode
  static async updateBulkEpisode(req, res) {
    const episodeDomain = new EpisodeDomain();
    episodeDomain.updateBulkEpisode(req, res);
  }

  // soft bulk delete episode
  static async softDeleteBulkEpisode(req, res) {
    const episodeDomain = new EpisodeDomain();
    episodeDomain.deleteBulkEpisode(req, res);
  }

  // hard delete episode
  static async hardDeleteBulkEpisode(req, res) {
    const episodeDomain = new EpisodeDomain();
    episodeDomain.hardDeleteBulkEpisode(req, res);
  }

  // find and filter series data
  static async findEpisodeAndSort(req, res) {
    const episodeDomain = new EpisodeDomain();
    episodeDomain.findEpisodeAndSort(req, res);
  }

  // search series
  static async findEpisodeBySearch(req, res) {
    const episodeDomain = new EpisodeDomain();
    episodeDomain.findEpisodeBySearch(req, res);
  }

  //upload episode
  static async uploadEpisode(req, res) {
    const episodeDomain = new EpisodeDomain();
    episodeDomain.uploadEpisode(req, res);
  }

  //upload episode image
  static async uploadEpisodeImage(req, res) {
    const episodeDomain = new EpisodeDomain();
    episodeDomain.uploadEpisodeImage(req, res);
  }

  //upload episode video
  static async uploadEpisodeVideo(req, res) {
    const episodeDomain = new EpisodeDomain();
    episodeDomain.uploadEpisodeVideo(req, res);
  }
}

// get specific Series by id
router.get("/", EpisodeController.getEpisode);

// find and filter episode data
router.get("/sort", EpisodeController.findEpisodeAndSort);

// search episode
router.get("/search", EpisodeController.findEpisodeBySearch);


router.use(verifyToken);

//verify role
router.use(checkRole);  

//upload episode image
router.post('/upload/image' , EpisodeController.uploadEpisodeImage);

//upload episode image
router.post('/upload/video' , EpisodeController.uploadEpisodeVideo  );


// create episode
router.post("/", EpisodeController.createEpisode);

//upload episode
router.post("/upload", EpisodeController.uploadEpisode);

// create Multiple episode
router.post("/multiepisode", EpisodeController.createMultiEpisode);

//soft bulk delete episode
router.put("/bulk_soft_delete", EpisodeController.softDeleteBulkEpisode);

//hard bulk delete episode
router.delete("/bulk_hard_delete", EpisodeController.hardDeleteBulkEpisode);

// update episode
router.put("/update", EpisodeController.updateEpisode);

//bulk update episode
router.put("/bulk_update", EpisodeController.updateBulkEpisode);

module.exports = router;
