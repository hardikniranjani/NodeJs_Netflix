const express = require("express");
const SubscriptionDomain = require("../domain/Subscription.domain");
const router = express.Router();
const checkRole = require('../middleware/middleware');
const verifyToken = require("../middleware/auth.middleware");

class SubscriptionController {
  // get all Subscription
  static async getAllSubscription(req, res) {
    const subscriptionDomain = new SubscriptionDomain();
    subscriptionDomain.getAllSubscription(req, res);
  }

  // get specific Subscription by id
  static async getSubscription(req, res) {
    const subscriptionDomain = new SubscriptionDomain();
    subscriptionDomain.getAnSubscription(req, res);
  }

  // create Subscription
  static async createSubscription(req, res) {
    const subscriptionDomain = new SubscriptionDomain();
    subscriptionDomain.createAnSubscription(req, res);
  }

  // update Subscription
  static async updateSubscription(req, res) {
    const subscriptionDomain = new SubscriptionDomain();
    subscriptionDomain.editAnSubscription(req, res);
  }

  //soft delete Subscription
  static async deleteSubscription(req, res) {
    const subscriptionDomain = new SubscriptionDomain();
    subscriptionDomain.deleteAnSubscription(req, res);
  }
  //Hard delete Subscription
  static async HardDeleteSubscription(req, res) {
    const subscriptionDomain = new SubscriptionDomain();
    subscriptionDomain.HardDeleteAnSubscription(req, res);
  }
}


// get all Subscription
router.get("/", SubscriptionController.getAllSubscription);

// get specific Subscription by id
router.get("/:id", SubscriptionController.getSubscription);

//verify token
router.use(verifyToken);

//verify role
router.get(checkRole);

// create Subscription
router.post("/", SubscriptionController.createSubscription);

// update Subscription
router.put("/:id", SubscriptionController.updateSubscription);

//soft delete Subscription
router.put("/delete/:id", SubscriptionController.deleteSubscription);

//Hard delete Subscription
router.delete("/:id", SubscriptionController.HardDeleteSubscription);

module.exports = router;