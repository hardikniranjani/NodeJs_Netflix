const Series = require("../../models/Series/series.model");
const episode_Model = require("../../models/Series/episode.model");
const season_Model = require("../../models/Series/season.model");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
class SeriesDomain {
  // create new Series
  async createAnSeries(req, res) {
    var data = req.body;

    // let series = new Series({
    //   _id: data._id,
    //   SeriesName: data.SeriesName,
    //   Original_language: data.Original_language,
    //   Spoken_languages: data.Spoken_languages,
    //   Budget: data.Budget,
    //   ShortDescription: data.ShortDescription,
    //   Genres: data.Genres,
    //   Number_of_seasons: data.Number_of_seasons,
    //   Number_of_episodes: data.Number_of_episodes,
    //   ReleaseDate: data.ReleaseDate,
    //   Popularity: data.Popularity,
    //   Production_companies: data.Production_companies,
    //   Revenue: data.Revenue,
    //   Status: data.Status,
    //   DirectorName: data.DirectorName,
    //   Vote_average: data.Vote_average,
    //   Vote_count: data.Vote_count,
    //   LongDescription: data.LongDescription,
    //   Season: data.Season,
    //   Poster_path: data.Poster_path,
    //   IsActive: data.IsActive,
    // });

    let series = new Series({ ...data })
    const newSeries = await series.save();
    if (newSeries) {
      return res.send(newSeries);
    } else {
      return res.send("We can't create a new series");
    }
  }

  // get all series
  async getAllSeries(req, res) {
    var series_data = await Series.find({ IsActive: true })
      .populate("Spoken_languages")
      .populate("Genres")
      .populate("Production_companies")
      .populate("Seasons")
      .populate({
        path : "Seasons",
        populate : { path : 'Episodes'}
      });
    if (series_data.length > 0) {
      res.send(series_data);
    } else {
      res.send("not found");
    }
  }

  // get series by id
  async getAnSeries(req, res) {
    var id = req.params.id;

    const result = await Series.findById(id).populate("Seasons");
    if (result && result.IsActive) {
      res.send(result);
    } else {
      res.status(404).send("Can't find series");
    }
  }

  // Delete series by Id

  async deleteAnSeries(req, res) {
    var id = req.params.id;
    const result = await Series.findByIdAndUpdate(
      id,
      {
        $set: {
          IsActive: false,
        },
      },
      { new: true }
    );
    await season_Model.updateMany(
      {
        SeriesID: id,
      },
      {
        IsActive: false,
      }
    );
    await episode_Model.updateMany(
      {
        SeriesID: id,
      },
      {
        IsActive: false,
      }
    );
    if (!result) return res.status(404).send({ msg: `Series not found` });

    res.status(200).send({ msg: "Soft Deleted Successfully" });
  }

  // Hard Delete series by id
  async HardDeleteSeries(req, res) {
    var id = req.params.id;

    const result = await Series.findByIdAndDelete(id);
    if (result) {
      res.send("Successfully deleted");
    } else {
      res.status(404).send("Can't find Series");
    }
  }

  // Edit series
  async editAnSeries(req, res) {
    var data = req.body;
    const id = req.params.id;

    const series = await Series.findById(id);
    if (!series) res.send("Not Found");
    const UpdateSeries = await Series.findByIdAndUpdate(
      id,
      {
        $set: { ...data },
      },
      { new: true }
    );

    if (UpdateSeries) {
      res.send(UpdateSeries);
    } else {
      res.send("Can't update series");
    }
  }

  async uploadSeriesPoster(req, res) {
    const series_id = req.query.series_id;
    const findSeries = await Series.findById(series_id);
    const series_poster = req.files.banner;

    if (!findSeries)
      return res
        .status(404)
        .send({ msg: `can't found series with id ${series_id}` });

    if (!series_poster)
      return res.status(404).send({ msg: "Kindly Upload Poster of Image." });

    const posterType = series_poster.mimetype.split("/");

    if (posterType[0] !== "image") {
      return res
        .status(400)
        .send({ msg: `Make sure your poster must be an Image.` });
    }

    let pathForCloudinary = `OttPlatForm/Series/${
      findSeries.SeriesName
    }/posters/${new Date().valueOf()}`;

    cloudinary.uploader
      .upload(series_poster.tempFilePath, { public_id: pathForCloudinary })
      .then(async (result) => {
        const updatedSeries = await Series.findOneAndUpdate({
          _id: series_id,
        },
        {
          $set : {
            Poster_path : result.url
          }
        },
        {
          new : true
        });

        fs.unlinkSync(`${series_poster.tempFilePath}`);

        if(!updatedSeries) return res.status(400).send({msg : 'not able to upload episode'});

        res.status(200).send({ Series: updatedSeries });
      })
      .catch((err) => {
        fs.unlinkSync(`${series_poster.tempFilePath}`);
        res.status(500).send({ err : err.message});
      });
  }

  // // get all the series according to the budget
  // async GetAllSeriesByBuget(req,res){
  //   const data = req.body.Budget;
  //   const series = await Series.find().sort(`-${data}`)
  //   res.send(series);
  // }

  // // get all the series according to the Popularity
  // async GetAllSeriesByPopularity(req,res){
  //   const data = req.body.Popularity;
  //   const series = await Series.find().sort(`-${data}`)
  //   res.send(series);
  // }

  // // get all the series according to the Revenue
  // async GetAllSeriesByRevenue(req,res){
  //   const data = req.body.Revenue;
  //   const series = await Series.find().sort(`-${data}`)
  //   res.send(series);
  // }

  // find and sorting series data
  async findSeriesAndSort(req, res) {
    const queryperam = req.query.filter;
    const Ascending = req.query.ascending;

    const series = await Series.find()
      .populate("Spoken_languages")
      .populate("Genres")
      .populate("Production_companies")
      .populate("Seasons")
      .sort(queryperam);

    if (!series) return res.status(404).send({ msg: `Series not found` });

    if (Ascending == "descending")
      return res.status(200).send(series.reverse());

    return res.status(200).send(series);
  }

  // search series and filter results
  async findSeriesBySearch(req, res) {
    const queryperam = req.query.item1;
    const queryName = req.query.item;
  
    const seriesData = await Series.find({ [queryperam]: queryName })
      .populate("Spoken_languages")
      .populate("Genres")
      .populate("Production_companies")
      .populate("Seasons")
      .populate({
        path : "Seasons",
        populate : { path : 'Episodes'}
      })
      .sort(`${queryperam}`);

    if (seriesData.length <= 0) return res.status(404).send({ msg: `Series not found` });

     res.status(200).send(seriesData);
  }
}

module.exports = SeriesDomain;
