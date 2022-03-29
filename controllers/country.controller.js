const express = require('express');
const CountryDomain = require('../domain/country.domain');
const router = express.Router();
const checkRole = require('../middleware/middleware');
const verifyToken = require("../middleware/auth.middleware");
class CountryController {
      // get all Country
  static async getAllCountry(req, res) {
    const countryDomain = new CountryDomain();
    countryDomain.getAllCountry(req, res);
  }

  // create bulk Country
  static async bulkwrite(req,res) {
    const countryDomain = new CountryDomain();
    countryDomain.createBulkCountry(req,res);
  }

  // get specific Country by id
  static async getCountry(req, res) {
    const countryDomain = new CountryDomain();
    countryDomain.getAnCountry(req, res);
  }

  // create Country
  static async createCountry(req, res) {
    const countryDomain = new CountryDomain();
    countryDomain.createCountry(req, res);
  }

  // update Country
  static async updateCountry(req, res) {
    const countryDomain = new CountryDomain();
    countryDomain.editAnCountry(req, res);
  }

  //soft delete Country
  static async deleteCountry(req, res) {
    const countryDomain = new CountryDomain();
    countryDomain.deleteAnCountry(req, res);
  }

  //Hard delete Country
  static async HardDeleteCountry(req, res) {
    const countryDomain = new CountryDomain();
    countryDomain.HardDeleteAnCountry(req, res);
  }
}

// get all Country
router.get("/", CountryController.getAllCountry);

// get specific Country by id
router.get("/:id", CountryController.getCountry);

//verify token
router.use(verifyToken);

//verify role
router.use(checkRole);

// create Country
router.post("/", CountryController.createCountry);

// create bulk Country
router.post("/addCountry",CountryController.bulkwrite);

// update Country
router.put("/:id", CountryController.updateCountry);

//soft delete Country
router.put("/delete/:id", CountryController.deleteCountry);

//Hard delete Country
router.delete("/:id", CountryController.HardDeleteCountry);


module.exports = router;