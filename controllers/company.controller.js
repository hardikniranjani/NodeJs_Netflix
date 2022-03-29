const express = require("express");
const CompanyDomain = require("../domain/company.domain");
const router = express.Router();
const checkRole = require('../middleware/middleware');
const verifyToken = require("../middleware/auth.middleware");

class CompanyController {
  // get all Company
  static async getAllCompany(req, res) {
    const companyDomain = new CompanyDomain();
    companyDomain.getAllCompany(req, res);
  }

  // get specific Company by id
  static async getCompany(req, res) {
    const companyDomain = new CompanyDomain();
    companyDomain.getAnCompany(req, res);
  }

  // create Company
  static async createCompany(req, res) {
    const companyDomain = new CompanyDomain();
    companyDomain.createAnCompany(req, res);
  }

  // update Company
  static async updateCompany(req, res) {
    const companyDomain = new CompanyDomain();
    companyDomain.editAnCompany(req, res);
  }

  //soft delete Company
  static async deleteCompany(req, res) {
    const companyDomain = new CompanyDomain();
    companyDomain.deleteAnCompany(req, res);
  }
  //Hard delete Company
  static async HardDeleteCompany(req, res) {
    const companyDomain = new CompanyDomain();
    companyDomain.HardDeleteAnCompany(req, res);
  }
}


// get all Company
router.get("/", CompanyController.getAllCompany);

// get specific Company by id
router.get("/:id", CompanyController.getCompany);

//verify token
router.use(verifyToken);

//verify role 
router.use(checkRole);

// create Company
router.post("/", CompanyController.createCompany);

// update Company
router.put("/:id", CompanyController.updateCompany);

//soft delete Company
router.put("/delete/:id", CompanyController.deleteCompany);

//Hard delete Company
router.delete("/:id", CompanyController.HardDeleteCompany);

module.exports = router;

