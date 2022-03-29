const Subscription = require("../models/subscription.model");

class SubscriptionDomain {
  // create Subscription

  async createAnSubscription(req, res) {
    var data = req.body;

    const result = await Subscription.findById({_id: data._id})

    if(result) return res.status(500).send({ msg: `This Subscription id ${data._id} already exists` });

    let subscription = new Subscription({
      _id: data._id,
      Monthly_price: data.Monthly_price,
      Plan_name: data.Plan_name,
      Number_of_screen_available: data.Number_of_screen_available,
      Max_video_quality: data.Max_video_quality,
      Devices: data.Devices,
      IsActive: data.IsActive,
    });

    const NewSubscription = await subscription.save();

    if (!NewSubscription)
      return res.status(500).send({ msg: `Can't create Subscription` });
    res.status(200).send(NewSubscription);
  }

  // get all Subscription
  async getAllSubscription(req, res) {
    var data = await Subscription.find({IsActive: true});

    if (data.length <= 0)
      return res.status(500).send({ msg: `Subscription not found` });
    res.status(200).send({SubscriptionPlan: data});
  }

  // get specific Subscription by id
  async getAnSubscription(req, res) {
    var id = req.params.id;

    const result = await Subscription.findById(id);

    if (!result || !result.IsActive) return res.status(500).send({ msg: `Subscription not found` });
    res.status(200).send(result);
  }

  // Soft delete Subscription by id
  async deleteAnSubscription(req, res) {
    var id = req.params.id;
    const subscription = await Subscription.findById(id);

    if (!subscription)
      return res.status(500).send({ msg: `Subscription not found` });

    const result = await Subscription.findOneAndUpdate(
    {_id:id},
      {
        $set: {
          IsActive: false,
        },
      },
      { new: true }
    );

    if (!result)
      return res.status(500).send({ msg: `Can't delete Subscription` });
    res.status(200).send("Successfully deleted");
  }

  // Hard delete Subscription by id
  
  async HardDeleteAnSubscription(req, res) {
    var id = req.params.id;

    const result = await Subscription.findByIdAndDelete(id);

    if (!result) return res.status(500).send({ msg: `Subscription not found` });
    res.status(200).send("Hard delete Successfully");
  }

  //  Edit Subscription

  async editAnSubscription(req, res) {
    var data = req.body;
    var id = req.params.id;

    const subscription = await Subscription.findById(id);

    if (!subscription)
      return res.status(500).send({ msg: `Subscription not found` });
    const UpdateSubscription = await Subscription.findByIdAndUpdate(
      id,
      {
        $set: { ...data },
      },
      { new: true }
    );

    if (!UpdateSubscription)
      return res.status(500).send({ msg: `Can't update Subscription` });
    res.status(200).send(UpdateSubscription);
  }
}

module.exports = SubscriptionDomain;
