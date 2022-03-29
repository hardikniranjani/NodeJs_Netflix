const express = require("express");
const SpokenLanguageDomain = require("../domain/spokenLanguage.domain");
const router = express.Router();
const checkRole = require('../middleware/middleware')
const verifyToken = require("../middleware/auth.middleware");

class SpokenLanguageController {
  // get all SpokenLanguage
  static async getAllSpokenLanguage(req, res) {
    const spokenLanguageDomain = new SpokenLanguageDomain();
    spokenLanguageDomain.getAllSpokenLanguage(req, res);
  }

  // get specific SpokenLanguage by id
  static async getSpokenLanguage(req, res) {
    const spokenLanguageDomain = new SpokenLanguageDomain();
    spokenLanguageDomain.getAnSpokenLanguage(req, res);
  }

  // create SpokenLanguage
  static async createSpokenLanguage(req, res) {
    const spokenLanguageDomain = new SpokenLanguageDomain();
    spokenLanguageDomain.createAnSpokenLanguage(req, res);
  }

  // update SpokenLanguage
  static async updateSpokenLanguage(req, res) {
    const spokenLanguageDomain = new SpokenLanguageDomain();
    spokenLanguageDomain.editAnSpokenLanguage(req, res);
  }

  //soft delete SpokenLanguage
  static async deleteSpokenLanguage(req, res) {
    const spokenLanguageDomain = new SpokenLanguageDomain();
    spokenLanguageDomain.deleteAnSpokenLanguage(req, res);
  }
  //Hard delete SpokenLanguage
  static async HardDeleteSpokenLanguage(req, res) {
    const spokenLanguageDomain = new SpokenLanguageDomain();
    spokenLanguageDomain.HardDeleteAnSpokenLanguage(req, res);
  }
}


// get all SpokenLanguage
router.get("/", SpokenLanguageController.getAllSpokenLanguage);

// get specific SpokenLanguage by id
router.get("/:id", SpokenLanguageController.getSpokenLanguage);

//verify token
router.use(verifyToken);

//verify role and allow operation
router.use(checkRole);

// create SpokenLanguage
router.post("/", SpokenLanguageController.createSpokenLanguage);

// update SpokenLanguage
router.put("/:id", SpokenLanguageController.updateSpokenLanguage);

//soft delete SpokenLanguage
router.put("/delete/:id", SpokenLanguageController.deleteSpokenLanguage);

//Hard delete SpokenLanguage
router.delete("/:id", SpokenLanguageController.HardDeleteSpokenLanguage);

module.exports = router;
