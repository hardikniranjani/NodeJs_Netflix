const express = require("express");
const UserDomain = require("../domain/user.domain");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require('../middleware/middleware');

class UserController {
  //create a new admin
  static async createAnAdmin(req, res) {
    const userDomain = new UserDomain();
    userDomain.createAnAdmin(req, res);
  }

  //signup email
  static async signUpEmail(req, res) {
    const userDomain = new UserDomain();
    userDomain.signUpEmail(req, res);
  }
  // get user by id
  static async getAnUser(req, res) {
    const userDomain = new UserDomain();
    userDomain.getAnUser(req, res);
  }

  //forgot password
  static async forgotPassword(req,res){
    const userDomain = new UserDomain();
    userDomain.forgotPasswordMail(req,res);
  }

  // get all user
  static async getAllUsers(req, res) {
    const userDomain = new UserDomain();
    userDomain.getAllUsers(req, res);
  }

  //get all soft deleted user
  static async softDeletedUsers(req, res) {
    const userDomain = new UserDomain();
    userDomain.getAllDeletedUsers(req, res);
  }

  //hard delete a user
  static async hardDeleteUser(req, res) {
    const userDomain = new UserDomain();
    userDomain.HardDeleteUser(req, res);
  }
  // create User
  static async createAnUser(req, res) {
    const userDomain = new UserDomain();
    userDomain.createAnUser(req, res);
  }

  // update user
  static async updateAnUser(req, res) {
    const userDomain = new UserDomain();
    userDomain.updateAnUser(req, res);
  }

  // delete user
  static async deleteUser(req, res) {
    const userDomain = new UserDomain();
    userDomain.deleteAnUser(req, res);
  }

  //get user watch history
  static async getWatchHistory(req, res) {
    const userDomain = new UserDomain();
    userDomain.showWatchHistory(req, res);
  }

  //add to user watch history movie
  static async addToWatchHistory(req, res) {
    const userDomain = new UserDomain();
    userDomain.addToWatchHistory(req, res);
  }

  //delete user watch history
  static async deleteHistory(req, res) {
    const userDomain = new UserDomain();
    userDomain.deleteWatchHistory(req, res);
  }

  //add to watch later
  static async addToWatchLater(req, res) {
    const userDomain = new UserDomain();
    userDomain.addToWatchLater(req, res);
  }

  //get user watch later list
  static async getWatchLaterList(req, res) {
    const userDomain = new UserDomain();
    userDomain.showWatchLater(req, res);
  }

  static async deleteWatchLater(req, res) {
    const userDomain = new UserDomain();
    userDomain.deleteWatchLater(req, res);
  }
  // add wishlist of user
  static async addToWishList(req, res) {
    const userDomain = new UserDomain();
    userDomain.addToWishList(req, res);
  }

  // show wishlist of user
  static async getWishList(req, res) {
    const userDomain = new UserDomain();
    userDomain.getWishList(req, res);
  }

  // delete wishlist of user
  static async deleteWishlist(req, res) {
    const userDomain = new UserDomain();
    userDomain.removeFromWishlist(req, res);
  }

  //remove from wishlist
  static async removeonewishlist(req, res) {
    const userDomain = new UserDomain();
    userDomain.removeOneWishList(req, res);
  }

  // add subscription of user
  static async addSubscription(req, res) {
    const userDomain = new UserDomain();
    userDomain.addSubscription(req, res);
  }

  //change Password
  static async changePassword(req,res){
    const userDomain = new UserDomain();
    userDomain.changePassword(req,res);
  }

  // add subscription of user
  static async removeFromHistory(req, res) {
    const userDomain = new UserDomain();
    userDomain.removeFromHistory(req, res);
  }

  static async remove_watch_later(req, res) {
    const userDomain = new UserDomain();
    userDomain.remove_watch_later(req, res);
  }

  static async createOrder(req,res){
    const userDomain = new UserDomain();
    userDomain.createOrder(req,res);
  }

  static async removeCommon(req, res) {
    const userDomain = new UserDomain();
    userDomain.removeCommon(req, res);
  }
}




// login user
router.post("/login", UserController.getAnUser);

router.post("/signupEmail", UserController.signUpEmail);

router.post("/forgotPassword", UserController.forgotPassword);

// signup admin
router.post("/create_admin", UserController.createAnAdmin);

// middleware 
router.use(verifyToken);

//changePassword 
router.post("/changePassword", UserController.changePassword);

//create order for subscription
router.post('/order',UserController.createOrder);

// create User
router.post("/signup", UserController.createAnUser);

// update user
router.put("/update", UserController.updateAnUser);

//soft delete user
router.put("/delete", UserController.deleteUser);

//get user watch history
router.get("/watch_history", UserController.getWatchHistory);

//add to user watch history movie
router.post("/watch_history", UserController.addToWatchHistory);

//remove selected history
router.put("/removeonehistory",UserController.removeFromHistory);

//delete user watch history
router.delete("/delete_history", UserController.deleteHistory);

//add to watch later library
router.post("/watch_later", UserController.addToWatchLater);

router.put("/remove_watch_later", UserController.remove_watch_later);

//get user watch later list
router.get("/watch_later", UserController.getWatchLaterList);

//remove from watchlater
router.delete("/remove", UserController.deleteWatchLater);

//add to wishlist
router.post("/wishlist", UserController.addToWishList);

//get wishlist 
router.get("/wishlist", UserController.getWishList);

//delete wishlist
router.delete("/wishlist", UserController.deleteWishlist);

//remove from wishlist
router.put("/removefromwishlist" , UserController.removeonewishlist)

// add subscription plan of user
router.post("/addsubscription", UserController.addSubscription);

// verify role
// router.use(checkRole);

// get all users 
router.get('/getallusers', UserController.getAllUsers);

//get all soft deleted users
router.get('/softdeleteduser', UserController.softDeletedUsers);

//delete a user permanently
router.delete('/deleteuser/:id',UserController.hardDeleteUser);

module.exports = router;
