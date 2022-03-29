const express = require("express");
const GenreDomain = require("../domain/genre.domain");
const router = express.Router();
const checkRole = require('../middleware/middleware');
const verifyToken = require("../middleware/auth.middleware");

class GenreController {
  // get all Genre
  static async getAllGenre(req, res) {
    const genreDomain = new GenreDomain();
    genreDomain.getAllGenre(req, res);
  }

  // get specific Genre by id
  static async getGenre(req, res) {
    const genreDomain = new GenreDomain();
    genreDomain.getAnGenre(req, res);
  }

  // create Genre
  static async createGenre(req, res) {
    const genreDomain = new GenreDomain();
    genreDomain.createGenre(req, res);
  }

  // update Genre
  static async updateGenre(req, res) {
    const genreDomain = new GenreDomain();
    genreDomain.editAnGenre(req, res);
  }

  //soft delete Genre
  static async deleteGenre(req, res) {
    const genreDomain = new GenreDomain();
    genreDomain.deleteAnGenre(req, res);
  }
    //Hard delete Genre
    static async HardDeleteGenre(req, res) {
      const genreDomain = new GenreDomain();
      genreDomain.HardDeleteAnGenre(req, res);
    }
}

// // verify uthantication
// router.use(verifytoken);

// get all Genre
router.get("/", GenreController.getAllGenre);

// get specific Genre by id
router.get("/:id", GenreController.getGenre);


router.use(verifyToken);
//verify role

router.use(checkRole);

// create Genre
router.post("/", GenreController.createGenre);

// update Genre
router.put("/:id", GenreController.updateGenre);

//soft delete Genre
router.put("/delete/:id", GenreController.deleteGenre);

//Hard delete Genre
router.delete("/:id", GenreController.HardDeleteGenre);

module.exports = router;
