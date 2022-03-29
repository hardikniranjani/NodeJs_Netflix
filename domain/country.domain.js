const Country = require("../models/country.model");

class CountryDomain {
  // create bulk Country
  async createBulkCountry(req, res) {
    var countryData = req.body;
    Country.insertMany(countryData, (err, docs) => {
      if (err) return res.status(400).send("error while inserting many documents " + err);
      res.status(200).send(docs);
    });
  }

  // create Country
  async createCountry(req, res) {
    var data = req.body;

    const findCountry = await Country.findOne({
      CountryName: data.CountryName,
    });

    if (findCountry)
      return res.status(400).send({ msg: "Country Name already available!!" });

    let allCountries = await Country.find().sort({ _id: -1 });
    let id = allCountries.length == 0 ? 1 : allCountries[0]._id + 1;
    let country = new Country({
      _id: id,
      CountryName: data.CountryName,
      CountryShortForm: data.CountryShortForm,
      CountryCode: data.CountryCode,
    });

    try {
      const NewCountry = await country.save();
      
      if (NewCountry) {
        res.status(200).send(NewCountry);
      } else {
        res.send("can't create country");
      }
    } catch (e) {
      res.status(500).send(e);
    }
  }

  // get all country
  async getAllCountry(req, res) {
    var data = await Country.find({ IsActive: true });

    if (data.length > 0) {
      res.send(data);
    } else {
      res.send("No country found");
    }
  }

  // get specific country by id
  async getAnCountry(req, res) {
    var id = req.params.id;

    const result = await Country.findById(id);

    if (result) {
      res.send(result);
    } else {
      res.send("No country found");
    }
  }

  // Soft delete Country by id
  async deleteAnCountry(req, res) {
    var id = req.params.id;
    const country = await Country.findById(id);
    if (country) {
      const result = await Country.findByIdAndUpdate(
        id,
        {
          $set: {
            IsActive: false,
          },
        },
        { new: true }
      );

      if (result) {
        res.send("Successfully deleted");
      } else {
        res.status(404).send("Country not found");
      }
    } else {
      res.status(404).send("Country not found");
    }
  }

  // Hard delete Country by id
  async HardDeleteAnCountry(req, res) {
    var id = req.params.id;

    const result = await Country.findByIdAndDelete(id);

    if (result) res.status(200).send({ msg: "Successfully deleted" });
    else res.status(404).send({ err: "Country not found" });
  }

  //  Edit Country

  async editAnCountry(req, res) {
    var data = req.body;
    var id = req.params.id;
    const country = await Country.findById(id);

    if (country) {
      const UpdateCountry = await Country.findByIdAndUpdate(
        id,
        {
          $set: { ...data },
        },
        { new: true }
      );

      if (UpdateCountry) {
        res.send(UpdateCountry);
      } else {
        res.send("Can't update Country");
      }
    } else {
      res.send("Country not found");
    }
  }
}

module.exports = CountryDomain;
