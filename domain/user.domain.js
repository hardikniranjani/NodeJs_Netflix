require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserModel, userValidation } = require("../models/Users/user.model");
const watchHistory = require("../models/Users/watchHistory.model");
const watchLater = require("../models/Users/watchLater.model");
const wishlist = require("../models/Users/wishlist.model");
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");
const SubscriptionModel = require("../models/subscription.model");
const shortid = require("shortid");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

class UserDomain {
  //encrypt password
  async encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return { password: await bcrypt.hash(password, salt) };
  }

  //Generate a token
  async generateToken(payload, expiryTime) {
    const token = jwt.sign({ ...payload }, process.env.ACCESS_TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: expiryTime,
    });
    return { token: token };
  }

  async sendMail(email, subject, htmlMessage, res, msg) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
      from: process.env.GMAIL_USER,
    });

    let mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: subject,
      html: htmlMessage,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        res.status(500).send({ err: err.message });
      } else {
        res.status(200).send({ msg: msg });
      }
    });
  }

  // create Admin
  async createAnAdmin(req, res) {
    const admin = req.body;
    const { error } = userValidation(admin);
    if (error) return res.status(500).send(error.details[0].message);

    const findAdmin = await UserModel.findOne({ Email: admin.email });

    if (findAdmin)
      return res.status(400).send({ msg: "User already registered" });

    const allUser = await UserModel.find().sort({ _id: -1 });

    let id = 1;

    if (allUser.length == 0) {
      id = 1;
    } else {
      id = allUser[0]._id + 1;
    }

    const newPassword = (await this.encryptPassword(admin.password)).password;

    let newAdmin = new UserModel({
      _id: id,
      Name: admin.name,
      Email: admin.email,
      Password: newPassword,
      Role: "admin",
    });

    try {
      const result = await newAdmin.save();
      const token = (
        await this.generateToken({ _id: newAdmin._id, role: "admin" }, "7200m")
      ).token;
      res.header("x-access-token", token).send(result);
    } catch (e) {
      res.send(e.message);
    }
  }

  async signUpEmail(req, res) {
    const email = req.body.email;

    const findUser = await UserModel.findOne({ Email: email });

    if (findUser) return res.status(400).send("User already registered");

    const token = (await this.generateToken({ Email: email }, "15m")).token;

    let baseLink = "http://localhost:8080";
    let link = `${baseLink}/signup/${token}`;

    let subject = "Ottplatform Account signup";
    let htmlMessage = `<p>Hey, We have received a request to sing up on <a href=${baseLink}>ottplatform.com</a>, so if you have requested that, then please <a href=${link}>click here</a> to verify account</p>`;
    let msg = "We have sent you a Email to Verify account.";
    this.sendMail(email, subject, htmlMessage, res, msg);
  }

  //forgot password email
  async forgotPasswordMail(req, res) {
    const email = req.body.email;
    const findUser = await UserModel.findOne({ Email: email, IsActive: true });

    if (!findUser) return res.status(404).send({ msg: "User not found!!!" });

    const token = (await this.generateToken({ Email: email }, "15m")).token;

    let baseLink = "http://localhost:8080";
    const link = `${baseLink}/setpassword/${token}`;

    let subject = `Reset Your OttPlatform Password`;

    let htmlMessage = `<p>Hey, We have received a request to Reset a password on <a href=${baseLink}>ottplatform.com</a>, so if you have requested that, then please <a href=${link}>click here</a> to Reset your password</p>`;

    let msg = "We have sent a mail to Reset your Password";
    this.sendMail(email, subject, htmlMessage, res, msg);
  }

  //change password
  async changePassword(req, res) {
    let password = req.body.password;
    let hashedPassword = (await this.encryptPassword(password)).password;
    let userEmail = req.user.Email;

    let findUser = await UserModel.findOne({
      Email: userEmail,
      IsActive: true,
    })
      .then(async (res) => {
        res.Password = hashedPassword;
        await res.save();
        return res;
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });

    res.status(200).send({
      msg: "Password Changed Successfully. Kindly do login again. You will be redirected to Login Page after 5 seconds.",
    });
  }

  // create new user, signup path
  async createAnUser(req, res) {
    const user = req.body;
    const { error } = userValidation(user);
    if (error) return res.status(500).send(error.details[0].message);

    const findUser = await UserModel.findOne({ Email: user.email });

    if (findUser) return res.status(400).send("User already registered");

    const allUser = await UserModel.find().sort({ _id: -1 });

    let id = 1;

    if (allUser.length == 0) {
      id = 1;
    } else {
      id = allUser[0]._id + 1;
    }

    const newPassword = (await this.encryptPassword(user.password)).password;

    let newUser = new UserModel({
      _id: id,
      Name: user.name,
      Email: user.email,
      Password: newPassword,
    });

    try {
      const result = await newUser.save();

      const token = (await this.generateToken({_id: newUser._id,role: "user",},"7200m")).token;
      res.header("x-access-token", token).send(result);
    } catch (e) {
      res.send(e.message);
    }
  }

  //get user ,login path
  async getAnUser(req, res) {
    const user = req.body;

    const findUser = await UserModel.findOne({
      Email: user.email,
      IsActive: true,
    })
      .populate({
        path: "watchHistory",
        populate: {
          path: "Movies",
          populate: {
            path: "_id",
            model: "Movies",
          },
        },
        populate: {
          path: "Episode",
          populate: {
            path: "_id",
            model: "episode",
            populate: {
              path: "SeriesID",
            },
          },
        },
      })
      .populate("Subscription_plan_id")
      .populate({
        path: "watchLater",
        populate: {
          path: "Movies",
          model: "Movies",
        },
        populate: {
          path: "Episode",
          model: "episode",
        },
      })
      .populate({
        path: "wishlist",
        populate: {
          path: "Movies",
          model: "Movies",
        },
        populate: {
          path: "Series",
          model: "series",
        },
      });

    if (findUser && findUser.IsActive) {
      if (bcrypt.compareSync(user.password, findUser.Password)) {
        const token = (
          await this.generateToken(
            { _id: findUser._id, role: findUser.Role },
            "7200m"
          )
        ).token;

        res.header("x-access-token", token).send(findUser);
      } else {
        res.status(400).send({ msg: "Invalid Email Or Password!!!" });
      }
    } else {
      res.status(404).send({ msg: "Can't find User" });
    }
  }

  // update an user
  async updateAnUser(req, res) {
    const user = req.body;
    const user_id = req.user._id;

    const { error } = userValidation(user);
    if (error) return res.status(400).send(error.details[0].message);

    const findUser = await UserModel.findById(user_id);

    if (!findUser.IsActive) {
      res.status(501).send({ msg: "User not found" });
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: user_id },
      {
        $set: {
          Name: user.name,
          Email: user.email,
        },
      },
      { new: true }
    )
      .populate({
        path: "watchHistory",
        populate: {
          path: "Movies",
          model: "Movies",
        },
        populate: {
          path: "Episode",
          model: "episode",
        },
      })
      .populate("Subscription_plan_id")
      .populate({
        path: "watchLater",
        populate: {
          path: "Movies",
          model: "Movies",
        },
        populate: {
          path: "Episode",
          model: "episode",
        },
      })
      .populate({
        path: "wishlist",
        populate: {
          path: "Movies",
          model: "Movies",
        },
        populate: {
          path: "Series",
          model: "series",
        },
      });

    try {
      const result = await updatedUser.save();
      res.send(result);
    } catch (err) {
      res.send(err);
    }
  }

  // soft delete of user
  // delete user by id
  async deleteAnUser(req, res) {
    let id = req.user._id;

    const result = await UserModel.findById(id);

    if (!result.IsActive) {
      res.status(501).send("User not found");
      return;
    }

    if (result) {
      await UserModel.findByIdAndUpdate(id, {
        $set: {
          IsActive: false,
        },
      });
      await watchHistory.findOneAndUpdate(
        { User: id },
        {
          $set: {
            IsActive: false,
          },
        }
      );

      await watchLater.findOneAndUpdate(
        { User: id },
        {
          $set: {
            IsActive: false,
          },
        }
      );
      await wishlist.findOneAndUpdate(
        { UserId: id },
        {
          $set: {
            IsActive: false,
          },
        }
      );

      res.send({ msg: "Successfully deleted" });
    } else {
      res.status(404).send({ msg: "Can't find User" });
    }
  }

  // soft delete of user by admin side
  // delete user by id
  async deleteAnUserByAdmin(req, res) {
    let id = req.params.id;

    const result = await UserModel.findById(id);

    if (result && result.IsActive) {
      await UserModel.findByIdAndUpdate(id, {
        $set: {
          IsActive: false,
        },
      });
      res.send("Successfully deleted");
    } else {
      res.status(404).send("Can't find User");
    }
  }

  // get all users
  async getAllUsers(req, res) {
    const result = await UserModel.find({ IsActive: true, Role:"user" });

    if (result) res.status(200).send({ allUser: result });
    else res.status(404).send("Can't find User");
  }

  // get all deleted users

  async getAllDeletedUsers(req, res) {
    const result = await UserModel.find({ IsActive: false });

    if (result) res.status(200).send(result);
    else res.status(404).send("Can't find User");
  }

  // ger user by Id

  // Hard Delete user by id
  async HardDeleteUser(req, res) {
    let id = req.params.id;

    const result = await UserModel.findOne({ _id: id, IsActive: false });
    if (!result) return res.status(404).send({ msg: "Can't find User" });
    const deleteUser = await UserModel.deleteOne({ _id: id });
    if (deleteUser) {
      res.send({ msg: "Successfully deleted" });
    } else {
      res.status(404).send({ msg: "Can't find User" });
    }
  }

  //   show watch History of user
  async showWatchHistory(req, res) {
    let User_id = req.user._id;

    const history = await watchHistory
      .find({ User: User_id, IsActive: true })
      .populate({
        path: "Movies",
        populate: {
          path: "_id",
          model: "Movies",
        },
      })
      .populate({
        path: "Episode",
        populate: {
          path: "_id",
          model: "episode",
          populate: {
            path: "SeriesID",
          },
        },
      })
      .populate({
        path: "Episode",
        populate: { path: "SeasonID" },
      })
      .sort();

    if (history.length == 0)
      return res.status(404).send({ msg: "History not available" });

    const movieArray = history[0]["Movies"].map((obj) => {
      if (obj.MovieName) {
        return {
          movie_name: obj.MovieName,
          WatchHistory_id: obj._id,
          _id: obj._id,
          Banner: obj.Banner,
          backdrop_path: obj.backdrop_path,
        };
      }
    });

    const episodeArray = history[0]["Episode"].map((obj) => {
      if (obj.EpisodeName) {
        return {
          episode_name: obj.EpisodeName,
          _id: obj._id,
          WatchHistory_id: obj._id,
          seriesid: obj.SeriesID._id,
          seriesName: obj.SeriesID.SeriesName,
          seasonid: obj.SeasonID._id,
          seasonName: obj.SeasonID.SeasonName,
          Banner: obj.Banner,
        };
      }
    });

    res.status(200).send({
      history,
    });
  }

  //add Movie to watch History of user
  async addToWatchHistory(req, res) {
    let User_id = req.user._id;
    let media_id = Number(req.query.media_id);
    let media_type = req.query.media_type;
    let duration = req.query.media_duartion;

    const history = await watchHistory.find({ User: User_id, IsActive: true });

    if (history.length == 0) {
      const myHistory = new watchHistory({
        User: User_id,
        [media_type]: {
          _id: media_id,
          duration: duration,
        },
      });
      try {
        const result = await myHistory.save();

        await UserModel.findOneAndUpdate(
          { _id: User_id },
          { watchHistory: result._id.toString() }
        );
        res.status(200).send({ History: result });
      } catch (e) {
        res.status(500).send("error in line 260 " + e);
      }
    } else {
      let index = history[0][media_type].findIndex(
        (obj) => obj._id == media_id
      );

      if (index == -1) {
        let newList = await watchHistory.findOneAndUpdate(
          { User: User_id },
          {
            $addToSet: {
              [media_type]: {
                _id: media_id,
                duration: duration,
              },
            },
          },
          { new: true }
        );
        try {
          const result = await newList.save();

          res.status(200).send({ History: result });
        } catch (e) {
          res.status(500).send("error in line 271 " + e);
        }
      } else {
        let updatedList = await watchHistory
          .findOne({ User: User_id })
          .then((res) => {
            let past_Duration = res[media_type][index]["duration"];
            
            let final_duration =
              past_Duration > duration ? past_Duration : duration;
            res[media_type][index]["duration"] = final_duration;

            return res;
          });

        try {
          const result = await updatedList.save();

          res.status(200).send({ History: result });
        } catch (e) {
          res.status(500).send("error in line 271 " + e);
        }
      }
    }
  }

  // delete watch history of user
  async deleteWatchHistory(req, res) {
    let User_id = req.user._id;

    const history = await watchHistory.find({ User: User_id });

    if (history.length == 0) {
      res.status(200).send({ msg: "Nothing to delete!!!" });
    } else {
      const deletedHistory = await watchHistory.findOneAndDelete({
        User: User_id,
      });
      res
        .status(200)
        .send({ msg: "Your History has been Successfully deleted!!!" });
    }
  }

  //remove particular media
  async removeFromHistory(req, res) {
    let User_id = req.user._id;
    let media_id = req.query.media_id;
    let media_type = req.query.media_type;
    const list = await watchHistory.find({ User: User_id, IsActive: true });

    if (list.length == 0) {
      res.status(200).send({ msg: "No list is there." });
    } else {
      const deletedlist = await watchHistory.findOneAndUpdate(
        { User: User_id },
        {
          $pull: {
            [media_type]: {
              _id: media_id,
            },
          },
        },
        { new: true }
      );
      res.status(200).send({
        list: deletedlist,
      });
    }
  }

  // add to watch history of user
  async addToWatchLater(req, res) {
    let User_id = req.user._id;
    let media_id = req.query.media_id;
    let media_type = req.query.media_type;

    const library = await watchLater.find({ User: User_id, IsActive: true });

    if (library.length == 0) {
      const newlibrary = new watchLater({
        User: User_id,
        [media_type]: media_id,
      });
      try {
        const result = await newlibrary.save();
        await UserModel.findOneAndUpdate(
          { _id: User_id },
          {
            watchLater: result._id.toString(),
          }
        );
        res.status(200).send({ Library: result });
      } catch (e) {
        res.status(500).send("error in line 260 " + e);
      }
    } else {
      const updatedLibrary = await watchLater.findOneAndUpdate(
        { User: User_id },
        { $addToSet: { [media_type]: media_id } },
        { new: true }
      );
      try {
        const result = await updatedLibrary.save();

        res.status(200).send({ updatedLibrary: result });
      } catch (e) {
        res.status(500).send("error in line 271 " + e);
      }
    }
  }

  //remove particular episode or movie from watchlater
  async remove_watch_later(req, res) {
    let User_id = req.user._id;
    let media_id = req.query.media_id;
    let media_type = req.query.media_type;
    const list = await watchLater.find({ User: User_id, IsActive: true });
    if (list.length == 0) {
      res.status(200).send({ msg: "No list is there." });
    } else {
      const deletedlist = await watchLater.findOneAndUpdate(
        { User: User_id },
        {
          $pull: {
            [media_type]: media_id,
          },
        },
        { new: true }
      );
      res.status(200).send({
        list: deletedlist,
      });
    }
  }

  //delete watch later list
  async deleteWatchLater(req, res) {
    let User_id = req.user._id;

    const list = await watchLater.find({ User: User_id });

    if (list.length == 0) {
      res.status(200).send({ msg: "Nothing to delete!!!" });
    } else {
      const deletedlist = await watchLater.findOneAndDelete({
        User: User_id,
      });
      res
        .status(200)
        .send({ msg: "Your watch later has been Successfully deleted!!!" });
    }
  }

  // show watch history of user
  async showWatchLater(req, res) {
    let User_id = req.user._id;

    const watchLaterList = await watchLater
      .find({ User: User_id, IsActive: true })
      .populate("Movies")
      .populate({
        path: "Episode",
        populate: { path: "SeriesID" },
      })
      .populate({
        path: "Episode",
        populate: { path: "SeasonID" },
      })
      .sort();

    if (watchLaterList.length == 0)
      return res.status(404).send({ msg: "List is empty!!!" });

    const movieArray = watchLaterList[0]["Movies"].map((obj) => {
      if (obj.MovieName) {
        return {
          movie_name: obj.MovieName,
          _id: obj._id,
          WatchLater_id: obj._id,
          Banner: obj.Banner,
          backdrop_path: obj.backdrop_path,
        };
      }
    });

    const episodeArray = watchLaterList[0]["Episode"].map((obj) => {
      if (obj.EpisodeName) {
        return {
          episode_name: obj.EpisodeName,
          _id: obj._id,
          WatchLater_id: obj._id,
          seriesid: obj.SeriesID._id,
          seriesName: obj.SeriesID.SeriesName,
          seasonid: obj.SeasonID._id,
          seasonName: obj.SeasonID.SeasonName,
          Banner: obj.Banner,
        };
      }
    });

    res.status(200).send({
      movies: movieArray,
      episodes: episodeArray,
    });
  }

  // add ro wishlist of user
  async addToWishList(req, res) {
    const User_id = req.user._id;
    const media_id = req.query.media_id;
    const media_type = req.query.media_type;

    const findWishList = await wishlist.find({ UserId: User_id });

    if (findWishList.length == 0) {
      const list = new wishlist({
        UserId: User_id,
        [media_type]: media_id,
      });
      try {
        const result = await list.save();

        await UserModel.findOneAndUpdate(
          { _id: User_id },
          {
            wishlist: result._id.toString(),
          }
        );
        res.status(200).send({ wishlist: result });
      } catch (e) {
        res.status(500).send({ msg: `error : ${e.message}` });
      }
    } else {
      const updateWishlist = await wishlist.findOneAndUpdate(
        { UserId: User_id },
        { $addToSet: { [media_type]: media_id } },
        { new: true }
      );

      try {
        const result = await updateWishlist.save();
        res.status(200).send({ wishlist: result });
      } catch (e) {
        res.status(500).send({ msg: `err : ${e.message}` });
      }
    }
  }

  // show wishlist of user
  async getWishList(req, res) {
    const user_id = req.user._id;

    const findWishList = await wishlist
      .find({ UserId: user_id })
      .populate("Series")
      .populate("Movies");

    if (findWishList.length == 0)
      return res
        .status(200)
        .send({ _id: findWishList[0]._id, series: [], movies: [] });

    const seriesArray = findWishList[0].Series.map((obj) => {
      if (obj.IsActive == true) {
        return {
          _id: obj._id,
          WishList_id: obj._id,
          series_name: obj.SeriesName,
          description: obj.ShortDescription,
          releasedata: obj.ReleaseDate,
          Banner: obj.Banner,
          backdrop_path: obj.backdrop_path,
        };
      }
    });

    const movieArray = findWishList[0].Movies.map((obj) => {
      if (obj.IsActive == true) {
        return {
          _id: obj._id,
          WishList_id: obj._id,
          movie_name: obj.MovieName,
          description: obj.ShortDescription,
          releasedata: obj.ReleaseDate,
          Banner: obj.Banner,
          backdrop_path: obj.backdrop_path,
        };
      }
    });

    res.status(200).send({
      _id: findWishList[0]._id,
      series: seriesArray,
      movies: movieArray,
    });
  }

  // remove wishlist of user
  async removeFromWishlist(req, res) {
    const user_id = req.user._id;
    const findUser = await wishlist.find({ UserId: user_id });

    if (findUser.length == 0) {
      res.status(404).send({ msg: "Empty wishlist!!!" });
    } else {
      await wishlist.findOneAndDelete({
        UserId: user_id,
      });

      res.status(200).send({ msg: "Your wishlist deleted successfully." });
    }
  }

  async removeOneWishList(req, res) {
    let User_id = req.user._id;
    let media_id = req.query.media_id;
    let media_type = req.query.media_type;
    const list = await wishlist.find({ UserId: User_id });

    if (list.length == 0) {
      res.status(200).send({ msg: "No list is there." });
    } else {
      const deletedlist = await wishlist.findOneAndUpdate(
        { UserId: User_id },
        {
          $pull: {
            [media_type]: media_id,
          },
        },
        {
          new: true,
        }
      );
      res.status(200).send({ list: deletedlist });
    }
  }

  async createOrder(req, res) {
    var order = await razorpay.orders.create({
      amount: req.query.amount,
      currency: process.env.RAZORPAY_DEFAULT_CURRENCY,
      receipt: `Receipt-${shortid.generate()}`,
    });

    res.status(200).send({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  }

  // add subscription on user id
  async addSubscription(req, res) {
    const user_id = req.user._id;
    const plan_id = Number(req.query.plan_id);
    const data = req.body.data;

    const getPlan = await SubscriptionModel.findById(plan_id);

    if (!getPlan)
      return res.status(404).send({ msg: `Plan id ${plan_id} not found` });

    const findUser = await UserModel.findById(user_id);

    if (!findUser)
      return res
        .status(404)
        .send({ msg: "Can't find user. Please login again" });
    let date = new Date();
    let purchase_date = new Date().valueOf();
    let expiry_date = new Date().setDate(date.getDate() + 29);

    // console.log(expiry_date,purchase_date, "expiry_date");
    // console.log(new Date(purchase_date).toString()," by toString method");
    // Tue Feb 01 2022 17:27:06 GMT+0530 (India Standard Time) by toString method
    // console.log(new Date(expiry_date).toLocaleString(),"by toLocaleString method");
    // 2/3/2022, 5:36:19 pm by toLocaleString method
    const addplanToUser = await UserModel.findByIdAndUpdate(
      { _id: user_id },
      {
        $set: {
          Subscription_plan_id: plan_id,
          Plan_Purchase_Date_Time: purchase_date,
          Plan_Expiry_Date_Time: expiry_date,
          Payment_ID: data.razorpay_payment_id,
          Order_ID: data.razorpay_order_id,
        },
      },
      { new: true }
    ).populate("Subscription_plan_id");
    res.status(200).send(addplanToUser);
  }
}

module.exports = UserDomain;
