const SpokenLanguage = require("../models/spokenLanguage.model");


class SpokenLanguageDomain {
  // create SpokenLanguage

  async createAnSpokenLanguage(req, res) {
    var data = req.body;

    const result = await SpokenLanguage.findById({ _id: data._id });

    if (result)
      return res
        .status(500)
        .send({ msg: `This SpokenLanguage id ${data._id} already exists` });

    let spokenLanguage = new SpokenLanguage({
      ...data,
    });

    const NewSpokenLanguage = await spokenLanguage.save();

    if (!NewSpokenLanguage)
      return res.status(500).send({ msg: `Can't create SpokenLanguage` });
    res.status(200).send(NewSpokenLanguage);
  }

  // get all SpokenLanguage
  async getAllSpokenLanguage(req, res) {
    var data = await SpokenLanguage.find({ IsActive: true });

    if (data.length <= 0)
      return res.status(500).send({ msg: `SpokenLanguage not found` });
    res.status(200).send({ languages : data });
  }

  // get specific SpokenLanguage by id
  async getAnSpokenLanguage(req, res) {
    var id = req.params.id;

    const result = await SpokenLanguage.findById(id);

    if (!result || !result.IsActive)
      return res.status(500).send({ msg: `SpokenLanguage not found` });
    res.status(200).send(result);
  }

  // Soft delete SpokenLanguage by id
  async deleteAnSpokenLanguage(req, res) {
    var id = req.params.id;
    const spokenLanguage = await SpokenLanguage.findById(id);

    if (!spokenLanguage)
      return res.status(500).send({ msg: `SpokenLanguage not found` });

    const result = await SpokenLanguage.findByIdAndUpdate(
      id,
      {
        $set: {
          IsActive: false,
        },
      },
      { new: true }
    );


    if (!result)
      return res.status(500).send({ msg: `Can't delete SpokenLanguage` });
    res.status(200).send("Successfully deleted");
  }

  // Hard delete SpokenLanguage by id
  async HardDeleteAnSpokenLanguage(req, res) {
    var id = req.params.id;

    const result = await SpokenLanguage.findByIdAndDelete(id);

    if (!result)
      return res.status(500).send({ msg: `SpokenLanguage not found` });
    res.status(200).send("Hard delete Successfully");
  }

  //  Edit SpokenLanguage

  async editAnSpokenLanguage(req, res) {
    var data = req.body;
    var id = req.params.id;

    const spokenLanguage = await SpokenLanguage.findById(id);

    if (!spokenLanguage)
      return res.status(500).send({ msg: `SpokenLanguage not found` });
    const UpdateSpokenLanguage = await SpokenLanguage.findByIdAndUpdate(
      id,
      {
        $set: { ...data },
      },
      { new: true }
    );

    if (!UpdateSpokenLanguage)
      return res.status(500).send({ msg: `Can't update SpokenLanguage` });
    res.status(200).send(UpdateSpokenLanguage);
  }
}

module.exports = SpokenLanguageDomain;
