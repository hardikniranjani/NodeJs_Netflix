const express = require("express");
const CertificationDomain = require("../domain/certification.domain");
const checkRole = require('../middleware/middleware');
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
class CertificationController {
  // ++++++ For Movies +++++++ //

  // create movie Certification
  static async createMovieCertificate(req, res) {
    const certificationDomain = new CertificationDomain();
    certificationDomain.createMovieCertificate(req, res);
  }
  // get all movie Certification by country id
  static async getMovieCerificate(req, res) {
    const certificationDomain = new CertificationDomain();
    certificationDomain.getMovieCerificate(req, res);
  }

  // update movie Certification
  static async updateMovieCertificate(req, res) {
    const certificationDomain = new CertificationDomain();
    certificationDomain.updateMovieCertificate(req, res);
  }
  //soft delete movie Certification
  static async softDeleteMovieCertificate(req, res) {
    const certificationDomain = new CertificationDomain();
    certificationDomain.softDeleteMovieCertificate(req, res);
  }
  //Hard delete movie Certification
  static async hardDeleteMovieCertificate(req, res) {
    const certificationDomain = new CertificationDomain();
    certificationDomain.hardDeleteMovieCertificate(req, res);
  }

  // ++++++ For Tv(Series) +++++++ //

  // create Tv Certification
  static async createTvCertificate(req, res) {
    const certificationDomain = new CertificationDomain();
    certificationDomain.createTvCertificate(req, res);
  }
  // get specific tv Certification by country id
  static async getTvCerificate(req, res) {
    const certificationDomain = new CertificationDomain();
    certificationDomain.getTvCerificate(req, res);
  }
  // update Tv Certification
  static async updateTvCertificate(req, res) {
    const certificationDomain = new CertificationDomain();
    certificationDomain.updateTvCertificate(req, res);
  }

  //soft delete Tv Certification
  static async softDeleteTvCertificate(req, res) {
    const certificationDomain = new CertificationDomain();
    certificationDomain.softDeleteTvCertificate(req, res);
  }
  //Hard delete Tv Certification
  static async hardDeleteTvCertificate(req, res) {
    const certificationDomain = new CertificationDomain();
    certificationDomain.hardDeleteTvCertificate(req, res);
  }
}


// get all movie Certification by country id
router.get("/movie", CertificationController.getMovieCerificate);

// get all Tv Certification by country id
router.get("/tv", CertificationController.getTvCerificate);

//authentication of user
router.use(verifyToken);

//verify role
router.use(checkRole);

  // ++++++ For Movies +++++++ //

// create movie Certification
router.post("/movie", CertificationController.createMovieCertificate);

// update movie Certification
router.put("/movie/:id", CertificationController.updateMovieCertificate);

//soft delete movie Certification
router.put("/movie", CertificationController.softDeleteMovieCertificate);

//Hard delete movie Certification
router.delete("/:id/movie", CertificationController.hardDeleteMovieCertificate);

  // ++++++ For Tv(Series) +++++++ //

  // create Tv Certification
router.post("/tv", CertificationController.createTvCertificate);

// update Tv Certification
router.put("/tv", CertificationController.updateTvCertificate);

//soft delete Tv Certification
router.put("/:id/tv", CertificationController.softDeleteTvCertificate);

//Hard delete Tv Certification
router.delete("/:id/tv", CertificationController.hardDeleteTvCertificate);

module.exports = router;
